#!/usr/bin/env node

const fs = require('fs-extra');
const axios = require('axios');
const slugify = require('slugify');
const path = require('node:path');
const { YtdlCore } = require('@ybd-project/ytdl-core');
const { Command } = require('commander');
const { firefox } = require('playwright');

const program = new Command();
const ytdl = new YtdlCore();

async function getVideoIds(playlistUrl) {
    const response = await axios.get(playlistUrl);
    const videoIds = response.data.match(/"videoId":"(.*?)"/g).map(id => id.split('"')[3]);
    return [...new Set(videoIds)];
}

function titleToFilename(title) {
    return slugify(title);
}

function getFullPathFile(name, outputDirectory) {
    return path.resolve(process.cwd(), outputDirectory, `${name}.mp3`);
}

async function downloadAudioFromPlaylist(playlistUrl, outputDirectory) {
    try {
        const videoIds = await getVideoIds(playlistUrl);
        fs.ensureDirSync(outputDirectory);

        for (const videoId of videoIds) {
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
            const info = await ytdl.getFullInfo(videoUrl);
            const title = info.videoDetails.title;
            const pathFileNew = getFullPathFile(titleToFilename(title), outputDirectory);

            console.log('Start download: ', title);
            if (await fs.pathExists(pathFileNew)) {
                console.log(`Skip download ${title}`);
                continue;
            }
            console.time('downloadAndWrite');
            const browser = await firefox.launch({ headless: false });
            const page = await browser.newPage();

            await page.goto('https://www.y2mate.com');
            console.log('DEBUG: web title', await page.title());

            const inputElement = await page.$('#txt-url');
            await inputElement.fill(videoUrl);
            await (await page.$('#btn-submit')).click();
            console.log('btn-submit:search');


            await page.waitForSelector('ul#selectTab');
            await (await page.$('a.nav-link[href="#audio"]')).click();
            await page.waitForSelector('div#audio');
            console.log('nav-link:tab');

            const downloadButton = await page.waitForSelector('button[onclick*="startConvert(\'mp3\'"]', { state: 'visible' });
            await downloadButton.click();
            console.log('startConvert:click');
            const downloadLink = await page.waitForSelector('a.btn.btn-success.btn-file', { state: 'visible', timeout: 1_000_000 });
            console.log('btn-file:download');
            const href = await downloadLink.getAttribute('href');
            console.log('href', href);
            const isStream = href.startsWith('https://rr');

            if (isStream) {
                console.log('here');
                
                const page2 = await browser.newPage();
                const response = await page2.goto(href)
                const buffer = await response.body();
                
                // Save the audio file to the specified path
                fs.writeFileSync(pathFileNew, buffer);
                console.log(`Downloaded to: ${filePath}`);
                // Wait for a while to ensure the request is captured
                await page2.waitForTimeout(5000); // Adjust as necessary
                await page2.close()
            } else {
                const response = await axios({
                    url: href,
                    method: 'GET',
                    responseType: 'arraybuffer',
                });
                console.log(`fetch:ok`);
                await fs.outputFile(pathFileNew, response.data);
                console.log(`File downloaded to: ${pathFileNew}`);
            }

            console.timeEnd('downloadAndWrite');

            // Keep this line for further processing if needed
            await page.waitForTimeout(100000); // Adjust time as needed
            await page.close();
            continue;
        }
    } catch (error) {
        console.error('Error in playlist download:', error);
    }
}

program
    .version('1.0.0')
    .description('Download YouTube playlist to mp3')
    .option('-i, --input <type>', 'playlist URL')
    .option('-o, --output <type>', 'output directory')
    .action((options) => {
        if (!options.input || !options.output) {
            console.error('Error: Please provide both input and output options.');
            process.exit(1);
        }
        downloadAudioFromPlaylist(options.input, options.output).catch(console.error);
    });

program.parse(process.argv);

#!/usr/bin/env node

const fs = require('fs-extra');
const axios = require('axios');
const slugify = require('slugify');
const { getAudioById } = require('./vendor/yt-audio');
const path = require('node:path');
const { YtdlCore } = require('@ybd-project/ytdl-core');
const { Command } = require('commander');

const program = new Command();

const ytdl = new YtdlCore();

async function getVideoIds(playlistUrl) {
    const response = await axios.get(playlistUrl);
    const videoIds = response.data.match(/"videoId":"(.*?)"/g).map(id => id.split('"')[3]);
    return [...new Set(videoIds)];
}

function titleToFilename(title) {
    return slugify(title)
}

function titleToSlug(title) {
    return title
        .toLowerCase()                  // Convert to lowercase
        .trim()                         // Trim whitespace from both sides
        .replace(/[\s]+/g, '-')        // Replace spaces with dashes
        .replace(/[^\w\-]+/g, '')      // Remove all non-word chars except dashes
        .replace(/--+/g, '-')          // Replace multiple dashes with a single dash
        .replace(/^-+|-+$/g, '');      // Remove dashes from the start and end
}


function getFullPathFile(name, outputDirectory) {
    return path.resolve(process.cwd(), outputDirectory, `${name}.mp3`)
}

async function downloadAndWrite(videoId, outputDirectory) {
    console.time('downloadAndWrite')
    const { audio, buffer } = await getAudioById(videoId, {
        outputFormat: "mp3",
    });

    const filePath = getFullPathFile(titleToFilename(audio.details.title), outputDirectory);

    try {
        await fs.outputFile(filePath, buffer);
        console.log(`Downloaded ${audio.details.title}`);
    } catch (err) {
        console.error('Error saving file:', err);
    }
    console.timeEnd('downloadAndWrite')
}

async function downloadAudioFromPlaylist(playlistUrl, outputDirectory) {
    try {
        const videoIds = await getVideoIds(playlistUrl);

        fs.ensureDirSync(outputDirectory)

        for (const videoId of videoIds) {
            const info = await ytdl.getFullInfo(`https://www.youtube.com/watch?v=${videoId}`);
            console.log('Start download: ', info.videoDetails.title);
            const checkPathExist = fs.pathExistsSync(getFullPathFile(titleToFilename(info.videoDetails.title), outputDirectory)) || fs.pathExistsSync(getFullPathFile(titleToSlug(info.videoDetails.title), outputDirectory))

            if (checkPathExist) {
                console.log(`Skip download ${info.videoDetails.title}`);

                continue;
            }
            await downloadAndWrite(videoId, outputDirectory)
        }
    } catch (error) {
        console.error('Có lỗi xảy ra:', error);
    }
}

program
    .version('1.0.0')
    .description('Download youtube playlist to mp3')
    .option('-i, --input <type>', 'playlist url youtube')
    .option('-o, --output <type>', 'output dir')
    .action((options) => {
        if (!options.input || !options.output) {
            console.error('Error: please input input and output.');
            process.exit(1); // Exit the process with an error code
        } else {
            downloadAudioFromPlaylist(options.input, options.output);
        }
    });


program.parse(process.argv);



const path = require('path');
const { firefox } = require('playwright');
const axios = require('axios');
const fs = require('fs');
const slugify = require('slugify');

const downloadPath = path.join(__dirname, 'downloads'); // Adjust the path as needed


async function downloadFile(url, outputPath) {
    const writer = fs.createWriteStream(outputPath);

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

(async () => {

    // Launch a browser instance
    const browser = await firefox.launch({ headless: true }); // Set headless: false to see the browser
    const context = await browser.newContext({
        acceptDownloads: true, // Allow downloads
        downloadsPath: downloadPath, // Set the download path
    });
    await context.setGeolocation({ longitude: 105.8342, latitude: 21.0285 });
    const page = await context.newPage();

    // Navigate to the website
    const url = 'https://www.y2mate.com'; // Replace with your target URL
    await page.goto(url);
    const title = await page.title()
    console.log('title', title);

    const inputElement = await page.$('#txt-url');

    if (inputElement) {
        await inputElement.fill('https://www.youtube.com/watch?v=-WjrepVihtY'); // Replace with your desired input
        const buttonElement = await page.$('#btn-submit');

        await buttonElement.click();

        const audioTabSelector = 'a.nav-link[href="#audio"]';

        await page.waitForSelector('ul#selectTab'); // Wait for the audio tab to be available

        const navLink = await page.$(audioTabSelector);
        if (navLink) {
            await navLink.click();
            const tabAudio = await page.waitForSelector('div#audio'); // Wait for the audio tab content to be available

            // Wait for the button to appear
            const downloadButton = await page.waitForSelector('button[onclick*="startConvert(\'mp3\'"]', { state: 'visible' });

            if (downloadButton) {
                await downloadButton.click();
                const downloadLink = await page.waitForSelector('a.btn.btn-success.btn-file', { state: 'visible' }); // Adjust selector if needed
                if (downloadLink) {
                    const videoTitle = await (await page.waitForSelector('#videoTitle')).innerHTML();
                    const cleanedTitle = videoTitle.replace(/<[^>]*>/g, '').trim();
                    const href = await downloadLink.getAttribute('href');
                    
                    const targetPath = path.join(downloadPath, `${slugify(cleanedTitle, { lower: true })}.mp3`); // Set target path in downloads folder

                    downloadFile(href, targetPath)
                        .then(() => {
                            console.log('File downloaded successfully!');
                        })
                        .catch((error) => {
                            console.error('Error downloading the file:', error);
                        });
                }
            }

        }
    }

    // Optionally, wait for any further processing
    await page.waitForTimeout(10000); // Adjust time as needed


    // Close the browser
    await browser.close();
})();


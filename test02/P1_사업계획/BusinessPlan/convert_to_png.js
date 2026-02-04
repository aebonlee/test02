const puppeteer = require('puppeteer');
const path = require('path');

async function convertToPng() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set viewport for high quality image
    await page.setViewport({
        width: 1280,
        height: 1600,
        deviceScaleFactor: 2
    });

    // Load the HTML file
    const htmlPath = path.join(__dirname, 'ssal_works_5_areas.html');
    await page.goto(`file://${htmlPath}`, {
        waitUntil: 'networkidle0'
    });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(r => setTimeout(r, 1000));

    // Get the container element
    const container = await page.$('.container');

    if (container) {
        // Screenshot just the container
        await container.screenshot({
            path: path.join(__dirname, 'ssal_works_5_areas.png'),
            type: 'png',
            omitBackground: false
        });
        console.log('PNG created successfully: ssal_works_5_areas.png');
    } else {
        // Full page screenshot as fallback
        await page.screenshot({
            path: path.join(__dirname, 'ssal_works_5_areas.png'),
            type: 'png',
            fullPage: true
        });
        console.log('Full page PNG created: ssal_works_5_areas.png');
    }

    await browser.close();
}

convertToPng().catch(console.error);

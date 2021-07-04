const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const exphs = require('express-handlebars');
const path = require('path');
const moment = require('moment');


const compile = async function(templateName, data) {
    const filePath = path.join(process.cwd(), 'dashboard', `${templateNames}.hbs`);
    const html = await fs.readFile(filepath, 'utf-8')
    return HandleBars.compile(html)(data);
}


(async function() {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const content = await compile('dashboard', data)

        await page.setContent(content);
        await page.emulateMedia(screen);
        await page.pdf({
            path: 'invoice.pdf',
            format: 'A4',
            printBackground: true
        })
        console.log('done');
        await browser.close();
        process.exit();


    } catch (e) {
        console.log('error not found', e);
    }
})
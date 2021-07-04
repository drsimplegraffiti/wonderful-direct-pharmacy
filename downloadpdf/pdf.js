const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const exphs = require('express-handlebars');
const path = require('path');
const moment = require('moment');


// const compile = async function(templateName, data) {
//     const filePath = path.join(process.cwd(), 'dashboard', `${templateNames}.hbs`);
//     const html = await fs.readFile(filepath, 'utf-8')
//     return HandleBars.compile(html)(data);
// }


(async function() {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto('http://localhost:3000/drugs');
        await page.waitForSelector('dashboard')


    } catch (e) {
        console.log('error not found', e);
    }
})
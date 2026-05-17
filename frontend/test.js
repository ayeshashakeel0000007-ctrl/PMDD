const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'dist')));

const server = app.listen(3000, async () => {
    console.log('Server started on port 3000');
    
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log('BROWSER ERROR:', msg.text());
            } else {
                console.log('BROWSER LOG:', msg.text());
            }
        });
        
        page.on('pageerror', error => {
            console.log('BROWSER PAGE EXCEPTION:', error.message);
        });

        await page.goto('http://localhost:3000');
        console.log('Page loaded');
        
        // Click INITIALIZE INSTRUMENTATION
        await page.waitForSelector('button');
        await page.click('button');
        console.log('Clicked initialize');
        
        // Wait for textarea to appear
        await page.waitForSelector('textarea');
        console.log('Textarea visible');
        
        // Type text
        await page.type('textarea', 'This is a test of the backend');
        
        // Click Execute
        const buttons = await page.$$('button');
        await buttons[buttons.length - 1].click(); // Execute button is the last one
        console.log('Clicked execute');
        
        // Wait 15 seconds for errors
        await new Promise(r => setTimeout(r, 15000));
        
        await browser.close();
        server.close();
    } catch (e) {
        console.error("Test script failed", e);
        server.close();
    }
});

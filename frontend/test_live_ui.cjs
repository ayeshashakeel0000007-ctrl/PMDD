const puppeteer = require('puppeteer');

(async () => {
  console.log("Starting headless browser to test LIVE URL...");
  const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER PAGE ERROR:', err.message));
  page.on('requestfailed', request => {
      console.log('BROWSER REQUEST FAILED:', request.url(), request.failure().errorText);
  });

  console.log("Navigating to https://pmddproject.vercel.app ...");
  try {
    const response = await page.goto('https://pmddproject.vercel.app', { waitUntil: 'networkidle0', timeout: 30000 });
    console.log("Main page status:", response.status());
    
    const content = await page.content();
    console.log("HTML START:", content.substring(0, 1000));
    console.log("HTML END:", content.substring(content.length - 1000));

    // Wait a bit to ensure everything executes
    await new Promise(r => setTimeout(r, 5000));

    // Try finding the button
    const initBtn = await page.$('button');
    if (initBtn) {
        console.log("Init button found, page is rendering.");
    } else {
        console.log("NO BUTTON FOUND. IT MIGHT BE A BLANK SCREEN.");
    }
  } catch (e) {
    console.log("Navigation error:", e.message);
  }
  
  await browser.close();
  console.log("Browser closed.");
})();

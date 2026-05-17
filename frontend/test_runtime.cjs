const puppeteer = require('puppeteer');

(async () => {
  console.log("Starting headless browser...");
  const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('CONSOLE:', msg.text()));

  console.log("Navigating to http://localhost:4174 ...");
  try {
    await page.goto('http://localhost:4174', { waitUntil: 'networkidle0', timeout: 15000 });
    const content = await page.content();
    console.log("HTML START:", content.substring(0, 1500));
    console.log("BODY LENGTH:", content.length);
    
    // Check if ErrorBoundary triggered
    if (content.includes('Semantic Observatory Runtime Failure')) {
        console.log("FOUND ERROR BOUNDARY UI!");
        const errorText = await page.evaluate(() => document.body.innerText);
        console.log("ERROR DETAILS:", errorText);
    } else {
        console.log("NO ERROR BOUNDARY DETECTED.");
        // Try clicking the init button
        const initBtn = await page.$('button');
        if (initBtn) {
            console.log("Clicking init button...");
            await initBtn.click();
            await new Promise(r => setTimeout(r, 2000));
            const contentAfter = await page.content();
            if (contentAfter.includes('Semantic Observatory Runtime Failure')) {
                console.log("ERROR TRIGGERED AFTER CLICK!");
                const errorText = await page.evaluate(() => document.body.innerText);
                console.log("ERROR DETAILS:", errorText);
            } else {
                console.log("STILL NO ERROR.");
            }
        }
    }
  } catch (e) {
    console.log("Navigation error:", e.message);
  }
  
  await browser.close();
  console.log("Browser closed.");
})();

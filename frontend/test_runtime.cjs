const puppeteer = require('puppeteer');

(async () => {
  console.log("Starting headless browser...");
  const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('BROWSER ERROR:', msg.text());
  });
  page.on('pageerror', err => {
    errors.push(err.message);
    console.log('PAGE ERROR:', err.message);
  });

  const TARGET_URL = 'https://frontend-nine-tan-21.vercel.app';
  console.log("Navigating to", TARGET_URL, "...");
  try {
    await page.goto(TARGET_URL, { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });
    
    // Wait for React to render
    await new Promise(r => setTimeout(r, 5000));
    
    // Check what's on the page
    const bodyText = await page.evaluate(() => document.body.innerText);
    const allButtons = await page.evaluate(() => 
      Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim())
    );
    
    console.log("Page loaded. Buttons found:", JSON.stringify(allButtons.slice(0, 10)));
    console.log("Body excerpt:", bodyText.substring(0, 400));
    console.log("Page errors so far:", errors.length === 0 ? "NONE ✅" : errors.join('; '));

    // Look for any INITIALIZE/START/CORPUS button
    const initClicked = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const initBtn = btns.find(b => {
          const t = b.innerText.toUpperCase();
          return t.includes('INIT') || t.includes('BEGIN') || t.includes('START') || t.includes('CORPUS');
        });
        if(initBtn) { initBtn.click(); return initBtn.innerText; }
        return null;
    });

    if (initClicked) {
        console.log(`\nClicked: "${initClicked}"`);
        await new Promise(r => setTimeout(r, 3000));
        
        // Type into textarea
        const ta = await page.$('textarea');
        if (ta) {
          await ta.click();
          await ta.type('The committee must comply immediately with the new directive.');
          console.log("Text typed into textarea.");
        } else {
          console.log("No textarea found.");
        }
        
        await new Promise(r => setTimeout(r, 1000));

        // Click Execute
        const execClicked = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const execBtn = btns.find(b => {
              const t = b.innerText.toUpperCase();
              return t.includes('EXECUTE') || t.includes('ANALYZ') || t.includes('RUN') || t.includes('SUBMIT');
            });
            if (execBtn) { execBtn.click(); return execBtn.innerText; }
            return null;
        });
        
        if (execClicked) {
            console.log(`Clicked: "${execClicked}"`);
            console.log("Waiting 25s for analysis...");
            await new Promise(r => setTimeout(r, 25000));
            
            const finalErrors = errors.filter(e => e.includes('is not defined') || e.includes('Cannot read'));
            if (finalErrors.length > 0) {
              console.log("\n❌ RUNTIME ERRORS:", finalErrors.join('\n'));
            } else {
              console.log("\n✅ NO RUNTIME ERRORS DETECTED!");
            }
            
            const finalBody = await page.evaluate(() => document.body.innerText);
            const hasResults = finalBody.includes('Orchestrator') || finalBody.includes('Meaning') || 
                               finalBody.includes('Drift') || finalBody.includes('Semantic');
            console.log("Results rendered:", hasResults ? "✅ YES" : "❌ NO (blank screen)");
            console.log("\nFinal body excerpt:", finalBody.substring(0, 600));
        } else {
            console.log("No Execute button found.");
        }
    } else {
        console.log("No init button found. Checking page state...");
        const html = await page.content();
        console.log("HTML has scripts:", html.includes('<script'));
        console.log("HTML root empty:", html.includes('<div id="root"></div>'));
    }
  } catch (e) {
    console.log("Error:", e.message);
  }
  
  await browser.close();
  console.log("\nBrowser closed.");
})();

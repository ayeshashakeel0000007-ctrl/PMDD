const puppeteer = require('puppeteer');

(async () => {
  console.log("Starting headless browser against LIVE VERCEL...");
  const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  console.log("Navigating to https://pmddproject.vercel.app/ ...");
  try {
    await page.goto('https://pmddproject.vercel.app/', { waitUntil: 'networkidle0', timeout: 20000 });
    
    // Click initialize button
    const buttons = await page.$$('button');
    let initBtn = null;
    for (const btn of buttons) {
        const text = await page.evaluate(el => el.innerText, btn);
        if (text.includes('INITIALIZE INSTRUMENTATION')) initBtn = btn;
    }
    
    if (initBtn) {
        console.log("Clicking INITIALIZE INSTRUMENTATION...");
        await initBtn.click();
        await new Promise(r => setTimeout(r, 2000));
        
        // Find textarea and type
        const textarea = await page.$('textarea');
        if (textarea) {
            console.log("Typing into textarea...");
            await textarea.type('The committee must comply immediately.');
            
            // Find Execute button
            const allBtns = await page.$$('button');
            let execBtn = null;
            for (const btn of allBtns) {
                const text = await page.evaluate(el => el.innerText, btn);
                if (text.includes('Execute Deterministic Analysis')) execBtn = btn;
            }
            
            if (execBtn) {
                console.log("Clicking Execute...");
                await execBtn.click();
                
                console.log("Waiting 15 seconds for results to render...");
                await new Promise(r => setTimeout(r, 15000));
                
                const content = await page.content();
                if (content.includes('Semantic Observatory Runtime Failure')) {
                    console.log("!!! ERROR BOUNDARY TRIGGERED !!!");
                    const errorText = await page.evaluate(() => document.body.innerText);
                    console.log("ERROR DETAILS:", errorText);
                } else {
                    console.log("NO RUNTIME CRASH. Results loaded successfully.");
                    const bodyText = await page.evaluate(() => document.body.innerText);
                    console.log("VISIBLE TEXT:", bodyText.substring(0, 500));
                }
            } else {
                console.log("Execute button not found.");
            }
        } else {
            console.log("Textarea not found.");
        }
    } else {
        console.log("Initialize button not found.");
    }
    
  } catch (e) {
    console.log("Navigation error:", e.message);
  }
  
  await browser.close();
  console.log("Browser closed.");
})();

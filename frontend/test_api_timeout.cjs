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
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText));

  // Also intercept responses to see API status
  page.on('response', async (response) => {
      if (response.url().includes('/api/analyze')) {
          console.log('API RESPONSE STATUS:', response.status());
      }
  });

  try {
    await page.goto('https://pmddproject.vercel.app/', { waitUntil: 'networkidle0', timeout: 20000 });
    
    // Click initialize
    const initBtn = await page.evaluateHandle(() => {
        return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('INITIALIZE'));
    });
    if (initBtn) {
        await initBtn.click();
        await new Promise(r => setTimeout(r, 2000));
        
        // Type into textarea
        const textarea = await page.$('textarea');
        if (textarea) {
            await textarea.type('The committee must comply immediately with the new directive.');
            
            // Click Execute
            const execBtn = await page.evaluateHandle(() => {
                return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Execute'));
            });
            
            if (execBtn) {
                console.log("Clicking Execute...");
                await execBtn.click();
                
                console.log("Waiting 20 seconds for API...");
                await new Promise(r => setTimeout(r, 20000));
                
                const content = await page.content();
                if (content.includes('Semantic Observatory Runtime Failure')) {
                    console.log("!!! ERROR BOUNDARY TRIGGERED !!!");
                } else if (content.includes('Semantic Research Workspace') || content.includes('Deterministic Orchestrator Conclusion')) {
                    console.log("SUCCESS! Results rendered.");
                } else {
                    console.log("FAILED to render results. Current text:");
                    const bodyText = await page.evaluate(() => document.body.innerText);
                    console.log(bodyText.substring(0, 500));
                }
            } else {
                console.log("Execute button not found");
            }
        }
    }
  } catch (e) {
    console.log("Error:", e.message);
  }
  
  await browser.close();
})();

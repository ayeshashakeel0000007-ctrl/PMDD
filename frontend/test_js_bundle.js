const https = require('https');

https.get('https://pmddproject.vercel.app/', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const match = data.match(/src="([^"]+\.js)"/);
        if (match) {
            let jsPath = match[1];
            if (jsPath.startsWith('./')) jsPath = jsPath.substring(2);
            else if (jsPath.startsWith('/')) jsPath = jsPath.substring(1);
            
            const jsUrl = 'https://pmddproject.vercel.app/' + jsPath;
            console.log('Fetching JS:', jsUrl);
            
            https.get(jsUrl, (jsRes) => {
                console.log('JS Bundle Status:', jsRes.statusCode);
                console.log('JS Bundle Content-Type:', jsRes.headers['content-type']);
                let jsData = '';
                jsRes.on('data', chunk => jsData += chunk);
                jsRes.on('end', () => {
                    console.log('JS Bundle Size:', jsData.length);
                });
            });
        } else {
            console.log('No JS bundle found in HTML');
        }
    });
});

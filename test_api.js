const https = require('https');

const data = JSON.stringify({
  text: 'The committee must comply immediately with the new directive.'
});

const options = {
  hostname: 'pmddproject.vercel.app',
  path: '/api/analyze',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const start = Date.now();
const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Time:', Date.now() - start, 'ms');
  
  let body = '';
  res.on('data', (d) => {
    body += d;
  });
  
  res.on('end', () => {
    console.log('Body:', body.substring(0, 300));
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();

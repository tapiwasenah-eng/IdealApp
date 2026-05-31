const http = require('http');
http.get('http://localhost:3000/', (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => { console.log('BODY HEAD:', body.slice(0, 100)); });
}).on('error', (e) => {
  console.error(`ERROR: ${e.message}`);
});

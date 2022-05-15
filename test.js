
const https = require('https');

https.get('https://code.visualstudio.com/sha/download?build=stable&os=win32-x64-archive', res => {
  let data = [];
  const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
  console.log('Status Code:', res.statusCode);
  console.log('Date in Response header:', headerDate);

  res.on('data', chunk => {
    data.push(chunk);
  });

  res.on('end', () => {
    console.log(res.headers);

   
  });
}).on('error', err => {
  console.log('Error: ', err.message);
});
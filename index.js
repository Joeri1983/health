const http = require('http');
const https = require('https');
const port = process.env.PORT || 3000;

// Google Sheet CSV URL
const googleSheetCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSzRTmxloVZW-y1Pi9VymHwqbGOxihjdextEHECKiXar7dokw9dSBGvHqCDXnDUuW68J7i0xe99cgv5/pub?output=csv';

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    https.get(googleSheetCsvUrl, (response) => {
      let data = '';
      response.on('data', chunk => { data += chunk; });
      response.on('end', () => {
        const lines = data.trim().split('\n');
        const values = lines.map(line => {
          const [, value] = line.split(',');
          return value.trim();
        });

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(values.join(' ')); // all values in a long row
      });
    }).on('error', err => {
      res.statusCode = 500;
      res.end('Error fetching Google Sheet CSV: ' + err.message);
    });
  }
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});

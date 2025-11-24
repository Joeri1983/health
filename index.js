const http = require('http');
const axios = require('axios');
const port = process.env.PORT || 3000;

// Google Sheet CSV URL
const googleSheetCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSzRTmxloVZW-y1Pi9VymHwqbGOxihjdextEHECKiXar7dokw9dSBGvHqCDXnDUuW68J7i0xe99cgv5/pub?output=csv';

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET') {
    try {
      // Fetch CSV with axios
      const response = await axios.get(googleSheetCsvUrl);
      const data = response.data;

      // Split CSV lines and extract column B
      const lines = data.trim().split('\n');
      const values = lines.map(line => {
        const [, value] = line.split(',');
        return value ? value.trim() : '';
      });

      // Send as a single long row
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(values.join(' '));

    } catch (error) {
      res.statusCode = 500;
      res.end('Error fetching Google Sheet CSV: ' + error.message);
    }
  }
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});

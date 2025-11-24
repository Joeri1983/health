const http = require('http');
const https = require('https');
const port = process.env.PORT || 3000;

// Public Google Sheets CSV URL
const googleSheetCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSzRTmxloVZW-y1Pi9VymHwqbGOxihjdextEHECKiXar7dokw9dSBGvHqCDXnDUuW68J7i0xe99cgv5/pub?output=csv';

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    let recordsToShow = 25; // Default number of records to show
    if (req.url.includes('/show')) {
      const requestedRecords = req.url.split('/show')[1];
      if (['25','50','100','250'].includes(requestedRecords)) {
        recordsToShow = parseInt(requestedRecords);
      }
    }

    // Fetch CSV from Google Sheets
    https.get(googleSheetCsvUrl, (response) => {
      let data = '';
      response.on('data', chunk => { data += chunk; });
      response.on('end', () => {
        // Split CSV lines and parse column A as date, column B as value
        const lines = data.trim().split('\n');
        const values = lines.map(line => {
          const [date, value] = line.split(',');
          return { date: date.trim(), value: parseFloat(value.trim()) };
        });

        const latestValues = values.slice(-recordsToShow);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write('<html><body>');

        // Buttons to choose number of records
        res.write(`<button onclick="window.location.href='/show25'">Show 25 records</button>`);
        res.write(`<button onclick="window.location.href='/show50'">Show 50 records</button>`);
        res.write(`<button onclick="window.location.href='/show100'">Show 100 records</button>`);
        res.write(`<button onclick="window.location.href='/show250'">Show 250 records</button>`);

        // Chart canvas
        res.write('<canvas id="myChart" width="400" height="200"></canvas>');

        // Chart.js script
        res.write('<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>');
        res.write('<script>');
        res.write('var ctx = document.getElementById("myChart").getContext("2d");');
        res.write('var labels = ' + JSON.stringify(latestValues.map(line => line.date)) + ';');
        res.write('var data = ' + JSON.stringify(latestValues.map(line => line.value)) + ';');
        res.write('var myChart = new Chart(ctx, {');
        res.write('type: "line",');
        res.write('data: { labels: labels, datasets: [{ label: "Values", data: data, backgroundColor: "rgba(75, 192, 192, 0.2)", borderColor: "rgba(75, 192, 192, 1)", borderWidth: 1 }]},');
        res.write('options: { scales: { y: { beginAtZero: true } } }');
        res.write('});');
        res.write('</script>');

        res.write('</body></html>');
        res.end();
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

const express = require('express')
const app = express()
const http = require('http');
const https = require('https');
const fs = require('fs');
const port = process.env.PORT || 4000

const azureStorageUrl = 'https://storagejoeri.blob.core.windows.net/dgjoeri/activity.csv';


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

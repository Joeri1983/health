const port = process.env.PORT || 4000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example application listening on port ${port}`)
})

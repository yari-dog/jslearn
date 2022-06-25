
const express = require('express')
const app = express()
const port = 3000

const path = require('path')


app.use("/static", express.static(path.resolve(__dirname, "www", "static")))

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'www','index.html'))
    console.log('/ accessed')
})

app.listen(port, () => {
    console.log(`running server on port ${port}....`)
})

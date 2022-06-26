
const express = require('express')
const app = express()
const port = 3000

const path = require('path')

app.use("/node_modules", express.static(path.resolve(__dirname, "node_modules")))
app.use("/static", express.static(path.resolve(__dirname, "www", "static")))

app.get("/node_modules/*", (req, res) => {
    console.log(req.params[0])
    res.sendFile(path.resolve(__dirname, "node_modules", req.params[0]))
})

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'www','index.html'))
    console.log('/ accessed')
})

app.listen(port, () => {
    console.log(`running server on port ${port}....`)
})


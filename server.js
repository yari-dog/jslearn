
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const app = express();
const port = process.env.PORT || 3000;

const path = require('path');

app.use("/node_modules", express.static(path.resolve(__dirname, "node_modules")))
app.use("/static", express.static(path.resolve(__dirname, "www", "static")))

app.get("/node_modules/*", (req, res) => {
    console.log(req.params[0])
    res.sendFile(path.resolve(__dirname, "node_modules", req.params[0]))
})
app.get('/wm', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'www','wmtest.html'))
    console.log('/ accessed')
})

app.get('/views/:view', (req,res) => {
    res.sendFile(path.resolve(__dirname, 'www','static','html','views',req.params.view.concat('.html')));
})

app.get('/:id', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'www','index.html'))
        
})

app.get('/home/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'www','index.html'))
})

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'www','splash.html'))
    console.log('/ accessed')
})

app.listen(port, () => {
    console.log(`running server on port ${port}....`)
})


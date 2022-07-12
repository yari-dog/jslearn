const cookieParser = require('cookie-parser')
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const path = require('path')

const app = express();

const port = process.env.PORT || 3000;

if (!config.get('jwtPrivateKey')) {
    console.error('fatal error: jwtPrivateKey not defined'); 
    process.exit(1);
}

mongoose.connect('mongodb://127.0.0.1/jslearn-testing')
    .then(() => console.log('connected to mongo!'))
    .catch(err => console.log('could not connect to mongo db \n', err));

// #region middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
// #endregion
// #region defining routes 
const home = require('./routes/home')
const index = require('./routes/index')
const views = require('./routes/views')
const api = require('./routes/api')


// #endregion

app.use("/api", api)
app.use("/home", home)
app.use("/views", views)
app.use("/node_modules", express.static(path.resolve(__dirname, "node_modules")))
app.use("/static", express.static(path.resolve(__dirname, "www", "static")))
app.use("/", index)

app.listen(port, () => {
    console.log(`running server on port ${port}....`)
})


const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/:view', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..','www','static','html','views',req.params.view.concat('.html')));
})


module.exports = router;
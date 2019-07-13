const P = require('bluebird');
const fs = P.promisifyAll(require('fs'));
const express = require('express');
const router = express.Router();

// const posts = require('../resources/posts.json');

router.get('/', async (req, res) => {
    let posts = await fs.readFileAsync('resources/posts1.json')
    res.send(JSON.parse(posts));
});

module.exports = router;
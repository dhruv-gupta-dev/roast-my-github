const express = require('express');
const router = express.Router();
const { getGithubData } = require('../controllers/githubController');

router.post('/github', getGithubData);

module.exports = router;
const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');

router.get('/', scoreController.getHighScores);
router.post('/', scoreController.createScore);

module.exports = router;
const express = require('express');
const router = express.Router();
const targetController = require('../controllers/targetController');

router.get('/', targetController.getTargets);
router.post('/validate', targetController.validateClick);

module.exports = router;
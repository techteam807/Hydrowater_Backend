const express = require('express');
const router = express.Router();
const installationController = require('../controllers/installation.controller');

router.post('/registerInstallation', installationController.registerInstallation);
router.get('/getInstallations', installationController.listInstallations);

module.exports = router;
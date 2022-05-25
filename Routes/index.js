const express = require('express');
const router = express.Router();

router.use('/org', require('./OrgRoutes'));
router.use('/user', require('./UserRoutes'));
router.use('/Jobs', require('./JobPostRoutes'));

module.exports = router;
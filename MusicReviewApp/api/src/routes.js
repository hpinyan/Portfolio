const express = require('express');
const router = express.Router();

const apiRouter = require('./backend_routes/APIRoutes');

router.use(apiRouter);

module.exports = router;
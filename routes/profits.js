"use strict";

var express = require('express');
var router = express.Router();
const profits = require("../handler/profitsHandler");
const requireToken = require ("../middleware/reqToken");
const { sanitize } = require('express-sanitizer');

router.get('/', requireToken, profits.getAllProfits);
router.put('/', requireToken, profits.updateProfits);

module.exports = router;
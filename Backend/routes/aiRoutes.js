const express = require("express");
const parseVoiceText = require("../controllers/aiControllers.js").parseVoiceText;
const router = express.Router();

router.post("/voice-parse", parseVoiceText);

module.exports = router;

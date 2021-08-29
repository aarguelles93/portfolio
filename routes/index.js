const express = require('express');
const router = express.Router();

router.get('/helloworld', async (req, res) => {
  await res.send("Hello world!");
})

module.exports = router;
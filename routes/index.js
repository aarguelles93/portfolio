const express = require('express');
const router = express.Router();

const PortfolioModel = require('../models/portfolio');

const Stage = process.env.STAGE;

router.get('/helloworld', async (req, res) => {
  await res.send('Hello world!');
});

router.get('/', async (req, res) => {
  res.render('index');
});

router.get('/:userId', async (req, res) => {
  const params = req.params;
  const userId = params.userId;

  let portfolio;
  try {
    portfolio = await PortfolioModel.getPortfolio(userId);
  } catch (error) {
    res.redirect(`/${Stage}/`);
    return;
  }

  res.render('portfolio', portfolio);
});

module.exports = router;

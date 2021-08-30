const yup = require('yup');

const PortfolioModel = require('../models/portfolio');
const portfolioSchema = yup.object({
  userId: yup.string().required(),
  description: yup.string().required(),
  imageUrl: yup.string(),
  twitterUserName: yup.string(),
  title: yup.string().required(),
  experience: yup.string(),
  lastName: yup.string().required(),
  name: yup.string().required(),
  twitterUserId: yup.string(),
});

const getPortfolioParamsSchema = yup.object({
  pathParameters: yup
    .object({
      userId: yup.string().required(),
    })
    .required(),
});

module.exports.createPortfolio = async (event, context) => {
  console.log('Received', event.body, typeof event.body);

  const body = JSON.parse(event.body);

  let data;
  try {
    data = await portfolioSchema.validate(body);
  } catch (err) {
    console.error(err);
    return {
      statusCode: 402,
      body: JSON.stringify({ message: err.message }),
    };
  }

  let porfolio;
  try {
    porfolio = await PortfolioModel.setPorfolio(data);
  } catch (err) {
    if (err.statusCode) {
      return {
        statusCode: err.statusCode,
        body: JSON.stringify({ message: err.name }),
      };
    }
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(porfolio),
  };
};

module.exports.getPortfolio = async (event, context) => {
  console.log('Received', event.body, typeof event.body);

  let data;
  try {
    data = await getPortfolioParamsSchema.validate(event);
  } catch (err) {
    console.error(err);
    return {
      statusCode: 402,
      body: JSON.stringify({ message: err.message }),
    };
  }

  const { userId } = data.pathParameters;

  let portfolio;
  try {
    portfolio = await PortfolioModel.getPortfolio(userId);
  } catch (err) {
    if (err.statusCode) {
      return {
        statusCode: err.statusCode,
        body: JSON.stringify({ message: err.name }),
      };
    }
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(portfolio),
  };
};

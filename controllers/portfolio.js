const AWS = require('aws-sdk');
const PortfolioTable = process.env.PORTFOLIO_TABLE_NAME;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const yup = require('yup');

const portfolioSchema = yup.object({
  userId: yup.string().required(),
  description: yup.string().required(),
  imageUrl: yup.string(),
  twitterUserName: yup.string(),
  title: yup.string(),
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
      body: JSON.stringify(err),
    };
  }

  const {
    userId,
    description,
    imageUrl,
    twitterUserName,
    title,
    experience,
    lastName,
    name,
    twitterUserId,
  } = data;

  const params = {
    TableName: PortfolioTable,
    Item: {
      userId,
      description,
      imageUrl,
      twitterUserName,
      title,
      experience,
      lastName,
      name,
      twitterUserId,
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify(`Could not create Portfolio - ${err}`),
    };
  }
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
      body: JSON.stringify(err),
    };
  }

  const { userId } = data.pathParameters;

  const params = {
    TableName: PortfolioTable,
    Key: {
      userId,
    },
  };

  try {
    const result = await dynamoDb.get(params).promise();
    if (!result.Item) {
      return {
        statusCode: 404,
        body: {
          message: `No porfolio was found for user ${userId}`,
        },
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify(`Could not create Portfolio - ${err}`),
    };
  }
};

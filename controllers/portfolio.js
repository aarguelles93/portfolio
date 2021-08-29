const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const yup = require('yup');
const got = require('got');

const PortfolioTable = process.env.PORTFOLIO_TABLE_NAME;
const TwitterApiRootUrl = process.env.TWITTER_API_URL;
const TwitterBearerToken = process.env.TWITTER_BEARER_TOKEN;

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
      body: JSON.stringify(err.message),
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
      body: JSON.stringify(`Could not create Portfolio - ${err.message}`),
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
      body: JSON.stringify(err.message),
    };
  }

  const { userId } = data.pathParameters;

  const params = {
    TableName: PortfolioTable,
    Key: {
      userId,
    },
  };

  let result;
  try {
    result = await dynamoDb.get(params).promise();
    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `No porfolio was found for user ${userId}`,
        }),
      };
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Could not get Portfolio - ${err.message}`,
      }),
    };
  }

  const portfolio = result.Item;

  // Tries to get userTweets. If no tweets are found, field is returned as null.
  if (portfolio.twitterUserName) {
    const getTweetsUrl = `${TwitterApiRootUrl}/statuses/user_timeline.json`;
    /* eslint-disable camelcase */
    try {
      const tweets = await got.get(getTweetsUrl, {
        responseType: 'json',
        headers: {
          Authorization: `Bearer ${TwitterBearerToken}`,
        },
        searchParams: {
          screen_name: portfolio.twitterUserName,
          count: 5,
          exclude_replies: true,
        },
      });

      portfolio.tweets = tweets.body;
    } catch (err) {
      console.error(err.message);
      portfolio.tweets = null;
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(portfolio),
  };
};

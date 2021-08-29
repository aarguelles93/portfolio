const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const got = require('got');

const APIErrors = require('../utils/errors');

const PortfolioTable = process.env.PORTFOLIO_TABLE_NAME;
const TwitterApiRootUrl = process.env.TWITTER_API_URL;
const TwitterBearerToken = process.env.TWITTER_BEARER_TOKEN;

module.exports.setPorfolio = async (payload) => {
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
  } = payload;

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
  } catch (err) {
    console.error(err);
    throw new APIErrors.Api400Error(
      `Could not create/update Portfolio ${userId} - ${err.message}`
    );
  }

  return params.Item;
};

module.exports.getPortfolio = async (userId) => {
  const params = {
    TableName: PortfolioTable,
    Key: {
      userId,
    },
  };

  let result;
  try {
    result = await dynamoDb.get(params).promise();
  } catch (err) {
    console.error(err);
    throw new APIErrors.Api503Error(
      `An error ocurred accessing Portfolio ${userId}`
    );
  }

  if (!result.Item) {
    throw new APIErrors.Api404Error(`No porfolio was found for user ${userId}`);
  }

  const portfolio = result.Item;

  // Tries to get userTweets. If no tweets are found, tweets field is omitted
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
    }
  }

  return portfolio;
};

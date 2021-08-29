const sls = require('serverless-http'); //Handle the GET endpoint on the root route /
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

module.exports.createPortfolio = async (event, context) => {
  console.log('Received', event.body, typeof event.body);

  const body = JSON.parse(event.body);

  let data;
  try {
    data = await portfolioSchema.validate(body);
  } catch (err) {    
    console.error(err)
    return {
      statusCode: 402,
      body: JSON.stringify(err)
    }
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
    }
  };

  try {
    await dynamoDb.put(params).promise()
    return {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    }; 
    
  } catch (err) {
    console.log(err);
      return {
        statusCode: 500,
        body: JSON.stringify(`Could not create Portfolio - ${err}`)
      }      
  }
};


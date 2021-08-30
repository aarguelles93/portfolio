const AWS = require('aws-sdk');
const PortfolioTable = process.env.PORTFOLIO_TABLE_NAME;

AWS.config.update({
  region: 'us-east-2',
});

const dynamodb = new AWS.DynamoDB();

const params = {
  TableName: PortfolioTable || 'portfolio',
  KeySchema: [
    { AttributeName: 'userId', KeyType: 'HASH' }, //Partition key
  ],
  AttributeDefinitions: [{ AttributeName: 'userId', AttributeType: 'S' }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
};

dynamodb.createTable(params, (err, data) => {
  if (err) {
    console.error(
      'Unable to create table. Error JSON:',
      JSON.stringify(err, null, 2)
    );
  } else {
    console.log(
      'Created table. Table description JSON:',
      JSON.stringify(data, null, 2)
    );
  }
});

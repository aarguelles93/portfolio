# Portfolio.com

This is a project made by using Node.JS, DynamoDB and deployed as Serverless Lambda Functions using Serverless.js. For the views rendering, ejs is used.

This application displays the "Portfolio" of each user, containing a profile picture, a description of its profile, and also can be integrated to his/hers user account to pull its latests tweets.

# Requirements

To deploy it, it is required to have installed both the aws-cli and serverless modules in the machine. Once both CLIs have been installed and configured, the AWS account must have access to DynamoDB for the deployment of the database. This database is integrated to the application through the serverless configuration in the .yml file.

In case you are running the project in your local machine using the serverless-offline plugin, you can manually create the required db table. The script 'setupDb.js' can be run from the machine; otherwise, it can be manually created through the AWS Console. Anyway, it is important that the name of the table later matches with the .env 'PORTFOLIO_TABLE_NAME'.

Also, for the Twitter integration to work, the .env 'TWITTER_BEARER_TOKEN' must be configured.

## Environment variables
The required .env's must be setup into the correspondent file:
- `config.dev.json`
- `config.prod.json`

Also, inside the file, the 'STAGE' .env must be set up accordingly

```json
{
  "STAGE": "dev",
  "PORTFOLIO_TABLE_NAME": "portfolio",
  "TWITTER_API_URL": "https://api.twitter.com/1.1",
  "TWITTER_BEARER_TOKEN": "..."
}
```

## Deployment
Once all the previous steps are done, the project can be deployed using the serverless CLI by entering:

`serverless deploy --stage dev --region us-east-2`

Both the stage and region are optional and can be customized.

Once deployed, the serverless CLI shall grant you a list with each of the deployed functions and endpoints.

# Structure
The project has been divided in two main 'blocks': The API and the WebApp
The API consists of two endpoints to interact with the Portfolio table, completely deployed onto Lambda functions. Its endpoints are deployed on the 'API' subdomain.
The WebApp is deployed onto a single Lambda function, which is in charge of the internal routing by using express.js. Its routes are located on the root of the url.

Take into account that all of the endpoints are deployed inside of the correspondant stage, e.j. :
`http://rooturl/dev/anyUser`.

## API
Currently, there are two endpoints to interact with the API:

  - ### `GET /STAGE/API/portfolio/:userId`
      - #### Params:
          - :userId : It is the userId of any of the existing Portfolios
      - #### Response:
      ```json
      {
        "imageUrl": "https://pbs.twimg.com/profile_images/668279339838935040/8sUE9d4C_200x200.jpg",
        "twitterUserName": "GoT_Tyrion",
        "lastName": "Lannister",
        "userId": "tlanister",
        "description": "Tyrion of House Lannister. Imp, Halfman. Never forget what you are, for surely the world will not. Not",
        "name": "Tyrion",
        "title": "Tyrion Lannister",
        "tweets": [...]
      }
      ```
      Tweets are returned if `twitterUserName` is a valid twitter account. It may return up to 5 of its latest tweets.

      In case of errors, the following structure is returned:
      ```json
      {
        "message": "No porfolio was found for user 123"
      }
      ```

  - ### `POST /STAGE/API/portfolio/`
      - #### Body:
      ```json
      {
        "userId": "tlanister",
        "description": "Tyrion of House Lannister. Imp, Halfman. Never forget what you are, for surely the world will not. Not",
        "imageUrl": "https://pbs.twimg.com/profile_images/668279339838935040/8sUE9d4C_200x200.jpg",
        "twitterUserName": "GoT_Tyrion",
        "title": "Tyrion Lannister",
        "lastName": "Lannister",
        "name": "Tyrion",
      }
      ```
      Mandatory fields: userId, description, lastName, name, title

      - #### Response:
      ```json
      {
        "userId": "tlanister",
        "description": "Tyrion of House Lannister. Imp, Halfman. Never forget what you are, for surely the world will not. Not",
        "imageUrl": "https://pbs.twimg.com/profile_images/668279339838935040/8sUE9d4C_200x200.jpg",
        "twitterUserName": "GoT_Tyrion",
        "title": "Tyrion Lannister",
        "lastName": "Lannister",
        "name": "Tyrion"
      }
      ```
      In case of errors, the following structure is returned:
      ```json
      {
        "message": "userId is a required field"
      }
      ```
      
## WebApp
- ### `GET /STAGE/:userId`
Access the information of the given user. In case that the given ':userdId' does not exist, the client gets redirected.
- ### `GET /STAGE/`
An improvised homepage for the application. Currently used to redirect failed requests.

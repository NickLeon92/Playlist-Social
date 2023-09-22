import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(`env variables: id: ${process.env.client_id}, secret: ${process.env.client_secret}`)
    try {
        // Retrieve the query parameters from the event object
        const queryStringParameters = event.queryStringParameters;
    
        // Check if the 'code' parameter is present in the query parameters
        if (queryStringParameters && queryStringParameters.code) {
          // Extract the authorization code
            const authorizationCode = queryStringParameters.code;
    
          // Now, 'authorizationCode' contains your authorization code
            console.log('Authorization Code:', authorizationCode);
    
          // You can proceed to exchange this code for an access token or perform further processing.
            const params = new URLSearchParams();
            params.append('client_id', "1153431231950753982");
            params.append('client_secret', "2iDXCifIw6WTE-oEzrPmd-DtbknDURmo");
            params.append('grant_type', 'authorization_code');
            params.append('code', authorizationCode);
            params.append('redirect_uri', "http://localhost:3000/auth")
            try {
                const response = await axios.post('https://discord.com/api/oauth2/token',params)

                // Handle the response
                console.log(response.data);
                return {
                  statusCode: 200,
                  body: JSON.stringify(response.data),
                };
            } catch (error) {
                // Handle errors
                console.error(error);
                return {
                    statusCode: 400,
                    body: JSON.stringify(error),
                  };
            }
    
        } else {
          // Handle the case where the 'code' parameter is missing
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Authorization code not found in query parameters' }),
          };
        }
      } catch (error) {
        // Handle any unexpected errors
        console.error('Error:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Internal server error' }),
        };
      }
};

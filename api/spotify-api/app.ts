import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import querystring from 'querystring'
import * as dotenv from 'dotenv';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import mongoose, { mongo } from 'mongoose'
import User from './User'
import connectToDatabase from './db'
const secretKey = 'my-super-secret-temp-key';
const dbURI = 'mongodb://172.17.0.3:27017/playlistsDB'; // MongoDB server URL and database name

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

export const lambdaHandler = async (event:any)=> {

  const headers = {
    "Access-Control-Allow-Headers" : "Content-Type",
    "Access-Control-Allow-Origin": "*", // Allow from anywhere 
    "Access-Control-Allow-Methods": "*"
  }

  const eventData = JSON.parse(event.body)
  console.log(eventData)
  let payload

  try {
    let token = event.headers.Authorization
    token = token.split(' ').pop().trim()

    const data:any = jwt.verify(token, secretKey, { maxAge: '24h' });
    console.log('token verified')

    await connectToDatabase(dbURI);
    // await mongoose.connect(dbURI)
    const userData = await User.findOne({username: data.username})

    if(userData){
      const userDataObject = userData.toObject();
      if(!userDataObject.token_data){
        throw userData
      }
    

      const urlQuery = encodeURIComponent(eventData.search)
      console.log('url query: ',urlQuery, '.')
      try {
        const spotifyRes = await axios({
          method: 'get',
          url: `https://api.spotify.com/v1/search?q=${urlQuery}&type=track`,
          headers: {
            "Authorization": `Bearer ${userDataObject.token_data.access_token}`
          }
        })
    
        console.log(spotifyRes.data)
        payload = spotifyRes.data
      } catch (error) {
        throw error
      }
    }else{
      throw 'uhhh how did you do that..?'
    }

    return {
      statusCode: 200,
      body: JSON.stringify(payload),
      // body: 'idk',
      headers: headers
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
      headers: headers
    }
  }
};

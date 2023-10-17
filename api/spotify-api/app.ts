import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import querystring from 'querystring'
import * as dotenv from 'dotenv';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import mongoose, { mongo } from 'mongoose'
import User from './User'
import connectToDatabase from './db'
const secretKey = 'my-super-secret-temp-key';
const dbURI = `mongodb+srv://${process.env.mongodb_user}:${process.env.mongodb_password}@cluster0.bm4b2.mongodb.net/playlistDB?retryWrites=true`; // MongoDB server URL and database name

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
    // const userData = await User.findOne({username: data.username})

    // if(userData){
    //   const userDataObject = userData.toObject();
    //   if(!userDataObject.token_data){
    //     throw userData
    //   }
    

    //   const urlQuery = encodeURIComponent(eventData.search)
    //   console.log('url query: ',urlQuery, '.')
    //   try {
    //     const spotifyRes = await axios({
    //       method: 'get',
    //       url: `https://api.spotify.com/v1/search?q=${urlQuery}&type=track`,
    //       headers: {
    //         "Authorization": `Bearer ${userDataObject.token_data.access_token}`
    //       }
    //     })
    
    //     console.log(spotifyRes.data)
    //     payload = spotifyRes.data
    //   } catch (error) {
    //     throw error
    //   }
    // }else{
    //   throw 'uhhh how did you do that..?'
    // }
//-----------------------------------

  const requestData = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: eventData.refresh_token,
  });
  console.log(requestData)
  const clientId = process.env.client_id || ''
  const clientSecret = process.env.client_secret || ''
  console.log(clientId, '  |  ' , clientSecret)
  // Base64 encode the Client ID and Client Secret for the "Authorization" header
  const authHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;

  // Make a POST request to exchange the authorization code for tokens
  const spotifyRes = await axios.post(
      'https://accounts.spotify.com/api/token',
      requestData.toString(),
      {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: authHeader,
          },
      }
  );
  console.log(spotifyRes.data)


  const futureTimeStamp = new Date((new Date()).setMinutes((new Date()).getMinutes() + 50))
  const res = await User.updateOne(
    { username: eventData.username },
    { $set: { 'token_data.access_token': spotifyRes.data.access_token, 'token_data.expTime': futureTimeStamp } }, // Update fields
    { strict: false }
  )

  payload = {access_token : spotifyRes.data.access_token , expTime: futureTimeStamp}

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

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as dotenv from 'dotenv';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import mongoose, { mongo } from 'mongoose'
import User from './User'
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

  console.log(event)

  const headers = {
    "Access-Control-Allow-Headers" : "Content-Type",
    "Access-Control-Allow-Origin": "*", // Allow from anywhere 
    "Access-Control-Allow-Methods": "*"
  }

  const userData = JSON.parse(event.body)

  await mongoose.connect(dbURI)

  const mongodbRes = await User.find({username: userData.username})

  const payload = {
    username: userData.username
  }

  const token = jwt.sign(payload, secretKey, {expiresIn: '24h'})

  if(mongodbRes.length === 0){
    const newUser = new User(userData)
    await newUser.save()
    // res.send({message: "welcome new user" , token})
    return{
      statusCode: 200,
      body: JSON.stringify({message: "welcome new user" , token, user: {username: userData.username}}),
      headers: headers
    }
  }else if(userData.password === mongodbRes[0].password){
    
    // res.send({message: "welcome back" , token})
    const obj: { password?: string } = mongodbRes[0]

    delete obj.password
    
    return{
      statusCode: 200,
      body: JSON.stringify({message: "welcome back" , token, user: mongodbRes[0]}),
      headers: headers
    }
  }else{
    // res.send({message: 'incorrect password', token: null})
    return{
      statusCode: 200,
      body: JSON.stringify({message: "incorrect password" , token: null, user: null}),
      headers: headers
    }
  }
  

};

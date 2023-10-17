import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as dotenv from 'dotenv';
import mongoose, { mongo } from 'mongoose'
import User from './User';
import connectToDatabase from './db'
import axios from 'axios';
import { AnyAaaaRecord } from 'dns';
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

export const lambdaHandler = async (event: any) => {
    console.log(`env variables: id: ${process.env.client_id}, secret: ${process.env.client_secret}`)
    const incomingData = JSON.parse(event.body)
    const code = incomingData.code
    const clientId = process.env.client_id || ''
    const clientSecret = process.env.client_secret || ''
    const tokenExchangeUrl = 'https://accounts.spotify.com/api/token'
    try {

        const requestData = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'https://preprod--playlistener.netlify.app/auth',
        });

        // Base64 encode the Client ID and Client Secret for the "Authorization" header
        const authHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;

        // Make a POST request to exchange the authorization code for tokens
        const spotifyRes = await axios.post(
            tokenExchangeUrl,
            requestData.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: authHeader,
                },
            }
        );

        const { access_token, refresh_token } = spotifyRes.data;

        console.log('Access Token:', access_token);
        console.log('Refresh Token:', refresh_token);

        await connectToDatabase(dbURI)

        const usernameToUpdate = incomingData.username; // Replace with the username you want to update
        const futureTimeStamp = new Date((new Date()).setMinutes((new Date()).getMinutes() + 50))
        const payload ={...spotifyRes.data, expTime: futureTimeStamp}
        const res = await User.updateOne(
            { username: usernameToUpdate },
            { $set: { 'token_data': payload } }, // Update fields
            { strict: false }
        )
    
        return {
            statusCode: 200,
            // body: JSON.stringify(spotifyRes.data),
            body: JSON.stringify({mongoRes: res, spotifyRes: spotifyRes.data}),
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*", // Allow from anywhere 
                "Access-Control-Allow-Methods": "POST"
            }
        };
    }
    catch (error) {
        // Handle any unexpected errors
        console.error('Error:', error);
        return {
            statusCode: 400,
            body: JSON.stringify(error),
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*", // Allow from anywhere 
                "Access-Control-Allow-Methods": "POST"
            }
        };
    }

};

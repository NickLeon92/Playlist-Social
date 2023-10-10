import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import querystring from 'querystring'
import * as dotenv from 'dotenv';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import mongoose, { mongo } from 'mongoose'
import User from './Models/User'
import Playlist from './Models/Playlists';
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

  console.log('accessing playlist api')
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

    let payload

    await connectToDatabase(dbURI);
    if(eventData.action === 'create'){

      console.log('creating playlist..')

      const newPlaylist = new Playlist({
        id: eventData.payload.id,
        author: data.username,
        title: eventData.payload.title,
        description: eventData.payload.description,
        songs: eventData.payload.songs
      })

      const playlistRes = await newPlaylist.save({w:'majority'})

      console.log(playlistRes)
        
      const updateUser = await User.findOneAndUpdate(
        { username: data.username},
        { $push: { playlists: playlistRes._id } },
        { new: true }
      )
      console.log(updateUser)
      payload = playlistRes
    }
    else if(eventData.action === 'read'){
      if(eventData.payload === 'users'){
        console.log('fetching user data..')
        const userRes = await User.findOne({
          username: data.username
        }).populate('playlists')
        payload = userRes
      }else if(eventData.payload === 'playlists'){
        console.log('fetching playlists..')
        const playlistRes = await Playlist.find()
        payload = playlistRes
      }
    }
    else if(eventData.action === 'update'){
      console.log('updating with these songs:')
      console.log(eventData.payload.songgs)
      const playlistToUpdate = await Playlist.findOne({id: eventData.payload.id})
      if(!playlistToUpdate){
        return
      }
      playlistToUpdate.id = eventData.payload.id
      playlistToUpdate.title = eventData.payload.title
      playlistToUpdate.description = eventData.payload.description
      playlistToUpdate.songs = eventData.payload.songs
      await playlistToUpdate.save()
    }
    else if(eventData.action === 'delete'){
      const playlistToDelete = await Playlist.findOneAndDelete({id: eventData.payload})
      if(!playlistToDelete){
        return
      }
      const updatedUser = await User.findOneAndUpdate(
        {username: data.username},
        {$pull: {playlists: playlistToDelete._id}}
      )
      payload = {playlistToDelete, updatedUser}
    }

    return {
      statusCode: 200,
      body: JSON.stringify({message: 'thank you for using the playlist api', payload}),
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

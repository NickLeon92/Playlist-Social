import React from 'react'
import { Playlist } from "../redux/slices/playlistsSlice"
import { useDispatch } from "react-redux"
import { removePlaylist } from "../redux/slices/playlistsSlice"
import {useAuthHeader} from 'react-auth-kit'
import axios from 'axios'

interface SavedPlaylistProps {
    playlist: Playlist,
    setId: React.Dispatch<React.SetStateAction<string>>,
    setTitle: React.Dispatch<React.SetStateAction<string>>,
    setDescription: React.Dispatch<React.SetStateAction<string>>,
    setEdit: React.Dispatch<React.SetStateAction<boolean>>
}

const SavedPlaylist: React.FC<SavedPlaylistProps> = ({ playlist, setId, setTitle, setDescription, setEdit }) => {

    const dispatch = useDispatch()
    const authHeader = useAuthHeader()
    function removeThisPlaylist(){
        dispatch(removePlaylist(playlist.id))
        removeFromDB()
        async function removeFromDB(){
            const deleteRes = await axios({
                method: 'post',
                url: 'https://7kwip1fwr8.execute-api.us-east-1.amazonaws.com/Prod/playlist-api',
                data: {action: 'delete' , payload: playlist.id},
                headers:{
                    "Authorization": authHeader(),
                    "content-type": "application/json"
                }
            })
            console.log(deleteRes.data)
        }
    }
    function openPlaylist(){
        console.log('opening playlist: ', playlist)
        setId(playlist.id)
        setTitle(playlist.title)
        setDescription(playlist.description)
        setEdit(true)
    }
    return (

        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{playlist.title}</h5>
            </a>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{playlist.description}</p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">song count: {playlist.songs.length}</p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">suggestion count: {playlist.suggestedSongs.length}</p>
            <button onClick={openPlaylist} type="button" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">View / Edit</button>
            <button onClick={removeThisPlaylist} type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Delete</button>

        </div>

    )
}

export default SavedPlaylist


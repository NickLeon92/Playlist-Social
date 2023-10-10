import React from 'react'
import { Song } from "../redux/slices/playlistsSlice"
import ExplorerSongCard from './ExplorerSongCard'
// import { useDispatch } from "react-redux"
// import {useAuthHeader} from 'react-auth-kit'
// import axios from 'axios'

interface ExplorerPlaylist{
    title: string
    author: string
    description: string
    songs: Array<Song>
}

interface ExplorerPlaylistProps {
    playlist: ExplorerPlaylist,
}

const ExplorerPlaylist: React.FC<ExplorerPlaylistProps> = ({ playlist }) => {


    return (

        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{playlist.title}</h5>
            </a>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">author: {playlist.author}</p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{playlist.description}</p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">song count: {playlist.songs.length}</p>
            <div className="overflow-auto max-h-64">
                {
                    playlist.songs.map((song) => (
                        <ExplorerSongCard playlist={playlist.songs} song={song} />
                    ))
                }
            </div>
        </div>

    )
}

export default ExplorerPlaylist
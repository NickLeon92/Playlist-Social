import React, { useEffect, useState } from 'react'
import { Song } from "../redux/slices/playlistsSlice"
import ExplorerSongCard from './ExplorerSongCard'
import Editor from './PlaylistEditor'
import SongCard from './SongCard'
// import { useDispatch } from "react-redux"
import {useAuthHeader} from 'react-auth-kit'
import axios from 'axios'

interface ExplorerPlaylist{
    id: string
    title: string
    author: string
    description: string
    songs: Array<Song>
}

interface ExplorerPlaylistProps {
    playlist: ExplorerPlaylist,
}

const ExplorerPlaylist: React.FC<ExplorerPlaylistProps> = ({ playlist }) => {

    const authHeader = useAuthHeader()

    const [showModal, setShowModal] = useState(false)
    const [ suggestedSongs, setSuggestedSongs] = useState<Song[]>([])
    const [ suggestedSongsFiltered, setSuggestedSongsFiltered] = useState<Song[]>([])

    async function sendSuggestions(){
        try {

            const apiRes = await axios({
                method: 'post',
                url: 'https://7kwip1fwr8.execute-api.us-east-1.amazonaws.com/Prod/playlist-api',
                data: {action: 'update-suggestions' , payload: { id: playlist.id, suggestedSongs: suggestedSongsFiltered}},
                headers: {
                    "Authorization": authHeader(),
                    "content-type": "application/json"
                }
            })
            
            setSuggestedSongs([])
            console.log(apiRes.data)
        } catch (error) {
            console.log(error)
            window.alert('error occured while trying to save')
        }
    }

    useEffect(() => {
        const checkArray = []
        for(let song of suggestedSongs){
            if(!playlist.songs.some((el) => el.songId === song.songId)){
                checkArray.push(song)
            }
        }
        setSuggestedSongsFiltered(checkArray)
    },[suggestedSongs])

    return (

        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className='flex flex-row justify-between'>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{playlist.title}</h5>
                <div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ml-3 ease-linear transition-all duration-150 w-20">
                        suggest songs
                    </button>
                </div>
            </div>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">author: {playlist.author}</p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{playlist.description}</p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">song count: {playlist.songs.length}</p>
            <div className="overflow-auto max-h-64">
                {
                    playlist.songs.map((song) => (
                        <ExplorerSongCard key={song.songId} playlist={playlist.songs} song={song} />
                    ))
                }
            </div>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">suggested songs:</p>
            {suggestedSongsFiltered.length > 0?(
                <div>
                    <button
                        onClick={sendSuggestions} 
                        className='bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ml-3 ease-linear transition-all duration-150'
                    >
                        send suggestions
                    </button>
                    <div className="overflow-auto max-h-64">
                        {
                            suggestedSongsFiltered.map((song) => (
                                <SongCard key={song.songId} searchResults={playlist.songs} playlist={suggestedSongs} song={song} setPlaylist={setSuggestedSongs} />
                            ))
                        }
                    </div>
                </div>
            ):(<></>)}
            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">

                                <div className="relative p-2 flex-auto">
                                    <Editor playlist={[...suggestedSongs , ...playlist.songs]} setPlaylist={setSuggestedSongs} />
                                </div>
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>

    )
}

export default ExplorerPlaylist
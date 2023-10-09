import { useEffect, useState, useRef } from "react"
import {useAuthHeader} from 'react-auth-kit'
import React from "react";
import Editor from "./PlaylistEditor";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { addPlaylist , updatePlaylist } from "../redux/slices/playlistsSlice";
import { Song } from "../redux/slices/playlistsSlice"
import axios from "axios";
import SongCard from "./SongCard";


interface Playlist{
  id: string,
  title: string,
  description: string
  songs: Array<Song>
}


interface PlaylistProps {
  id: any,
  title: any,
  description: any,
  edit: any,
  setEdit: React.Dispatch<React.SetStateAction<boolean>>,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  setDescription: React.Dispatch<React.SetStateAction<string>>
}

const Playlist : React.FC<PlaylistProps> = ({ id ,title, description, setTitle, setDescription, }) => {

  const dispatch = useDispatch()
  const authHeader = useAuthHeader()

  const reduxPlaylists = useSelector((state: RootState) => state.playlists)

  const [showModal, setShowModal] = useState(false);
  const [playlist, setPlaylist] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  interface apiPayload{
    action: 'create' | 'read' | 'update' | 'delete',
    payload: {
      title: string,
      description: string,
      id: string,
      songs: Array<Song>
    }
  }

  function savePlaylist() {

    console.log(`saving playlist with id: ${id} title: ${title}, and description: ${description}`)
    console.log('sending songs:')
    console.log(playlist)
    // if(reduxPlaylists.playlists.some((el) => el.id === id)){
    //   //update playlist
    const currentPlaylist = reduxPlaylists.playlists.find((el) => el.id === id)
    if (currentPlaylist) {
      dispatch(updatePlaylist({ id, title, description, songs: playlist }))
      saveToDB({ action: 'update', payload: { id, title, description, songs: playlist } })
    } else {
      dispatch(addPlaylist({ id, title, description, songs: playlist }))
      saveToDB({ action: 'create', payload: { id, title, description, songs: playlist } })
    }

    async function saveToDB(payload: apiPayload) {
      setLoading(true)
      setError(false)
      try {
        const apiRes = await axios({
          method: 'post',
          url: 'https://7kwip1fwr8.execute-api.us-east-1.amazonaws.com/Prod/playlist-api',
          data: payload,
          headers: {
            "Authorization": authHeader(),
            "content-type": "application/json"
          }
        })
        console.log(apiRes.data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
        setError(true)
      }
    }
  }

  function titleInput(e: React.ChangeEvent<HTMLInputElement>){
    setTitle(e.target.value)
  }
  function descriptionInput(e: React.ChangeEvent<HTMLTextAreaElement>){
    setDescription(e.target.value)
  }

  useEffect(() => {
    const currentPlaylist = reduxPlaylists.playlists.find((el) => el.id === id)
    if(currentPlaylist){
      setPlaylist(currentPlaylist.songs)
    }else{
      setPlaylist([])
    }
  },[id])
let results : Array<Song> = []
const playlistDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log('detecting change or loading of playlist')
    // scrollToBottom()
    const domNode = playlistDivRef.current;
      if (domNode) {
         domNode.scrollTop = domNode.scrollHeight;
      }
  },[playlist]);
  return (
    <div>
      {error?(<p>an error occured while saving</p>):(<></>)}
      {/* <br /> */}
      <form>
      <div className="relative z-0 w-full mb-6 group flex align center">
        <div className="mr-2 border border-blue-900 border-t-0 border-l-0 border-r-2 border-b-0 pr-2">
          <input onChange={titleInput} className="text-xl block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder={title === ''?('Title'):(title)} />
          {/* <label className="truncate text-xl peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{title === ''? ('Title'):(title)}</label> */}
          <p id="helper-text-explanation" className="mt-2 text-xs text-gray-500 dark:text-gray-400">Enter a title for you playlist!</p>
        </div>

        {/* <br /> */}
        <div className="w-2/3">
          <textarea onChange={descriptionInput} id="message" rows={2} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={description === ''?("Something sad that will make me think of a life long gone, but not forgotten.."):(description)}></textarea>
          <p id="helper-text-explanation" className="mt-2 text-xs text-gray-500 dark:text-gray-400">Enter a description!</p>
        </div>

      </div>
    </form>
    <div ref={playlistDivRef} 
      className="overflow-auto max-h-64"
      >

            {playlist.map((song) => (
                        <SongCard key={song.songId} song={song} playlist={playlist} searchResults={results} setPlaylist={setPlaylist}/>
                    ))}
                    <div  />
            </div>
      <button onClick={savePlaylist} className={!loading?("bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"):("bg-gray-500 text-white font-bold py-2 px-4 rounded")} disabled={!loading?(false):(true)}>{!loading?('save'):('saving..')}</button>

      <>
        <button
          className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="button"
          onClick={() => setShowModal(true)}
        >
          add songs
        </button>
        {showModal ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
\                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">

                  <div className="relative p-2 flex-auto">
                    <Editor playlist={playlist} setPlaylist={setPlaylist} />
                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <button
                      onClick={savePlaylist}
                      className={!loading?("bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"):("bg-gray-500 text-white font-bold py-2 px-4 rounded")}
                      type="button"
                      disabled={!loading?(false):(true)}
                      >
                      {!loading?('save changes'):('saving..')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>


    </div>
  )

}

export default Playlist
import { useState } from "react"
import {useAuthHeader} from 'react-auth-kit'
import SongCard from "./SongCard"
import axios from "axios"
import { Song } from "../redux/slices/playlistsSlice"

interface EditorProps {
    playlist: Array<Song>
    setPlaylist: React.Dispatch<React.SetStateAction<Song[]>>
}

const Editor: React.FC<EditorProps> = ({ playlist , setPlaylist }) => {

    const authHeader = useAuthHeader()

    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    interface Song {
        id: string,
        song: string,
        artists: string,
        album: string,
        image: string,
        added: boolean
    }

    // const [playlist, setPlaylist] = useState<Song[]>([

    // ])

    const [results, setResults] = useState<Song[]>([]);

    function updateSearch(e: React.ChangeEvent<HTMLInputElement>){
        e.preventDefault()
        setSearch(e.target.value)
    }

    const enterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter'){
            e.preventDefault()
            querySpotify()
        }
    }

    async function querySpotify(){
        console.log('querying spotify for this track: ', search)

        try {
            setError(false)
            setLoading(true)
            const spotifyRes = await axios({
                method: 'POST',
                url: 'https://7kwip1fwr8.execute-api.us-east-1.amazonaws.com/Prod/spotify',
                data: { search },
                headers: {
                    "Authorization": authHeader(),
                    "content-type": "application/json"
                }
            })
            console.log(spotifyRes.data)
            const reducedData = spotifyRes.data.tracks.items.map((song:any) => {

                function getArtists(){
                    const artistArr = song.artists.map((artist:any) => {
                        return artist.name
                    })
                    return artistArr.join(', ')
                }

                return {
                    id: song.id,
                    song: song.name,
                    artists: getArtists(),
                    album: song.album.name,
                    image: song.album.images[2].url,
                    added: false
                }
            })
            setResults(reducedData)
            setLoading(false)
        } catch (error) {
            setError(true)
            setLoading(false)
            console.log(error)
        }
    }

    return(
        <div>
            <div className="overflow-auto max-h-64">

            {playlist.map((song) => (
                        <SongCard key={song.id} song={song} playlist={playlist} searchResults={results} setPlaylist={setPlaylist}/>
                    ))}
            </div>
            <br/>
            <form className="w-full max-w-sm ml-auto mr-auto">
                <div className="flex items-center border-b border-teal-500 py-2">
                    <input onKeyDown={enterKey} onChange={updateSearch}  className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Memory Reboot" aria-label="Full name" />
                    <div className="flex flex-row items-center">

                       <button onClick={querySpotify} className={!loading?("flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded"):("flex-shrink-0 border-transparent border-4 text-teal-800 text-sm py-1 px-2 rounded")} type="button" disabled={!loading?(false):(true)}>
                            {!loading?('search'):('searching..')}
                        </button>
                        
                        {loading?(
                        <div>
                            <svg aria-hidden="true" className="inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
                            {/* <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                            </span> */}
                        </div>
                        ):(
                            <></>
                        )}
                    </div>
                    
                </div>
            </form>
            <br />
            {results.length > 0? (
                <div className="overflow-auto h-64">
                    {results.map((song) => (
                        <SongCard key={song.id} song={song} playlist={playlist} searchResults={results} setPlaylist={setPlaylist}/>
                    ))}
                </div>
            ): (<></>)}
            {error?(
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 text-center" role="alert">
                <span className="font-medium">Api Error:</span> Search Failed 
            </div>
            ):(
                <></>
            )}
        </div>
    )
}

export default Editor
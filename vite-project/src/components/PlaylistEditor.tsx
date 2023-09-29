import { useEffect, useState } from "react"
import {useAuthHeader} from 'react-auth-kit'
import SongCard from "./SongCard"
import axios from "axios"

export default function Editor(){

    const authHeader = useAuthHeader()

    const [search, setSearch] = useState('')

    interface Song {
        id: string,
        song: string,
        artists: string,
        album: string,
        image: string,
        added: boolean
    }

    const [playlist, setPlaylist] = useState<Song[]>([
        // {
        //     id: "xyz987",
        //     song: "Morphine",
        //     artists: "The Ninjas",
        //     album: "The Ninjas",
        //     image: "https://i.scdn.co/image/ab67616d0000485142a71cca827a8d0abda07e49",
        //     added: true
        // }
    ])

    const [results, setResults] = useState<Song[]>([
        // {
        //     id: "abc123",
        //     song: "Memory Reboot",
        //     artists: "VØJ, Narvent",
        //     album: "Memory Reboot",
        //     image: "https://i.scdn.co/image/ab67616d0000485142a71cca827a8d0abda07e49",
        //     added: false
        // },
        // {
        //     id: "abc12",
        //     song: "All the small things",
        //     artists: "Blink182",
        //     album: "Enema",
        //     image: "https://i.scdn.co/image/ab67616d0000485142a71cca827a8d0abda07e49",
        //     added: false
        // },
        // {
        //     id: "ac123",
        //     song: "Simpson Wave",
        //     artists: "idk",
        //     album: "The Simpsons",
        //     image: "https://i.scdn.co/image/ab67616d0000485142a71cca827a8d0abda07e49",
        //     added: false
        // },
        // {
        //     id: "abc13",
        //     song: "Life goes on",
        //     artists: "Oliver tree",
        //     album: "Memory Reboot",
        //     image: "https://i.scdn.co/image/ab67616d0000485142a71cca827a8d0abda07e49",
        //     added: false
        // },
        // {
        //     id: "c123",
        //     song: "stellar",
        //     artists: "one heart",
        //     album: "Memory Reboot",
        //     image: "https://i.scdn.co/image/ab67616d0000485142a71cca827a8d0abda07e49",
        //     added: false
        // },
        // {
        //     id: "bc123",
        //     song: "Modern Jesus",
        //     artists: "Portugal the man",
        //     album: "Evil Friends",
        //     image: "https://i.scdn.co/image/ab67616d0000485142a71cca827a8d0abda07e49",
        //     added: false
        // },
        // {
        //     id: "xyz987",
        //     song: "Morphine",
        //     artists: "The Ninjas",
        //     album: "The Ninjas",
        //     image: "https://i.scdn.co/image/ab67616d0000485142a71cca827a8d0abda07e49",
        //     added: false
        // }
        // Add more initial songs as needed
      ]);

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
            const spotifyRes = await axios({
                method: 'POST',
                url: 'http://127.0.0.1:3000/spotify',
                data: { search },
                headers: {
                    Authorization: authHeader(),
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
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <div>
            {playlist.map((song) => (
                        <SongCard key={song.id} song={song} playlist={playlist} searchResults={results} setPlaylist={setPlaylist}/>
                    ))}
            <br/>
            <form className="w-full max-w-sm ml-auto mr-auto">
                <div className="flex items-center border-b border-teal-500 py-2">
                    <input onKeyDown={enterKey} onChange={updateSearch}  className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Memory Reboot" aria-label="Full name" />
                        <button onClick={querySpotify} className="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded" type="button">
                            Search
                        </button>
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
        </div>
    )
}
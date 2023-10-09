import React, { useEffect , useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTrack } from '../redux/slices/trackSlice';
import { Song } from '../redux/slices/playlistsSlice';

// interface Song {
//     id: string,
//     song: string,
//     artists: string,
//     album: string,
//     image: string,
//     added: boolean
// }

interface SongCardProps {
    song: Song;
    playlist: Array<Song>
    searchResults: Array<Song>
    setPlaylist: React.Dispatch<React.SetStateAction<Song[]>>
}

const SongCard: React.FC<SongCardProps> = ({ song , playlist , searchResults,  setPlaylist }) => {

    const [inPlayist, setInPlaylist] = useState(false)
    const dispatch = useDispatch()

    function addSong(){
        console.log('adding song: ', song.song)
        const updatedPlaylist = [...playlist, {
            id: song.id,
            song: song.song,
            artists: song.artists,
            album: song.album,
            image: song.image,
            added: true,
            songId: song.id
        }]
        setPlaylist(updatedPlaylist)
    }

    function removeSong(){
        console.log('removing song: ', song.song)
        const updatedPlaylist = playlist.filter((el) => {
            if(el.songId !== song.songId){
                return el
            }
        })
        setPlaylist(updatedPlaylist)
    }

    function playSong(){
        console.log(song.songId)
        dispatch(setTrack(song.songId))
    }

    useEffect(() => {

        const inArray = playlist.some((el) => el.songId === song.songId)
        if(inArray){
            setInPlaylist(true)
        }else{
            setInPlaylist(false)
        }

    },[playlist,searchResults])

    return (

        <div className="max-w-sm w-full lg:max-w-full lg:flex-wrap mb-2">

            <div className="border-r border-b border-t border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b rounded-t lg:rounded-b-none lg:rounded-r p-2 flex flex-col justify-between leading-normal bg-slate-400">

                <div className="flex items-center justify-between">
                    <div className='flex wrap items-center truncate'>

                    <img className="w-10 h-10 rounded-full mr-4" src={song.image} alt="Avatar of Jonathan Reinink" />
                    <div className="text-sm">
                        <div className="text-gray-900 font-bold text-l mb-2">{song.song}</div>
                        <p className="text-gray-900 leading-none">{song.artists}</p>
                        <p className="text-gray-600">{song.album}</p>
                    </div>
                    </div>
                    <div className='flex flex-col'>
                        {!song.added? (

                            inPlayist?(
                            <button 
                                className="bg-gray-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-3 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ml-3 ease-linear transition-all duration-150"
                                onClick={addSong}
                                disabled
                                >
                                Added
                            </button>

                            ):(
                                <button 
                                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-3 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ml-3 ease-linear transition-all duration-150"
                                onClick={addSong}
                                >
                                Add
                            </button>
                            )

                        ):(
                            <button 
                                className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ml-3 ease-linear transition-all duration-150"
                                onClick={removeSong}
                                >
                                Remove
                            </button>
                        )}
                        <button
                            onClick={playSong}
                            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ml-3 ease-linear transition-all duration-150">
                            play
                        </button>
                        
                    </div>

                </div>
            </div>
        </div>

    );
};

export default SongCard;

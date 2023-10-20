// import React, { useEffect , useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTrack , setCurrentPlaylist } from '../redux/slices/trackSlice';
import { Song } from '../redux/slices/playlistsSlice';



interface ExplorerSongCardProps {
    song: Song;
    playlist: Array<Song>

}

const ExplorerSongCard: React.FC<ExplorerSongCardProps> = ({ song , playlist }) => {

    const dispatch = useDispatch()


    function playSong(){
        console.log(song.songId)
        dispatch(setTrack(song.songId))
        dispatch(setCurrentPlaylist(playlist))
    }

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

export default ExplorerSongCard;

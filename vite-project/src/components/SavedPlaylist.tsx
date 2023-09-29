import React from "react"

interface Playlist {
    id: string,
    title: string,
    description: string
}

interface SavedPlaylistProps {
    playlist: Playlist,
    myPlaylists: Array<Playlist>,
    setMyPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>
}

const SavedPlaylist: React.FC<SavedPlaylistProps> = ({playlist, myPlaylists, setMyPlaylists}) => {

    function removePlaylist(){
        const updatedPlaylists = myPlaylists.filter((el) => {
            if(el.id !== playlist.id){
                return el
            }
        })
        setMyPlaylists(updatedPlaylists)
    }
    return (

        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{playlist.title}</h5>
            </a>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{playlist.description}</p>
            <button type="button" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">View / Edit</button>
            <button onClick={removePlaylist} type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Delete</button>

        </div>

    )
}

export default SavedPlaylist


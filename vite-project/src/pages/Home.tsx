import { useEffect, useState } from 'react'
import { useAuthUser } from 'react-auth-kit'
import PlaylistComponent from '../components/Playlist'
import { v4 as uuidv4 } from 'uuid';
import SavedPlaylist from '../components/SavedPlaylist';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { Playlist } from "../redux/slices/playlistsSlice"



export default function Home() {

    const reduxPlaylists = useSelector((state: RootState) => state.playlists)



    const [id, setId] = useState('')
    const auth = useAuthUser()
    console.log(auth())

    const [edit, setEdit] = useState(false)
    const [isActive, setIsActive] = useState(true);
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const handleClick = () => {
        setIsActive(!isActive);
      };

    function openEditor() {
        setId(uuidv4())
        setDescription('')
        setTitle('')
        if (edit) {
            setEdit(false)
        } else {
            setEdit(true)
        }
    }

    function spotify() {
        console.log('logging into spotify..')
        const clientId = '4b64cb148f49424a93854e6a8e955394';
        const redirectUri = 'http://localhost:5173/auth';
        const scopes = 'user-read-private'; // Modify as needed
        const state = 'randomly-generated-string'; // Optional but recommended for security

        const authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}&state=${state}`;
        window.location.href = authorizationUrl
    }

    useEffect(() => {
        console.log(reduxPlaylists.playlists)
    }, [])


    return (
        <div>
            <h1 className="text-3xl text-sky-600">{auth()?.message}, {auth()?.username}!</h1>
            <br />
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={openEditor}>
                {!edit ? ('create a playlist') : ('close editor')}
            </button>
            {!edit?(
            <button onClick={handleClick} className='ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                open saved playlist
            </button>

            ):(
                <></>
            )}

            {!edit ? (
                    <div 
                        id="drawer-right-example" 
                        className={isActive?(
                            "fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform translate-x-full bg-white w-80 dark:bg-gray-800"
                        ):(
                            "fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform bg-white w-80 dark:bg-gray-800"
                        )
                        } 
                        tabIndex={-1} 
                        aria-labelledby="drawer-right-label"
                        >
                        <h5 id="drawer-right-label" className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">Saved Playlists</h5>
                        <button onClick={handleClick} type="button" data-drawer-hide="drawer-right-example" aria-controls="drawer-right-example" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white" >
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close menu</span>
                        </button>
                        {reduxPlaylists.playlists.map((playlist) => (
                            //OFFCANVAS - STORES EACH PLAYLIST IN A CARD
                            <SavedPlaylist key={playlist.id} playlist={playlist} setId={setId} setTitle={setTitle} setDescription={setDescription} setEdit={setEdit}/>
                        ))}
                        
                    </div>
            ) : (<></>)}
            <br />
            {edit ? (
                //CURRENT PLAYLIST BEING EDITTED
                <PlaylistComponent id={id} title={title} description={description} edit={edit} setTitle={setTitle} setDescription={setDescription} setEdit={setEdit} />
            ) : (
                <div>
                    <br />
                    <p className='text-sky-200'>click above to get started</p>
                </div>
            )}
            <br />
            <br />

            <br />
            <br />
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => spotify()} >log in to spotify</button>

        </div>
    )
}
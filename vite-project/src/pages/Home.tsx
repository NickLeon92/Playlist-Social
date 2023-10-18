import { useEffect, useState } from 'react'
import { useAuthUser } from 'react-auth-kit'
import PlaylistComponent from '../components/Playlist'
import { v4 as uuidv4 } from 'uuid';
import SavedPlaylist from '../components/SavedPlaylist';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { setPlaylists } from "../redux/slices/playlistsSlice";
import { setToken, setRefresh, setExpiration } from '../redux/slices/tokenSlice';
import axios from 'axios';
import {useAuthHeader} from 'react-auth-kit'
import Player from '../components/Player';
import { useNavigate } from 'react-router-dom';

export default function Home() {

    const reduxPlaylists = useSelector((state: RootState) => state.playlists)
    // const track = useSelector((state: RootState) => state.track).track

    const navigate = useNavigate()
    const authHeader = useAuthHeader()
    const dispatch = useDispatch()
    const [id, setId] = useState('')
    const auth = useAuthUser()
    // console.log(auth())

    const [edit, setEdit] = useState(false)
    const [isActive, setIsActive] = useState(true);
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [player , setPlayer] = useState(false)
    const [loading, setLoading] = useState(true)

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
        const redirectUri = 'https://preprod--playlistener.netlify.app/auth';
        const scopes = 'streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state'; // Modify as needed
        const state = 'randomly-generated-string'; // Optional but recommended for security

        const authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}&state=${state}`;
        window.location.href = authorizationUrl
    }

    useEffect(() => {
        setLoading(true)
        console.log(auth())
        console.log(reduxPlaylists.playlists)
        async function getMyData(){
            const apiRes = await axios({
                method: 'post',
                url: 'https://7kwip1fwr8.execute-api.us-east-1.amazonaws.com/Prod/playlist-api',
                data: {action: 'read', payload:'users'},
                headers:{
                    "Authorization": authHeader(),
                    "content-type": "application/json"
                }
            })
            console.log(apiRes.data)
            const savePlaylists = apiRes.data.payload.playlists.map((el : any) => {
                return {
                    id: el.id,
                    title: el.title,
                    description: el.description,
                    songs: el.songs,
                    suggestedSongs: el.suggestedSongs
                }
            })
            dispatch(setPlaylists(savePlaylists))
            if(apiRes.data.payload.token_data){
                dispatch(setToken(apiRes.data.payload.token_data.access_token))
                dispatch(setRefresh(apiRes.data.payload.token_data.refresh_token))
                dispatch(setExpiration(apiRes.data.payload.token_data.expTime))
                setPlayer(true)
            }
            setLoading(false)
        }
        getMyData()
    }, [])

    return (
        <div>
            <h1 className="text-3xl text-sky-600">{!edit?(`${auth()?.message}, ${auth()?.username}!`):('')}</h1>
            <br />
            <button className='mr-4 mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={openEditor}>
                {!edit ? ('create a playlist') : ('close editor')}
            </button>
            {!edit?(
            <button onClick={handleClick} className='mr-4 mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                open saved playlist
            </button>

            ):(
                <></>
            )}
            <button onClick={() => navigate('/explore')} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                explore playlists!
            </button>
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
            {/* <br /> */}
            {edit ? (
                //CURRENT PLAYLIST BEING EDITTED
                <PlaylistComponent id={id} title={title} description={description} edit={edit} setTitle={setTitle} setDescription={setDescription} setEdit={setEdit} />
            ) : (
                <></>
            )}
            {/* <br />
            <br />

            <br /> */}
            <br />
            {!loading?(
                player?(
                    <Player />
                    ):
                    (<div>
                        <br />
                        <p className='text-sky-200'>authorize spotify and start creating playlists </p>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400" onClick={() => spotify()} >
                            authorize spotify
                            <span></span>
                            <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2931 2931" width="29" height="29"><path className="st0 ml-2" d="M1465.5 0C656.1 0 0 656.1 0 1465.5S656.1 2931 1465.5 2931 2931 2274.9 2931 1465.5C2931 656.2 2274.9.1 1465.5 0zm672.1 2113.6c-26.3 43.2-82.6 56.7-125.6 30.4-344.1-210.3-777.3-257.8-1287.4-141.3-49.2 11.3-98.2-19.5-109.4-68.7-11.3-49.2 19.4-98.2 68.7-109.4C1242.1 1697.1 1721 1752 2107.3 1988c43 26.5 56.7 82.6 30.3 125.6zm179.3-398.9c-33.1 53.8-103.5 70.6-157.2 37.6-393.8-242.1-994.4-312.2-1460.3-170.8-60.4 18.3-124.2-15.8-142.6-76.1-18.2-60.4 15.9-124.1 76.2-142.5 532.2-161.5 1193.9-83.3 1646.2 194.7 53.8 33.1 70.8 103.4 37.7 157.1zm15.4-415.6c-472.4-280.5-1251.6-306.3-1702.6-169.5-72.4 22-149-18.9-170.9-91.3-21.9-72.4 18.9-149 91.4-171 517.7-157.1 1378.2-126.8 1922 196 65.1 38.7 86.5 122.8 47.9 187.8-38.5 65.2-122.8 86.7-187.8 48z"/></svg>
                        </button>
                    </div>
                    )
                )
                :(<div className="flex flex-row items-center">
                    <p className="text-white mr-4 ml-4 ">
                        loading..   
                    </p>
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                    </span>
                </div>)
            }
            
        </div>
    )
}
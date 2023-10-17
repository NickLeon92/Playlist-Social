import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"
import {setCurrentAccessToken} from '../utils/getAccessToken'
import { useAuthUser, useAuthHeader } from 'react-auth-kit';
import { setToken, setExpiration } from '../redux/slices/tokenSlice';

export default function Player(){

    const auth = useAuthUser()
    const authHeader = useAuthHeader()
    const dispatch = useDispatch()

    const accessToken = useSelector((state: RootState) => state.token).token.access_token
    const refreshToken = useSelector((state: RootState) => state.token).token.refresh_token
    const expirationTime = useSelector((state: RootState) => state.token).token.expTime
    const track = useSelector((state: RootState) => state.track).track

    const trackUri = `spotify:track:${track}`

    // console.log('token: ', accessToken, ' track: ' , track)

    const [play, setPlay] = useState(false)

    useEffect(() => {
        console.log('track change detected')
        if(accessToken !== '' && refreshToken !== ''){
            console.log('playing new track with credentials:')
            console.log({accessToken, refreshToken, expirationTime})
            play()
        }
        async function play(){
            const refreshData =  await setCurrentAccessToken( auth()?.username, authHeader(), accessToken, refreshToken, expirationTime )
            console.log(refreshData)
            dispatch(setToken(refreshData.accessToken))
            dispatch(setExpiration(refreshData.expTime))
            setPlay(true)
        }
    },[track])

    if (accessToken === '' && refreshToken === ''){
         return null
    }
    return (
        // <div>
        //     Player
        // </div>

        <SpotifyPlayer
            token={accessToken}
            showSaveIcon
            callback={state => {
            if (!state.isPlaying) setPlay(false)
            }}
            play={play}
            uris={trackUri ? [trackUri] : []}
        />
    )
}
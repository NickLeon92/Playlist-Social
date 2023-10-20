import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"
import {setCurrentAccessToken} from '../utils/getAccessToken'
import { useAuthUser, useAuthHeader } from 'react-auth-kit';
import { setToken, setExpiration } from '../redux/slices/tokenSlice';
import { setTrack } from '../redux/slices/trackSlice';

export default function Player(){

    const auth = useAuthUser()
    const authHeader = useAuthHeader()
    const dispatch = useDispatch()

    const accessToken = useSelector((state: RootState) => state.token).token.access_token
    const refreshToken = useSelector((state: RootState) => state.token).token.refresh_token
    const expirationTime = useSelector((state: RootState) => state.token).token.expTime
    const track = useSelector((state: RootState) => state.track).track
    const playlist = useSelector((state: RootState) => state.track).playlist
    const [uris, setUris] = useState<string[]>([])
    // const trackUri = 'spotify:track:asdf'
    const [current, setCurrent] = useState('')
    const setTrackUris = () => {
        let i = 0
        function songPosition() {
            for(let song of playlist){
                console.log(song.song)
                if(track === song.songId){
                    console.log('song found')
                    return i
                }
                i++
            }
        }

        const num = songPosition()
        console.log(num)

        if(num){
            const firstHalf = playlist.slice(num)
            const secondHalf = playlist.slice(0, num - playlist.length)
            console.log(firstHalf)
            console.log(secondHalf)
            console.log([...firstHalf.map((el) => el.songId) , ...secondHalf.map((el) => el.songId)])
            setUris([...firstHalf.map((el) => `spotify:track:${el.songId}`) , ...secondHalf.map((el) => `spotify:track:${el.songId}`)])
        }else{
            setUris([`spotify:track:${track}`])
        }
    }
    // console.log('token: ', accessToken, ' track: ' , track)

    const [play, setPlay] = useState(false)

    useEffect(() => {
        console.log('track change detected')
        if(accessToken !== '' && refreshToken !== '' && current !== track){
            console.log('playing new track with credentials:')
            console.log({accessToken, refreshToken, expirationTime})
            play()
        }
        async function play(){
            const refreshData =  await setCurrentAccessToken( auth()?.username, authHeader(), accessToken, refreshToken, expirationTime )
            console.log(refreshData)
            dispatch(setToken(refreshData.accessToken))
            dispatch(setExpiration(refreshData.expirationTime))
            setTrackUris()
            // console.log(uris)
            // setPlay(true)
        }
    },[track])

    useEffect(() => {
        console.log(uris)
        setPlay(true)
    },[uris])

    if (accessToken === '' && refreshToken === ''){
         return null
    }
    return (
        // <div>
        //     Player
        // </div>
<div className='mt-2'>
    <SpotifyPlayer
        token={accessToken}
        showSaveIcon
        callback={state => {
        if (!state.isPlaying) setPlay(false)
        console.log(state.track)
        setCurrent(state.track.id)
        if(state.track.id !== track){
            dispatch(setTrack(state.track.id))
        }
        }}
        play={play}
        // uris={trackUri ? [trackUri] : []}
        uris={uris}
    />
</div>
    )
}
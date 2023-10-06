import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"

export default function Player(){

    const accessToken = useSelector((state: RootState) => state.token).token
    const track = useSelector((state: RootState) => state.track).track

    const trackUri = `spotify:track:${track}`

    console.log('token: ', accessToken, ' track: ' , track)

    const [play, setPlay] = useState(false)

    useEffect(() => {
        setPlay(true)
    },[track])

    if (accessToken === ''){
         return null
    }
    return (
        // <div>
        //     Player
        // </div>

        <SpotifyPlayer
            token={accessToken}
            showSaveIcon
            // callback={state => {
            // if (!state.isPlaying) setPlay(false)
            // }}
            play={play}
            uris={trackUri ? [trackUri] : []}
        />
    )
}
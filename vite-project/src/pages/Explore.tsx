import axios from "axios"
import { useEffect, useState } from "react"
import { useAuthHeader } from "react-auth-kit"
import ExplorerPlaylist from "../components/ExplorerPlaylist"
import Player from '../components/Player';


export default function Explore() {

  const authHeader = useAuthHeader()
  const [apiRes , setApiRes] = useState([])
  
  useEffect(() => {
    console.log('fetching playlists..')
    fetchPlaylists()

    async function fetchPlaylists(){
      const apiRes = await axios({
        method: 'post',
        url: 'https://7kwip1fwr8.execute-api.us-east-1.amazonaws.com/Prod/playlist-api',
        data: {action: 'read', payload:'playlists'},
        headers:{
            "Authorization": authHeader(),
            "content-type": "application/json"
        }
    })
    console.log(apiRes.data)
    setApiRes(apiRes.data.payload)
    }
  },[])
  return (

    <div className="text-white">

      <h1>Explore other user playlists!</h1>
      <Player />
      <br />
      {apiRes.map((playlist) => (
        <ExplorerPlaylist playlist={playlist} />
      ))}
    </div>

  )

}
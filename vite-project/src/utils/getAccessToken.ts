import axios from "axios"


export async function setCurrentAccessToken(username: string, authHeader: string, accessToken: string, refreshToken: string, expirationTime: Date){
    console.log('checking to see if token is up to date')
    const currentTime = new Date()
    console.log(`current time: ${currentTime} | exp Time: ${expirationTime}`)
        if( currentTime.getTime() > (new Date(expirationTime)).getTime() ){
            console.log('refreshing token')
            try {
                const apiRes = await axios({
                    method: 'post',
                    url: 'https://7kwip1fwr8.execute-api.us-east-1.amazonaws.com/Prod/spotify',
                    data: {
                        refresh_token: refreshToken,
                        username: username
                    },
                    headers:{
                        "Authorization": authHeader,
                        "content-type": "application/json"
                    }
                }) 
                console.log(apiRes.data)
                return {accessToken: apiRes.data.access_token, expirationTime: apiRes.data.expTime}
            } catch (error) {
                console.log(error)
                return {accessToken, expirationTime}
            }
        }
    console.log('token still fresh')
    return {accessToken, expirationTime}
}
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

function Auth() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code') || ''


    async function fetchData() {
        const params = new URLSearchParams();
        params.append('client_id', "1153431231950753982");
        params.append('client_secret', "2iDXCifIw6WTE-oEzrPmd-DtbknDURmo");
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', "http://localhost:5173/auth")
        try {
            const response = await axios.post('https://discord.com/api/oauth2/token',params)

            // Handle the response
            console.log(response.data);
        } catch (error) {
            // Handle errors
            console.error(error);
        }
        }
        
        useEffect(() => {
        fetchData();
    }, []);


    return <div>your code: {code}</div>
}
export default Auth
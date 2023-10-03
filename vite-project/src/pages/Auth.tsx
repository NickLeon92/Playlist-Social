import { useEffect, useState } from "react"
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import {useAuthUser} from 'react-auth-kit'
import { Link } from "react-router-dom";
import axios from "axios";

export default function Auth() {
    const auth = useAuthUser()
    const navigate = useNavigate()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code')

    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        console.log(`sending request code: ${code} to the server..`)
        async function sendCode() {
            try {
                const res = await axios({
                    method: 'POST',
                    url:'http://localhost:3000/auth',
                    data:{
                        username: auth()?.username,
                        code: code
                    },
                    headers: {
                        "content-type": "application/json",
                        // 'Access-Control-Allow-Origin': "http://localhost:5173"
                    }
                })
                console.log(res)
                setSuccess(true)
                setLoading(false)
                // navigate('/')
            } catch (error) {
                setLoading(false)
                console.log(error)
            }
        }
        sendCode()

    }, [])
    return (
        <div >
            <div className="flex flex-row items-center">
                {/* <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </span> */}
                <p className="text-white mr-4 ml-4 ">
                    Creating your spotify access token in the database..
                </p>
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </span>

            </div>
            <br/>
            {!loading? (

                success? (
                    <div>
                        <Link to='/'>
                            <button className='ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Success! Go home..</button>
                        </Link>
                    </div>
                ):(
                    <div>
                        <Link to='/'>
                            <button className='ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Failure :/ Go home..</button>
                        </Link>
                    </div>
                )
            ):(
                <></>
            )
            }
        </div>
    )
}
import { useEffect, useState } from "react"
import { useSignIn } from 'react-auth-kit'
import { useIsAuthenticated } from 'react-auth-kit'
import { useNavigate } from "react-router-dom"
import axios from "axios"
import linkdin from '../assets/linkdin-icon.png'
export default function LoginV2() {

    const isAuthenticated = useIsAuthenticated()
    const navigate = useNavigate()
    const signIn = useSignIn()

    const [newUser, setNewUser] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [match, setMatch] = useState(false)
    const [validated, setValidated] = useState(false)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessge] = useState('')

    const updateUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setUsername(e.target.value)
    }
    const updatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setPassword(e.target.value)
    }
    const updateConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setConfirmPassword(e.target.value)
    }

    function setMode() {
        setUsername('')
        setPassword('')
        setConfirmPassword('')
        if (!newUser) {
            setNewUser(true)
        } else {
            setNewUser(false)
        }
    }

    async function requestToken() {
        setLoading(true)
        const payload = {
            newUser,
            user: {
                username,
                password
            }
        }
        console.log(payload)
        try {
            const tokenRes = await axios({
                method: 'post',
                url: 'https://7kwip1fwr8.execute-api.us-east-1.amazonaws.com/Prod/login',
                data: payload
            })
            console.log(tokenRes.data)
            if(tokenRes.data.token){
                signIn({
                    token: tokenRes.data.token,
                    expiresIn: 3600,
                    tokenType: "Bearer",
                    authState: {username: tokenRes.data.user.username, message:tokenRes.data.message}
                })
                navigate('/')
            }else{
                setError(true)
                setErrorMessge(tokenRes.data.message)
                setLoading(false)
            }
        } catch (error:any) {
            console.log(error)
            setError(true)
            setErrorMessge(error.message)
            setLoading(false)
        }
    }

    useEffect(() => {
        if(password === confirmPassword){
            setMatch(true)
        }else{
            setMatch(false)
        }
    },[confirmPassword , password])

    useEffect(() => {
        console.log(password.length)
        if(password.length >= 5){
            setValidated(true)
        }else{
            setValidated(false)
        }
    },[password])

    if(!isAuthenticated()){
        return (
            <section >
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign in to your account
                            </h1>
                            {error?(<p className="text-red-500">Error: {errorMessage}</p>):(<></>)}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                                <input onChange={updateUsername} value={username} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="enter your username :)" />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input onChange={updatePassword} value={password} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            {newUser ? (
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password
                                        {match?(
                                            <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium mr-2 ml-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                            <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                                            match
                                        </span>
                                        ):(
                                            <span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium mr-2 ml-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                                            <span className="w-2 h-2 mr-1 bg-red-500 rounded-full"></span>
                                            not matching
                                        </span>
                                        )}
                                        {/* <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium mr-2 ml-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                            <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                                            Available
                                        </span> */}
                                    </label>
                                    <input onChange={updateConfirmPassword} value={confirmPassword} type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>
                            ) : (
                                <></>
                            )}
                            {!loading ? (
                                <button onClick={requestToken} 
                                    className={(newUser && match && validated) || !newUser ?
                                        ("mr-2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center")
                                        :
                                        ("mr-2 text-white bg-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center")} 
                                    disabled={(newUser && match && validated) || (!newUser) ?(false):(true)}>{newUser ? ('create user') : ('sign in')}</button>
                            ) : (
                                <div className="flex flex-row items-center">
                                    {/* <button onClick={requestToken} className="mr-2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">signing in..</button> */}
                                    <p className="mr-2 text-blue-500">logging you in..</p>
                                    <svg aria-hidden="true" className="inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                </div>
                            )}
                            {newUser && !validated?(
                                <p className="text-sm font-light dark:text-red-400">password must be 5 or more characters long..</p>
                            ):(<></>)}
                            <div>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    {newUser ? ("Already have an account?") : ("Don't have an account yet?")}
                                </p>
                                <button onClick={setMode} className="font-medium text-teal-500 text-primary-600 hover:underline dark:text-primary-500">{newUser ? ('Sign In') : ('Sign Up')}</button>
                            </div>
                        </div>
                    </div>
                    <br />
                <p className="text-gray-400">**note from the developer (me..Nick Leon) - I'm still waiting for Spotify to approve this app for any user to be able to authorize it to access their Spotify..</p>
                <p className="text-gray-400">If you'd like to demo all of this app's functionality, feel free to login with my testing account: username = "test" ; password = "test"</p>
                <p className="text-gray-400">Otherwise you can send me the email associated with your spotify account and I can manually onboard you to this app's approved users.</p>
                <p className="text-gray-400">Feel free to message me on linkedin (below) or email me at nicolas7@vt.edu</p>
                <a href="https://www.linkedin.com/in/nick-leon-5b338aa3/"><img src={linkdin} alt="" className="w-10"/></a>
                </div>
            </section>
        )
    }else{
        return(
            <div>
                you are now logged in!
            </div>
        )
    }
}
import { useState } from "react"
import { Formik, Field, Form, FormikHelpers } from "formik"
import { useSignIn , useSignOut } from 'react-auth-kit'
import {useIsAuthenticated} from 'react-auth-kit'
import { useNavigate } from "react-router-dom"
import axios from "axios"


interface Values {
    username: string;
    password: string;
}

function Login() {

    const isAuthenticated = useIsAuthenticated()
    const signOut = useSignOut()
    const navigate = useNavigate()

    const signIn = useSignIn()

    const [newUser, setNewUser] = useState(false)

    function setMode(){
        if(!newUser){
            setNewUser(true)
        }else{
            setNewUser(false)
        }
    }

    async function requestToken(userData:any){
        const tokenRes = await axios({
            method: 'post',
            url: 'https://7kwip1fwr8.execute-api.us-east-1.amazonaws.com/Prod/login',
            data: userData
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
        }

    }

    if(!isAuthenticated()){
        return (
            
            <div className="place-center w-1/2 flex flex-col ml-auto mr-auto">
                <Formik
                    initialValues={{
                        username: '',
                        password: ''
                    }}
                    onSubmit={(
                        values: Values,
                    ) => {
                        requestToken(values)
                    }}
                >
                   
                    <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">username</label>
                        <Field className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" name="username" type="text" placeholder="username" />
                        <br/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">password</label>
                        <Field className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" name="password" type="password" placeholder="************" />
                        <br/>
                    </div>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">login</button>
                    </Form>

                </Formik>
                <button className="text-white" onClick={setMode}>{!newUser?('create new user'):('login with existing user')}</button>

            
                {/* <form>login / sign-up</form>
                <br />
                <label>username</label>
                <input/>
                <br/>
                <label>password</label>
                <input/>
                <br />
                {!newUser?(
                <div>welcome back</div>
                ):(
                <div>
                    <label>confirm password</label>
                    <input/>
                </div>
                )}
                <br/>
                <button>login</button>
                <br/>
                <button onClick={setMode}>{!newUser?('create new user'):('login with existing user')}</button> */}
            </div>
        )
    }else{
        return(
            <div>
                <button onClick={() => signOut()}>
                    logout
                </button>
            </div>
        )
    }
}

export default Login
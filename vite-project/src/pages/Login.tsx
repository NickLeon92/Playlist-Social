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

function Auth() {

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
            url: 'http://localhost:3000/login',
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
            
            <div>
                <Formik
                    initialValues={{
                        username: '',
                        password: ''
                    }}
                    onSubmit={(
                        values: Values,
                        { setSubmitting }: FormikHelpers<Values>
                    ) => {
                        setTimeout(() => {
                            console.log(values)
                            setSubmitting(false);
                            requestToken(values)
                        }, 500);
                    }}
                >
                    <Form>
                        <label htmlFor="username">username</label>
                        <Field id="username" name="username" type="text" placeholder="John" />
                        <br/>
                        <label htmlFor="password">password</label>
                        <Field id="password" name="password" type="password" placeholder="Doe" />
                        <br/>
                        <button type="submit">Submit</button>
                    </Form>
                </Formik>
                <button onClick={setMode}>{!newUser?('create new user'):('login with existing user')}</button>
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

export default Auth
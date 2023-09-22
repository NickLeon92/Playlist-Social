import { useSignOut } from 'react-auth-kit'

export default function Home() {

    const signOut = useSignOut()

    return (
        <div>
            <h1>Playlist Builder</h1>
            <p className="read-the-docs">
                Welcome to the home page
            </p>
            <button onClick={() => signOut()} >logout</button>
            
        </div>
    )
}
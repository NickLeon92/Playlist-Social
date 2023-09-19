export default function Home() {

    const clientId = '1153431231950753982';
    const redirectUri = 'http://localhost:5173/auth';
    const scope = 'identify';

    async function handleLogin() {
        window.location.href = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`
    }

    return (
        <div>
            <h1>Playlist Builder</h1>

            <p className="read-the-docs">
                Login to get started
            </p>
            <button
                onClick={handleLogin}
            >
                login
            </button>
        </div>
    )
}
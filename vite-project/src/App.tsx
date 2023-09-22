import './App.css'
import Auth from './pages/Login'
import Home from './pages/Home'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RequireAuth } from 'react-auth-kit'

function App() {

  return (
    <>


      <Router>
        <Routes>

          <Route path={'/'} element={
            <RequireAuth loginPath={'/login'}>
              <Home />
            </RequireAuth>
          }/>

          <Route path="/login" Component={Auth} />

        </Routes>
      </Router>

    </>


  )
}

export default App

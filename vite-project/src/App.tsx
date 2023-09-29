import './App.css'
import Navbar from './components/Navbar';
import Login from './pages/Login'
import Auth from './pages/Auth';
import Home from './pages/Home'
import Explore from './pages/Explore';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RequireAuth } from 'react-auth-kit'

function App() {

  return (
    <>


      <Router>
        <Navbar />
        <div className='pt-16'>

        <Routes>

          <Route path={'/'} element={
            <RequireAuth loginPath={'/login'}>
              <Home />
            </RequireAuth>
          }/>

          <Route path="/login" Component={Login} />
          <Route path="/auth" Component={Auth} />
          <Route path="/explore" Component={Explore} />
        </Routes>
          </div>
      </Router>

    </>


  )
}

export default App

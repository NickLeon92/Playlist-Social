import './App.css'
import Auth from './pages/Auth'
import Home from './pages/Home'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <>


      <Router>
        <Routes>

          <Route path="/" Component={Home} />
          <Route path="/home" Component={Home} />
          <Route path="/auth" Component={Auth} />

        </Routes>

      </Router>

    </>


  )
}

export default App

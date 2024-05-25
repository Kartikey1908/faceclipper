import logo from './logo.svg';
import './App.css';
import toast from 'react-hot-toast';
import { Route,  Routes } from 'react-router';
import Home from './pages/Home';
import Error from './pages/Error';

function App() {

  const handleClick = () => {
    toast.success("Button is Clicked")
  }

  return (
    <div className="App">

      <Routes>
        <Route path={'/'} element={<Home/>}/>
        <Route path="*" element={<Error/>} />
      </Routes>
        
    </div>
  );
}

export default App;

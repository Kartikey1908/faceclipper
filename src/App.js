import logo from './logo.svg';
import './App.css';
import toast from 'react-hot-toast';
import { Route,  Routes } from 'react-router';
import Home from './pages/Home';
import Error from './pages/Error';
import ImageEditor from './pages/ImageEditor';
import Cropping from './pages/Cropping'
import ReactEasyCrop from './pages/ReactEasyCrop';
import OnlyCanvas from './pages/OnlyCanvas';
import Navbar from './components/common/Navbar';

function App() {



  return (
    <div className='w-screen min-h-screen flex flex-col font-inter relative z-0 '>

      <Navbar/>

      <Routes>
        <Route path={'/'} element={<Home/>}/>
        <Route path={'/image-editor'} element={<ImageEditor/>}/>
        <Route path={'/cropping'} element={<Cropping/>}/>
        <Route path={'/react-easy-crop'} element={<ReactEasyCrop/>}/>
        <Route path={'/canvas-only'} element={<OnlyCanvas/>}/>



        <Route path="*" element={<Error/>} />
      </Routes>
        
    </div>
  );
}

export default App;

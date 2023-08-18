import './App.css';
import { UpdatePage } from './pages/update/UpdatePage';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { TestPage } from './pages/update/test/test.page';
import { IndexPage } from './pages/index/IndexPage';
import { AvailablePage } from './pages/update/available/AvailablePage';
import { DownloadingPage } from './pages/update/downloading/DownloadingPage';
import { DownloadedPage } from './pages/update/downloaded/DownloadingPage';

export default function App() {
  return (
    <div className="App">      
      <HashRouter>
        <Routes>
          <Route index={true} path="/" element={<IndexPage />}></Route>
          <Route path="/update/*" element={<UpdatePage />}>
            <Route path="test" element={<TestPage />}></Route>
            <Route path="available" element={<AvailablePage />}></Route>  
            <Route path="downloading" element={<DownloadingPage />}></Route>
            <Route path="downloaded" element={<DownloadedPage />}></Route>  
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

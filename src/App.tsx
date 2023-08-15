import './App.css';
import { UpdatePage } from './pages/update/UpdatePage';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { TestPage } from './pages/update/test/test.page';

export default function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/update/*" element={<UpdatePage />}>
            <Route path="test" element={<TestPage />}></Route>  
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

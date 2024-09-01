import logo from './logo.svg';
import './App.css';
import ZipCodeForm from './components/ZipCodeForm';
import ErrorBoundary from './components/ErrorBoundary';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="my-app" element={<ZipCodeForm/>} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

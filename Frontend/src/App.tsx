import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CreateAccount from './pages/CreateAccount';
import UploadSummary from './pages/UploadSummary';
import DeleteAccount from './pages/DeleteAccount';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/createAccount" 
          element={
            <ProtectedRoute>
              <CreateAccount />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/uploadSummary" 
          element={
            <ProtectedRoute>
              <UploadSummary />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/deleteAccount" 
          element={
            <ProtectedRoute>
              <DeleteAccount />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Header from './components/Header';
import CharacterCanvas from './components/CharacterCanvas';
import ChallengesSection from './components/ChallengesSection';
import Forum from './components/Forum';
import Login from './components/Login';
import Register from './components/Register';
import AdminChallenges from './components/AdminChallenges';
import ReportTable from './components/ReportTable.jsx';
import Posts from './pages/Posts';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <CharacterCanvas />
              <ChallengesSection />
              <Forum />
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/comments" element={<Forum />} />
          <Route path="/challenges" element={<ChallengesSection />} />
          <Route path="/admin/challenges" element={<AdminChallenges />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reports" element={<ReportTable/>} />
          <Route path="/publicaciones" element={<Posts />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
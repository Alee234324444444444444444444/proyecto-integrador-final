import Navbar from './components/Navbar';
import Header from './components/Header';
import CharacterCanvas from './components/CharacterCanvas';
import ChallengesSection from './components/ChallengesSection';
import './index.css';
import Forum from './components/Forum';
import React, { useState } from 'react';


function App() {
  

  return (
    <div>
      <Navbar />
      <Header />
      <CharacterCanvas />
      <ChallengesSection />
      <Forum />
    </div>
  );
}

export default App;

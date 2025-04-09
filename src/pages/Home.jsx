import React from "react";
import '../styles/Home.css';
import MiningCircle from "../components/MiningCircle";
import CryptoList from '../components/CryptoList'; // adapte le chemin si besoin
import DinoLauncher from "../components/DinoLauncher";

const Home = ({ points, setPoints, level, setLevel }) => {
  return (
    <div className="home">
      <div className="home">
         {/* autres composants */}
      <DinoLauncher />
      <CryptoList />
      
      </div>
      <MiningCircle points={points} setPoints={setPoints} level={level} setLevel={setLevel} />
    </div>
  );
};

export default Home;

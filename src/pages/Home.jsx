import React from "react";
import './Home.css';
import MiningCircle from "../components/MiningCircle";
import CryptoList from '../components/CryptoList';
import { Link } from "react-router-dom";
import dinoIcon from "../assets/dinoGame/dino-icon.png";
import "../styles/DinoLauncher.css";

const Home = ({ points, setPoints, level, setLevel }) => {
  return (
    <div className="home">
    <div className="dino-launcher">
      <Link to="/dino">
        <img src={dinoIcon} alt="Play Dino Game" />
      </Link>
    </div>
    <CryptoList />
    <MiningCircle points={points} setPoints={setPoints} level={level} setLevel={setLevel} />
  </div>
  
  );
};

export default Home;

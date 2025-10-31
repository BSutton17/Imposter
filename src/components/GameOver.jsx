import "../App.css";
import { useEffect, useState } from "react";
import prompt from '../hypo.json';
import { useGameContext } from "./Context";
import Voting from "./Voting";

function GameDisplay({ socket, room, name }) {
  
  const { logout } = useGameContext();
  return (
    <>
    <h1>Game Over!</h1>
    <h2>You have been voted out</h2>
    </>
  );
}

export default GameDisplay;
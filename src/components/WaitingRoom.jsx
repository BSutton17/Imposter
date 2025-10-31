import React from "react";
import { useEffect, useState } from "react";
import { useGameContext } from "./Context";
function WaitingRoom({ isAdmin, players, startGame, code }) {
  const { imposterCount, setImposterCount } = useGameContext();
  console.log('DEBUG: Current imposterCount =', imposterCount);
  return (
    <div className="waiting_room">
      {isAdmin ? (
        <h1>Game Code: {code}</h1>
      ) : (
        <h1>Waiting for Players</h1>
      )}
      <ul>
        {players.map((player, index) => (
          <li className="playerList" key={index}>{player.name}</li>
        ))}
      </ul>
      {isAdmin && (
        <>
          <label >Imposter Count:</label>
          <input
            type="number"
            min={1}
            max={4}
            value={imposterCount}
            onChange={e => setImposterCount(Math.max(1, Math.min(4, Number(e.target.value))))}
            style={{width: '50px', marginRight: '12px'}}
          />
          <button
            onClick={startGame}
            className="start-button"
            disabled={imposterCount < 1 || imposterCount > 4}
          >
            Start Game
          </button>
        </>
      )}
    </div>
  );
}

export default WaitingRoom; 
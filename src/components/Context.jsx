import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const useGameContext = () => {
  return useContext(GameContext);
};

export const GameProvider = ({ children }) => {
    const [joined, setJoined] = useState(false);
    const [playerCount, setPlayerCount] = useState(0);
    const [imposter, setImposter] = useState(false);
    const [isAdmin, setAdmin] = useState(false);
    const [player, setPlayer] = useState({})
    const [players, setPlayers] = useState([]);
    const [results, setResults] = useState(false);
    const [imposterCount, setImposterCount] = useState(1);
    
  const [endRound, setEndRound] = useState(false);
    
    const logout = () => {
        // Reset all game state
        setJoined(false);
        setPlayerCount(0);
        setImposter(false);
        setAdmin(false);
        setPlayer({});
        setPlayers([]);
        setResults(false);
        // Reload the page to fully reset
        window.location.reload();
    };

  return (
    <GameContext.Provider
      value={{
        joined,
        setJoined,
        playerCount,
        setPlayerCount,
        imposter,
        setImposter,
        isAdmin,
        setAdmin,
        players,
        setPlayers,
        player,
        setPlayer,
        results, 
        setResults,
        logout,
        endRound,
        setEndRound,
        imposterCount,
        setImposterCount,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
export default GameContext;
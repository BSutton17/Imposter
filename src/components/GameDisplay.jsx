import "../App.css";
import { useEffect, useState } from "react";
import prompt from '../hypo.json';
import { useGameContext } from "./Context";
import Voting from "./Voting";

function GameDisplay({ socket, room, name, imposterList = [] }) {
  const [word, setWord] = useState("");
  const { endRound, setEndRound, imposter, isAdmin, setIsAdmin, players, setPlayers } = useGameContext();

    const getRandomPrompt = () => {
        const randomIndex = Math.floor(Math.random() * prompt.length);
        const selectedWord = prompt[randomIndex];
        setWord(selectedWord);
        console.log("Selected word:", selectedWord);
        socket.emit("set_word", room, selectedWord);
    }

    const endTheRound = () => {
      setEndRound(true);
      socket.emit("end_round", room);
    }

  useEffect(() => {
    socket.on("display_word", (receivedWord) => {
      setWord(receivedWord);
    });
    socket.on("end_round_ack", () => {
      setEndRound(true);
    });
    return () => {
      socket.off("display_word");
    }
  }, [word]);

  return (
    <>
    {name == "jaden" || name == "Jaden" && <h1 className="monkey">You're a monkey</h1>}
    {name == "fatherless" || name == "Fatherless" || name == "FATHERLESS" && <h1 className="monkey">Get a father</h1>}
    {!endRound ? (
      <>
      <div className="game-display">
          {imposter ? (
            <>
              <h2 className="imposter">Imposter</h2>
              {imposterList.length > 1 && (
                <div>
                  <h4>Other Imposters:</h4>
                  <ul>
                    {imposterList.filter(n => n !== name).map((other, idx) => (
                      <li key={idx}>{other}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <h2>{word}</h2>
          )}
          {isAdmin && <button onClick={getRandomPrompt}>Next Word</button> }
        </div><div>{isAdmin && <button onClick={endTheRound}>End Round</button>}</div>
        </>
      ) : (
        <Voting socket={socket} players={players} room={room} name={name} />
      )}
    </>
  );
}

export default GameDisplay;
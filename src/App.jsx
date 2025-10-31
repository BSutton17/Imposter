import "./App.css";
import { useEffect, useState, useContext } from "react";
import GameDisplay from "./components/GameDisplay";
import WaitingRoom from "./components/WaitingRoom";
import { useGameContext } from "./components/Context";
import EndOfGame from "./components/EndOfGame";

function App({ socket, room, name }) {
  const [displayGame, setDisplayGame] = useState(false);
  const [answers, setAnswers] = useState({});
  const [password, setPassword] = useState("");
  const [usedDaresBuffer, setUsedDaresBuffer] = useState([]);

  const { imposterCount, setImposterCount, results, setResults, imposter, setImposter, isAdmin, setAdmin, players, setPlayers, player, setPlayer } = useGameContext();
  const [imposterList, setImposterList] = useState([]);

  useEffect(() => {
    socket.emit("join_room", room, name);

    socket.on("updatePlayerList", (playerList) => {
      setPlayers([...playerList]);
    });

    socket.on("gameStarted", () => {
      setDisplayGame(true);
    });

    socket.on("setImposter", (imposterNames) => {
      // imposterNames can be a string (legacy) or array (new logic)
      if (Array.isArray(imposterNames)) {
        setImposter(imposterNames.includes(name));
        setImposterList(imposterNames);
      } else {
        setImposter(name === imposterNames);
        setImposterList([imposterNames]);
      }
    });

    socket.on("reset_game", () => {
      setResults(false); 
      setDisplayGame(true); 
    });

    return () => {
      socket.off("updatePlayerList");
      socket.off("gameStarted");
      socket.off("display_options");
      socket.off("reset_game");
      socket.off("setImposter"); 
    };
  }, [room, name]);

  useEffect(() => {

    socket.on("receive_answers", (receivedAnswers) => {
      setAnswers(receivedAnswers);
    });

    socket.on("show_results", (data) => {
      setResults(data);
    });

    socket.on("setImposter", (imposterName) => {
      if (name === imposterName) {
        setImposter(true);
      } 
    });

    return () => {
      socket.off("receive_answers");
      socket.off("all_answers_received");
      socket.off("setImposter");
    };
  }, []);

  useEffect(() => {
    if (password == "a") {
      setAdmin(true); 
    } else {
      setAdmin(false); 
    }

    console.log("password:", password);
    console.log(isAdmin)
  }, [password]);

  const startGame = () => {
    if (isAdmin) {
      socket.emit("startGame", room, imposterCount);
    }
  };

  const reset = () => {
    getRandomPrompt();
    socket.emit("reset_game", room);
  };

  return (
    <>
      {!displayGame ? (
          <WaitingRoom
            isAdmin={isAdmin}
            players={players}
            startGame={startGame}
            code={room}
          />
      ) : !results ? (
        <GameDisplay
          socket={socket}
          room={room}
          name={name}
          imposterList={imposterList}
        />
      ) : (
        <div className="playerAnswersSection">

          {isAdmin && <button className="nextRoundBtn" onClick={reset}>Next Round</button>}
        </div>
      )}
      <input 
        id='secret' 
        value={password} 
        onChange={(event) => setPassword(event.target.value)} 
      />
      <EndOfGame socket={socket} />
    </>
  );
}

export default App;
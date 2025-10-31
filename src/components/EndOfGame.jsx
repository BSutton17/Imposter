import { useEffect, useState } from "react"

function EndOfGame({ socket }) {
  const [impostersLose, setImpostersLose] = useState(false);
  const [impostersWin, setImpostersWin] = useState(false);

  useEffect(() => {
    function handleImpostersLose() {
      setImpostersLose(true);
      setTimeout(() => {
        setImpostersLose(false);
      }, 10000);
    }
    function handleImpostersWin() {
      setImpostersWin(true);
      setTimeout(() => {
        setImpostersWin(false);
      }, 10000);
    }
    socket.on("imposters_lose", handleImpostersLose);
    socket.on("imposters_win", handleImpostersWin);
    return () => {
      socket.off("imposters_lose", handleImpostersLose);
      socket.off("imposters_win", handleImpostersWin);
    };
  }, [socket]);

  return (
    <>
    <div className={impostersWin || impostersLose ? "end-of-game" : "hide"}>
        {impostersLose && <h1>Imposters Lose!</h1>}
        {impostersWin && <h1>Imposters Win!</h1>}
    </div>
    </>
  );
}

export default EndOfGame;

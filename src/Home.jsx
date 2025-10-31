import "./App.css";
import io from "socket.io-client";
import App from "./App";
import { useState, useEffect } from "react";

const socket = io.connect("http://localhost:3001");
function Home() {
  const [room, setRoom] = useState("");       
  const [name, setName] = useState("");       
  const [isJoining, setIsJoining] = useState(false); 

  // Load saved name and room from localStorage on first load
  useEffect(() => {
    const savedName = localStorage.getItem("name");
    const savedRoom = localStorage.getItem("room");

    if (savedName && savedRoom) {
      setName(savedName);
      setRoom(savedRoom);
      setIsJoining(true);

      socket.emit("join_room", savedRoom, savedName); 
    }
  }, []);


  const joinRoom = () => {
    if (room !== "" && name !== "") {

      localStorage.setItem("name", name);
      localStorage.setItem("room", room);

      socket.emit("join_room", room, name); 
      setIsJoining(true);
    } else {
      alert("Please enter a valid room and name.");
    }
  };

  // Start a new room (this can just be for regular players, no admin logic)
  const startRoom = () => {
    if (name === "") {
      alert("Please enter a valid name.");
      return;
    }

    // Generate random 4-digit room ID
    const newRoom = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    const strRoom = String(newRoom);

    // Simulate typing room ID character by character
    setRoom("");
    setTimeout(() => setRoom(strRoom.substring(0, 3)), 30);
    setTimeout(() => setRoom(strRoom), 60);

    setTimeout(() => {
      localStorage.setItem("name", name);
      localStorage.setItem("room", strRoom);

      socket.emit("join_room", strRoom, name);
      setIsJoining(true);
      console.log("Started room:", strRoom);
    }, 20);
  };

  // Get rid of the saved data
  const logout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("room");
    window.location.reload(); 
    socket.emit("disconnect");
  };

  return (
    <div>
      {!isJoining ? (
        <div className="case">
          <h1 id="title">Imposter</h1>
          <div className="name_input">
            <input
              placeholder="Name..."
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <input
              placeholder="Room Id..."
              type="number"
              value={room}
              onChange={(event) => setRoom(event.target.value)}
            />
            <button onClick={joinRoom}>Join Room</button>
            <button onClick={startRoom}>Start Room</button>
          </div>
        </div>
      ) : (
        <div>
          <App socket={socket} room={room} name={name}/>
          <button onClick={logout}>Leave Game</button>
        </div>
      )}
    </div>
  );
}

export default Home;
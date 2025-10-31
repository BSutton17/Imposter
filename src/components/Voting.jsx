import { useRef, useEffect, useState } from "react";
import { useGameContext } from "./Context";
import GameOver from "./GameOver";

function Voting({ socket, players, name, room }) {
	const [selected, setSelected] = useState(null);
	const [hasVoted, setHasVoted] = useState(false);
	const [votes, setVotes] = useState({});
	const [votingOver, setVotingOver] = useState(false);
	const [votedOut, setVotedOut] = useState(null);
	const firstVotedOutRef = useRef(null);
	const [timer, setTimer] = useState(30);
	const [localPlayers, setLocalPlayers] = useState(players || []);
	const localPlayersRef = useRef(players || []);
	const { setEndRound } = useGameContext();

	useEffect(() => {
		localPlayersRef.current = localPlayers;
	}, [localPlayers]);

	useEffect(() => {
		// Listen for eliminated event from server
		socket.on("eliminated", () => {
			setVotedOut(name);
			setVotingOver(true);
			socket.disconnect();
		});
		return () => {
			socket.off("eliminated");
		};
	}, [name, socket]);

	useEffect(() => {
		setHasVoted(false);
		setVotes({});
		setVotedOut(null);
		setTimer(30);
		setLocalPlayers(players || []);

	},[]);

	// Start timer and listen for votes/results
	useEffect(() => {
		const interval = setInterval(() => {
			setTimer((t) => {
				if (t <= 1) {
					clearInterval(interval);
					endVoting();
					return 0;
				}
				return t - 1;
			});
		}, 1000);

		// Register all socket event handlers as siblings
		function voteUpdateHandler(voteCounts) {
			setVotes(voteCounts);
			const totalVotes = Object.values(voteCounts).reduce((a, b) => a + b, 0);
			const totalPlayers = localPlayersRef.current.length;
			if (totalVotes >= totalPlayers) {
				clearInterval(interval);
				endVoting();
			}
		}
		function updatePlayerListHandler(updatedPlayers) {
			setLocalPlayers(() => updatedPlayers);
		}
		function votingResultHandler(outName) {
				firstVotedOutRef.current = outName;
				setVotedOut(outName);
				setVotingOver(true);
				setLocalPlayers(prevPlayers => prevPlayers.filter(p => p.name !== outName));
				setTimeout(() => {
					if(outName !== name) {
						setEndRound(false);
					}
				}, 3000);
				setTimeout(() => {
					socket.emit("reset_game_after_voting", room, outName);
				}, 1000);
		}

		socket.on("vote_update", voteUpdateHandler);
		socket.on("updatePlayerList", updatePlayerListHandler);
		socket.on("voting_result", votingResultHandler);

		return () => {
			clearInterval(interval);
			socket.off("vote_update", voteUpdateHandler);
			socket.off("updatePlayerList", updatePlayerListHandler);
			socket.off("voting_result", votingResultHandler);
		};
		// eslint-disable-next-line
	}, [players, room, socket, name, setEndRound]);

	const submitVote = () => {
		if (selected && !hasVoted) {
			console.log("Submitting vote for:", selected.name);
			socket.emit("submit_vote", room, selected.name);
			setHasVoted(true);
		}
	};

	function endVoting() {
		setVotedOut(firstVotedOutRef.current);
		socket.emit("end_voting", room);
	}

	return (
		<div className="voting">
			{!votingOver ? (
				<>
					<h2>Voting ({timer}s left)</h2>
					<div className="player-buttons">
						{localPlayers && localPlayers.map((player) => (
							<button
								key={player.name}
								className={selected && selected.name === player.name ? "selected" : ""}
								onClick={() => setSelected(player)}
								disabled={hasVoted}
							>
								{player.name}
							</button>
						))}
					</div>
					<button onClick={submitVote} disabled={!selected || hasVoted}>
						Submit Vote
					</button>
				</>
			) : (
				<div className="voting-result">
					{firstVotedOutRef.current !== null ? (
						firstVotedOutRef.current === name ? (
							<>
								<GameOver />
							</>
						) : (
							<h3><span className="highlight">{firstVotedOutRef.current}</span> was voted out!</h3>
						)
					) : (
						<>
							<h3>Vote ended in a tie - no one was eliminated</h3>
						</>
					)}
				</div>
			)}
		</div>
	);
}

export default Voting;

import { useCallback, useEffect, useState } from "react";
import socket from "../utils/Socket";




export default function Game() {

    const [isX, setIsX] = useState(true);
    const [squareArray, setSquareArray] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const currentSquares = squareArray[currentMove];

    // join room ka state
    const [roomId, setRoomId] = useState<string>("");

    // player turn ka state
    const [turn, setTurn] = useState<string>("");


    const jumpTo = useCallback((nextMove: number) => {
        setCurrentMove(nextMove);
        setIsX(nextMove % 2 === 0);

    }, [])

    useEffect(() => {

        socket.on("receive_updated_squares", (data) => {
            console.log("user connected.");
            const nextTransferedArray = [...squareArray, data];
            setSquareArray(nextTransferedArray);
            setCurrentMove(nextTransferedArray.length - 1);
            setIsX(!isX);
        })

        socket.on("error", (error) => {
            alert(error);
        })

        return () => {
            socket.off("receive_updated_squares");
            socket.off("error");
        }


    }, [squareArray, isX])

    useEffect(() => {
        socket.on("game_start", ({turn} : {turn : string}) => {
            console.log("All players reached in room : ", roomId);
            setTurn(turn);
            console.log("Turn : ", turn);
        })

        return () => {
            socket.off("game_start");
        }


    }, [roomId]);

    useEffect(() => {

        socket.on("turn_update", ({turn} : {turn : string}) => {
            setTurn(turn);
            console.log("Turn : ", turn);
        })


    }, [setTurn]);




    function handlePlay(nextSquares: string[]) {

        if(socket.id !== turn){
            console.log("not your turn , TurnId : " , turn);
            return;
        }


        socket.emit('send_squares', nextSquares);

        const nextHistory = [...squareArray.slice(0, currentMove + 1), nextSquares]
        setSquareArray(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        setIsX(!isX);

    }

    const moves = squareArray.map((squares, move) => {
        let description;
        if (move > 0) {
            description = "Go to move #" + move;
        } else {
            description = "Go to game start";
        }

        return (
            <li key={move}>
                <button onClick={
                    () => jumpTo(move)
                } className="past border-1 m-2 p-4 size-fit">{description}</button>
            </li>
        )

    })



    function joinRoom(roomId: string) {


        if (roomId === "") {
            return;
        }

        socket.emit("join_room", roomId);
        console.log("Socket" , socket);
        console.log("Socket ID : " , socket.id);
        socket.on("joined_room_full", ({ success, reason }) => {

            if (success) {
                console.log("Joined Room : ", roomId);
            } else {
                alert(reason);
            }

        })
    }

    return (
        <div className="outer-body">

            <div className="board-game">
                <Board square={currentSquares} isX={isX} onPlay={handlePlay} />
            </div>
            <div className="flex flex-col">
                <div className="">History</div>
                <ol className="grid grid-cols-5">{moves}</ol>

            </div>

            <div className="roomId_outer_shell">
                <input onChange={(e) => {
                    setRoomId(e.target.value)
                 
                }
                } type="text" className="roomId_input_box border-1 p-2" />
                <button onClick={() => {
                    joinRoom(roomId)
                }} className="roomId_transfer_button border-1 p-3 m-2">Join Room</button>
            </div>

        </div>
    )
}


function Board({ square, isX, onPlay }: { square: string[], isX: boolean, onPlay: (something: string[]) => void }) {

    const winner = calculateWinner(square);

    let status;

    if (winner) {
        status = "Winner : " + winner
    } else {
        status = "Next Player : " + (isX ? "X" : "O");
    }

    function handleClick(i: number) {

        if (square[i] || calculateWinner(square)) {
            console.log(calculateWinner(square));
            return;
        };

        const nextSquares = square.slice();
        if (square[i] != null) return;

        nextSquares[i] = isX ? "X" : "O";

        onPlay(nextSquares);

        return;

    }

    return (<>

        <div className="status border-1 p-3 m-5">
            {status}
        </div>

        <div className="board">

            <div className="board-row flex">
                <Square value={square[0]} onSquareClick={() => { handleClick(0) }} />
                <Square value={square[1]} onSquareClick={() => { handleClick(1) }} />
                <Square value={square[2]} onSquareClick={() => { handleClick(2) }} />
            </div>
            <div className="board-row flex">
                <Square value={square[3]} onSquareClick={() => { handleClick(3) }} />
                <Square value={square[4]} onSquareClick={() => { handleClick(4) }} />
                <Square value={square[5]} onSquareClick={() => { handleClick(5) }} />
            </div>
            <div className="board-row flex">
                <Square value={square[6]} onSquareClick={() => { handleClick(6) }} />
                <Square value={square[7]} onSquareClick={() => { handleClick(7) }} />
                <Square value={square[8]} onSquareClick={() => { handleClick(8) }} />
            </div>
        </div>
    </>

    )
}



interface SquareTypes {
    value: string,
    onSquareClick: () => void


}

function Square({ value, onSquareClick }: SquareTypes) {


    return (
        <button
            onClick={onSquareClick}
            className="square border m-1 p-0 h-16 w-16 text-2xl"
        >
            {value}
        </button>

    )
}



function calculateWinner(squares: string[]) {

    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {

        const [a, b, c] = lines[i];

        if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
            return squares[a];
        }
    }

    return null;

}
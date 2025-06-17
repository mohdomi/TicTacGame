import { useEffect, useState } from "react";
import socket from "../utils/Socket";

export default function Game() {
    const [isX, setIsX] = useState(true);
    const [squareArray, setSquareArray] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const currentSquares = squareArray[currentMove];

    // player turn ka state
    const [turn, setTurn] = useState<string>("");

    // const jumpTo = useCallback((nextMove: number) => {
    //     setCurrentMove(nextMove);
    //     setIsX(nextMove % 2 === 0);
    // }, [])


    const [messages, setMessages] = useState<{ text: string }[]>([]);
    const [input, setInput] = useState("");


    useEffect(() => {
        socket.on("receive_updated_squares", (data) => {
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
        socket.on("game_start", ({ turn }: { turn: string }) => {
            setTurn(turn);
            console.log("Turn : ", turn);
        })

        return () => {
            socket.off("game_start");
        }
    }, []);

    useEffect(() => {
        socket.on("turn_update", ({ turn }: { turn: string }) => {
            setTurn(turn);
            console.log("Turn : ", turn);
        })
    }, [setTurn]);

    function handlePlay(nextSquares: string[]) {
        if (socket.id !== turn) {
            console.log("not your turn , TurnId : ", turn);
            return;
        }

        socket.emit('send_squares', nextSquares);

        const nextHistory = [...squareArray.slice(0, currentMove + 1), nextSquares]
        setSquareArray(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        setIsX(!isX);
    }

    // const moves = squareArray.map((squares, move) => {
    //     let description;
    //     if (move > 0) {
    //         description = "Go to move #" + move;
    //     } else {
    //         description = "Go to game start";
    //     }

    //     return (
    //         <li key={move}>
    //             <button
    //                 onClick={() => jumpTo(move)}
    //                 className="past border border-gray-300 rounded-lg m-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-emerald-300 hover:from-emerald-200 hover:to-emerald-400 transition-colors shadow text-gray-700 font-medium"
    //             >
    //                 {description}
    //             </button>
    //         </li>
    //     )
    // })

    useEffect(
        () => {

            socket.on('receive_message', (data) => {
                console.log("message : ", data);
                setMessages(prev => [...prev, data]);

            })

            return () => {
                socket.off('receive_message');
            }

        }, [])



    const sendMessage = () => {

        if (input.trim() === '') return;

        const message = {
            text: input
        }

        socket.emit('send_message', message);
        setMessages([...messages, message]);
        setInput("");
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-200 to-emerald-300">
            <div className="flex flex-col md:flex-row gap-8 bg-gradient-to-br from-emerald-200 to-emerald-400 border-1 border-emerald-600 rounded-xl shadow-xl/20 p-8">
            <div className="flex flex-col items-center">
                <Board square={currentSquares} isX={isX} onPlay={handlePlay} />
            </div>
            <div className="flex flex-col w-80 bg-emerald-50 rounded-lg shadow p-4">
                <div className="flex-1 mb-4">
                <ul className="space-y-2 overflow-y-hidden h-full">
                    {messages.map((item, idx) => (
                    <li key={idx} className="bg-white rounded px-3 py-1 shadow text-gray-700">{item.text}</li>
                    ))}
                </ul>
                </div>
                <div className="flex">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    type="text"
                    className="flex-1 rounded-l px-3 py-2 border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white"
                    placeholder="Type a message..."
                />
                <button
                    onClick={sendMessage}
                    className="rounded-r bg-emerald-200  text-emerald-900 hover:text-emerald-950 cursor-pointer px-4 py-2 hover:bg-emerald-300  transition"
                >
                    Send
                </button>
                </div>
            </div>
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

    return (
        <>
            <div className="status border border-green-200 bg-emerald-50 rounded-lg p-4 mb-6 text-xl font-bold text-emerald-800 shadow">
                {status}
            </div>
            <div className="board flex flex-col gap-2">
                <div className="board-row flex gap-2">
                    <Square value={square[0]} onSquareClick={() => { handleClick(0) }} />
                    <Square value={square[1]} onSquareClick={() => { handleClick(1) }} />
                    <Square value={square[2]} onSquareClick={() => { handleClick(2) }} />
                </div>
                <div className="board-row flex gap-2">
                    <Square value={square[3]} onSquareClick={() => { handleClick(3) }} />
                    <Square value={square[4]} onSquareClick={() => { handleClick(4) }} />
                    <Square value={square[5]} onSquareClick={() => { handleClick(5) }} />
                </div>
                <div className="board-row flex gap-2">
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
            className={`square border-2 border-emerald-300 rounded-xl m-1 p-0 h-20 w-20 text-3xl font-extrabold flex items-center justify-center bg-gradient-to-br from-white to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 transition-colors shadow-md focus:outline-none`}
        >
            <span className={value === "X" ? "text-blue-600" : value === "O" ? "text-pink-500" : ""}>
                {value}
            </span>
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

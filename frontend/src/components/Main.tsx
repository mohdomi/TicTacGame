import { useNavigate } from "react-router-dom";
import { useState } from "react";
import socket from "../utils/Socket";
import { useNavigationStore } from "../store/navigationStore";


const Main = () => {

    const [roomId, setRoomId] = useState<string>("");
    const [randomRoomId, setRandomRoomId] = useState("");

    const navigate = useNavigate();
    const allowPage2Access = useNavigationStore((state)=>state.allowPage2Access);


    function joinRoom(roomId: string) {


        if (roomId === "") {
            return;
        }

        socket.emit("join_room", roomId);
        console.log("Socket ID : ", socket.id);
        socket.on("joined_room_full", ({ success, reason }) => {

            if (success) {
                console.log("Joined Room : ", roomId);
            } else {
                alert(reason);
            }

        })
    }

    function GenerateRandomRoomID(): string {
        const existingIDs: string[] = ['AA1111', 'XY1234'];

        const getRandomLetters = (length: number = 1): string =>
            Array.from({ length }, () =>
                String.fromCharCode(Math.floor(Math.random() * 26) + 65)
            ).join('');

        const getRandomDigits = (length: number = 1): string =>
            Array.from({ length }, () =>
                Math.floor(Math.random() * 10).toString()
            ).join('');

        const generateUniqueID = (): string => {
            let id: string = getRandomLetters(2) + getRandomDigits(4);
            while (existingIDs.includes(id)) {
                id = getRandomLetters(2) + getRandomDigits(4);
            }
            return id;
        };

        const newID = generateUniqueID();
        console.log(newID);
        return newID;
    }




    return (
        <>
            <div className="outer h-screen">

                <div className="container-full size-full flex flex-col justify-center items-center bg-gradient-to-br from-emerald-200  to-emerald-300">

                    <div className="Heading size-2/3 flex flex-col justify-center items-center bg-gradient-to-br from-emerald-200 to-emerald-400 rounded-xl shadow-xl/20 border-bg-emerald-600 border-1 border-gray-500">

                        <div className="h-1/3 mb-3">
                            <h1 className="text-4xl font-medium font-serif lg:text-6xl">TicTacToeeee...</h1>
                            <ul className="bg-emerald-900 rounded-md text-lg text-white p-3 mt-2">
                                <li>1. Generate Room Id</li>
                                <li>2. Copy and send it to friend</li>
                                <li>3. Join the room</li>
                                <li>4. Enjoy the game</li>

                            </ul>
                        </div>

                        <div className="flex flex-col mt-12">
                            <div className="border-1 rounded-lg mb-1 flex justify-between">
                                <span className="text-xl font-medium flex items-center justify-center text-emerald-900">{randomRoomId === "" ? "RoomID" : randomRoomId}</span>
                                <button onClick={()=>{

                                    if(randomRoomId === ""){
                                        alert("Generate RoomID.");
                                        return;
                                    }
                                    navigator.clipboard.writeText(randomRoomId);

                                }} className="bg-emerald-300 hover:bg-emerald-400 transition active:bg-emerald-400 cursor-pointer p-2 rounded-r-lg"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                                </svg>
                                </button>
                            </div>
                            <input onChange={(e) => {
                                setRoomId(e.target.value);
                            }} type="text" className="Room_Input border-1 rounded h-1/2 p-2 my-1 bg-white" placeholder="Enter Room ID" />

                            <div className="flex">
                                <button onClick={() => {
                                    if (roomId.trim() === "") {
                                        alert("Empty Room ID")
                                        return;
                                    }

                                    const validRoomId = roomId.toUpperCase();
                                    joinRoom(validRoomId);

                                    allowPage2Access();
                                    navigate("/tictactoe")
                                }} className="Enter_Room_Button border-1 rounded p-2 m-1 bg-emerald-200 hover:bg-emerald-300 transition text-emerald-900 hover:text-emerald-950 cursor-pointer">Join Room</button>
                                <button onClick={
                                    () => {
                                        const randomRoomId = GenerateRandomRoomID();
                                        setRandomRoomId(randomRoomId);
                                    }
                                } className="Generate_Room_Id_Button border-1 rounded p-2 m-1 bg-neutral-200 hover:bg-neutral-300 transition cursor-pointer">Generate RoomId</button>
                            </div>

                        </div>



                    </div>


                </div>

            </div>
        </>
    )

}


export default Main;


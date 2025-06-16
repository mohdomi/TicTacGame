import { useNavigate } from "react-router-dom";
import { useState } from "react";
import socket from "../utils/Socket";

const Main = () => {

    const [roomId, setRoomId] = useState<string>("");
    const [randomRoomId , setRandomRoomId] = useState("");

    const navigate = useNavigate();

    function joinRoom(roomId: string) {


        if (roomId === "") {
            return;
        }

        socket.emit("join_room", roomId);
        console.log("Socket", socket);
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

                <div className="container-full size-full flex flex-col justify-center items-center">

                    <div className="Heading size-2/3 border-2 flex flex-col justify-center items-center">

                        <div className="h-1/3">
                            <h1 className="text-3xl font-medium">Enter Room ID and Play X/O</h1>
                        </div>

                        <div className="flex flex-col">

                            <span className="text-lg font-medium flex items-center justify-center">{randomRoomId}</span>

                            <input onChange={(e)=>{
                                setRoomId(e.target.value);
                            }} type="text" className="Room_Input border-1 rounded h-1/2 p-2 my-1" placeholder="Enter Room ID" />

                            <div className="flex">
                                <button onClick={() => {
                                    joinRoom(roomId);
                                    navigate("/tictactoe")
                                }} className="Enter_Room_Button border-1 rounded p-2 m-1">Join Room</button>
                                <button onClick={
                                    ()=>{
                                        const randomRoomId = GenerateRandomRoomID();
                                        setRandomRoomId(randomRoomId);
                                    }
                                } className="Generate_Room_Id_Button border-1 rounded p-2 m-1">Generate RoomId</button>
                            </div>

                        </div>



                    </div>


                </div>

            </div>
        </>
    )

}


export default Main;


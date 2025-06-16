import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Main = () => {

    const [roomId, setRoomId] = useState<string>("");

    const navigate = useNavigate();


    return (
        <>
            <div className="outer h-screen">

                <div className="container-full size-full flex flex-col justify-center items-center">

                    <div className="Heading size-2/3 border-2 flex flex-col justify-center items-center">

                        <div className="h-1/3">
                            <h1 className="text-3xl font-medium">Enter Room ID and Play X/O</h1>
                        </div>

                        <div className="flex flex-col">

                            <input onChange={ } type="text" className="Room_Input border-1 rounded h-1/2 p-2 my-1" placeholder="Enter Room ID" />

                            <div className="flex">
                                <button onClick={() => {

                                    navigate("/tictactoe")
                                }} className="Enter_Room_Button border-1 rounded p-2 m-1">Join Room</button>
                                <button className="Generate_Room_Id_Button border-1 rounded p-2 m-1">Generate RoomId</button>
                            </div>

                        </div>



                    </div>


                </div>

            </div>
        </>
    )

}


export default Main;


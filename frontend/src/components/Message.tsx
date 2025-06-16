import { useEffect, useState } from "react";
import socket from "../utils/Socket";

function Message() {

  const [messages, setMessages] = useState<{ text: string }[]>([]);
  const [input, setInput] = useState("");


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
    <>

      <div className="outer h-screen flex flex-col justify-center items-center">

        <div className="container flex flex-col  border-2 size-2/3">

          <div className="messages border-1 h-9/10 w-full">

            <ul id="message-list" className="message-list border-1 w-full">
              {
                messages.map((item, idx) => {
                  return <li key={idx}>{item.text}</li>
                })
              }
            </ul>

          </div>
          <div className="chatbox h-1/3 w-full flex justify-end">
            <input value={input} onChange={(e) => {
              setInput(e.target.value);

            }} onKeyDown={e => {
              return e.key === 'Enter' && sendMessage()
            }
            } type="text" id="chatbox" className="inner-box bg-blue-100 w-full h-fit my-2 rounded" />
            <button id="send_button" onClick={sendMessage} className="send-message size-fit rounded bg-blue-100 hover:bg-blue-200 my-2 ml-1">Send</button>
          </div>

        </div>

      </div>
    </>
  )
}

export default Message
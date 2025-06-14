import { Route , Routes } from "react-router-dom";
import Message from "./components/Message";
import TicTacToe from "./components/TicTacToe";


function App(){

    return(
      <>
        <Routes>
          <Route path="/" element={<Message />}/>
          <Route path="/tictactoe" element={<TicTacToe/>}/>
        </Routes>
      </>
    )


}

export default App;
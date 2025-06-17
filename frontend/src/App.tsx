import { Route , Routes } from "react-router-dom";
// import Message from "./components/Message";
import Game from "./components/Game";
import Main from "./components/Main";

function App(){

    return(
      <>
        <Routes>
          <Route path="/" element={<Main />}/>
          <Route path="/tictactoe" element={<Game/>}/>
        </Routes>
      </>
    )


}

export default App;
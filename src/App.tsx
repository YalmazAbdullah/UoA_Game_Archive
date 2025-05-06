import * as React from "react"
import axios from "axios";
import { GameType } from "./types/gameType";
import About from "./components/About";
import Banner from "./components/Banner";
import { GameModal } from "./components/GameModal";

function App() {

  const [games, setGames] = React.useState<GameType[]>([]);
  const limit = 9
  const year = null
  const course = null
  const page = null

  const getGames = async () => {
    try {
      if (!year && !course){
        const res = await axios.get(" http://localhost:8000/games", {
          params: {page, limit}
        });
        setGames(res.data.games);
      }else{
        const res = await axios.get(`http://localhost:8000/games`, {
          params: {page, limit, year, course}
        });
        setGames(res.data.games);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  React.useEffect(() => {
    getGames();
  }, []);

  return (
    <div className="min-h-screen bg-black">
    <div className="max-w-[1144px] bg-white mx-auto">
    <Banner/>
    <About/>
    <div className={`
        grid grid-cols-1 gap-2 p-2
        sm:gap-5 sm:p-5 
        md:grid-cols-2 
        lg:grid-cols-3`}>
      {games.map((game_info, index) => (
        <GameModal key={index} {...game_info} />
      ))}
    </div>
    </div>
    </div>
  )
}

export default App

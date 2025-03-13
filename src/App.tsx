import * as React from "react"
import axios from "axios";
import { Filter } from "./components/filter"
import Game from "./components/game";
import { GameType } from "./types/gameType";
import { Pages } from "./components/pages";
import { CustomButton } from "./components/button";

// pagination on grid
// search box
// random 

function App() {
  const [year, setYear] = React.useState<string>("");
  const [course, setCourse] = React.useState<string>("");
  const resetFilter = () => {
    setYear("");
    setCourse("");
    console.log("reset")
  };
  
  const [games, setGames] = React.useState<GameType[]>([]);

  React.useEffect(() => {
    console.log("effect used")
    const getGames = async () => {
      try {
        if (!year && !course){
          const res = await axios.get(" http://localhost:8000/games");
          setGames(res.data.games);
        }else{
          const res = await axios.get(`http://localhost:8000/games?year=${year}&course=${course}`);
          setGames(res.data.games);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getGames();
  }, [year,course]);

  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <Filter filterName="year" selectedValue={year}  onSelect={setYear}/>
      <Filter filterName="course" selectedValue={course} onSelect={setCourse}/>
      <CustomButton buttonText="Reset Filters" onClick={resetFilter}/>
      <div className="grid grid-cols-3 grid-rows-3 gap-4">
        {games.map((game, index) => (
          <Game key={index} {...game} />
        ))}
      </div>
      <Pages/>
    </div>
  )
}

export default App

import * as React from "react"
import axios from "axios";
import { GameType } from "./types/gameType";
import About from "./components/About";
import Banner from "./components/Banner";
import { GameModal } from "./components/GameModal";
import { endpoint_live } from "./api";
import { Filter } from "./components/Filters";
import { Button } from "./components/ui/button";

function App() {

  const [games, setGames] = React.useState<GameType[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [columnCount, setColumnCount] = React.useState(1); // Track current column count
  const rowsPerPage = 3;

  const [year, setYear] = React.useState<string>("");
  const [course, setCourse] = React.useState<string>("");

  const resetFilter = () => {
    setYear("");
    setCourse("");
    if(year || course){
      setPage(0);
      console.log("reset")
    }
  };

  const calculateLimit = () => columnCount * rowsPerPage;

  const getGames = async (newPage: number) => {
    try {
      // Fetch games
      setIsLoading(true);
      const currentLimit = calculateLimit();
      let res;
      if (!year && !course){
        res = await axios.get(endpoint_live +"games", {
          params: {page: newPage, limit: currentLimit}
        });
      }else{
        res = await axios.get(endpoint_live +`games`, {
          params: {page: newPage, limit: currentLimit,  year, course}
        });
      }

      // Append if already responded
      if (res.data.games.length === 0) {
        setHasMore(false);
      } else {
        setGames(prevGames => [...prevGames, ...res.data.games]);
        setPage(newPage);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Figure out column count
  React.useEffect(() => {
    const updateColumnCount = () => {
      const width = window.innerWidth;
      let newColumnCount = 1;
      
      // lg breakpoint
      if (width >= 1024) { 
        newColumnCount = 3;
      } 
      // md breakpoint
      else if (width >= 768) { 
        newColumnCount = 2;
      }
      setColumnCount(newColumnCount);
    };

    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  // Intial Fetch
  React.useEffect(() => {
    getGames(1);
  }, []);

  // Fetch on filter change
  React.useEffect(() => {
    const fetchFiltered = async () => {
      setIsLoading(true);
      setHasMore(true);
      const currentLimit = calculateLimit();
      try {
        const res = await axios.get(endpoint_live + "games", {
          params: { page: 1, limit: currentLimit, year, course },
        });
        setGames(res.data.games);
        setPage(1);
      } catch (err) {
        console.error("Error fetching filtered games:", err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchFiltered();
  }, [year, course]);
  
  // Fetch on resize
  React.useEffect(() => {
    if (page === 1) return;
    setGames([]);
    setPage(1);
    setHasMore(true);
    getGames(1);
  }, [columnCount]);

  // Infinite scroll handler
  React.useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >= 
        document.documentElement.scrollHeight &&
        !isLoading &&
        hasMore
      ) {getGames(page + 1);}
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore, page]);

  return (
    <div className="min-h-screen bg-black">
    <div className="max-w-[1144px] bg-white mx-auto">
    <Banner/>
    <About/>
    {/* FILTERS */}
    <div className={`
        flex flex-col justify-items-stretch
        p-2 space-y-2`}>
      <div className={`space-y-2`}>
        <Filter filterName="year" selectedValue={year}  onSelect={setYear}/>
        <Filter filterName="course" selectedValue={course} onSelect={setCourse}/>
      </div>
        <Button className={`
            bg-black border-5 
            border-black rounded-none 
            font-light text-lg text-white
            hover:bg-orange hover:text-black
            p-5`} onClick={resetFilter}>Reset Filters</Button>
      </div>
    {/* GRID */}
    <div className={`
        grid grid-cols-1 gap-2 p-2
        sm:gap-5 sm:p-5 
        md:grid-cols-2 
        lg:grid-cols-3`}>
      {games.map((game_info, index) => (
        <GameModal key={`${game_info.id}-${index}`} {...game_info} />
      ))}
    </div>
    {isLoading && <div className="text-center p-4">Loading more games...</div>}
    </div>
    </div>
  )
}

export default App

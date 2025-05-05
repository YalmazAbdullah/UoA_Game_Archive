import * as React from "react"
import axios from "axios";
import { Filter } from "./components/filter"
import Game from "./components/game";
import { GameType } from "./types/gameType";
import { Pages } from "./components/pages";
import { CustomButton } from "./components/button";
import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/background";
import { Pixelation, Bloom, DepthOfField, EffectComposer, Noise, Vignette, Glitch, ChromaticAberration, Scanline } from '@react-three/postprocessing'
import { AdditiveBlending } from "three";
import HeaderBar from "./components/header";

function App() {
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
  
  const [games, setGames] = React.useState<GameType[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [totalPages, setTotalPages] = React.useState<number>(1);
  const [colCount, setColCount] = React.useState<number>(2);

  const colClassMap: { [key: number]: string } = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
  };

  useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth;
      if (width < 1140) {
        setColCount(1);
      } else if (width <= 1600) {
        setColCount(2);
      } else {
        setColCount(3);
      }
    };
  
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const getGames = async () => {
    try {
      let limit = colCount*3;
      if (!year && !course){
        const res = await axios.get(" http://localhost:8000/games", {
          params: {page, limit}
        });
        setGames(res.data.games);
        setTotalPages(Math.ceil(res.data.total / limit));
      }else{
        const res = await axios.get(`http://localhost:8000/games`, {
          params: {page, limit, year, course}
        });
        setGames(res.data.games);
        setTotalPages(Math.ceil(res.data.total / limit));
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  React.useEffect(() => {
    setPage(0);
    getGames();
  }, [year, course]);

  React.useEffect(() => {
    getGames();
  },[page, colCount]);
  
  return (
    <div>
    <div className="flex flex-col items-center justify-center bg-black">
    <HeaderBar/>
    <div className="min-h-screen md:mx-[10vw] bg-white">
    <div className="flex relative w-full h-[55vh] items-center">
      <Canvas className="absolute inset-0" camera={{ position: [0, 5, 15], fov: 50 }} shadows>
      <color attach="background" args={['#D0CFB7']} />
      <EffectComposer>
        <Vignette eskil={false} offset={0.01} darkness={0.8} />
        <DepthOfField focusDistance={2} focalLength={6} bokehScale={10} height={360} />
        <ChromaticAberration></ChromaticAberration>
        <Scanline opacity={0.08}></Scanline>
        <Noise opacity={0.08}></Noise>
      </EffectComposer>
      <Scene/>
      </Canvas>

      <img
        src="/Logo.svg"
        alt="Overlay SVG"
        className="absolute inset-0 object-contain w-full h-full z-20 translate-y-30 sm:translate-y-18 scale-60 sm:scale-90"
      />
    </div>
    <div className="w-full h-10 bg-green"></div>
    <div className="w-full h-10 bg-orange"></div>
    <div className="w-full h-10 bg-yellow"></div>
    <div className="max-w-330 px-10 md:px-25 flex flex-col bg-white space-y-15 pb-20 items-center justify-items-center">
      {/* INTRO */}
      <div className="mt-20">
        <h1 className="text-5xl font-serif ">About the Archive.</h1>
        <p className="mt-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque  eleifend mattis augue quis accumsan. Quisque sem risus, accumsan  consectetur libero vitae, viverra egestas lectus. Etiam venenatis  tristique efficitur. Praesent bibendum luctus nisi, sed sollicitudin  tortor vestibulum id. Suspendisse vehicula, felis ac scelerisque  bibendum, lorem mauris dignissim nisl, vehicula faucibus libero ligula  ut elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque  eleifend mattis augue quis accumsan. Quisque sem risus, accumsan  consectetur libero vitae, viverra egestas lectus. Etiam venenatis  tristique efficitur. Praesent bibendum luctus nisi, sed sollicitudin  tortor vestibulum id. Suspendisse vehicula, felis ac scelerisque  bibendum, lorem mauris dignissim nisl, vehicula faucibus libero ligula  ut elit.</p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col items-center space-y-2 md:space-y-0 md:flex-row md:space-x-2">
        <Filter filterName="year" selectedValue={year}  onSelect={setYear}/>
        <Filter filterName="course" selectedValue={course} onSelect={setCourse}/>
        <CustomButton buttonText="Reset Filters" onClick={resetFilter}/>
      </div>
      
      {/* GAME GRID */}
      <div className={`grid ${colClassMap[colCount]} min-w-full gap-5 place-items-center`}>
        {games.map((game, index) => (
          <Game key={index} {...game} />
        ))}
      </div>
      <Pages page={page} totalPages={totalPages} setPage={setPage} />
    </div>
    </div>
    </div>
    </div>
  )
}

export default App

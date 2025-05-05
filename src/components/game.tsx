import * as React from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { GameType } from "@/types/gameType"

const MAX_BLURB = 500
const MAX_TITLE = 50
export function Game({ name, course, year, blurb, thumbnail, releases}: GameType){
    // blurb = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque felis  lorem, vehicula sed venenatis quis, egestas quis nisi. Vivamus auctor  molestie dignissim. Nullam luctus tempor sem, luctus vulputate est  hendrerit eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sed lorem metus. Pellentesque consectetur, ligula eget consequat vestibulum, neque.  adipiscing elit."
    return (
        <div className="w-90 transition-transform duration-300 transform hover:scale-105 hover:z-10 relative p-1 bg-white border-2 border-black inline-block rounded-md">
        <Card className="p-3 bg-black w-full h-full hover:bg-green border-2 border-black rounded-md">
            <CardContent className="p-0 space-y-3">
                <img src={thumbnail} alt={name} className="border-white border-1 rounded-md w-92 h-43"/>
                <CardTitle className="font-serif text-2xl font-medium text-white">{name.length > MAX_TITLE ? name.slice(0, MAX_TITLE-5) + "..." : name}</CardTitle>
                <hr className="text-white"></hr>
                <p className="font-sans font-light text-sm text-white h-50">{blurb.length > MAX_BLURB ? blurb.slice(0, MAX_BLURB) + "..." : blurb}</p>
            </CardContent>
            <CardFooter>
            </CardFooter>
        </Card>
        </div>
    )  
}

export default Game
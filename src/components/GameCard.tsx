import * as React from "react"
import { GameType } from "@/types/gameType"
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import steamIcon from "@/assets/steam.svg";
import itchIcon from "@/assets/itch.svg";
import githubIcon from "@/assets/github.svg";
import linkIcon from "@/assets/link.svg";

const icons: Record<string, string> = {
  steam: steamIcon,
  itch: itchIcon,
  github: githubIcon,
  other: linkIcon
};
const platforms: string[] = ["itch", "github", "steam", "other"];

const MAX_BLURB = 450
const MAX_TITLE = 50
export function GameCard({ name, blurb, thumbnail, releases}: GameType){
    blurb = "Praesent vitae quam suscipit elit fermentum tempus et at ipsum. Proin a ultricies lectus. Nullam id imperdiet velit, ac aliquam orci. Nulla gravida tristique orci ac bibendum. Fusce mauris quam, faucibus non mi nec, luctus egestas risus. Nulla eget blandit nunc. Praesent lacus urna, tempus sit amet magna non, ultrices congue nisl. Vivamus feugiat convallis ante eu porta. Aenean finibus augue sit amet risus maximus hendrerit. Duis pretium, nibh quis eleifend molestie, urna turpis condimentum purus, a maximus lacus nisl non nulla. Donec ut vestibulum dolor, vel malesuada nunc"
    
    return (
        <>
        <Card className={`
            flex flex-col items-stretch 
            rounded-none border-5 border-black 
            p-0 max-w-[780px]
            bg-white
            hover:bg-orange
            gap-0
            transition-transform duration-300 transform hover:scale-105 hover:z-10`}>
        <CardContent className="p-4 min-h-[550px]">
            <div className="w-full aspect-[92/43] border-black bg-black border-2 ">
                <img 
                    className="w-full h-full object-cover"
                    src={thumbnail} 
                    alt={name}
                />
            </div>
            <div className="w-full">
            <p className="font-accent font-semibold text-black text-2xl pt-4">
                {name.length > MAX_TITLE ? name.slice(0, MAX_TITLE-5) + "..." : name}
            </p>
            <p className="font-sans font-normal text-black">
                {blurb.length > MAX_BLURB ? blurb.slice(0, MAX_BLURB) + "..." : blurb}
            </p>
            </div>
        </CardContent>
        <div className="text-black border-black border-t-5 p-2 flex flex-row items-center justify-center gap-2">
            {platforms.map((platform) =>
            releases[platform] ? (
                <a
                key={platform}
                href={releases[platform]}
                target="_blank" rel="noopener noreferrer"
                >
                <img
                    src={icons[platform]}
                    alt={`${platform} icon`}
                    className="w-10 h-10"
                />
                </a>
            ) : null)}
        </div>
        </Card>
        </>
    )  
}
export default GameCard
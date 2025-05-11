import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { GameType } from "@/types/gameType"
import GameCard from "./GameCard"
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
 
export function GameModal(game_info: GameType) {
    let blurb = "Praesent vitae quam suscipit elit fermentum tempus et at ipsum. Proin a ultricies lectus. Nullam id imperdiet velit, ac aliquam orci. Nulla gravida tristique orci ac bibendum. Fusce mauris quam, faucibus non mi nec, luctus egestas risus. Nulla eget blandit nunc. Praesent lacus urna, tempus sit amet magna non, ultrices congue nisl. Vivamus feugiat convallis ante eu porta. Aenean finibus augue sit amet risus maximus hendrerit. Duis pretium, nibh quis eleifend molestie, urna turpis condimentum purus, a maximus"
    let name = "Really long Praesent vitae quam suscipit elit fermentum tempus et at ipsum."
    return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="w-full text-left">
        <GameCard {...game_info} />
        </button>
      </DialogTrigger>

      <DialogContent className="bg-orange rounded-none sm:max-w-[1144px] md:flex md:flex-items border-5 sm:border-l-0 sm:border-r-0 p-10 border-black">
        <div className="md:w-[60%] space-y-5">
            <div className="w-full aspect-[92/43] border-black border-5 bg-black ">
                <img 
                    className="w-full h-full object-cover"
                    src={game_info.thumbnail} 
                />
            </div>
            <div className="flex gap-2">
                {platforms.map((platform) =>
                game_info.releases[platform] ? (
                    <a key={platform} href={game_info.releases[platform]} target="_blank" rel="noopener noreferrer">
                    <img
                        src={icons[platform]}
                        alt={`${platform} icon`}
                        className="w-8 h-8"
                    />
                    </a>
                ) : null)}
            </div>
            <div>
                <DialogTitle className="text-black font-accent font-extrabold md:text-5xl text-xl">{game_info.name}</DialogTitle>
                <DialogDescription className="text-black">{game_info.blurb}</DialogDescription>
            </div> 
        </div>
        <div className="md:px-5">
            <p className="font-accent font-semibold text-lg md:text-5xl text-white">Team Mebers:</p>
            <ul className="text-black md:text-lg font-sans md:mt-2">
            {Object.entries(game_info.team).map(([name, role]) => (
                <li className="text-black" key={name}>
                <span className="text-black font-semibold">{name}</span> — {role}
                </li>
            ))}
            </ul>
        </div>
      </DialogContent>
    </Dialog>
    )
}

export default GameModal
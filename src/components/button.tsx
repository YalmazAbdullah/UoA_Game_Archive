import { Button } from "@/components/ui/button"
 
interface props {
    buttonText: string;
    onClick: () => void;
  }
  
export function CustomButton({buttonText, onClick}:props) {
  return (
    <div className="relative inline-block">
    <Button
      className="bg-black rounded-lg cursor-pointer select-none border-black text-white font-serif font-normal text-lg hover:bg-green border-2"
      onClick={onClick}>
      {buttonText}
    </Button>
    </div>
  )
}
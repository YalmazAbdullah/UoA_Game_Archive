import { Button } from "@/components/ui/button"
 
interface props {
    buttonText: string;
    onClick: () => void;
  }
  
export function CustomButton({buttonText, onClick}:props) {
  return <Button onClick={onClick}>{buttonText}</Button>
}
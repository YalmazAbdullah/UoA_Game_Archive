import * as React from "react"
import axios from "axios";
import { endpoint_live } from "../api";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface FilterProps {
  filterName: string;
  selectedValue: string;
  onSelect: (value: string) => void;
}

export function Filter({ filterName, selectedValue = "", onSelect}: FilterProps) {
  const [items, setItems] = React.useState<string[]>([]);

  // Query the server for filter values
  React.useEffect(() => {
    const getItems = async () => {
      try {
        const res = await axios.get(endpoint_live + "filter_info?filter_name="+filterName);
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getItems();
  }, []);

  return (
    <div>
    <Select value={selectedValue ?? undefined} onValueChange={onSelect}>
      {/* Drop down button */}
      <SelectTrigger className={`
            w-[100%]
            border-5 
            border-black rounded-none 
            italic font-light text-lg text-white
            p-5 ${ selectedValue ? "bg-green" : "bg-gray"}`
        }>
        <SelectValue placeholder={"Select a " + filterName} />
      </SelectTrigger>

      {/* Drop down content */}
      <SelectContent className="bg-white italic font-light text-lg rounded-none border-5 border-black">
        <SelectGroup>
          {items.map((item, index) => (
            <SelectItem className="hover:bg-orange hover:text-black rounded-none" key={index} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
    </div>
  )
}
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

  // Returns a component that is a drop down with filter values queried from the server.
  return (
    <div>
    <Select value={selectedValue ?? undefined} onValueChange={onSelect}>
      {/* Drop down button */}
      <SelectTrigger className={`w-[250px] 
        font-serif italic 
        text-lg
        text-white border-2 border-black ${ selectedValue ? "bg-yellow text-black" : "bg-gray hover:bg-green"}`
        }>
        <SelectValue placeholder={"Select a " + filterName} />
      </SelectTrigger>

      {/* Drop down content */}
      <SelectContent className="max-h-[200px] text-lg overflow-y-auto font-serif italic bg-white">
        <SelectGroup>
          {items.map((item, index) => (
            <SelectItem className="text-lg hover:bg-green hover:text-white" key={index} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
    </div>
  )
}

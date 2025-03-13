import * as React from "react"
import axios from "axios";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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

  React.useEffect(() => {
    const getItems = async () => {
      try {
        const res = await axios.get(" http://localhost:8000/filter_info?filter_name="+filterName);
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
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={"Select a "+filterName} />
      </SelectTrigger>
      <SelectContent className="max-h-[200px] overflow-y-auto">
        <SelectGroup>
          {items.map((item, index) => (
            <SelectItem key={index} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
    </div>
  )
}

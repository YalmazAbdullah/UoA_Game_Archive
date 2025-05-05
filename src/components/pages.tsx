import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function Pages({ page, totalPages, setPage }: { page: number; totalPages: number; setPage: (p: number) => void }) {
  return (
    <Pagination>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem
          onClick={() => setPage(Math.max(0, page - 1))}
          className="bg-black rounded-lg cursor-pointer select-none border-black text-white font-serif font-normal hover:bg-green border-2 flex items-center h-[40px] pr-2"
        >
        <ChevronLeft/>
        Prev
        </PaginationItem>

        {/* items */}
        {[...Array(totalPages)].map((_, index) => (
          <PaginationItem className="bg-black rounded-lg cursor-pointer select-none border-black text-white font-serif font-normal hover:bg-green border-2 h-[40px]" key={index}>
            <PaginationLink
              className={page === index ? "bg-yellow text-black font-bold" : ""}
              onClick={() => setPage(index)}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Next */}
        <PaginationItem
          onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
          className="bg-black rounded-lg cursor-pointer select-none border-black text-white font-serif font-normal hover:bg-green border-2 flex items-center h-[40px] pl-2"
        >
        Next
        <ChevronRight/>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
  
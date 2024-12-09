/**
 * GridCell.tsx
 * 
 * Purpose: This file contains the GridCell component that displays the grid cell for the drag and drop feature.
 * 
 * Author: Zachary Ivanoff
 *  
 */

import React from "react";
import { useDrop } from "react-dnd";

interface GridCellProps {
  index: number;
  word: string;
  imageSrc: string;
  gridWordsRef: React.MutableRefObject<string[]>;
  HandleTileDrop: (word: string) => void;
  gameEnded: boolean;
}

const GridCell: React.FC<GridCellProps> = ({
  index,
  word,
  imageSrc,
  gridWordsRef,
  HandleTileDrop,
  gameEnded,
}) => {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "ITEM",
    drop: () => {
      const currentWord = gridWordsRef.current[index]; // Access the current word via the ref
      console.log("Dropped on cell with current word:", currentWord);
      if (currentWord !== "placeholder") {
        HandleTileDrop(currentWord);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={dropRef}
      className={`flex items-center justify-center border-8 border-black h-24 w-24 text-xl transition ${isOver ? "bg-gray-400" : "bg-white"
        } ${gameEnded ? "pointer-events-none opacity-50" : ""}`}
    >
      <img
        src={imageSrc}
        alt={word}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default GridCell;

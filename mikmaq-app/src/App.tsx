import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Dictionary from './Dictionary';

const App: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('January');
  const [message, setMessage] = useState<string | null>(null);
  const [tileNumbers, setTileNumbers] = useState<number[]>([]);
  const months = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const [hoveredTile, setHoveredTile] = useState<number | null>(null);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [dragged, setDragged] = useState<boolean>(false);

  const generateRandomTileNumbers = () => {
    const numbers = Array.from({ length: 9 }, (_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    setTileNumbers(numbers);
  };

  const handleTileDrop = (tileNumber: number) => {
    generateRandomTileNumbers();
    setSelectedTiles((prev) => [...prev, tileNumber]);
    setDragged(false);
    if (tileNumber === 9) {
      setMessage('You win!');
    } else {
      setMessage('You lose!');
    }
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    generateRandomTileNumbers();
  };

  useEffect(() => {
    generateRandomTileNumbers();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8 h-screen">
      <h1 className="text-2xl font-bold mb-4">Mi'kmaq App</h1>

      {/* Display "Win" or "Lose" Message */}
      {message && (
        <div className="mt-4 mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded text-2xl font-bold">
          {message}
        </div>
      )}

      <div className="flex justify-center gap-48 w-full items-end ">

        {/* Dropdown Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="bg-blue-500 text-white px-4 py-2 h-10 w-28 rounded">
            {selectedMonth}
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-white border border-gray-200 rounded shadow-md">
            {months.map((month) => (
              <DropdownMenu.Item
                key={month}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleMonthChange(month)}
              >
                {month}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <img src="/heart.png" alt="Drag Me" draggable="false" className="w-24 h-24" />
      </div>

      {/* 3x3 Grid Layout */}
      <div className="grid grid-cols-3 grid-rows-3 gap-4 mt-6">
        {tileNumbers.map((number, index) => (
          <div
            key={index}
            className={`flex items-center justify-center border-2 border-gray-300 h-36 w-36 text-xl ${dragged && hoveredTile === number ? 'bg-gray-400' : 'bg-white'  // Apply grey background when hovered
              }`}
            onDragOver={(e) => {
              e.preventDefault();
              if (dragged) setHoveredTile(number);
            }}
            onDragLeave={() => setHoveredTile(null)}
            onDrop={() => {
              handleTileDrop(number);
              setHoveredTile(null);
            }}
          >
            {number}
          </div>
        ))}
      </div>

      {/* Flex Container for Image and Dictionary Button */}
      <div className="flex mt-6 justify-center w-full">
        {/* Draggable PNG Image */}
        <div
          className="w-24 h-24"
          draggable
          onDragStart={() => setDragged(true)}  // Track drag start
          onDragEnd={() => setDragged(false)}   // Reset drag state after drop
        >
          <img src="/bear_paw.jpeg" alt="Drag Me" className="w-full h-full" />
        </div>

        {/* Dictionary Button with Pop-up */}
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="bg-green-500 text-white px-2 py-2 rounded ml-4">
              Open Dictionary
            </button>
          </Dialog.Trigger>

          {/* Dictionary Pop-up */}
          <Dictionary selectedMonth={selectedMonth} />
        </Dialog.Root>
      </div>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Dictionary from './Dictionary';

const wordsByMonth: Record<string, string[]> = {
  September: ['Apple', 'Banana', 'Cherry'],
  October: ['Apple', 'Banana', 'Cherry', 'Plum', 'Kiwi', 'Mango'],
  November: ['Apple', 'Banana', 'Cherry', 'Plum', 'Kiwi', 'Mango', 'Grape', 'Orange', 'Lemon'],
  December: ['Apple', 'Banana', 'Cherry', 'Plum', 'Kiwi', 'Mango', 'Grape', 'Orange', 'Lemon', 'Peach', 'Pear', 'Pineapple'],
  January: ['Apple', 'Banana', 'Cherry', 'Plum', 'Kiwi', 'Mango', 'Grape', 'Orange', 'Lemon', 'Peach', 'Pear', 'Pineapple', 'Watermelon', 'Cantaloupe', 'Honeydew'],
  February: ['Apple', 'Banana', 'Cherry', 'Plum', 'Kiwi', 'Mango', 'Grape', 'Orange', 'Lemon', 'Peach', 'Pear', 'Pineapple', 'Watermelon', 'Cantaloupe', 'Honeydew', 'Avocado', 'Persimmon', 'Raspberry'],
  March: ['Apple', 'Banana', 'Cherry', 'Plum', 'Kiwi', 'Mango', 'Grape', 'Orange', 'Lemon', 'Peach', 'Pear', 'Pineapple', 'Watermelon', 'Cantaloupe', 'Honeydew', 'Avocado', 'Persimmon', 'Raspberry', 'Blackberry', 'Blueberry', 'Strawberry'],
};

const App: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('September'); // State for selected month
  const [message, setMessage] = useState<string | null>(null);
  const [gridWords, setGridWords] = useState<string[]>([]); // State for grid words
  const [winningWord, setWinningWord] = useState<string | null>(null); // State for the winning word
  const [usedWords, setUsedWords] = useState<string[]>([]); // State for used words
  const months = Object.keys(wordsByMonth); // Extract month keys
  const [round, setRound] = useState<number>(0); // Track current round
  const [gameEnded, setGameEnded] = useState<boolean>(false); // State for game ended
  const [hoveredTile, setHoveredTile] = useState<number | null>(null);
  const [dragged, setDragged] = useState<boolean>(false);

  // Function to generate random grid words
  const generateRandomGridWords = () => {
    // Get the available words for the selected month
    const words = wordsByMonth[selectedMonth].filter(word => !usedWords.includes(word));

    if (words.length === 0) {
      setGameEnded(true); // Set game ended if no words left
      setMessage("Game ended");
      return;
    }

    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    const selectedWords = shuffledWords.slice(0, 8); // Select up to 8 words for the grid

    // Ensure the winning word is included in the grid
    if (winningWord && !selectedWords.includes(winningWord)) {
      selectedWords[Math.floor(Math.random() * 8)] = winningWord; // Replace a random tile with the winning word
    }

    // Fill the grid with the selected words and add empty tiles if necessary
    setGridWords([...selectedWords, ...Array(9 - selectedWords.length).fill('')]); // Ensure 9 tiles total
  };

  // Function to select a random winning word
  const selectWinningWord = () => {
    const words = wordsByMonth[selectedMonth].filter(word => !usedWords.includes(word));
    if (words.length > 0) {
      const randomIndex = Math.floor(Math.random() * words.length);
      const selectedWord = words[randomIndex];
      setWinningWord(selectedWord); // Set the winning word
    }
  };

  // Function to handle tile drop event
  const handleTileDrop = (tileWord: string) => {
    setDragged(false);

    // Check if the dropped tile corresponds to the winning word
    if (tileWord === winningWord) {
      setMessage(`kelu’lk tela’tekn!`);
    } else {
      setMessage(`kjinu’kwalsi ap!`);
    }

    // Mark the winning word as used
    if (winningWord) {
      setUsedWords(prev => [...prev, winningWord]); // Add the winning word to the used list
    }

    // Prepare for the next round
    setRound(prev => prev + 1); // Increment the round
  };

  // Function to handle month change
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setUsedWords([]); // Reset used words for the new month
    setRound(0); // Reset round count for the new month
    setGameEnded(false); // Reset game ended state
    setMessage(null); // Clear previous messages
  };

  useEffect(() => {
    selectWinningWord(); // Set new winning word based on updated month
    generateRandomGridWords(); // Generate new grid words based on updated month
  }, [selectedMonth, usedWords]); // Run effect when selectedMonth or usedWords changes

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-1">Mi'kmaq App</h1>

      {/* Display "Win" or "Lose" Message */}
      {message && (
        <div className="mt-1 mb-1 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded text-2xl font-bold">
          {message}
        </div>
      )}

      {/* Display Game Ended Message */}
      {gameEnded && (
        <div className="mt-4 mb-4 p-4 bg-red-100 border border-red-400 text-red-800 rounded text-2xl font-bold">
          Game ended
        </div>
      )}



      <div className="flex justify-between w-3/5 items-end">
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

        {/* Display the Winning Word */}
        <div>
          {winningWord && (
            <h2 className="text-5xl font-bold mb-1">{winningWord}</h2>
          )}
        </div>

        <img src="/heart.png" alt="Drag Me" className="w-24 h-24" />
      </div>




      {/* 3x3 Grid Layout */}
      <div className="grid grid-cols-3 grid-rows-3 gap-4 mt-6 w-480">
        {gridWords.map((word, index) => (
          <div
            key={index}
            className={`flex items-center justify-center border-2 border-gray-300 h-36 w-36 text-xl ${dragged && hoveredTile === index ? 'bg-gray-400' : 'bg-white'}`}
            onDragOver={(e) => {
              e.preventDefault();
              if (dragged) setHoveredTile(index);
            }}
            onDragLeave={() => setHoveredTile(null)}
            onDrop={() => {
              handleTileDrop(word);
              setHoveredTile(null); // Reset hovered tile on drop
            }}
          >
            {word}
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
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
            <Dialog.Content className="fixed inset-0 flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg">
                <Dialog.Title className="text-2xl font-bold mb-4">Mi'kmaq Dictionary</Dialog.Title>
                <Dictionary wordsByMonth={wordsByMonth} selectedMonth={selectedMonth} />
                <Dialog.Close className="absolute top-2 right-2">
                  <button className="bg-red-500 text-white px-2 py-1 rounded">Close</button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
};

export default App;

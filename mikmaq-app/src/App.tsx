import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Dictionary from './Dictionary';

const wordsByMonth: Record<string, string[]> = {
  September: ['I', 'you', 'My name is...'],
  October: ['I', 'you', 'My name is...', 'and', 'eat', 'I like the taste of it'],
  November: ['I', 'you', 'My name is...', 'and', 'eat', 'I like the taste of it', 'I love...', 'Make it', 'I am going'],
  December: ['I', 'you', 'My name is...', 'and', 'eat', 'I like the taste of it', 'I love...', 'Make it', 'I am going', 'I see it', 'I like...', 'I am coming from...'],
  January: ['I', 'you', 'My name is...', 'and', 'eat', 'I like the taste of it', 'I love...', 'Make it', 'I am going', 'I see it', 'I like...', 'I am coming from...', 'Dad', 'Grandmother or Mother', 'him or her'],
  February: ['I', 'you', 'My name is...', 'and', 'eat', 'I like the taste of it', 'I love...', 'Make it', 'I am going', 'I see it', 'I like...', 'I am coming from...', 'Dad', 'Grandmother or Mother', 'him or her', 'I have it', 'Look at this', 'I love you'],
  March: ['I', 'you', 'My name is...', 'and', 'eat', 'I like the taste of it', 'I love...', 'Make it', 'I am going', 'I see it', 'I like...', 'I am coming from...', 'Dad', 'Grandmother or Mother', 'him or her', 'I have it', 'Look at this', 'I love you', 'I am happy'],
};

// Mapping words to image file paths
const wordToImageMap: Record<string, string> = {
  'and': '/and_aqq.png',
  'Dad': '/Dad_ta\'ta.png',
  'eat': '/eat_mijisi.png',
  'Grandmother or Mother': '/Grandmother_kiju\'.png',
  'him or her': '/him_or_her_nekm.png',
  'I am coming from...': '/I_am_coming_from_wejiey.png',
  'I am going': '/I_am_going_eliey.png',
  'I am happy': '/I_am_happy_welta\'si.png',
  'I have it': '/I_have_it_ala\'tu.png',
  'I like...': '/I_like_kesatm.png',
  'I like the taste of it': '/I_like_the_taste_of_it_wiktm.png',
  'I love...': '/I_love_kesalk.png',
  'I love you': '/I_love_you_kesalul.png',
  'I': '/I_ni\'n.png',
  'I see it': '/I_see_it_nemitu.png',
  'Look at this': '/Look_at_this_ula.png',
  'Make it': '/make_it_l\'tu.png',
  'My name is...': '/my_name_is_teluisi.png',
  'you': '/you_ki\'l.png',
};

const App: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('September'); // State for selected month
  const [message, setMessage] = useState<string>('Drag the bear paw to the correct image!'); // State for message
  const [gridWords, setGridWords] = useState<string[]>([]); // State for grid words
  const [winningWord, setWinningWord] = useState<string>(''); // State for the winning word
  const [usedWords, setUsedWords] = useState<string[]>([]); // State for used words
  const months = Object.keys(wordsByMonth); // Extract month keys
  const [round, setRound] = useState<number>(0); // Track current round
  const [gameEnded, setGameEnded] = useState<boolean>(false); // State for game ended
  const [hoveredTile, setHoveredTile] = useState<number | null>(null);
  const [dragged, setDragged] = useState<boolean>(false);

  // Function to generate random grid words
  const generateRandomGridWords = () => {
    // Get the available words for the selected month (you used 'March' for testing)
    const words = wordsByMonth['March'];

    // Shuffle the words and select up to 9 unique words
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    const selectedWords = shuffledWords.slice(0, 9); // Select 9 unique words for the grid

    // Ensure the winning word is included in the grid
    if (winningWord && !selectedWords.includes(winningWord)) {
      selectedWords[Math.floor(Math.random() * 9)] = winningWord; // Replace a random tile with the winning word
    }

    // Set the grid with the selected words
    setGridWords(selectedWords); // No need to add empty tiles, always 9 words now
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

    setUsedWords(prev => [...prev, winningWord]);

    if (usedWords.length == wordsByMonth[selectedMonth].length - 1) {
      setGameEnded(true);
      setMessage("Game ended. Select a new month to play again.");
      return;
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
    setMessage('Drag the bear paw to the correct image!'); // Clear previous messages
  };

  useEffect(() => {
    selectWinningWord(); // Set new winning word based on updated month
    generateRandomGridWords(); // Generate new grid words based on updated month
  }, [selectedMonth, usedWords]); // Run effect when selectedMonth or usedWords changes

  return (
    <div style={{ backgroundImage: 'url("/App_Background.jpg")' }} className="bg-no-repeat bg-cover h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className='text-8xl font-bold mb-10'>Mi'kmaq Pictionary</div>
      <div className='flex gap-10'>

        {/* Display "Win" or "Lose" Message */}
        {message && (
          <div className="mt-1 mb-1 p-4 bg-yellow-100 border-8 border-yellow-400 text-yellow-800 rounded-lg text-2xl font-bold">
            {message}
          </div>
        )}

      </div>

      <div className='flex items-center justify-start gap-10 min-w-96' >
        <img src="/Audio_Button.png" alt="Drag Me" className="w-24 h-24" />
        {/* Display the Winning Word */}
        <div>
          {winningWord && (
            <h2 className="text-5xl font-bold mb-1">{winningWord}</h2>
          )}
        </div>
      </div>

      <div className='flex justify-between items-end'>


        <div className='flex flex-col justify-between items-center h-full mr-6'>
          {/* Dropdown Menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              className="relative border-8 border-black bg-lime-500 text-black px-4 py-2 h-16 text-xl font-bold rounded-lg flex items-center justify-between w-44"
            >
              <div>{selectedMonth}</div>
              {/* Dropdown arrow */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 ml-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              className="bg-white border border-gray-200 rounded-lg shadow-md w-44"
            >
              {months.map((month) => (
                <DropdownMenu.Item
                  key={month}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-xl"
                  onClick={() => handleMonthChange(month)}
                >
                  {month}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>




          {/* Draggable PNG Image */}
          <div
            className="w-36 h-36"
            draggable
            onDragStart={() => setDragged(true)}  // Track drag start
            onDragEnd={() => setDragged(false)}   // Reset drag state after drop
          >
            <img src="/bear_paw.PNG" alt="Drag Me" className="w-full h-full translate-y-4 cursor-pointer" />
          </div>
        </div>



        <div className={`${gameEnded ? ' pointer-events-none opacity-50' : ''}`}>
          {/* 3x3 Grid Layout */}
          <div className="grid grid-cols-3 grid-rows-3 gap-4 mt-6 w-480">
            {gridWords.map((word, index) => (
              <div
                key={index}
                className={`flex items-center justify-center border-8 border-black h-36 w-36 text-xl ${dragged && hoveredTile === index ? 'bg-gray-400' : 'bg-white'}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (dragged) setHoveredTile(index);
                }}
                onDragLeave={() => setHoveredTile(null)}
                onDrop={() => {
                  handleTileDrop(word);
                  setHoveredTile(null);
                }}
              >
                <img src={wordToImageMap[word]} alt={word} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

        </div>
        <div className='flex flex-col justify-between items-center h-full ml-6'>
          <img src="/heart.png" alt="Drag Me" className="w-36 h-36" />

          {/* Dictionary Button with Pop-up */}
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <div className='flex flex-col justify-center items-center translate-y-8 cursor-pointer'>
                <img src="/Dictionary.png" alt="Dictionary" className="w-36 h-36" />
                <button className="bg-transparent text-black px-2 py-2 rounded-lg ml-4 text-3xl font-bold">
                  Dictionary
                </button>
              </div>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
              <Dialog.Content className="fixed inset-0 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg">
                  <Dialog.Title className="text-2xl font-bold mb-4">Mi'kmaq Dictionary</Dialog.Title>
                  <Dictionary wordsByMonth={wordsByMonth} wordToImageMap={wordToImageMap} />
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </div >
  );
};

export default App;

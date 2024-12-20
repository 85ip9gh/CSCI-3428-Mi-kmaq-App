/**
 * Mi'kmaq Pictionary App
 * 
 * Purpose: This app is a simple educational game that helps users learn Mi'kmaq words by matching them to
 * images.
 *
 * Authors: Susan MacInnis, Zachary Ivanoff, Pesanth Janaseth Rangaswamy Anitha, Natalie Falldien, Ronen
 * Franzman 
 */


import React, { useState, useEffect } from 'react';

//Radix UI Dialog: https://www.radix-ui.com/primitives/docs/components/dialog
import * as Dialog from '@radix-ui/react-dialog';

//Radix UI Dropdown Menu: https://www.radix-ui.com/primitives/docs/components/dropdown-menu
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Dictionary from './Dictionary';

// Mi'kmaq words by month
const wordsByMonth: Record<string, string[]> = {
  'Wikumkewiku\'s': ['ni\'n', 'ki\'l', 'teluisi'],
  'Wikewiku\'s': ['ni\'n', 'ki\'l', 'teluisi', 'aqq', 'mijisi', 'wiktm'],
  'Keptekewiku\'s': ['ni\'n', 'ki\'l', 'teluisi', 'aqq', 'mijisi', 'wiktm', 'kesalk', 'l\'tu', 'eliey'],
  'Kesikewiku\'s': ['ni\'n', 'ki\'l', 'teluisi', 'aqq', 'mijisi', 'wiktm', 'kesalk', 'l\'tu', 'eliey', 'nemitu', 'kesatm', 'wejiey'],
  'Punamujuiku\'s': ['ni\'n', 'ki\'l', 'teluisi', 'aqq', 'mijisi', 'wiktm', 'kesalk', 'l\'tu', 'eliey', 'nemitu', 'kesatm', 'wejiey', 'ta\'ta', 'kiju\'', 'nekm'],
  'Apuknajit': ['ni\'n', 'ki\'l', 'teluisi', 'aqq', 'mijisi', 'wiktm', 'kesalk', 'l\'tu', 'eliey', 'nemitu', 'kesatm', 'wejiey', 'ta\'ta', 'kiju\'', 'nekm', 'ala\'tu', 'ula', 'kesalul'],
  'Si\'ko\'ku\'s': ['ni\'n', 'ki\'l', 'teluisi', 'aqq', 'mijisi', 'wiktm', 'kesalk', 'l\'tu', 'eliey', 'nemitu', 'kesatm', 'wejiey', 'ta\'ta', 'kiju\'', 'nekm', 'ala\'tu', 'ula', 'kesalul', 'welta\'si'],
};

// Mapping words to image file paths
const wordToImageMap: Record<string, string> = {
  'aqq': `${process.env.PUBLIC_URL}/and_aqq.png`,
  'ta\'ta': `${process.env.PUBLIC_URL}/Dad_ta\'ta.png`,
  'mijisi': `${process.env.PUBLIC_URL}/eat_mijisi.png`,
  'kiju\'': `${process.env.PUBLIC_URL}/Grandmother_kiju\'.png`,
  'nekm': `${process.env.PUBLIC_URL}/him_or_her_nekm.png`,
  'wejiey': `${process.env.PUBLIC_URL}/I_am_coming_from_wejiey.png`,
  'eliey': `${process.env.PUBLIC_URL}/I_am_going_eliey.png`,
  'welta\'si': `${process.env.PUBLIC_URL}/I_am_happy_welta\'si.png`,
  'ala\'tu': `${process.env.PUBLIC_URL}/I_have_it_ala\'tu.png`,
  'kesatm': `${process.env.PUBLIC_URL}/I_like_kesatm.png`,
  'wiktm': `${process.env.PUBLIC_URL}/I_like_the_taste_of_it_wiktm.png`,
  'kesalk': `${process.env.PUBLIC_URL}/I_love_kesalk.png`,
  'kesalul': `${process.env.PUBLIC_URL}/I_love_you_kesalul.png`,
  'ni\'n': `${process.env.PUBLIC_URL}/I_ni\'n.png`,
  'nemitu': `${process.env.PUBLIC_URL}/I_see_it_nemitu.png`,
  'ula': `${process.env.PUBLIC_URL}/Look_at_this_ula.png`,
  'l\'tu': `${process.env.PUBLIC_URL}/make_it_l\'tu.png`,
  'teluisi': `${process.env.PUBLIC_URL}/my_name_is_teluisi.png`,
  'ki\'l': `${process.env.PUBLIC_URL}/you_ki\'l.png`,
};

// Mapping words to audio file paths
const wordToAudioMap: Record<string, string> = {
  'aqq': `${process.env.PUBLIC_URL}/aqq.wav`,
  'ta\'ta': `${process.env.PUBLIC_URL}/tata.wav`,
  'mijisi': `${process.env.PUBLIC_URL}/mijisi.wav`,
  'kiju\'': `${process.env.PUBLIC_URL}/kiju.wav`,
  'nekm': `${process.env.PUBLIC_URL}/nekm.wav`,
  'wejiey': `${process.env.PUBLIC_URL}/wejiey.wav`,
  'eliey': `${process.env.PUBLIC_URL}/eliey.wav`,
  'welta\'si': `${process.env.PUBLIC_URL}/weltasi.wav`,
  'ala\'tu': `${process.env.PUBLIC_URL}/alatu.wav`,
  'kesatm': `${process.env.PUBLIC_URL}/kesatm.wav`,
  'wiktm': `${process.env.PUBLIC_URL}/wiktm.wav`,
  'kesalk': `${process.env.PUBLIC_URL}/kesalk.wav`,
  'kesalul': `${process.env.PUBLIC_URL}/kesalul.wav`,
  'ni\'n': `${process.env.PUBLIC_URL}/nin.wav`,
  'nemitu': `${process.env.PUBLIC_URL}/nemitu.wav`,
  'ula': `${process.env.PUBLIC_URL}/ula.wav`,
  'l\'tu': `${process.env.PUBLIC_URL}/ltu.wav`,
  'teluisi': `${process.env.PUBLIC_URL}/teluisi.wav`,
  'ki\'l': `${process.env.PUBLIC_URL}/kil.wav`,
};

// App Component
const App: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('Wikumkewiku\'s'); // State for selected month
  const [message, setMessage] = useState<string>('Drag the bear paw to the correct image!'); // State for message
  const [gridWords, setGridWords] = useState<string[]>([]); // State for grid words
  const [winningWord, setWinningWord] = useState<string>(''); // State for the winning word
  const [usedWords, setUsedWords] = useState<string[]>([]); // State for used words
  const months = Object.keys(wordsByMonth); // Extract month keys
  const [round, setRound] = useState<number>(0); // Track current round
  const [gameEnded, setGameEnded] = useState<boolean>(false); // State for game ended
  const [hoveredTile, setHoveredTile] = useState<number | null>(null);
  const [dragged, setDragged] = useState<boolean>(false);

  // Purpose: Generates random grid words for the game
  // Parameters: None
  const GenerateRandomGridWords = () => {
    // Get the available words for the selected month (you used 'March' for testing)
    const words = wordsByMonth[selectedMonth];

    // Shuffle the words and select up to 9 unique words
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    const selectedWords = shuffledWords.slice(0, 9); // Select 9 unique words for the grid

    // Ensure the winning word is included in the grid
    if (winningWord && !selectedWords.includes(winningWord)) {
      selectedWords[Math.floor(Math.random() * 9)] = winningWord; // Replace a random tile with the winning word
    }

    console.log(selectedWords);
    // Set the grid with the selected words
    setGridWords(selectedWords); // No need to add empty tiles, always 9 words now
  };

  // Purpose: Selects a random winning word from the available words for the selected month
  // Parameters: None
  const SelectWinningWord = () => {
    const words = wordsByMonth[selectedMonth].filter(word => !usedWords.includes(word));
    if (words.length > 0) {
      const randomIndex = Math.floor(Math.random() * words.length);
      const selectedWord = words[randomIndex];
      setWinningWord(selectedWord); // Set the winning word
    }
  };

  // Purpose: Handles the tile drop event and updates the game state
  // Parameters:
  // - tileWord: The word on the dropped tile
  const HandleTileDrop = (tileWord: string) => {
    setDragged(false);

    // Check if the dropped tile corresponds to the winning word
    if (tileWord === winningWord) {
      setMessage(`kelu’lk tela’tekn!`);
      addStar();
    } else {
      setMessage(`kjinu’kwalsi ap!`);
    }

    // Add the used word to the list
    setUsedWords(prev => [...prev, winningWord]);

    // Check if the game has ended
    if (usedWords.length == wordsByMonth[selectedMonth].length - 1) {
      setGameEnded(true);
      setMessage("Game ended. Select a new month to play again.");
      return;
    }

    // Prepare for the next round
    setRound(prev => prev + 1); // Increment the round
  };

  // Purpose: Handles the month change event and resets the game state
  // Parameters:
  // - month: The month to be selected
  const HandleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setUsedWords([]); // Reset used words for the new month
    setRound(0); // Reset round count for the new month
    setGameEnded(false); // Reset game ended state
    setMessage('Drag the bear paw to the correct image!'); // Clear previous messages
    resetStars();
  };

  useEffect(() => {
    SelectWinningWord(); // Set new winning word based on updated month
  }, [selectedMonth, usedWords]); // Run effect when selectedMonth or usedWords changes

  useEffect(() => {
    // After the winning word is selected, generate random grid words
    GenerateRandomGridWords();
  }, [winningWord]);

  const [stars, setStars] = useState<string[]>([]);

  const addStar = () => {
    const newStar = `${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`;
    setStars([...stars, newStar]); //add star to array
  };

  const resetStars = () => {
    setStars([]);  // Reset stars to empty array
  };
  
  // Audio playback function
  const playAudio = (word: string) => {
    const audioPath = wordToAudioMap[word];
    if (audioPath) {
      const audio = new Audio(audioPath);
      audio.play();
    } else {
      console.error(`No audio found for word: ${word}`);
    }
  };

  return (

    <div style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/App_Background.jpg)` }} className="bg-no-repeat bg-cover h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className='text-8xl font-bold mb-10'>Mi'kmaq Pictionary</div>
      <div className='flex gap-10'>

        {/* Display "Win" or "Lose" Message */}
        {message && (
          <div
            className={`mt-1 mb-1 p-4 border-8 rounded-lg text-2xl font-bold ${message === `kelu’lk tela’tekn!`
              ? 'bg-green-100 border-green-400 text-green-800'
              : message === `kjinu’kwalsi ap!`
                ? 'bg-red-100 border-red-400 text-red-800'
                : 'bg-yellow-100 border-yellow-400 text-yellow-800'
              }`}
          >
            {message}
          </div>
        )}


      </div>

      <div className='flex items-center justify-start gap-10 min-w-96' >
        <img src={`${process.env.PUBLIC_URL}/Audio_Button.png`} alt="Drag Me" className="w-24 h-24" onClick={() => playAudio(winningWord)}/>
        {/* Display the Winning Word */}
        <div>
          {winningWord && (
            <h2 className="text-5xl font-bold mb-1">{winningWord}</h2>

          )}
        </div>

        <div className='flex items-center justify-center gap-4 lg:gap-10 min-w-96' >
          <img src={`${process.env.PUBLIC_URL}/Audio_Button.png`} alt="Drag Me" className="w-8 h-8 lg:w-20 lg:h-20" />
          {/* Display the Winning Word */}
          <div>
            {winningWord && (
              <h2 className="text-2xl lg:text-5xl font-bold mb-1">{winningWord}</h2>
            )}
          </div>
        </div>

      {/* Dektop View */}
      <div className='flex justify-between items-end hidden sm:block'>
        <div className='flex flex-col justify-between items-center h-full mr-6'>
          {/* Dropdown Menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              className="relative border-8 border-black bg-lime-500 text-black px-4 py-2 h-16 text-xl font-bold rounded-lg flex items-center w-56"
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
                  d="M19 9l-7 8-7-7"
                />
              </svg>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              className="bg-white border border-gray-200 rounded-lg items-center shadow-md w-56 z-30"
            >
              {months.map((month) => (
                <DropdownMenu.Item
                  key={month}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-xl"
                  onClick={() => HandleMonthChange(month)}
                >
                  {month}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          {/* Draggable PNG Image*/}
          <div
            className="w-36 h-36"
            draggable
            onDragStart={() => setDragged(true)}  // Track drag start
            onDragEnd={() => setDragged(false)}   // Reset drag state after drop
          >
            <img src={`${process.env.PUBLIC_URL}/bear_paw.png`} alt="Drag Me" className="w-full h-full translate-y-4 cursor-pointer" />
          </div>
        </div>

        <div className={`${gameEnded ? ' pointer-events-none opacity-50' : ''}`}>
          {/* 3x3 Grid Layout */}
          <div className={`grid grid-cols-3 ${gridWords.length == 3 ? 'grid-rows-1' : 'grid-rows3'} gap-4 mt-6 w-480`}>
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
                  HandleTileDrop(word);
                  setHoveredTile(null);
                }}
              >
                <img src={wordToImageMap[word]} alt={word} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className='flex flex-col justify-between items-center h-full ml-6'>
          <img src={`${process.env.PUBLIC_URL}/heart.png`} alt="Heart" className="w-36 h-36" />

          <div className="image-container">
            {stars.map((star, index) => (
              <img className="w-24 h-24" key={index} src={star} alt={`Image ${index}`} />
            ))}
          </div>

          {/* Dictionary Button with Pop-up */}
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <div className='flex flex-col justify-center items-center translate-y-8 cursor-pointer'>
                <img src={`${process.env.PUBLIC_URL}/Dictionary.png`} alt="Dictionary" className="w-36 h-36" />
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

      {/* Mobile View */}
      <div className='flex flex-col justify-between block sm:hidden'>
        <div className='flex flex-row justify-between items-center'>
          {/* Dropdown Menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              className="relative border-4 border-black bg-lime-500 text-black px-4 py-2 h-12 text-sm font-bold rounded-lg flex items-center w-40 ml-2"
            >
              <div>{selectedMonth}</div>
              {/* Dropdown arrow */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-4 h-4 ml-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 8-7-7"
                />
              </svg>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              className="bg-white border border-gray-200 rounded-lg items-center shadow-md w-34 z-30"
            >
              {months.map((month) => (
                <DropdownMenu.Item
                  key={month}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-md"
                  onClick={() => HandleMonthChange(month)}
                >
                  {month}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          <img src={`${process.env.PUBLIC_URL}/heart.png`} alt="Heart" className="w-20 mr-4"/>
        </div>

        {/* <div className="image-container">
          {stars.map((star, index) => (
            <img className="w-24 h-24" key={index} src={star} alt={`Image ${index}`} />
          ))}
        </div> */}

        <div className={`${gameEnded ? ' pointer-events-none opacity-50' : ''}`}>
          {/* 3x3 Grid Layout */}
          <div className={`grid grid-cols-3 ${gridWords.length == 3 ? 'grid-rows-1' : 'grid-rows3'} gap-1 mt-2  w-screen`}>
            {gridWords.map((word, index) => (
              <div
                key={index}
                className={`flex items-center border-8 border-black w-24 h-24 text-xl ${dragged && hoveredTile === index ? 'bg-gray-400' : 'bg-white'}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (dragged) setHoveredTile(index);
                }}
                onDragLeave={() => setHoveredTile(null)}
                onDrop={() => {
                  HandleTileDrop(word);
                  setHoveredTile(null);
                }}
              >
                <img src={wordToImageMap[word]} alt={word} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-row justify-between">
          {/* Draggable PNG Image */}
          <div
            className="w-20 h-20 ml-4 mt-4"
            draggable
            onDragStart={() => setDragged(true)}  // Track drag start
            onDragEnd={() => setDragged(false)}   // Reset drag state after drop
          >
            <img src={`${process.env.PUBLIC_URL}/bear_paw.png`} alt="Drag Me" className="w-full h-full translate-y-4 cursor-pointer" />
          </div>

          {/* Dictionary Button with Pop-up */}
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <div className='flex flex-col items-center translate-y-8 cursor-pointer'>
                <img src={`${process.env.PUBLIC_URL}/Dictionary.png`} alt="Dictionary" className="w-20 h-20" />
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
    </div>
  );
};

export default App;

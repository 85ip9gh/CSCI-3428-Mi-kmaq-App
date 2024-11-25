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

//React Draggable: https://www.npmjs.com/package/react-draggable
import Draggable from 'react-draggable';

import Dictionary from './Dictionary';

// Mi'kmaq words by month
const wordsByMonth: Record<string, string[]> = {
  'Wikumkewiku\'s': ['ni\'n', 'ki\'l', 'teluisi'],
  'Wikewiku\'s': ['ni\'n', 'ki\'l', 'teluisi', 'aqq', 'mijisi', 'wiktm'],
  'Keptekewiku\'s': ['ni\'n', 'ki\'l', 'teluisi', 'aqq', 'mijisi', 'wiktm', 'kesalk', 'l\'tu', 'eliey'],
  'Kesikewiku\'s': ['ni\'n', 'ki\'l', 'teluisi', 'aqq', 'mijisi', 'wiktm', 'kesalk', 'l\'tu', 'eliey', 'nemitu', 'kesatm', 'wejiey'],
  'Punamujuiku\'s': ['ni\'n', 'ki\'l', 'teluisi', 'aqq', 'mijisi', 'wiktm', 'kesalk', 'l\'tu', 'eliey', 'nemitu', 'kesatm', 'wejiey', 'ta\'ta', 'kiju\'', 'nekm'],
  'Apuknajit': ['ni\'n', 'ki\'l', 'teluisi', 'aqq', 'mijisi', 'wiktm', 'kesalk', 'l\'tu', 'eliey', 'nemitu', 'kesatm', 'wejiey', 'ta\'ta', 'kiju\'', 'nekm', 'ala\'tu', 'ula', 'kesalul'],
  'Si\'ko\'ku\'s': ['ni\'n', 'ki\'l', 'teluisi', 'aqq', 'mijisi', 'wiktm', 'kesalk', 'l\'tu', 'eliey', 'nemitu', 'kesatm', 'wejiey', 'ta\'ta', 'kiju\'', 'nekm', 'ala\'tu', 'ula', 'kesalul', 'welta\'si', 'wen'],
};

const months = [
  { name: "Wikumkewiku's", translation: "September" },
  { name: "Wikewiku's", translation: "October" },
  { name: "Keptekewiku's", translation: "November" },
  { name: "Kesikewiku's", translation: "December" },
  { name: "Punamujuiku's", translation: "January" },
  { name: "Apuknajit", translation: "February" },
  { name: "Si'ko'ku's", translation: "March" },
];

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
  'wen': `${process.env.PUBLIC_URL}/who_wen.png`,
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
  'wen': `${process.env.PUBLIC_URL}/wen.wav`,
};

// App Component
const App: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('Wikumkewiku\'s'); // State for selected month
  const [message, setMessage] = useState<string>('Drag the Bear Paw to the Right Picture!'); // State for message
  const [gridWords, setGridWords] = useState<string[]>([]); // State for grid words
  const [winningWord, setWinningWord] = useState<string>(''); // State for the winning word
  const [usedWords, setUsedWords] = useState<string[]>([]); // State for used words
  const [round, setRound] = useState<number>(0); // Track current round
  const [gameEnded, setGameEnded] = useState<boolean>(false); // State for game ended
  const [hoveredTile, setHoveredTile] = useState<number | null>(null);
  const [dragged, setDragged] = useState<boolean>(false);

  // Purpose: Generates random grid words for the game
  // Parameters: None
  const GenerateRandomGridWords = () => {
    // Get the available words for the selected month
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

  let currentAudio: HTMLAudioElement | null = null;

  const [stars, setStars] = useState<string[]>([`${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`, `${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`, `${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`, `${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`, `${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`, `${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`, `${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`, `${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`, `${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`, `${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`, `${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`, `${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`, `${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`, `${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`, `${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`, `${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`, `${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`, `${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`, `${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`, `${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`]); // State for stars

  const addStar = () => {
    const newStar = `${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`;
    setStars([...stars, newStar]); //add star to array
  };

  const playAudio = (audioPath: string) => {

    if (audioPath) {
      // If an audio is already playing, stop it
      if (currentAudio && !currentAudio.paused) {
        console.warn("Audio already playing. Please wait.");
        return;
      }

      // Create a new audio instance
      currentAudio = new Audio(audioPath);

      // Play the audio
      currentAudio.play();

      // Reset currentAudio when playback ends
      currentAudio.addEventListener('ended', () => {
        currentAudio = null;
      });

      // Handle errors
      currentAudio.addEventListener('error', () => {
        console.error(`Error playing audio for word: ${audioPath}`);
        currentAudio = null;
      });
    } else {
      console.error(`No audio found for word: ${audioPath}`);
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
    setStars([]);
  };

  useEffect(() => {
    SelectWinningWord(); // Set new winning word based on updated month
  }, [selectedMonth, usedWords]); // Run effect when selectedMonth or usedWords changes

  useEffect(() => {
    // After the winning word is selected, generate random grid words
    playAudio(wordToAudioMap[winningWord]);
    GenerateRandomGridWords();
  }, [winningWord]);

  return (
    <div style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/App_Background.jpg)` }} className="bg-no-repeat bg-cover h-screen max-h- bg-center flex flex-col items-center justify-between bg-gray-50 w-full overflow-hidden">
      <div className='flex gap-10 justify-center'>

        {/* Display "Win" or "Lose" Message */}
        {message && (
          <div
            className={`mt-1 mb-1 p-1 border-4 rounded-lg text-xl text-center font-bold ${message === `kelu’lk tela’tekn!`
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

      <div className='flex items-center justify-center gap-2 min-w-96' >
        <div className="group flex flex-col justify-center items-center cursor-pointer relative">
          <img src={`${process.env.PUBLIC_URL}/Audio_Button.png`} alt="Drag Me" className="w-16 h-16 cursor-pointer z-10" onClick={() => playAudio(wordToAudioMap[winningWord])} />
          <div className="absolute w-8 h-8 bg-transparent rounded-full group-hover:bg-white group-hover:shadow-[0_0_20px_30px_rgba(255,255,255,1)] pointer-events-none z-0"></div>
        </div>

        {/* Display the Winning Word */}
        <div>
          {winningWord && (
            <h2 className="text-5xl font-bold mb-1">{winningWord}</h2>
          )}
        </div>
      </div>

      <div className='flex items-center justify-between gap-2 w-480'>

        {/* Dropdown Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            className="relative border-8 border-black bg-lime-500 text-black px-4 py-2 h-16 text-xl font-bold rounded-lg flex items-center justify-between w-56 hover:shadow-[0_0_20px_16px_rgba(255,255,255,1)]"
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
            className="bg-white border border-gray-200 rounded-lg shadow-md w-72 z-30"
          >
            {months.map(({ name, translation }) => (
              <DropdownMenu.Item
                key={name}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-xl"
                onClick={() => HandleMonthChange(name)}
              >
                {name} ({translation})
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>


        <img src={`${process.env.PUBLIC_URL}/heart.png`} alt="Drag Me" className="w-24 h-24" />

      </div>

      <div className='flex flex-col justify-between items-center'>
        <div className={`${gameEnded ? ' pointer-events-none opacity-50' : ''}`}>
          {/* 3x3 Grid Layout */}
          <div className="grid grid-cols-3 grid-rows-3 gap-2 mt-6 w-480">
            {Array.from({ length: 9 }, (_, index) => {
              // Use gridWords if index is within its length; otherwise, use placeholder
              const word = gridWords[index] || "placeholder";
              const imageSrc = word === "placeholder" ? `${process.env.PUBLIC_URL}/green.png` : wordToImageMap[word];

              return (
                <div
                  key={index}
                  className={`flex items-center justify-center border-8 border-black h-24 w-24 text-xl ${dragged && hoveredTile === index ? 'bg-gray-400' : 'bg-white'}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (dragged) setHoveredTile(index);
                  }}
                  onDragLeave={() => setHoveredTile(null)}
                  onDrop={() => {
                    if (word !== "placeholder") HandleTileDrop(word); // Prevent drop action on placeholder tiles
                    setHoveredTile(null);
                  }}
                >
                  <img src={imageSrc} alt={word} className="w-full h-full object-cover" />
                </div>
              );
            })}
          </div>

        </div>

        <div className='flex items-center justify-between w-full mt-1'>
          <div
            className="w-24 h-24"
            draggable
            onDragStart={() => setDragged(true)}  // Track drag start
            onDragEnd={() => setDragged(false)}   // Reset drag state after drop
          >
            <div className="group flex flex-col justify-center items-center cursor-pointer relative">
              <img
                src={`${process.env.PUBLIC_URL}/bear_paw.png`}
                alt="Drag Me"
                className="w-full h-full cursor-pointer z-10"
              />
              <div className="absolute w-10 h-10 bg-transparent rounded-full group-hover:bg-white group-hover:shadow-[0_0_20px_30px_rgba(255,255,255,1)] pointer-events-none"></div>
            </div>
          </div>
          <div className='flex'>
            <div className='grid grid-cols-5 gap-2'>
              {stars.map((star, index) => (
                <div className="group flex flex-col justify-center items-center relative">
                  <img key={index} src={star} alt="Star" className="w-4 h-4 z-10" />
                  <div className="absolute w-4 h-4 bg-transparent rounded-full bg-yellow-500 group-hover:shadow-[0_0_10px_10px_rgba(234, 179, 8,0.7)] pointer-events-none z-0"></div>
                </div>
              ))}

            </div>
            {/* <div className="group flex flex-col justify-center items-center cursor-pointer relative">
              <img src={`${process.env.PUBLIC_URL}/Audio_Button.png`} alt="Drag Me" className="w-16 h-16 cursor-pointer z-10" onClick={() => playAudio(wordToAudioMap[winningWord])} />
              <div className="absolute w-8 h-8 bg-transparent rounded-full group-hover:bg-white group-hover:shadow-[0_0_20px_30px_rgba(255,255,255,1)] pointer-events-none z-0"></div>
            </div> */}

          </div>

          <div className='flex flex-col justify-between items-center h-full ml-6'>
            {/* Dictionary Button with Pop-up */}
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <div className="group flex flex-col justify-center items-center cursor-pointer relative">
                  <img
                    src={`${process.env.PUBLIC_URL}/Dictionary.png`}
                    alt="Dictionary"
                    className="w-24 h-24 object-contain relative z-10"
                  />
                  <div className="absolute w-10 h-10 bg-transparent rounded-full group-hover:bg-white group-hover:shadow-[0_0_20px_30px_rgba(255,255,255,1)] pointer-events-none"></div>
                </div>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                <Dialog.Content className="fixed inset-0 flex items-center justify-center">
                  <div className="bg-white p-8 rounded-lg">
                    <Dialog.Title className="text-2xl font-bold mb-4">Mi'kmaq Dictionary</Dialog.Title>
                    <Dictionary wordsByMonth={wordsByMonth} wordToImageMap={wordToImageMap} wordToAudioMap={wordToAudioMap} />
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </div>
    </div >
  );
};

export default App;

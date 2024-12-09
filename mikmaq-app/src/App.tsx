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
import DraggableItem from './DraggableItem';
import GridCell from './GridCell';

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

// Natalie implemented the word to image mappings and created the images. She also handled a lot of the stylistic 
// aspects of the App utilizing tailwind CSS.
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
  'kjinukwalsiap': `${process.env.PUBLIC_URL}/kjinukwalsiap.wav`,
  'kelulk_telatekn': `${process.env.PUBLIC_URL}/kelulktelatekn.wav`,
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

  // Purpose: Generates random grid words for the game
  // Parameters: None
  const GenerateRandomGridWords = () => {
    // Get the available words for the selected month
    const words = wordsByMonth[selectedMonth];

    // Shuffle the words and select up to 9 unique words
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    const selectedWords = shuffledWords.slice(0, Math.min(words.length, 9)); // Select up to 9 unique words

    // Ensure the winning word is included in the grid
    if (winningWord && !selectedWords.includes(winningWord)) {
      if (selectedWords.length < 9) {
        selectedWords.push(winningWord); // Add the winning word if there's space
      } else {
        selectedWords[Math.floor(Math.random() * selectedWords.length)] = winningWord; // Replace a random word
      }
    }

    // Pad the grid to ensure it has exactly 9 cells
    const paddedGrid = [...selectedWords].concat(
      Array(9 - selectedWords.length).fill("placeholder") // Fill remaining cells with placeholders
    );

    // Set the grid with the padded words
    setGridWords(paddedGrid);
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

  const [stars, setStars] = useState<string[]>([]); // State for stars

  let currentAudio: HTMLAudioElement | null = null;

  const starsRef = React.useRef<string[]>([]);
  const roundRef = React.useRef<number>(0);

  // Purpose: Sync the star state with the ref
  // Parameters: None
  useEffect(() => {
    starsRef.current = stars;
  }, [stars]);


  // Purpose: Sync the round state with the ref
  // Parameters: None
  useEffect(() => {
    roundRef.current = round;
  }, [round]);


  // Purpose: Add a star to the star state
  // Parameters: None
  const addStar = () => {
    const newStar = `${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`;

    // Update the ref
    starsRef.current = [...starsRef.current, newStar];

    // Update the state to trigger re-render
    setStars(starsRef.current);
  };

  const audioQueueRef = React.useRef<string[]>([]); // Ref to track the current audio queue

  // Purpose: Play the audio files in sequence
  // Parameters: audioPaths - The array of audio file paths to play
  const playAudio = (audioPaths: string[]) => {
    if (!audioPaths || audioPaths.length === 0) {
      console.error("No audio paths provided.");
      return;
    }

    // Replace the queue for the current round
    audioQueueRef.current = audioPaths;

    // Susan implemented the audio system and added audio for missing words when needed
    // Purpose: Play the next audio in the queue
    // Parameters: index - The index of the current audio in the queue
    const playNextAudio = (index: number) => {
      if (index >= audioQueueRef.current.length) {
        currentAudio = null; // Reset after all audios are played
        return;
      }

      // Skip playback if the audio queue has changed (new round)
      if (audioPaths !== audioQueueRef.current) {
        return;
      }

      const audioPath = audioPaths[index];
      currentAudio = new Audio(audioPath);

      currentAudio.play().catch((error) => {
        console.error(`Failed to play audio: ${audioPath}`, error);
        currentAudio = null;
      });

      currentAudio.addEventListener("ended", () => {
        currentAudio = null;
        playNextAudio(index + 1); // Play the next audio in sequence
      });

      currentAudio.addEventListener("error", (e) => {
        console.error(`Error playing audio: ${audioPath}`, e);
        currentAudio = null;
        playNextAudio(index + 1); // Skip to the next audio on error
      });
    };

    playNextAudio(0); // Start playing from the first audio
  };


  // Purpose: Handles the tile drop event and updates the game state
  // Parameters:
  // - tileWord: The word on the dropped tile
  const HandleTileDrop = (tileWord: string) => {

    // Check if the dropped tile corresponds to the winning word
    if (tileWord === winningWordRef.current) {
      setMessage(`kelu’lk tela’tekn!`);
      addStar();
    } else {
      setMessage(`kjinu’kwalsi ap!`);
    }

    setUsedWords((prev) => {
      const updatedUsedWords = [...prev, winningWordRef.current];
      return updatedUsedWords;
    });

    // Increment the round using the ref
    roundRef.current += 1;

    // Sync the state with the ref
    setRound(roundRef.current);
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

  // Purpose: Update the winning word when the selected month changes
  // Parameters: None
  useEffect(() => {
    SelectWinningWord(); // Set new winning word based on updated month
  }, [selectedMonth, usedWords]); // Run effect when selectedMonth or usedWords changes

  // Ref for winning word
  const winningWordRef = React.useRef<string>('');

  // Purpose: Sync the winning word with the ref
  // Parameters: None
  useEffect(() => {
    winningWordRef.current = winningWord;
  }, [winningWord]);

  // Ref for grid words
  const gridWordsRef = React.useRef<string[]>([]);

  // Purpose: Sync the grid words with the ref
  // Parameters: None
  useEffect(() => {
    gridWordsRef.current = gridWords;
  }, [gridWords]);


  // Purpose: Generate random grid words when the winning word changes
  // Parameters: None
  useEffect(() => {
    GenerateRandomGridWords();
  }, [winningWord, round, selectedMonth]);

  useEffect(() => {
    if (winningWord && message) {
      // Determine the appropriate message audio path
      const messageAudioPath =
        message === `kelu’lk tela’tekn!`
          ? wordToAudioMap["kelulk_telatekn"]
          : message === `kjinu’kwalsi ap!`
            ? wordToAudioMap["kjinukwalsiap"]
            : null;

      const winningWordAudioPath = wordToAudioMap[winningWord];

      // Always play both the message and the winning word in sequence
      const audioSequence = [];
      if (messageAudioPath) audioSequence.push(messageAudioPath);
      if (winningWordAudioPath) audioSequence.push(winningWordAudioPath);

      if (audioSequence.length > 0) {
        playAudio(audioSequence); // Play the audio sequence
      }
    }
  }, [winningWord, message, round]);




  // Purpose: Check if the game has ended when used words change
  // Parameters: None
  useEffect(() => {
    if (usedWords.length === wordsByMonth[selectedMonth].length) {
      setGameEnded(true);
      setMessage("Game ended. Select a new month to play again.");
    }
  }, [usedWords]);


  return (
    <div style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/App_Background.jpg)` }} className="bg-no-repeat bg-cover h-screen max-h- bg-center flex flex-col items-center justify-center bg-gray-50 w-full overflow-hidden">
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

      {/* Display the Winning Word and Audio Button */}
      <div className='flex items-center justify-center gap-2 min-w-96' >
        <div className="group flex flex-col justify-center items-center cursor-pointer relative">

          {/* Audio Button */}
          <img src={`${process.env.PUBLIC_URL}/Audio_Button.png`} alt="audio" className="w-16 h-16 cursor-pointer z-10" onClick={() => playAudio([wordToAudioMap[winningWord]])} />
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
        {/* Susan implemented the months dropdown */}
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


        <img src={`${process.env.PUBLIC_URL}/heart.png`} alt="heart" className="w-24 h-24" />

      </div>

      {/* Display the Grid */}
      {/* Zachary implemented the grid and handled a majority of the game logic*/}
      <div className='flex flex-col justify-between items-center'>
        <div className="flex flex-col justify-between items-center">
          <div className={`${gameEnded ? "pointer-events-none opacity-50" : ""}`}>
            <div className="grid grid-cols-3 grid-rows-3 gap-2 mt-6 w-480">
              {gridWords.map((word, index) => {

                const imageSrc =
                  word === "placeholder"
                    ? `${process.env.PUBLIC_URL}/green.png`  // Use a green placeholder image for missing words
                    : wordToImageMap[word];  // Get image for valid word

                return (
                  <GridCell
                    key={index}
                    index={index}
                    word={gridWords[index]} // Pass the word dynamically
                    gridWordsRef={gridWordsRef} // Pass the ref
                    imageSrc={imageSrc}
                    HandleTileDrop={HandleTileDrop}
                    gameEnded={gameEnded}
                  />


                );
              })}
            </div>
          </div>
        </div>


        <div className='flex items-center justify-between w-full mt-1'>
          {/* Ronen implemented the dragging paw functionality and the mobile view for the app*/}
          <div
            className="w-24 h-24"
            draggable
          >
            <DraggableItem id='paw' />
          </div>

          {/* Zachary implemented the Mi'kmaq stars logic */}
          <div className="flex">
            <div className="flex flex-wrap justify-center items-center gap-2 max-w-32 max-h-20">
              {stars.map((_, index) => {
                // Calculate the number of golden stars and remaining red stars
                const goldenStarCount = Math.floor(stars.length / 5);
                const redStarCount = stars.length % 5;

                // Render golden stars first
                if (index < goldenStarCount) {
                  const size = Math.max(20, 50 - stars.length * 4) + 10; // Golden stars are slightly larger
                  return (
                    <div
                      className="group flex justify-center items-center relative"
                      key={`golden-${index}`}
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                      }}
                    >
                      <img
                        src={`${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`}
                        alt="Golden Star"
                        style={{
                          width: `${size}px`,
                          height: `${size}px`,
                        }}
                        className="z-10"
                      />
                      <div
                        className="absolute rounded-full bg-yellow-400 pointer-events-none z-0"
                        style={{
                          width: `${size}px`,
                          height: `${size}px`,
                          boxShadow: `0 0 20px 15px rgba(255, 215, 0, 1)`, // Brighter glow for golden stars
                        }}
                      ></div>
                    </div>
                  );
                }

                // Render red stars for the remaining ones
                if (index - goldenStarCount < redStarCount) {
                  const size = Math.max(5, 50 - stars.length * 4); // Default size for red stars
                  return (
                    <div
                      className="group flex justify-center items-center relative"
                      key={`red-${index}`}
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                      }}
                    >
                      <img
                        src={`${process.env.PUBLIC_URL}/Mi'kmaq_Star.png`}
                        alt="Red Star"
                        style={{
                          width: `${size}px`,
                          height: `${size}px`,
                        }}
                        className="z-10"
                      />
                      <div
                        className="absolute rounded-full bg-red-400 pointer-events-none z-0"
                        style={{
                          width: `${size}px`,
                          height: `${size}px`,
                          boxShadow: `0 0 20px 15px rgba(248,113,113,255)`, // Default glow for red stars
                        }}
                      ></div>
                    </div>
                  );
                }

                return null; // No more stars to render
              })}
            </div>
          </div>



          {/* Pesanth implemented the dictionary functionality and adjusted formatting of components */}
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

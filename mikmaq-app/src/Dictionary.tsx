/**
 * Dictionary.tsx
 * 
 * Purpose: This file contains the Dictionary component that displays the words for the selected month and allows users to click on the words to view the corresponding images. The component also plays the audio for the selected word when the image is clicked.
 * 
 * Author: Pesanth Janaseth Rangaswamy Anitha
 */

import React, { useState } from 'react';

//Radix UI Dialog: https://www.radix-ui.com/primitives/docs/components/dialog
import * as Dialog from '@radix-ui/react-dialog';

interface DictionaryProps {
  wordsByMonth: Record<string, string[]>;
  wordToImageMap: Record<string, string>;
  wordToAudioMap: Record<string, string>;
}

const Dictionary: React.FC<DictionaryProps> = ({ wordsByMonth, wordToImageMap, wordToAudioMap }) => {
  const words = wordsByMonth['Si\'ko\'ku\'s'] || []; // Get words for the selected month
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  // Purpose: Handles the image click event and sets the selected image and word
  // Parameters:
  // - word: The word corresponding to the clicked image
  const HandleImageClick = (word: string) => {
    setSelectedImage(wordToImageMap[word]); // Set the selected image
    setSelectedWord(word); // Set the selected word
    playAudio(word); // Play the audio for the selected word
  };

  // Purpose: Closes the image popup and resets the selected image and word
  // Parameters: None
  const CloseImagePopup = () => {
    setSelectedImage(null);
    setSelectedWord(null);
  };


  let currentAudio: HTMLAudioElement | null = null;

  // Purpose: Plays the audio for the selected word
  // Parameters: word - The word for which the audio should be played
  const playAudio = (word: string) => {
    const audioPath = wordToAudioMap[word];

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
        console.error(`Error playing audio for word: ${word}`);
        currentAudio = null;
      });
    } else {
      console.error(`No audio found for word: ${word}`);
    }
  };


  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-50 z-20" />
      <Dialog.Content className="fixed bg-white p-4 rounded-lg shadow-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-visible z-30 w-full sm:w-1/2 xl:w-1/3">
        <div className='flex flex-col items-center justify-center'>
          <Dialog.Title className="text-4xl font-bold mb-2">Dictionary</Dialog.Title>
        </div>

        {/* Display only the words for the selected month */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {words.map((word, index) => (
            <div className='flex justify-center items-center flex-col'>
              <div
                key={index}
                className={`flex flex-col items-center justify-center border-2 border-gray-300 h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 bg-gray-100 text-l cursor-pointer 
        hover:bg-gray-400 hover:shadow-lg transition duration-300 
        ${selectedWord === word ? 'bg-gray-500 shadow-xl' : ''}`} // Add active styles
                onClick={() => HandleImageClick(word)} // Set image and word on click
              >
                <img src={wordToImageMap[word]} alt={word} className="h-full w-full m-2" />
              </div>
            </div>
          ))}
        </div>

        {/* Pop-up for selected image */}
        {selectedImage && (
          <Dialog.Content
            className="flex flex-col items-center justify-center fixed bg-white p-6 rounded-lg shadow-lg top-1/3 left-1/3 transform -translate-x-1/3 -translate-y-1/3 z-30 bg-gray-100 border-2 border-gray-300 w-full h-full"
          >
            <Dialog.Title className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">{selectedWord}</Dialog.Title>

            <img src={selectedImage} className="w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 object-cover" />

            {/* Transparent button covering the entire dialog */}
            <button
              className="absolute inset-0 absolute" // Full coverage and transparency
              onClick={CloseImagePopup} // Close only the image popup
            >
              {/* Optional: Add text or content here, or keep it empty */}
            </button>
          </Dialog.Content>

        )}

        <Dialog.Close asChild>
          <div className='flex flex-col items-center justify-center'>
            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
              Close
            </button>
          </div>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
};

export default Dictionary;

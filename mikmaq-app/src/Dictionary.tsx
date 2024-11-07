import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface DictionaryProps {
  wordsByMonth: Record<string, string[]>;
  wordToImageMap: Record<string, string>;
}

const Dictionary: React.FC<DictionaryProps> = ({ wordsByMonth, wordToImageMap }) => {
  const words = wordsByMonth['Si\'ko\'ku\'s'] || []; // Get words for the selected month
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  // Purpose: Handles the image click event and sets the selected image and word
  // Parameters:
  // - word: The word corresponding to the clicked image
  const HandleImageClick = (word: string) => {
    setSelectedImage(wordToImageMap[word]); // Set the selected image
    setSelectedWord(word); // Set the selected word
  };

  // Purpose: Closes the image popup and resets the selected image and word
  // Parameters: None
  const CloseImagePopup = () => {
    setSelectedImage(null);
    setSelectedWord(null);
  };


  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
      <Dialog.Content className="fixed bg-white p-6 rounded-lg shadow-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-visible">
        <div className='flex flex-col items-center justify-center'>
          <Dialog.Title className="text-4xl font-bold mb-2">Dictionary</Dialog.Title>
        </div>

        {/* Display only the words for the selected month */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {words.map((word, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-center border-2 border-gray-300 h-28 w-28 bg-gray-100 text-l cursor-pointer 
        hover:bg-gray-400 hover:shadow-lg transition duration-300 
        ${selectedWord === word ? 'bg-gray-500 shadow-xl' : ''}`} // Add active styles
              onClick={() => HandleImageClick(word)} // Set image and word on click
            >
              <img src={wordToImageMap[word]} alt={word} className="h-24 w-24 m-2" />
            </div>
          ))}
        </div>

        {/* Pop-up for selected image */}
        {selectedImage && (
          <Dialog.Content
            className="flex flex-col items-center justify-center fixed bg-white p-6 rounded-lg shadow-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-gray-100 border-2 border-gray-300"
          >
            <Dialog.Title className="text-3xl font-bold mb-6">{selectedWord}</Dialog.Title>

            <img src={selectedImage} className="w-48 h-48 object-cover" />

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
          <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
            Close
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
};

export default Dictionary;

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface DictionaryProps {
  wordsByMonth: Record<string, string[]>;
  selectedMonth: string;
}

const Dictionary: React.FC<DictionaryProps> = ({ wordsByMonth, selectedMonth }) => {
  const words = wordsByMonth[selectedMonth] || []; // Get words for the selected month

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
      <Dialog.Content className="fixed bg-white p-6 rounded-lg shadow-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Dialog.Title className="text-xl font-bold">Dictionary for {selectedMonth}</Dialog.Title>

        {/* Display only the words for the selected month */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {words.map((word, index) => (
            <div
              key={index}
              className="flex items-center justify-center border-2 border-gray-300 h-24 w-24 bg-gray-100 text-l"
            >
              {word}
            </div>
          ))}
        </div>

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

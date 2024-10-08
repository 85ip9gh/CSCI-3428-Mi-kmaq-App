import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface DictionaryProps {
  selectedMonth: string;
}

const monthTileMap: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

// Hardcoded words for each month
const wordsByMonth: Record<string, string[]> = {
  January: ['Apple'],
  February: ['Banana', 'Grape'],
  March: ['Orange', 'Lemon', 'Peach'],
  April: ['Cherry', 'Plum', 'Kiwi', 'Mango'],
  May: ['Papaya', 'Fig', 'Berry', 'Melon', 'Date'],
  June: ['Pineapple', 'Coconut', 'Lime', 'Jackfruit', 'Durian', 'Lychee'],
  July: ['Cantaloupe', 'Honeydew', 'Avocado', 'Persimmon', 'Raspberry', 'Strawberry', 'Blackberry'],
  August: ['Blueberry', 'Pomegranate', 'Guava', 'Tangerine', 'Nectarine', 'Cranberry', 'Dragonfruit', 'Jackfruit'],
  September: ['Custard Apple', 'Passion Fruit', 'Starfruit', 'Soursop', 'Cherimoya', 'Tamarind', 'Coconut', 'Jabuticaba', 'Carambola'],
  October: ['Quince', 'Cranberry', 'Lingonberry', 'Huckleberry', 'Mulberry', 'Acai', 'Goji', 'Tamarillo', 'Cloudberry', 'Sapodilla'],
  November: ['Pomelo', 'Kiwi', 'Guava', 'Figs', 'Jujube', 'Chokeberry', 'Cucumber', 'Kumquat', 'Lemon', 'Olive', 'Cabbage'],
  December: ['Tangerine', 'Rambutan', 'Longan', 'Tamarind', 'Chili Pepper', 'Carrot', 'Zucchini', 'Artichoke', 'Parsnip', 'Turnip', 'Beet'],
};

const Dictionary: React.FC<DictionaryProps> = ({ selectedMonth }) => {
  const numTiles = monthTileMap[selectedMonth] || 0;
  const words = wordsByMonth[selectedMonth] || [];

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
      <Dialog.Content className="fixed bg-white p-6 rounded-lg shadow-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Dialog.Title className="text-xl font-bold">Dictionary for {selectedMonth}</Dialog.Title>

        {/* Dynamically create tiles based on the month */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {words.slice(0, numTiles).map((word, index) => (
            <div
              key={index}
              className="flex items-center justify-center border-2 border-gray-300 h-24 w-24 bg-gray-100 text-xl"
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

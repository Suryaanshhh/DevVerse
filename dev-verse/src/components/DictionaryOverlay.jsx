import { useState, useRef } from "react";

export default function DictionaryOverlay({ onClose }) {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDefinition = async () => {
    if (!word) return;

    setLoading(true);

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();
      if (data && data[0]) {
        setDefinition(data[0].meanings[0].definitions[0].definition);
      } else {
        setDefinition("No definition found.");
      }
    } catch (error) {
      setDefinition("Error fetching definition.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="w-96 h-3/4 bg-white rounded-lg shadow-lg flex flex-col border-4 border-gray-800 overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center p-3 bg-black">
          <h3 className="font-bold text-white text-lg">📖 Dictionary</h3>
          <button onClick={onClose} className="text-white hover:text-gray-300 text-2xl">✕</button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b-2 border-black">
          <input
            type="text"
            placeholder="Enter a word..."
            className="w-full p-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
          <button
            onClick={fetchDefinition}
            className="w-full mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search Definition
          </button>
        </div>

        {/* Definition */}
        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <p className="text-center text-lg text-gray-500">Loading...</p>
          ) : definition ? (
            <div className="text-center">
              <p className="font-bold text-xl">{word}</p>
              <p className="mt-3 text-lg text-gray-700">{definition}</p>
            </div>
          ) : (
            <p className="text-center text-lg text-gray-500">Search for a word to see the definition</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t-4 border-gray-800 bg-white text-center">
          <p className="text-sm text-gray-500">Enter a word above to get its definition</p>
        </div>
      </div>
    </div>
  );
}

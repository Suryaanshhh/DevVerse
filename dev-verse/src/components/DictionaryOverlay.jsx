import { useState } from "react";

export default function DictionaryOverlay({ onClose }) {
  const [word, setWord] = useState("");
  const [definitions, setDefinitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDefinition = async () => {
    if (!word) return;

    setLoading(true);
    setError(null);
    setDefinitions([]);

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        const allDefinitions = data[0].meanings.flatMap((meaning) =>
          meaning.definitions.map((def) => ({
            partOfSpeech: meaning.partOfSpeech,
            definition: def.definition,
            example: def.example,
          }))
        );
        setDefinitions(allDefinitions);
      } else {
        setError("No definition found.");
      }
    } catch (err) {
      setError("Error fetching definition.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
      <div className="w-96 h-3/4 bg-white rounded-lg shadow-lg flex flex-col border-4 border-gray-800 overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-3 bg-black">
          <h3 className="font-bold text-white text-lg">📖 Dictionary</h3>
          <button onClick={onClose} className="text-white hover:text-gray-300 text-2xl">✕</button>
        </div>

        {/* Search */}
        <div className="p-4 border-b-2 border-black">
          <input
            type="text"
            placeholder="Enter a word..."
            className="w-full p-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black-500"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
          <button
            onClick={fetchDefinition}
            className="w-full mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Search Definition
          </button>
        </div>

        {/* Definition Results */}
        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <p className="text-center text-lg text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : definitions.length > 0 ? (
            <div className="space-y-4">
              <p className="text-center font-bold text-xl">{word}</p>
              {definitions.map((def, idx) => (
                <div key={idx} className="border-l-4 border-black pl-3">
                  <p className="text-sm text-gray-600 italic">{def.partOfSpeech}</p>
                  <p className="text-md text-black">{def.definition}</p>
                  {def.example && <p className="text-sm text-gray-500 mt-1">Example: {def.example}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Search for a word to see the definition</p>
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

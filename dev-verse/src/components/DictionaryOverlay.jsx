import { useState, useEffect } from 'react';

const Whiteboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'gameTerms'
  
  // Function to search for a word using Dictionary API
  const searchWord = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm.trim()}`);
      
      if (!response.ok) {
        throw new Error(response.status === 404 
          ? 'Word not found. Try another word.' 
          : 'Something went wrong with the dictionary service.');
      }
      
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError(err.message);
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle search button click
  const handleSearch = () => {
    searchWord();
  };
  
  // Handle Enter key press in input field
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchWord();
    }
  };
  
  // Clear search when closing the dictionary
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSearchResults(null);
      setError(null);
    }
  }, [isOpen]);
  
  // Generate a unique ID for the dictionary button that can be targeted by keyboard shortcut
  useEffect(() => {
    const buttonId = 'dictionary-button';
    return () => {
      // Cleanup if needed
    };
  }, []);
  
  return (
    <>
      {/* Whiteboard Dictionary Tile Button */}
      <div 
        id="dictionary-button"
        className="fixed top-14 left-0 z-10 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative">
          {/* Hand-drawn whiteboard effect */}
          <div className="w-48 h-12 bg-white border-2 border-gray-800 rounded-md relative overflow-hidden shadow-md">
            {/* Irregular hand-drawn border effect */}
            <div className="absolute inset-0 border-4 border-white rounded-md"></div>
            <div className="absolute inset-0 border border-gray-800 rounded-md" style={{ 
              clipPath: "polygon(0% 0%, 98% 2%, 100% 97%, 3% 100%)" 
            }}></div>
            
            {/* Whiteboard content */}
            <div className="flex items-center justify-center h-full px-2">
              <span className="text-gray-800 font-bold text-lg font-mono">Dictionary</span>
            </div>
            
            {/* Sketch marks */}
            <div className="absolute top-1 left-2 w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="absolute bottom-2 right-3 w-2 h-1 bg-gray-300 rounded-full"></div>
            <div className="absolute top-3 right-2 w-1 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Dictionary Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-3/4 h-3/4 max-w-4xl rounded-xl border-4 border-gray-800 p-6 relative">
            {/* Hand-drawn header */}
            <div className="border-b-2 border-gray-800 mb-4 pb-2">
              <h2 className="text-2xl font-bold">Dev Verse Dictionary</h2>
              
              {/* Tabs */}
              <div className="flex mt-2 space-x-2">
                <button 
                  onClick={() => setActiveTab('search')}
                  className={`px-4 py-1 rounded-t-lg border-2 border-gray-800 ${activeTab === 'search' ? 'bg-blue-100 border-b-0' : 'bg-gray-100'}`}
                >
                  Word Search
                </button>
                <button 
                  onClick={() => setActiveTab('gameTerms')}
                  className={`px-4 py-1 rounded-t-lg border-2 border-gray-800 ${activeTab === 'gameTerms' ? 'bg-blue-100 border-b-0' : 'bg-gray-100'}`}
                >
                  Game Terms
                </button>
              </div>
            </div>
            
            {/* Dictionary content based on active tab */}
            <div className="overflow-y-auto h-5/6 p-2">
              {activeTab === 'search' ? (
                <div>
                  {/* Search input */}
                  <div className="mb-4 flex">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type any word to search..."
                      className="flex-grow p-2 border-2 border-gray-400 rounded-l-md focus:outline-none focus:border-blue-500"
                    />
                    <button 
                      onClick={handleSearch}
                      className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none"
                      disabled={isLoading}
                    >
                      {isLoading ? "Searching..." : "Search"}
                    </button>
                  </div>
                  
                  {/* Error message */}
                  {error && (
                    <div className="p-4 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                      <p>{error}</p>
                    </div>
                  )}
                  
                  {/* Search results */}
                  {searchResults && (
                    <div className="mt-4">
                      <h3 className="text-xl font-bold mb-2">{searchResults[0]?.word}</h3>
                      
                      {searchResults[0]?.phonetics?.length > 0 && (
                        <div className="mb-4">
                          <p className="text-gray-600">
                            {searchResults[0].phonetics.find(p => p.text)?.text || ''}
                          </p>
                        </div>
                      )}
                      
                      {searchResults[0]?.meanings?.map((meaning, index) => (
                        <div key={index} className="mb-6">
                          <h4 className="font-bold text-lg text-blue-700">{meaning.partOfSpeech}</h4>
                          
                          {meaning.definitions?.map((def, idx) => (
                            <div key={idx} className="mb-3 pl-4 border-l-2 border-gray-300">
                              <p className="mb-1"><span className="font-semibold">{idx + 1}.</span> {def.definition}</p>
                              
                              {def.example && (
                                <p className="text-gray-600 italic pl-6">"{def.example}"</p>
                              )}
                              
                              {def.synonyms?.length > 0 && (
                                <p className="text-sm text-gray-700 mt-1">
                                  <span className="font-semibold">Synonyms:</span> {def.synonyms.join(', ')}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Initial state - no search yet */}
                  {!searchResults && !error && !isLoading && (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Search for any word to see its definition, pronunciation, and examples.</p>
                      <p className="text-gray-500 text-sm mt-2">Powered by DictionaryAPI.dev</p>
                    </div>
                  )}
                </div>
              ) : (
                <dl className="space-y-4">
                  <div>
                    <dt className="font-bold text-lg">Kaboom.js</dt>
                    <dd className="ml-4">A JavaScript library for creating 2D games quickly with minimal code.</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-lg">Sprites</dt>
                    <dd className="ml-4">2D graphical objects used in games for characters, items, and environment.</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-lg">Canvas</dt>
                    <dd className="ml-4">HTML element used for drawing graphics via JavaScript.</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-lg">Game Tile</dt>
                    <dd className="ml-4">Small square graphics arranged to create game levels or maps.</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-lg">Collision Detection</dt>
                    <dd className="ml-4">Determining when game objects overlap or touch each other.</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-lg">Component</dt>
                    <dd className="ml-4">Reusable piece of UI in React that can contain its own logic and presentation.</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-lg">React Hooks</dt>
                    <dd className="ml-4">Functions that let you use state and other React features without writing classes.</dd>
                  </div>
                </dl>
              )}
            </div>
            
            {/* Close button with hand-drawn effect */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border-2 border-gray-800 rounded-full bg-white hover:bg-gray-100"
            >
              <span className="text-xl font-bold">×</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Whiteboard;
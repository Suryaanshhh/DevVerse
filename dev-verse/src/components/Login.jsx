import { useState } from 'react';
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function ScribbleGameAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
      setError("Failed to log in! Try again?");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed MapMarker with explicit Tailwind classes
  const MapMarker = ({ color }) => {
    // Map color string to actual Tailwind class
    const colorClass = {
      'green': 'bg-green-500 border-green-500',
      'purple': 'bg-purple-500 border-purple-500',
      'yellow': 'bg-yellow-500 border-yellow-500',
      'red': 'bg-red-500 border-red-500'
    }[color] || 'bg-blue-500 border-blue-500';
    
    return (
      <div className="relative">
        <div className={`w-8 h-8 rounded-full ${colorClass.split(' ')[0]} animate-pulse`}></div>
        <div className={`w-10 h-10 rounded-full border-2 ${colorClass.split(' ')[1]} absolute -top-1 -left-1 animate-ping opacity-75`}></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Scribble container with "paper" background */}
        <div 
          className="bg-white border-4 border-black rounded-lg p-6 shadow-lg relative overflow-hidden"
          style={{ 
            borderStyle: 'solid',
            borderWidth: '4px',
            borderColor: '#000',
            borderRadius: '16px',
            boxShadow: '6px 6px 0 rgba(0,0,0,0.7)'
          }}
        >
          
          {/* Grid background resembling the map */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-12 h-full w-full">
              {Array(144).fill().map((_, i) => (
                <div key={i} className="border border-gray-400"></div>
              ))}
            </div>
          </div>
          
          {/* Game title */}
          <div className="text-center mb-8 relative">
            <h1 
              className="text-4xl font-bold"
              style={{ 
                fontFamily: 'Comic Sans MS, cursive',
                textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
                color: '#ff5722',
                transform: 'rotate(-2deg)'
              }}
            >
              DEV VERSE
            </h1>
            <div className="flex justify-center space-x-8 mt-4">
              <MapMarker color="green" />
              <MapMarker color="purple" />
              <MapMarker color="yellow" />
              <MapMarker color="red" />
            </div>
          </div>
          
          {/* Auth buttons */}
          <div className="flex flex-col items-center">
            {auth.currentUser ? (
              <div className="text-center">
                <p 
                  className="mb-4 font-medium" 
                  style={{ fontFamily: 'Comic Sans MS, cursive' }}
                >
                  Welcome, Adventurer {auth.currentUser.displayName}!
                </p>
                <button 
                  onClick={logout}
                  disabled={isLoading}
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 cursor-pointer"
                  style={{ 
                    borderRadius: '12px',
                    boxShadow: '3px 3px 0 #000',
                    fontFamily: 'Comic Sans MS, cursive',
                    transform: 'scale(1)',
                    transition: 'transform 0.2s',
                  }}
                  onMouseOver={(e) => {e.currentTarget.style.transform = 'scale(1.05)'}}
                  onMouseOut={(e) => {e.currentTarget.style.transform = 'scale(1)'}}
                >
                  {isLoading ? "Teleporting..." : "Log Out"}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p 
                  className="mb-6 font-medium" 
                  style={{ fontFamily: 'Comic Sans MS, cursive' }}
                >
                  Join the adventure! Sign in to play:
                </p>
                <button 
                  onClick={signInWithGoogle}
                  disabled={isLoading}
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  style={{ 
                    borderRadius: '12px',
                    boxShadow: '3px 3px 0 #000',
                    fontFamily: 'Comic Sans MS, cursive',
                    transform: 'scale(1)',
                    transition: 'transform 0.2s',
                  }}
                  onMouseOver={(e) => {e.currentTarget.style.transform = 'scale(1.05)'}}
                  onMouseOut={(e) => {e.currentTarget.style.transform = 'scale(1)'}}
                >
                  <span>{isLoading ? "Casting Spell..." : "Login with Google"}</span>
                </button>
                {error && (
                  <p 
                    className="mt-4 text-red-500 animate-bounce" 
                    style={{ fontFamily: 'Comic Sans MS, cursive' }}
                  >
                    {error}
                  </p>
                )}
              </div>
            )}
          </div>
          
          {/* Decorative map elements */}
          <div className="absolute top-4 left-4">
            <MapMarker color="green" />
          </div>
          <div className="absolute bottom-4 right-4">
            <MapMarker color="red" />
          </div>
          <div className="absolute bottom-4 left-4">
            <MapMarker color="yellow" />
          </div>
          <div className="absolute top-4 right-4">
            <MapMarker color="purple" />
          </div>
        </div>
        
        {/* Copyright notice */}
        <div className="mt-4 text-center text-xs text-gray-500">
          © DEV VERSE 2025
        </div>
      </div>
    </div>
  );
}
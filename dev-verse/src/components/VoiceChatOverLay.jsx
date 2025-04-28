import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function VoiceChat({ onClose }) {
  const [isMuted, setIsMuted] = useState(false);
  const [peersInRoom, setPeersInRoom] = useState([]);
  const currentRoom = "gameWorld";

  useEffect(() => {
    // Listen for users in the same room
    const roomRef = doc(db, "rooms", currentRoom);
    const unsubscribe = onSnapshot(roomRef, (doc) => {
      const users = doc.data()?.users || [];
      setPeersInRoom(users.filter(user => user !== auth.currentUser?.uid));
    });

    return unsubscribe;
  }, [currentRoom]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Add your mute logic here
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
      <div className="w-96 bg-white rounded-lg shadow-2xl flex flex-col border-4 border-black overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-3 bg-black">
          <h3 className="font-bold text-white text-lg">Dev Verse Voice</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Participants List */}
        <div className="flex-1 p-4 space-y-3 max-h-60 overflow-y-auto">
          <div className="flex items-center justify-between p-2 border-2 border-black rounded-lg">
            <div className="flex items-center gap-2">
              {auth.currentUser?.photoURL ? (
                <img 
                  src={auth.currentUser.photoURL} 
                  alt="You"
                  className="w-8 h-8 rounded-full border-2 border-black"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                  <span className="text-white text-xs">
                    {auth.currentUser?.displayName?.charAt(0) || "Y"}
                  </span>
                </div>
              )}
              <span className="font-bold">You</span>
            </div>
            <div className={`w-3 h-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-green-500'}`}></div>
          </div>

          {peersInRoom.length > 0 ? (
            peersInRoom.map((peerId) => (
              <div key={peerId} className="flex items-center justify-between p-2 border-2 border-black rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                    <span className="text-white text-xs">{peerId.charAt(0)}</span>
                  </div>
                  <span className="font-bold">User {peerId.slice(0, 4)}</span>
                </div>
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              </div>
            ))
          ) : (
            <p className="text-center text-black py-4">No one else is in voice chat</p>
          )}
        </div>

        {/* Controls */}
        <div className="p-3 border-t-4 border-black bg-white">
          <div className="flex justify-center gap-4">
            <button
              onClick={toggleMute}
              className={`p-3 rounded-full border-2 border-black ${isMuted ? 'bg-red-500' : 'bg-white'} hover:bg-gray-100 transition-colors`}
            >
              {isMuted ? (
                <span className="text-xl">🔇</span>
              ) : (
                <span className="text-xl">🎤</span>
              )}
            </button>
            <button className="p-3 rounded-full border-2 border-black bg-white hover:bg-gray-100 transition-colors">
              <span className="text-xl">🎧</span>
            </button>
            <button className="p-3 rounded-full border-2 border-black bg-white hover:bg-gray-100 transition-colors">
              <span className="text-xl">⚙️</span>
            </button>
          </div>
          <div className="text-center mt-2 text-sm text-black">
            {isMuted ? "You're muted" : "You're live"}
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useRef } from "react";
import agencySong from "../assets/music/agencySong.mp3"
export default function MusicOverlay({ onClose }) {
  const [playlist] = useState([
    { title: "Agency_Talha", url: agencySong },
  ]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(playlist[0].url));

  const playTrack = (index) => {
    audioRef.current.pause();
    audioRef.current = new Audio(playlist[index].url);
    audioRef.current.play();
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const stopTrack = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
      <div className="w-96 h-3/4 bg-white rounded-lg shadow-2xl flex flex-col border-4 border-black overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center p-3 bg-black">
          <h3 className="font-bold text-white text-lg">🎵 Music Lounge</h3>
          <button onClick={onClose} className="text-white hover:text-gray-300 text-2xl">✕</button>
        </div>

        {/* Track Info */}
        <div className="bg-gray-100 p-4 border-b-2 border-black">
          <div className="text-center">
            <p className="font-bold text-lg">{playlist[currentTrackIndex].title}</p>
            <p className="text-sm text-gray-600">{isPlaying ? "Now Playing" : "Paused"}</p>
          </div>
          <div className="flex justify-center gap-4 mt-3">
            <button onClick={togglePlayPause} className="bg-black text-white px-4 py-2 rounded">
              {isPlaying ? "⏸ Pause" : "▶️ Play"}
            </button>
            <button onClick={stopTrack} className="bg-red-500 text-white px-4 py-2 rounded">⏹ Stop</button>
          </div>
        </div>

        {/* Playlist */}
        <div className="flex-1 overflow-y-auto p-3">
          <h4 className="font-bold mb-3">🎧 Playlist</h4>
          <ul className="space-y-2">
            {playlist.map((track, index) => (
              <li
                key={index}
                className={`p-3 rounded-lg border-2 border-black cursor-pointer ${
                  index === currentTrackIndex ? "bg-green-100" : "bg-gray-50"
                }`}
                onClick={() => playTrack(index)}
              >
                <p className="font-semibold">{track.title}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="p-3 border-t-4 border-black bg-white text-center">
          <p className="text-sm">Click a song to start playing music</p>
        </div>
      </div>
    </div>
  );
}

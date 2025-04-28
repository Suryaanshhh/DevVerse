import { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase";
import { collection, doc, setDoc, onSnapshot, query, orderBy, where, deleteDoc } from "firebase/firestore";
import { initPeer, getLocalStream, callPeer, disconnectPeer } from "../webRTC";

export default function VoiceChatOverlay({ onClose }) {
  const [activeUsers, setActiveUsers] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const currentRoom = "mainVoiceChannel"; // Default voice channel
  const peer = useRef(null);
  const userDocRef = useRef(null);
  const audioRefs = useRef({}); // Store audio elements for each peer
  const activeCalls = useRef({}); // Track active calls
  const userId = auth.currentUser?.uid || `guest-${Math.floor(Math.random() * 10000)}`;
  const userName = auth.currentUser?.displayName || "Guest";

  // Initialize peer and get local audio stream
  const initializeAudio = async () => {
    try {
      const stream = await getLocalStream();
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error("Error getting local stream:", error);
      alert("Failed to access microphone. Please check your permissions.");
      return null;
    }
  };

  // Join voice channel
  const joinVoiceChannel = async () => {
    if (isJoined) return;
    
    try {
      // Initialize audio if not already done
      const stream = localStream || await initializeAudio();
      if (!stream) return;
      
      // Initialize peer connection
      peer.current = initPeer(userId);
      
      // Handle incoming calls
      peer.current.on("open", async (id) => {
        console.log("Connected with peer ID:", id);
        
        // Register user in the voice channel
        userDocRef.current = doc(db, `voiceChannels/${currentRoom}/users`, userId);
        await setDoc(userDocRef.current, {
          userId,
          userName,
          userAvatar: auth.currentUser?.photoURL || "",
          peerId: id,
          joinedAt: new Date(),
          lastUpdated: new Date()
        });
        
        setIsJoined(true);
        
        // Set up presence system
        const presenceInterval = setInterval(() => {
          if (userDocRef.current) {
            setDoc(userDocRef.current, { lastUpdated: new Date() }, { merge: true })
              .catch(err => console.error("Error updating presence:", err));
          }
        }, 30000); // Update every 30 seconds
        
        // Clean up on component unmount
        return () => clearInterval(presenceInterval);
      });
      
      // Handle incoming calls
      peer.current.on("call", (call) => {
        console.log("Incoming call from:", call.peer);
        call.answer(stream);
        
        call.on("stream", (remoteStream) => {
          console.log("Received stream from:", call.peer);
          // Create audio element for this peer if it doesn't exist
          if (!audioRefs.current[call.peer]) {
            const audio = new Audio();
            audio.srcObject = remoteStream;
            audio.autoplay = true;
            audioRefs.current[call.peer] = audio;
          }
        });
        
        call.on("close", () => {
          console.log("Call closed with:", call.peer);
          if (audioRefs.current[call.peer]) {
            audioRefs.current[call.peer].srcObject = null;
            delete audioRefs.current[call.peer];
          }
        });
      });
    } catch (error) {
      console.error("Error joining voice channel:", error);
      alert("Failed to join voice channel. Please try again.");
    }
  };

  // Leave voice channel
  const leaveVoiceChannel = async () => {
    if (!isJoined) return;
    
    // Disconnect from all peers
    Object.keys(activeCalls.current).forEach(peerId => {
      disconnectPeer(peerId);
    });
    
    // Clear audio elements
    Object.keys(audioRefs.current).forEach(peerId => {
      if (audioRefs.current[peerId]) {
        audioRefs.current[peerId].srcObject = null;
      }
    });
    audioRefs.current = {};
    
    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    // Remove from Firebase
    if (userDocRef.current) {
      await deleteDoc(userDocRef.current).catch(err => 
        console.error("Error removing user document:", err)
      );
    }
    
    // Destroy peer connection
    if (peer.current) {
      peer.current.destroy();
      peer.current = null;
    }
    
    setIsJoined(false);
  };

  // Toggle mute
  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  // Connect to other users in the channel
  useEffect(() => {
    if (!isJoined || !peer.current) return;
    
    // Listen for other users in the voice channel
    const oneMinuteAgo = new Date();
    oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);
    
    const q = query(
      collection(db, `voiceChannels/${currentRoom}/users`),
      where("lastUpdated", ">=", oneMinuteAgo),
      orderBy("lastUpdated", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = [];
      
      snapshot.docs.forEach(doc => {
        const userData = {
          id: doc.id,
          ...doc.data(),
          joinedAt: doc.data().joinedAt?.toDate(),
          lastUpdated: doc.data().lastUpdated?.toDate()
        };
        
        // Skip ourselves
        if (userData.userId === userId) return;
        
        users.push(userData);
        
        // Connect to this user if we haven't already
        if (userData.peerId && !activeCalls.current[userData.peerId]) {
          console.log("Attempting to call peer:", userData.peerId);
          const call = callPeer(userData.peerId);
          
          if (call) {
            activeCalls.current[userData.peerId] = call;
            
            call.on("stream", (remoteStream) => {
              console.log("Received stream from call to:", userData.peerId);
              const audio = new Audio();
              audio.srcObject = remoteStream;
              audio.autoplay = true;
              audioRefs.current[userData.peerId] = audio;
            });
            
            call.on("close", () => {
              console.log("Call closed with:", userData.peerId);
              if (audioRefs.current[userData.peerId]) {
                audioRefs.current[userData.peerId].srcObject = null;
                delete audioRefs.current[userData.peerId];
              }
              delete activeCalls.current[userData.peerId];
            });
          }
        }
      });
      
      setActiveUsers(users);
    });
    
    return () => unsubscribe();
  }, [isJoined, currentRoom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      leaveVoiceChannel();
    };
  }, []);

  // Handle Escape key press
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
      <div className="w-96 h-3/4 bg-white rounded-lg shadow-2xl flex flex-col border-4 border-black overflow-hidden">
        
        {/* Chat Header */}
        <div className="flex justify-between items-center p-3 bg-black">
          <h3 className="font-bold text-white text-lg">Dev Verse Voice Chat</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Voice Channel Info */}
        <div className="bg-gray-100 p-4 border-b-2 border-black">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">Main Voice Channel</p>
              <p className="text-sm text-gray-600">
                {isJoined ? 
                  `${activeUsers.length + 1} users connected` : 
                  "Join to talk with others"}
              </p>
            </div>
            <div className="flex gap-2">
              {isJoined && (
                <button
                  onClick={toggleMute}
                  className={`p-2 rounded-full ${isMuted ? "bg-red-500" : "bg-black"} text-white`}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? "🔇" : "🎤"}
                </button>
              )}
              <button
                onClick={isJoined ? leaveVoiceChannel : joinVoiceChannel}
                className={`px-3 py-1 rounded ${
                  isJoined ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                } text-white`}
              >
                {isJoined ? "Disconnect" : "Join"}
              </button>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-3">
          <h4 className="font-bold mb-3">Connected Users</h4>
          
          {/* Current User */}
          <div className="flex items-center bg-gray-50 p-3 mb-3 rounded-lg border-2 border-black">
            <div className="flex items-center gap-2">
              {auth.currentUser?.photoURL ? (
                <img 
                  src={auth.currentUser.photoURL} 
                  alt={userName}
                  className="w-10 h-10 rounded-full border-2 border-black"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                  <span className="text-white text-sm">{userName.charAt(0)}</span>
                </div>
              )}
              <div>
                <p className="font-bold">{userName} (You)</p>
                <p className="text-xs text-gray-500">
                  {isJoined ? (
                    <span className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-1"></span>
                      Connected {isMuted ? "- Muted" : ""}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block mr-1"></span>
                      Disconnected
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
          
          {/* Other Users */}
          {activeUsers.length > 0 ? (
            <div className="space-y-3">
              {activeUsers.map((user) => (
                <div key={user.id} className="flex items-center bg-gray-50 p-3 rounded-lg border-2 border-black">
                  <div className="flex items-center gap-2">
                    {user.userAvatar ? (
                      <img 
                        src={user.userAvatar} 
                        alt={user.userName}
                        className="w-10 h-10 rounded-full border-2 border-black"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                        <span className="text-white text-sm">{user.userName.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-bold">{user.userName}</p>
                      <p className="text-xs text-gray-500">
                        <span className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-1"></span>
                          Connected
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            isJoined ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500">No other users in this channel</p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500">Join the channel to see other users</p>
              </div>
            )
          )}
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t-4 border-black bg-white">
          <div className="flex items-center justify-center">
            <p className="text-sm text-center">
              {isJoined ? 
                "Click Disconnect to leave the voice channel" : 
                "Click Join to enter the voice channel"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
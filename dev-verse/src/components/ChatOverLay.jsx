import { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, onSnapshot, query, orderBy, limit } from "firebase/firestore";

export default function ChatOverlay({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const currentRoom = "gameWorld"; 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const q = query(
      collection(db, `rooms/${currentRoom}/messages`),
      orderBy("createdAt"),
      limit(50)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [currentRoom]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, `rooms/${currentRoom}/messages`), {
        text: newMessage,
        userId: auth.currentUser?.uid || "anonymous",
        userName: auth.currentUser?.displayName || "Guest",
        userAvatar: auth.currentUser?.photoURL || "",
        createdAt: new Date(),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      <div className="w-96 h-3/4 bg-white rounded-lg shadow-2xl flex flex-col border-4 border-black overflow-hidden">
        
        {/* Chat Header */}
        <div className="flex justify-between items-center p-3 bg-black">
          <h3 className="font-bold text-white text-lg">Dev Verse Chat</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-2 ${msg.userId === auth.currentUser?.uid ? 'justify-end' : ''}`}>
                
                {/* Avatar */}
                {msg.userId !== auth.currentUser?.uid && (
                  <div className="flex-shrink-0">
                    {msg.userAvatar ? (
                      <img 
                        src={msg.userAvatar} 
                        alt={msg.userName}
                        className="w-8 h-8 rounded-full border-2 border-black"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                        <span className="text-white text-xs">{msg.userName.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Message Bubble */}
                <div className={`max-w-[80%] ${msg.userId === auth.currentUser?.uid ? 'bg-white text-black border-2 border-black' : 'bg-black text-white'} p-2 rounded-lg`}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-bold">{msg.userName}</p>
                    <p className="text-xs ml-2">{formatTime(msg.createdAt)}</p>
                  </div>
                  <p className="break-words">{msg.text}</p>
                </div>
                
                {/* Avatar for user's own messages */}
                {msg.userId === auth.currentUser?.uid && (
                  <div className="flex-shrink-0">
                    {msg.userAvatar ? (
                      <img 
                        src={msg.userAvatar} 
                        alt={msg.userName}
                        className="w-8 h-8 rounded-full border-2 border-black"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                        <span className="text-white text-xs">{msg.userName.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-black">No messages yet. Start chatting!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={sendMessage} className="p-3 border-t-4 border-black bg-white">
          <div className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 rounded-l border-2 border-black bg-white text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-black"
              autoFocus
            />
            <button 
              type="submit" 
              className="bg-black text-white px-4 rounded-r hover:bg-gray-800 transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

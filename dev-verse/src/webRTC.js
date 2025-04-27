import { Peer } from "peerjs";

let peer;
let localStream;
const peers = {}; // Stores connected peers' streams

// Initialize PeerJS connection
export const initPeer = (userId) => {
  peer = new Peer(userId);

  peer.on("open", (id) => {
    console.log("My peer ID:", id);
  });

  // Handle incoming calls
  peer.on("call", (call) => {
    call.answer(localStream); // Answer with our mic stream
    call.on("stream", (remoteStream) => {
      peers[call.peer] = remoteStream;
      playRemoteAudio(remoteStream); // Play the audio
    });
  });

  return peer;
};

// Call another user
export const callPeer = (peerId) => {
  if (!localStream) return;

  const call = peer.call(peerId, localStream);
  call.on("stream", (remoteStream) => {
    peers[peerId] = remoteStream;
    playRemoteAudio(remoteStream);
  });
};

// Get user's microphone
export const getLocalStream = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  return localStream;
};

// Play remote audio
const playRemoteAudio = (stream) => {
  const audio = new Audio();
  audio.srcObject = stream;
  audio.play();
};

// Disconnect from a peer
export const disconnectPeer = (peerId) => {
  if (peers[peerId]) {
    peers[peerId].getTracks().forEach(track => track.stop());
    delete peers[peerId];
  }
};
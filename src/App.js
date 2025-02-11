import React, { useState } from "react";
import axios from "axios";
import { JitsiMeeting } from "@jitsi/react-sdk";

const App = () => {
  const [meeting, setMeeting] = useState(null);
  const [jitsiApi, setJitsiApi] = useState(null);

  // Instant Meeting
  const startInstantMeeting = async () => {
    const response = await axios.post("https://your-backend-url.onrender.com/create-meeting", {});
    setMeeting(response.data);
  };

  // Toggle Chat
  const toggleChat = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand("toggleChat");
    }
  };

  // Toggle Screen Sharing
  const toggleScreenShare = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand("toggleShareScreen");
    }
  };

  return (
    <div className="container">
      <h1>Video Conferencing App</h1>
      <button onClick={startInstantMeeting}>Start Instant Meeting</button>
      
      {meeting && (
        <div>
          <button onClick={toggleChat}>Toggle Chat</button>
          <button onClick={toggleScreenShare}>Toggle Screen Share</button>
          <JitsiMeeting
            roomName={meeting.meeting_id}
            configOverwrite={{ enableChat: true, enableScreenSharing: true }}
            interfaceConfigOverwrite={{ SHOW_JITSI_WATERMARK: false }}
            onApiReady={(api) => setJitsiApi(api)}
          />
        </div>
      )}
    </div>
  );
};

export default App;

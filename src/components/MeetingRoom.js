import React, { useState } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

const MeetingRoom = ({ meeting }) => {
  const [jitsiApi, setJitsiApi] = useState(null);

  const toggleChat = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand("toggleChat");
    }
  };

  const toggleScreenShare = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand("toggleShareScreen");
    }
  };

  return (
    <div>
      <h2>Meeting Room: {meeting.title}</h2>
      <button onClick={toggleChat}>Toggle Chat</button>
      <button onClick={toggleScreenShare}>Toggle Screen Share</button>

      <JitsiMeeting
        roomName={meeting.meeting_id}
        configOverwrite={{ enableChat: true, enableScreenSharing: true }}
        interfaceConfigOverwrite={{ SHOW_JITSI_WATERMARK: false }}
        onApiReady={(api) => setJitsiApi(api)}
      />
    </div>
  );
};

export default MeetingRoom;

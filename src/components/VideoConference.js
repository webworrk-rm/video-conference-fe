import React, { useState, useEffect } from 'react';
import Daily from '@daily-co/daily-js';
import axios from 'axios';

const VideoConference = () => {
  const [hostLink, setHostLink] = useState('');
  const [participantLink, setParticipantLink] = useState('');
  const [daily, setDaily] = useState(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const createMeeting = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/create-meeting`.replace(/([^:]\/)(\/+)/g, "$1");
        console.log("📡 Sending request to:", apiUrl);

        const response = await axios.post(apiUrl);
        console.log("✅ Backend Response:", response.data);

        if (response.data && response.data.participant_url) {
          setMeetingLink(response.data.participant_url); // Use `participant_url`
          console.log("🎥 Meeting link set:", response.data.participant_url);
        } else {
          console.error("❌ Unexpected response format:", response.data);
          throw new Error('Invalid response structure');
        }


      } catch (error) {
        console.error('❌ Error creating meeting:', error.message || error);
      }
    };

    createMeeting();
  }, []);

  const joinMeeting = async (role) => {
    let urlToJoin = role === "host" ? hostLink : participantLink;

    if (!urlToJoin) {
      console.error("❌ No meeting link available");
      return;
    }

    const call = Daily.createCallObject();
    setDaily(call);

    try {
      await call.join({ url: urlToJoin });
      console.log(`✅ Joined as ${role}`);
    } catch (error) {
      console.error(`❌ Error joining as ${role}:`, error.message || error);
    }
  };

  return (
    <div>
      <h1>Video Conference</h1>
      {hostLink && participantLink ? (
        <>
          <p>🔗 <strong>Host Link:</strong> <a href={hostLink} target="_blank" rel="noopener noreferrer">{hostLink}</a></p>
          <p>🔗 <strong>Participant Link:</strong> <a href={participantLink} target="_blank" rel="noopener noreferrer">{participantLink}</a></p>
          <button onClick={() => joinMeeting("host")}>Join as Host</button>
          <button onClick={() => joinMeeting("participant")}>Join as Participant</button>
        </>
      ) : (
        <p>⏳ Generating meeting link...</p>
      )}
    </div>
  );
};

export default VideoConference;

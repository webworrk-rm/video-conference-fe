import React, { useState, useEffect } from 'react';
import Daily from '@daily-co/daily-js';
import axios from 'axios';

const VideoConference = () => {
  const [meetingLink, setMeetingLink] = useState('');
  const [daily, setDaily] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [waitingList, setWaitingList] = useState([]);

  useEffect(() => {
    const createMeeting = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/create-meeting`.replace(/([^:]\/)(\/+)/g, "$1");
        console.log("📡 Sending request to:", apiUrl);

        const response = await axios.post(apiUrl);
        console.log("✅ Backend Response:", response.data);

        if (response.data && response.data.url) {
          setMeetingLink(response.data.url);
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (error) {
        console.error('❌ Error creating meeting:', error.message || error);
      }
    };

    createMeeting();
  }, []);

  const joinMeeting = async () => {
    if (!meetingLink) return;
    const call = Daily.createCallObject();
    setDaily(call);
    try {
      await call.join({ url: meetingLink });
      call.on('participant-updated', handleParticipantsUpdate);
    } catch (error) {
      console.error('❌ Error joining meeting:', error.message || error);
    }
  };

  const handleParticipantsUpdate = (event) => {
    if (event && event.participants) {
      setParticipants(Object.values(event.participants));
    }
  };

  const handleJoinRequest = (participant) => {
    if (participant && participant.id) {
      setWaitingList((prev) => [...prev, participant]);
    }
  };

  const admitParticipant = (participantId) => {
    const participant = waitingList.find(p => p.id === participantId);
    if (participant) {
      setParticipants((prev) => [...prev, participant]);
      setWaitingList((prev) => prev.filter(p => p.id !== participantId));
    }
  };

  return (
    <div>
      <h1>Video Conference</h1>
      {meetingLink ? (
        <p>Meeting Link: <a href={meetingLink} target="_blank" rel="noopener noreferrer">{meetingLink}</a></p>
      ) : (
        <p>Generating meeting link...</p>
      )}
      <button onClick={joinMeeting} disabled={!meetingLink}>Join Meeting</button>
      
      {isHost && (
        <div>
          <h2>Waiting List</h2>
          {waitingList.length > 0 ? waitingList.map((p) => (
            <div key={p.id}>
              <p>{p.user_name} is requesting to join</p>
              <button onClick={() => admitParticipant(p.id)}>Admit</button>
            </div>
          )) : <p>No participants waiting.</p>}
        </div>
      )}
    </div>
  );
};

export default VideoConference;

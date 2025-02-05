import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VideoConference = () => {
  const [meetingLink, setMeetingLink] = useState('');
  const [hostLink, setHostLink] = useState('');
  const [roomName, setRoomName] = useState('');
  const [waitingList, setWaitingList] = useState([]);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const createMeeting = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/create-meeting`;
        const response = await axios.post(apiUrl);
        if (response.data && response.data.url) {
          setMeetingLink(response.data.url);
          setHostLink(response.data.host_url);
          setRoomName(response.data.room_name);
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (error) {
        console.error('❌ Error creating meeting:', error.message || error);
      }
    };

    createMeeting();
  }, []);

  const requestJoin = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/request-join`, {
        room_name: roomName,
        user_name: "Participant"
      });
      alert("Join request sent to host.");
    } catch (error) {
      console.error("Error requesting to join:", error);
    }
  };

  const fetchWaitingList = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/waiting-list/${roomName}`);
      setWaitingList(response.data.waiting_list);
    } catch (error) {
      console.error("Error fetching waiting list:", error);
    }
  };

  const admitParticipant = async (userName) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admit-participant`, {
        room_name: roomName,
        user_name: userName
      });
      alert(`${userName} has been admitted.`);
      fetchWaitingList(); // Refresh waiting list
    } catch (error) {
      console.error("Error admitting participant:", error);
    }
  };

  return (
    <div>
      <h1>Video Conference</h1>
      {meetingLink ? (
        <>
          <p><b>Host Link:</b> <a href={hostLink} target="_blank">{hostLink}</a></p>
          <p><b>Participant Link:</b> <a href={meetingLink} target="_blank">{meetingLink}</a></p>
          <button onClick={requestJoin}>Request to Join</button>
          {isHost && (
            <div>
              <h2>Waiting List</h2>
              {waitingList.map((p, index) => (
                <div key={index}>
                  <p>{p.user_name}</p>
                  <button onClick={() => admitParticipant(p.user_name)}>Admit</button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p>Generating meeting link...</p>
      )}
    </div>
  );
};

export default VideoConference;

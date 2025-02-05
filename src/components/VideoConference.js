import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DailyDashboard = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/get-meetings`);
      setMeetings(response.data.meetings);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const createMeeting = async (isScheduled) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/create-meeting`, {
        scheduled: isScheduled
      });
      alert(`Meeting Created! Host URL: ${response.data.host_url}`);
      fetchMeetings();
    } catch (error) {
      console.error('Error creating meeting:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Daily.co Meeting Dashboard</h1>
      <div className="button-group">
        <button onClick={() => createMeeting(false)} disabled={loading}>Instant Meeting</button>
        <button onClick={() => createMeeting(true)} disabled={loading}>Schedule Meeting</button>
      </div>
      <h2>Meeting List</h2>
      <ul>
        {meetings.map((meeting) => (
          <li key={meeting.id}>
            {meeting.name} - <a href={meeting.url} target="_blank" rel="noopener noreferrer">Join</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DailyDashboard;

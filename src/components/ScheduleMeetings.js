import React from "react";

const ScheduledMeetings = ({ scheduledMeetings }) => {
  return (
    <div>
      <h2>Scheduled Meetings</h2>
      {scheduledMeetings.length === 0 ? (
        <p>No meetings scheduled yet.</p>
      ) : (
        scheduledMeetings.map((meeting, index) => (
          <div key={index}>
            <p><strong>{meeting.title}</strong> - {meeting.date_time}</p>
            <a href={meeting.host_link} target="_blank" rel="noreferrer">Join as Host</a> |
            <a href={meeting.participant_link} target="_blank" rel="noreferrer">Join as Participant</a>
          </div>
        ))
      )}
    </div>
  );
};

export default ScheduledMeetings;

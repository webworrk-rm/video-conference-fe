import React from "react";

const HomePage = ({ startInstantMeeting, scheduleMeeting }) => {
  return (
    <div>
      <h1>Welcome to Video Conference App</h1>
      <button onClick={startInstantMeeting}>Start Instant Meeting</button>
      <button onClick={scheduleMeeting}>Schedule Meeting</button>
    </div>
  );
};

export default HomePage;

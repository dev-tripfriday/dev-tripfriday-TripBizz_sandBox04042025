import React from 'react';
import Countdown from 'react-countdown';

const Timer = ({ firestoreTimestamp }) => {
  // Convert Firestore timestamp to a JavaScript Date object
  const startTime = new Date(
    firestoreTimestamp.seconds * 1000 + firestoreTimestamp.nanoseconds / 1000000
  );

  // Calculate the end time: 15 minutes from the start time
  const endTime = startTime.getTime() + 15 * 60 * 1000;

  // Renderer for the countdown
  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      // When the countdown is complete
      return <span>Time's up!</span>;
    } else {
      // Render the countdown
      return (
        <span>
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </span>
      );
    }
  };

  return <Countdown date={endTime} renderer={renderer} />;
};

export default Timer;

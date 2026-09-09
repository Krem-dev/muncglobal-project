import React, { useState, useEffect } from 'react';
import CountdownTimer from './CountdownTimer';
import CompactCountdown from './CompactCountdown';


const CountdownContainer = ({ 
  variant = 'full', 
  className = '',
  onComplete = null
}) => {
  const conferenceDate = new Date('2027-01-02T09:00:00');
  
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const difference = conferenceDate.getTime() - now;

      if (difference <= 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isComplete: true
        });

        if (onComplete) {
          onComplete();
        }
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds,
        isComplete: false
      });
    };

    calculateTimeRemaining();

    const intervalId = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(intervalId);
  }, [conferenceDate, onComplete]);

  // Render appropriate countdown variant
  return variant === 'full' ? (
    <CountdownTimer 
      targetDate={conferenceDate} 
      className={className} 
      onComplete={onComplete} 
    />
  ) : (
    <CompactCountdown 
      timeRemaining={timeRemaining} 
      className={className} 
    />
  );
};

export default CountdownContainer;

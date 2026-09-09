import React, { useState, useEffect } from 'react';

/**
 * CountdownTimer component that displays days, hours, minutes, and seconds
 * remaining until a target date.
 * 
 * @param {Object} props Component props
 * @param {Date|string} props.targetDate Target date to count down to
 * @param {string} props.className Additional CSS classes
 * @param {Function} props.onComplete Callback when countdown reaches zero
 */
const CountdownTimer = ({ targetDate, className = '', onComplete = null }) => {
  // Parse the target date if it's a string
  const targetDateTime = typeof targetDate === 'string' 
    ? new Date(targetDate).getTime() 
    : targetDate.getTime();
  
  // State for time remaining
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
      const difference = targetDateTime - now;

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
  }, [targetDateTime, onComplete]);
  
  // Format numbers to always have two digits
  const formatNumber = (num) => {
    return num.toString().padStart(2, '0');
  };
  
  return (
    <div className={`countdown-timer ${className}`}>
      <div className="flex justify-center space-x-4">
        <div className="flex flex-col items-center">
          <div className="text-3xl md:text-4xl font-bold bg-white border-2 border-teal-700 text-black rounded-lg w-16 h-16 flex items-center justify-center shadow-sm">
            {formatNumber(timeRemaining.days)}
          </div>
          <span className="text-xs mt-1 font-bold text-white bg-teal-600 px-2 py-0.5 rounded">DAYS</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-3xl md:text-4xl font-bold bg-white border-2 border-teal-700 text-black rounded-lg w-16 h-16 flex items-center justify-center shadow-sm">
            {formatNumber(timeRemaining.hours)}
          </div>
          <span className="text-xs mt-1 font-bold text-white bg-teal-600 px-2 py-0.5 rounded">HOURS</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-3xl md:text-4xl font-bold bg-white border-2 border-teal-700 text-black rounded-lg w-16 h-16 flex items-center justify-center shadow-sm">
            {formatNumber(timeRemaining.minutes)}
          </div>
          <span className="text-xs mt-1 font-bold text-white bg-teal-600 px-2 py-0.5 rounded">MINUTES</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-3xl md:text-4xl font-bold bg-white border-2 border-teal-700 text-black rounded-lg w-16 h-16 flex items-center justify-center shadow-sm">
            {formatNumber(timeRemaining.seconds)}
          </div>
          <span className="text-xs mt-1 font-bold text-white bg-teal-600 px-2 py-0.5 rounded">SECONDS</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;

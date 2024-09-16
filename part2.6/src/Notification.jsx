import React, { useEffect, useState } from 'react';
import './Notification.css';

const Notification = ({ message, type }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (message) {
      setFadeOut(false);
      const timer = setTimeout(() => {
        setFadeOut(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) {
    return null;
  }

  return (
    <div className={`notification ${type} ${fadeOut ? 'fade-out' : ''}`}>
      {message}
    </div>
  );
};

export default Notification;

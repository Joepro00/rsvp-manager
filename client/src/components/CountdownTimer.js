import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ weddingDate, style = 'digital', colors = {} }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(weddingDate) - new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  const isWeddingDay = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;
  const isPast = new Date(weddingDate) < new Date();

  if (isPast) {
    return (
      <div className="text-center">
        <div className="text-2xl font-bold mb-2" style={{ color: colors.primary || '#8b5cf6' }}>
          🎉 Wedding Day Has Arrived! 🎉
        </div>
        <p style={{ color: colors.text || '#6b7280' }}>
          Today is the big day!
        </p>
      </div>
    );
  }

  if (isWeddingDay) {
    return (
      <div className="text-center">
        <div className="text-2xl font-bold mb-2" style={{ color: colors.primary || '#8b5cf6' }}>
          🎉 It's Wedding Day! 🎉
        </div>
        <p style={{ color: colors.text || '#6b7280' }}>
          The celebration begins now!
        </p>
      </div>
    );
  }

  // Digital Style (default)
  if (style === 'digital') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="countdown-item">
          <div className="countdown-number" style={{ color: colors.primary || '#8b5cf6' }}>{timeLeft.days}</div>
          <div className="countdown-label" style={{ color: colors.text || '#6b7280' }}>Days</div>
        </div>
        <div className="countdown-item">
          <div className="countdown-number" style={{ color: colors.primary || '#8b5cf6' }}>{timeLeft.hours.toString().padStart(2, '0')}</div>
          <div className="countdown-label" style={{ color: colors.text || '#6b7280' }}>Hours</div>
        </div>
        <div className="countdown-item">
          <div className="countdown-number" style={{ color: colors.primary || '#8b5cf6' }}>{timeLeft.minutes.toString().padStart(2, '0')}</div>
          <div className="countdown-label" style={{ color: colors.text || '#6b7280' }}>Minutes</div>
        </div>
        <div className="countdown-item">
          <div className="countdown-number" style={{ color: colors.primary || '#8b5cf6' }}>{timeLeft.seconds.toString().padStart(2, '0')}</div>
          <div className="countdown-label" style={{ color: colors.text || '#6b7280' }}>Seconds</div>
        </div>
      </div>
    );
  }

  // Circles Style
  if (style === 'circles') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: colors.background || '#f3f4f6', border: `3px solid ${colors.primary || '#8b5cf6'}` }}>
            <span className="text-2xl font-bold" style={{ color: colors.primary || '#8b5cf6' }}>{timeLeft.days}</span>
          </div>
          <span className="text-sm" style={{ color: colors.text || '#6b7280' }}>Days</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: colors.background || '#f3f4f6', border: `3px solid ${colors.primary || '#8b5cf6'}` }}>
            <span className="text-2xl font-bold" style={{ color: colors.primary || '#8b5cf6' }}>{timeLeft.hours.toString().padStart(2, '0')}</span>
          </div>
          <span className="text-sm" style={{ color: colors.text || '#6b7280' }}>Hours</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: colors.background || '#f3f4f6', border: `3px solid ${colors.primary || '#8b5cf6'}` }}>
            <span className="text-2xl font-bold" style={{ color: colors.primary || '#8b5cf6' }}>{timeLeft.minutes.toString().padStart(2, '0')}</span>
          </div>
          <span className="text-sm" style={{ color: colors.text || '#6b7280' }}>Minutes</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: colors.background || '#f3f4f6', border: `3px solid ${colors.primary || '#8b5cf6'}` }}>
            <span className="text-2xl font-bold" style={{ color: colors.primary || '#8b5cf6' }}>{timeLeft.seconds.toString().padStart(2, '0')}</span>
          </div>
          <span className="text-sm" style={{ color: colors.text || '#6b7280' }}>Seconds</span>
        </div>
      </div>
    );
  }

  // Elegant Lines Style
  if (style === 'elegant') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="text-center">
          <div className="border-b-4 pb-2 mb-2" style={{ borderColor: colors.primary || '#8b5cf6' }}>
            <div className="text-3xl font-bold" style={{ color: colors.primary || '#8b5cf6' }}>{timeLeft.days}</div>
          </div>
          <div className="text-sm" style={{ color: colors.text || '#6b7280' }}>Days</div>
        </div>
        <div className="text-center">
          <div className="border-b-4 pb-2 mb-2" style={{ borderColor: colors.primary || '#8b5cf6' }}>
            <div className="text-3xl font-bold" style={{ color: colors.primary || '#8b5cf6' }}>{timeLeft.hours.toString().padStart(2, '0')}</div>
          </div>
          <div className="text-sm" style={{ color: colors.text || '#6b7280' }}>Hours</div>
        </div>
        <div className="text-center">
          <div className="border-b-4 pb-2 mb-2" style={{ borderColor: colors.primary || '#8b5cf6' }}>
            <div className="text-3xl font-bold" style={{ color: colors.primary || '#8b5cf6' }}>{timeLeft.minutes.toString().padStart(2, '0')}</div>
          </div>
          <div className="text-sm" style={{ color: colors.text || '#6b7280' }}>Minutes</div>
        </div>
        <div className="text-center">
          <div className="border-b-4 pb-2 mb-2" style={{ borderColor: colors.primary || '#8b5cf6' }}>
            <div className="text-3xl font-bold" style={{ color: colors.primary || '#8b5cf6' }}>{timeLeft.seconds.toString().padStart(2, '0')}</div>
          </div>
          <div className="text-sm" style={{ color: colors.text || '#6b7280' }}>Seconds</div>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="countdown-item">
        <div className="countdown-number">{timeLeft.days}</div>
        <div className="countdown-label">Days</div>
      </div>
      <div className="countdown-item">
        <div className="countdown-number">{timeLeft.hours.toString().padStart(2, '0')}</div>
        <div className="countdown-label">Hours</div>
      </div>
      <div className="countdown-item">
        <div className="countdown-number">{timeLeft.minutes.toString().padStart(2, '0')}</div>
        <div className="countdown-label">Minutes</div>
      </div>
      <div className="countdown-item">
        <div className="countdown-number">{timeLeft.seconds.toString().padStart(2, '0')}</div>
        <div className="countdown-label">Seconds</div>
      </div>
    </div>
  );
};

export default CountdownTimer; 
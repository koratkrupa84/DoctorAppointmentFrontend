import React, { useState, useEffect, useRef } from 'react';
import '../styles/captcha.css';

const AlphanumericCaptcha = ({ onCaptchaChange, reset }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  const generateRandomString = (length = 6) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#f8f9fa');
    gradient.addColorStop(1, '#e9ecef');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add noise lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`;
      ctx.lineWidth = Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    // Add noise dots
    for (let i = 0; i < 25; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
    }

    // Draw text with distortions
    const charWidth = width / (text.length + 1);
    
    for (let i = 0; i < text.length; i++) {
      ctx.save();
      
      const x = charWidth * (i + 0.8);
      const y = height / 2;
      
      // Random rotation and position
      const rotation = (Math.random() - 0.5) * 0.2;
      const yOffset = (Math.random() - 0.5) * 6;
      
      ctx.translate(x, y + yOffset);
      ctx.rotate(rotation);
      
      // Random font properties
      const fontSize = 16 + Math.random() * 4;
      const fontWeight = Math.random() > 0.5 ? 'bold' : '600';
      const fontFamily = ['Arial', 'Georgia', 'Courier New'][Math.floor(Math.random() * 3)];
      
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = `rgb(${20 + Math.random() * 60}, ${80 + Math.random() * 60}, ${120 + Math.random() * 60})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Add shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 1;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }

    // Add border
    ctx.strokeStyle = 'rgba(0, 128, 128, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);
  };

  const generateNewCaptcha = () => {
    const newText = generateRandomString();
    setCaptchaText(newText);
    setUserInput('');
    drawCaptcha(newText);
    onCaptchaChange(false);
    setError('');
  };

  useEffect(() => {
    generateNewCaptcha();
  }, []);

  useEffect(() => {
    if (reset) {
      generateNewCaptcha();
    }
  }, [reset]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);
    
    // Check if input is complete (same length as captcha)
    if (value.length === captchaText.length) {
      const isValid = value === captchaText;
      onCaptchaChange(isValid);
      
      if (!isValid) {
        setError('CAPTCHA incorrect! Generating new one...');
        setTimeout(() => {
          generateNewCaptcha();
          setError('');
        }, 1500);
      } else {
        setError('');
      }
      
      console.log('CAPTCHA Debug - Text:', captchaText, 'Input:', value, 'Valid:', isValid);
    } else {
      onCaptchaChange(false);
      setError('');
    }
  };

  return (
    <div className="captcha-component">
      <div className="form-group">
        <label htmlFor="captcha" className="captcha-label">
          🔐 ENTER CAPTCHA
        </label>
        <div className="captcha-container">
          <div className="captcha-canvas-wrapper">
            <canvas
              ref={canvasRef}
              width={200}
              height={60}
              className="captcha-canvas"
            />
          </div>
          <button
            type="button"
            onClick={generateNewCaptcha}
            className="captcha-refresh-btn"
            title="Get new CAPTCHA"
          >
            ↻
          </button>
        </div>
        <input
          id="captcha"
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Enter CAPTCHA text"
          className="captcha-input"
          maxLength={6}
          autoComplete="off"
        />
        {error && (
          <div className="captcha-error">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlphanumericCaptcha;

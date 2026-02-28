import React, { useState, useRef, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { API } from "../config/api";
import "../styles/aiAdvisor.css";

const AIAdvisor = () => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [gettingAdvice, setGettingAdvice] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [isRecording, setIsRecording] = useState(false);
  const [showSymptomChecker, setShowSymptomChecker] = useState(false);
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const token = localStorage.getItem("token");

  // Health categories
  const healthCategories = [
    { id: "general", name: "General Health", icon: "🏥", color: "#008080" },
    { id: "symptoms", name: "Symptom Checker", icon: "🔍", color: "#FF6B6B" },
    { id: "medication", name: "Medication", icon: "💊", color: "#4ECDC4" },
    { id: "nutrition", name: "Nutrition", icon: "🥗", color: "#45B7D1" },
    { id: "exercise", name: "Exercise", icon: "🏃", color: "#96CEB4" },
    { id: "mental", name: "Mental Health", icon: "🧠", color: "#DDA0DD" },
    { id: "sleep", name: "Sleep", icon: "😴", color: "#7B68EE" },
    { id: "women", name: "Women's Health", icon: "♀️", color: "#FFB6C1" }
  ];

  // Common symptoms for checker
  const commonSymptoms = [
    "Fever", "Headache", "Cough", "Fatigue", "Nausea", "Dizziness",
    "Chest Pain", "Shortness of Breath", "Stomach Pain", "Back Pain",
    "Joint Pain", "Sore Throat", "Runny Nose", "Muscle Pain", "Anxiety"
  ];

  // Quick action templates
  const quickActions = [
    { text: "I have fever and headache", category: "symptoms" },
    { text: "What are the symptoms of flu?", category: "general" },
    { text: "Give me a healthy diet plan", category: "nutrition" },
    { text: "Exercises for back pain relief", category: "exercise" },
    { text: "How to improve sleep quality?", category: "sleep" },
    { text: "Tips to reduce stress", category: "mental" }
  ];

  useEffect(() => {
    scrollToBottom();
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [chatHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in your browser. Please use Chrome or Edge.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowQuickActions(false);
    
    // Update question placeholder based on category
    const category = healthCategories.find(cat => cat.id === categoryId);
    if (category) {
      setQuestion("");
    }
  };

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const getSymptomAdvice = () => {
    if (selectedSymptoms.length === 0) {
      alert("Please select at least one symptom");
      return;
    }

    const symptomsText = selectedSymptoms.join(", ");
    const question = `I'm experiencing the following symptoms: ${symptomsText}. What could be the possible causes and what should I do?`;
    setQuestion(question);
    setShowSymptomChecker(false);
    setSelectedSymptoms([]);
    getAIAdviceWithQuestion(question);
  };

  const getAIAdvice = async (e) => {
    e.preventDefault();
    getAIAdviceWithQuestion(question);
  };

  const getAIAdviceWithQuestion = async (questionText) => {
    if (!questionText.trim()) {
      alert("Please enter your question");
      return;
    }

    const userQuestion = questionText.trim();
    setQuestion("");
    setShowQuickActions(false);
    
    // Add user message to chat with proper formatting
    const userMessage = {
      id: Date.now(),
      type: "user",
      message: userQuestion,
      category: selectedCategory,
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, userMessage]);

    setGettingAdvice(true);
    try {
      const res = await fetch(API.AI_ADVICE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ 
          message: userQuestion,
          category: selectedCategory 
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Format AI response properly with structure
        let formattedResponse = data.advice || data.message || "No advice available";
        
        // Add proper formatting based on category
        if (selectedCategory === "symptoms") {
          formattedResponse = formatSymptomResponse(formattedResponse);
        } else if (selectedCategory === "nutrition") {
          formattedResponse = formatNutritionResponse(formattedResponse);
        } else if (selectedCategory === "exercise") {
          formattedResponse = formatExerciseResponse(formattedResponse);
        } else if (selectedCategory === "mental") {
          formattedResponse = formatMentalHealthResponse(formattedResponse);
        } else if (selectedCategory === "sleep") {
          formattedResponse = formatSleepResponse(formattedResponse);
        } else if (selectedCategory === "medication") {
          formattedResponse = formatMedicationResponse(formattedResponse);
        } else if (selectedCategory === "women") {
          formattedResponse = formatWomensHealthResponse(formattedResponse);
        } else {
          formattedResponse = formatGeneralResponse(formattedResponse);
        }
        
        // Add AI response to chat
        const aiMessage = {
          id: Date.now() + 1,
          type: "ai",
          message: formattedResponse,
          category: selectedCategory,
          timestamp: new Date()
        };
        setChatHistory(prev => [...prev, aiMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          type: "ai",
          message: data.message || "Failed to get AI advice. Please try again.",
          isError: true,
          timestamp: new Date()
        };
        setChatHistory(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error getting AI advice:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        message: "Failed to get AI advice. Please try again.",
        isError: true,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setGettingAdvice(false);
    }
  };

  // Format responses based on category
  const formatSymptomResponse = (response) => {
    return `🔍 **Symptom Analysis**\n\n${response}\n\n---\n\n⚠️ **Important**: This is not a medical diagnosis. Please consult a healthcare professional for proper medical evaluation.`;
  };

  const formatNutritionResponse = (response) => {
    return `🥗 **Nutrition Advice**\n\n${response}\n\n---\n\n💡 **Tip**: Always consult with a registered dietitian before making significant dietary changes.`;
  };

  const formatExerciseResponse = (response) => {
    return `🏃 **Exercise Recommendations**\n\n${response}\n\n---\n\n🏋️ **Safety**: Start slowly and consult a fitness professional if you have any health conditions.`;
  };

  const formatMentalHealthResponse = (response) => {
    return `🧠 **Mental Health Support**\n\n${response}\n\n---\n\n🤝 **Professional Help**: If you're experiencing severe mental health issues, please seek help from a mental health professional.`;
  };

  const formatSleepResponse = (response) => {
    return `😴 **Sleep Advice**\n\n${response}\n\n---\n\n🌙 **Sleep Hygiene**: Maintain a consistent sleep schedule and create a relaxing bedtime routine.`;
  };

  const formatMedicationResponse = (response) => {
    return `💊 **Medication Guidance**\n\n${response}\n\n---\n\n⚠️ **Disclaimer**: This is general information only. Always follow your healthcare provider's instructions and consult them before taking any medication.`;
  };

  const formatWomensHealthResponse = (response) => {
    return `♀️ **Women's Health**\n\n${response}\n\n---\n\n👩️ **Professional Care**: Regular check-ups with a gynecologist are important for maintaining women's health.`;
  };

  const formatGeneralResponse = (response) => {
    return `🏥 **General Health Advice**\n\n${response}\n\n---\n\n⚕️ **Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice.`;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      setChatHistory([]);
      setShowQuickActions(true);
    }
  };

  const exportChat = () => {
    const chatText = chatHistory.map(msg => 
      `${msg.type === 'user' ? 'You' : 'AI'} [${formatTime(msg.timestamp)}]: ${msg.message}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-health-advisor-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getCategoryColor = (categoryId) => {
    const category = healthCategories.find(cat => cat.id === categoryId);
    return category ? category.color : "#008080";
  };

  return (
    <>
      <Header />
      <div className="ai-advisor-page">
        <div className="ai-advisor-container">
          {/* Advanced Header */}
          <div className="ai-header-advanced">
            <div className="ai-title-section">
              <div className="ai-title">
                <span className="ai-icon-large">🤖</span>
                <h1>AI Health Advisor</h1>
                <span className="ai-badge-advanced">Advanced</span>
              </div>
              <p className="ai-subtitle">Get personalized health advice with AI-powered insights</p>
            </div>
            
            <div className="ai-actions">
              <button className="export-btn" onClick={exportChat} title="Export Chat">
                📥
              </button>
              {chatHistory.length > 0 && (
                <button className="clear-chat-btn" onClick={clearChat}>
                  Clear Chat
                </button>
              )}
            </div>
          </div>

          {/* Category Selection */}
          <div className="category-selector">
            <div className="category-tabs">
              {healthCategories.map(category => (
                <button
                  key={category.id}
                  className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(category.id)}
                  style={{ 
                    '--category-color': category.color,
                    '--category-color-light': category.color + '20'
                  }}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          {showQuickActions && chatHistory.length === 0 && (
            <div className="quick-actions">
              <h3>Quick Questions</h3>
              <div className="quick-action-grid">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="quick-action-btn"
                    onClick={() => {
                      setQuestion(action.text);
                      setSelectedCategory(action.category);
                      setShowQuickActions(false);
                    }}
                  >
                    {action.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Symptom Checker */}
          {selectedCategory === "symptoms" && (
            <div className="symptom-checker">
              <div className="symptom-checker-header">
                <h3>Symptom Checker</h3>
                <button 
                  className="toggle-symptom-btn"
                  onClick={() => setShowSymptomChecker(!showSymptomChecker)}
                >
                  {showSymptomChecker ? "Hide" : "Show"} Symptoms
                </button>
              </div>
              
              {showSymptomChecker && (
                <div className="symptom-grid">
                  {commonSymptoms.map(symptom => (
                    <label key={symptom} className="symptom-item">
                      <input
                        type="checkbox"
                        checked={selectedSymptoms.includes(symptom)}
                        onChange={() => handleSymptomToggle(symptom)}
                      />
                      <span className="symptom-checkbox"></span>
                      <span className="symptom-text">{symptom}</span>
                    </label>
                  ))}
                </div>
              )}
              
              {selectedSymptoms.length > 0 && (
                <div className="selected-symptoms">
                  <strong>Selected: </strong>
                  {selectedSymptoms.join(", ")}
                  <button 
                    className="analyze-symptoms-btn"
                    onClick={getSymptomAdvice}
                  >
                    Analyze Symptoms
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="chat-messages-area">
            {chatHistory.length === 0 ? (
              <div className="welcome-message-advanced">
                <div className="welcome-icon">👋</div>
                <h2>Welcome to Advanced AI Health Advisor</h2>
                <p>I can help you with:</p>
                <div className="features-grid">
                  <div className="feature-item">
                    <span className="feature-icon">🏥</span>
                    <span>General health advice</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🔍</span>
                    <span>Symptom analysis</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">💊</span>
                    <span>Medication guidance</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🥗</span>
                    <span>Diet & nutrition</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🏃</span>
                    <span>Exercise recommendations</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🧠</span>
                    <span>Mental health support</span>
                  </div>
                </div>
                <div className="advanced-features">
                  <h4>Advanced Features:</h4>
                  <ul>
                    <li>🎤 Voice input support</li>
                    <li>📊 Symptom checker</li>
                    <li>📥 Chat export functionality</li>
                    <li>🏷️ Category-based advice</li>
                    <li>⚡ Quick action templates</li>
                  </ul>
                </div>
                <p className="disclaimer">
                  <strong>⚠️ Medical Disclaimer:</strong> This AI provides general health information only. 
                  Always consult qualified healthcare professionals for medical diagnosis and treatment.
                </p>
              </div>
            ) : (
              chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-message ${msg.type === "user" ? "user-message" : "ai-message"}`}
                >
                  <div className="message-bubble">
                    {msg.type === "ai" && (
                      <div className="ai-header-info">
                        <span className="ai-badge">AI</span>
                        {msg.category && (
                          <span 
                            className="category-tag"
                            style={{ backgroundColor: getCategoryColor(msg.category) }}
                          >
                            {healthCategories.find(cat => cat.id === msg.category)?.name || msg.category}
                          </span>
                        )}
                      </div>
                    )}
                    <p className={msg.isError ? 'error-message' : ''}>{msg.message}</p>
                    <span className="message-timestamp">{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
              ))
            )}
            {gettingAdvice && (
              <div className="chat-message ai-message">
                <div className="message-bubble">
                  <div className="ai-header-info">
                    <span className="ai-badge">AI</span>
                    <span className="category-tag" style={{ backgroundColor: getCategoryColor(selectedCategory) }}>
                      {healthCategories.find(cat => cat.id === selectedCategory)?.name || selectedCategory}
                    </span>
                  </div>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Advanced Input Form */}
          <form className="ai-input-form-advanced" onSubmit={getAIAdvice}>
            <div className="input-container">
              <button
                type="button"
                className={`voice-btn ${isRecording ? 'recording' : ''}`}
                onClick={toggleRecording}
                title="Voice Input"
              >
                {isRecording ? "🔴" : "🎤"}
              </button>
              
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={
                  selectedCategory === "symptoms" ? "Describe your symptoms..." :
                  selectedCategory === "nutrition" ? "Ask about diet and nutrition..." :
                  selectedCategory === "exercise" ? "Ask about exercise and fitness..." :
                  selectedCategory === "mental" ? "Ask about mental health..." :
                  selectedCategory === "sleep" ? "Ask about sleep issues..." :
                  selectedCategory === "women" ? "Ask about women's health..." :
                  selectedCategory === "medication" ? "Ask about medications..." :
                  "Ask me anything about your health..."
                }
                disabled={gettingAdvice}
                className="ai-input-advanced"
              />
              
              <button 
                type="submit" 
                className={`send-btn ${gettingAdvice ? 'sending' : ''}`}
                disabled={gettingAdvice || !question.trim()}
              >
                {gettingAdvice ? (
                  <div className="sending-spinner"></div>
                ) : (
                  "🚀"
                )}
              </button>
            </div>
            
            {selectedCategory && (
              <div className="category-indicator">
                <span 
                  className="category-dot"
                  style={{ backgroundColor: getCategoryColor(selectedCategory) }}
                ></span>
                <span>Current: {healthCategories.find(cat => cat.id === selectedCategory)?.name}</span>
              </div>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AIAdvisor;

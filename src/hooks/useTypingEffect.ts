import { useState, useEffect } from 'react';

const placeholders = [
  "Cooking recipe",
  "Help in homework",
  "Why is this happening?",
  "Write me code...",
  "Talk to me...",
  "What's up...",
  "Tell me a fun fact",
  "Best movies to watch",
  "Explain AI in simple words",
  "Suggest me a project idea",
  "Motivate me today",
  "What can I learn new?",
  "Tell me a joke",
  "How to become rich?",
  "Give me life advice",
  "Who created the universe?",
  "What's trending today?",
  "Translate this to French",
  "Summarize this article",
  "Is time travel possible?",
  "Teach me something cool",
  "Debug this error",
  "Make me laugh",
  "Write a poem",
  "Generate a startup idea",
  "Tell me about black holes",
  "Create a story with me",
  "Give me a workout plan",
  "Make a to-do list",
  "What's the future of AI?",
  "Who am I?",
  "Best places to travel",
  "Write an email for me",
  "What is love?",
  "How do I start coding?",
  "Plan my day",
  "Teach me about hacking",
  "Give me a fun quiz",
  "What's the weather in Tokyo?",
  "What is quantum computing?",
  "Sing me a song",
  "Tell me something spooky",
  "Give me a random fact",
  "How do I stay focused?",
  "Write a romantic message",
  "What's in the news?",
  "How to meditate?",
  "Show me a magic trick",
  "Write a motivational quote",
  "What are dreams made of?",
  "Make a meme for me",
  "Help me sleep",
  "Let's play a game",
  "Hack like a pro",
  "What is the dark web?",
  "Can you predict the future?",
  "Build a website for me"
];

export const useTypingEffect = () => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const currentText = placeholders[currentIndex];
    
    if (isTyping) {
      if (currentPlaceholder.length < currentText.length) {
        // Typing effect
        timeout = setTimeout(() => {
          setCurrentPlaceholder(currentText.slice(0, currentPlaceholder.length + 1));
        }, 100); // Typing speed
      } else {
        // Wait before starting to erase
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000); // Wait time before erasing
      }
    } else {
      if (currentPlaceholder.length > 0) {
        // Erasing effect
        timeout = setTimeout(() => {
          setCurrentPlaceholder(currentPlaceholder.slice(0, -1));
        }, 50); // Erasing speed
      } else {
        // Move to next placeholder
        setCurrentIndex((prev) => (prev + 1) % placeholders.length);
        setIsTyping(true);
      }
    }
    
    return () => clearTimeout(timeout);
  }, [currentPlaceholder, isTyping, currentIndex]);
  
  return currentPlaceholder;
}; 
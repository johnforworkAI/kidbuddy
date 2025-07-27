"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [textQuestion, setTextQuestion] = useState("");
  const recognitionRef = useRef(null);

  // Set up speech recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      speakResponse(`You said: ${spokenText}`); // Add TTS here
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      setTranscript("");
      recognition.start();
    }
    setIsListening(!isListening);
  };

  const speakResponse = (text) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    synth.speak(utter);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-blue-50">
      <h1 className="text-4xl font-bold mb-6 text-center text-indigo-700">
        Welcome to KidBuddy! 🤖🎉
      </h1>
      <p className="text-lg max-w-xl text-center text-gray-700">
        Talk to your AI-powered friend by clicking the button below.
      </p>
      <button
        className={`mt-10 px-6 py-3 rounded-lg transition text-white ${
          isListening ? "bg-red-500 hover:bg-red-600" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
        onClick={toggleListening}
      >
        {isListening ? "Stop Listening" : "Talk to KidBuddy"}
      </button>
      <div className="mt-8 w-full max-w-md flex flex-col gap-4">
  <input
    type="text"
    value={textQuestion}
    onChange={(e) => setTextQuestion(e.target.value)}
    placeholder="Type your question here"
    className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
  />
  <button
    onClick={() => getAIResponse(textQuestion)}
    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
    disabled={!textQuestion.trim()}
  >
    Submit Question
  </button>
</div>
      {response && (
  <p className="mt-4 text-indigo-700 text-center font-semibold text-lg">
    KidBuddy says: "{response}"
  </p>
)}

    </main>
  );
}

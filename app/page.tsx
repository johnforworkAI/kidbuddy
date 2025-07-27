"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [textQuestion, setTextQuestion] = useState("");
  const recognitionRef = useRef(null);

  // Setup speech recognition
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
      getAIResponse(spokenText);
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      recognition.start();
      setIsListening(true);
    }
  };

  const speakResponse = (text) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    synth.speak(utter);
  };

  const getAIResponse = async (question: string) => {
    if (!question.trim()) return; // ignore empty questions

    try {
      setResponse("Loading..."); // optional: show loading while waiting

      const res = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.answer);
        speakResponse(data.answer); // call your speak function if you want TTS
      } else {
        setResponse("Sorry, I couldn't get an answer.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error fetching response.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-blue-50">
      <h1 className="text-4xl font-bold mb-6 text-center text-indigo-700">
        Welcome to KidBuddy! 🤖🎉
      </h1>
      <p className="text-lg max-w-xl text-center text-gray-700">
        Talk to your AI-powered friend by speaking or typing your question.
      </p>

      <button
        className={`mt-10 px-6 py-3 rounded-lg transition text-white ${
          isListening
            ? "bg-red-500 hover:bg-red-600"
            : "bg-indigo-600 hover:bg-indigo-700"
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

      {transcript && (
        <p className="mt-6 text-xl text-center text-indigo-800 font-medium">
          You said: "{transcript}"
        </p>
      )}

      {response && (
        <p className="mt-4 text-indigo-700 text-center font-semibold text-lg">
          KidBuddy says: "{response}"
        </p>
      )}
    </main>
  );
}

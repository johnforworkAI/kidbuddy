export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-blue-50">
      <h1 className="text-4xl font-bold mb-6 text-center text-indigo-700">
        Welcome to KidBuddy! 🤖🎉
      </h1>
      <p className="text-lg max-w-xl text-center text-gray-700">
        KidBuddy is an AI-powered friend for kids to ask fun questions and learn new things.
      </p>
      <button
        className="mt-10 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        onClick={() => alert("Hi! I'm KidBuddy, your AI friend! Ask me anything.")}
      >
        Say Hi to KidBuddy
      </button>
    </main>
  );
}

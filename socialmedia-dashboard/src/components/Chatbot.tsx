// "use client";
// import { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Loader2 } from "lucide-react";

// const Chatbot = () => {
//   const [message, setMessage] = useState("");
//   const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
//   const [loading, setLoading] = useState(false);
//   const chatRef = useRef<HTMLDivElement>(null);

//   const fetchResponse = async () => {
//     if (!message.trim()) return;
//     setLoading(true);

//     setChatHistory((prev) => [...prev, { role: "user", content: message }]);

//     try {
//       const res = await axios.post("http://127.0.0.1:8001/chatbot", { message });
//       setChatHistory((prev) => [...prev, { role: "assistant", content: res.data.response }]);
//     } catch (error) {
//       console.error("Error fetching chatbot response:", error);
//       setChatHistory((prev) => [...prev, { role: "assistant", content: "Error processing request." }]);
//     }

//     setMessage("");
//     setLoading(false);
//   };

//   // Auto-scroll to latest message
//   useEffect(() => {
//     if (chatRef.current) {
//       chatRef.current.scrollTop = chatRef.current.scrollHeight;
//     }
//   }, [chatHistory]);

//   return (
//     <Card className="w-full h-screen p-6 shadow-lg bg-white rounded-lg flex flex-col">
//       <h2 className="text-xl font-bold text-center mb-4">💬 AI Chatbot</h2>

//       {/* Chat Display */}
//       <div ref={chatRef} className="flex-1 overflow-y-auto p-4 border rounded-lg bg-gray-100 space-y-3">
//         {chatHistory.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-3 rounded-lg max-w-[75%] ${
//               msg.role === "user" ? "bg-indigo-500 text-white ml-auto self-end" : "bg-gray-300 text-black"
//             }`}
//           >
//             {msg.content}
//           </div>
//         ))}
//       </div>

//       {/* Message Input */}
//       <div className="mt-4 flex gap-2">
//         <Input
//           className="p-2 border rounded-lg flex-1"
//           placeholder="Type your question..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <Button onClick={fetchResponse} disabled={loading} className="bg-green-500 hover:bg-green-700">
//           {loading ? <Loader2 className="animate-spin" /> : "Send"}
//         </Button>
//       </div>
//     </Card>
//   );
// };

// export default Chatbot;

"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "👋 Hello! How may I help you today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const fetchResponse = async () => {
    if (!message.trim()) return;
    setLoading(true);

    setChatHistory((prev) => [...prev, { role: "user", content: message }]);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_CHATBOT_API_URL}/chatbot`, { message });
      setChatHistory((prev) => [...prev, { role: "assistant", content: res.data.response }]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setChatHistory((prev) => [...prev, { role: "assistant", content: "Error processing request." }]);
    }

    setMessage("");
    setLoading(false);
  };

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <Card className="w-full h-screen p-6 shadow-lg bg-white rounded-lg flex flex-col">
      <h2 className="text-xl font-bold text-center mb-2">💬 AI Chatbot</h2>

      {/* Chat Display - Reduced Bottom Padding for Minimal Gap */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-3 border rounded-lg bg-gray-100 space-y-2">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-[75%] ${
              msg.role === "user" ? "bg-indigo-500 text-white ml-auto self-end" : "bg-gray-300 text-black"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Message Input - Minimal Top Margin */}
      <div className="mt-1 flex gap-2">
        <Input
          className="p-2 border rounded-lg flex-1"
          placeholder="Type your question..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={fetchResponse} disabled={loading} className="bg-indigo-500 hover:bg-indigo-700">
          {loading ? <Loader2 className="animate-spin" /> : "Send"}
        </Button>
      </div>
    </Card>
  );
};

export default Chatbot;

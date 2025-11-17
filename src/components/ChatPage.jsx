import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


// --- INLINE SVG ICONS (Replaced react-icons) ---
const PlusIcon = (props) => (
  <svg {...props} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
  </svg>
);

const PaperPlaneIcon = (props) => (
  <svg {...props} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"></path>
  </svg>
);

const RobotIcon = (props) => (
  <svg {...props} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M32,224H480a32,32,0,0,1,32,32V416a32,32,0,0,1-32,32H32a32,32,0,0,1-32-32V256A32,32,0,0,1,32,224Zm288,80a24,24,0,1,0-24,24A24,24,0,0,0,320,304Zm-128,0a24,24,0,1,0-24,24A24,24,0,0,0,192,304ZM464,96a80,80,0,1,0-150.43,32H206.43A80,80,0,1,0,48,96,96,96,0,0,0,32,192H480A96,96,0,0,0,464,96Z"></path>
  </svg>
);

// Mock implementations
const useNavigate = () => (path) => console.log(`Simulated Navigation: ${path}`);
const uuidv4 = () => Math.random().toString(36).substring(2, 9);

let CHAT_STORE = [
  { id: "mock-id-1", title: "AKU Assistant", messages: [{ id: "msg1", sender: "ai", text: "Welcome to CETE Virtual Assistant", ts: Date.now() - 50000 }], createdAt: Date.now() - 100000, updatedAt: Date.now() - 50000 },
  { id: "mock-id-2", title: "Project Planning Draft", messages: [], createdAt: Date.now() - 200000, updatedAt: Date.now() - 150000 },
];

const getChats = () => CHAT_STORE.sort((a, b) => b.updatedAt - a.updatedAt);
const getChatById = (id) => CHAT_STORE.find((c) => c.id === id);
const saveChat = (chat) => {
  const index = CHAT_STORE.findIndex((c) => c.id === chat.id);
  if (index > -1) CHAT_STORE[index] = chat;
  else CHAT_STORE.unshift(chat);
};
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ChatPage() {
  const navigate = useNavigate();
  const initialChats = getChats();
  const initialChat = initialChats[0] || null;

  const [activeChatId, setActiveChatId] = useState(initialChat?.id || null);
  const [messages, setMessages] = useState(initialChat?.messages || []);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const endRef = useRef(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const startNew = () => {
    if (activeChatId && messages.length === 0) return;

    if (activeChatId && messages.length > 0) {
      const currentChat = getChatById(activeChatId);
      if (currentChat) {
        currentChat.messages = messages;
        currentChat.updatedAt = Date.now();
        saveChat(currentChat);
      }
    }

    const newId = uuidv4();
    const newChat = { id: newId, title: "New Session", messages: [], createdAt: Date.now(), updatedAt: Date.now() };
    saveChat(newChat);
    setActiveChatId(newId);
    setMessages([]);
    setInput("");
    setStatus(null);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
  
    const userMsg = { id: uuidv4(), sender: "user", text: input, ts: Date.now() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
  
    const currentInput = input;
    setInput("");
    setLoading(true);
    setStatus(null);
  
    let chatObj = getChatById(activeChatId);
    if (!chatObj) {
      const newId = uuidv4();
      chatObj = { id: newId, title: "New Session", messages: [], createdAt: Date.now() };
      setActiveChatId(newId);
    }
  
    chatObj.messages = updatedMessages;
    chatObj.updatedAt = Date.now();
    saveChat(chatObj);
  
    try {
      // 🧠 Stream directly from backend
      const resp = await fetch("http://127.0.0.1:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: currentInput }),
      });
  
      if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
  
      // Create a blank AI message to stream into
      const aiMsg = { id: uuidv4(), sender: "ai", text: "", ts: Date.now() };
      setMessages((prev) => [...prev, aiMsg]);
  
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
  
      // 🧩 Smooth streaming (updates UI every few chunks)
      let partial = "";
      let lastUpdate = Date.now();
  
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
  
        const chunk = decoder.decode(value, { stream: true });
        chunk.split("\n\n").forEach((line) => {
          if (line.startsWith("data: ")) {
            const content = line.replace("data: ", "").trim();
            if (content === "[DONE]") return;
            partial += content;
          }
        });
  
        const now = Date.now();
        if (now - lastUpdate > 15) { // throttle updates for smoother animation
          accumulated += partial;
          partial = "";
          lastUpdate = now;
  
          setMessages((prev) => {
            const updated = [...prev];
            const lastMsg = { ...updated[updated.length - 1], text: accumulated };
            updated[updated.length - 1] = lastMsg;
            return updated;
          });
        }
      }
  
      // Final update after stream completes
      if (partial) accumulated += partial;
      setMessages((prev) => {
        const updated = [...prev];
        const lastMsg = { ...updated[updated.length - 1], text: accumulated };
        updated[updated.length - 1] = lastMsg;
        return updated;
      });
  
      // Save chat
      chatObj.messages = [...updatedMessages, { ...aiMsg, text: accumulated }];
      chatObj.updatedAt = Date.now();
      saveChat(chatObj);
  
    } catch (error) {
      const errMsg = {
        id: uuidv4(),
        sender: "ai",
        text: `⚠️ Error contacting backend: ${error.message}`,
        ts: Date.now(),
      };
      const withErr = [...updatedMessages, errMsg];
      setMessages(withErr);
      chatObj.messages = withErr;
      saveChat(chatObj);
    } finally {
      setLoading(false);
      setStatus(null);
    }
  };
  

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      <div className="w-10 flex items-center justify-center bg-[#00843D] cursor-pointer hover:bg-[#00632d] transition">
        <span className="text-white transform -rotate-90 whitespace-nowrap text-m font-bold tracking-wider">
          CETE Virtual Assistant
        </span>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        <div className="relative flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white shadow-lg">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={startNew}
              className="bg-[#00843D] text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-medium transition hover:bg-[#00632d] shadow-md"
            >
              <PlusIcon className="text-xs" /> New Chat
            </motion.button>
            <h2 className="text-lg font-semibold text-gray-900 hidden sm:block">
              {activeChatId ? "" : "Start a New Session"}
            </h2>
          </div>

          {/* 🟩 Added CETE text in green, centered at top */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <span className="text-[#00843D] font-bold text-xl tracking-wide">Center of Excellence for Trauma and Emergencies(CETE)</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col">
          {!hasMessages && activeChatId ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center pb-24">
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1.0 }} transition={{ duration: 0.5 }}>
                <RobotIcon className="text-[#00843D] text-6xl mb-4" />
              </motion.div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Welcome to CETE Virtual Assistant</h3>
              <p className="text-gray-500 text-lg">Ask me anything related to RO and HR Policies .</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                   <div
  className={`p-3 rounded-2xl max-w-[80%] shadow-lg ${
    m.sender === "user"
      ? "bg-[#00843D] text-white rounded-br-md"
      : "bg-gray-100 text-gray-900 rounded-tl-md prose prose-sm prose-slate"
  }`}
  style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
>
  {m.sender === "ai" ? (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
  ) : (
    <div className="text-[15px] leading-relaxed">{m.text}</div>
  )}
</div>

                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && status && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl max-w-[80%] shadow-lg bg-gray-100 text-gray-600 rounded-tl-md flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                    <span className="italic text-[15px]">{status}</span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 bg-white p-4">
          <div className="max-w-3xl mx-auto flex items-end gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows="1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="flex-1 p-3 rounded-2xl bg-gray-100 border border-gray-300 text-gray-900 resize-none focus:ring-2 focus:ring-[#00843D] outline-none transition overflow-hidden placeholder-gray-500"
              placeholder="Start a new query..."
              disabled={loading}
            ></textarea>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className={`p-3 w-12 h-12 rounded-full text-white shadow-lg transition flex items-center justify-center text-xl ${
                loading || !input.trim()
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#00843D] to-[#00632d] hover:shadow-[#00843D]/50"
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <PaperPlaneIcon className="transform -rotate-45 -mt-1 ml-1" />
              )}
            </motion.button>
          </div>

          <div className="text-center font-semibold mt-2">
                AI can make mistakes. Consider checking important information.
          </div>
        </div>
      </div>
    </div>
  );
}





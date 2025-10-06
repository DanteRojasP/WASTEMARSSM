import { useEffect, useState, useRef } from "react"
import ReactMarkdown from "react-markdown"

export default function AssistantWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState(() => {
    try {
      const s = sessionStorage.getItem("mars_assistant_msgs")
      return s ? JSON.parse(s) : []
    } catch {
      return []
    }
  })
  const [loading, setLoading] = useState(false)
  const [showBubble, setShowBubble] = useState(false)
  const [showScrollBtn, setShowScrollBtn] = useState(false) // 👈 control flecha
  const scrollRef = useRef(null)

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"

  useEffect(() => {
    sessionStorage.setItem("mars_assistant_msgs", JSON.stringify(messages))
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    const seen = localStorage.getItem("mars_assistant_seen")
    if (!seen) {
      setShowBubble(true)
    }
  }, [])

  // Mostrar flecha apenas subas un poco
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleScroll = () => {
      const nearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 20 // 👈 sensibilidad
      setShowScrollBtn(!nearBottom)
    }

    el.addEventListener("scroll", handleScroll)
    return () => el.removeEventListener("scroll", handleScroll)
  }, [])

  const send = async () => {
    const text = input.trim()
    if (!text) return

    const newUserMsg = { role: "user", text }
    setMessages((m) => [...m, newUserMsg])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      })
      const data = await response.json()
      const replyText = data.reply || "No obtuve respuesta."
      setMessages((m) => [...m, { role: "assistant", text: replyText }])

      const match = text.match(
        /(?:mi name is|I)\s+([A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,30})/i
      )
      if (match)
        localStorage.setItem("mars_assistant_user_name", match[1].trim())
    } catch (err) {
      console.error(err)
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "💤🐕 At this moment, I’m sleeping." },
      ])
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth", // 👈 animado
      })
    }
  }

  return (
    <>
      {/* Botón flotante con burbuja */}
      <div className="fixed right-6 bottom-6 z-50 flex items-center">
        {showBubble && (
          <div className="mr-3 bg-white text-black text-sm px-3 py-2 rounded-xl shadow-md relative">
            Ready to recycle?
            <div className="absolute top-1/2 right-[-8px] -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-l-8 border-l-white"></div>
          </div>
        )}

        <button
          onClick={() => {
            setOpen((v) => {
              const newValue = !v
              if (newValue) {
                localStorage.setItem("mars_assistant_seen", "true")
                setShowBubble(false)
                if (messages.length === 0) {
                  setMessages([
                    {
                      role: "assistant",
                      text: "👋 Hi! My name is Olga, your Martian recycling assistant. Ask me anything about waste management.",
                    },
                  ])
                }
              }
              return newValue
            })
          }}
          className={`w-14 h-14 flex items-center justify-center rounded-full transition-all shadow-lg ${
            open
              ? "bg-[#C67B5C] shadow-[0_0_25px_rgba(198,123,92,0.5)]"
              : "bg-[#C67B5C] hover:bg-[#E27B58]"
          }`}
        >
          <img
            src="/images/bot1.png"
            alt="Asistente"
            className="w-8 h-8 object-contain"
          />
        </button>
      </div>

      {/* Panel del chat */}
      {open && (
        <div className="fixed right-6 bottom-24 z-50 w-80 md:w-96 bg-black border border-[#8E6A5A] rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#8E6A5A] flex items-center justify-between bg-[#000000] text-white">
            <div className="flex items-center gap-2">
              <img
                src="/images/bot2.png"
                alt="Bot"
                className="w-6 h-6 rounded-full"
              />
              <div className="text-sm font-bold">OLGA</div>
            </div>
            <button
              className="text-sm text-[#FF9D6F] hover:text-white"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Mensajes */}
          <div className="relative">
            <div
              ref={scrollRef}
              className="max-h-64 overflow-y-auto p-3 space-y-3 cart-scroll"
            >
              {messages.length === 0 && (
                <div className="text-[#99857A] text-sm">
                  The assistant will greet you at the start...
                </div>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${
                    m.role === "assistant" ? "justify-start" : "justify-end"
                  }`}
                >
                  {m.role === "assistant" && (
                    <div className="bg-[#8E6A5A] p-3 rounded-2xl text-sm text-white max-w-[85%]">
                      <ReactMarkdown>{m.text}</ReactMarkdown>
                    </div>
                  )}
                  {m.role === "user" && (
                    <div className="bg-[#FF9D6F] p-3 rounded-2xl text-sm text-black max-w-[85%]">
                      {m.text}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="text-sm text-[#C67B5C]">Writing...</div>
              )}
            </div>

            {/* Flechita scroll gris (solo aparece al subir) */}
            {showScrollBtn && (
              <button
                onClick={scrollToBottom}
                className="absolute bottom-3 right-3 bg-gray-600 hover:bg-gray-500 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-md"
              >
                ↓
              </button>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[#8E6A5A] bg-[#000000]">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send()
                }}
                className="flex-1 bg-[#1c1c1c] p-2 rounded-full text-sm text-white placeholder-gray-500"
                placeholder="Write your message..."
              />
              <button
                onClick={send}
                className="w-10 h-10 rounded-full bg-[#C67B5C] hover:bg-[#E27B58] text-white flex items-center justify-center"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

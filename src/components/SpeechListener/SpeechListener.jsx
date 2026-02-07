import { useEffect, useRef, useState } from "react";
import { normalizeText } from "../../util/normalizeText";

export default function SpeechListener({ setCommand }) {
  const recognitionRef = useRef(null);
  const isActiveRef = useRef(false);
  const restartTimeoutRef = useRef(null);
  const isRunningRef = useRef(false);
  const [isListening, setIsListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");

  // Função para ativar microfone
  const startListening = () => {
    if (!recognitionRef.current || isActiveRef.current) return;

    isActiveRef.current = true;
    try {
      recognitionRef.current.start();
      console.log("🎤 Microfone ATIVO - pode falar");
    } catch (err) {
      console.error("Erro ao ativar:", err);
    }
  };

  // Função para desativar microfone
  const stopListening = () => {
    if (!recognitionRef.current || !isActiveRef.current) return;

    isActiveRef.current = false;
    try {
      recognitionRef.current.stop();
      console.log("🔇 Microfone DESLIGADO");
    } catch (err) {
      console.error("Erro ao desligar:", err);
    }
  };

  // Listener global para mouse e teclado (push-to-talk)
  useEffect(() => {
    const handlePressStart = (e) => {
      // Se for tecla, só aceita barra de espaço
      if (e.type === 'keydown' && e.code !== 'Space') return;
      
      // Previne scroll com espaço
      if (e.code === 'Space') {
        e.preventDefault();
      }
      
      startListening();
    };

    const handlePressEnd = (e) => {
      // Se for tecla, só aceita barra de espaço
      if (e.type === 'keyup' && e.code !== 'Space') return;
      
      stopListening();
    };

    // Mouse events
    document.addEventListener('mousedown', handlePressStart);
    document.addEventListener('mouseup', handlePressEnd);
    
    // Touch events (mobile)
    document.addEventListener('touchstart', handlePressStart);
    document.addEventListener('touchend', handlePressEnd);
    
    // Keyboard events (barra de espaço)
    document.addEventListener('keydown', handlePressStart);
    document.addEventListener('keyup', handlePressEnd);

    return () => {
      document.removeEventListener('mousedown', handlePressStart);
      document.removeEventListener('mouseup', handlePressEnd);
      document.removeEventListener('touchstart', handlePressStart);
      document.removeEventListener('touchend', handlePressEnd);
      document.removeEventListener('keydown', handlePressStart);
      document.removeEventListener('keyup', handlePressEnd);
    };
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech Recognition não suportado neste navegador");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      const text = lastResult[0].transcript.trim().toLowerCase();
      const normalize = normalizeText(text)
      console.log("🎙️ Texto captado:", normalize);
      setLastTranscript(normalize);
      setCommand(normalize);
      
      // Limpa o texto após 3 segundos
      setTimeout(() => setLastTranscript(""), 3000);
    };

    recognition.onstart = () => {
      isRunningRef.current = true;
      setIsListening(true);
    };

    recognition.onend = () => {
      isRunningRef.current = false;
      setIsListening(false);
      
      // Só reinicia se ainda estiver com o botão pressionado
      if (!isActiveRef.current) {
        return;
      }

      // Reinicia automaticamente enquanto segurar
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }

      restartTimeoutRef.current = setTimeout(() => {
        if (!isActiveRef.current || isRunningRef.current) {
          return;
        }
        
        try {
          recognition.start();
        } catch (err) {
          console.error("❌ Falha ao reconectar:", err);
          isRunningRef.current = false;
        }
      }, 100);
    };

    recognition.onerror = (error) => {
      // Ignora erros comuns em modo contínuo
      if (error?.error === "no-speech" || error?.error === "aborted") {
        return;
      }

      console.error("❌ Erro crítico no reconhecimento:", error);
      isRunningRef.current = false;
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    
    // NÃO inicia automaticamente - aguarda pressionar

    return () => {
      isActiveRef.current = false;
      
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
      
      try {
        if (recognitionRef.current && isRunningRef.current) {
          recognitionRef.current.stop();
        }
      } catch (err) {
        // ignore
      }
      
      isRunningRef.current = false;
    };
  }, [setCommand]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: isListening ? "#4CAF50" : "#333",
        color: "white",
        padding: "20px 28px",
        borderRadius: "16px",
        boxShadow: isListening 
          ? "0 0 20px rgba(76, 175, 80, 0.6)" 
          : "0 4px 12px rgba(0,0,0,0.3)",
        fontFamily: "monospace",
        fontSize: "18px",
        zIndex: 9999,
        minWidth: "280px",
        transition: "all 0.2s ease",
        userSelect: "none",
        border: isListening ? "3px solid #66BB6A" : "3px solid #555",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
        <span
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: isListening ? "#fff" : "#666",
            animation: isListening ? "pulse 1s infinite" : "none",
            boxShadow: isListening ? "0 0 10px #fff" : "none",
          }}
        />
        <span style={{ fontWeight: "bold", fontSize: "20px" }}>
          {isListening ? "🎙️ GRAVANDO" : "🔇 PRONTO"}
        </span>
      </div>
      
      <div style={{ 
        fontSize: "13px", 
        opacity: 0.9,
        borderTop: "1px solid rgba(255,255,255,0.2)",
        paddingTop: "12px",
        lineHeight: "1.5"
      }}>
        {isListening ? (
          <span>🗣️ Pode falar agora...</span>
        ) : (
          <>
            <div>🖱️ Clique e segure</div>
            <div>👆 Toque e segure</div>
            <div>⌨️ Segure [ESPAÇO]</div>
          </>
        )}
      </div>

      {lastTranscript && (
        <div
          style={{
            marginTop: "12px",
            padding: "12px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "8px",
            fontSize: "15px",
            borderLeft: "4px solid #4CAF50",
          }}
        >
          💬 "{lastTranscript}"
        </div>
      )}
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.9); }
        }
      `}</style>
    </div>
  );
}

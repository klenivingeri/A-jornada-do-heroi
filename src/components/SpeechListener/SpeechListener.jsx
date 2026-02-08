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
    if (!recognitionRef.current) return;

    console.log("🛑 Solicitando parada do microfone...");
    
    // Marca como inativo PRIMEIRO para evitar reiniciar
    isActiveRef.current = false;
    
    // Cancela qualquer timeout pendente IMEDIATAMENTE
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
      console.log("❌ Timeout cancelado");
    }
    
    try {
      // Usa stop() para permitir processar resultados finais
      if (isRunningRef.current) {
        recognitionRef.current.stop();
        console.log("🔇 Microfone DESLIGADO (stop chamado)");
      }
    } catch (err) {
      console.error("Erro ao desligar:", err);
      isRunningRef.current = false;
      setIsListening(false);
    }
  };

  // Listener global para barra de espaço
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code !== 'Space') return;
      e.preventDefault();
      startListening();
    };

    const handleKeyUp = (e) => {
      if (e.code !== 'Space') return;
      stopListening();
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
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
      console.log("📴 Recognition.onend - isActive:", isActiveRef.current, "isRunning:", isRunningRef.current);
      
      isRunningRef.current = false;
      setIsListening(false);
      
      // VERIFICAÇÃO IMEDIATA: Só reinicia se botão ainda pressionado
      if (!isActiveRef.current) {
        console.log("✅ Parada confirmada - botão solto");
        return;
      }

      // Cancela timeout anterior se existir
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }

      // Pequeno delay para reiniciar (modo contínuo)
      restartTimeoutRef.current = setTimeout(() => {
        // VERIFICAÇÃO DUPLA antes de reiniciar
        if (!isActiveRef.current) {
          console.log("⛔ Cancelando - foi solto durante timeout");
          return;
        }
        
        if (isRunningRef.current) {
          console.log("⚠️ Já está rodando, não reinicia");
          return;
        }
        
        console.log("🔄 Reiniciando...");
        try {
          recognition.start();
        } catch (err) {
          console.error("❌ Erro ao reiniciar:", err);
          isRunningRef.current = false;
          setIsListening(false);
        }
      }, 100);
    };

    recognition.onerror = (error) => {
      console.log("⚠️ Erro no recognition:", error?.error);
      
      // Ignora erros comuns que são esperados
      if (error?.error === "no-speech") {
        console.log("🔇 Silencio detectado, aguardando...");
        return; // Não para o listener
      }
      
      if (error?.error === "aborted") {
        console.log("🛑 Gravacao abortada (esperado ao parar)");
        isRunningRef.current = false;
        setIsListening(false);
        return;
      }

      // Erros críticos param tudo
      console.error("❌ Erro CRÍTICO:", error);
      isActiveRef.current = false;
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

  const handleTouchStart = (e) => {
    e.preventDefault();
    console.log("👆 Touch START");
    startListening();
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    console.log("👆 Touch END");
    stopListening();
  };

  return (
    <div
      onMouseDown={(e) => {
        e.preventDefault();
        startListening();
      }}
      onMouseUp={(e) => {
        e.preventDefault();
        stopListening();
      }}
      onMouseLeave={(e) => {
        e.preventDefault();
        stopListening(); // Garante parada ao sair da área
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onContextMenu={(e) => e.preventDefault()} // Previne menu de contexto
      style={{
        left: 0,
        right: 0,
        width: "100%",
        height: "100%",
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
        transition: "all 0.2s ease",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
        border: isListening ? "3px solid #66BB6A" : "3px solid #555",
        cursor: "pointer",
        touchAction: "manipulation",
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

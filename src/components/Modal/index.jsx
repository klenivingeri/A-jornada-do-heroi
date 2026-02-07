import { useState, useEffect, useRef } from 'react';
import { commandMatch } from '../../util/commandMatch';
import { readCommandsList } from '../../util/speechReader';
import './modal.css';

export const Modal = ({ command, setCommand, onClose, config, setConfig }) => {
  const modalRef = useRef(null);

  if (!config || config.length === 0) return null;

  // Gerenciar foco quando o modal abre
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  // Função para extrair número do comando
  const extractCommandNumber = (text) => {
    const match = text.match(/(\d+)/);
    const number = match ? parseInt(match[1]) : null;
    const commandText = text.replace(/\d+/g, '').trim();
    return [commandText, number];
  };

  useEffect(() => {
    if (!command) return;

    const [commandText, commandNumber] = extractCommandNumber(command);

    // Comando: Som Ambiente [valor]
    if (commandMatch(commandText, ["som ambiente"])) {
      if (commandNumber !== null && commandNumber >= 0 && commandNumber <= 100) {
        const newConfig = [...config];
        const index = newConfig.findIndex(item => item.command && item.command.includes("som ambiente"));
        if (index !== -1) {
          newConfig[index] = { ...newConfig[index], value: commandNumber };
          setConfig(newConfig);
        }
      }
    }

    // Comando: Som Efeito [valor]
    if (commandMatch(commandText, ["som efeito"])) {
      if (commandNumber !== null && commandNumber >= 0 && commandNumber <= 100) {
        const newConfig = [...config];
        const index = newConfig.findIndex(item => item.command && item.command.includes("som efeito"));
        if (index !== -1) {
          newConfig[index] = { ...newConfig[index], value: commandNumber };
          setConfig(newConfig);
        }
      }
    }

    // Comando: Ativar/Desativar Falas
    if (commandMatch(command, ["ativar falas", "desativar falas"])) {
      const newConfig = [...config];
      const index = newConfig.findIndex(item => item.command && (item.command.includes("ativar falas") || item.command.includes("desativar falas")));
      if (index !== -1) {
        newConfig[index] = { ...newConfig[index], active: !newConfig[index].active };
        setConfig(newConfig);
      }
    }

    // Comando: Listar Comandos
    if (commandMatch(command, ["Listar comandos", "Lista de acoes"])) {
      readCommandsList(config);
    }

    // Comando: Fechar Menu
    if (commandMatch(command, ["fechar menu", "fechar configurações"])) {
      onClose(false);

    }
    setCommand("");
  }, [command]);

  const handleSliderChange = (index, value) => {
    const newConfig = [...config];
    newConfig[index] = { ...newConfig[index], value: parseInt(value) };
    setConfig(newConfig);
  };

  const handleToggle = (index) => {
    const newConfig = [...config];
    newConfig[index] = { ...newConfig[index], active: !newConfig[index].active };
    setConfig(newConfig);
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        tabIndex={-1}
      >
        <button
          className="modal-close"
          onClick={() => onClose(false)}
          aria-label="Fechar menu de configurações"
        >
          ×
        </button>
        {config.map((item, index) => (
          <div key={index} className="modal-item">
            {!item.command ? (
              <h2 id={index === 0 ? "modal-title" : undefined}>{item.text}</h2>
            ) : (
              <>
                <div className="modal-item-header">
                  <h3 id={`config-${index}`}>{item.text}</h3>
                  {item.description && (
                    <p id={`config-desc-${index}`}>{item.description}</p>
                  )}
                  {item.textCommand && (
                    <p id={`config-desc-${index}`}>Comandos: {item.textCommand}</p>
                  )}
                </div>

                {item.min !== undefined ? (
                  <div className="modal-slider">
                    <input
                      type="range"
                      min={item.min}
                      max={item.max}
                      value={item.value}
                      onChange={(e) => handleSliderChange(index, e.target.value)}
                      aria-label={item.text}
                      aria-describedby={`config-desc-${index}`}
                      aria-valuemin={item.min}
                      aria-valuemax={item.max}
                      aria-valuenow={item.value}
                      aria-valuetext={`${item.value} porcento`}
                    />
                    <span aria-hidden="true">{item.value}%</span>
                  </div>
                ) : item.isButton ? (
                  <button
                    className="modal-button"
                    onClick={() => onClose(false)}
                    aria-label={item.text}
                    aria-describedby={`config-desc-${index}`}
                  >
                    {item.text}
                  </button>
                ) : (
                  <div className="modal-toggle">
                    <label>
                      <input
                        type="checkbox"
                        checked={item.active}
                        onChange={() => handleToggle(index)}
                        aria-label={item.text}
                        aria-describedby={`config-desc-${index}`}
                        aria-checked={item.active}
                      />
                      <span aria-hidden="true">
                        {item.active ? 'Ativado' : 'Desativado'}
                      </span>
                    </label>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
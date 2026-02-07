import { useState, useEffect } from 'react';
import { normalizedExecutor } from '../../util/normalizedExecutor';
import './modal.css';

export const Modal = ({ command, setCommand, onClose, config, setConfig }) => {
  if (!config || config.length === 0) return null;

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

    // Verificar comandos de configuração com valores numéricos
    config.forEach((item, index) => {
      if (item.command && item.min !== undefined) {
        // Para sliders (som ambiente, som efeitos)
        if (normalizedExecutor(commandText, item.command)) {
          if (commandNumber !== null && commandNumber >= item.min && commandNumber <= item.max) {
            const newConfig = [...config];
            newConfig[index] = { ...item, value: commandNumber };
            setConfig(newConfig);
            setCommand("");
          }
        }
      } else if (item.command && item.active !== undefined) {
        // Para toggles (ativar/desativar)
        if (normalizedExecutor(command, item.command)) {
          const newConfig = [...config];
          newConfig[index] = { ...item, active: !item.active };
          setConfig(newConfig);
          setCommand("");
        }
      } else if (item.command) {
        // Para comandos simples (fechar menu)
        if (normalizedExecutor(command, item.command)) {
          onClose(false);
          setCommand("");
        }
      }
    });
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => onClose(false)}>×</button>
        
        {config.map((item, index) => (
          <div key={index} className="modal-item">
            {!item.command ? (
              <h2>{item.text}</h2>
            ) : (
              <>
                <div className="modal-item-header">
                  <h3>{item.text}</h3>
                  <p>{item.description}</p>
                </div>
                
                {item.min !== undefined ? (
                  <div className="modal-slider">
                    <input
                      type="range"
                      min={item.min}
                      max={item.max}
                      value={item.value}
                      onChange={(e) => handleSliderChange(index, e.target.value)}
                    />
                    <span>{item.value}%</span>
                  </div>
                ) : (
                  <div className="modal-toggle">
                    <label>
                      <input
                        type="checkbox"
                        checked={item.active}
                        onChange={() => handleToggle(index)}
                      />
                      {item.active ? 'Ativado' : 'Desativado'}
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
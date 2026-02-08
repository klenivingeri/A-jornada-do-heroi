import { useEffect, useRef, useState } from 'react';

const BackgroundMusic = ({ volume = 10 }) => {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(1);
  
  const tracks = [
    '/assets/background_music/1.mp3',
    '/assets/background_music/2.mp3',
    '/assets/background_music/3.mp3',
    '/assets/background_music/4.mp3'
  ];

  // Função para selecionar uma faixa aleatória diferente da atual
  const getRandomTrack = (currentIndex) => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * tracks.length);
    } while (newIndex === currentIndex && tracks.length > 1);
    return newIndex;
  };

  // Controla o volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Troca de faixa a cada 1-2 minutos (60000-120000 ms)
  useEffect(() => {
    const randomInterval = Math.random() * 60000 + 60000; // Entre 1 e 2 minutos
    
    const timer = setTimeout(() => {
      setCurrentTrack(prevTrack => getRandomTrack(prevTrack));
    }, randomInterval);

    return () => clearTimeout(timer);
  }, [currentTrack]);

  // Toca a música quando a faixa muda
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(err => {
        console.log('Erro ao reproduzir áudio:', err);
      });
    }
  }, [currentTrack]);

  return (
    <audio ref={audioRef} loop={false}>
      <source src={tracks[currentTrack]} type="audio/mpeg" />
      Seu navegador não suporta o elemento de áudio.
    </audio>
  );
};

export default BackgroundMusic;

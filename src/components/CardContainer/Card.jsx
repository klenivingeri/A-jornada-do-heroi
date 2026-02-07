import styles from './card.module.css';

export const Card = ({ title = '', value = 0, uri = '', bg = '' }) => {
  const normalizedTitle = title?.trim();
  const cardLabel = normalizedTitle ? `Carta: ${normalizedTitle}` : 'Carta vazia';
  const imageLabel = normalizedTitle
    ? `Imagem da carta ${normalizedTitle}`
    : 'Imagem da carta';

  return (
    <div
      className={styles.cardContainer}
      role="group"
      aria-label={cardLabel}
      style={{
        backgroundImage: `url('${bg}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundOrigin: 'content-box',
        backgroundClip: 'content-box',
        border: !title ? '1px solid white' : '',
        padding: !title ? '2px' : '',
      }}
    >
      {title && (
        <div className={styles.border}>
          {!!value && (
            <p className={styles.value} aria-label={`Valor ${value}`}>
              {value}
            </p>
          )}
          <div
            className={styles.bg}
            aria-hidden="true"
            style={{
              backgroundImage: `url('${bg ? bg : uri}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: bg ? 0.5 : 1,
              filter: bg ? '' : 'blur(1px) brightness(1)',
            }}
          ></div>
          <div
            className={styles.card}
            role="img"
            aria-label={imageLabel}
            style={{
              backgroundImage: `url('${uri}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <h2 className={styles.title}>{title.toUpperCase()}</h2>
          </div>
        </div>
      )}
    </div>
  );
};
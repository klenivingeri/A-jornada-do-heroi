import styles from './card.module.css';

export const CardContainer = ( {dungeonCards}) => {

  return(
    <div className={styles.cardContainer}>
      {dungeonCards.map(({ title, value, type, content }) => (
        <div className={styles.card}>
          <h2>{title}</h2>
          <p>{value}</p>
        </div>
      )) }
    </div>
  )
}
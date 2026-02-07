import styles from './card.module.css';

export const Card = ({ title, value }) => {
  return (
    <div className={styles.card}>
      <h2>{title}</h2>
      <p>{value}</p>
    </div>
  )
}
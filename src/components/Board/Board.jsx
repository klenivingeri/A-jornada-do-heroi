
import { Card } from '../CardContainer/Card';
import styles from './board.module.css';
export const Board = ({ dungeonCards }) => {

  return (
    <div className={styles.board}>
      {dungeonCards.map((card) => (
        <Card key={card.id} title={card.title} value={card.value} uri={card.uri} />
      ))}
    </div>
  )
}
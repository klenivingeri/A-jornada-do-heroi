
import { Card } from '../CardContainer/Card';
import styles from './board.module.css';
export const Board = ({ dungeonCards, setSelectCardID }) => {

  return (
    <div className={styles.board}>
      {dungeonCards.map((card, i) => (
        <Card key={i} id={card?.id} title={card?.title} value={card?.value} uri={card?.uri} setSelectCardID={setSelectCardID} />
      ))}
    </div>
  )
}

import { Card } from '../CardContainer/Card';
import styles from './board.module.css';

export const Board = ({ dungeonCards, setSelectCardID, hitID }) => {

  return (
    <div aria-hidden="true" className={styles.board}>
      {dungeonCards.map((card, i) => {
        return <Card hitID={hitID} key={i} id={card?.id} title={card?.title ? card?.title : `eslóti ${i + 1} vazio`} value={card?.value} uri={card?.uri} selectID={setSelectCardID} isUse={card?.isUse} />
      })}
    </div>
  )
}
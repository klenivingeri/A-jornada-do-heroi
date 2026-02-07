import { Card } from './Card';
import styles from './card.module.css';

export const CardContainer = ( {dungeonCards}) => {

  return(
    <div className={styles.cardContainer}>
      {dungeonCards.map(({ title, value, type, content, id }) => (
        <Card key={id} title={title} value={value} type={type} content={content} />
      )) }
    </div>
  )
}
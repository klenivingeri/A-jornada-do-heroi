import styles from './hero.module.css';
import { Card } from "../CardContainer/Card"

export const HeroContainer = () => {

  return <div className={styles.heroContainer}>
    <div className={styles.heroCard}>
    <Card title="Mão esquerda" content="This is the hero card." />
    </div>
    <div className={styles.heroCard}>
      <Card title="Mão direita" content="This is the hero card." />
      </div>
    <div className={styles.heroCard}>
      <Card title="hero" content="This is the hero card." />
      </div>
    <div className={styles.heroCard}>
      <Card title="Bag" content="This is the hero card." />
    </div>
  </div>
}
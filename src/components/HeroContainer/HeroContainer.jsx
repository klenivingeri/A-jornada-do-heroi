import styles from './hero.module.css';
import { Card } from "../CardContainer/Card"


export const HeroContainer = ({dungeonHero}) => {


  
  return <div className={styles.heroContainer}>
      <div className={styles.left}>
        <Card 
          title={dungeonHero.slot[0].title}
          value={dungeonHero.slot[0].value}
          uri={dungeonHero.slot[0].uri}
          description={dungeonHero.slot[0].description}
          bg={dungeonHero.slot[0].title ? "" : "/assets/gloves.jpg" }
        />
      </div>
      <div className={styles.hero}>
        <Card 
          title={dungeonHero.hero.title}
          value={dungeonHero.hero.value}
          uri={dungeonHero.hero.uri}
          description={dungeonHero.hero.description}
        />
        <Card
          title={dungeonHero.bag.title}
          value={dungeonHero.bag.value}
          uri={dungeonHero.bag.uri}
          description={dungeonHero.bag.description}
          bg={dungeonHero.slot[1].title ? "" : "https://i5.walmartimages.com/asr/e71952b7-afee-4c3c-9ab4-22b9a0a203d8.4aea7be1a08de97790b7b9767c930302.jpeg"}
        />
      </div>
      <div className={styles.right}>
        <Card 
          title={dungeonHero.slot[1].title}
          value={dungeonHero.slot[1].value}
          uri={dungeonHero.slot[1].uri}
          description={dungeonHero.slot[1].description}
          bg={dungeonHero.slot[1].title ? "" : "/assets/gloves.jpg" }
        />
      </div>
  </div>
}
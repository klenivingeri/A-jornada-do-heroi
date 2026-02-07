import styles from './hero.module.css';
import { Card } from "../CardContainer/Card"


export const HeroContainer = ({ dungeonHero }) => {

  return <div className={styles.heroContainer}>
    <div style={{
      color: "white",
      position: "absolute",
      backgroundColor: "red",
      right: "10px",
      top: "10px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "5px",
      borderRadius: "5px",
    }} 
    aria-label={`gold ${dungeonHero.gold}`}
    > R$: {dungeonHero.gold}</div>
    <div 
      className={styles.left}
      aria-label={dungeonHero.slot[0]?.title ? `slot 1 ${dungeonHero.slot[0].title}` : "slot 1 vazio"}
    >
      <Card
        title={dungeonHero.slot[0]?.title}
        value={dungeonHero.slot[0]?.value}
        uri={dungeonHero.slot[0]?.uri}
        description={dungeonHero.slot[0]?.description}
        bg={dungeonHero.slot[0]?.title ? "" : "/assets/gloves.jpg"}
        
      />
    </div>
    <div className={styles.hero}>
      <div aria-label={dungeonHero.hero.title}>
      <Card
        title={dungeonHero.hero?.title}
        value={dungeonHero.hero?.value}
        uri={dungeonHero.hero?.uri}
        description={dungeonHero.hero?.description}
      />
      </div>
      <div aria-label={dungeonHero.bag[0]?.title ? `bag 1 ${dungeonHero.bag[0].title}` : "bag 1 vazio"}>
        <Card
        title={dungeonHero.bag[0]?.title}
        value={dungeonHero.bag[0]?.value}
        uri={dungeonHero.bag[0]?.uri}
        description={dungeonHero.bag[0]?.description}
        bg={dungeonHero.bag[0]?.title ? "" : "https://i5.walmartimages.com/asr/e71952b7-afee-4c3c-9ab4-22b9a0a203d8.4aea7be1a08de97790b7b9767c930302.jpeg"}
      />
      </div>
    </div>
    <div
      className={styles.right} 
      aria-label={dungeonHero.slot[1]?.title ? `slot 2 ${dungeonHero.slot[1].title}` : "slot 2 vazio"}
    >
      <Card
        title={dungeonHero.slot[1]?.title}
        value={dungeonHero.slot[1]?.value}
        uri={dungeonHero.slot[1]?.uri}
        description={dungeonHero.slot[1]?.description}
        bg={dungeonHero.slot[1]?.title ? "" : "/assets/gloves.jpg"}
      />
    </div>
  </div>
}
import styles from './hero.module.css';
import { Card } from "../CardContainer/Card"


export const HeroContainer = ({ dungeonHero, setSelectHeroID }) => {

  return <div aria-hidden="true" className={styles.heroContainer}>
    <div aria-hidden="true" style={{
      display: 'flex',
      width: '100%'
    }}>
      <Card
        selectID={setSelectHeroID}
        id={dungeonHero.slot[0]?.id}
        title={dungeonHero.slot[0]?.title ? dungeonHero.slot[0]?.title : "Mão direita vazia"}
        value={dungeonHero.slot[0]?.value}
        uri={dungeonHero.slot[0]?.uri}
        description={dungeonHero.slot[0]?.description}
        bg={dungeonHero.slot[0]?.title ? "" : "/assets/gloves.jpg"}
        isUse={dungeonHero.slot[0]?.isUse}
      />
      <Card
        selectID={setSelectHeroID}
        id={dungeonHero.hero?.id}
        title={dungeonHero.hero?.title}
        value={`${dungeonHero.hero?.value}/${dungeonHero.hero.maxValue}`}
        uri={dungeonHero.hero?.uri}
        description={dungeonHero.hero?.description}
      />
      <Card
        selectID={setSelectHeroID}
        id={dungeonHero.slot[1]?.id}
        title={dungeonHero.slot[1]?.title ? dungeonHero.slot[1]?.title : "Mão esquerda vazia"}
        value={dungeonHero.slot[1]?.value}
        uri={dungeonHero.slot[1]?.uri}
        description={dungeonHero.slot[1]?.description}
        bg={dungeonHero.slot[1]?.title ? "" : "/assets/gloves.jpg"}
        isUse={dungeonHero.slot[1]?.isUse}
      />
    </div>
    <div aria-hidden="true" style={{
      display: 'flex',
      width: '100%',
      paddingTop: '26px'
    }}>
      <Card
        selectID={setSelectHeroID}
        id={dungeonHero.bag[0]?.id}
        title={dungeonHero.bag[0]?.title ? dungeonHero.bag[0]?.title : "Bolsa vazia"}
        value={dungeonHero.bag[0]?.value}
        uri={dungeonHero.bag[0]?.uri}
        description={dungeonHero.bag[0]?.description}
        bg={dungeonHero.bag[0]?.title ? "" : "https://i5.walmartimages.com/asr/e71952b7-afee-4c3c-9ab4-22b9a0a203d8.4aea7be1a08de97790b7b9767c930302.jpeg"}
        isUse={dungeonHero.bag[0]?.isUse}
      />
    </div>
  </div>
}
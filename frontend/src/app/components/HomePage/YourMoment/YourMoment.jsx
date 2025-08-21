import stylesShared from '@/app/components/HomePage/homePage.module.scss';
import styles from '@/app/components/HomePage/YourMoment/YourMoment.module.scss';

export default function YourMoment() {
  return (
    <section className={`${stylesShared.section} ${styles.sectionOverride}`}>
      YourMoment
    </section>
  );
}

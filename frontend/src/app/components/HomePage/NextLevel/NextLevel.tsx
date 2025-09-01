import { ReactElement } from 'react';
import styles from './NextLevel.module.scss';
import Image from 'next/image';

export default function NextLevel(): ReactElement {
  return (
    <div className={styles['next-level']}>
      <h2 className={styles['next-level__header']}>
        Наступний рівень на горизонті
      </h2>
      <div className={styles['next-level__inner']}>
        <div className={styles['next-level__content']}>
          <div className={styles['next-level__new-opportunities']}>
            Ми готуємо для тебе нові можливості, щоб твій шлях до професіонала
            став ще цікавішим і захоплюючим.{' '}
            <span className={styles['next-level__green-text']}>
              [НЕЗАБАРОМ:]
            </span>
          </div>
          <div className={styles['next-level__arrow']}>
            <Image
              src="/images/arrow-right.svg"
              alt="arrow"
              height={160}
              width={160}
            />
          </div>
          <div className={styles['next-level__right-block']}>
            <div className={styles['next-level__dashboard']}>
              <h3 className={styles['next-level__title']}>
                [ПЕРСОНАЛЬНИЙ ДАШБОРД]
              </h3>
              <p className={styles['next-level__text']}>
                Всі твої проєкти, досягнення та виклики — в одному місці. Керуй
                своїм прогресом, слідкуй за результатами та стеж за тим, як
                кожен крок наближає тебе до мети!
              </p>
            </div>
            <div className={styles['next-level__grow-playing']}>
              <h3 className={styles['next-level__title']}>[ЗРОСТАЙ ГРАЮЧИ]</h3>
              <p className={styles['next-level__text']}>
                Заробляй ХР, отримуй ексклюзивні бейджі та підвищуй рівень,
                виконуючи завдання. Розвивайся через досягнення та покращуй свої
                навички в процесі!
              </p>
            </div>
          </div>
        </div>
        <div className={styles['next-level__slider']}>
          <div className={styles['next-level__slider-item-1']}></div>
          <div className={styles['next-level__slider-item-2']}></div>
        </div>
      </div>
    </div>
  );
}

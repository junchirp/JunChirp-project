import styles from './page.module.scss';
import { ReactElement } from 'react';

import HomePageBanner from './components/HomePage/HomePageBanner/HomePageBanner';
import Quote from './components/HomePage/Quote/Quote';
import ThreeSteps from './components/HomePage/ThreeSteps/ThreeSteps';
import WhatWeNeed from './components/HomePage/WhatWeNeed/WhatWeNeed';
import NextLevel from './components/HomePage/NextLevel/NextLevel';
import YourMoment from './components/HomePage/YourMoment/YourMoment';

export default function Home(): ReactElement {
  return (
    <div className={styles.page}>
      <HomePageBanner />
      <Quote />
      <ThreeSteps />
      <WhatWeNeed />
      <NextLevel />
      <YourMoment />
    </div>
  );
}

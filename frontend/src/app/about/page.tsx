import { ReactElement } from 'react';
import styles from './page.module.scss';
import AboutBanner from './AboutBanner/AboutBanner';
import WhatAwaits from './WhatAwaits/WhatAwaits';
import Developers from './Developers/Developers';

export default function About(): ReactElement {
  return (
    <div className={styles.about}>
      <AboutBanner />
      <WhatAwaits />
      <Developers />
    </div>
  );
}

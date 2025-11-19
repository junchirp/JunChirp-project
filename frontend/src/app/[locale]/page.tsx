'use client';

import styles from './page.module.scss';
import { ReactElement } from 'react';
import HomeBanner from '@/app/components/HomePage/HomeBanner/HomeBanner';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import HomeSkeleton from '@/app/components/HomePage/HomeSkeleton/HomeSkeleton';
import Quote from '@/app/components/HomePage/Quote/Quote';
import CallToAction from '@/app/components/HomePage/CallToAction/CallToAction';
import NextLevel from '@/app/components/HomePage/NextLevel/NextLevel';
import ThreeSteps from '@/app/components/HomePage/ThreeSteps/ThreeSteps';
import WhatWeNeed from '@/app/components/HomePage/WhatWeNeed/WhatWeNeed';

export default function Home(): ReactElement {
  const user = useAppSelector(authSelector.selectUser);
  const loadingStatus = useAppSelector(authSelector.selectLoadingStatus);

  if (loadingStatus !== 'loaded') {
    return <HomeSkeleton />;
  }

  return (
    <>
      <div className={styles.home}>
        <HomeBanner user={user} />
        <Quote />
        <ThreeSteps />
        <WhatWeNeed user={user} />
        <NextLevel />
        <CallToAction user={user} />
      </div>
      <svg width="0" height="0">
        <clipPath id="puzzle-clip-1" clipPathUnits="objectBoundingBox">
          <path
            d="M0.0769 0 h0.8462 a0.0769 0.0796 0 0 1 0.0769 0.0796 v0.301
            a0.0769 0.0796 0 0 1 -0.0769 0.0796 h-0.293 a0.1538 0.1592 0 0 0 -0.1538 0.1592
            v0.301 a0.0769 0.0796 0 0 1 -0.0769 0.0796 h-0.322 a0.0769 0.0796 0 0 1 -0.0769
            -0.0796 v-0.841 a0.0769 0.0796 0 0 1 0.0769 -0.0796 Z"
          />
        </clipPath>
      </svg>
      <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
        <clipPath id="puzzle-clip-2" clipPathUnits="objectBoundingBox">
          <path
            d="M0.4127 0 h0.5340 a0.0528 0.0796 0 0 1 0.0528 0.0796 v0.3010
            a0.0528 0.0796 0 0 1 -0.0528 0.0796 h-0.2970 a0.1056 0.1592 0 0 0 -0.1056 0.1592
            v0.3010 a0.0528 0.0796 0 0 1 -0.0528 0.0796 h-0.4396 a0.0528 0.0796 0 0 1 -0.0528 -0.0796
            v-0.3010 a0.0528 0.0796 0 0 1 0.0528 -0.0796 h0.2013 a0.1056 0.1592 0 0 0 0.1056 -0.1592
            v-0.3010 a0.0528 0.0796 0 0 1 0.0528 -0.0796 Z"
          />
        </clipPath>
      </svg>
      <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
        <clipPath id="puzzle-clip-3" clipPathUnits="objectBoundingBox">
          <path
            d="M0.6484 0 h0.2842 a0.0674 0.0796 0 0 1 0.0674 0.0796 v0.841
            a0.0674 0.0796 0 0 1 -0.0674 0.0796 h-0.8653 a0.0674 0.0796 0 0 1 -0.0674 -0.0796
            v-0.3010 a0.0674 0.0796 0 0 1 0.0674 -0.0796 h0.3789 a0.1347 0.1592 0 0 0 0.1347 -0.1592
            v-0.3010 a0.0674 0.0796 0 0 1 0.0674 -0.0796 Z"
          />
        </clipPath>
      </svg>
    </>
  );
}

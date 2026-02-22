'use client';

import styles from './HomeClient.module.scss';
import { ReactElement, useEffect, useRef } from 'react';
import HomeBanner from './HomeBanner/HomeBanner';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import HomeSkeleton from './HomeSkeleton/HomeSkeleton';
import Quote from './Quote/Quote';
import CallToAction from './CallToAction/CallToAction';
import NextLevel from './NextLevel/NextLevel';
import ThreeSteps from './ThreeSteps/ThreeSteps';
import WhatWeNeed from './WhatWeNeed/WhatWeNeed';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';

export default function HomeClient(): ReactElement {
  const user = useAppSelector(authSelector.selectUser);
  const loadingStatus = useAppSelector(authSelector.selectLoadingStatus);
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const t = useTranslations('auth');
  const hasShownToast = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (hasShownToast.current || loadingStatus !== 'loaded') {
      return;
    }
    const authType = searchParams.get('authType');
    if (authType === 'registration') {
      hasShownToast.current = true;
      showToast({
        severity: 'success',
        summary: t('googleSuccess'),
        detail: t('googleSuccessDetails'),
        life: 3000,
        actionKey: 'google',
      });
      router.replace('/', { scroll: false });
    }
  }, [loadingStatus]);

  if (loadingStatus !== 'loaded') {
    return <HomeSkeleton />;
  }

  return (
    <>
      <div className={styles['home-client']}>
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

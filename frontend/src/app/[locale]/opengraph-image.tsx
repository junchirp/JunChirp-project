import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Locale } from '@/i18n/routing';

export const size = {
  width: 1200,
  height: 630,
};

export default async function OpengraphImage({
  params,
}: {
  params: { locale: Locale };
}): Promise<ImageResponse> {
  const t =
    params.locale === 'ua'
      ? {
          titleOne: 'Створюй',
          titleTwo: '[Майбутнє]',
          titleThree: 'разом з нами!',
          descriptionOne:
            'Розвивай свої навички, працюючи\nнад реальними проєктами разом з командою.',
          descriptionTwo: 'Приєднуйся до нас і стань частиною змін!',
        }
      : {
          titleOne: 'Build',
          titleTwo: '[the Future]',
          titleThree: 'with us!',
          descriptionOne:
            'Grow your skills by working on real projects\nwith a team.',
          descriptionTwo: 'Join us and become part of the change!',
        };

  const inter = await readFile(join(process.cwd(), 'assets/fonts/Inter.ttf'));
  const montserrat = await readFile(
    join(process.cwd(), 'assets/fonts/Montserrat.ttf'),
  );
  const bannerData = await readFile(
    join(process.cwd(), 'assets/images/empty-banner.png'),
    'base64',
  );
  const bannerSrc = `data:image/png;base64,${bannerData}`;

  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        padding: '20px 481px 0 50px',
        position: 'relative',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bannerSrc}
        alt="JunChirp"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      <div
        style={{
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 40,
          }}
        >
          <div
            style={{
              fontFamily: 'Montserrat',
              fontWeight: 600,
              fontSize: 64,
              lineHeight: 1.2,
            }}
          >
            <p>{t.titleOne}</p>
            <p
              style={{
                color: '#1C851C',
              }}
            >
              {t.titleTwo}
            </p>
            <p>{t.titleThree}</p>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 28,
              lineHeight: 1.2,
            }}
          >
            <p>{t.descriptionOne}</p>
            <p>{t.descriptionTwo}</p>
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: inter,
          style: 'normal',
          weight: 500,
        },
        {
          name: 'Montserrat',
          data: montserrat,
          style: 'normal',
          weight: 600,
        },
      ],
    },
  );
}

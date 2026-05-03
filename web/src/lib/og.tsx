/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';

export const ogImageSize = { width: 1200, height: 630 } as const;
export const ogContentType = 'image/png';

export function renderOgImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '72px',
          background:
            'linear-gradient(135deg, #c8102e 0%, #a00c24 50%, #190602 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.12) 0%, transparent 45%), radial-gradient(circle at 10% 100%, rgba(208,152,79,0.18) 0%, transparent 50%)',
          }}
        />

        {/* Logo lockup */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              background: '#190602',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              fontWeight: 900,
              color: '#c8102e',
              letterSpacing: '-0.05em',
            }}
          >
            Σ
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
            <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>ΣΠΑΘΗΣ</span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                opacity: 0.7,
              }}
            >
              Μεταφορική
            </span>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              opacity: 0.85,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              marginTop: 18,
              maxWidth: '90%',
              display: 'flex',
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 26,
                lineHeight: 1.4,
                marginTop: 22,
                opacity: 0.85,
                maxWidth: '85%',
                display: 'flex',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 32,
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            opacity: 0.85,
          }}
        >
          <span>spathismetaforiki.gr</span>
          <span>· Σκάλα Κεφαλονιάς ·</span>
        </div>
      </div>
    ),
    ogImageSize,
  );
}

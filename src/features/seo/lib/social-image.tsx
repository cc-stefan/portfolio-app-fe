import { ImageResponse } from 'next/og';

export const socialImageSize = {
  width: 1200,
  height: 630,
};

interface SocialImageOptions {
  name: string;
  role: string;
  description: string;
}

export function createSocialImage({ name, role, description }: SocialImageOptions) {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#12171b',
        color: '#f4f7f8',
        padding: '72px',
        fontFamily: 'Arial, Helvetica, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '560px',
          height: '760px',
          left: '-80px',
          top: '-160px',
          transform: 'rotate(24deg)',
          background: 'rgba(55, 202, 188, 0.13)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '760px',
          right: '-180px',
          bottom: '-320px',
          transform: 'rotate(-24deg)',
          background: 'rgba(242, 142, 65, 0.12)',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
        <div
          style={{
            width: '78px',
            height: '78px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#3cc7bb',
            color: '#071312',
            fontSize: '30px',
            fontWeight: 800,
          }}
        >
          CCS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '38px', fontWeight: 700 }}>{name}</div>
          <div
            style={{
              marginTop: '6px',
              fontSize: '22px',
              letterSpacing: '5px',
              color: '#aeb8c1',
              textTransform: 'uppercase',
            }}
          >
            {role}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          maxWidth: '980px',
          fontSize: '58px',
          lineHeight: 1.12,
          fontWeight: 700,
          letterSpacing: '-1.5px',
        }}
      >
        {description}
      </div>

      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '4px',
          background: 'linear-gradient(90deg, #3cc7bb 0%, #e8b56e 58%, #f28e41 100%)',
        }}
      />
    </div>,
    socialImageSize
  );
}

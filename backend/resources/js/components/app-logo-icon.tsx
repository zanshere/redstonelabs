import { ImgHTMLAttributes } from 'react';

interface AppLogoIconProps extends ImgHTMLAttributes<HTMLImageElement> {
  theme?: 'dark' | 'light';
}

export default function AppLogoIcon({ theme = 'dark', ...props }: AppLogoIconProps) {
  // Path ke logo berdasarkan tema
  const logoPath = theme === 'dark'
    ? '/images/RD-Dark-nobg.png'
    : '/images/RD-Light-nobg.png';

  return (
    <img
      src={logoPath}
      alt="Ryuzen-Dev Logo"
      {...props}
      style={{
        width: props.width || '50px',
        height: props.height || '50px',
        ...props.style
      }}
    />
  );
}

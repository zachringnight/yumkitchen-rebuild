'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

type Props = {
  gtmId: string;
};

export function DeferredGoogleTagManager({ gtmId }: Props) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (enabled) return;

    const enable = () => setEnabled(true);
    const options: AddEventListenerOptions = { once: true, passive: true };

    window.addEventListener('pointerdown', enable, options);
    window.addEventListener('keydown', enable, { once: true });
    window.addEventListener('scroll', enable, options);

    return () => {
      window.removeEventListener('pointerdown', enable);
      window.removeEventListener('keydown', enable);
      window.removeEventListener('scroll', enable);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <Script id="gtm" strategy="afterInteractive">
      {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `}
    </Script>
  );
}

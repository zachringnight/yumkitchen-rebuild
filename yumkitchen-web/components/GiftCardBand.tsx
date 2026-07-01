import { giftCardBalanceUrl, giftCardBuyUrl } from '@/lib/site';

type GiftCardBandProps = {
  source: string;
  compact?: boolean;
  tone?: 'blue' | 'white';
};

export function GiftCardBand({ source, compact = false, tone = 'blue' }: GiftCardBandProps) {
  return (
    <section className={`${tone === 'white' ? 'bg-white' : 'bg-blue-tint'} ${compact ? 'py-10' : 'py-section'}`}>
      <div className="container-content grid items-center gap-6 md:grid-cols-[1.2fr_auto]">
        <div>
          <p className="section-label">gift cards</p>
          <h2 className="text-h2 lowercase">share the love</h2>
          <p className="mt-3 max-w-2xl text-xl leading-9 text-ink">
            Give the gift of made from scratch. Buy a yum! gift card online, or check a balance any time.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={giftCardBuyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            data-event="click_gift_card_buy"
            data-source={source}
          >
            Buy Gift Cards
          </a>
          <a
            href={giftCardBalanceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            data-event="click_gift_card_balance"
            data-source={source}
          >
            Check Balance
          </a>
        </div>
      </div>
    </section>
  );
}

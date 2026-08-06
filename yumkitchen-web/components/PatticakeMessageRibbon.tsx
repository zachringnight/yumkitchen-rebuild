import { MotionPauseButton } from './MotionPauseButton';

const messages = ['happy birthday', 'thank you', 'just married', 'love you', 'go team', 'miss you', 'just because'] as const;

type PatticakeMessageRibbonProps = {
  tone?: 'cream' | 'blue';
};

export function PatticakeMessageRibbon({ tone = 'cream' }: PatticakeMessageRibbonProps) {
  const renderSet = (hidden: boolean) => (
    <div className="patticake-message-ribbon-set" aria-hidden={hidden || undefined}>
      {messages.map((message) => (
        <span key={message}>{message}</span>
      ))}
    </div>
  );

  return (
    <section className={`patticake-message-ribbon patticake-message-ribbon-${tone}`} aria-label="Patticake message ideas">
      <div className="patticake-message-ribbon-viewport">
        <div className="patticake-message-ribbon-track">
          {renderSet(false)}
          {renderSet(true)}
        </div>
      </div>
      {/* The ribbon scrolls for 28s on a loop and auto-starts. CSS gives it a
          hover pause, which does nothing for a keyboard or touch visitor, so
          this is the reachable control (WCAG 2.2.2). It writes the same
          document-level flag every other motion surface already honors. */}
      <MotionPauseButton className="patticake-ribbon-pause" />
    </section>
  );
}

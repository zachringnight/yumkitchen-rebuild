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
      <div className="patticake-message-ribbon-track">
        {renderSet(false)}
        {renderSet(true)}
      </div>
    </section>
  );
}

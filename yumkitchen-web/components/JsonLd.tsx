type JsonLdProps = {
  data: unknown | unknown[];
};

export function JsonLd({ data }: JsonLdProps) {
  const entries = Array.isArray(data) ? data : [data];

  return entries.map((entry, index) => (
    <script
      key={index}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(entry).replace(/</g, '\\u003c') }}
    />
  ));
}

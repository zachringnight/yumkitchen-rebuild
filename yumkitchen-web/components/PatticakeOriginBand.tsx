import Image from 'next/image';

export function PatticakeOriginBand() {
  return (
    <section className="bg-white px-6 py-section">
      <div className="mx-auto grid max-w-[1240px] gap-10 border-y border-ink/15 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="section-label">made by yum! Kitchen and Bakery</p>
          <h2 className="text-h2 lowercase">the restaurant behind patticake</h2>
          <p className="mt-5 max-w-2xl text-xl leading-9 text-body">
            Named for founder Patti Soskin, Patticake started inside yum! Kitchen and Bakery — the Twin Cities restaurant family known for scratch food, bakery cases, catering, and four neighborhood restaurants.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="/yum-kitchen" className="btn-primary">
              Visit yum! Kitchen and Bakery
            </a>
            <a href="/yum-kitchen#locations" className="btn-secondary">
              Find a Restaurant
            </a>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
          <div className="relative aspect-[4/3] overflow-hidden bg-blue-soft">
            <Image
              src="/images/yum-patti-kelli.jpeg"
              alt="Patti and Kelli at yum! Kitchen and Bakery"
              fill
              sizes="(min-width: 1024px) 36vw, 100vw"
              className="object-cover crop-people-upper"
            />
          </div>
          <div className="grid gap-4">
            <div className="relative min-h-[150px] overflow-hidden bg-blue-soft">
              <Image
                src="/images/yum-location-slp.jpg"
                alt="yum! Kitchen and Bakery St. Louis Park"
                fill
                sizes="(min-width: 1024px) 22vw, 100vw"
                className="object-cover crop-location-front"
              />
            </div>
            <div className="bg-cream p-5">
              <p className="font-serif text-3xl font-normal lowercase leading-tight text-ink">4 restaurants</p>
              <p className="mt-2 text-base leading-7 text-body">open daily 8am to 8pm in the Twin Cities.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import {useEffect, useMemo, useRef, useState} from 'react';
import styles from './AssetGallery.module.css';

export type ReviewAsset = {
  id: string;
  title: string;
  filename: string;
  label: string;
  collection: string;
  filter: 'vertical' | 'feed' | 'square' | 'wide' | 'stories' | 'brand' | 'carousel';
  format: string;
  brand: 'yum!' | 'Patticake';
  kind: 'motion' | 'static';
  duration: number | null;
  width: number;
  height: number;
  media: string;
  poster: string;
};

type ReviewStatus = 'keep' | 'revise';
type StatusFilter = 'all' | 'keep' | 'revise' | 'unreviewed';

const assetFilters = [
  {id: 'all', label: 'All formats'},
  {id: 'vertical', label: 'Vertical'},
  {id: 'feed', label: 'Feed'},
  {id: 'square', label: 'Square'},
  {id: 'wide', label: 'Wide'},
  {id: 'stories', label: 'Motion stories'},
  {id: 'carousel', label: 'Carousel cards'},
  {id: 'brand', label: 'Brand motion'},
] as const;

const mediaFilters = [
  {id: 'all', label: 'All assets'},
  {id: 'motion', label: 'Motion'},
  {id: 'static', label: 'Static'},
] as const;

const brandFilters = [
  {id: 'all', label: 'Both brands'},
  {id: 'Patticake', label: 'Patticake'},
  {id: 'yum!', label: 'yum!'},
] as const;

const statusFilters: {id: StatusFilter; label: string}[] = [
  {id: 'all', label: 'Any status'},
  {id: 'unreviewed', label: 'Unreviewed'},
  {id: 'keep', label: 'Keep'},
  {id: 'revise', label: 'Revise'},
];

const storageKey = 'yum-creative-review-status-v1';

function PlayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="13" fill="currentColor" />
      <path d="m11.5 9.5 8 4.5-8 4.5v-9Z" fill="white" />
    </svg>
  );
}

function ArrowIcon({direction}: {direction: 'left' | 'right'}) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={direction === 'left' ? styles.arrowLeft : undefined}>
      <path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AssetGalleryClient({assets}: {assets: ReviewAsset[]}) {
  const [assetFilter, setAssetFilter] = useState<(typeof assetFilters)[number]['id']>('all');
  const [mediaFilter, setMediaFilter] = useState<(typeof mediaFilters)[number]['id']>('all');
  const [brandFilter, setBrandFilter] = useState<(typeof brandFilters)[number]['id']>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [statuses, setStatuses] = useState<Record<string, ReviewStatus>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.dataset.assetGallery = 'true';
    let savedStatuses: Record<string, ReviewStatus> | null = null;
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) savedStatuses = JSON.parse(saved);
    } catch {
      savedStatuses = null;
    }
    const loadSavedStatuses = window.requestAnimationFrame(() => {
      if (savedStatuses) setStatuses(savedStatuses);
    });
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setMotionAllowed(!preference.matches);
    syncMotion();
    preference.addEventListener('change', syncMotion);
    return () => {
      delete document.body.dataset.assetGallery;
      window.cancelAnimationFrame(loadSavedStatuses);
      preference.removeEventListener('change', syncMotion);
    };
  }, []);

  const visibleAssets = useMemo(
    () =>
      assets.filter((asset) => {
        const matchesAsset = assetFilter === 'all' || asset.filter === assetFilter;
        const matchesMedia = mediaFilter === 'all' || asset.kind === mediaFilter;
        const matchesBrand = brandFilter === 'all' || asset.brand === brandFilter;
        const status = statuses[asset.id];
        const matchesStatus =
          statusFilter === 'all' ||
          status === statusFilter ||
          (statusFilter === 'unreviewed' && !status);
        return matchesAsset && matchesMedia && matchesBrand && matchesStatus;
      }),
    [assetFilter, assets, brandFilter, mediaFilter, statusFilter, statuses],
  );

  const selectedIndex = selectedId ? assets.findIndex((asset) => asset.id === selectedId) : -1;
  const selectedAsset = selectedIndex >= 0 ? assets[selectedIndex] : null;
  const featuredAsset = assets[0];
  const keepCount = Object.values(statuses).filter((status) => status === 'keep').length;
  const reviseCount = Object.values(statuses).filter((status) => status === 'revise').length;

  useEffect(() => {
    if (!selectedAsset) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedId(null);
      if (event.key === 'ArrowRight') setSelectedId(assets[(selectedIndex + 1) % assets.length].id);
      if (event.key === 'ArrowLeft') setSelectedId(assets[(selectedIndex - 1 + assets.length) % assets.length].id);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [assets, selectedAsset, selectedIndex]);

  function updateStatus(id: string, status: ReviewStatus) {
    setStatuses((current) => {
      const next = current[id] === status ? Object.fromEntries(Object.entries(current).filter(([key]) => key !== id)) : {...current, [id]: status};
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Review still works for this session if local storage is unavailable.
      }
      return next;
    });
  }

  function previewVideo(event: React.MouseEvent<HTMLVideoElement> | React.FocusEvent<HTMLVideoElement>, play: boolean) {
    const video = event.currentTarget;
    if (!motionAllowed) return;
    if (play) void video.play().catch(() => undefined);
    else {
      video.pause();
      video.currentTime = 0;
    }
  }

  if (!featuredAsset) return null;

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="asset-gallery-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>creative launch room / july 2026</p>
          <h1 id="asset-gallery-title">launch assets, ready for review.</h1>
          <p className={styles.intro}>Play the work. Keep what lands. Flag what needs another pass.</p>
          <button type="button" className={styles.primaryAction} onClick={() => setSelectedId(featuredAsset.id)}>
            Start with the first asset
            <ArrowIcon direction="right" />
          </button>
          <div className={styles.heroStats} aria-label="Gallery summary">
            <span><strong>{assets.length}</strong> playable previews</span>
            <span><strong>{keepCount}</strong> marked keep</span>
            <span><strong>{reviseCount}</strong> marked revise</span>
          </div>
        </div>
        <button type="button" className={styles.heroPlayer} onClick={() => setSelectedId(featuredAsset.id)} aria-label={`Review ${featuredAsset.title}`}>
          <video
            src={featuredAsset.media}
            poster={featuredAsset.poster}
            muted
            loop
            playsInline
            autoPlay={motionAllowed}
            preload="metadata"
          />
          <span className={styles.heroPlay}><PlayIcon />review motion</span>
        </button>
      </section>

      <section className={styles.reviewControls} aria-labelledby="review-assets-heading">
        <div className={styles.ribbon} aria-hidden="true">
          <span className={styles.ribbonLine} />
          <span className={styles.ribbonLogo}><Image src="/logo.png" alt="" width={42} height={42} /></span>
        </div>
        <div className={styles.controlHeader}>
          <div>
            <p className={styles.eyebrow}>review set</p>
            <h2 id="review-assets-heading">choose a format, then choose a side.</h2>
          </div>
          <p>Keep and Revise choices stay saved in this browser.</p>
        </div>
          <div className={styles.filterRows}>
          <div className={styles.filterGroup} role="group" aria-label="Filter by media type">
            {mediaFilters.map((filter) => (
              <button key={filter.id} type="button" aria-pressed={mediaFilter === filter.id} className={mediaFilter === filter.id ? styles.filterActive : undefined} onClick={() => setMediaFilter(filter.id)}>
                {filter.label}
              </button>
            ))}
          </div>
          <div className={styles.filterGroup} role="group" aria-label="Filter by brand">
            {brandFilters.map((filter) => (
              <button key={filter.id} type="button" aria-pressed={brandFilter === filter.id} className={brandFilter === filter.id ? styles.filterActive : undefined} onClick={() => setBrandFilter(filter.id)}>
                {filter.label}
              </button>
            ))}
          </div>
          <div className={styles.filterGroup} role="group" aria-label="Filter by asset format">
            {assetFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                aria-pressed={assetFilter === filter.id}
                className={assetFilter === filter.id ? styles.filterActive : undefined}
                onClick={() => setAssetFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className={styles.statusGroup} role="group" aria-label="Filter by review status">
            {statusFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                aria-pressed={statusFilter === filter.id}
                className={statusFilter === filter.id ? styles.statusActive : undefined}
                onClick={() => setStatusFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        <p className={styles.resultCount} aria-live="polite">Showing {visibleAssets.length} of {assets.length} assets</p>
      </section>

      <section className={styles.assetGrid} aria-label="Motion asset gallery">
        {visibleAssets.map((asset) => {
          const status = statuses[asset.id];
          return (
            <article key={asset.id} className={styles.assetCard}>
              <button type="button" className={styles.mediaButton} onClick={() => setSelectedId(asset.id)} aria-label={`Review ${asset.title}`}>
                {asset.kind === 'motion' ? (
                  <video
                    src={asset.media}
                    poster={asset.poster}
                    muted
                    loop
                    playsInline
                    preload="none"
                    style={{aspectRatio: `${asset.width} / ${asset.height}`}}
                    onMouseEnter={(event) => previewVideo(event, true)}
                    onMouseLeave={(event) => previewVideo(event, false)}
                    onFocus={(event) => previewVideo(event, true)}
                    onBlur={(event) => previewVideo(event, false)}
                  />
                ) : (
                  <Image src={asset.media} alt="" width={asset.width} height={asset.height} sizes="(max-width: 560px) 50vw, 240px" />
                )}
                {asset.kind === 'motion' && <span className={styles.playBadge}><PlayIcon /></span>}
                {status && <span className={`${styles.statusBadge} ${status === 'keep' ? styles.keepBadge : styles.reviseBadge}`}>{status}</span>}
              </button>
              <div className={styles.cardBody}>
                <p className={styles.cardMeta}>{asset.brand} / {asset.collection} / {asset.format}</p>
                <h3>{asset.title}</h3>
                <div className={styles.cardFooter}>
                  <span>{asset.duration === null ? 'static' : `${asset.duration}s`}</span>
                  <div className={styles.quickReview} role="group" aria-label={`Review status for ${asset.title}`}>
                    <button type="button" aria-pressed={status === 'keep'} onClick={() => updateStatus(asset.id, 'keep')}>Keep</button>
                    <button type="button" aria-pressed={status === 'revise'} onClick={() => updateStatus(asset.id, 'revise')}>Revise</button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {visibleAssets.length === 0 && (
        <section className={styles.emptyState}>
          <p>No assets match these filters.</p>
          <button type="button" onClick={() => { setAssetFilter('all'); setMediaFilter('all'); setBrandFilter('all'); setStatusFilter('all'); }}>Show all assets</button>
        </section>
      )}

      {selectedAsset && (
        <div className={styles.dialogBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedId(null); }}>
          <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="review-dialog-title">
            <header className={styles.dialogHeader}>
              <div>
                <p>{selectedAsset.brand} / {selectedAsset.collection} / {selectedAsset.format}</p>
                <h2 id="review-dialog-title">{selectedAsset.title}</h2>
              </div>
              <button ref={closeButtonRef} type="button" className={styles.closeButton} onClick={() => setSelectedId(null)} aria-label="Close asset review">Close</button>
            </header>
            <div className={styles.dialogBody}>
              <div className={styles.dialogPlayer}>
                {selectedAsset.kind === 'motion' ? (
                  <video key={selectedAsset.id} src={selectedAsset.media} poster={selectedAsset.poster} controls autoPlay={motionAllowed} muted loop playsInline />
                ) : (
                  <Image key={selectedAsset.id} src={selectedAsset.media} alt="" width={selectedAsset.width} height={selectedAsset.height} sizes="(max-width: 900px) 100vw, 760px" />
                )}
              </div>
              <aside className={styles.dialogReview}>
                <p className={styles.eyebrow}>review decision</p>
                <div className={styles.decisionButtons}>
                  <button type="button" aria-pressed={statuses[selectedAsset.id] === 'keep'} onClick={() => updateStatus(selectedAsset.id, 'keep')}>Keep this</button>
                  <button type="button" aria-pressed={statuses[selectedAsset.id] === 'revise'} onClick={() => updateStatus(selectedAsset.id, 'revise')}>Needs revision</button>
                </div>
                <dl>
                  <div><dt>Format</dt><dd>{selectedAsset.format}</dd></div>
                  {selectedAsset.duration !== null && <div><dt>Duration</dt><dd>{selectedAsset.duration} seconds</dd></div>}
                  <div><dt>Review size</dt><dd>{selectedAsset.width} × {selectedAsset.height}</dd></div>
                  <div><dt>File</dt><dd>{selectedAsset.filename}</dd></div>
                </dl>
                <a href={selectedAsset.media} download className={styles.downloadLink}>Download review {selectedAsset.kind === 'motion' ? 'MP4' : 'JPG'}</a>
              </aside>
            </div>
            <footer className={styles.dialogNav}>
              <button type="button" onClick={() => setSelectedId(assets[(selectedIndex - 1 + assets.length) % assets.length].id)}><ArrowIcon direction="left" />Previous</button>
              <span>{selectedIndex + 1} / {assets.length}</span>
              <button type="button" onClick={() => setSelectedId(assets[(selectedIndex + 1) % assets.length].id)}>Next<ArrowIcon direction="right" /></button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}

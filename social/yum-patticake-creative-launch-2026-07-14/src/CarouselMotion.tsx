import {loadFont as loadArchivoNarrow} from "@remotion/google-fonts/ArchivoNarrow";
import {loadFont as loadTrocchi} from "@remotion/google-fonts/Trocchi";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type {CarouselCardSpec} from "./CarouselCard";

const {fontFamily: serif} = loadTrocchi("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

const {fontFamily: sans} = loadArchivoNarrow("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

const palette = {
  red: "#dc3439",
  redDeep: "#8f1c24",
  blue: "#cae4fd",
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export type CarouselMotionProps = {
  setId: string;
  format: "reel" | "feed";
  cards: CarouselCardSpec[];
};

const makeSceneBoundaries = (cardCount: number, durationInFrames: number) => {
  const weights = Array.from({length: cardCount}, (_, index) => index === cardCount - 1 ? 1.65 : 1);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let cursor = 0;
  return [0, ...weights.map((weight, index) => {
    cursor += weight;
    return index === weights.length - 1 ? durationInFrames : Math.round((cursor / total) * durationInFrames);
  })];
};

const PackagingRibbon = ({height}: {height: number}) => (
  <div
    style={{
      height,
      backgroundColor: palette.red,
      color: palette.blue,
      display: "flex",
      alignItems: "center",
      gap: height * 0.82,
      overflow: "hidden",
      whiteSpace: "nowrap",
      fontFamily: serif,
      fontSize: height * 0.66,
      lineHeight: 1,
    }}
  >
    {Array.from({length: 22}, (_, index) => (
      <span key={index}>yum!</span>
    ))}
  </div>
);

const MotionPhoto = ({
  card,
  localFrame,
  sceneFrames,
  setId,
  index,
}: {
  card: CarouselCardSpec;
  localFrame: number;
  sceneFrames: number;
  setId: CarouselMotionProps["setId"];
  index: number;
}) => {
  const direction = index % 2 === 0 ? -1 : 1;
  const xTravel = setId === "pick-your-kitchen" ? 28 * direction : setId === "feed-the-room" ? 14 * direction : 8 * direction;
  const yTravel = setId === "send-cake" ? 18 * direction : 0;

  return (
    <AbsoluteFill>
      <Img
        src={staticFile(`images/${card.image}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: card.objectPosition ?? "50% 50%",
          scale: interpolate(localFrame, [0, Math.max(1, sceneFrames)], [1.025, 1.075], clamp),
          translate: `${interpolate(localFrame, [0, Math.max(1, sceneFrames)], [xTravel, -xTravel * 0.25], clamp)}px ${interpolate(localFrame, [0, Math.max(1, sceneFrames)], [yTravel, -yTravel * 0.2], clamp)}px`,
        }}
      />
    </AbsoluteFill>
  );
};

export const CarouselMotion = ({setId, format, cards}: CarouselMotionProps) => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();
  const isFeed = format === "feed";
  const boundaries = makeSceneBoundaries(cards.length, durationInFrames);
  const activeIndex = Math.min(cards.length - 1, boundaries.findIndex((end, index) => index > 0 && frame < end) - 1);
  const sceneIndex = activeIndex < 0 ? cards.length - 1 : activeIndex;
  const sceneStart = boundaries[sceneIndex];
  const sceneEnd = boundaries[sceneIndex + 1] ?? durationInFrames;
  const sceneFrames = Math.max(1, sceneEnd - sceneStart);
  const localFrame = frame - sceneStart;
  const current = cards[sceneIndex];
  const previous = sceneIndex > 0 ? cards[sceneIndex - 1] : current;
  const transitionFrames = Math.min(9, Math.floor(sceneFrames * 0.24));
  const imageIn = sceneIndex === 0 ? 1 : interpolate(localFrame, [0, transitionFrames], [0, 1], {...clamp, easing: ease});
  const copyIn = interpolate(localFrame, [2, Math.max(10, transitionFrames + 6)], [0, 1], {...clamp, easing: ease});
  const isFinal = current.role === "cta";
  const panelHeight = isFeed ? 410 : 590;
  const safeX = isFeed ? 66 : 82;
  const ribbonHeight = isFeed ? 21 : 25;
  const headlineSize = isFeed
    ? current.headline.length > 27
      ? 70
      : 86
    : current.headline.length > 27
      ? 90
      : 108;
  const progress = frame / Math.max(1, durationInFrames - 1);
  const badgeSize = isFeed ? 52 : 62;

  return (
    <AbsoluteFill style={{backgroundColor: palette.blue, overflow: "hidden"}}>
      {sceneIndex > 0 ? (
        <div style={{position: "absolute", inset: 0, opacity: 1 - imageIn}}>
          <MotionPhoto card={previous} localFrame={Math.max(0, localFrame)} sceneFrames={sceneFrames} setId={setId} index={sceneIndex - 1} />
        </div>
      ) : null}
      <div style={{position: "absolute", inset: 0, opacity: imageIn}}>
        <MotionPhoto card={current} localFrame={localFrame} sceneFrames={sceneFrames} setId={setId} index={sceneIndex} />
      </div>

      <AbsoluteFill style={{backgroundColor: "rgba(45,45,45,0.07)"}} />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: panelHeight,
          backgroundColor: palette.blue,
          boxSizing: "border-box",
          padding: isFeed ? "52px 66px 112px" : "62px 82px 128px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{position: "absolute", left: 0, right: 0, top: 0}}>
          <PackagingRibbon height={ribbonHeight} />
        </div>

        <div
          style={{
            opacity: copyIn,
            translate: `0px ${interpolate(copyIn, [0, 1], [28, 0])}px`,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div
            style={{
              fontFamily: sans,
              fontSize: isFeed ? 23 : 27,
              lineHeight: 1,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.9,
              color: palette.redDeep,
            }}
          >
            {current.lane}
          </div>

          <div
            style={{
              fontFamily: serif,
              fontSize: headlineSize,
              lineHeight: 0.92,
              letterSpacing: -2,
              color: palette.red,
              marginTop: isFeed ? 12 : 14,
              maxWidth: isFeed ? 930 : 900,
            }}
          >
            {current.headline}
          </div>

          {(current.role === "cover" || isFinal) ? (
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: isFinal ? "space-between" : "flex-start",
                gap: 30,
                marginTop: "auto",
              }}
            >
              <div
                style={{
                  maxWidth: isFinal ? (isFeed ? 610 : 660) : 820,
                  fontFamily: sans,
                  fontSize: isFeed ? 33 : 41,
                  lineHeight: 1.03,
                  color: palette.redDeep,
                }}
              >
                {current.support}
              </div>
              {isFinal && current.cta ? (
                <div
                  style={{
                    flexShrink: 0,
                    fontFamily: sans,
                    fontSize: isFeed ? 30 : 35,
                    lineHeight: 1,
                    fontWeight: 700,
                    color: palette.redDeep,
                    borderBottom: `5px solid ${palette.red}`,
                    paddingBottom: 7,
                  }}
                >
                  {current.cta} →
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: safeX,
          right: safeX,
          bottom: isFeed ? 28 : 38,
          height: badgeSize,
        }}
      >
        <div style={{position: "absolute", left: 0, right: 0, top: Math.round(badgeSize / 2) - 3, height: 6, backgroundColor: palette.red}} />
        <div
          style={{
            position: "absolute",
            left: `${progress * 100}%`,
            top: 0,
            width: badgeSize,
            height: badgeSize,
            borderRadius: "50%",
            backgroundColor: palette.blue,
            padding: 5,
            boxSizing: "border-box",
            translate: `-${badgeSize / 2}px 0px`,
            scale: isFinal ? interpolate(localFrame, [0, Math.min(20, sceneFrames - 1)], [0.92, 1.12], {...clamp, easing: ease}) : 1,
          }}
        >
          <Img src={staticFile("logo.png")} style={{width: "100%", height: "100%"}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

import {loadFont as loadArchivoNarrow} from "@remotion/google-fonts/ArchivoNarrow";
import {loadFont as loadTrocchi} from "@remotion/google-fonts/Trocchi";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

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

export type CreativeSpec = {
  id: string;
  brand: "yum" | "patticake";
  treatment?: "conversion" | "human";
  lane: string;
  hook: string;
  support: string;
  proof: string;
  cta: string;
  destination: string;
  beats: string[];
  images: string[];
  imagePositions?: string[];
};

export type CreativeLaunchProps = CreativeSpec & {
  mode: "motion" | "still";
  stillScene: number;
};

const motionEase = Easing.bezier(0.16, 1, 0.3, 1);

const PackagingRibbon = ({height = 24}: {height?: number}) => (
  <div
    style={{
      height,
      backgroundColor: palette.red,
      color: palette.blue,
      display: "flex",
      alignItems: "center",
      gap: height * 0.8,
      overflow: "hidden",
      whiteSpace: "nowrap",
      fontFamily: serif,
      fontSize: Math.round(height * 0.68),
      lineHeight: 1,
    }}
  >
    {Array.from({length: 18}, (_, index) => (
      <span key={index}>yum!</span>
    ))}
  </div>
);

const PhotoScene = ({image, imagePosition, index, sceneFrames, isStill, hold}: {image: string; imagePosition?: string; index: number; sceneFrames: number; isStill?: boolean; hold?: boolean}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fadeIn = isStill || index === 0 ? 1 : interpolate(frame, [0, 0.42 * fps], [0, 1], {
    easing: motionEase,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = hold ? 1 : interpolate(frame, [sceneFrames, sceneFrames + 0.45 * fps], [1, 0], {
    easing: motionEase,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{opacity: Math.min(fadeIn, fadeOut)}}>
      <Img
        src={staticFile(`images/${image}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: imagePosition ?? "center center",
          scale: interpolate(frame, [0, sceneFrames + 0.45 * fps], [1.03, 1.095], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: `${interpolate(frame, [0, sceneFrames + 0.45 * fps], [index % 2 === 0 ? -16 : 16, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}px 0px`,
        }}
      />
    </AbsoluteFill>
  );
};

export const CreativeLaunch = (props: CreativeLaunchProps) => {
  const frame = useCurrentFrame();
  const {fps, width, height, durationInFrames} = useVideoConfig();
  const isStill = props.mode === "still";
  const isWide = width / height > 1.45;
  const isSquare = width === height;
  const isFeed = height / width > 1.15 && height / width < 1.45;
  const isHuman = props.treatment === "human";
  const sceneCount = props.images.length;
  const isShortsCut = !isStill && durationInFrames > 8.5 * fps;
  const panelStart = isShortsCut ? 7.15 : 4.85;
  const detailStart = isShortsCut ? 7.55 : 5.35;
  const ctaStart = isShortsCut ? 8.15 : 6.0;
  const cueEnd = isShortsCut ? 7.2 : 4.9;
  const sceneFrames = isShortsCut
    ? Math.floor((panelStart * fps) / sceneCount)
    : Math.floor(durationInFrames / sceneCount);
  const sceneIndex = isStill ? Math.min(props.stillScene, sceneCount - 1) : Math.min(sceneCount - 1, Math.floor(frame / sceneFrames));
  const progress = isStill ? 0.82 : frame / Math.max(1, durationInFrames - 1);
  const panelIn = isStill ? 1 : interpolate(frame, [panelStart * fps, (panelStart + 0.65) * fps], [0, 1], {
    easing: motionEase,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const detailIn = isStill ? 1 : interpolate(frame, [detailStart * fps, (detailStart + 0.6) * fps], [0, 1], {
    easing: motionEase,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaIn = isStill ? 1 : interpolate(frame, [ctaStart * fps, (ctaStart + 0.55) * fps], [0, 1], {
    easing: motionEase,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cueOut = isStill ? 0 : interpolate(frame, [(cueEnd - 0.45) * fps, cueEnd * fps], [1, 0], {
    easing: motionEase,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const safeX = isWide ? 58 : isSquare ? 66 : 82;
  const panelWidth = isWide ? Math.round(width * 0.46) : width;
  const panelHeight = isWide ? height : isHuman ? (isSquare ? 380 : isFeed ? 440 : 580) : isSquare ? 430 : isFeed ? 500 : 650;
  const hookSize = isWide ? 72 : isSquare ? 88 : isFeed ? 96 : isHuman ? 98 : 122;
  const supportSize = isWide ? 30 : isSquare ? 34 : isFeed ? 38 : isHuman ? 38 : 46;

  return (
    <AbsoluteFill style={{backgroundColor: palette.blue, overflow: "hidden"}}>
      {isStill ? (
        <PhotoScene image={props.images[sceneIndex]} imagePosition={props.imagePositions?.[sceneIndex]} index={sceneIndex} sceneFrames={sceneFrames} isStill />
      ) : (
        props.images.map((image, index) => (
          <Sequence
            key={image}
            from={index * sceneFrames}
            durationInFrames={isShortsCut && index === sceneCount - 1 ? durationInFrames - index * sceneFrames : sceneFrames + Math.round(0.45 * fps)}
            premountFor={fps}
          >
            <PhotoScene image={image} imagePosition={props.imagePositions?.[index]} index={index} sceneFrames={sceneFrames} hold={isShortsCut && index === sceneCount - 1} />
          </Sequence>
        ))
      )}

      <AbsoluteFill style={{backgroundColor: "rgba(45,45,45,0.08)"}} />

      {!isStill && (
        <div
          style={{
            position: "absolute",
            left: safeX,
            bottom: isWide ? 54 : 216,
            maxWidth: isWide ? Math.round(width * 0.38) : width - safeX * 2,
            color: palette.redDeep,
            backgroundColor: palette.blue,
            fontFamily: sans,
            fontSize: isWide ? 38 : 56,
            lineHeight: 0.98,
            fontWeight: 700,
            padding: isWide ? "14px 18px 16px" : "18px 22px 20px",
            borderLeft: `${isWide ? 7 : 9}px solid ${palette.red}`,
            opacity: cueOut * interpolate(frame % sceneFrames, [0, 0.28 * fps], [0, 1], {
              easing: motionEase,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: `${interpolate(frame % sceneFrames, [0, 0.28 * fps], [24, 0], {
              easing: motionEase,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}px 0px`,
          }}
        >
          {props.beats[sceneIndex]}
        </div>
      )}

      <div
        style={{
          position: "absolute",
          right: 0,
          left: isWide ? undefined : 0,
          bottom: 0,
          width: panelWidth,
          height: panelHeight,
          boxSizing: "border-box",
          backgroundColor: palette.blue,
          borderTop: undefined,
          borderLeft: isWide ? `10px solid ${palette.red}` : undefined,
          padding: isWide ? "58px 52px 46px" : isSquare ? "30px 66px 36px" : isFeed ? "34px 72px 42px" : "42px 82px 100px",
          display: "flex",
          flexDirection: "column",
          justifyContent: isWide ? "center" : "flex-start",
          opacity: panelIn,
          translate: isWide
            ? `${interpolate(panelIn, [0, 1], [80, 0])}px 0px`
            : `0px ${interpolate(panelIn, [0, 1], [96, 0])}px`,
        }}
      >
        <div style={{position: "absolute", left: 0, right: 0, top: 0}}>
          <PackagingRibbon height={isWide ? 20 : isSquare ? 20 : 24} />
        </div>
        <div style={{fontFamily: sans, fontSize: isWide ? 20 : isSquare ? 22 : 26, fontWeight: 700, color: palette.redDeep, textTransform: "uppercase", letterSpacing: 1.8}}>
          {props.lane}
        </div>
        <div style={{fontFamily: serif, fontSize: hookSize, lineHeight: 0.94, color: palette.red, marginTop: isWide ? 12 : 10, maxWidth: isWide ? "100%" : 900}}>
          {props.hook}
        </div>
        <div style={{fontFamily: sans, fontSize: supportSize, lineHeight: 1.08, color: palette.redDeep, marginTop: isWide ? 18 : 20, opacity: detailIn}}>
          {props.support}
        </div>
        <div style={{display: "flex", alignItems: "flex-end", justifyContent: isHuman ? "flex-end" : "space-between", gap: 28, marginTop: "auto", opacity: ctaIn}}>
          {!isHuman && (
            <div style={{fontFamily: sans, fontSize: isWide ? 22 : isSquare ? 24 : 28, fontWeight: 700, color: palette.redDeep}}>
              {props.proof}
            </div>
          )}
          <div
            style={{
              flexShrink: 0,
              color: palette.redDeep,
              fontFamily: sans,
              fontSize: isWide ? 26 : isSquare ? 29 : 34,
              fontWeight: 700,
              borderBottom: `4px solid ${palette.red}`,
              paddingBottom: 4,
            }}
          >
            {props.cta} →
          </div>
        </div>
      </div>

      {!isStill && (
        <div style={{position: "absolute", left: safeX, right: safeX, bottom: 38, height: 58}}>
          <div style={{position: "absolute", left: 0, right: 0, top: 19}}>
            <PackagingRibbon height={18} />
          </div>
          <div
            style={{
              position: "absolute",
              left: `${progress * 100}%`,
              top: 0,
              width: 56,
              height: 56,
              backgroundColor: palette.blue,
              borderRadius: "50%",
              padding: 4,
              boxSizing: "border-box",
              transform: "translateX(-28px)",
            }}
          >
            <Img src={staticFile("logo.png")} style={{width: "100%", height: "100%"}} />
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

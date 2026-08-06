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

const PhotoScene = ({image, imagePosition, index, sceneFrames, photoRight, photoBottom, isStill, hold}: {image: string; imagePosition?: string; index: number; sceneFrames: number; photoRight: number; photoBottom: number; isStill?: boolean; hold?: boolean}) => {
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
    <AbsoluteFill
      style={{
        right: photoRight,
        bottom: photoBottom,
        width: "auto",
        height: "auto",
        overflow: "hidden",
        opacity: Math.min(fadeIn, fadeOut),
      }}
    >
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
  const detailStart = isShortsCut ? 7.35 : 5.15;
  const ctaStart = isShortsCut ? 7.45 : 5.45;
  // Both cuts divide the pre-panel window, not the whole clip. Dividing the
  // full duration (the old 8s behaviour) pushed the last scene past the point
  // where cueOut has already faded the beat text to zero, so every lane's
  // final written beat rendered invisible: a 3-beat lane started beat 3 at
  // frame 160 with the cue gone at frame 146. The last photo still holds under
  // the panel afterwards, because sceneIndex clamps to sceneCount - 1.
  const sceneFrames = Math.floor((panelStart * fps) / sceneCount);
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
  const cueIn = isStill ? 0 : interpolate(frame % sceneFrames, [0, 0.28 * fps], [0, 1], {
    easing: motionEase,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const safeX = isWide ? 58 : isSquare ? 66 : 82;
  const panelWidth = isWide ? Math.round(width * 0.46) : width;
  const panelHeight = isWide
    ? height
    : isStill
      ? isHuman
        ? isSquare ? 380 : isFeed ? 440 : 580
        : isSquare ? 430 : isFeed ? 500 : 650
      : isSquare ? 540 : isFeed ? 610 : 700;
  const hookSize = isWide ? 72 : isSquare ? 82 : isFeed ? 88 : isHuman ? 96 : 108;
  const supportSize = isWide ? 30 : isSquare ? 31 : isFeed ? 34 : isHuman ? 36 : 40;
  const cueSize = isWide ? 58 : isSquare ? 72 : isFeed ? 78 : 94;
  const cueOut = isStill ? 0 : interpolate(frame, [(panelStart - 0.5) * fps, panelStart * fps], [1, 0], {
    easing: motionEase,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const panelPadding = isWide ? "58px 52px 92px" : isSquare ? "48px 66px 92px" : isFeed ? "54px 72px 104px" : "66px 82px 112px";
  const photoRight = isWide ? panelWidth : 0;
  const photoBottom = isWide ? 0 : panelHeight;

  return (
    <AbsoluteFill style={{backgroundColor: palette.blue, overflow: "hidden"}}>
      {isStill ? (
        <PhotoScene image={props.images[sceneIndex]} imagePosition={props.imagePositions?.[sceneIndex]} index={sceneIndex} sceneFrames={sceneFrames} photoRight={photoRight} photoBottom={photoBottom} isStill />
      ) : (
        props.images.map((image, index) => (
          <Sequence
            key={image}
            from={index * sceneFrames}
            durationInFrames={isShortsCut && index === sceneCount - 1 ? durationInFrames - index * sceneFrames : sceneFrames + Math.round(0.45 * fps)}
            premountFor={fps}
          >
            <PhotoScene image={image} imagePosition={props.imagePositions?.[index]} index={index} sceneFrames={sceneFrames} photoRight={photoRight} photoBottom={photoBottom} hold={isShortsCut && index === sceneCount - 1} />
          </Sequence>
        ))
      )}

      <AbsoluteFill style={{backgroundColor: "rgba(45,45,45,0.08)"}} />

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
          opacity: 1,
        }}
      >
        <div style={{position: "absolute", left: 0, right: 0, top: 0}}>
          <PackagingRibbon height={isWide ? 20 : isSquare ? 20 : 24} />
        </div>
        {!isStill && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              boxSizing: "border-box",
              padding: panelPadding,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              color: palette.red,
              opacity: Math.min(cueIn, cueOut),
              translate: `${interpolate(cueIn, [0, 1], [28, 0])}px 0px`,
            }}
          >
            <div style={{fontFamily: sans, fontSize: isWide ? 20 : isSquare ? 22 : 26, fontWeight: 700, color: palette.redDeep, textTransform: "uppercase", letterSpacing: 1.8}}>
              {props.lane}
            </div>
            <div style={{fontFamily: serif, fontSize: cueSize, lineHeight: 0.94, marginTop: 16}}>
              {props.beats[sceneIndex]}
            </div>
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxSizing: "border-box",
            padding: panelPadding,
            display: "flex",
            flexDirection: "column",
            justifyContent: isWide ? "center" : "flex-start",
            opacity: panelIn,
            translate: isWide
              ? `${interpolate(panelIn, [0, 1], [52, 0])}px 0px`
              : `0px ${interpolate(panelIn, [0, 1], [54, 0])}px`,
          }}
        >
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
      </div>

      {!isStill && (
        <div style={{position: "absolute", left: isWide ? width - panelWidth + safeX : safeX, right: safeX, bottom: 38, height: 58}}>
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

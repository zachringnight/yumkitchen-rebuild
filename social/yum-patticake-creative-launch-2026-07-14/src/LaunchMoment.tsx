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
  blue: "#cae4fd",
  red: "#dc3439",
  redDeep: "#8f1c24",
};

const motionEase = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

type LaunchPhoto = {
  image: string;
  verticalPosition: string;
  widePosition: string;
};

export type LaunchMomentSpec = {
  id: string;
  brand: "yum" | "patticake";
  lane: string;
  hook: string;
  cta: string;
  destination: string;
  usage: string;
  messages: [string, string];
  photos: [LaunchPhoto, LaunchPhoto, LaunchPhoto];
};

export type LaunchMomentProps = LaunchMomentSpec;

const sceneWeights = [0.15, 0.125, 0.15, 0.125, 0.15, 0.3];

const sceneDurations = (total: number) => {
  const durations = sceneWeights.map((weight) => Math.floor(total * weight));
  durations[durations.length - 1] += total - durations.reduce((sum, value) => sum + value, 0);
  return durations;
};

const PlayerRail = ({duration}: {duration: number}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const safeX = width / height > 1.45 ? 76 : 82;
  const progress = interpolate(frame, [0, Math.max(1, duration - 1)], [0, 1], clamp);
  const logoSize = width / height > 1.45 ? 54 : 68;

  return (
    <div style={{position: "absolute", right: safeX, bottom: height > width ? 74 : 48, left: safeX, height: logoSize}}>
      <div style={{position: "absolute", top: Math.round(logoSize / 2) - 4, right: 0, left: 0, height: 8, backgroundColor: palette.red}} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${progress * 100}%`,
          width: logoSize,
          height: logoSize,
          boxSizing: "border-box",
          border: `4px solid ${palette.red}`,
          borderRadius: "50%",
          backgroundColor: palette.blue,
          overflow: "hidden",
          transform: `translateX(-${logoSize / 2}px)`,
        }}
      >
        <Img src={staticFile("logo.png")} style={{width: "100%", height: "100%"}} />
      </div>
    </div>
  );
};

const PhotoScene = ({photo, duration, index}: {photo: LaunchPhoto; duration: number; index: number}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const isWide = width / height > 1.45;
  const direction = index % 2 === 0 ? -1 : 1;
  const fadeIn = interpolate(frame, [0, 6], [0, 1], {...clamp, easing: motionEase});
  const fadeOut = interpolate(frame, [Math.max(0, duration - 7), duration], [1, 0], {...clamp, easing: motionEase});

  return (
    <AbsoluteFill style={{backgroundColor: palette.blue, overflow: "hidden", opacity: Math.min(fadeIn, fadeOut)}}>
      <Img
        src={staticFile(`images/${photo.image}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: isWide ? photo.widePosition : photo.verticalPosition,
          scale: interpolate(frame, [0, duration], [1.035, 1.105], clamp),
          translate: `${interpolate(frame, [0, duration], [direction * 18, 0], clamp)}px 0px`,
        }}
      />
    </AbsoluteFill>
  );
};

const MessageScene = ({message, duration}: {message: string; duration: number}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const isWide = width / height > 1.45;
  const isSquare = width === height;
  const isFeed = height / width > 1.15 && height / width < 1.45;
  const messageIn = interpolate(frame, [3, 18], [0, 1], {...clamp, easing: motionEase});
  const messageOut = interpolate(frame, [Math.max(0, duration - 10), duration], [1, 0], {...clamp, easing: motionEase});
  const fontSize = isWide ? 94 : isSquare ? 96 : isFeed ? 108 : 122;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.blue,
        color: palette.red,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isWide ? "76px 112px" : "120px 82px 190px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: isWide ? 1050 : 900,
          fontFamily: serif,
          fontSize,
          lineHeight: 0.9,
          letterSpacing: -2,
          textAlign: "center",
          opacity: Math.min(messageIn, messageOut),
          translate: `0px ${interpolate(messageIn, [0, 1], [34, 0])}px`,
        }}
      >
        {message}
      </div>
      <PlayerRail duration={duration} />
    </AbsoluteFill>
  );
};

const EndScene = ({brand, hook, cta, duration}: {brand: LaunchMomentSpec["brand"]; hook: string; cta: string; duration: number}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const isWide = width / height > 1.45;
  const isSquare = width === height;
  const isFeed = height / width > 1.15 && height / width < 1.45;
  const contentIn = interpolate(frame, [0, 10], [0, 1], {...clamp, easing: motionEase});
  const actionIn = interpolate(frame, [4, 12], [0, 1], {...clamp, easing: motionEase});
  const hookSize = isWide ? 92 : isSquare ? 90 : isFeed ? 102 : 116;
  const lockupSize = isWide ? 50 : 62;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.blue,
        color: palette.red,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isWide ? "64px 100px" : "100px 82px 118px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: isWide ? 1080 : 900,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: isWide ? 20 : 28,
          textAlign: "center",
          opacity: contentIn,
          translate: `0px ${interpolate(contentIn, [0, 1], [38, 0])}px`,
        }}
      >
        <div style={{display: "flex", alignItems: "center", gap: 14, color: palette.redDeep, fontFamily: sans, fontSize: lockupSize, fontWeight: 700, lineHeight: 1}}>
          {brand === "patticake" && (
            <>
              <span style={{color: palette.red, fontFamily: serif, fontSize: lockupSize * 1.28, fontWeight: 400}}>patticake</span>
              <span>by</span>
            </>
          )}
          <Img src={staticFile("logo.png")} style={{width: lockupSize * 1.35, height: lockupSize * 1.35}} />
        </div>
        <div style={{fontFamily: serif, fontSize: hookSize, lineHeight: 0.9, letterSpacing: -2, maxWidth: 940}}>{hook}</div>
        <div
          style={{
            marginTop: isWide ? 2 : 12,
            borderBottom: `5px solid ${palette.red}`,
            paddingBottom: 6,
            color: palette.redDeep,
            fontFamily: sans,
            fontSize: isWide ? 36 : 42,
            fontWeight: 700,
            lineHeight: 1,
            opacity: actionIn,
          }}
        >
          {cta} →
        </div>
      </div>
      <div style={{position: "absolute", right: 0, bottom: 0, left: 0, height: isWide ? 18 : 24, backgroundColor: palette.red}} />
    </AbsoluteFill>
  );
};

const RedCut = ({duration}: {duration: number}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, duration], [0, 1], {...clamp, easing: motionEase});
  return <AbsoluteFill style={{backgroundColor: palette.red, transform: `translateX(${interpolate(progress, [0, 1], [-101, 101])}%)`}} />;
};

export const LaunchMoment = (props: LaunchMomentProps) => {
  const {durationInFrames} = useVideoConfig();
  const durations = sceneDurations(durationInFrames);
  const starts = durations.map((_, index) => durations.slice(0, index).reduce((sum, value) => sum + value, 0));
  const scenes = [
    <PhotoScene key="photo-1" photo={props.photos[0]} duration={durations[0]} index={0} />,
    <MessageScene key="message-1" message={props.messages[0]} duration={durations[1]} />,
    <PhotoScene key="photo-2" photo={props.photos[1]} duration={durations[2]} index={1} />,
    <MessageScene key="message-2" message={props.messages[1]} duration={durations[3]} />,
    <PhotoScene key="photo-3" photo={props.photos[2]} duration={durations[4]} index={2} />,
    <EndScene key="end" brand={props.brand} hook={props.hook} cta={props.cta} duration={durations[5]} />,
  ];

  return (
    <AbsoluteFill style={{backgroundColor: palette.blue, overflow: "hidden"}}>
      {scenes.map((scene, index) => (
        <Sequence key={index} from={starts[index]} durationInFrames={durations[index]} premountFor={15}>
          {scene}
        </Sequence>
      ))}
      {starts.slice(1).map((start, index) => (
        <Sequence key={`cut-${start}`} from={Math.max(0, start - 4)} durationInFrames={8}>
          <RedCut duration={8} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

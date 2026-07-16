import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export type SocialMotionProps = {
  id: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  title: string;
  deck: string;
  cta: string;
  brand: "yum" | "patticake";
  images: string[];
};

const red = "#E03A3E";
const ink = "#2D2D2D";
const body = "#5F5A5A";

export const SocialMotion = (props: SocialMotionProps) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const progress = frame / Math.max(1, durationInFrames - 1);
  const enter = interpolate(frame, [0, 0.7 * fps], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const imageIndex = Math.min(props.images.length - 1, Math.floor(progress * props.images.length));
  const isVertical = height / width >= 1.4;
  const isHorizontal = width > height;
  const panelTop = isVertical ? height * 0.32 : isHorizontal ? 56 : height - 596;
  const panelLeft = 56;
  const panelWidth = isVertical ? width - 112 : isHorizontal ? 840 : width - 112;
  const panelHeight = isVertical ? 760 : isHorizontal ? height - 112 : 560;
  const imageScale = 1.05 + progress * 0.045;

  return (
    <AbsoluteFill style={{ backgroundColor: "white", fontFamily: "Arial, sans-serif", overflow: "hidden" }}>
      <Img
        src={staticFile(`images/${props.images[imageIndex]}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${imageScale}) translateX(${Math.sin(progress * Math.PI * 2) * 18}px)`,
        }}
      />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(202,228,253,.15), rgba(180,33,43,.24))" }} />
      <div
        style={{
          position: "absolute",
          left: panelLeft,
          top: panelTop + (1 - enter) * 74,
          width: panelWidth,
          minHeight: panelHeight,
          background: "white",
          opacity: enter,
          padding: 48,
          boxSizing: "border-box",
        }}
      >
        <div style={{ height: 12, background: red, margin: "-48px -48px 36px" }} />
        {props.brand === "yum" ? (
          <Img src={staticFile("logo.png")} style={{ width: 92, height: 92, marginBottom: 20 }} />
        ) : null}
        <div style={{ color: red, fontSize: 24, marginBottom: 18 }}>
          {props.brand === "patticake" ? "patticake" : "yum! Kitchen and Bakery"}
        </div>
        <div style={{ color: ink, fontFamily: "Georgia, serif", fontSize: isVertical ? 70 : 54, lineHeight: 1.03 }}>
          {props.title}
        </div>
        <div style={{ color: body, fontSize: isVertical ? 34 : 28, lineHeight: 1.18, marginTop: 22 }}>
          {props.deck}
        </div>
        <div style={{ display: "inline-block", background: red, color: "white", fontSize: 26, marginTop: 30, padding: "15px 23px" }}>
          {props.cta}
        </div>
      </div>
    </AbsoluteFill>
  );
};

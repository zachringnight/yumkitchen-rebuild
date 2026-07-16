import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export type SocialTemplate2026Props = {
  id: string;
  family: string;
  brand: "yum" | "patticake";
  hook: string;
  offer: string;
  proof: string;
  cta: string;
  captionBeats: string[];
  images: string[];
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
};

const red = "#E03A3E";
const ink = "#2D2D2D";
const body = "#5F5A5A";
const blue = "#CAE4FD";
const softBlue = "#AED2EF";

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const SocialTemplate2026 = (props: SocialTemplate2026Props) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const progress = frame / Math.max(1, durationInFrames - 1);
  const sceneIndex = progress < 0.35 ? 0 : progress < 0.68 ? 1 : 2;
  const hookIn = ease(frame, 0, 0.55 * fps);
  const offerIn = ease(frame, 3.6 * fps, 5.0 * fps);
  const logoCueIn = ease(frame, 4.95 * fps, 6.0 * fps);
  const imageScale = 1.04 + progress * 0.055;

  return (
    <AbsoluteFill style={{ backgroundColor: "white", fontFamily: "Arial, sans-serif", overflow: "hidden" }}>
      <Img
        src={staticFile(`images/${props.images[sceneIndex]}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${imageScale}) translateX(${Math.sin(progress * Math.PI * 2) * 18}px)`,
        }}
      />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${blue}52, rgba(255,255,255,.05) 45%, rgba(180,33,43,.28))` }} />
      <Img src={staticFile("logo.png")} style={{ position: "absolute", left: 88, top: 252, width: 74, height: 74 }} />
      <div style={{ position: "absolute", left: 178, top: 276, color: "white", fontWeight: 700, fontSize: 27 }}>
        {props.brand === "patticake" ? "patticake" : "yum! Kitchen and Bakery"}
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 410 + (1 - hookIn) * 42,
          maxWidth: 840,
          background: "rgba(255,255,255,.94)",
          border: `4px solid ${red}`,
          borderLeft: `12px solid ${red}`,
          borderRadius: 22,
          boxShadow: `-14px 14px 0 ${softBlue}d6`,
          padding: "28px 32px",
          opacity: hookIn,
          color: ink,
          fontSize: 86,
          lineHeight: .98,
          fontWeight: 800,
          letterSpacing: 0,
        }}
      >
        {props.hook}
      </div>
      <div
        style={{
          position: "absolute",
          left: 88,
          top: 1068,
          background: `${softBlue}f0`,
          color: ink,
          border: "3px solid rgba(255,255,255,.86)",
          borderLeft: `12px solid ${red}`,
          borderRadius: 36,
          padding: "16px 32px",
          fontSize: 42,
          fontWeight: 800,
        }}
      >
        {props.captionBeats[sceneIndex]}
      </div>
      <div
        style={{
          position: "absolute",
          left: 88,
          top: 1190 + (1 - offerIn) * 52,
          width: 794,
          minHeight: 170,
          background: "rgba(255,255,255,.94)",
          borderRadius: 20,
          borderTop: `8px solid ${red}`,
          opacity: offerIn,
          padding: 28,
          boxSizing: "border-box",
        }}
      >
        <div style={{ color: ink, fontWeight: 800, fontSize: 40, lineHeight: 1.05 }}>{props.offer}</div>
        <div style={{ color: body, fontSize: 28, marginTop: 12 }}>{props.proof}</div>
        <div style={{ display: "inline-block", background: red, color: "white", borderRadius: 31, padding: "14px 35px", fontSize: 30, fontWeight: 800, marginTop: 30 }}>
          {props.cta}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 88,
          top: 904 + (1 - logoCueIn) * 34,
          width: 794,
          minHeight: 138,
          background: "rgba(255,255,255,.93)",
          borderRadius: 20,
          borderTop: `8px solid ${red}`,
          opacity: logoCueIn,
          padding: "24px 28px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ color: red, fontWeight: 800, fontSize: 26 }}>yum! logo cue</div>
        <div style={{ color: ink, fontWeight: 800, fontSize: 30, marginTop: 7 }}>red circle + white lowercase mark</div>
        <div style={{ color: body, fontSize: 25, marginTop: 7 }}>Trocchi-style serif + narrow sans support</div>
      </div>
    </AbsoluteFill>
  );
};

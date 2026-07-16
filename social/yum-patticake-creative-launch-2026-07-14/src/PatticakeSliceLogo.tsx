import {loadFont as loadArchivoNarrow} from "@remotion/google-fonts/ArchivoNarrow";
import {loadFont as loadTrocchi} from "@remotion/google-fonts/Trocchi";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
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
  blueSoft: "#aed2ef",
  red: "#dc3439",
  redDeep: "#8f1c24",
  chocolate: "#4a2527",
  frosting: "#fffdf7",
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

export type PatticakeSliceLogoProps = {
  background: "blue" | "transparent";
  still?: boolean;
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const PatticakeSliceLogo = ({background, still = false}: PatticakeSliceLogoProps) => {
  const currentFrame = useCurrentFrame();
  const frame = still ? 116 : currentFrame;
  const markIn = interpolate(frame, [0, 26], [0, 1], {...clamp, easing: ease});
  const photoOut = interpolate(frame, [28, 58], [1, 0], {...clamp, easing: ease});
  const vectorIn = interpolate(frame, [32, 62], [0, 1], {...clamp, easing: ease});
  const ringIn = interpolate(frame, [44, 78], [0, 1], {...clamp, easing: ease});
  const wordIn = interpolate(frame, [58, 88], [0, 1], {...clamp, easing: ease});
  const badgeIn = interpolate(frame, [76, 100], [0, 1], {...clamp, easing: ease});
  const settle = interpolate(frame, [98, 116], [0, 1], {...clamp, easing: ease});

  return (
    <AbsoluteFill
      style={{
        backgroundColor: background === "blue" ? palette.blue : "transparent",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 820,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          scale: interpolate(settle, [0, 1], [1, 1.012]),
        }}
      >
        <div
          style={{
            position: "relative",
            width: 560,
            height: 560,
            borderRadius: "50%",
            backgroundColor: palette.blue,
            opacity: markIn,
            scale: interpolate(markIn, [0, 1], [0.72, 1]),
            translate: `0px ${interpolate(markIn, [0, 1], [42, 0])}px`,
          }}
        >
          <svg
            viewBox="0 0 560 560"
            width="560"
            height="560"
            role="img"
            aria-label="Three-layer Patticake slice"
            style={{position: "absolute", inset: 0}}
          >
            <defs>
              <clipPath id="patticake-slice-body">
                <path d="M132 182 L423 230 L386 430 L132 430 Z" />
              </clipPath>
            </defs>

            <circle
              cx="280"
              cy="280"
              r="239"
              fill="none"
              stroke={palette.red}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="1502"
              strokeDashoffset={interpolate(ringIn, [0, 1], [1502, 0])}
              transform="rotate(-90 280 280)"
            />

            <path
              d="M101 446 C185 468 360 470 449 436"
              fill="none"
              stroke={palette.redDeep}
              strokeWidth="18"
              strokeLinecap="round"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset={interpolate(ringIn, [0, 1], [1, 0])}
            />

            <image
              href={staticFile("images/layers_slice_vertical.jpg")}
              x="28"
              y="58"
              width="490"
              height="520"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#patticake-slice-body)"
              opacity={photoOut}
            />

            <g clipPath="url(#patticake-slice-body)" opacity={vectorIn}>
              <rect x="112" y="172" width="330" height="272" fill={palette.frosting} />
              <rect
                x={interpolate(frame, [34, 54], [-260, 112], {...clamp, easing: ease})}
                y="214"
                width="330"
                height="54"
                fill={palette.chocolate}
              />
              <rect
                x={interpolate(frame, [40, 60], [480, 112], {...clamp, easing: ease})}
                y="296"
                width="330"
                height="54"
                fill={palette.chocolate}
              />
              <rect
                x={interpolate(frame, [46, 66], [-260, 112], {...clamp, easing: ease})}
                y="378"
                width="330"
                height="54"
                fill={palette.chocolate}
              />
            </g>

            <path
              d="M132 182 L423 230 L408 274 L132 226 Z"
              fill={palette.frosting}
              stroke={palette.red}
              strokeWidth="8"
              strokeLinejoin="round"
              opacity={vectorIn}
              style={{translate: `0px ${interpolate(vectorIn, [0, 1], [-36, 0])}px`}}
            />
            <path
              d="M132 182 L423 230 L386 430 L132 430 Z"
              fill="none"
              stroke={palette.redDeep}
              strokeWidth="8"
              strokeLinejoin="round"
              opacity={vectorIn}
            />

            {[
              [427, 365, 8],
              [446, 389, 5],
              [417, 411, 4],
            ].map(([cx, cy, r], index) => (
              <circle
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r={r}
                fill={index === 0 ? palette.red : palette.redDeep}
                opacity={interpolate(frame, [68 + index * 4, 82 + index * 4], [0, 1], {...clamp, easing: ease})}
                style={{translate: `${interpolate(frame, [68 + index * 4, 82 + index * 4], [-12, 0], {...clamp, easing: ease})}px 0px`}}
              />
            ))}
          </svg>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            opacity: wordIn,
            translate: `0px ${interpolate(wordIn, [0, 1], [34, 0])}px`,
          }}
        >
          <div
            style={{
              color: palette.red,
              fontFamily: serif,
              fontSize: 132,
              lineHeight: 0.88,
              letterSpacing: -3,
            }}
          >
            patticake
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              color: palette.redDeep,
              fontFamily: sans,
              fontSize: 38,
              fontWeight: 700,
              lineHeight: 1,
              opacity: badgeIn,
              translate: `${interpolate(badgeIn, [0, 1], [-22, 0])}px 0px`,
            }}
          >
            <span>by</span>
            <Img
              src={staticFile("logo.png")}
              style={{
                width: 68,
                height: 68,
                scale: interpolate(badgeIn, [0, 1], [0.6, 1]),
                rotate: `${interpolate(badgeIn, [0, 1], [-18, 0])}deg`,
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

import {loadFont as loadArchivoNarrow} from "@remotion/google-fonts/ArchivoNarrow";
import {loadFont as loadTrocchi} from "@remotion/google-fonts/Trocchi";
import {AbsoluteFill, Img, staticFile} from "remotion";

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

export type CarouselCardSpec = {
  id: string;
  setId: string;
  setTitle: string;
  card: number;
  total: number;
  brand: "yum" | "patticake";
  role: "cover" | "detail" | "cta";
  lane: string;
  headline: string;
  support: string;
  cta?: string;
  destination?: string;
  image: string;
  objectPosition?: string;
};

const PackagingRibbon = () => (
  <div
    style={{
      height: 32,
      backgroundColor: palette.red,
      color: palette.blue,
      display: "flex",
      alignItems: "center",
      gap: 22,
      overflow: "hidden",
      whiteSpace: "nowrap",
      fontFamily: serif,
      fontSize: 20,
      lineHeight: 1,
    }}
  >
    {Array.from({length: 18}, (_, index) => (
      <span key={index}>yum!</span>
    ))}
  </div>
);

export const CarouselCard = (props: CarouselCardSpec) => {
  const headlineSize = props.role === "cover" ? 112 : props.role === "cta" ? 96 : props.headline.length > 26 ? 78 : 94;

  return (
    <AbsoluteFill style={{backgroundColor: palette.blue, overflow: "hidden"}}>
      <div style={{position: "absolute", inset: "0 0 486px"}}>
        <Img
          src={staticFile(`images/${props.image}`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: props.objectPosition ?? "50% 50%",
          }}
        />
        <div style={{position: "absolute", inset: 0, backgroundColor: "rgba(45,45,45,0.06)"}} />
      </div>

      <div style={{position: "absolute", left: 0, right: 0, top: 832}}>
        <PackagingRibbon />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 486,
          boxSizing: "border-box",
          padding: "55px 68px 54px",
          backgroundColor: palette.blue,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 24}}>
          <div
            style={{
              fontFamily: sans,
              fontSize: 25,
              lineHeight: 1,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.9,
              color: palette.redDeep,
            }}
          >
            {props.lane}
          </div>
          <div
            style={{
              flexShrink: 0,
              color: palette.redDeep,
              fontFamily: sans,
              fontSize: 27,
              fontWeight: 700,
              letterSpacing: 1.2,
            }}
          >
            {String(props.card).padStart(2, "0")} / {String(props.total).padStart(2, "0")}
          </div>
        </div>

        <div
          style={{
            fontFamily: serif,
            fontSize: headlineSize,
            lineHeight: 0.91,
            letterSpacing: -2.4,
            color: palette.red,
            marginTop: 12,
            maxWidth: 940,
          }}
        >
          {props.headline}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 36,
            marginTop: "auto",
          }}
        >
          <div
            style={{
              maxWidth: props.cta ? 650 : 850,
              fontFamily: sans,
              fontSize: 36,
              lineHeight: 1.03,
              color: palette.redDeep,
            }}
          >
            {props.support}
          </div>
          {props.cta ? (
            <div
              style={{
                flexShrink: 0,
                fontFamily: sans,
                fontSize: 34,
                lineHeight: 1,
                fontWeight: 700,
                color: palette.redDeep,
                borderBottom: `5px solid ${palette.red}`,
                paddingBottom: 7,
              }}
            >
              {props.cta} →
            </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

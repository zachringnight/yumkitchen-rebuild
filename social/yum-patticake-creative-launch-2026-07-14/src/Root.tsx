import {Composition, Folder, Still} from "remotion";
import data from "./specs.json";
import launchMomentData from "./launch-moment-specs.json";
import carouselData from "./carousel-specs.json";
import {CarouselCard, type CarouselCardSpec} from "./CarouselCard";
import {CarouselMotion, type CarouselMotionProps} from "./CarouselMotion";
import {CreativeLaunch, type CreativeLaunchProps, type CreativeSpec} from "./CreativeLaunch";
import {LaunchMoment, type LaunchMomentProps, type LaunchMomentSpec} from "./LaunchMoment";
import {PatticakeSliceLogo, type PatticakeSliceLogoProps} from "./PatticakeSliceLogo";

const specs = data as CreativeSpec[];
const launchMomentSpecs = launchMomentData as LaunchMomentSpec[];
const carouselSpecs = carouselData as CarouselCardSpec[];
const carouselMotionSets = [
  {setId: "pick-your-kitchen", reelFrames: 300, feedFrames: 240},
  {setId: "feed-the-room", reelFrames: 255, feedFrames: 225},
  {setId: "send-cake", reelFrames: 270, feedFrames: 240},
  {setId: "meet-patticake", reelFrames: 270, feedFrames: 240},
  {setId: "how-to-patticake", reelFrames: 270, feedFrames: 240},
  {setId: "patticake-occasions", reelFrames: 270, feedFrames: 240},
] as const;

const stills = [
  {suffix: "story", width: 1080, height: 1920, stillScene: 0 as const},
  {suffix: "feed", width: 1080, height: 1350, stillScene: 1 as const},
  {suffix: "square", width: 1080, height: 1080, stillScene: 1 as const},
  {suffix: "wide", width: 1200, height: 675, stillScene: 3 as const},
  {suffix: "link", width: 1200, height: 630, stillScene: 3 as const},
  {suffix: "pin", width: 1000, height: 1500, stillScene: 1 as const},
];

export const RemotionRoot = () => (
  <Folder name="Yum-Patticake-Creative-Launch">
    <Folder name="Brand-Motion">
      <Composition
        id="Patticake-Slice-Logo-Blue"
        component={PatticakeSliceLogo}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{background: "blue"} satisfies PatticakeSliceLogoProps}
      />
      <Composition
        id="Patticake-Slice-Logo-Transparent"
        component={PatticakeSliceLogo}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{background: "transparent"} satisfies PatticakeSliceLogoProps}
      />
      <Composition
        id="Patticake-Slice-Logo-Blue-Vertical"
        component={PatticakeSliceLogo}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{background: "blue"} satisfies PatticakeSliceLogoProps}
      />
      <Composition
        id="Patticake-Slice-Logo-Blue-Feed"
        component={PatticakeSliceLogo}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{background: "blue"} satisfies PatticakeSliceLogoProps}
      />
      <Still
        id="Patticake-Slice-Logo-Lockup"
        component={PatticakeSliceLogo}
        width={1080}
        height={1080}
        defaultProps={{background: "blue", still: true} satisfies PatticakeSliceLogoProps}
      />
    </Folder>
    <Folder name="Motion-Masters">
      {specs.map((spec) => (
        <Composition
          key={`${spec.id}-motion`}
          id={`${spec.id}-motion`}
          component={CreativeLaunch}
          durationInFrames={240}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{...spec, mode: "motion", stillScene: 0} satisfies CreativeLaunchProps}
        />
      ))}
      {specs.map((spec) => (
        <Composition
          key={`${spec.id}-shorts`}
          id={`${spec.id}-shorts`}
          component={CreativeLaunch}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{...spec, mode: "motion", stillScene: 0} satisfies CreativeLaunchProps}
        />
      ))}
      {specs.map((spec) => (
        <Composition
          key={`${spec.id}-feed-motion`}
          id={`${spec.id}-feed-motion`}
          component={CreativeLaunch}
          durationInFrames={240}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{...spec, mode: "motion", stillScene: 0} satisfies CreativeLaunchProps}
        />
      ))}
      {specs.map((spec) => (
        <Composition
          key={`${spec.id}-square-motion`}
          id={`${spec.id}-square-motion`}
          component={CreativeLaunch}
          durationInFrames={240}
          fps={30}
          width={1080}
          height={1080}
          defaultProps={{...spec, mode: "motion", stillScene: 0} satisfies CreativeLaunchProps}
        />
      ))}
      {specs.map((spec) => (
        <Composition
          key={`${spec.id}-wide-motion`}
          id={`${spec.id}-wide-motion`}
          component={CreativeLaunch}
          durationInFrames={240}
          fps={30}
          width={1280}
          height={720}
          defaultProps={{...spec, mode: "motion", stillScene: 0} satisfies CreativeLaunchProps}
        />
      ))}
    </Folder>
    <Folder name="Launch-Moment-Motion">
      {launchMomentSpecs.map((spec) => (
        <Composition
          key={`${spec.id}-launch-10s`}
          id={`${spec.id}-launch-10s`}
          component={LaunchMoment}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{...spec} satisfies LaunchMomentProps}
        />
      ))}
      {launchMomentSpecs.map((spec) => (
        <Composition
          key={`${spec.id}-launch-8s`}
          id={`${spec.id}-launch-8s`}
          component={LaunchMoment}
          durationInFrames={240}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{...spec} satisfies LaunchMomentProps}
        />
      ))}
      {launchMomentSpecs.map((spec) => (
        <Composition
          key={`${spec.id}-launch-feed`}
          id={`${spec.id}-launch-feed`}
          component={LaunchMoment}
          durationInFrames={240}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{...spec} satisfies LaunchMomentProps}
        />
      ))}
      {launchMomentSpecs.map((spec) => (
        <Composition
          key={`${spec.id}-launch-square`}
          id={`${spec.id}-launch-square`}
          component={LaunchMoment}
          durationInFrames={240}
          fps={30}
          width={1080}
          height={1080}
          defaultProps={{...spec} satisfies LaunchMomentProps}
        />
      ))}
      {launchMomentSpecs.map((spec) => (
        <Composition
          key={`${spec.id}-launch-wide`}
          id={`${spec.id}-launch-wide`}
          component={LaunchMoment}
          durationInFrames={240}
          fps={30}
          width={1280}
          height={720}
          defaultProps={{...spec} satisfies LaunchMomentProps}
        />
      ))}
    </Folder>
    <Folder name="Carousel-Motion">
      {carouselMotionSets.map((set) => {
        const cards = carouselSpecs.filter((card) => card.setId === set.setId);
        return (
          <Composition
            key={`${set.setId}-carousel-reel`}
            id={`carousel-${set.setId}-motion-reel`}
            component={CarouselMotion}
            durationInFrames={set.reelFrames}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{setId: set.setId, format: "reel", cards} satisfies CarouselMotionProps}
          />
        );
      })}
      {carouselMotionSets.map((set) => {
        const cards = carouselSpecs.filter((card) => card.setId === set.setId);
        return (
          <Composition
            key={`${set.setId}-carousel-feed`}
            id={`carousel-${set.setId}-motion-feed`}
            component={CarouselMotion}
            durationInFrames={set.feedFrames}
            fps={30}
            width={1080}
            height={1350}
            defaultProps={{setId: set.setId, format: "feed", cards} satisfies CarouselMotionProps}
          />
        );
      })}
    </Folder>
    <Folder name="Static-Placement-Masters">
      {specs.flatMap((spec) =>
        stills.map((still) => {
          const stillScene = spec.id === "patticake-gift-drop" || (spec.treatment === "human" && still.suffix === "wide") ? 0 : still.stillScene;
          return (
            <Still
              key={`${spec.id}-${still.suffix}`}
              id={`${spec.id}-${still.suffix}`}
              component={CreativeLaunch}
              width={still.width}
              height={still.height}
              defaultProps={{...spec, mode: "still", stillScene} satisfies CreativeLaunchProps}
            />
          );
        }),
      )}
    </Folder>
    <Folder name="Carousel-4x5">
      {carouselSpecs.map((spec) => (
        <Still
          key={`carousel-${spec.id}`}
          id={`carousel-${spec.id}`}
          component={CarouselCard}
          width={1080}
          height={1350}
          defaultProps={spec}
        />
      ))}
    </Folder>
  </Folder>
);

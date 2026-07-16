import { Composition, Folder } from "remotion";
import { SocialMotion, type SocialMotionProps } from "./SocialMotion";
import data from "./compositions.json";

export const RemotionRoot = () => {
  const compositions = data as SocialMotionProps[];

  return (
    <Folder name="Yum-Patticake-Social">
      {compositions.map((item) => (
        <Composition
          key={item.id}
          id={item.id}
          component={SocialMotion}
          durationInFrames={item.durationInFrames}
          fps={item.fps}
          width={item.width}
          height={item.height}
          defaultProps={item}
        />
      ))}
    </Folder>
  );
};

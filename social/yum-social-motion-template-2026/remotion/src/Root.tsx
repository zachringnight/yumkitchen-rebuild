import { Composition, Folder } from "remotion";
import data from "./templates.json";
import { SocialTemplate2026, type SocialTemplate2026Props } from "./SocialTemplate2026";

export const RemotionRoot = () => {
  const templates = data as SocialTemplate2026Props[];

  return (
    <Folder name="Yum-Social-2026">
      {templates.map((template) => (
        <Composition
          key={template.id}
          id={template.id}
          component={SocialTemplate2026}
          durationInFrames={template.durationInFrames}
          fps={template.fps}
          width={template.width}
          height={template.height}
          defaultProps={template}
        />
      ))}
    </Folder>
  );
};

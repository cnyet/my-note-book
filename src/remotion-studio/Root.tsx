import { registerRoot } from "remotion";
import { Composition } from "remotion";
import { CodeFlowIntro } from "./CodeFlowIntro";

export const RemotionRoot = () => {
  return (
    <Composition
      id="CodeFlowIntro"
      component={CodeFlowIntro}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        title: "CodeFlow",
      }}
    />
  );
};

registerRoot(RemotionRoot);

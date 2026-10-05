import { createFileRoute } from "@tanstack/react-router";
import { StoryNav, JudgeMode } from "@/components/StoryNav";
import { Hero, SceneOneOrder, SceneHundred, SceneSurveys, SceneEvidence, SceneQuestion, SceneWants } from "@/components/StoryScenes";
import { SystemJourney, Differentiation, CohortDefaults, GuardrailsPanel } from "@/components/SystemSections";
import { RiskEngine } from "@/components/RiskEngine";
import { Recovery, Operations, Economics, Experiment, Plan, Risks, Final } from "@/components/RecoveryAndScale";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "One Missed Doorbell — Meesho DICE S3 Business Track" },
      { name: "description", content: "How we turn a failed COD delivery into a second chance: a rules-based risk engine and recovery flow to reduce RTO." },
      { property: "og:title", content: "One Missed Doorbell — Meesho DICE S3" },
      { property: "og:description", content: "Prevent what we can. Recover what we cannot. Scale only what the data proves." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <StoryNav />
      <main>
        <Hero />
        <SceneOneOrder />
        <SceneHundred />
        <SceneSurveys />
        <SceneEvidence />
        <SceneQuestion />
        <SceneWants />
        <Differentiation />
        <SystemJourney />
        <RiskEngine />
        <Recovery />
        <CohortDefaults />
        <Operations />
        <Economics />
        <Experiment />
        <Plan />
        <GuardrailsPanel />
        <Risks />
        <Final />
      </main>
      <JudgeMode />
    </div>
  );
}

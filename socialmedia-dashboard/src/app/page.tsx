import PostActivityChart from "@/components/PostActivityChart";
import SubredditDistribution from "@/components/SubredditDistribution";
import ScoreDistribution from "@/components/ScoreDistribution";
import EngagementOverTime from "@/components/EngagementOverTime";
import AIAnalyzer from "@/components/AIAnalyzer";
import Chatbot from "@/components/Chatbot";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
      <PostActivityChart />
      <SubredditDistribution />
      <ScoreDistribution />
      <EngagementOverTime />
      <AIAnalyzer />
      <Chatbot />
    </div>
  );
}

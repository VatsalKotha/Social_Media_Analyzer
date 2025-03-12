// import PostActivityChart from "@/components/PostActivityChart";
// import SubredditDistribution from "@/components/SubredditDistribution";
// import ScoreDistribution from "@/components/ScoreDistribution";
// import EngagementOverTime from "@/components/EngagementOverTime";
// import AIAnalyzer from "@/components/AIAnalyzer";
// import Chatbot from "@/components/Chatbot";
// import SemanticSearch from "@/components/SemanticSearch";

// export default function Home() {
//   return (
//     <div>
//       {/* <PostActivityChart />
//       <SubredditDistribution />
//       <ScoreDistribution />
//       <EngagementOverTime />
//       <AIAnalyzer />
//       <Chatbot /> */}
//       <SemanticSearch />
//     </div>  
//   );
// }


"use client";
import Sidebar from "@/components/Sidebar";
import PostActivityChart from "@/components/PostActivityChart";
import SubredditDistribution from "@/components/SubredditDistribution";
import ScoreDistribution from "@/components/ScoreDistribution";
import EngagementOverTime from "@/components/EngagementOverTime";
import AIAnalyzer from "@/components/AIAnalyzer";
import Chatbot from "@/components/Chatbot";
import NetworkGraph from "@/components/NetworkGraph"; // ✅ Import NetworkGraph

export default function Home() {
  return (
    <div className="flex">
      {/* Sidebar always visible */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 flex-1 p-6 space-y-12">
        {/* Grid Layout Section */}
        <div id="dashboard" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PostActivityChart />
          <SubredditDistribution />
          <ScoreDistribution />
          <EngagementOverTime />
        </div>

        {/* Network Graph Section */}
        <div id="network-graph" className="mt-12">
          <NetworkGraph />
        </div>

        {/* AI Analyzer Section */}
        <div id="ai-analyzer" className="mt-12">
          <AIAnalyzer />
        </div>

        {/* Chatbot Section */}
        <div id="chatbot" className="mt-12">
          <Chatbot />
        </div>
      </main>
    </div>
  );
}

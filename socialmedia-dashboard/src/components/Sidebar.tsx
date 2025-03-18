// "use client";
// import { useState } from "react";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { Menu } from "lucide-react";

// const Sidebar = ({ setActiveComponent }: { setActiveComponent: (component: string) => void }) => {
//   return (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button className="fixed top-4 left-4 z-50 bg-indigo-600 hover:bg-indigo-800 text-white p-2 rounded-md">
//           <Menu size={24} />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="bg-gray-900 text-white w-64 p-5">
//         <h2 className="text-xl font-bold mb-6 text-center">🚀 AI Dashboard</h2>
//         <nav className="space-y-4">
//           <button onClick={() => setActiveComponent("PostActivityChart")} className="block w-full text-left p-2 hover:bg-indigo-700 rounded">
//             📊 Post Activity
//           </button>
//           <button onClick={() => setActiveComponent("SubredditDistribution")} className="block w-full text-left p-2 hover:bg-indigo-700 rounded">
//             📌 Subreddit Distribution
//           </button>
//           <button onClick={() => setActiveComponent("ScoreDistribution")} className="block w-full text-left p-2 hover:bg-indigo-700 rounded">
//             📈 Score Distribution
//           </button>
//           <button onClick={() => setActiveComponent("EngagementOverTime")} className="block w-full text-left p-2 hover:bg-indigo-700 rounded">
//             ⏳ Engagement Over Time
//           </button>
//           <button onClick={() => setActiveComponent("AIAnalyzer")} className="block w-full text-left p-2 hover:bg-indigo-700 rounded">
//             🧠 AI Analyzer
//           </button>
//           <button onClick={() => setActiveComponent("Chatbot")} className="block w-full text-left p-2 hover:bg-indigo-700 rounded">
//             💬 Chatbot
//           </button>
//         </nav>
//       </SheetContent>
//     </Sheet>
//   );
// };

// export default Sidebar;

const Sidebar = () => {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-5 fixed">
      <h2 className="text-xl font-bold mb-6 text-center">🚀 Social Media Dashboard</h2>
      <nav className="space-y-4">
        <button
          onClick={() => scrollToSection("dashboard")}
          className="block w-full text-left p-2 hover:bg-indigo-700 rounded"
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => scrollToSection("network-graph")} // ✅ Added Network Graph button
          className="block w-full text-left p-2 hover:bg-indigo-700 rounded"
        >
          🔗 Network Graph
        </button>
          <button
            onClick={() => scrollToSection("trending-topics")}
            className="block w-full text-left p-2 hover:bg-indigo-700 rounded"
          >
          📈 Trending Topics
          </button>
          <button
            onClick={() => scrollToSection("coordinated-posts")}
            className="block w-full text-left p-2 hover:bg-indigo-700 rounded"
          >
          🤝 Coordinated Posts
          </button>
        <button
          onClick={() => scrollToSection("ai-analyzer")}
          className="block w-full text-left p-2 hover:bg-indigo-700 rounded"
        >
          🧠 AI Analyzer
        </button>
        <button
          onClick={() => scrollToSection("chatbot")}
          className="block w-full text-left p-2 hover:bg-indigo-700 rounded"
        >
          💬 Chatbot
        </button>
        
      </nav>
    </div>
  );
};

export default Sidebar;

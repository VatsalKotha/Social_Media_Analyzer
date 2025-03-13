// "use client";
// import { useEffect, useState } from "react";

// const NetworkGraph = () => {
//   const [graphHtml, setGraphHtml] = useState("");

//   useEffect(() => {
//     fetch("http://127.0.0.1:8001/network-graph-html")
//       .then((response) => response.text()) // ✅ Fetch HTML as text
//       .then((html) => setGraphHtml(html)) // ✅ Store HTML content
//       .catch((error) => console.error("Error loading network graph:", error));
//   }, []);

//   return (
//     <div className="p-6 flex flex-col items-center">
//       <h1 className="text-2xl font-bold mb-4">🌐 Network Graph</h1>

//       <div className="w-full max-w-5xl h-[600px] border border-gray-300 rounded-lg shadow-lg">
//         {graphHtml ? (
//           <div dangerouslySetInnerHTML={{ __html: graphHtml }} />
//         ) : (
//           <p className="text-gray-500 text-center">Loading network graph...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NetworkGraph;


const NetworkGraph = () => {
  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">🌐 Network Graph</h1>
      <iframe
        src={`${process.env.NEXT_PUBLIC_API_URL}/network-graph-html`}
        className="w-full max-w-5xl h-[600px] border border-gray-300 rounded-lg shadow-lg"
      ></iframe>
    </div>
  );
};

export default NetworkGraph;

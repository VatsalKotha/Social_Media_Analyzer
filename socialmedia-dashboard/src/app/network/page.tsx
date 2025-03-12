"use client"; // ✅ Convert to Client Component
import dynamic from "next/dynamic";

// ✅ Dynamically import the NetworkGraph component (Client-side only)
const NetworkGraph = dynamic(() => import("@/components/NetworkGraph"), {
  ssr: false,
});

export default function NetworkPage() {
  return <NetworkGraph />;
}

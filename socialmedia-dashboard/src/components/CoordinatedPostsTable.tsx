"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, ArrowLeft, ArrowRight } from "lucide-react";

// Define the TypeScript type for a post
interface Post {
  post_id: string;
  title: string;
  subreddit: string;
  author: string;
  score: number;
  num_comments: number;
  timestamp: string;
  url: string;
}

const CoordinatedPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10; // ✅ Show 10 posts per page

  useEffect(() => {
    setLoading(true);
    fetch("http://127.0.0.1:8003/api/coordinated-posts?min_engagement=100")
      .then((res) => res.json())
      .then((data: Post[]) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, []);

  const handleDownloadReport = async () => {
    window.open("http://127.0.0.1:8003/api/generate-trends-pdf", "_blank");
  };

  // ✅ Pagination Logic
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp /> Coordinated Posts & Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Button onClick={handleDownloadReport} className="mb-4 flex items-center bg-indigo-500 hover:bg-indigo-700">
              <Download className="mr-2" /> Download PDF Report
            </Button>

            {/* ✅ Responsive Scrollable Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                {/* ✅ Sticky Header for Better Readability */}
                <thead className="bg-gray-50 text-gray-600 uppercase text-sm font-medium sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Subreddit</th>
                    <th className="px-4 py-2 text-left">Author</th>
                    <th className="px-4 py-2 text-left">Score</th>
                    <th className="px-4 py-2 text-left">Comments</th>
                    <th className="px-4 py-2 text-left">Timestamp</th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-100">
                  {currentPosts.map((post: Post) => (
                    <tr key={post.post_id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-2">
                        <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {post.title}
                        </a>
                      </td>
                      <td className="px-4 py-2">{post.subreddit}</td>
                      <td className="px-4 py-2">{post.author}</td>
                      <td className="px-4 py-2">{post.score}</td>
                      <td className="px-4 py-2">{post.num_comments}</td>
                      <td className="px-4 py-2">{new Date(post.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ✅ Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 bg-indigo-500 hover:bg-indigo-700"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </Button>

              <span className="text-gray-600 text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 bg-indigo-500 hover:bg-indigo-700"
              >
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CoordinatedPosts;

import { useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  content?: string;
};

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);

  async function fetchPosts() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`);
    const data = await response.json();
    setPosts(data);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="mt-12 w-full max-w-2xl">
      <h2 className="text-xl font-bold mb-4 text-blue-700">投稿一覧</h2>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="p-4 bg-white rounded shadow">
            <h3 className="text-lg font-semibold">{post.title}</h3>
            {post.content && (
              <p className="mt-2 text-gray-600">{post.content}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

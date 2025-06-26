import "./App.css";
import { PostForm } from "./components/PostForm";
import { PostList } from "./components/PostList";
import { useState } from "react";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  function handlePostCreated() {
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <PostForm onPostCreated={handlePostCreated} />
      <PostList key={refreshKey} />
    </div>
  );
}

export default App;

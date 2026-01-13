import { useState } from "react";
import Upload from "./components/Upload";
import Search from "./components/Search";
import Results from "./components/Results";

export default function App() {
  const [images, setImages] = useState([]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">
        🔍 Semantic Photo Search
      </h1>

      <Upload />
      <Search onResults={setImages} />
      <Results images={images} />
    </div>
  );
}

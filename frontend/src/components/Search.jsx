import { API_BASE } from "../api";

export default function Search({ onResults }) {
  const search = async (e) => {
    const query = e.target.value;
    if (!query) return;

    const res = await fetch(
      `${API_BASE}/search?query=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    onResults(data.results);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-4">
      <input
        type="text"
        placeholder="Search images..."
        className="w-full border p-2 rounded"
        onChange={search}
      />
    </div>
  );
}

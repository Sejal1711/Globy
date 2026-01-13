import { API_BASE } from "../api";

export default function Upload() {
  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${API_BASE}/index-photo`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Upload failed");
      }

      const data = await res.json();
      alert(`Indexed: ${data.filename}\nCaption: ${data.caption}`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">Upload Image</h2>
      <input type="file" accept="image/*" onChange={uploadImage} />
    </div>
  );
}

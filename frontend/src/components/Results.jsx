export default function Results({ images }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {images.map((url, i) => (
        <img
          key={i}
          src={url}
          className="rounded-xl shadow hover:scale-105 transition"
        />
      ))}
    </div>
  );
}

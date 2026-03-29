export default function MiniCard({ title, value }) {
  return (
    <div className="flex-1 bg-white rounded-2xl p-4 shadow text-center">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
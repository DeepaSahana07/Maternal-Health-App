export default function MiniCard({ title, value }) {
  return (
    <div className="flex-1 glass rounded-2xl p-3 text-center shadow-card">
      <p className="text-[10px] text-gray-400 font-medium">{title}</p>
      <p className="text-base font-bold text-gray-800">{value}</p>
    </div>
  );
}

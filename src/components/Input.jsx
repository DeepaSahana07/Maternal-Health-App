export default function Input({ label, ...props }) {
  return (
    <div className="mb-3">
      {label && <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>}
      <input
        {...props}
        className="w-full glass rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-rose-300 transition"
      />
    </div>
  );
}

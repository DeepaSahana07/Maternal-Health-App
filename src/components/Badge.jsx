const colors = {
  red: "bg-red-100 text-red-600",
  amber: "bg-amber-100 text-amber-600",
  green: "bg-green-100 text-green-600",
  pink: "bg-rose-100 text-rose-600",
  purple: "bg-purple-100 text-purple-600",
};

export default function Badge({ label, color = "pink", className = "" }) {
  return (
    <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold ${colors[color]} ${className}`}>
      {label}
    </span>
  );
}

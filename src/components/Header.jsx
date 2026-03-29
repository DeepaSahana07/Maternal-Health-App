export default function Header({ title, subtitle }) {
  return (
    <div className="mb-5">
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

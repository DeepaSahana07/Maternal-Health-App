export default function Header({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h1 className="text-lg font-semibold text-gray-700">{title}</h1>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}
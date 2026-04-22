export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-base-100 rounded-2xl border border-base-300 p-5 shadow-sm">
      <p className="text-sm text-base-content/60">{title}</p>
      <h3 className="text-2xl md:text-3xl font-bold mt-2">{value}</h3>
      <p className="text-sm text-base-content/50 mt-1">{subtitle}</p>
    </div>
  );
}

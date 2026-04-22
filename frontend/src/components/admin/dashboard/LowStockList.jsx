export default function LowStockList({ products }) {
  return (
    <div className="bg-base-100 rounded-2xl border border-base-300 p-5">
      <h3 className="font-semibold text-lg mb-4">Low Stock Products</h3>

      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between rounded-xl bg-base-200 p-4"
          >
            <p className="font-medium">{product.name}</p>
            <span className="badge badge-warning">{product.stock} left</span>
          </div>
        ))}
      </div>
    </div>
  );
}

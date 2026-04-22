export default function PricingStockSection({ formData, handleChange }) {
  return (
    <div className="bg-base-100 rounded-2xl border border-base-300 p-5 space-y-4">
      <h3 className="text-lg font-semibold">Pricing</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Base Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="0"
          />
        </div>
      </div>

      <p className="text-sm text-base-content/60">
        Stock is automatically calculated from variant stock. Rating and reviews
        are generated from customer feedback.
      </p>
    </div>
  );
}

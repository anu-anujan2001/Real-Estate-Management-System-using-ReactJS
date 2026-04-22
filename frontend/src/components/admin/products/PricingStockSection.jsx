export default function PricingStockSection({ formData, handleChange }) {
  return (
    <div className="bg-base-100 rounded-2xl border border-base-300 p-5 space-y-4">
      <h3 className="text-lg font-semibold">Pricing & Inventory</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div>
          <label className="label">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="0"
          />
        </div>

        <div>
          <label className="label">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="0"
          />
        </div>

        <div>
          <label className="label">Rating</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="0"
          />
        </div>

        <div>
          <label className="label">Reviews</label>
          <input
            type="number"
            name="numReviews"
            value={formData.numReviews}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}

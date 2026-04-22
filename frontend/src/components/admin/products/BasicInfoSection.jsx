export default function BasicInfoSection({ formData, handleChange }) {
  return (
    <div className="bg-base-100 rounded-2xl border border-base-300 p-5 space-y-4">
      <h3 className="text-lg font-semibold">Basic Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label className="label">SKU</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter SKU"
          />
        </div>
      </div>

      <div>
        <label className="label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="textarea textarea-bordered w-full min-h-[120px]"
          placeholder="Enter description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter category"
          />
        </div>

        <div>
          <label className="label">Brand</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter brand"
          />
        </div>
      </div>
    </div>
  );
}

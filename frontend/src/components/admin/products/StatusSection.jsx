export default function StatusSection({
  formData,
  handleChange,
  handleSubmit,
  mode,
  onCancel,
}) {
  return (
    <div className="bg-base-100 rounded-2xl border border-base-300 p-5 space-y-4">
      <h3 className="text-lg font-semibold">Publish Settings</h3>

      {/* toggles */}
      <label className="label cursor-pointer justify-start gap-3">
        <input
          type="checkbox"
          name="isFeatured"
          checked={formData.isFeatured}
          onChange={handleChange}
          className="toggle toggle-primary"
        />
        <span className="label-text">Featured Product</span>
      </label>

      <label className="label cursor-pointer justify-start gap-3">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="toggle toggle-success"
        />
        <span className="label-text">Active Product</span>
      </label>

      {/* buttons */}
      <button
        type="button"
        onClick={handleSubmit}
        className="btn btn-primary w-full"
      >
        {mode === "edit" ? "Update Product" : "Save Product"}
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="btn btn-outline w-full"
      >
        Cancel
      </button>
    </div>
  );
}

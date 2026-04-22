export default function VariantsSection({
  variants,
  addVariant,
  removeVariant,
  handleVariantChange,
}) {
  return (
    <div className="bg-base-100 rounded-2xl border border-base-300 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Variants</h3>
        <button
          type="button"
          onClick={addVariant}
          className="btn btn-sm btn-primary"
        >
          Add Variant
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="rounded-xl bg-base-200 p-4 text-sm text-base-content/60">
          No variants added yet.
        </div>
      ) : (
        <div className="space-y-3">
          {variants.map((variant, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-base-200 rounded-xl p-4"
            >
              <input
                type="text"
                placeholder="Size"
                value={variant.size}
                onChange={(e) =>
                  handleVariantChange(index, "size", e.target.value)
                }
                className="input input-bordered w-full"
              />

              <input
                type="text"
                placeholder="Color"
                value={variant.color}
                onChange={(e) =>
                  handleVariantChange(index, "color", e.target.value)
                }
                className="input input-bordered w-full"
              />

              <input
                type="number"
                placeholder="Stock"
                value={variant.stock}
                onChange={(e) =>
                  handleVariantChange(index, "stock", e.target.value)
                }
                className="input input-bordered w-full"
              />

              <input
                type="number"
                placeholder="Price"
                value={variant.price}
                onChange={(e) =>
                  handleVariantChange(index, "price", e.target.value)
                }
                className="input input-bordered w-full"
              />

              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="btn btn-outline btn-error"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

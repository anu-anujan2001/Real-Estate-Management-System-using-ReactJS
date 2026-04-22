import { X } from "lucide-react";

export default function ImagesSection({
  formData,
  handleImageUpload,
  removeImage,
}) {
  return (
    <div className="bg-base-100 rounded-2xl border border-base-300 p-5 space-y-4">
      <h3 className="text-lg font-semibold">Product Images</h3>

      <input
        type="file"
        multiple
        className="file-input file-input-bordered w-full"
        onChange={handleImageUpload}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {formData.images.length > 0 ? (
          formData.images.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img}
                alt={`product-${index}`}
                className="w-full aspect-square object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="btn btn-xs btn-circle btn-error absolute top-2 right-2"
              >
                <X size={12} />
              </button>
            </div>
          ))
        ) : (
          <>
            <div className="rounded-xl bg-base-200 aspect-square" />
            <div className="rounded-xl bg-base-200 aspect-square" />
            <div className="rounded-xl bg-base-200 aspect-square" />
          </>
        )}
      </div>
    </div>
  );
}

import { X } from "lucide-react";

export default function ImagesSection({
  formData,
  handleImageUpload,
  removeExistingImage,
  removeNewImage,
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

      <div className="space-y-4">
        {formData.images.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Existing Images</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {formData.images.map((img, index) => (
                <div key={`existing-${index}`} className="relative">
                  <img
                    src={img}
                    alt={`existing-${index}`}
                    className="w-full aspect-square object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="btn btn-xs btn-circle btn-error absolute top-2 right-2"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {formData.imagePreviews.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">New Images</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {formData.imagePreviews.map((img, index) => (
                <div key={`new-${index}`} className="relative">
                  <img
                    src={img}
                    alt={`new-${index}`}
                    className="w-full aspect-square object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="btn btn-xs btn-circle btn-error absolute top-2 right-2"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {formData.images.length === 0 &&
          formData.imagePreviews.length === 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-base-200 aspect-square"></div>
              <div className="rounded-xl bg-base-200 aspect-square"></div>
              <div className="rounded-xl bg-base-200 aspect-square"></div>
            </div>
          )}
      </div>
    </div>
  );
}

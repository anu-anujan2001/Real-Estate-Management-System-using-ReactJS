import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicInfoSection from "./BasicInfoSection";
import PricingStockSection from "./PricingStockSection";
import ImagesSection from "./ImagesSection";
import StatusSection from "./StatusSection";
import VariantsSection from "./VariantsSection";
import useProductStore from "../../../store/useProductStore";

const defaultFormData = {
  name: "",
  description: "",
  price: "",
  category: "",
  brand: "",
  images: [],
  newImages: [],
  imagePreviews: [],
  isFeatured: false,
  isActive: true,
  sku: "",
  variants: [],
};

export default function ProductForm({ initialData = null, mode = "create" }) {
  const navigate = useNavigate();
  const { createProduct, updateProduct, isCreatingProduct, isUpdatingProduct } =
    useProductStore();

  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price ?? "",
        category: initialData.category || "",
        brand: initialData.brand || "",
        images: initialData.images || [],
        newImages: [],
        imagePreviews: [],
        isFeatured: initialData.isFeatured ?? false,
        isActive: initialData.isActive ?? true,
        sku: initialData.sku || "",
        variants: initialData.variants || [],
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const previews = files.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      newImages: [...prev.newImages, ...files],
      imagePreviews: [...prev.imagePreviews, ...previews],
    }));
  };

  const removeExistingImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const removeNewImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
    }));
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { size: "", color: "", stock: 0, price: 0 }],
    }));
  };

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index][field] =
      field === "stock" || field === "price" ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      variants: updatedVariants,
    }));
  };

  const buildProductFormData = () => {
    const payload = new FormData();

    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("price", formData.price);
    payload.append("category", formData.category);
    payload.append("brand", formData.brand);
    payload.append("sku", formData.sku);
    payload.append("isFeatured", formData.isFeatured);
    payload.append("isActive", formData.isActive);
    payload.append("variants", JSON.stringify(formData.variants));
    payload.append("existingImages", JSON.stringify(formData.images));

    formData.newImages.forEach((file) => {
      payload.append("images", file);
    });

    return payload;
  };

  const handleSubmit = async () => {
    const payload = buildProductFormData();

    let result;

    if (mode === "edit" && initialData?._id) {
      result = await updateProduct(initialData._id, payload);
    } else {
      result = await createProduct(payload);
    }

    if (result?.success) {
      navigate("/admin/products");
    }
  };

  const isSubmitting = mode === "edit" ? isUpdatingProduct : isCreatingProduct;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 space-y-6">
        <BasicInfoSection formData={formData} handleChange={handleChange} />
        <PricingStockSection formData={formData} handleChange={handleChange} />
        <VariantsSection
          variants={formData.variants}
          addVariant={addVariant}
          removeVariant={removeVariant}
          handleVariantChange={handleVariantChange}
        />
      </div>

      <div className="space-y-6">
        <ImagesSection
          formData={formData}
          handleImageUpload={handleImageUpload}
          removeExistingImage={removeExistingImage}
          removeNewImage={removeNewImage}
        />
        <StatusSection
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          mode={mode}
          isSubmitting={isSubmitting}
          onCancel={() => navigate("/admin/products")}
        />
      </div>
    </div>
  );
}

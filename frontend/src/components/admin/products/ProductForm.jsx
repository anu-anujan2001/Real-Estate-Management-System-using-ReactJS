import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicInfoSection from "./BasicInfoSection";
import PricingStockSection from "./PricingStockSection";
import ImagesSection from "./ImagesSection";
import StatusSection from "./StatusSection";
import VariantsSection from "./VariantsSection";

const defaultFormData = {
  name: "",
  description: "",
  price: "",
  category: "",
  brand: "",
  images: [],
  stock: "",
  rating: 0,
  numReviews: 0,
  isFeatured: false,
  isActive: true,
  sku: "",
  variants: [],
};

export default function ProductForm({ initialData = null, mode = "create" }) {
  const navigate = useNavigate();
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
        stock: initialData.stock ?? "",
        rating: initialData.rating ?? 0,
        numReviews: initialData.numReviews ?? 0,
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
    const previews = files.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...previews],
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
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
    updatedVariants[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      variants: updatedVariants,
    }));
  };

  const handleSubmit = () => {
    if (mode === "edit") {
      console.log("Update Product:", formData);
    } else {
      console.log("Create Product:", formData);
    }
  };

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
          removeImage={removeImage}
        />
        <StatusSection
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          mode={mode}
          onCancel={() => navigate("/admin/products")}
        />
      </div>
    </div>
  );
}

import { useMemo } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import ProductForm from "../../components/admin/products/ProductForm";
import { adminProducts } from "../../data/adminProductsData";

export default function AdminEditProductPage() {
  const { id } = useParams();

  const product = useMemo(
    () => adminProducts.find((item) => item._id === id),
    [id],
  );

  if (!product) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Product" subtitle="Update product details" />

        <div className="bg-base-100 rounded-2xl border border-base-300 p-6">
          <h2 className="text-xl font-bold">Product not found</h2>
          <p className="text-base-content/60 mt-2">
            The product you are trying to edit does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Product"
        subtitle="Update product details"
        showBack
        backPath="/admin/products"
      />

      <ProductForm initialData={product} mode="edit" />
    </div>
  );
}

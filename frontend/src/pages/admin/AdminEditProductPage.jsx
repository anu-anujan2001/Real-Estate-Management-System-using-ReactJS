import { useEffect } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import ProductForm from "../../components/admin/products/ProductForm";
import useProductStore from "../../store/useProductStore";

export default function AdminEditProductPage() {
  const { id } = useParams();

  const {
    selectedProduct,
    isLoadingProduct,
    fetchProductById,
    clearSelectedProduct,
  } = useProductStore();

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }

    return () => {
      clearSelectedProduct();
    };
  }, [id, fetchProductById, clearSelectedProduct]);

  if (isLoadingProduct) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Edit Product"
          subtitle="Loading product details..."
          showBack
          backPath="/admin/products"
        />

        <div className="bg-base-100 rounded-2xl border border-base-300 p-6">
          <p className="text-base-content/60">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Edit Product"
          subtitle="Update product details"
          showBack
          backPath="/admin/products"
        />

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

      <ProductForm initialData={selectedProduct} mode="edit" />
    </div>
  );
}

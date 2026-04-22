import PageHeader from "../../components/common/PageHeader";
import ProductForm from "../../components/admin/products/ProductForm";

export default function AdminCreateProductPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Product"
        subtitle="Add a new product to your catalog"
        showBack
        backPath="/admin/products"
      />

      <ProductForm />
    </div>
  );
}

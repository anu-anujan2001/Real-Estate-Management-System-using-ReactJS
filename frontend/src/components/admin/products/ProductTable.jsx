import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

export default function ProductTable({ products }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Stock</th>
            <th>SKU</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-xl overflow-hidden">
                      <img
                        src={product.images?.[0] || "/no-image.png"}
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">{product.name}</p>
                    {/* optional: show small secondary info */}
                    <p className="text-xs text-base-content/60">
                      {product.variants?.length > 0
                        ? `${product.variants.length} variants`
                        : "No variants"}
                    </p>
                  </div>
                </div>
              </td>

              <td>{product.category}</td>
              <td>{product.brand}</td>

              <td>Rs. {Number(product.price || 0).toLocaleString()}</td>

              <td>
                {product.stock > 0 ? (
                  <span>{product.stock}</span>
                ) : (
                  <span className="text-red-500 font-medium">Out of stock</span>
                )}
              </td>

              <td>{product.sku || "-"}</td>

              <td>
                <span
                  className={`badge ${
                    product.isActive ? "badge-success" : "badge-error"
                  }`}
                >
                  {product.isActive ? "Active" : "Inactive"}
                </span>
              </td>

              <td>
                <div className="flex justify-end gap-2">
                  <Link
                    to={`/admin/products/edit/${product._id}`}
                    className="btn btn-sm btn-outline"
                  >
                    <Pencil size={16} />
                  </Link>

                  <button className="btn btn-sm btn-outline btn-error">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

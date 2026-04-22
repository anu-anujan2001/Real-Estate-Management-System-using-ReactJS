import { Link } from "react-router-dom";

export default function OfferBanner() {
  return (
    <section className="px-4 md:px-8 lg:px-12 py-8">
      <div className="rounded-3xl bg-primary text-primary-content p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div>
          <p className="uppercase tracking-widest text-sm opacity-80">
            Limited Time Offer
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Up to 50% Off This Week
          </h2>
          <p className="mt-3 opacity-90 max-w-2xl">
            Explore special discounts on selected fashion, electronics, and
            accessories before they’re gone.
          </p>
        </div>

        <Link
          to="/offers"
          className="btn bg-white text-primary hover:bg-base-100 border-none rounded-full px-8"
        >
          Shop Deals
        </Link>
      </div>
    </section>
  );
}

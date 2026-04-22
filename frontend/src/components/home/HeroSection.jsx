import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="px-4 md:px-8 lg:px-12 pt-6 pb-10">
      <div className="hero min-h-[70vh] rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="hero-content flex-col lg:flex-row-reverse gap-10 w-full justify-between">
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900"
            alt="Hero banner"
            className="w-full max-w-sm lg:max-w-lg rounded-2xl object-cover shadow-2xl"
          />

          <div className="max-w-2xl">
            <p className="text-primary-content/80 uppercase tracking-[0.2em] text-sm mb-3">
              New Collection
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Discover Your Style With Premium Products
            </h1>
            <p className="py-5 text-white/75 text-base md:text-lg max-w-xl">
              Shop trending fashion, electronics, accessories, and exclusive
              offers all in one place.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/shop" className="btn btn-primary rounded-full px-6">
                Shop Now
              </Link>
              <Link
                to="/offers"
                className="btn btn-outline text-white border-white rounded-full px-6"
              >
                View Offers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

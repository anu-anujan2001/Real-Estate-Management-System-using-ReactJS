export default function NewsletterSection() {
  return (
    <section className="px-4 md:px-8 lg:px-12 py-12">
      <div className="rounded-3xl bg-base-200 p-8 md:p-12 text-center max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold">
          Subscribe to our newsletter
        </h2>
        <p className="text-base-content/70 mt-2 max-w-2xl mx-auto">
          Stay updated with our latest products, exclusive offers, and special
          discounts delivered straight to your inbox.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="input input-bordered w-full sm:w-80"
          />
          <button className="btn btn-primary">Subscribe</button>
        </div>
      </div>
    </section>
  );
}

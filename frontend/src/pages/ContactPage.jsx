import {
  Mail,
  Phone,
  MapPin,
  Clock3,
  MessageCircleMore,
  Send,
  Globe,
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-10 space-y-10">
        {/* HERO */}
        <section className="text-center max-w-3xl mx-auto">
          <p className="text-primary font-semibold uppercase tracking-wider text-sm">
            Contact Us
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mt-3">
            We’re Here to Help
          </h1>
          <p className="text-base-content/70 mt-4 leading-7">
            Have a question about an order, product, delivery, or return? Our
            support team is ready to help you with quick and friendly service.
          </p>
        </section>

        {/* CONTACT INFO CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Phone size={22} />
            </div>
            <h3 className="font-semibold text-lg">Call Us</h3>
            <p className="text-base-content/60 mt-2">
              Mon - Sat, 8:00 AM - 6:00 PM
            </p>
            <p className="mt-3 font-medium">+94 77 123 4567</p>
          </div>

          <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Mail size={22} />
            </div>
            <h3 className="font-semibold text-lg">Email Support</h3>
            <p className="text-base-content/60 mt-2">
              We usually reply within 24 hours
            </p>
            <p className="mt-3 font-medium">support@shopease.com</p>
          </div>

          <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <MapPin size={22} />
            </div>
            <h3 className="font-semibold text-lg">Store Location</h3>
            <p className="text-base-content/60 mt-2">
              Visit our showroom anytime
            </p>
            <p className="mt-3 font-medium">
              No. 25, Main Street,
              <br />
              Colombo, Sri Lanka
            </p>
          </div>

          <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Clock3 size={22} />
            </div>
            <h3 className="font-semibold text-lg">Working Hours</h3>
            <p className="text-base-content/60 mt-2">
              Customer service availability
            </p>
            <p className="mt-3 font-medium">
              Mon - Sat: 8:00 AM - 6:00 PM
              <br />
              Sunday: Closed
            </p>
          </div>
        </section>

        {/* FORM + DETAILS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CONTACT FORM */}
          <div className="lg:col-span-2 bg-base-100 border border-base-300 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <MessageCircleMore size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Send Us a Message</h2>
                <p className="text-base-content/60 text-sm">
                  Fill out the form and our team will get back to you soon.
                </p>
              </div>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="label font-medium">First Name</label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label font-medium">Last Name</label>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label font-medium">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label font-medium">Phone Number</label>
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="md:col-span-2">
                <label className="label font-medium">Subject</label>
                <input
                  type="text"
                  placeholder="What is this about?"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="md:col-span-2">
                <label className="label font-medium">Message</label>
                <textarea
                  rows="6"
                  placeholder="Write your message here..."
                  className="textarea textarea-bordered w-full"
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="btn btn-primary rounded-xl px-8"
                >
                  <Send size={18} />
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* SIDE INFO */}
          <div className="space-y-6">
            <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Why Contact Us?</h3>
              <ul className="space-y-3 text-base-content/70">
                <li>• Questions about products and availability</li>
                <li>• Help with shipping and delivery</li>
                <li>• Returns, refunds, and exchanges</li>
                <li>• Account or payment support</li>
                <li>• Wholesale and business inquiries</li>
              </ul>
            </div>

            <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Quick Support</h3>
              <div className="space-y-3 text-base-content/70">
                <p>
                  For urgent order issues, call us directly during working
                  hours.
                </p>
                <p>
                  For general support, email us and include your order number
                  for faster help.
                </p>
              </div>
            </div>

            <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex items-center gap-3">
                <a href="#" className="btn btn-outline btn-circle">
                  <Globe size={18} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* MAP + FAQ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* MAP */}
          <div className="bg-base-100 border border-base-300 rounded-2xl p-4 md:p-5 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Find Our Location</h2>
            <div className="rounded-2xl overflow-hidden border border-base-300">
              <iframe
                title="Shop Location"
                src="https://www.google.com/maps?q=Colombo,Sri%20Lanka&z=14&output=embed"
                width="100%"
                height="380"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-base-100 border border-base-300 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <div className="border border-base-300 rounded-xl p-4">
                <h3 className="font-semibold">How long does delivery take?</h3>
                <p className="text-base-content/60 mt-2">
                  Most local orders are delivered within 2 to 5 business days,
                  depending on your location.
                </p>
              </div>

              <div className="border border-base-300 rounded-xl p-4">
                <h3 className="font-semibold">Can I return a product?</h3>
                <p className="text-base-content/60 mt-2">
                  Yes, returns are accepted within 7 days for eligible items in
                  original condition.
                </p>
              </div>

              <div className="border border-base-300 rounded-xl p-4">
                <h3 className="font-semibold">How can I track my order?</h3>
                <p className="text-base-content/60 mt-2">
                  Once your order ships, tracking details will be shared by
                  email or inside your account.
                </p>
              </div>

              <div className="border border-base-300 rounded-xl p-4">
                <h3 className="font-semibold">
                  Do you offer customer support on weekends?
                </h3>
                <p className="text-base-content/60 mt-2">
                  Our standard support is available Monday to Saturday. Weekend
                  replies may be delayed.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

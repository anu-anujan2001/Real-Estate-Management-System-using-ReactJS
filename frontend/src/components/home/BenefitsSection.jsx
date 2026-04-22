import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

export default function BenefitsSection() {
  const items = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Free Shipping",
      desc: "Free delivery for selected orders",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Secure Payment",
      desc: "Your payment information is safe",
    },
    {
      icon: <RotateCcw className="w-6 h-6" />,
      title: "Easy Returns",
      desc: "Simple and quick return process",
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "24/7 Support",
      desc: "Friendly support anytime you need",
    },
  ];

  return (
    <section className="px-4 md:px-8 lg:px-12 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-base-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              {item.icon}
            </div>
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-sm text-base-content/70 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

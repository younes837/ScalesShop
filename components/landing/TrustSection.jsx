import Image from "next/image";
import { Shield, Award, BadgeCheck } from "lucide-react";

const certifications = [
  {
    name: "ISO 9001",
    description: "Quality Management System Certified",
    icon: Shield,
  },
  {
    name: "Industry Leader",
    description: "Top Wholesale Platform 2024",
    icon: Award,
  },
  {
    name: "Verified Business",
    description: "Trusted by 10,000+ Companies",
    icon: BadgeCheck,
  },
];

const testimonials = [
  {
    quote:
      "Streamlined our entire procurement process. The bulk pricing and automated ordering have saved us countless hours.",
    author: "Sarah Chen",
    role: "Procurement Manager",
    company: "TechCorp Solutions",
    image: "/images/testimonials/sarah.jpg",
  },
  {
    quote:
      "The wholesale platform that actually understands business needs. Their customer service is exceptional.",
    author: "Michael Rodriguez",
    role: "Operations Director",
    company: "Global Industries",
    image: "/images/testimonials/michael.jpg",
  },
];

const partners = [
  {
    name: "TechCorp",
    logo: "/images/partners/techcorp.png",
  },
  {
    name: "Global Industries",
    logo: "/images/partners/global.png",
  },
  {
    name: "Innovate Inc",
    logo: "/images/partners/innovate.png",
  },
  {
    name: "SecureNet",
    logo: "/images/partners/securenet.png",
  },
];

export default function TrustSection() {
  return (
    <section id="trust" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {certifications.map((cert) => (
            <div
              key={cert.name}
              className="flex items-center p-6 bg-gray-50 rounded-lg"
            >
              <cert.icon className="w-12 h-12 text-blue-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {cert.name}
                </h3>
                <p className="text-gray-600">{cert.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.author}
                className="bg-gray-50 p-8 rounded-lg"
              >
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="relative w-12 h-12 mr-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.author}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-600">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Logos */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Trusted by Industry Leaders
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="relative h-16 grayscale hover:grayscale-0 transition-all"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

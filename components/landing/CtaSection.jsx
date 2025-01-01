import Link from "next/link";
import { ArrowRight, PhoneCall, Mail } from "lucide-react";

export default function CtaSection() {
  return (
    <section id="cta" className="py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Main CTA Content */}
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Wholesale Experience?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of businesses that trust us for their wholesale
              needs. Get started today and unlock exclusive benefits.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Create Business Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center px-6 py-3 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Catalog
              </Link>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Need More Information?
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Sales Team
                </h4>
                <div className="flex items-center text-gray-600">
                  <PhoneCall className="h-5 w-5 mr-2" />
                  <a
                    href="tel:1-800-123-4567"
                    className="hover:text-blue-600 transition-colors"
                  >
                    1-800-123-4567
                  </a>
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <Mail className="h-5 w-5 mr-2" />
                  <a
                    href="mailto:sales@example.com"
                    className="hover:text-blue-600 transition-colors"
                  >
                    sales@example.com
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Business Hours
                </h4>
                <p className="text-gray-600">
                  Monday - Friday: 9:00 AM - 6:00 PM EST
                </p>
                <p className="text-gray-600">
                  Saturday: 10:00 AM - 4:00 PM EST
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Request Demo
                </h4>
                <p className="text-gray-600 mb-3">
                  See our platform in action with a personalized demo.
                </p>
                <Link
                  href="/request-demo"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Schedule Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

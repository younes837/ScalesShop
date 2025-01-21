import { Navbar } from "@/components/layout/Navbar";
import Image from "next/image";

export default function Page() {
  return (
    <>
      <Navbar />
      <div className="py-16 sm:py-24">
        {/* <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16">
          <div className="relative h-96 lg:h-full">
            <Image
              src="/images/store-front.jpg"
              alt="Our storefront"
              className="absolute inset-0 h-full w-full object-cover rounded-2xl"
              width={800}
              height={600}
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Story
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Founded in 2015, Artisanal Haven began as a small boutique
              dedicated to celebrating craftsmanship and quality. What started
              as a passion project has grown into a curated marketplace where
              artisans and customers come together to share in the appreciation
              of finely crafted goods.
            </p>

            <div className="mt-10 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Our Mission
                </h3>
                <p className="mt-2 text-gray-600">
                  To connect discerning customers with exceptional artisans,
                  fostering a community that values quality, sustainability, and
                  authentic craftsmanship.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Our Values
                </h3>
                <ul className="mt-2 space-y-2 text-gray-600">
                  <li>• Quality craftsmanship in every product</li>
                  <li>• Sustainable and ethical practices</li>
                  <li>• Supporting independent artisans</li>
                  <li>• Building lasting relationships with our community</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      </div>
    </>
  );
}

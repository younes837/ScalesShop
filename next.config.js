import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["tufsovzsocqjqwobmhmh.supabase.co"],
  },
};

export default withNextIntl(nextConfig);

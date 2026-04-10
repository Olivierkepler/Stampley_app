import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Redirect legacy step paths and root shorthand to current check-in step routes
  async redirects() {
    return [
      { source: "/daily-metrics", destination: "/check-in/daily-metrics", permanent: false },
      { source: "/contextual-factors", destination: "/check-in/contextual-factors", permanent: false },
      { source: "/clinical-narrative", destination: "/check-in/clinical-narrative", permanent: false },
      { source: "/weekly-domain", destination: "/check-in/weekly-domain", permanent: false },
      { source: "/stampley-support", destination: "/check-in/stampley-support", permanent: false },
      { source: "/check-in/step1", destination: "/check-in/daily-metrics", permanent: true },
      { source: "/check-in/step2", destination: "/check-in/contextual-factors", permanent: true },
      { source: "/check-in/step3", destination: "/check-in/clinical-narrative", permanent: true },
      { source: "/check-in/step4", destination: "/check-in/weekly-domain", permanent: true },
      { source: "/check-in/step5", destination: "/check-in/stampley-support", permanent: true },
    ];
  },
};

export default nextConfig;
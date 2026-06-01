import type { NextConfig } from "next";

export default function nextConfig(): NextConfig {
	return {
		images: {
			remotePatterns: [
				{
					protocol: "https",
					hostname: "firebasestorage.googleapis.com",
				},
				{
					protocol: "https",
					hostname: "storage.googleapis.com",
				},
			],
		},
	};
}

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Bestie Bite - Cucine in città",
	description:
		"Scopri, recensisci e guadagna con Bestie Bite, l'app italiana per esplorare ristoranti, bar e hotel tramite videorecensioni. Condividi le tue esperienze, partecipa ai Treat e converti i punti in cashback. Disponibile su App Store e Google Play.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} bg-background h-full antialiased`}>
			<body className="bg-background flex min-h-full flex-col">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

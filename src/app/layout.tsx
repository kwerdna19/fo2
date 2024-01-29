import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "leaflet/dist/leaflet.css";
import { type Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "~/components/ThemeProvider";
import { Footer } from "~/components/layout/Footer";
import { Header } from "~/components/layout/header/index";
import { Toaster } from "~/components/ui/toaster";
import "~/styles/globals.css";
import "~/styles/map.css";
import { cn } from "~/utils/styles";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: {
		template: "%s | FO2 DB",
		default: "FO2 DB",
	},
	description: "Fantasy Online 2 Database",
	manifest: "/site.webmanifest",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={cn(
				inter.variable,
				"scroll-smooth antialiased",
				"[font-feature-settings:'ss01']",
			)}
		>
			<body className="flex min-h-screen flex-col bg-background">
				<ThemeProvider>
					<header className="supports-backdrop-blur:bg-background/60 fixed top-0 z-50 w-screen border-b bg-background/95 backdrop-blur">
						<Header className="mx-auto max-w-screen-2xl" />
					</header>
					<main className="flex-1 pt-16">
						<div className="mx-auto h-full max-w-screen-2xl p-3 md:p-4 lg:p-6">
							{children}
						</div>
						<Toaster />
					</main>
					<footer className="mx-auto flex p-2 sm:p-4 md:p-5 lg:p-6 max-w-screen-2xl w-full">
						<Footer />
					</footer>
					<Toaster />
				</ThemeProvider>

				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}

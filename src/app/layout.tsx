import { Footer, Header, ThemeProvider } from "@/components"
import { REVALIDATE_TIME } from "@/config"
import "@/styles/globals.css"
import "@/styles/notion.css"
import { Analytics } from "@vercel/analytics/react"
import { Metadata } from "next"
import localFont from "next/font/local"

export const revalidate = REVALIDATE_TIME

export const metadata: Metadata = {
	title: "Juan Marcos Gonzalez | Portfolio",
	authors: {
		name: "Juan Marcos Gonzalez",
	},
	description:
		"Juan Marcos is a Fullstack Software Developer oriented to the Frontend Development.",
	keywords: [
		"Frontend",
		"Developer",
		"React",
		"Next.js",
		"Angular",
		"TailwindCSS",
		"TypeScript",
		"Laravel",
		"PHP",
	],
};

const display = localFont({
	src: "../assets/fonts/Acorn-Bold.woff2",
	variable: "--font-display",
	display: "swap",
});

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en" className={`!scroll-smooth ${display.variable}`}>
			<body>
        <Analytics />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Header />
          <div className="min-h-[calc(100vh-64px)]">{children}</div>
          <Footer />
        </ThemeProvider>
			</body>
		</html>
	);
}

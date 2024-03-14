import { Inter, Source_Sans_3 } from "next/font/google";

export const body = Inter({
	axes: ["slnt"],
	display: "swap",
	subsets: ["latin", "latin-ext"],
	variable: "--font-body",
});

export const heading = Source_Sans_3({
	display: "swap",
	subsets: ["latin", "latin-ext"],
	variable: "--font-heading",
});

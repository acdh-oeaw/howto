import { Inter } from "next/font/google";

export const body = Inter({
	axes: ["slnt"],
	display: "swap",
	subsets: ["latin", "latin-ext"],
	variable: "--font-body",
});

export const heading = Inter({
	axes: ["slnt"],
	display: "swap",
	subsets: ["latin", "latin-ext"],
	variable: "--font-heading",
});

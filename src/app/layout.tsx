import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Unique Expense Calculator",
	description: "Track and manage your expenses by unique way of calculated mindset, Just by dividing the expense into since day value and More",
	keywords: "unique, expense, calcultor, Purv Jeja, Daily calulator",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html className="dark" lang="en">
			<Head>
				<link rel="icon" href="/public/favicon.ico" />
			</Head>
			<body className={`${inter.className} bg-wheat text-navy dark:bg-navy dark:text-wheat`}>{children}</body>
		</html>
	);
}
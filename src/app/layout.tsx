import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Unique Expense Calculator",
	description: "Track and manage your expenses by unique way of calculated mindset, Just by dividing the expense into since day value and More",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
		<html className="dark" lang="en">
			<body className={`${inter.className} dark:dark:bg-gray-500 dark:text-white`}>{children}</body>
		</html>
  );
}

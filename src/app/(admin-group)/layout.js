import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata = {
    title: 'Admin Panel | Valpro Intertech',
    robots: {
        index: false,
        follow: false,
        googleBot: {
            index: false,
            follow: false,
        },
    },
};

export default function AdminLayout({ children }) {
    return (
        <html lang="id" className="scroll-smooth">
            <body className={`${inter.variable} bg-slate-50 antialiased`} suppressHydrationWarning={true}>
                {children}
            </body>
        </html>
    );
}

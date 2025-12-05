import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ 
    subsets: ["latin"],
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
        <html lang="id">
            <body className={`${inter.className} bg-slate-50 antialiased`}>
                {children}
            </body>
        </html>
    );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import { DM_Sans, Roboto } from "next/font/google";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css"; // Import precompiled Bootstrap css for entire project
import "./globals.css"; // Import global css file (including bootstrap css overrides)
import Navigation from "../components/Navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Add Google Fonts
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "MAZ Tashjee/Tambeeh",
  description: "Home Page",
  icons: [
    { rel: "icon", url: "/favicon_16x16.png", sizes: "16x16" },
    { rel: "icon", url: "/favicon_32x32.png", sizes: "32x32" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png", sizes: "180x180" },
    { rel: "icon", url: "/favicon_32x32.png" }, // Fallback icon
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} ${roboto.variable} antialiased`}>
        <div className="container-fluid bg-primary">
          <div className="row d-flex align-items-center">
            {/* Logo Section - Left aligned */}
            <div className="col-2 d-flex justify-content-start">
              <Image src="/maz_logo_banner.png" alt="logo" width={60} height={60} />
            </div>
            {/* Navbar Section - Right aligned */}
            <div className="col-10">
              <nav className="navbar navbar-expand navbar-light">
                <div className="container-fluid">
                  {/* Conditional Navbar Links */}
                  <Navigation />
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        {children}
      </body>
    </html>
  );
}


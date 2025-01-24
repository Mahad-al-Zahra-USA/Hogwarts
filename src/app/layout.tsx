// import type { Metadata } from "next";
// import localFont from "next/font/local";
// import Image from "next/image";
// import Link from "next/link";
// import "bootstrap/dist/css/bootstrap.min.css"; // Import precompiled Bootstrap css for entire project
// import "./globals.css"; // Import global css file (including bootstrap css overrides)

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// export const metadata: Metadata = {
//   title: "MAZ Tashjee/Tambeeh",
//   description: "Home Page",
//   icons: [
//     { rel: "icon", url: "/favicon_16x16.png", sizes: "16x16" },
//     { rel: "icon", url: "/favicon_32x32.png", sizes: "32x32" },
//     { rel: "apple-touch-icon", url: "/apple-touch-icon.png", sizes: "180x180" },
//     { rel: "icon", url: "/favicon_32x32.png" }, // Fallback icon
//   ],
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
//         <div className="container-fluid d-flex justify-content-between bg-primary">
//           <Image src="/maz_logo_banner.png" alt="logo" width={60} height={60} />
//           <nav className="navbar navbar-expand-sm">
//             <div className="container-fluid">
//               {/* <a className="navbar-brand" href="#">
//                 MAZ Tashjee/Tambeeh
//               </a> */}
//               <button
//                 className="navbar-toggler"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#navbarNav"
//                 aria-controls="navbarNav"
//                 aria-expanded="false"
//                 aria-label="Toggle navigation">
//                 <span className="navbar-toggler-icon"></span>
//               </button>
//               <div className="collapse navbar-collapse" id="navbarNav">
//                 <ul className="navbar-nav">
//                   <li className="nav-item">
//                     <Link className="nav-link" href="/">
//                       Home
//                     </Link>
//                   </li>
//                   <li className="nav-item">
//                     <Link className="nav-link" href="/form">
//                       Form
//                     </Link>
//                   </li>
//                   <li className="nav-item">
//                     <a className="nav-link" href="#">
//                       Reports
//                     </a>
//                   </li>
//                   <li className="nav-item">
//                     <a className="nav-link" href="#">
//                       Settings
//                     </a>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </nav>
//         </div>

//         {/* {main content} */}
//         {children}
//       </body>
//     </html>
//   );
// }
import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css"; // Import precompiled Bootstrap css for entire project
import "./globals.css"; // Import global css file (including bootstrap css overrides)

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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
                  {/* Navbar Links - Right-aligned */}
                  <div className="navbar-nav ms-auto d-flex justify-content-start">
                    <Link className="nav-link fs-4 fs-sm-5 fs-md-6" href="/">
                      Home
                    </Link>
                    <Link className="nav-link fs-4 fs-sm-5 fs-md-6" href="/form">
                      Form
                    </Link>
                  </div>
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


import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ClientWrapper from "./ClientWrapper";
import { PdfProvider } from "@/context/PdfContext";
import PdfViewerWrapper from "./components/PDFViewerWrapper/PdfViewerWrapper";

export const metadata: Metadata = {
  title: "WACE Is Amazing",
  description: "No it's not.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PdfProvider>
          <ClientWrapper>
            <PdfViewerWrapper>
              <Navbar />
              <div className="pt-10 flex-1 w-full">{children}</div>
              <Footer />
            </PdfViewerWrapper>
          </ClientWrapper>
        </PdfProvider>
      </body>
    </html>
  );
}

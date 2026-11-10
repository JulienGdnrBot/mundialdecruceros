import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mundialdecruceros.com"),
  title: {
    default: "Mundial de Cruceros · Haciendo navegar tus sueños desde 1980",
    template: "%s · Mundial de Cruceros",
  },
  description:
    "Mundial de Cruceros, especialistas en cruceros desde 1980 en Bogotá, Colombia.",
  // Hasta el lanzamiento el sitio no se indexa: el contenido está por definir
  // con el cliente y no debe competir con mundialdecruceros.com actual.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CO" className={`${jost.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

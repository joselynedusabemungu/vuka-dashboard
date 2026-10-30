import "./globals.css";
import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-nunito",
});

export const metadata = {
  title: "Vuka",
  description: "Turn your scroll time into career pathways.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}

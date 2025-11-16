import "./globals.css";

export const metadata = {
  title: "Scuola Finder",
  description:
    "Scuola Finder ti aiuta a esplorare tipi di istruzione, settori e scuole a Milano",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}

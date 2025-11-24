import "./globals.css";

export const metadata = {
  title: "Scuola Finder",
  description:
    "Scuola Finder ti aiuta a esplorare tipi di istruzione, settori e scuole a Milano",
  verification: {
    google: "iv4xz7NfdtVpI6PthR0aOD-_ceDY2D4VwVTzG04Zd40",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}

import "./globals.css";
import { AuthProvider } from "../context/AuthProvider";
import { FinanceProvider } from "../context/FinanceProvider";
import AppShell from "../components/AppShell";

export const metadata = {
  title: "FinWise",
  description: "Personal finance companion for students & young earners",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <FinanceProvider>
            <AppShell>{children}</AppShell>
          </FinanceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
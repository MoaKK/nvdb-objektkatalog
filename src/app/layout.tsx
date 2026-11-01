import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AppSidebar } from "@/components/app-sidebar";
import { Innlogging } from "@/components/innlogging";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "NVDB Objektkatalog",
  description: "Hvilke egenskaper som skal registreres for hvert vegobjekt",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb" className={`${fontSans.variable} ${fontMono.variable}`}>
      <body className="antialiased">
        <Providers>
          <SidebarProvider style={{ "--sidebar-width": "22rem" } as React.CSSProperties}>
            <AppSidebar />
            <SidebarInset className="min-w-0">
              <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 md:px-4">
                <SidebarTrigger variant="outline" size="icon-lg" title="Vis eller skjul menyen" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <span className="truncate text-sm text-muted-foreground">Krav til innlevering av data</span>
                <span className="ml-auto shrink-0">
                  <Innlogging />
                </span>
              </header>
              <main className="flex-1 p-4 md:p-6">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
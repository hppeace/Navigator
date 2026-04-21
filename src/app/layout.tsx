import type { Metadata } from "next";
import "@fontsource-variable/noto-sans-sc";
import "@fontsource-variable/noto-serif-sc";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "领航工作站一人一策工作台",
  description: "用于成员成长档案、思想动态和问题建议跟踪的领航工作站工作台。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

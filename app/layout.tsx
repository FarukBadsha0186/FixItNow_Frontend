import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


export default  async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

   //const user = await getMe();
  
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning >
        
   
        <Toaster position="top-right" />
        {children}
        </body>
    </html>
  );
}
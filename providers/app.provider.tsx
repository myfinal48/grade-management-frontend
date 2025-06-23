import {ThemeProvider , QueryProvider} from "@/providers";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

export function AppProvider({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SessionProvider>
                <QueryProvider>{children}</QueryProvider>
            </SessionProvider>
            <Toaster position={"bottom-right"} richColors={true} closeButton={true} />
        </ThemeProvider>
    )
}
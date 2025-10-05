import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserNav } from "@/components/layout"
import type { AuthSession } from "@/types/next-auth"
import {ModeToggle, Logo} from "@/components/global";

interface NavbarProps {
    session: AuthSession
}

export function Navbar({ session }: Readonly<NavbarProps>) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-1 items-center justify-between gap-2 px-4">
                <Logo />
                <div className="flex items-center gap-2">
                    <ModeToggle />
                    <UserNav session={session} />
                </div>
            </div>
        </header>
    )
}

import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-zinc-950 flex font-sans text-zinc-300">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <TopNav />
                <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

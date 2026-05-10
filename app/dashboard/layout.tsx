import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";

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
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <TopNav />
                <div className="flex-1 overflow-y-auto w-full">
                    <main className="max-w-7xl mx-auto p-6 md:p-8">
                        {children}
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

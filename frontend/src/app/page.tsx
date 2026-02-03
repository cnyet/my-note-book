import Link from "next/link";

export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                Welcome to Work-Agents
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-10">
                Project reset complete. Ready for clean-slate refactoring.
            </p>
            <div className="flex gap-4">
                <Link
                    href="/agents"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold"
                >
                    Get Started
                </Link>
                <Link
                    href="/blog"
                    className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all"
                >
                    Read Blog
                </Link>
            </div>
        </div>
    );
}

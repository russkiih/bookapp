import { BookingForm } from "@/components/booking-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogInIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center relative">
          <div className="absolute right-1 placeholder:top-0">
            <Link href="/admin">
              <LogInIcon className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
          </div>
          <h1 className="text-5xl font-bold text-primary mb-3 tracking-tight">
            Meet with Rusalina
          </h1>
          <p className="text-lg text-muted-foreground">
            <a
              href="https://maps.app.goo.gl/CeCVRLxHVeV2hnpt6"
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              94 Gansevoort New York, NY 10014
            </a>
          </p>
        </header>

        <main className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <BookingForm />
        </main>
      </div>
    </div>
  );
}

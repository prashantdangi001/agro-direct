import Link from 'next/link';
import RegistrationForm from '@/components/auth/RegistrationForm';

export default function RegisterPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col relative overflow-hidden">
      
      {/* Background Decorations from your HTML */}
      <div className="fixed top-24 -right-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-24 -left-16 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -z-10"></div>

      {/* Minimal Header (No nav links during checkout/auth flows) */}
      <header className="w-full h-16 flex items-center px-4 md:px-12 max-w-[1280px] mx-auto relative z-10">
        <Link href="/" className="text-2xl font-bold text-primary tracking-tight">AgroDirect</Link>
      </header>

      <main className="flex-grow flex items-center justify-center py-12 px-4 relative z-10">
        <div className="max-w-[800px] w-full flex flex-col gap-8">
          
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-on-surface tracking-tight">Join the Agricultural Network</h1>
            <p className="text-lg text-on-surface-variant">Connecting regional farmers directly to professional wholesale buyers.</p>
          </div>

          {/* Client-Side Interactive Form */}
          <RegistrationForm />

          {/* Footer Compliance Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-on-surface-variant opacity-70">
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-primary transition-colors" href="#">Farmer Support</a>
            <a className="hover:text-primary transition-colors" href="#">Contact</a>
          </div>
          
        </div>
      </main>
    </div>
  );
}
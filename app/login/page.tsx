import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full bg-surface text-on-surface">
      
      {/* Left Side: Image (Hidden on Mobile) */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-container-highest">
        {/* Replace this src with your actual high-res farm image from the HTML */}
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUgCAwiMBNOAW_6HIvN7knlfmqZuP0_nrSoR0oLgsP8RqbVi9CjfqlmgfWzfRfU1-K-qFu8aIjDIGd-Da2x5CQ7_jL7jqtbVIq5sZbInMxcy62RineY0SlFm4xXt3YkaNRcvrwk7c2ZB6Qe5SfwuFohnP_OAeQhGBBcRqPAORamlKUPOYfx3k977XAfhxzfprd22RKOb5WWoPoZRWNHpKv_g5MJtdLXRUkJNVZpZxteUBsexVppS1XosWU4i6ycSfeg4iH8U4iCdqK" 
          alt="Lush emerald green soybean field at dawn" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
        
        <div className="relative z-10 p-12 flex flex-col justify-end h-full text-white">
          <Link href="/" className="inline-block">
            <h1 className="text-5xl font-bold mb-4 tracking-tight hover:opacity-90 transition-opacity">Khetify</h1>
          </Link>
          <p className="text-lg max-w-md opacity-90 leading-relaxed font-medium">
            Connecting tech-forward farmers with the regional marketplace. Efficient, grounded, and revitalizing commerce for the modern agricultural world.
          </p>
        </div>
      </section>

      {/* Right Side: Form */}
      <section className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 relative">
        
        {/* Brand Logo for Mobile (Hidden on Desktop) */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/" className="text-2xl font-bold text-primary tracking-tight">Khetify</Link>
        </div>

        {/* The Client-Side Form Component */}
        <LoginForm />

        {/* Footer Small Print */}
        <div className="absolute bottom-8 text-center w-full max-w-md px-6">
          <p className="text-xs font-medium text-outline">
            © 2024 Khetify. Soil to Storefront.<br/>
            By signing in, you agree to our{' '}
            <a href="#" className="underline hover:text-primary transition-colors">Terms of Service</a> and{' '}
            <a href="#" className="underline hover:text-primary transition-colors">Privacy Policy</a>.
          </p>
        </div>
        
      </section>
      
    </main>
  );
}
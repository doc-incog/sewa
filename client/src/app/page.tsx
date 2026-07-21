import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Zap,
  Wrench,
  Hammer,
  Paintbrush,
  Snowflake,
  SprayCan,
  Bug,
  TreePine,
  Search,
  CalendarCheck,
  ShieldCheck,
  ArrowRight,
  Home as HomeIcon,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const services = [
  { name: "Electrician", icon: Zap, category: "Electrical", color: "text-amber-500 bg-amber-50" },
  { name: "Plumber", icon: Wrench, category: "Plumbing", color: "text-sky-500 bg-sky-50" },
  { name: "Carpenter", icon: Hammer, category: "Woodwork", color: "text-orange-500 bg-orange-50" },
  { name: "Painter", icon: Paintbrush, category: "Painting", color: "text-violet-500 bg-violet-50" },
  { name: "AC Repair", icon: Snowflake, category: "Appliance", color: "text-cyan-500 bg-cyan-50" },
  { name: "Cleaning", icon: SprayCan, category: "Cleaning", color: "text-emerald-500 bg-emerald-50" },
  { name: "Pest Control", icon: Bug, category: "Pest Control", color: "text-red-500 bg-red-50" },
  { name: "Gardener", icon: TreePine, category: "Garden", color: "text-green-600 bg-green-50" },
];

const steps = [
  {
    icon: Search,
    title: "Find a Service",
    description: "Browse our catalog or search for exactly what you need. Filter by location and availability.",
  },
  {
    icon: CalendarCheck,
    title: "Book a Provider",
    description: "Pick a verified provider, choose a date and time that works for you.",
  },
  {
    icon: ShieldCheck,
    title: "Get It Done",
    description: "Your provider arrives, completes the job, and you pay securely through the platform.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-warmgray-50">
      <Navbar />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800" />
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm font-medium mb-6">
                <MapPin className="w-3.5 h-3.5" />
                Trusted across Nepal
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                Your home deserves
                <br />
                <span className="text-primary-200">the best hands</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-100/90 mb-8 max-w-xl leading-relaxed">
                Find verified electricians, plumbers, carpenters, and more. Book reliable
                professionals for every home need.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors shadow-warm-lg"
                >
                  Find a Provider
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/provider-signup"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                >
                  Join as Provider
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-warmgray-50 to-transparent" />
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-warmgray-900 mb-3">
                Services for every home need
              </h2>
              <p className="text-warmgray-500 max-w-lg mx-auto">
                From quick fixes to major repairs, we have professionals for it all.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {services.map((service) => (
                <Link
                  key={service.name}
                  href={`/services`}
                  className="group bg-white p-5 rounded-2xl shadow-card hover:shadow-card-hover border border-warmgray-100 hover:border-primary-200 transition-all duration-200"
                >
                  <div className={`w-11 h-11 rounded-xl ${service.color} flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform`}>
                    <service.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-warmgray-900 text-sm">{service.name}</h3>
                  <p className="text-xs text-warmgray-500 mt-0.5">{service.category}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-warmgray-900 mb-3">
                How it works
              </h2>
              <p className="text-warmgray-500 max-w-md mx-auto">
                Three simple steps to get your home service done.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {steps.map((step, i) => (
                <div key={i} className="relative">
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-warmgray-200" />
                  )}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-5">
                      <div className="w-16 h-16 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                        <step.icon className="w-7 h-7 text-primary-600" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-warm">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-warmgray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-warmgray-500 leading-relaxed max-w-xs">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to get started?</h2>
                  <p className="text-primary-100/80 text-lg">
                    Join thousands of homeowners who trust Sewa for their home services.
                  </p>
                </div>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors shadow-warm-lg shrink-0"
                >
                  Sign up free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-gradient-to-br from-warmgray-800 to-warmgray-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-8 mb-10">
              <div className="md:col-span-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center">
                    <HomeIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-lg font-bold">sewa</span>
                </div>
                <p className="text-warmgray-400 text-sm leading-relaxed">
                  Trusted home services platform connecting homeowners with verified professionals across Nepal.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-3">Services</h4>
                <ul className="space-y-2 text-sm text-warmgray-400">
                  <li><Link href="/services" className="hover:text-white transition-colors">Browse All</Link></li>
                  <li><Link href="/search" className="hover:text-white transition-colors">Find Providers</Link></li>
                  <li><Link href="/provider-signup" className="hover:text-white transition-colors">Become a Provider</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-3">Company</h4>
                <ul className="space-y-2 text-sm text-warmgray-400">
                  <li><span className="hover:text-white transition-colors cursor-pointer">About Us</span></li>
                  <li><span className="hover:text-white transition-colors cursor-pointer">Careers</span></li>
                  <li><span className="hover:text-white transition-colors cursor-pointer">Blog</span></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-3">Contact</h4>
                <ul className="space-y-2 text-sm text-warmgray-400">
                  <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> info@sewa.com</li>
                  <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> +977-1-4XXXXXX</li>
                  <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Kathmandu, Nepal</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-warmgray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-warmgray-500 text-xs">&copy; 2024 Sewa. All rights reserved.</p>
              <div className="flex gap-4 text-xs text-warmgray-500">
                <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
                <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

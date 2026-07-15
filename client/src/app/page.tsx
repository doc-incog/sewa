import Link from "next/link";
import Navbar from "@/components/Navbar";

const services = [
  { name: "Electrician", icon: "⚡", category: "Electrical" },
  { name: "Plumber", icon: "🔧", category: "Plumbing" },
  { name: "Carpenter", icon: "🪚", category: "Woodwork" },
  { name: "Painter", icon: "🎨", category: "Painting" },
  { name: "AC Repair", icon: "❄️", category: "Appliance" },
  { name: "Cleaning", icon: "🧹", category: "Cleaning" },
  { name: "Pest Control", icon: "🐛", category: "Pest Control" },
  { name: "Gardener", icon: "🌱", category: "Garden" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Find Trusted Home Services
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Connect with verified electricians, plumbers, carpenters, and more.
                Book reliable services for your home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors text-lg"
                >
                  Get Started
                </Link>
                <Link
                  href="/provider-signup"
                  className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-lg"
                >
                  Become a Provider
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Our Services
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all cursor-pointer text-center"
                >
                  <span className="text-4xl block mb-3">{service.icon}</span>
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{service.category}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose a Service</h3>
                <p className="text-gray-500">Browse our catalog of home services and pick what you need.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Book a Provider</h3>
                <p className="text-gray-500">Select a verified provider, pick a date and time.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Get It Done</h3>
                <p className="text-gray-500">The provider arrives, completes the job, and you pay securely.</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Sewa</h3>
            <p className="text-gray-400">Your trusted home services platform</p>
            <p className="text-gray-500 text-sm mt-8">&copy; 2024 Sewa. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

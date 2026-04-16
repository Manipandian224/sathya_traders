import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-neutral-bg pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-heading font-bold text-tertiary mb-4">Sathya Traders</h3>
            <p className="text-neutral-bg/80 max-w-sm">
              Bringing the authentic taste of traditional homemade appalams and snacks to your household. Premium quality, unforgettable flavor.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-tertiary mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/shop" className="text-neutral-bg/80 hover:text-white transition-colors">Shop All</a></li>
              <li><a href="/about" className="text-neutral-bg/80 hover:text-white transition-colors">Our Story</a></li>
              <li><a href="/contact" className="text-neutral-bg/80 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-tertiary mb-4">Contact</h4>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Phone size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Mail size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <MapPin size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-sm text-neutral-bg/60">
          <p>© {new Date().getFullYear()} Sathya Traders. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

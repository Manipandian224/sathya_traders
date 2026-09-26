import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-neutral-bg pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-heading font-bold text-tertiary mb-4">Sathya Traders</h3>
            <p className="text-neutral-bg/80 max-w-sm leading-relaxed">
              Sathya Traders, established in 2000 in Madurai, Tamil Nadu, is a trusted manufacturer and supplier of quality New Star Appalam. We focus on pure ingredients, traditional recipes, and customer satisfaction.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-tertiary mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-neutral-bg/80 hover:text-white transition-colors">Shop Appalam</Link></li>
              <li><Link to="/appalam-in-madurai" className="text-neutral-bg/80 hover:text-white transition-colors">Appalam in Madurai</Link></li>
              <li><Link to="/contact" className="text-neutral-bg/80 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-tertiary mb-4">Contact Info</h4>
            <div className="space-y-3 text-sm text-neutral-bg/80 mb-4">
              <p className="flex items-center gap-2"><Phone size={16} className="text-tertiary shrink-0" /> +91 96597 98598</p>
              <p className="flex items-center gap-2"><Mail size={16} className="text-tertiary shrink-0" /> Sathyasaravanan0183@gmail.com</p>
              <p className="flex items-start gap-2"><MapPin size={16} className="text-tertiary shrink-0 mt-1" /> V4XR+6RR, Madurai, Tamil Nadu 625009, India</p>
            </div>
            <div className="flex space-x-3">
              <a href="tel:+919659798598" aria-label="Phone Sathya Traders" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Phone size={18} />
              </a>
              <a href="mailto:Sathyasaravanan0183@gmail.com" aria-label="Email Sathya Traders" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Mail size={18} />
              </a>
              <a href="https://maps.app.goo.gl/szFDneifrcyNrMiTA" target="_blank" rel="noopener noreferrer" aria-label="Sathya Traders Location Map" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <MapPin size={18} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-sm text-neutral-bg/60">
          <p>© {new Date().getFullYear()} Sathya Traders. All rights reserved. | Authentic New Star Appalam in Madurai.</p>
        </div>
      </div>
    </footer>
  );
}

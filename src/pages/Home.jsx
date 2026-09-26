import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Award, Truck, MapPin, Phone, Mail } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getFeaturedProducts } from '../data/products';
import SEO from '../components/SEO';

const FEATURED_PRODUCTS = getFeaturedProducts();

const homeSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Sathya Traders',
    'url': 'https://sathyatraders.in/',
    'logo': 'https://sathyatraders.in/logo.png',
    'image': 'https://sathyatraders.in/images/sathyatraders.png',
    'telephone': '+91 96597 98598',
    'email': 'Sathyasaravanan0183@gmail.com',
    'priceRange': '₹₹',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'V4XR+6RR',
      'addressLocality': 'Madurai',
      'addressRegion': 'Tamil Nadu',
      'postalCode': '625009',
      'addressCountry': 'IN'
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'opens': '09:00',
        'closes': '18:00'
      }
    ]
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Sathya Traders',
    'url': 'https://sathyatraders.in/',
    'logo': 'https://sathyatraders.in/logo.png'
  }
];

export default function Home() {
  return (
    <div>
      <SEO
        title="Sathya Traders | Appalam in Madurai | New Star Appalam"
        description="Sathya Traders offers New Star Appalam in Madurai. Explore quality appalam in different sizes and order online or contact us for more details."
        canonical="https://sathyatraders.in/"
        keywords="Appalam in Madurai, New Star Appalam, Sathya Traders, Buy Appalam Online, Appalam Shop in Madurai"
        ogType="website"
        ogImage="/images/sathyatraders.png"
        schema={homeSchema}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-neutral-bg pt-16 pb-32">
        <div className="absolute top-0 right-0 -m-32 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 -m-32 w-[600px] h-[600px] bg-tertiary/10 rounded-full blur-3xl mix-blend-multiply"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 pr-0 md:pr-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-primary font-bold text-sm tracking-widest uppercase mb-3 block">
                Sathya Traders • Madurai
              </span>
              <h1 className="text-5xl md:text-6xl font-heading font-bold text-secondary mb-6 leading-tight">
                Premium Appalam <br /><span className="text-primary italic">in Madurai</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                Experience the authentic taste of tradition with New Star Appalam from Sathya Traders. Made with pure ingredients and traditional recipes in Madurai, Tamil Nadu.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/shop" className="bg-primary hover:bg-primary-dark text-white text-lg font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 inline-flex items-center group cursor-pointer">
                  Shop Now 
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/appalam-in-madurai" className="bg-white hover:bg-gray-50 text-secondary border border-gray-200 text-lg font-bold py-4 px-6 rounded-full shadow-sm transition-all inline-flex items-center">
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
          <div className="w-full md:w-1/2 mt-16 md:mt-0 relative">
             <motion.img 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                src="images/sathyatraders.png"
                alt="Sathya Traders New Star Appalam in Madurai"
                loading="eager"
                width="800"
                height="900"
                className="w-full h-auto rounded-[2rem] shadow-2xl object-cover aspect-[4/4.5]"
             />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-heading font-bold text-secondary"
            >
              Our New Star Appalam
            </motion.h2>
            <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-base">
              Explore our genuine New Star Appalam range available in multiple sizes to suit all households and bulk buyers in Madurai and across Tamil Nadu.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-12">
            {FEATURED_PRODUCTS.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/shop" className="inline-flex items-center text-primary font-bold text-lg hover:underline">
              View All Available Appalam Sizes <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Available Appalam Sizes Section */}
      <section className="py-20 bg-neutral-bg border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary">
              Available Appalam Sizes
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-3 rounded-full"></div>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              We offer New Star Appalam in three distinct sizes crafted for perfect crispness and taste.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
              <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Size 2.5</span>
              <h3 className="text-2xl font-bold text-secondary mb-3">New Star Appalam Small</h3>
              <p className="text-gray-600 text-sm mb-6 flex-grow">
                Ideal for everyday quick snacks and family meals. Crispy texture and quick frying time.
              </p>
              <Link to="/product/1" className="text-primary font-bold text-sm hover:underline inline-flex items-center">
                View Product Details <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
              <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Size 3.5</span>
              <h3 className="text-2xl font-bold text-secondary mb-3">New Star Appalam Medium</h3>
              <p className="text-gray-600 text-sm mb-6 flex-grow">
                Our classic medium size appalam, perfect for traditional South Indian lunch spreads.
              </p>
              <Link to="/product/2" className="text-primary font-bold text-sm hover:underline inline-flex items-center">
                View Product Details <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
              <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Size 4.5</span>
              <h3 className="text-2xl font-bold text-secondary mb-3">New Star Appalam Large</h3>
              <p className="text-gray-600 text-sm mb-6 flex-grow">
                Large size appalam designed for grand festive feasts, catering, and bulk dining needs.
              </p>
              <Link to="/product/3" className="text-primary font-bold text-sm hover:underline inline-flex items-center">
                View Product Details <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Sathya Traders Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary">
              Why Choose Sathya Traders
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-3 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">100% Pure & Natural</h3>
              <p className="text-gray-600 text-sm">
                Prepared using genuine black gram flour, high quality spices, and traditional recipes without artificial preservatives.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">Established Quality Since 2000</h3>
              <p className="text-gray-600 text-sm">
                Over two decades of experience serving trusted appalam products to families and businesses in Madurai.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">Bulk Orders & Delivery</h3>
              <p className="text-gray-600 text-sm">
                We cater to both retail customers and bulk quantity orders with reliable delivery options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Sathya Traders Section */}
      <section className="py-20 bg-neutral-bg border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-6">
                About Sathya Traders
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Sathya Traders, established in 2000, is a trusted business located in Madurai, Tamil Nadu. We specialize in producing and distributing high quality New Star Appalam.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Our focus has always been on customer satisfaction, transparent dealings, and consistent taste. Whether you are looking for household consumption or commercial bulk orders, Sathya Traders delivers quality appalam crafted to perfection.
              </p>
              <Link to="/appalam-in-madurai" className="inline-flex items-center text-primary font-bold hover:underline">
                Read full details about our Madurai business <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>

            {/* Contact Sathya Traders Summary */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-2xl font-heading font-bold text-secondary">
                Contact Sathya Traders
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary mt-1">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-secondary">Phone / WhatsApp</h3>
                    <p className="text-gray-600">+91 96597 98598</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary mt-1">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-secondary">Email Address</h3>
                    <p className="text-gray-600">Sathyasaravanan0183@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary mt-1">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-secondary">Address</h3>
                    <p className="text-gray-600 text-sm">V4XR+6RR, Madurai, Tamil Nadu 625009, India</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link to="/contact" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-colors text-center block">
                  Send Inquiry or Place Order
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

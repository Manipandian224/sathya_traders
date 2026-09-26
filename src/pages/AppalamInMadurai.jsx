import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, Mail, ArrowRight, HelpCircle, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';

const appalamMaduraiSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Sathya Traders',
    'url': 'https://sathyatraders.in/appalam-in-madurai',
    'logo': 'https://sathyatraders.in/logo.png',
    'image': 'https://sathyatraders.in/images/sathyatraders.png',
    'telephone': '+91 96597 98598',
    'email': 'Sathyasaravanan0183@gmail.com',
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
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'Where can I buy appalam in Madurai?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'You can buy authentic New Star Appalam directly from Sathya Traders located at V4XR+6RR, Madurai, Tamil Nadu 625009, or order online at https://sathyatraders.in/shop.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What appalam products does Sathya Traders offer?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Sathya Traders offers high quality New Star Appalam in three main sizes: 2.5 Small, 3.5 Medium, and 4.5 Large.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Can I order appalam online?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, Sathya Traders offers convenient online ordering for households and bulk buyers across Madurai and Tamil Nadu directly through our website.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What sizes of New Star Appalam are available?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'New Star Appalam is available in Size 2.5 (Small), Size 3.5 (Medium), and Size 4.5 (Large) packaged for fresh delivery.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Where is Sathya Traders located?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Sathya Traders is located at V4XR+6RR, Madurai, Tamil Nadu 625009, India. Contact us at +91 96597 98598.'
        }
      }
    ]
  }
];

export default function AppalamInMadurai() {
  return (
    <div className="bg-neutral-bg min-h-screen py-16">
      <SEO
        title="Appalam in Madurai | Sathya Traders - New Star Appalam"
        description="Looking for quality appalam in Madurai? Sathya Traders provides authentic New Star Appalam in Small (2.5), Medium (3.5), and Large (4.5) sizes with online ordering and bulk delivery."
        canonical="https://sathyatraders.in/appalam-in-madurai"
        keywords="Appalam in Madurai, Appalam shop in Madurai, New Star Appalam Madurai, Sathya Traders Madurai, Buy Appalam Online Madurai"
        ogType="website"
        ogImage="/images/sathyatraders.png"
        schema={appalamMaduraiSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Banner */}
        <div className="bg-white rounded-3xl p-8 md:p-14 shadow-sm border border-gray-100 mb-12">
          <span className="text-primary font-bold text-xs tracking-widest uppercase mb-3 block">
            Local Heritage • Madurai, Tamil Nadu
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-secondary mb-6 leading-tight">
            Appalam in Madurai
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl leading-relaxed mb-8">
            Madurai is world-renowned for its rich culinary tradition and authentic papad / appalam production. Established in 2000, <strong>Sathya Traders</strong> has been a trusted supplier of premium <strong>New Star Appalam</strong> for over two decades, delivering crispy, pure, and delicious appalams to homes, caterers, and food businesses across Madurai and Tamil Nadu.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/shop" className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all inline-flex items-center">
              Explore Products <ArrowRight className="ml-2" size={18} />
            </Link>
            <Link to="/contact" className="bg-gray-100 hover:bg-gray-200 text-secondary font-bold py-4 px-8 rounded-2xl transition-all">
              Contact Sathya Traders
            </Link>
          </div>
        </div>

        {/* Product Sizes Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-12">
          <h2 className="text-3xl font-heading font-bold text-secondary mb-4">
            Our New Star Appalam Range in Madurai
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl">
            We prepare our appalams using traditional solar drying techniques, pure urad dal (black gram flour), and natural ingredients. Choose from our standard sizes:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-bg p-6 rounded-2xl border border-gray-100">
              <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase">Size 2.5</span>
              <h3 className="text-xl font-bold text-secondary mt-3 mb-2">New Star Appalam (Small)</h3>
              <p className="text-gray-600 text-sm mb-4">
                Compact size perfect for daily meals, light snacks, and quick frying. Loved by families across Madurai.
              </p>
              <Link to="/product/1" className="text-primary font-bold text-sm hover:underline">
                View Small Appalam →
              </Link>
            </div>

            <div className="bg-neutral-bg p-6 rounded-2xl border border-gray-100">
              <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase">Size 3.5</span>
              <h3 className="text-xl font-bold text-secondary mt-3 mb-2">New Star Appalam (Medium)</h3>
              <p className="text-gray-600 text-sm mb-4">
                Standard medium size ideal for South Indian thali meals, family gatherings, and everyday dining.
              </p>
              <Link to="/product/2" className="text-primary font-bold text-sm hover:underline">
                View Medium Appalam →
              </Link>
            </div>

            <div className="bg-neutral-bg p-6 rounded-2xl border border-gray-100">
              <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase">Size 4.5</span>
              <h3 className="text-xl font-bold text-secondary mt-3 mb-2">New Star Appalam (Large)</h3>
              <p className="text-gray-600 text-sm mb-4">
                Large size crafted for festive banquets, marriage catering, restaurants, and bulk consumption.
              </p>
              <Link to="/product/3" className="text-primary font-bold text-sm hover:underline">
                View Large Appalam →
              </Link>
            </div>
          </div>
        </div>

        {/* Why Madurai Chooses Sathya Traders */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-12">
          <h2 className="text-3xl font-heading font-bold text-secondary mb-6">
            Why Choose Sathya Traders for Appalam in Madurai?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <CheckCircle2 className="text-primary mt-1 shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-secondary text-lg">Authentic Quality Ingredients</h3>
                <p className="text-gray-600 text-sm">
                  We use pure urad dal flour and natural spices, guaranteeing consistent taste, crisp texture, and puffing quality.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CheckCircle2 className="text-primary mt-1 shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-secondary text-lg">Trusted Since 2000</h3>
                <p className="text-gray-600 text-sm">
                  Established in 2000 in Madurai, Sathya Traders has built a reputation based on customer trust and quality products.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CheckCircle2 className="text-primary mt-1 shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-secondary text-lg">Retail & Bulk Supply</h3>
                <p className="text-gray-600 text-sm">
                  Whether you need a single 40kg pack or large volume orders for catering, we supply in custom quantities with free delivery options on bulk orders.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CheckCircle2 className="text-primary mt-1 shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-secondary text-lg">Direct Doorstep Delivery</h3>
                <p className="text-gray-600 text-sm">
                  Order online directly from our website and get fresh appalams delivered right to your home or shop in Madurai.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-12">
          <div className="flex items-center space-x-3 mb-8">
            <HelpCircle className="text-primary" size={28} />
            <h2 className="text-3xl font-heading font-bold text-secondary">
              Frequently Asked Questions (FAQ)
            </h2>
          </div>

          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-bold text-secondary mb-2">Where can I buy appalam in Madurai?</h3>
              <p className="text-gray-600">
                You can buy authentic New Star Appalam directly from Sathya Traders located at V4XR+6RR, Madurai, Tamil Nadu 625009, or order online through our shop page.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-bold text-secondary mb-2">What appalam products does Sathya Traders offer?</h3>
              <p className="text-gray-600">
                Sathya Traders offers high quality New Star Appalam in three main sizes: Size 2.5 (Small), Size 3.5 (Medium), and Size 4.5 (Large).
              </p>
            </div>

            <div className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-bold text-secondary mb-2">Can I order appalam online?</h3>
              <p className="text-gray-600">
                Yes, Sathya Traders accepts online orders directly through our website with doorstep delivery options across Madurai and surrounding areas.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-bold text-secondary mb-2">What sizes of New Star Appalam are available?</h3>
              <p className="text-gray-600">
                We offer Size 2.5 Small, Size 3.5 Medium, and Size 4.5 Large, suited for daily meals, hotel catering, and bulk dining needs.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-secondary mb-2">Where is Sathya Traders located?</h3>
              <p className="text-gray-600">
                Sathya Traders is located at V4XR+6RR, Madurai, Tamil Nadu 625009, India. You can contact us by phone at +91 96597 98598 or email at Sathyasaravanan0183@gmail.com.
              </p>
            </div>
          </div>
        </div>

        {/* Local Business Contact CTA */}
        <div className="bg-primary text-white rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl font-heading font-bold mb-2">Order Appalam in Madurai Today</h2>
            <p className="text-white/90 max-w-xl">
              Contact Sathya Traders for bulk pricing, custom quantities, or place your order directly online.
            </p>
          </div>
          <Link
            to="/contact"
            className="bg-white text-primary hover:bg-gray-100 font-bold py-4 px-8 rounded-2xl shadow-md transition-all shrink-0"
          >
            Contact Us Now
          </Link>
        </div>

      </div>
    </div>
  );
}

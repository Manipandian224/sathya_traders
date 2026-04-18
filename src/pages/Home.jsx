import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getFeaturedProducts } from '../data/products';

const FEATURED_PRODUCTS = getFeaturedProducts();

export default function Home() {
  return (
    <div>
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
              <h1 className="text-5xl md:text-7xl mb-6 leading-tight">
                Authentic <br /> Homemade <span className="text-primary italic">Appalam</span>
                <br /> Delivered Fresh
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Experience the true taste of tradition with our premium, hand-crafted appalams and snacks, made with love for your family.
              </p>
              <Link to="/shop" className="bg-primary hover:bg-primary-dark text-white text-lg font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 inline-flex items-center group cursor-pointer">
                Shop Now 
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
          <div className="w-full md:w-1/2 mt-16 md:mt-0 relative">
             <motion.img 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                src="images/sathyatraders.png"
                alt="Sathya Traders"
                className="w-full h-auto rounded-[2rem] shadow-2xl object-cover aspect-[4/4.5]"
             />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl"
            >
              Our Best Sellers
            </motion.h2>
            <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {FEATURED_PRODUCTS.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

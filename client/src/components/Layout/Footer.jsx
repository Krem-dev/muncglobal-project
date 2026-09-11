import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-teal-500 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <motion.div 
            className="col-span-1 md:col-span-2 lg:col-span-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <img 
                src="/images/logo.png" 
                alt="MUNC-GLOBAL Logo" 
                className="h-12 mr-3"
              />
              <h2 className="text-2xl font-bold">MUNC-GLOBAL</h2>
            </div>
            <p className="text-gray-300 mb-4">
              Empowering youth through leadership development, cultural exchange, and sustainable impact programs.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://x.com/muncglobal?s=21" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@muncglobal" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15.5 3.5h-1.75a3.93 3.93 0 01-.25-1.5c0-.14.01-.28.03-.42A8.02 8.02 0 009.5 2.88v3.12a4.5 4.5 0 004.5 4.5V7.5h1.5a3.75 3.75 0 01-.5-4zM12 5.25a6.75 6.75 0 106.75 6.75v-1.5A5.25 5.25 0 0112 4.5v.75z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/muncglobal?igsh=MXV4d2I0ZjdxNXBv&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white hover:text-yellow-300">Home</Link></li>
              <li><Link to="/about" className="text-white hover:text-yellow-300">About</Link></li>
              <li><Link to="/leadership" className="text-white hover:text-yellow-300">Leadership</Link></li>
              <li><Link to="/programs" className="text-white hover:text-yellow-300">Programs</Link></li>
              <li><Link to="/conference" className="text-white hover:text-yellow-300">Conference</Link></li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="space-y-1">
                  <a href="mailto:info@muncglobal.com" className="text-white hover:text-yellow-300 transition-colors block">info@muncglobal.com</a>
                  <a href="mailto:muncglobal@gmail.com" className="text-white hover:text-yellow-300 transition-colors block">muncglobal@gmail.com</a>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M20.52 3.48A11.94 11.94 0 0 0 12 1.5a11.94 11.94 0 0 0-8.52 1.98C1.2 6.08.6 9.02.6 12.02c0 2.72.96 5.32 2.62 7.28L2.5 23l3.84-1.02c1.9.98 4.02 1.46 6.1 1.46 3.02 0 5.96-.6 8.52-1.98A11.94 11.94 0 0 0 20.52 3.48zm-8.52 18.1c-1.8 0-3.57-.48-5.14-1.38l-.36-.2-2.28.6.6-2.22-.24-.36A9.8 9.8 0 0 1 2.4 12c0-2.26.88-4.38 2.48-5.98A9.78 9.78 0 0 1 12 2.4a9.78 9.78 0 0 1 7.12 3.02A9.72 9.72 0 0 1 21.6 12c0 2.72-.94 5.3-2.66 7.2A9.8 9.8 0 0 1 12 21.58zm5.34-7.28c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.2.3-.76.94-.94 1.14-.17.2-.35.22-.65.07-.3-.15-1.28-.47-2.42-1.5-.9-.8-1.52-1.8-1.7-2.1-.18-.3-.02-.46.14-.63.15-.15.29-.38.43-.57.14-.2.18-.34.28-.56.1-.22.05-.42-.02-.57-.08-.15-.64-1.54-.88-2.12-.23-.57-.47-.49-.64-.5l-.55-.01c-.18 0-.47.06-.7.3-.24.24-1.1 1.08-1.1 2.62 0 1.54 1.12 3.04 1.28 3.25.16.22 2.2 3.34 5.33 4.7.74.32 1.32.52 1.76.66.74.24 1.42.2 1.96.12.6-.09 1.7-.7 1.94-1.38.24-.68.24-1.26.17-1.38-.08-.12-.28-.2-.57-.35z"/>
                </svg>
                <div className="space-y-1">
                  <a href="https://wa.me/233504314485" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300 transition-colors block">0504314485</a>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div className="space-y-1">
                  <a href="tel:+233256111633" className="text-white hover:text-yellow-300 transition-colors block">0256111633</a>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white">Kumasi </span>
              </li>
            </ul>
          </motion.div>

          {/* Additional Resources */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/events" className="text-white hover:text-yellow-300">Events</Link></li>
              <li><Link to="/contact" className="text-white hover:text-yellow-300">Contact Us</Link></li>
              <li><Link to="/payment-policies" className="text-white hover:text-yellow-300">Payment Policies</Link></li>
            </ul>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="border-t border-teal-400 mt-8 pt-8 text-center text-white">
          <p>Copyright © {currentYear} MUNC-GLOBAL. All rights reserved.</p>
          <div className="mt-2">
            <Link 
              to="/admin" 
              className="text-xs text-teal-200 hover:text-yellow-300 transition-colors"
              title="Admin Access"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

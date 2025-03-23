
import ScrollReveal from './ScrollReveal';

const Footer = () => {
  return (
    <footer id="contact" className="bg-white relative">
      <div className="container-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <ScrollReveal>
              <a href="#" className="text-3xl font-bold text-gradient">OMIWO</a>
              <p className="mt-4 text-foreground/70">
                Premium liquid cleaning products for the modern home.
              </p>
            </ScrollReveal>
          </div>
          
          {/* Links Column */}
          <div className="md:col-span-1">
            <ScrollReveal delay={100}>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#products" className="text-foreground/70 hover:text-omiwo-blue transition-colors">
                    Products
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-foreground/70 hover:text-omiwo-blue transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-foreground/70 hover:text-omiwo-blue transition-colors">
                    Sustainability
                  </a>
                </li>
                <li>
                  <a href="#" className="text-foreground/70 hover:text-omiwo-blue transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </ScrollReveal>
          </div>
          
          {/* Contact Column */}
          <div className="md:col-span-1">
            <ScrollReveal delay={200}>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-foreground/70">
                  <span className="block">123 Clean Street</span>
                  <span className="block">Freshville, FV 12345</span>
                </li>
                <li>
                  <a href="mailto:info@omiwo.com" className="text-foreground/70 hover:text-omiwo-blue transition-colors">
                    info@omiwo.com
                  </a>
                </li>
                <li>
                  <a href="tel:+1234567890" className="text-foreground/70 hover:text-omiwo-blue transition-colors">
                    +1 (234) 567-890
                  </a>
                </li>
              </ul>
            </ScrollReveal>
          </div>
          
          {/* Newsletter Column */}
          <div className="md:col-span-1">
            <ScrollReveal delay={300}>
              <h4 className="text-lg font-bold mb-4">Stay Updated</h4>
              <p className="text-foreground/70 mb-4">
                Subscribe to our newsletter for the latest updates and offers.
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 border border-omiwo-blue/30 rounded-l-md bg-white focus:outline-none focus:ring-2 focus:ring-omiwo-blue focus:border-transparent flex-1"
                />
                <button
                  type="submit"
                  className="bg-omiwo-blue text-white px-4 py-2 rounded-r-md hover:bg-omiwo-teal transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </form>
            </ScrollReveal>
          </div>
        </div>
        
        {/* Bottom Section */}
        <ScrollReveal delay={400}>
          <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-foreground/60">
              © {new Date().getFullYear()} OMIWO. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-foreground/60 hover:text-omiwo-blue transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </a>
              <a href="#" className="text-foreground/60 hover:text-omiwo-blue transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-foreground/60 hover:text-omiwo-blue transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
};

export default Footer;

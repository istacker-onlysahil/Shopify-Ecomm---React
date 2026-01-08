
import React, { useState } from 'react';
import { Twitter, Facebook, Instagram, Github, ChevronDown, ArrowRight, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  const FooterLinkSection = ({ title, links }: { title: string, links: string[] }) => (
    <div className="border-b border-white/10 md:border-none">
      <button 
        onClick={() => toggleSection(title)}
        className="flex items-center justify-between w-full py-4 md:py-0 md:mb-6 text-left group"
      >
        <h4 className="font-bold text-xs uppercase tracking-widest text-white">{title}</h4>
        <ChevronDown 
          size={16} 
          className={`text-white/50 transition-transform duration-300 md:hidden ${openSection === title ? 'rotate-180' : ''}`} 
        />
      </button>
      <ul className={`space-y-3 overflow-hidden transition-all duration-300 ease-in-out md:block ${
        openSection === title ? 'max-h-64 pb-4 opacity-100' : 'max-h-0 md:max-h-full opacity-0 md:opacity-100'
      }`}>
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200 block">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="bg-[#0a0a0a] text-white pt-16 md:pt-24 pb-12 rounded-t-[2rem] md:rounded-t-[3rem] mt-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-16 border-b border-white/10 pb-16">
          <div className="lg:col-span-5 space-y-6">
             <div className="flex items-center gap-2 mb-6">
               <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tighter">Nextgen.</h2>
             </div>
             <p className="text-gray-400 text-base leading-relaxed max-w-md font-light">
               Crafting premium apparel that transcends trends. We believe in sustainable fashion, exceptional quality, and designs that empower your everyday life.
             </p>
             <div className="flex gap-4 pt-4">
                {[Twitter, Facebook, Instagram, Github].map((Icon, idx) => (
                  <a key={idx} href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                    <Icon size={18} />
                  </a>
                ))}
             </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white/5 rounded-2xl p-6 md:p-10 border border-white/10">
              <h3 className="text-xl md:text-2xl font-serif font-medium mb-2">Join the Club</h3>
              <p className="text-gray-400 text-sm mb-6">Subscribe to receive updates, access to exclusive deals, and more.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                 <div className="relative flex-1">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                   <input 
                     type="email" 
                     placeholder="Enter your email address" 
                     className="w-full bg-black/30 border border-white/10 rounded-full py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all placeholder:text-gray-600"
                   />
                 </div>
                 <button className="bg-white text-black px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                   Subscribe <ArrowRight size={16} />
                 </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-16">
           <FooterLinkSection 
             title="Shop" 
             links={['New Arrivals', 'Best Sellers', 'Men', 'Women', 'Accessories', 'Sale']} 
           />
           <FooterLinkSection 
             title="Company" 
             links={['About Us', 'Sustainability', 'Careers', 'Press', 'Stores']} 
           />
           <FooterLinkSection 
             title="Support" 
             links={['Help Center', 'Shipping & Returns', 'Size Guide', 'Contact Us', 'Order Status']} 
           />
           <FooterLinkSection 
             title="Legal" 
             links={['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility']} 
           />
        </div>
        
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10 text-xs text-gray-500">
           <p>© 2025 Nextgen Inc. All Rights Reserved.</p>
           
           <div className="flex flex-wrap justify-center gap-4">
              <span className="hover:text-white cursor-pointer transition-colors">United States (USD)</span>
              <span className="w-px h-4 bg-white/20"></span>
              <span className="hover:text-white cursor-pointer transition-colors">Sitemap</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

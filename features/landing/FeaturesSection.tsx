
import React from 'react';
import { Leaf, Award, ShieldCheck, Truck } from 'lucide-react';
import { Reveal } from '../../components/ui/Reveal';

const features = [
  {
    icon: Leaf,
    title: "Sustainability First",
    desc: "Crafted with 100% recycled materials and eco-friendly processes."
  },
  {
    icon: Award,
    title: "Artisan Quality",
    desc: "Hand-finished details by master craftsmen for lasting durability."
  },
  {
    icon: Truck,
    title: "Global Shipping",
    desc: "Complimentary express delivery on all international orders over $200."
  },
  {
    icon: ShieldCheck,
    title: "Lifetime Warranty",
    desc: "We stand by our quality. Repairs are on us, forever."
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-white border-b border-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-8">
              {features.map((feature, idx) => (
                <Reveal key={idx} delay={idx * 50}>
                  <div className="flex flex-col items-center text-center space-y-4 group cursor-default">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 group-hover:scale-110 group-hover:bg-black group-hover:text-white transition-all duration-300">
                          <feature.icon strokeWidth={1.5} size={24} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">{feature.title}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed max-w-[200px] mx-auto hidden md:block">
                          {feature.desc}
                        </p>
                      </div>
                  </div>
                </Reveal>
              ))}
          </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

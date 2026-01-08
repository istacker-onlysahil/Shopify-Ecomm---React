import React from 'react';

const ReviewsSection: React.FC = () => {
  return (
    <section className="py-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-medium text-gray-900 max-w-lg mx-auto leading-tight">
          Over 350+ Customer reviews form our client
        </h2>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 relative h-[300px] md:h-[400px] overflow-hidden">
         {/* Decorative Circular Images to mimic the scattered layout */}
         <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl transform -translate-y-4">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Reviewer" />
         </div>
         <div className="w-40 h-40 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-xl z-10">
            <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Reviewer" />
         </div>
         <div className="w-36 h-36 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-xl transform translate-y-8">
            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Reviewer" />
         </div>
         <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl absolute right-0 md:right-20 top-0">
            <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Reviewer" />
         </div>
         <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl absolute left-0 md:left-20 bottom-0">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Reviewer" />
         </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
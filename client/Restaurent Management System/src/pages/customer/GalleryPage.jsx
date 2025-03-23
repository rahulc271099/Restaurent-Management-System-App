import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const GalleryPage = () => {
  // Sample gallery data - replace with your actual data
  const galleryImages = [
    {
      id: 1,
      url: "/api/placeholder/800/600",
      title: "Signature Seafood Platter",
      category: "dishes",
      description: "Our chef's selection of the finest seafood"
    },
    {
      id: 2,
      url: "/api/placeholder/800/600",
      title: "VIP Lounge",
      category: "interior",
      description: "Exclusive dining experience with panoramic views"
    },
    {
      id: 3,
      url: "/api/placeholder/800/600",
      title: "Truffle Pasta",
      category: "dishes",
      description: "Handmade pasta with seasonal black truffle"
    },
    {
      id: 4,
      url: "/api/placeholder/800/600",
      title: "Garden Terrace",
      category: "interior",
      description: "Al fresco dining surrounded by nature"
    },
    {
      id: 5,
      url: "/api/placeholder/800/600",
      title: "Artisan Cocktails",
      category: "drinks",
      description: "Craft cocktails made with premium spirits"
    },
    {
      id: 6,
      url: "/api/placeholder/800/600",
      title: "Main Dining Hall",
      category: "interior",
      description: "Elegant atmosphere for a memorable dining experience"
    },
    {
      id: 7,
      url: "/api/placeholder/800/600",
      title: "Dessert Selection",
      category: "dishes",
      description: "Decadent desserts crafted by our pastry chef"
    },
    {
      id: 8,
      url: "/api/placeholder/800/600",
      title: "Wine Cellar",
      category: "interior",
      description: "Our curated collection of fine wines"
    },
    {
      id: 9,
      url: "/api/placeholder/800/600",
      title: "Signature Cocktail",
      category: "drinks",
      description: "House specialty with premium ingredients"
    }
  ];

  const categories = ['all', 'dishes', 'interior', 'drinks'];
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeImage, setActiveImage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animateItems, setAnimateItems] = useState(false);

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  useEffect(() => {
    // Add animation after component mounts and when category changes
    setAnimateItems(false);
    setTimeout(() => setAnimateItems(true), 100);
  }, [selectedCategory]);

  const openModal = (image) => {
    setActiveImage(image);
    setActiveIndex(filteredImages.findIndex(img => img.id === image.id));
  };

  const closeModal = () => {
    setActiveImage(null);
  };

  const navigateImage = (direction) => {
    const newIndex = (activeIndex + direction + filteredImages.length) % filteredImages.length;
    setActiveIndex(newIndex);
    setActiveImage(filteredImages[newIndex]);
  };

  return (
    <div className="bg-black text-white min-h-screen mt-20">
      {/* Hero section */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img 
          src="https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D" 
          alt="Restaurant Gallery Hero" 
          className="absolute w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full">
          <h1 className="text-4xl md:text-6xl font-bold mb-2">Gallery</h1>
          <p className="text-lg md:text-xl text-gray-300">Experience our culinary journey through images</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        {/* Category tabs - elegant design */}
        <div className="flex justify-center mb-16">
          <div className="bg-gray-900 rounded-full p-1 inline-flex">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Modern masonry-style gallery grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredImages.map((image, index) => (
            <div 
              key={image.id} 
              className={`group cursor-pointer overflow-hidden rounded-xl bg-gray-900 shadow-xl transform transition-all duration-700 hover:scale-[1.02] ${
                animateItems ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => openModal(image)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={image.url} 
                  alt={image.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{image.title}</h3>
                  <p className="text-gray-300 text-sm">{image.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* No Results */}
        {filteredImages.length === 0 && (
          <div className="text-center py-24">
            <p className="text-gray-400 text-xl">No images available in this category.</p>
          </div>
        )}
      </div>
      
      {/* Immersive Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-95"></div>
          
          <button 
            onClick={closeModal}
            className="absolute top-8 right-8 text-white p-2 rounded-full bg-gray-800 hover:bg-gray-700 z-10 transition-all"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          
          <button 
            onClick={() => navigateImage(-1)}
            className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-gray-800 hover:bg-gray-700 z-10 transition-all"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={() => navigateImage(1)}
            className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-gray-800 hover:bg-gray-700 z-10 transition-all"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>
          
          <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center p-4 md:p-8 z-10">
            <div className="relative w-full max-h-[70vh] overflow-hidden rounded-lg">
              <img 
                src={activeImage.url} 
                alt={activeImage.title} 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="w-full mt-6 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white">{activeImage.title}</h3>
              <p className="text-gray-300 mt-2">{activeImage.description}</p>
            </div>
            
            <div className="mt-8 flex space-x-2">
              {filteredImages.map((img, idx) => (
                <button 
                  key={img.id}
                  onClick={() => {
                    setActiveIndex(idx);
                    setActiveImage(img);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeIndex === idx ? 'bg-white w-4' : 'bg-gray-600 hover:bg-gray-400'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
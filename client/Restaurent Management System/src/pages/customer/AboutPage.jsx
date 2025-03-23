import React, { useEffect, useState } from 'react';
import { ChevronDown, Instagram, Facebook, Twitter, MapPin, Clock, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('story');
  const navigate = useNavigate()  
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans mt-40">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden shadow-lg border-2 ml-4 rounded-3xl">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src="https://media.istockphoto.com/id/1248298343/photo/3d-rendering-of-a-luxury-restaurant-interior-at-night.webp?a=1&b=1&s=612x612&w=0&k=20&c=m4HAT3kOdvfvj7V1odHpY9GwHTgmQGlVVUrdV-0FrXw=" 
          alt="Restaurant interior" 
          className="absolute inset-0 w-full h-full object-cover object-center p-20" 
        />
        <div className="relative z-20 flex flex-col justify-center items-center h-full text-white px-4">
          <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-6xl md:text-8xl font-serif italic tracking-tight mb-2 text-center">Gusto</h1>
            <div className="w-16 h-0.5 bg-amber-400 mx-auto my-6"></div>
            <p className="text-xl md:text-2xl text-center max-w-2xl mx-auto font-light">Crafting culinary experiences that tell a story with every bite since 2010</p>
          </div>
          
          <div className={`absolute bottom-12 left-0 right-0 flex justify-center transition-all duration-700 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              onClick={() => scrollToSection('main-content')}
              className="flex flex-col items-center text-white hover:text-amber-400 transition-colors duration-300"
            >
              <span className="text-sm uppercase tracking-wider mb-2">Discover Our Story</span>
              <ChevronDown size={24} className="animate-bounce" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="main-content" className="max-w-7xl mx-auto px-4 py-20">
        {/* Section Tabs */}
        <div className="flex flex-wrap justify-center mb-12 gap-2 md:gap-8">
          {[
            { id: 'story', label: 'Our Story' },
            { id: 'philosophy', label: 'Philosophy' },
            { id: 'team', label: 'Meet the Team' },
            { id: 'awards', label: 'Awards' }
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-full text-sm md:text-base transition-all duration-300 ${
                activeSection === section.id 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Story Section */}
        <div className={`transition-opacity duration-500 ${activeSection === 'story' ? 'block opacity-100' : 'hidden opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-6">A Culinary Journey</h2>
              <p className="text-stone-600 mb-4 leading-relaxed">
                Gusto was born from a passion for authentic flavors and memorable dining experiences. 
                Founded in 2010 by acclaimed chef Maria Rossi, our restaurant has evolved from a small 
                family-owned trattoria to one of the city's most beloved culinary destinations.
              </p>
              <p className="text-stone-600 mb-4 leading-relaxed">
                Every dish at Gusto tells a story – of traditional recipes passed down through generations, 
                of locally-sourced, seasonal ingredients, and of our commitment to culinary excellence that 
                honors both tradition and innovation.
              </p>
              <p className="text-stone-600 leading-relaxed">
                What remains unchanged is our dedication to creating a warm, inviting atmosphere where 
                friends and family can gather to share not just exceptional food, but moments that become cherished memories.
              </p>
            </div>
            <div className="relative h-80 md:h-96 overflow-hidden rounded-lg shadow-xl">
              <img 
                src="https://media.istockphoto.com/id/2161343098/photo/modern-restaurant-interior-with-an-industrial-style-and-luxurious-furniture.jpg?s=612x612&w=0&k=20&c=cFc9YDxm9uDEg1fMSSENNEhQumFnzciaeOvCUVEHgOA=" 
                alt="Gusto restaurant founding" 
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* Philosophy Section */}
        <div className={`transition-opacity duration-500 ${activeSection === 'philosophy' ? 'block opacity-100' : 'hidden opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative h-80 md:h-96 overflow-hidden rounded-lg shadow-xl">
              <img 
                src="https://media.istockphoto.com/id/1280856062/photo/variety-of-fresh-organic-vegetables-and-fruits-in-the-garden.webp?a=1&b=1&s=612x612&w=0&k=20&c=VGOQ0nfrWgpIXzdfI6voNicGvq_SjOLgSc76-QrUEzE=" 
                alt="Fresh ingredients" 
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-6">Our Philosophy</h2>
              <p className="text-stone-600 mb-4 leading-relaxed">
                At Gusto, we believe that exceptional cuisine begins with exceptional ingredients. We've built 
                lasting relationships with local farmers, fishermen, and artisanal producers who share our 
                commitment to quality and sustainability.
              </p>
              <p className="text-stone-600 mb-4 leading-relaxed">
                Our menu changes with the seasons, celebrating the freshest produce at its peak. We honor 
                traditional techniques while embracing innovation, creating dishes that surprise and delight 
                without sacrificing authenticity.
              </p>
              <p className="text-stone-600 leading-relaxed">
                Gusto is more than a restaurant – it's an experience that engages all the senses. From the 
                ambiance to the presentation, every detail is considered to create a harmonious journey 
                for our guests.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className={`transition-opacity duration-500 ${activeSection === 'team' ? 'block opacity-100' : 'hidden opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-10 text-center">The Faces Behind Gusto</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Maria Rossi', title: 'Executive Chef & Founder', image: '/api/placeholder/400/400' },
              { name: 'Antonio Bianchi', title: 'Head Chef', image: '/api/placeholder/400/400' },
              { name: 'Sofia Conti', title: 'Pastry Chef', image: '/api/placeholder/400/400' },
              { name: 'Marco Ricci', title: 'Sommelier', image: '/api/placeholder/400/400' },
              { name: 'Giulia Romano', title: 'Restaurant Manager', image: '/api/placeholder/400/400' },
              { name: 'Luca Ferrari', title: 'Maitre d\'', image: '/api/placeholder/400/400' }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium text-stone-800">{member.name}</h3>
                  <p className="text-amber-600 mt-1">{member.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Awards Section */}
        <div className={`transition-opacity duration-500 ${activeSection === 'awards' ? 'block opacity-100' : 'hidden opacity-0'}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-6">Recognition & Awards</h2>
            <p className="text-stone-600 max-w-3xl mx-auto">
              We're honored to have our passion and dedication recognized by critics and culinary institutions alike.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { year: '2023', award: 'Best Fine Dining Experience', organization: 'City Culinary Awards' },
              { year: '2022', award: 'Chef of the Year - Maria Rossi', organization: 'Gourmet Magazine' },
              { year: '2021', award: 'Two Michelin Stars', organization: 'Michelin Guide' },
              { year: '2020', award: 'Best Wine Selection', organization: 'Wine Enthusiast' },
              { year: '2018', award: 'Best Italian Restaurant', organization: 'National Restaurant Association' },
              { year: '2015', award: 'Rising Star Chef - Antonio Bianchi', organization: 'Culinary Institute' }
            ].map((award, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500">
                <div className="font-serif text-2xl text-amber-500 mb-2">{award.year}</div>
                <h3 className="text-lg font-medium text-stone-800 mb-1">{award.award}</h3>
                <p className="text-stone-600 text-sm">{award.organization}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-stone-900 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-12 text-center">What Our Guests Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                text: "Gusto offers not just a meal, but a journey through the rich tapestry of Italian cuisine. Every dish tells a story of tradition and innovation.",
                author: "Emma Thompson, Food Critic",
              },
              { 
                text: "The attention to detail at Gusto is remarkable. From the warm welcome to the perfectly timed courses, every moment feels curated yet effortless.",
                author: "Michael Chen, Food Blogger",
              },
              { 
                text: "In a city of endless dining options, Gusto stands apart. Their commitment to seasonal ingredients and authentic flavors creates an unforgettable experience.",
                author: "Sophia Rodriguez, Culinary Writer",
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-stone-800 p-8 rounded-lg relative">
                <div className="text-amber-400 text-6xl absolute -top-5 left-6 opacity-30">"</div>
                <p className="text-stone-300 relative z-10 mb-6 italic">{testimonial.text}</p>
                <p className="text-amber-400 font-medium">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visit Us Section */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-16 text-center">Visit Gusto</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://plus.unsplash.com/premium_photo-1694475041575-21ecaf24ca2e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmVzdGF1cmFudCUyMGV4dGVyaW9yJTIwaW1hZ2V8ZW58MHx8MHx8fDA%3D" 
                alt="Gusto restaurant exterior" 
                className="rounded-lg shadow-xl w-full"
              />
            </div>
            <div>
              <div className="flex items-start mb-8">
                <MapPin size={24} className="text-amber-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-medium text-stone-800 mb-1">Our Location</h3>
                  <p className="text-stone-600">123 Culinary Avenue, Gastronomy District</p>
                  <p className="text-stone-600">New York, NY 10001</p>
                </div>
              </div>
              
              <div className="flex items-start mb-8">
                <Clock size={24} className="text-amber-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-medium text-stone-800 mb-1">Hours</h3>
                  <p className="text-stone-600">Tuesday - Thursday: 5:30 PM - 10:00 PM</p>
                  <p className="text-stone-600">Friday - Saturday: 5:30 PM - 11:00 PM</p>
                  <p className="text-stone-600">Sunday: 11:00 AM - 3:00 PM, 5:30 PM - 9:00 PM</p>
                  <p className="text-stone-600">Monday: Closed</p>
                </div>
              </div>
              
              <div className="flex items-start mb-8">
                <Phone size={24} className="text-amber-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-medium text-stone-800 mb-1">Reservations</h3>
                  <p className="text-stone-600">(212) 555-1234</p>
                  <p className="text-stone-600 mt-1">Reservations recommended for dinner service</p>
                </div>
              </div>
              
              <button onClick={()=>navigate("/customer/reservation")} className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-8 rounded-full transition-colors duration-300 inline-block">
                Reserve a Table
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl font-serif italic text-white mb-4 md:mb-0">Gusto</h2>
            <div className="flex space-x-4">
              <a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">
                <Twitter size={24} />
              </a>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between pt-8 border-t border-stone-800">
            <div className="mb-6 md:mb-0">
              <p className="flex items-center">
                <Mail size={16} className="mr-2" />
                <span>contact@gustorestaurant.com</span>
              </p>
            </div>
            <div className="mb-6 md:mb-0">
              <p>&copy; {new Date().getFullYear()} Gusto Restaurant. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
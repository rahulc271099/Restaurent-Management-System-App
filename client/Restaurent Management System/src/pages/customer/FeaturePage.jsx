import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChefSpecial } from "../../services/menuServices";
import { addToCart } from "../../services/cartServices";
import { toast } from "react-toastify";


const FeaturePage = () => {

  const navigate = useNavigate()
  const [chefSpecial,setChefSpecial] = useState([])
  const [isVisible, setIsVisible] = useState(false);
  const imageRef = useRef(null);

  useEffect(()=>{
    getChefSpecial().then(res=>{
      console.log(res);
      setChefSpecial(res.data.data)
    }).catch(err=>{
      console.log(err);
    })
  },[])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (imageRef.current) observer.observe(imageRef.current);

    return () => {
      if (imageRef.current) observer.unobserve(imageRef.current);
    };
  }, []);

  const handleAddToCart = (item) =>{
      addToCart({
        menuItemId: item._id,
        name: item.name,
        image: item.image,
        price: item.price, // Optional, if needed
        quantity: 1, // Default quantity when adding
      }).then(res=>{
        console.log(res);
        toast.success("Item added to cart successfully")
        navigate("/customer/cart")
      })
      .catch(err=>{
        console.log(err);
      })
    }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Section heading with decorative elements */}
        <div className="relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8">
            <svg
              className="h-16 w-16 text-amber-100"
              fill="currentColor"
              viewBox="0 0 100 100"
            >
              <path d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z"></path>
            </svg>
          </div>

          <div className="text-center relative z-10">
            <div className="inline-block">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-1">
                Experience the best
              </span>
            </div>
            <h2 className="mt-2 text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Culinary Masterpieces
            </h2>
            <div className="mt-3 mx-auto max-w-2xl">
              <p className="text-lg md:text-xl text-gray-600">
                Experience our chef's carefully curated selection of signature
                dishes made with locally sourced ingredients and international
                techniques.
              </p>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="h-1 w-24 bg-amber-500 rounded"></div>
            </div>
          </div>
        </div>

        {/* Featured dishes */}
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {chefSpecial ?.map((item) => (
              <div ref={imageRef} key={item._id} className="group">
                <div className="relative overflow-hidden rounded-2xl mb-5 h-[400px]">
                <img
                      className={`w-full h-full object-cover transform transition-transform duration-500
                        ${isVisible ? "scale-110" : ""}
                        group-hover:scale-110
                        lg:scale-100
                      `}
                      src={item.image}
                      alt={item.name}
                    />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="text-xl font-bold text-white">
                      ${item.price}
                    </span>
                  </div>

                  {/* Dish tags */}
                  <div className="absolute top-3 left-3 flex space-x-2">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-90 text-amber-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="px-1">
                  <span className="text-amber-600 font-medium text-sm">
                    {item.category}
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-gray-600">{item.description}</p>

                  <button onClick={()=>handleAddToCart(item)} className="mt-4 inline-flex items-center text-amber-700 font-medium hover:text-amber-500 transition-colors">
                    Order now
                    <svg
                      className="ml-1 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View all menu button */}
        <div className="mt-16 text-center">
          <button className="inline-flex items-center px-6 py-3 border border-amber-600 text-base font-medium rounded-full text-amber-600 bg-white hover:bg-amber-600 hover:text-white transition-colors duration-300"
          onClick={()=>navigate("/customer/menu")}
          >
            View complete menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturePage;

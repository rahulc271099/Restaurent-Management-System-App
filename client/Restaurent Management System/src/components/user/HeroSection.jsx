import React from "react";

const HeroSection = () => {
  return (
    //Design 3
    <div className="relative h-screen overflow-hidden">
      {/* Modern animated background with blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-amber-700">
        <div className="absolute inset-0 opacity-30">
          {/* Modern geometric pattern */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/10 backdrop-blur-sm"
                style={{
                  width: `${Math.random() * 300 + 100}px`,
                  height: `${Math.random() * 300 + 100}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 20 + 10}s`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationIterationCount: "infinite",
                  animationName: i % 2 === 0 ? "float" : "floatReverse",
                  animationTimingFunction: "ease-in-out",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 md:pr-12">
              <div className="inline-flex items-center px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-sm font-medium mb-6 border border-white/20">
                <span className="mr-2">⭐</span>
                <span>Fine dining experience</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
                <span className="block">Taste the</span>
                <span className="block bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent mt-1">
                  Extraordinary
                </span>
              </h1>

              <p className="mt-6 text-xl text-gray-200 max-w-lg font-light">
                Discover a unique dining experience with our carefully crafted
                menu of seasonal ingredients and exquisite flavors.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  type="button"
                  className="group inline-flex items-center px-8 py-4 text-base font-medium rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-xl transition-all duration-300 hover:shadow-amber-400/20 hover:translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  View Our Menu
                  <svg
                    className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  className="inline-flex items-center px-8 py-4 text-base font-medium rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  Book a Table
                </button>
              </div>
            </div>

            <div className="hidden md:block md:w-1/2 lg:w-[400px] mt-10 md:mt-0">
              <div className="relative">
                {/* Main image with glass morphism effect */}
                <div className="backdrop-blur-md bg-white/10 p-2 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="rounded-2xl overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                        src="https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D"
                      alt="Signature dish"
                    />
                  </div>
                </div>

                {/* Rating card with modern glass morphism */}
                <div className="absolute -bottom-6 -left-6 backdrop-blur-xl bg-white/20 p-4 rounded-xl shadow-xl border border-white/30">
                  <div className="flex items-center">
                    <span className="text-amber-300 font-bold">4.9</span>
                    <div className="flex ml-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-4 w-4 text-amber-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-white text-sm">
                      500+ reviews
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern wave with gradient */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-16 md:h-32 fill-current text-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="opacity-50"
          ></path>
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="opacity-25"
          ></path>
        </svg>
      </div>

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
          100% {
            transform: translateY(0px) scale(1);
          }
        }
        @keyframes floatReverse {
          0% {
            transform: translateY(0px) scale(1.05);
          }
          50% {
            transform: translateY(-30px) scale(1);
          }
          100% {
            transform: translateY(0px) scale(1.05);
          }
        }
      `}</style>
    </div>



    // <section className="relative h-screen overflow-hidden">
    //   {/* Dark background with modern pattern */}
    //   <div className="absolute inset-0 bg-gray-950">
    //     <div className="absolute inset-0 opacity-20">
    //       {/* Modern neon grid pattern */}
    //       <div className="absolute inset-0 overflow-hidden">
    //         <div
    //           className="h-full w-full"
    //           style={{
    //             backgroundImage: `
    //             linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
    //             linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
    //             backgroundSize: "40px 40px",
    //           }}
    //         >
    //           <div
    //             className="h-full w-full"
    //             style={{
    //               backgroundImage: `radial-gradient(circle, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
    //               backgroundSize: "60px 60px",
    //             }}
    //           ></div>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Glowing orbs and accents */}
    //     <div className="absolute top-1/4 left-1/3 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl"></div>
    //     <div className="absolute bottom-1/3 right-1/4 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl"></div>
    //   </div>

    //   {/* Content */}
    //   <div className="relative h-full flex items-center z-10">
    //     <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
    //       <div className="md:flex md:items-center md:justify-between">
    //         <div className="md:w-1/2 md:pr-12">
    //           <div className="inline-flex items-center px-4 py-1 rounded-full bg-gray-800/50 backdrop-blur-md text-purple-400 text-sm font-medium mb-6 border border-purple-500/20">
    //             <span className="mr-2">✦</span>
    //             <span>Fine dining experience</span>
    //           </div>

    //           <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
    //             <span className="block">Taste the</span>
    //             <span className="block bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent mt-1">
    //               Extraordinary
    //             </span>
    //           </h1>

    //           <p className="mt-6 text-xl text-gray-300 max-w-lg font-light">
    //             Discover a unique dining experience with our carefully crafted
    //             menu of seasonal ingredients and exquisite flavors.
    //           </p>

    //           <div className="mt-10 flex flex-wrap gap-4">
    //             <button
    //               type="button"
    //               className="group inline-flex items-center px-8 py-4 text-base font-medium rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xl transition-all duration-300 hover:shadow-purple-500/20 hover:translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
    //             >
    //               View Our Menu
    //               <svg
    //                 className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 fill="none"
    //                 viewBox="0 0 24 24"
    //                 stroke="currentColor"
    //               >
    //                 <path
    //                   strokeLinecap="round"
    //                   strokeLinejoin="round"
    //                   strokeWidth={2}
    //                   d="M9 5l7 7-7 7"
    //                 />
    //               </svg>
    //             </button>

    //             <button
    //               type="button"
    //               className="inline-flex items-center px-8 py-4 text-base font-medium rounded-full bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 text-white transition-all duration-300 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
    //             >
    //               Book a Table
    //             </button>
    //           </div>
    //         </div>

    //         <div className="hidden md:block md:w-1/2 mt-10 md:mt-0">
    //           <div className="relative">
    //             {/* Image with glass morphism effect */}
    //             <div className="backdrop-blur-md bg-gray-800/30 p-2 rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50">
    //               <div className="rounded-xl overflow-hidden">
    //                 <img
    //                   className="w-full h-full object-cover"
    //                   src="https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D"
    //                   alt="Signature dish"
    //                 />
    //               </div>

    //               {/* Floating elements */}
    //               <div className="absolute -top-4 -right-4 h-16 w-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
    //                 <span className="text-white text-sm font-bold">NEW</span>
    //               </div>
    //             </div>

    //             {/* Rating card with dark glass morphism */}
    //             <div className="absolute -bottom-6 -left-6 backdrop-blur-xl bg-gray-800/70 p-4 rounded-xl shadow-xl border border-gray-700/50">
    //               <div className="flex items-center">
    //                 <span className="text-purple-400 font-bold">4.9</span>
    //                 <div className="flex ml-2">
    //                   {[...Array(5)].map((_, i) => (
    //                     <svg
    //                       key={i}
    //                       className="h-4 w-4 text-purple-400"
    //                       fill="currentColor"
    //                       viewBox="0 0 20 20"
    //                     >
    //                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    //                     </svg>
    //                   ))}
    //                 </div>
    //                 <span className="ml-2 text-gray-300 text-sm">
    //                   500+ reviews
    //                 </span>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Modern wave with gradient */}
    //   <div className="absolute bottom-0 left-0 right-0">
    //     <svg
    //       className="w-full h-16 md:h-24"
    //       viewBox="0 0 1200 120"
    //       preserveAspectRatio="none"
    //     >
    //       <path
    //         d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
    //         fill="url(#gradient)"
    //         fillOpacity="0.1"
    //       ></path>
    //     </svg>
    //     <defs>
    //       <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
    //         <stop offset="0%" stopColor="#8B5CF6" />
    //         <stop offset="100%" stopColor="#4F46E5" />
    //       </linearGradient>
    //     </defs>
    //   </div>
    // </section>
  );
};

export default HeroSection;

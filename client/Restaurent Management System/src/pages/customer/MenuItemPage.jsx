import React, { useEffect, useState } from "react";
import { getMenuItems } from "../../services/menuServices";

const MenuItemPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    dietary: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    getMenuItems(filters)
      .then((res) => {
        console.log(res);
        setMenuItems(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      let minPrice = "";
      let maxPrice = "";

      if (value === "low") {
        minPrice = 100;
        maxPrice = 150;
      } else if (value === "medium") {
        minPrice = 150;
        maxPrice = 200;
      } else if (value === "high") {
        minPrice = 200;
        maxPrice = ""; // No upper limit
      }

      setFilters((prevFilters) => ({
        ...prevFilters,
        minPrice,
        maxPrice,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "",
      dietary: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 mt-6">
        {/* Menu Header */}
        <div className="text-center mb-8 mt-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Our Menu
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide variety of delicious options, from appetizers to
            desserts. All made with fresh ingredients and prepared with care.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for dishes..."
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 md:gap-4">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Category</option>
                <option value="appetizer">Appetizers</option>
                <option value="main course">Main Course</option>
                <option value="dessert">Desserts</option>
                <option value="beverage">Beverages</option>
              </select>

              <select
                name="dietary"
                value={filters.dietary}
                onChange={handleFilterChange}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Dietary</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten-Free</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
              </select>

              <select
                name="price"
                onChange={handleFilterChange}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Price Range</option>
                <option value="low">Under $150</option>
                <option value="medium">$100 - $200</option>
                <option value="high">Over $200</option>
              </select>

              <button
                onClick={resetFilters}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition duration-300"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.length > 0 ? (
              menuItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      // src={item.image}
                      src=""
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-yellow-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm font-medium">
                          {item.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-800">
                        {item.name}
                      </h3>
                      <span className="font-bold text-orange-500">
                        ${item.price}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded mr-2">
                          {item.category}
                        </span>
                        {item.dietary?.includes("vegetarian") && (
                          <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                            Veg
                          </span>
                        )}
                      </div>

                      <button className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition duration-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-3">
                No items found
              </p>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <button className="px-6 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition duration-300">
              Load More
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MenuItemPage;

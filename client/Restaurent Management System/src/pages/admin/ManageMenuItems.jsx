import React, { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiDollarSign,
  FiTag,
  FiInfo,
} from "react-icons/fi";
import {
  addMenuItems,
  deleteMenuItem,
  getMenuItems,
  updateChefSpecial,
  updateMenuItem,
} from "../../services/menuServices";
import { toast } from "react-toastify";
import { Check } from "lucide-react";


const ManageMenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategories, setNewCategories] = useState([
    "main course",
    "appetizer",
    "dessert",
    "beverage",
  ]);
  const [newDietary, setNewDietary] = useState([
    "vegetarian",
    "vegan",
    "gluten-free",
    "non-vegetarian",
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showChefSpecialModal, setShowChefSpecialModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedMenuItems, setSelectedMenuItems] = useState([]);
  const [updatedMenuItemId, setUpdatedMenuItemId] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "main course",
    dietary: "vegetarian",
    description: "",
    image: null,
    availability: "",
    isAvailable: false,
    tags: [], // Store multiple tags
    chefSpecial: false,
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    // setFormData({ ...formData, [name]: value });
    if (type === "file") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else if (name === "tags") {
      const tagArray = value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
      setFormData({ ...formData, tags: tagArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      isAvailable: e.target.checked,
      availability: e.target.checked ? "in-stock" : "out-of-stock",
    });
  };

  // Handle menu item creation
  const handleAddMenuItem = () => {
    const newItem = new FormData(); // ✅ Use FormData to handle file uploads

    newItem.append("name", formData.name);
    newItem.append("price", parseFloat(formData.price));
    newItem.append("category", formData.category);
    newItem.append("dietary", formData.dietary);
    newItem.append("description", formData.description);
    newItem.append(
      "availability",
      formData.isAvailable ? "in-stock" : "out-of-stock"
    );

    if (formData.image) {
      newItem.append("image", formData.image); // ✅ Appending image file correctly
    }

    formData.tags.forEach((tag) => {
      newItem.append("tags[]", tag); // ✅ Sends multiple values correctly
    });

    // / ✅ Append Chef's Special as true/false
    newItem.append("chefSpecial", formData.chefSpecial);

    addMenuItems(newItem)
      .then((res) => {
        console.log(res);
        toast.success("Menu item added successfully");
        return getMenuItems();
      })
      .then((response) => {
        console.log(response);
        setMenuItems(response.data);
        setShowAddModal(false);
        setFormData({
          name: "",
          price: "",
          category: "",
          dietary: "",
          description: "",
          image: null,
          availability: "",
          isAvailable: false,
          tags: [],
          chefSpecial: false,
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.error);
      });
  };

  // Handle edit menu item
  const handleEditMenuItem = () => {
    // Create updated item with new values
    const updatedItem = {
      ...currentItem, // Keep existing properties
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      description: formData.description,
      availability: formData.isAvailable ? "in-stock" : "out-of-stock", // Ensure correct format
    };

    updateMenuItem(updatedItem, currentItem._id)
      .then((res) => {
        console.log(res);
        toast.success(`${res.data.data.name} updated successfully`);
        return getMenuItems();
      })
      .then((response) => {
        console.log(response);
        setMenuItems(response.data);
        setShowEditModal(false);
        setFormData({
          name: "",
          price: "",
          category: "",
          description: "",
          image: null,
          availability: "",
          isAvailable: false,
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.error);
      });
  };

  // Handle delete menu item
  const handleDeleteMenuItem = () => {
    deleteMenuItem(currentItem._id)
      .then((res) => {
        console.log(res);
        toast.success("Menu item deletted successfully");
        return getMenuItems();
      })
      .then((response) => {
        console.log(response);
        setMenuItems(response.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.error);
      });

    setShowDeleteModal(false);
  };

  const handleChefSpecialSelection = (itemId) =>{
    setSelectedMenuItems((prevSelected = [])=>{
      if(prevSelected.includes(itemId)){
        return prevSelected.filter((_id)=>_id !== itemId)
      }else{
        return [...prevSelected,itemId]
      }
    })
  }

  const handleClose = () => {
    setShowChefSpecialModal(false);
  };

  //handle chef special update
  const handleUpdateChefSpecial = () => {
    console.log(selectedMenuItems);
    updateChefSpecial({menuItemIds:selectedMenuItems})
      .then((res) => {
        console.log(res);
        setSelectedMenuItems([])
        handleClose()
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //open add modal
  const handleOpenAddModal = () => {
    setFormData({
      name: "",
      price: "",
      category: "main course",
      dietary: "vegetarian",
      description: "",
      image: null,
      availability: "",
      isAvailable: false,
      tags: [],
      chefSpecial: false,
    });
    setShowAddModal(true);
  };
  // Open edit modal with current item data
  const openEditModal = (item) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      description: item.description,
      image: item.image,
      availability: item.availability,
      isAvailable: item.availability === "in-stock" ? true : false,
    });
    setShowEditModal(true);
  };

  // Open delete modal with current item
  const openDeleteModal = (item) => {
    setCurrentItem(item);
    setShowDeleteModal(true);
  };

  // Filter menu items based on search term and category
  const filteredItems = menuItems?.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.availability &&
        item.availability.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    console.log("Modal State Changed:", showChefSpecialModal);
  }, [showChefSpecialModal]);

  useEffect(() => {
    getMenuItems()
      .then((res) => {
        console.log(res);
        setMenuItems(res.data);
        const uniqueCategories = [
          ...new Set(res.data.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="h-full">
      {/* Header with search, filter, and add button */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg px-4 py-2.5"
          >
            <option value="All">All</option> {/* Add "All" as default */}
            {newCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button
            onClick={handleOpenAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 flex items-center whitespace-nowrap"
          >
            <FiPlus className="mr-2" />
            Add Menu Item
          </button>
        </div>
        {/* Open Modal Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              console.log("Clicked");
              setShowChefSpecialModal(true);
              console.log(showChefSpecialModal);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Set Chef's Specials
          </button>
        </div>
      </div>

      {/* Menu items grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems?.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-400">No image</span>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.name}
                </h3>
                <span className="text-lg font-bold text-blue-600">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <FiTag className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">{item.category}</span>
              </div>
              <p className="text-gray-600 mb-4 h-12 overflow-hidden">
                {item.description}
              </p>
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.availability && item.availability.trim() === "in-stock"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.availability}
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => openEditModal(item)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(item)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredItems?.length === 0 && (
          <div className="col-span-full bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No menu items found
          </div>
        )}
      </div>

      {/* chef special modal */}
      {showChefSpecialModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg relative w-[400px] shadow-lg">
            <button
              className="absolute top-3 right-3 text-gray-600"
              onClick={handleClose}
            >
              ✕
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Set Chef's Specials
            </h1>
            <div className="grid grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleChefSpecialSelection(item._id)}
                  className={`relative cursor-pointer p-4 rounded-lg text-center transition-all ${
                    selectedMenuItems ?.includes(item._id)
                      ? "bg-green-100 border-green-500"
                      : "bg-gray-100 hover:bg-gray-200"
                  } border-2`}
                >
                  <span className="text-sm font-medium text-gray-800">
                    {item.name}
                  </span>
                  {selectedMenuItems ?.includes(item._id) && (
                    <Check className="absolute top-2 right-2 text-green-600 h-5 w-5" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUpdateChefSpecial}
                disabled={selectedMenuItems ?.length === 0}
                className={`px-6 py-2 rounded-lg transition ${
                  selectedMenuItems ?.length > 0
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Save Chef's Specials
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Menu Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4 overflow-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Add New Menu Item
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Item Name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiDollarSign className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                >
                  {newCategories?.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dietary
                </label>
                <select
                  name="dietary"
                  value={formData.dietary}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                >
                  {newDietary?.map((dietary) => (
                    <option key={dietary} value={dietary}>
                      {dietary}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags.join(",")}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Item Name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chef's Special
                </label>
                <div className="flex items-center space-x-2">
                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        chefSpecial: !formData.chefSpecial,
                      })
                    }
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                      formData.chefSpecial ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                        formData.chefSpecial ? "translate-x-6" : "translate-x-0"
                      }`}
                    ></div>
                  </button>

                  {/* Label when enabled */}
                  {formData.chefSpecial && (
                    <span className="text-blue-500 text-sm font-medium">
                      Added to Chef’s Special
                    </span>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Item description"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image Upload
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  accept="image/*"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload an image of the menu item (optional)
                </p>
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="isAvailable"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Item is available
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-white border border-gray-300 text-gray-700 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMenuItem}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Menu Item Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Edit Menu Item
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                >
                  {categories?.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                ></textarea>
              </div>
              <div className="mb-4">
                <input
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label
                  htmlFor="isAvailable"
                  className="text-sm font-medium text-gray-700"
                >
                  Item is available
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-white border border-gray-300 text-gray-700 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={handleEditMenuItem}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Menu Item Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Confirm Delete
              </h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-700">
                Are you sure you want to delete "{currentItem?.name}"?
              </p>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-white border border-gray-300 text-gray-700 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMenuItem}
                className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMenuItems;

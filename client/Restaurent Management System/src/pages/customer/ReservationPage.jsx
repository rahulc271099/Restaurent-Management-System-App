import React, { useEffect, useState } from "react";
import { getTables, updateTable } from "../../services/tableServices";
import { getMenuItems } from "../../services/menuServices";
import { createReservation } from "../../services/reservationServices";
import { toast } from "react-toastify";

const ReservationPage = () => {
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tableName, setTableName] = useState("");
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedMenuItems, setSelectedMenuItems] = useState([]);
  const [data, setData] = useState({
    table_id: "",
    reservation_time: "",
    reservation_date: "",
    party_number: "",
    menu_items: [],
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleDateAndTimeChange = (e) => {
    const { name, value } = e.target;

    setData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Only update the ISO string when both date and time are available
      if (updatedData.reservation_date && updatedData.reservation_time) {
        const dateTimeString = `${updatedData.reservation_date}T${updatedData.reservation_time}`;
        return {
          ...updatedData,
          reservation_time_iso: new Date(dateTimeString).toISOString(),
        };
      }

      return updatedData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(data);
    if (!selectedTable || !data.reservation_time) {
      console.log("Please select a table and a valid reservation date & time.");
      return;
    }

    createReservation({
      ...data,
      reservation_time: data.reservation_time_iso, // Send the ISO format
      menu_items: selectedMenuItems,
    })
      .then((res) => {
        toast.success("Table reserved successfully");
        updateTable(selectedTable, { status: "reserved" })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
        //Reset fields
        setData((prevData) => ({
          ...prevData,
          table_id: "",
          reservation_time: "",
          reservation_date: "",
          party_number: "",
          special_requests: "",
          menu_items: [],
        }));
        setSelectedTable(null);
        setTableName("");
        setSelectedMenuItems([]);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.error);
      });
  };

  //add menu item
  const addItem = (itemId) => {
    setSelectedMenuItems((prevSelected = []) => {
      const existingItem = prevSelected.find((item) => item.itemId === itemId);
      if (existingItem) {
        //increase the count if item already exists
        return prevSelected.map((item) =>
          item.itemId === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item with quantity 1
        return [...prevSelected, { itemId, quantity: 1 }];
      }
    });
  };

  //remove menu item
  const removeItem = (itemId) => {
    setSelectedMenuItems((prevSelected = []) => {
      const existingItem = prevSelected.find((item) => item.itemId === itemId);
      if (!existingItem) {
        return prevSelected;
      }

      if (existingItem.quantity === 1) {
        // Remove item if quantity is 1
        return prevSelected.filter((item) => item.itemId !== itemId);
      } else {
        // Decrease quantity by 1
        return prevSelected.map((item) =>
          item.itemId === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
    });
  };

  //get tables function
  useEffect(() => {
    getTables()
      .then((res) => {
        setTables(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //get menu items
  useEffect(() => {
    getMenuItems()
      .then((res) => {
        console.log(res);
        setMenuItems(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="bg-slate-900 min-h-screen mt-20 text-white">
      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Table Reservation</h2>
          <div className="flex space-x-4">
            <div className="bg-green-500 px-3 py-1 rounded-full text-sm flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
              Available
            </div>
            <div className="bg-red-500 px-3 py-1 rounded-full text-sm flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
              Reserved
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Tables Section */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-lg p-6 shadow-lg mb-6">
              <h3 className="text-xl font-medium mb-4">Select a Table</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {tables.map((table) => (
                  <div
                    key={table._id}
                    className={`border-2 ${
                      table.status === "available"
                        ? "border-green-500 hover:bg-green-500/20 cursor-pointer"
                        : "border-red-500 opacity-50 cursor-not-allowed"
                    } rounded-lg p-4 flex flex-col items-center justify-center transition-all`}
                    onClick={() => {
                      if (table.status === "available") {
                        setTableName(table.name);
                        setSelectedTable(table._id);
                        setData({ ...data, table_id: table._id });
                      }
                    }}
                  >
                    <div className="w-12 h-12 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-8 h-8"
                      >
                        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-400">{table.name}</span>
                    <span className="text-xs text-gray-400">
                      {table.capacity} seats
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* pre order menu items     */}

            <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-medium mb-4">
                Pre-order Menu Items (Optional)
              </h3>
              <div className="space-y-4">
                {menuItems.map((item) => {
                  const selectedItem =
                    selectedMenuItems?.find((i) => i.itemId === item._id) ||
                    null;
                  return (
                    <div
                      key={item._id}
                      className="flex justify-between items-center p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
                    >
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <span className="text-xs text-gray-400">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-green-400">
                          ${item.price.toFixed(2)}
                        </span>

                        {selectedItem && (
                          <div className="w-6 h-6 rounded-md border border-gray-500 flex items-center justify-center hover:bg-green-500 hover:border-green-500">
                            {/* Minus (-) Button */}

                            <button
                              onClick={() => removeItem(item._id)}
                              className="w-6 h-6 rounded-md border border-gray-500 flex items-center justify-center bg-red-500 hover:bg-red-600"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>
                          </div>
                        )}

                        {/* Display Count if Item is Selected */}
                        {selectedItem && (
                          <span className="text-white font-semibold">
                            {selectedItem.quantity}
                          </span>
                        )}

                        {/* Plus (+) Button */}

                        <div className="w-6 h-6 rounded-md border border-gray-500 flex items-center justify-center hover:bg-green-500 hover:border-green-500">
                          <button
                            onClick={() => addItem(item._id)}
                            className="w-6 h-6 rounded-md border border-gray-500 flex items-center justify-center hover:bg-green-500 hover:border-green-500"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reservation Form */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg p-6 shadow-lg sticky top-6">
              <h3 className="text-xl font-medium mb-6">Reservation Details</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="reservation_date"
                    value={data.reservation_date}
                    onChange={handleDateAndTimeChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    name="reservation_time"
                    value={data.reservation_time}
                    onChange={handleDateAndTimeChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Selected Table
                  </label>
                  <div className="bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-gray-400">
                    {tableName ? tableName : "No table selected"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Number of Guests
                  </label>
                  <select
                    name="party_number"
                    value={data.party_number}
                    onChange={handleChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Party Size</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6+">6+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Special Requests
                  </label>
                  <textarea
                    name="special_requests"
                    className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Any special requests or notes"
                  ></textarea>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium transition-colors"
                >
                  Confirm Reservation
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReservationPage;

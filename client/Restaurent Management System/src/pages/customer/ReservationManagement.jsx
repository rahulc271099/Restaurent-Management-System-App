import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getReservation,
  updateReservation,
} from "../../services/reservationServices";
import { getMenuItems } from "../../services/menuServices";

const ReservationManagement = () => {
  const navigate = useNavigate();

  // This would be replaced with actual data from your backend
  const [reservations, setReservations] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [formData, setFormData] = useState({
    reservation_time: "",
    party_number: 2,
    occassion: "",
    special_request: "",
  });

  // Time slots for reservation
  const timeSlots = [
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
  ];

  // Simulating data fetching from backend
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      getReservation()
        .then((res) => {
          console.log(res);
          setReservations(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
      setIsLoading(false);
    }, 1000);
  }, []);

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

  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16); // Extract "YYYY-MM-DDTHH:MM"
  };

  const openEditModal = (reservation) => {
    console.log(reservation);
    setCurrentReservation(reservation);
    setFormData({
      reservationTime: formatDateTime(reservation.reservation_time),
      party_number: reservation.party_number,
      occasion: reservation.occassion,
      special_request: reservation.special_request,
      menu_items: reservation.menu_items.map((item) => ({
        menuItemId: item.menuItemId || item._id, // Ensure correct mapping
        quantity: item.quantity || 1,
      })),
    });

    setIsEditModalOpen(true);
  };

  const openDeleteModal = (reservation) => {
    setCurrentReservation(reservation);
    setIsDeleteModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateReservation = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.reservation_time || !formData.party_number) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);

    try {
      // Simulated API call
      // In a real app, you would call your update API
      // await updateReservation(currentReservation.id, formData);

      // Simulate successful update
      setTimeout(() => {
        // Update local state
        const updatedReservations = reservations.map((reservation) =>
          reservation.id === currentReservation.id
            ? { ...reservation, ...formData }
            : reservation
        );

        setReservations(updatedReservations);
        setIsEditModalOpen(false);
        setIsLoading(false);
        toast.success("Reservation updated successfully");
      }, 1000);
    } catch (error) {
      console.error("Error updating reservation:", error);
      toast.error("Failed to update reservation");
      setIsLoading(false);
    }
  };

  const handleDeleteReservation = async () => {
    setIsLoading(true);

    try {
      // Simulated API call
      // In a real app, you would call your delete API
      // await deleteReservation(currentReservation.id);

      // Simulate successful deletion
      setTimeout(() => {
        // Update local state
        const updatedReservations = reservations.filter(
          (reservation) => reservation.id !== currentReservation.id
        );

        setReservations(updatedReservations);
        setIsDeleteModalOpen(false);
        setIsLoading(false);
        toast.success("Reservation cancelled successfully");
      }, 1000);
    } catch (error) {
      console.error("Error deleting reservation:", error);
      toast.error("Failed to cancel reservation");
      setIsLoading(false);
    }
  };

  //menu item change
  const handleMenuItemChange = (menuItem) => {
    setFormData((prev) => {
      const existingItem = prev.menu_items.find(
        (item) => item.menuItemId._id === menuItem._id
      );
  
      if (existingItem) {
        // Remove if already selected
        return {
          ...prev,
          menu_items: prev.menu_items.filter(
            (item) => item.menuItemId._id !== menuItem._id
          ),
        };
      } else {
        // Add with full menuItem object
        return {
          ...prev,
          menu_items: [...prev.menu_items, { menuItemId: menuItem, quantity: 1 }],
        };
      }
    });
  };
  
  const handleMenuItemQuantityChange = (menuItem, newQuantity) => {
    const quantity = Math.max(1, Number(newQuantity)); // Ensure at least 1
  
    setFormData((prevData) => ({
      ...prevData,
      menu_items: prevData.menu_items.map((item) =>
        item.menuItemId._id === menuItem._id ? { ...item, quantity } : item
      ),
    }));
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Reservations</h1>
          <button
            onClick={() => navigate("/customer/reservation")}
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-md transition-all duration-300 hover:shadow-amber-400/20 hover:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            New Reservation
          </button>
        </div>

        {isLoading && reservations.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : reservations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <div className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mt-4 mb-2">
              No Reservations Found
            </h2>
            <p className="text-gray-600 mb-6">
              You don't have any upcoming reservations. Would you like to book a
              table?
            </p>
            <button
              onClick={() => navigate("/customer/reservation")}
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-md transition-all duration-300 hover:shadow-amber-400/20 hover:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Book a Table
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {reservations?.map((reservation) => (
              <div
                key={reservation._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="mb-4 md:mb-0">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Reservation for {reservation.party_number}{" "}
                        {reservation.party_number === 1 ? "Guest" : "Guests"}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {/* {formatDate(reservation.date)} at {reservation.reservation_time} */}
                        {new Date(
                          reservation.reservation_time
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          reservation.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : reservation.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {reservation.status.charAt(0).toUpperCase() +
                          reservation.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reservation.occassion && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Occasion
                          </p>
                          <p className="mt-1 text-gray-900">
                            {reservation.occassion}
                          </p>
                        </div>
                      )}
                      {reservation.special_request && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Special Requests
                          </p>
                          <p className="mt-1 text-gray-900">
                            {reservation.special_request}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={() => openEditModal(reservation)}
                      className="flex-1 bg-white border border-amber-600 text-amber-600 py-2 px-4 rounded-lg hover:bg-amber-50 transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      Edit Reservation
                    </button>
                    <button
                      onClick={() => openDeleteModal(reservation)}
                      className="flex-1 bg-white border border-red-600 text-red-600 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Cancel Reservation
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Reservation Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
            &#8203;
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleUpdateReservation}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-amber-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Edit Reservation
                      </h3>
                      <div className="mt-4 space-y-4">
                        {/* Date & Time */}
                        <div>
                          <label
                            htmlFor="reservationTime"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Date & Time*
                          </label>
                          <input
                            type="datetime-local"
                            name="reservation_time"
                            id="reservation_time"
                            value={formData.reservation_time}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                            min={new Date().toISOString().slice(0, 16)}
                            required
                          />
                        </div>

                        {/* Party number */}
                        <div>
                          <label
                            htmlFor="guests"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Guests*
                          </label>
                          <input
                            type="number"
                            name="party_number"
                            id="party_number"
                            value={formData.party_number}
                            onChange={handleInputChange}
                            min="1"
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                            required
                          />
                        </div>

                        {/* Occassion */}
                        <div>
                          <label
                            htmlFor="occassion"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Occassion
                          </label>
                          <input
                            type="text"
                            name="occassion"
                            id="occassion"
                            value={formData.occassion}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>

                        {/* Special Requests */}
                        <div>
                          <label
                            htmlFor="special_request"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Special Requests
                          </label>
                          <textarea
                            name="special_request"
                            id="special_request"
                            value={formData.special_request}
                            onChange={handleInputChange}
                            rows="3"
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                          ></textarea>
                        </div>

                        {/* Menu Items Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Menu Items
                          </label>
                          <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                            {menuItems?.map((item) => {
                              const selectedItem = formData.menu_items?.find(
                                (menuItem) => menuItem.menuItemId._id === item._id
                              );
                              return (
                                <div
                                  key={item._id}
                                  className="flex items-center justify-between border p-2 rounded-md"
                                >
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      value={item._id}
                                      checked={!!selectedItem}
                                      onChange={() =>
                                        handleMenuItemChange(item)
                                      }
                                      className="mr-2"
                                    />
                                    {item.name}
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={selectedItem?.quantity || 0}
                                    onChange={(e) =>
                                      handleMenuItemQuantityChange(
                                        item,
                                        e.target.value
                                      )
                                    }
                                    className="w-16 border border-gray-300 rounded-md text-center"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold">Cancel Reservation</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to cancel your reservation? This action
              cannot be undone.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                No, Keep It
              </button>
              <button
                onClick={handleDeleteReservation}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Yes, Cancel It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationManagement;

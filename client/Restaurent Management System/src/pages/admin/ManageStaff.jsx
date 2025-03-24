import React, { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiMail,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import {
  createStaff,
  deleteStaff,
  getStaff,
  updateStaff,
} from "../../services/staffServices";
import { toast } from "react-toastify";

const ManageStaff = () => {
  //   const [staff, setStaff] = useState([
  //     { id: 1, name: "John Doe", email: "john@restaurant.com", phone: "555-123-4567", role: "Manager", status: "Active" },
  //     { id: 2, name: "Jane Smith", email: "jane@restaurant.com", phone: "555-987-6543", role: "Chef", status: "Active" },
  //     { id: 3, name: "Mike Johnson", email: "mike@restaurant.com", phone: "555-456-7890", role: "Waiter", status: "Active" },
  //     { id: 4, name: "Sarah Williams", email: "sarah@restaurant.com", phone: "555-789-0123", role: "Bartender", status: "On Leave" },
  //   ]);

  const [staff, setStaff] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    staffDetails: {
      shift_start: "",
      shift_end: "",
      status: "active",
      position: "manager",
    },
  });

  useEffect(() => {
    getStaff()
      .then((res) => {
        console.log(res);
        setStaff(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (name in prevData.staffDetails) {
        return {
          ...prevData,
          staffDetails: {
            ...prevData.staffDetails,
            [name]: value,
          },
        };
      } else {
        // return {
        //   ...prevData,
        //   [name]: value === "" ? prevData[name] : value, // Avoid empty password overwriting
        // };
        return {
          ...prevData,
          [name]: name === "password" ? value : value,
        };
      }
    });
  };

  // Handle staff creation
  const handleAddStaff = () => {
    createStaff(formData)
      .then((res) => {
        console.log(res);
        toast.success("Staff added successfully")
        return getStaff();
      })
      .then((response) => {
        setStaff(response.data.data);
        setShowAddModal(false);
        setFormData({
            name: "",
            email: "",
            phone: "",
            password: "",
            staffDetails: {
              shift_start: "",
              shift_end: "",
              status: "active",
              position: "manager",
            },
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.error)
      });
  };

  // Handle edit staff
  const handleEditStaff = () => {
    updateStaff(formData, currentStaff._id)
      .then((res) => {
        console.log(res);
        return getStaff();
      })
      .then((response) => {
        console.log(response);
        setStaff(response.data.data);
        toast.success("Staff updated successfully");
        setShowEditModal(false);
        setCurrentStaff("");
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          staffDetails: {
            shift_start: "",
            shift_end: "",
            status: "active",
            position: "",
          },
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.error);
      });
  };

  // Handle delete staff
  const handleDeleteStaff = () => {
    deleteStaff(currentStaff._id)
      .then((res) => {
        console.log(res);
        return getStaff();
      })
      .then((response) => {
        console.log(response);
        setStaff(response.data.data)
        toast.success("Staff removed successfully");
        setShowDeleteModal(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.error);
      });
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      staffDetails: {
        shift_start: "",
        shift_end: "",
        status: "active",
        position: "manager",
      },
    });
    setShowAddModal(true);
  };

  // Open edit modal with current staff data
  const openEditModal = (staffMember) => {
    setCurrentStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone,
      password: "",
      staffDetails: {
        shift_start: staffMember.staffDetails?.shift_start
          ? new Date(staffMember.staffDetails.shift_start)
              .toISOString()
              .slice(0, 16)
          : "", // Format for datetime-local
        shift_end: staffMember.staffDetails?.shift_end
          ? new Date(staffMember.staffDetails.shift_end)
              .toISOString()
              .slice(0, 16)
          : "",
        position: staffMember.staffDetails?.position || "",
        status: staffMember.staffDetails?.status || "",
      },
    });
    setShowEditModal(true);
  };

  // Open delete modal with current staff
  const openDeleteModal = (staffMember) => {
    setCurrentStaff(staffMember);
    setShowDeleteModal(true);
  };

  // Filter staff based on search term
  const filteredStaff = staff?.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "On Leave":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="h-full">
      {/* Header with search and add button */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
            placeholder="Search staff by name, email or role"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 flex items-center"
        >
          <FiPlus className="mr-2" />
          Add New Staff
        </button>
      </div>

      {/* Staff list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3">
                  Position
                </th>
                <th scope="col" className="px-6 py-3">
                  Shift start
                </th>
                <th scope="col" className="px-6 py-3">
                  shift end
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff?.map((staffMember) => (
                <tr
                  key={staffMember._id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {staffMember.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FiMail className="mr-2 text-gray-400" />
                      {staffMember.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FiPhone className="mr-2 text-gray-400" />
                      {staffMember.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {staffMember.staffDetails.position}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {new Date(
                      staffMember.staffDetails.shift_start
                    ).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {new Date(
                      staffMember.staffDetails.shift_end
                    ).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        staffMember.status
                      )}`}
                    >
                      {staffMember.staffDetails.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <button
                      onClick={() => openEditModal(staffMember)}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(staffMember)}
                      className="font-medium text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStaff.length === 0 && (
                <tr className="bg-white border-b">
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No staff members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4 overflow-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full  max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Add New Staff
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                    placeholder="Name"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                    placeholder="name@gmail.com"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                    placeholder="555-123-4567"
                  />
                </div>
              </div>
              {/* <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <select
                  name="position"
                  value={formData.staffDetails.position}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                >
                  <option value="manager">Manager</option>
                  <option value="chef">Chef</option>
                  <option value="waiter">Waiter</option>
                </select>
              </div> */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.staffDetails.status}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                >
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                </select>
              </div>
              {/* Shift Start */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shift Start
                </label>
                <input
                  type="datetime-local"
                  name="shift_start"
                  value={formData.staffDetails.shift_start}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  required
                />
              </div>

              {/* Shift End */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shift End
                </label>
                <input
                  type="datetime-local"
                  name="shift_end"
                  value={formData.staffDetails.shift_end}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  required
                />
              </div>

              {/* Position */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <select
                  name="position"
                  value={formData.staffDetails.position || "manager"}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                >
                  <option value="manager">Manager</option>
                  <option value="chef">Chef</option>
                  <option value="waiter">Waiter</option>
                </select>
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
                onClick={handleAddStaff}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Add Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 flex
        items-center justify-center p-4 overflow-auto"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Edit Staff</h3>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
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
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shift start
                </label>
                <input
                  type="datetime-local"
                  name="shift_start"
                  value={formData.staffDetails.shift_start}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shift end
                </label>
                <input
                  type="datetime-local"
                  name="shift_end"
                  value={formData.staffDetails.shift_end}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <select
                  name="position"
                  value={formData.staffDetails.position}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                >
                  <option value="manager">Manager</option>
                  <option value="chef">Chef</option>
                  <option value="waiter">Waiter</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.staffDetails.status}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                >
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                </select>
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
                onClick={handleEditStaff}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Staff Modal */}
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
                Are you sure you want to delete {currentStaff?.name}?
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
                onClick={handleDeleteStaff}
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

export default ManageStaff;

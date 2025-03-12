import React, { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";

const ManageTable = () => {

    const [tables, setTables] = useState([
        { id: 1, name: "Table 1", capacity: 4, status: "Available", location: "Main Floor" },
        { id: 2, name: "Table 2", capacity: 2, status: "Occupied", location: "Main Floor" },
        { id: 3, name: "Table 3", capacity: 6, status: "Reserved", location: "Patio" },
        { id: 4, name: "Table 4", capacity: 8, status: "Available", location: "Private Room" },
      ]);
      
      const [showAddModal, setShowAddModal] = useState(false);
      const [showEditModal, setShowEditModal] = useState(false);
      const [showDeleteModal, setShowDeleteModal] = useState(false);
      const [currentTable, setCurrentTable] = useState(null);
      const [searchTerm, setSearchTerm] = useState("");
      
      const [formData, setFormData] = useState({
        name: "",
        capacity: 2,
        status: "Available",
        location: "Main Floor"
      });
      
      // Handle form input changes
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
      
      // Handle table creation
      const handleAddTable = () => {
        const newTable = {
          id: tables.length + 1,
          ...formData
        };
        setTables([...tables, newTable]);
        setShowAddModal(false);
        setFormData({
          name: "",
          capacity: 2,
          status: "Available",
          location: "Main Floor"
        });
      };
      
      // Handle edit table
      const handleEditTable = () => {
        const updatedTables = tables.map(table => 
          table.id === currentTable.id ? { ...table, ...formData } : table
        );
        setTables(updatedTables);
        setShowEditModal(false);
      };
      
      // Handle delete table
      const handleDeleteTable = () => {
        const updatedTables = tables.filter(table => table.id !== currentTable.id);
        setTables(updatedTables);
        setShowDeleteModal(false);
      };
      
      // Open edit modal with current table data
      const openEditModal = (table) => {
        setCurrentTable(table);
        setFormData({
          name: table.name,
          capacity: table.capacity,
          status: table.status,
          location: table.location
        });
        setShowEditModal(true);
      };
      
      // Open delete modal with current table
      const openDeleteModal = (table) => {
        setCurrentTable(table);
        setShowDeleteModal(true);
      };
      
      // Filter tables based on search term
      const filteredTables = tables.filter(table => 
        table.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        table.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
      // Status badge color
      const getStatusColor = (status) => {
        switch(status) {
          case "Available": return "bg-green-100 text-green-800";
          case "Occupied": return "bg-red-100 text-red-800";
          case "Reserved": return "bg-yellow-100 text-yellow-800";
          default: return "bg-gray-100 text-gray-800";
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
            placeholder="Search tables by name or location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 flex items-center"
        >
          <FiPlus className="mr-2" />
          Add New Table
        </button>
      </div>

      {/* Table list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Table Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Capacity
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Location
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTables.map((table) => (
                <tr
                  key={table.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {table.name}
                  </td>
                  <td className="px-6 py-4">{table.capacity} people</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        table.status
                      )}`}
                    >
                      {table.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{table.location}</td>
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <button
                      onClick={() => openEditModal(table)}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(table)}
                      className="font-medium text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTables.length === 0 && (
                <tr className="bg-white border-b">
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No tables found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Add New Table
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Table Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Table Name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                >
                  <option value="Main Floor">Main Floor</option>
                  <option value="Patio">Patio</option>
                  <option value="Private Room">Private Room</option>
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
                onClick={handleAddTable}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Add Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Table Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Edit Table</h3>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Table Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Table Name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                >
                  <option value="Main Floor">Main Floor</option>
                  <option value="Patio">Patio</option>
                  <option value="Private Room">Private Room</option>
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
                onClick={handleEditTable}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Table Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Delete Table
              </h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-700">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{currentTable?.name}</span>?
                This action cannot be undone.
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
                onClick={handleDeleteTable}
                className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Delete Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTable;

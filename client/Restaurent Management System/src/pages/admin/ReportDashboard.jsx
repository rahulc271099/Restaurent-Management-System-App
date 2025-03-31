import React, { useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  Users,
  Truck,
  DollarSign,
  BarChart2,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ReportDashboard = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const navigate = useNavigate()
  
  const reportOptions = [
    {
      id: "salesReportDashBoard",
      title: "Sales Report",
      description:
        "View sales analytics, product performance, and revenue metrics",
      icon: <ShoppingBag size={24} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "delivery",
      title: "Home Delivery Report",
      description: "Track delivery metrics, timelines, and fulfillment rates",
      icon: <Truck size={24} />,
      color: "bg-green-100 text-green-600",
    },
    {
      id: "financial",
      title: "Financial Report",
      description:
        "Access profit & loss statements, expenses, and financial summaries",
      icon: <DollarSign size={24} />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: "customer",
      title: "Customer Report",
      description:
        "Analyze customer demographics, retention, and satisfaction data",
      icon: <Users size={24} />,
      color: "bg-amber-100 text-amber-600",
    },
    {
      id: "employee",
      title: "Employee Report",
      description:
        "View employee performance, attendance, and productivity metrics",
      icon: <BarChart2 size={24} />,
      color: "bg-red-100 text-red-600",
    },
  ];

  const handleReportClick = (reportId) => {
    setSelectedReport(reportId);
    navigate(`/admin/menu/${reportId}`)
  };

  const handleBack = () => {
    setSelectedReport(null);
  };

  const renderReportContent = () => {
    const report = reportOptions.find((option) => option.id === selectedReport);

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 w-full h-full">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>
          <h2 className="text-2xl font-bold">{report.title}</h2>
        </div>

        <div
          className={`${
            report.color.split(" ")[0]
          } bg-opacity-10 p-4 rounded-lg mb-6`}
        >
          <p className="text-gray-700">
            Showing {report.title.toLowerCase()} data for current period
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Quick Summary</h3>
            <p className="text-gray-600">
              Key metrics for this report category
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Status</h3>
            <p className="text-gray-600">Current status indicators</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Actions</h3>
            <p className="text-gray-600">Available actions for this report</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg h-64 flex items-center justify-center">
          <p className="text-gray-500">
            Detailed {report.id} report visualizations would appear here
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Report Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Select a report category to view detailed information
          </p>
        </div>

        {selectedReport ? (
          renderReportContent()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleReportClick(option.id)}
                className={`group p-6 rounded-xl shadow-lg
                    transform transition-transform duration-300 hover:-translate-y-2 cursor-pointer`}
              >
                <div
                  className={`${option.color} rounded-full w-12 h-12 flex items-center justify-center mb-4`}
                >
                  {option.icon}
                </div>
                <h2 className="text-xl font-bold mb-2">{option.title}</h2>
                <p className="text-gray-600 mb-6">{option.description}</p>
                {/* "View Report" - Hidden initially, shown on hover */}
                <div className="flex items-center text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-4">
                  <span>View Report</span>
                  <ArrowRight size={16} className="ml-2" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDashboard;

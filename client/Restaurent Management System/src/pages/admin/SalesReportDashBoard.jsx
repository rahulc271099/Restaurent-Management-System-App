import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Download, Filter, TrendingUp, DollarSign, ShoppingBag, Users, ChevronDown, List, Grid, ArrowUp, ArrowDown } from 'lucide-react';
import { getReport } from '../../services/reportServices';

const SalesReportDashboard = () => {
  const [dateRange, setDateRange] = useState('week');
  const [viewMode, setViewMode] = useState('grid');
  
  // Sample data based on the MongoDB aggregation
  const totalSalesData = {
    totalRevenue: 287650.45,
    totalOrders: 4328,
    averageOrderValue: 66.46
  };
  
  const dailySalesData = [
    { date: '2025-03-23', totalRevenue: 25890.75, totalOrders: 387 },
    { date: '2025-03-24', totalRevenue: 31250.50, totalOrders: 489 },
    { date: '2025-03-25', totalRevenue: 27650.25, totalOrders: 412 },
    { date: '2025-03-26', totalRevenue: 30950.40, totalOrders: 468 },
    { date: '2025-03-27', totalRevenue: 33750.80, totalOrders: 507 },
    { date: '2025-03-28', totalRevenue: 42980.35, totalOrders: 645 },
    { date: '2025-03-29', totalRevenue: 48650.90, totalOrders: 726 },
    { date: '2025-03-30', totalRevenue: 46520.50, totalOrders: 694 }
  ];
  
  const categorySalesData = [
    { category: 'Main Dishes', totalRevenue: 125600.35, totalOrders: 1865, color: '#8884d8' },
    { category: 'Appetizers', totalRevenue: 58200.75, totalOrders: 1025, color: '#83a6ed' },
    { category: 'Desserts', totalRevenue: 45750.20, totalOrders: 782, color: '#8dd1e1' },
    { category: 'Beverages', totalRevenue: 37500.50, totalOrders: 1524, color: '#82ca9d' },
    { category: 'Sides', totalRevenue: 20598.65, totalOrders: 415, color: '#ffc658' }
  ];
  
  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const getPercentageChange = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };
  
  // Calculate percentage changes
  const previousRevenue = 245800.30;
  const previousOrders = 3875;
  
  const revenueChange = getPercentageChange(totalSalesData.totalRevenue, previousRevenue);
  const ordersChange = getPercentageChange(totalSalesData.totalOrders, previousOrders);
  
  useEffect(()=>{
    getReport().then(res=>{
      console.log(res);
    }).catch(err=>{
      console.log(err);
    })
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sales Report</h1>
              <p className="mt-1 text-sm text-gray-500">View and analyze your sales performance</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <div className="relative">
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="today">Today</option>
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                  <option value="quarter">Last 3 months</option>
                  <option value="year">This year</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
              </div>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <Calendar className="h-4 w-4 mr-2" />
                Custom Date
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{formatCurrency(totalSalesData.totalRevenue)}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className={`flex items-center ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {revenueChange >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                <span className="text-sm font-medium">{Math.abs(revenueChange).toFixed(1)}%</span>
              </div>
              <span className="text-xs text-gray-500 ml-2">vs. previous period</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{totalSalesData.totalOrders.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className={`flex items-center ${ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {ordersChange >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                <span className="text-sm font-medium">{Math.abs(ordersChange).toFixed(1)}%</span>
              </div>
              <span className="text-xs text-gray-500 ml-2">vs. previous period</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{formatCurrency(totalSalesData.averageOrderValue)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className="flex items-center text-green-600">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">2.3%</span>
              </div>
              <span className="text-xs text-gray-500 ml-2">vs. previous period</span>
            </div>
          </div>
        </div>
        
        {/* View toggle */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Daily Sales Trend</h2>
          <div className="bg-white border border-gray-200 rounded-md inline-flex">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Daily Sales Chart */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dailySalesData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate} 
                    padding={{ left: 10, right: 10 }} 
                  />
                  <YAxis yAxisId="left" tickFormatter={(value) => `$${(value/1000).toFixed(1)}k`} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => value} />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'totalRevenue') return [`$${value.toLocaleString()}`, 'Revenue'];
                      return [value, 'Orders'];
                    }}
                    labelFormatter={(label) => formatDate(label)}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="totalRevenue" 
                    name="Revenue" 
                    stroke="#4f46e5" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="totalOrders" 
                    name="Orders" 
                    stroke="#16a34a" 
                    activeDot={{ r: 6 }} 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Category Sales & Daily Sales Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Sales */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Sales by Category</h3>
            </div>
            <div className="p-6">
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categorySalesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="totalRevenue"
                      nameKey="category"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categorySalesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      labelFormatter={(label) => label}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categorySalesData.map((category) => (
                    <tr key={category.category}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                        <span className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: category.color }}></span>
                        {category.category}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(category.totalRevenue)}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">{category.totalOrders.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Daily Sales Details */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Daily Sales Details</h3>
            </div>
            <div className="p-6">
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailySalesData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={formatDate} />
                    <YAxis tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      labelFormatter={(label) => formatDate(label)}
                    />
                    <Legend />
                    <Bar dataKey="totalRevenue" name="Revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dailySalesData.map((day) => (
                    <tr key={day.date}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{formatDate(day.date)}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(day.totalRevenue)}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">{day.totalOrders}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                        {formatCurrency(day.totalRevenue / day.totalOrders)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SalesReportDashboard;
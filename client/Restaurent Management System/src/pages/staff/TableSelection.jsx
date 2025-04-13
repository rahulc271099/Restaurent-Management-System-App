// import React, { useEffect, useState } from 'react';
// import {  
//   UsersIcon, 
//   CheckCircle2Icon, 
//   Armchair
// } from 'lucide-react';
// import { getTables } from '../../services/tableServices';
// import { useNavigate } from 'react-router-dom';

// const TableSelectionPage = () => {
//   const [tables, setTables] = useState([]);
//   const [selectedTable, setSelectedTable] = useState(null);
//   const navigate = useNavigate()
  
//   useEffect(()=>{
//     getTables().then(res=>{
//         console.log(res);
//         setTables(res.data.data)
//     }).catch(err=>{
//         console.log(err);
//     })
//   },[])

//   const getTableStatusColor = (status) => {
//     switch (status) {
//       case 'available': return 'bg-green-100 border-green-300';
//       case 'occupied': return 'bg-red-100 border-red-300';
//       case 'reserved': return 'bg-yellow-100 border-yellow-300';
//       default: return 'bg-gray-100 border-gray-300';
//     }
//   };

//   const handleTableSelect = (table) => {
//     if (table.status === 'available') {
//       setSelectedTable(table);
//     }
//   };

//   const handleTableSubmit = () =>{
//     // Handle table confirmation logic
//     console.log('Table confirmed:', selectedTable);
//     navigate("/staff",{state:selectedTable})
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="container mx-auto">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-4">
//             Table Selection
//           </h1>
//           <div className="flex space-x-4">
//             <div className="flex items-center space-x-2">
//               <div className="w-4 h-4 bg-green-500 rounded-full"></div>
//               <span>Available</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="w-4 h-4 bg-red-500 rounded-full"></div>
//               <span>Occupied</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
//               <span>Reserved</span>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-4 gap-6">
//           {tables.map((table) => (
//             <div 
//               key={table._id}
//               className={`
//                 relative p-4 rounded-xl border-2 
//                 transform transition-all duration-300
//                 ${getTableStatusColor(table.status)}
//                 ${table.status === 'available' 
//                   ? 'hover:shadow-lg hover:scale-105 cursor-pointer' 
//                   : 'opacity-70 cursor-not-allowed'}
//                 ${selectedTable?._id === table._id 
//                   ? 'ring-4 ring-blue-500' : ''}
//               `}
//               onClick={() => handleTableSelect(table)}
//             >
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center space-x-2">
//                   <Armchair  className="w-6 h-6 text-gray-600" />
//                   <span className="font-bold text-xl">
//                      {table.name}
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-1 text-gray-600">
//                   <UsersIcon className="w-4 h-4" />
//                   <span>{table.capacity}</span>
//                 </div>
//               </div>

//               <div className="mt-4 text-sm text-gray-700 capitalize">
//                 Status: {table.status}
//               </div>

//               {selectedTable?._id === table._id && (
//                 <div className="absolute top-2 right-2">
//                   <CheckCircle2Icon className="w-6 h-6 text-blue-600" />
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {selectedTable && (
//           <div className="mt-8 bg-white p-6 rounded-xl shadow-lg md:w-full lg:w-1/2 fixed right-2">
//             <h2 className="text-2xl font-bold mb-4">
//               Selected Table Details
//             </h2>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <span className="font-semibold">Table Number:</span>
//                 <p>{selectedTable.name}</p>
//               </div>
//               <div>
//                 <span className="font-semibold">Capacity:</span>
//                 <p>{selectedTable.capacity} persons</p>
//               </div>
//             </div>
//             <button 
//               className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg 
//                          hover:bg-blue-700 transition-colors"
//               onClick={handleTableSubmit}
//             >
//               Confirm Table
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TableSelectionPage;

import React, { useEffect, useState } from 'react';
import {  
  UsersIcon, 
  CheckCircle2Icon, 
  Armchair
} from 'lucide-react';
import { getTables } from '../../services/tableServices';
import { useNavigate } from 'react-router-dom';

const TableSelectionPage = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    getTables().then(res => {
        console.log(res);
        setTables(res.data.data);
    }).catch(err => {
        console.log(err);
    });
  }, []);

  const getTableStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 border-green-300';
      case 'occupied': return 'bg-red-100 border-red-300';
      case 'reserved': return 'bg-yellow-100 border-yellow-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const handleTableSelect = (table) => {
    if (table.status === 'available') {
      setSelectedTable(table);
      
      // On mobile, scroll to the details section when a table is selected
      if (window.innerWidth < 768) {
        setTimeout(() => {
          document.getElementById('selected-table-details')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    }
  };

  const handleTableSubmit = () => {
    // Handle table confirmation logic
    console.log('Table confirmed:', selectedTable);
    navigate("/staff", {state: selectedTable});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">
            Table Selection
          </h1>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm md:text-base">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm md:text-base">Occupied</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-sm md:text-base">Reserved</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {tables.map((table) => (
            <div 
              key={table._id}
              className={`
                relative p-3 md:p-4 rounded-xl border-2 
                transform transition-all duration-300
                ${getTableStatusColor(table.status)}
                ${table.status === 'available' 
                  ? 'hover:shadow-lg hover:scale-105 cursor-pointer' 
                  : 'opacity-70 cursor-not-allowed'}
                ${selectedTable?._id === table._id 
                  ? 'ring-4 ring-blue-500' : ''}
              `}
              onClick={() => handleTableSelect(table)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Armchair className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                  <span className="font-bold text-lg md:text-xl">
                     {table.name}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <UsersIcon className="w-4 h-4" />
                  <span>{table.capacity}</span>
                </div>
              </div>

              <div className="mt-3 md:mt-4 text-xs md:text-sm text-gray-700 capitalize">
                Status: {table.status}
              </div>

              {selectedTable?._id === table._id && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedTable && (
          <div 
            id="selected-table-details"
            className="mt-6 md:mt-8 bg-white p-4 md:p-6 rounded-xl shadow-lg 
                     w-full md:max-w-lg lg:max-w-xl 
                     mx-auto md:mx-0 md:ml-auto
                     static md:sticky md:top-8">
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
              Selected Table Details
            </h2>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <span className="font-semibold">Table Number:</span>
                <p>{selectedTable.name}</p>
              </div>
              <div>
                <span className="font-semibold">Capacity:</span>
                <p>{selectedTable.capacity} persons</p>
              </div>
            </div>
            <button 
              className="mt-4 w-full bg-blue-600 text-white py-2 md:py-3 rounded-lg 
                         hover:bg-blue-700 transition-colors"
              onClick={handleTableSubmit}
            >
              Confirm Table
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableSelectionPage;
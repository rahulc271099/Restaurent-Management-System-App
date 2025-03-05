const { tableEvents } = require("../events/index");
const tableDB = require("../Models/tableModel");

const createTable = async (req, res) => {
  try {
    const { capacity, status } = req.body;
    if (!capacity || !status) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const newTable = new tableDB({
      capacity,
      status,
    });
    const saved = await newTable.save();
    res.status(400).json({
      success: true,
      data: saved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const getTables = async (req, res) => {
  try {
    const tables = await tableDB.find();
    if (!tables) {
      return res.status(404).json({
        error: "No tables found",
      });
    }
    res.status(200).json({
      success: true,
      data: tables,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const updateTable = async (req, res) => {
  try {
    const { tableId } = req.params;
    const { capacity, status, reservations } = req.body;

    const table = await tableDB.findById(tableId);
    if (!table) {
      return res.status(404).json({
        error: "Table not found",
      });
    }
    const updatedTable = await tableDB.findByIdAndUpdate(
      tableId,
      { capacity, status, reservations },
      { new: true }
    );

    if (updatedTable && status === 'available') {
        // Emit event when table becomes available
        tableEvents.emit('tableAvailable', updatedTable._id);
      }

    res.status(200).json({
      success: true,
      data: updatedTable,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const deleteTable = async (req, res) => {
  try {
    const { tableId } = req.params;
    const table = await tableDB.findById(tableId);
    if (!table) {
      return res.status(404).json({
        error: "Table not found",
      });
    }
    const deletedTable = await tableDB.findByIdAndDelete(tableId);
    res.status(200).json({
      success: true,
      message: "Table deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = { createTable, getTables, updateTable, deleteTable };

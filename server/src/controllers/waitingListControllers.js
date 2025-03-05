const waitingListDB = require("../Models/waitingListModel");

const addToWaitingList = async (req, res) => {
  try {
    const { customer_name, party_size, contact } = req.body;
    if (!customer_name || !party_size) {
      return res
        .status(400)
        .json({ error: "Customer name and party size are required" });
    }

    const waitingEntry = new WaitingListDB({
      customer_name,
      party_size,
      contact,
      user_id: req.user ? req.user.id : undefined,
    });

    const savedEntry = await waitingListDB.save();
    res.status(201).json({
      success: true,
      data: savedEntry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getWaitingList = async (req, res) => {
  try {
    const waitingEntries = await waitingListDB
      .find({ status: "waiting" })
      .sort({ created_at: 1 });
    res.status(200).json({
      success: true,
      data: waitingEntries,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateWaitingList = async (req, res) => {
  try {
    const { waitingListId } = req.params;
    const { status, table_id } = req.body;
    // Validate status if necessary
    const allowedStatus = ["waiting", "notified", "seated", "cancelled"];
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({ error: "Invalid status provided" });
    }

    const waitingListEntry = await waitingListDB.findById(waitingListId);

    if (!waitingListEntry) {
      return res.status(404).json({ error: "Waiting list entry not found" });
    }
    
    const updatedEntry = await waitingListDB.findByIdAndUpdate(
      waitingListId,
      { status, table_id },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedEntry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteWaitingListEntry = async (req, res) => {
    try {
      const { waitingListId } = req.params;

      const waitingListEntry = await waitingListDB.findById(waitingListId)
      if (!waitingListEntry) {
        return res.status(404).json({ error: "Waiting list entry not found" });
      }
      const deletedEntry = await waitingListDB.findByIdAndDelete(waitingListId);
      
      res.status(200).json({
        success: true,
        message: "Entry deleted successfully",
        data: deletedEntry,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

module.exports = { addToWaitingList, getWaitingList, updateWaitingList, deleteWaitingListEntry};

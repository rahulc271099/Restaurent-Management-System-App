const { tableEvents } = require('../events');
const waitingListDB = require('../Models/waitingListModel');


// Notification function: integrate your email, SMS, or push notification logic here
const notifyCustomer = async (waitingEntry, tableId) => {
  console.log(`Notifying ${waitingEntry.customer_name} that table ${tableId} is available.`);
  // Add your notification logic here.
};

// Listen for the 'tableAvailable' event
tableEvents.on('tableAvailable', async (tableId) => {
  try {
    // Get the earliest waiting entry with status 'waiting', sorted in FIFO order
    const waitingEntry = await waitingListtDB.findOne({ status: 'waiting' }).sort({ created_at: 1 });
    if (waitingEntry) {
      // Notify the customer using the notification function
      await notifyCustomer(waitingEntry, tableId);
  
      // Update the waiting entry's status to 'notified'
      waitingEntry.status = 'notified';
      await waitingEntry.save();
  
      // Set a timeout (e.g., 5 minutes) for the customer to confirm the reservation
      setTimeout(async () => {
        const refreshedEntry = await waitingListDB.findById(waitingEntry._id);
        if (refreshedEntry && refreshedEntry.status === 'notified') {
          // If no confirmation is received, mark the entry as cancelled
          refreshedEntry.status = 'cancelled';
          await refreshedEntry.save();
          // Optionally, emit the event again to notify the next waiting entry
          tableEvents.emit('tableAvailable', tableId);
        }
      }, 5 * 60 * 1000); // 5 minutes in milliseconds
    } else {
      console.log('No waiting entries found for notification.');
    }
  } catch (error) {
    console.error('Error handling tableAvailable event:', error);
  }
});
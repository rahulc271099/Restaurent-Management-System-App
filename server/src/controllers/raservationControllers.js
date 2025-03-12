const { json } = require("express");
const reservationDB = require("../Models/reservationModel");
const userDB = require("../Models/userModel");

const createReservation = async (req, res) => {
  try {
    const { table_id, reservation_time, status, menu_items, party_number } = req.body;
    if (!table_id || !reservation_time || !party_number) {
      return res.status(404).json({
        error: "Table id, reservation time are required and party number required",
      });
    }
    let customer_name;
    let reservationUserId;
    if (req.user.role === "customer") {
      const customer = await userDB.findById(req.user.id);

      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      customer_name = customer.name;
      reservationUserId = customer._id;
    } else if (req.user.role === "staff") {
      // Staff is making the reservation on behalf of a customer:
      // The staff must provide the customer's name (or additional details) in the request body.
      if (!req.body.customer_name) {
        return res.status(400).json({
          error:
            "Customer name must be provided when staff makes a reservation",
        });
      }
      customer_name = req.body.customer_name;
      // The reservation is recorded with the staff's ID.
      reservationUserId = req.user.id;
    } else {
      // If other roles try to create a reservation, you may reject or handle differently.
      return res
        .status(403)
        .json({ error: "Not authorized to make a reservation" });
    }
    const newReservation = new reservationDB({
      customer_name,
      user_id: reservationUserId,
      table_id,
      reservation_time,
      party_number,
      status: status || "confirmed", // Defaults to "confirmed" if not provided
      menu_items,
    });

    const savedReservation = await newReservation.save();
    return res.status(200).json({
      success: true,
      data: savedReservation,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const getReservationDetails = async (req, res) => {
  try {
    const reservations = await reservationDB.find();
    if (reservations.length === 0) {
      return res.status(404).json({
        error: "No reservations found",
      });
    }
    res.status(200).json({
      success: true,
      data: reservations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const getOneReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const reservation = await reservationDB.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({
        error: "No reservations found",
      });
    }
    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const updateReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const reservation = await reservationDB.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({
        error: "No reservation found",
      });
    }
    const updatedReservation = await reservationDB.findByIdAndUpdate(
      reservationId
    );
    res.status(200).json({
      success: true,
      data: updatedReservation,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const reservation = await reservationDB.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({
        error: "Reservation not found",
      });
    }
    const delettedReservation = await reservationDB.findByIdAndDelete(
      reservationId
    );
    res.status(200).json({
      success: true,
      messege: "Reservation deletted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

module.exports = {
  createReservation,
  getReservationDetails,
  getOneReservation,
  updateReservation,
  deleteReservation,
};

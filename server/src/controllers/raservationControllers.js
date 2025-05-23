const { json } = require("express");
const reservationDB = require("../Models/reservationModel");
const userDB = require("../Models/userModel");

const createReservation = async (req, res) => {
  try {
    const { table_id, reservation_time, status, menu_items, party_number, occassion, special_request} =
      req.body;
    if (!table_id || !reservation_time || !party_number) {
      return res.status(404).json({
        error:
          "Table id, reservation time are required and party number required",
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
      occassion,
      special_request,
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

// const getReservationDetails = async (req, res) => {
//   try {
//     const reservations = await reservationDB.find();
//     if (reservations.length === 0) {
//       return res.status(404).json({
//         error: "No reservations found",
//       });
//     }
//     res.status(200).json({
//       success: true,
//       data: reservations,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       error: "Internal server error",
//     });
//   }
// };

const getReservationDetails = async (req, res) => {
  try {
    const { customer_name } = req.query; // Get customer name if provided
    const user_id = req.user.id; // Logged-in user ID
    const user_role = req.user.role; // Assuming role is available in req.user

    let filter = {};

    if (user_role === "customer") {
      // Customers can only fetch their own reservations
      filter.user_id = user_id;
    } else if (user_role === "staff") {
      if (customer_name) {
        // Staff can search by customer name
        filter.customer_name = { $regex: new RegExp(customer_name, "i") };
      } else {
        // If no customer name is given, staff sees only reservations they created
        filter.user_id = user_id;
      }
    }

    // const reservations = await reservationDB
    //   .find(filter)
    //   .populate("table_id")
    //   .populate("menu_items.menuItemId");

    let query = reservationDB.find(filter).populate("table_id").populate("menu_items.menuItemId");

    // Populate user details ONLY if the role is 'customer'
    if (user_role === "admin") {
      query = query.populate({
        path: "user_id",
        select: "name email phone role", // Select only required fields
      });
    }
    const reservations = await query;

    if (!reservations.length) {
      return res.status(404).json({
        error: "No reservations found",
      });
    }

    res.status(200).json({
      success: true,
      data: reservations,
    });
  } catch (error) {
    console.error(error);
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
    const {reservation_time,party_number,status,menu_items,occassion,special_request} = req.body
    const reservation = await reservationDB.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({
        error: "No reservation found",
      });
    }
    const updatedReservation = await reservationDB.findByIdAndUpdate(
      reservationId,{reservation_time,party_number,status,menu_items,occassion,special_request}
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

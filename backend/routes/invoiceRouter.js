import express from "express";
import { clerkMiddleware } from "@clerk/express";
import {
  createInvoice,
  deleteInvoice,
  getInvoiceById,
  getInvoices,
  updateInvoice,
} from "../controllers/invoiceController.js";
import Invoice from "../models/invoiceModel.js"; 
const invoiceRouter = express.Router();
// Middleware
invoiceRouter.use(clerkMiddleware());
// COUNT ROUTE (FIRST)
invoiceRouter.get("/count", async (req, res) => {
  try {

   const { userId } = req.auth();
   // const userId = req.auth?.userId;

   // console.log("COUNT USER:", userId);

    const count = await Invoice.countDocuments({ owner: userId });

    res.json({ count });
  } catch (err) {
    console.error("COUNT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
 //  OTHER ROUTES
invoiceRouter.get("/", getInvoices);
invoiceRouter.get("/:id", getInvoiceById);
invoiceRouter.post("/", createInvoice);
invoiceRouter.put("/:id", updateInvoice);
invoiceRouter.delete("/:id", deleteInvoice);

export default invoiceRouter;
// import express from 'express';
// import { clerkMiddleware } from '@clerk/express';
// import { createInvoice,deleteInvoice, getInvoiceById, getInvoices, updateInvoice } from '../controllers/invoiceController.js';

// const invoiceRouter = express.Router();
// //app.use(clerkMiddleware());
// invoiceRouter.use(clerkMiddleware()); //temporily block just for bypass of authentication for post man

// invoiceRouter.get("/",getInvoices);
// invoiceRouter.get("/:id",getInvoiceById);
// invoiceRouter.post("/",createInvoice);
// invoiceRouter.put("/:id",updateInvoice);
// invoiceRouter.delete("/:id",deleteInvoice);

// export default invoiceRouter;

// import Invoice from "../models/Invoice.js"; // if not already

// router.get("/count", async (req, res) => {
//   try {
//     const userId = req.auth?.userId;

//     console.log("COUNT USER:", userId);

//     const count = await Invoice.countDocuments({ userId });

//     res.json({ count });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
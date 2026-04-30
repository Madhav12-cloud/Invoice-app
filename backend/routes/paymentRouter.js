import express from "express";
import { stripe } from "../config/stripe.js";
import UserPlan from "../models/UserPlan.js";

const router = express.Router();

/* ===========================
   STRIPE CHECKOUT
   =========================== */
   router.post("/create-checkout-session", async (req, res) => {
  try {
    const { plan, isDiscounted } = req.body;

    const cleanPlan = (plan || "").trim().toLowerCase();

    let priceId;

    if (cleanPlan === "professional" && isDiscounted) {
      priceId = "price_1TKEBUCFEM34WE1uwU2aP0qN";
    } else if (cleanPlan === "professional") {
      priceId = "price_1TKEAqCFEM34WE1uvLaYUcWa";
    }

    if (cleanPlan === "enterprise" && isDiscounted) {
      priceId = "price_1TKEFhCFEM34WE1uoKCqE1MY";
    } else if (cleanPlan === "enterprise") {
      priceId = "price_1TKED9CFEM34WE1uydy89CG6";
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/success",
     // cancel_url: "http://localhost:5173/?from=stripe",
      cancel_url: "http://localhost:5173/",
      //cancel_url: "http://localhost:5173/pricing",
    });

    res.json({ url: session.url });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});
// router.post("/create-checkout-session", async (req, res) => {
//   try {
//     console.log("REQ BODY:", req.body);

//     const { plan } = req.body;

//     const cleanPlan = (plan || "").trim().toLowerCase();
//     console.log("PLAN:", cleanPlan);

//     let price;

//     if (cleanPlan === "professional") {
//       price = 499;
//     } else if (cleanPlan === "enterprise") {
//       price = 1499;
//     } else {
//       return res.status(400).json({ error: "Invalid plan: " + plan });
//     }

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: [
//         {
//           price_data: {
//             currency: "inr",
//             product_data: {
//               name: cleanPlan + " plan",
//             },
//             unit_amount: price * 100,
//           },
//           quantity: 1,
//         },
//       ],
//       success_url: "http://localhost:5173/success",
//       cancel_url: "http://localhost:5173/pricing",
//     });

//     res.json({ url: session.url });

//   } catch (err) {
//     console.log("STRIPE ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

/* ===========================
   GET USER PLAN (FIXED)
   =========================== */
router.get("/user-plan/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userPlan = await UserPlan.findOne({ userId });
    res.json({
      plan: userPlan ? userPlan.plan : null,
    });
    // res.json({
    //   plan: userPlan?.plan || "starter",
    // });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   UPGRADE PLAN
   =========================== */
router.post("/upgrade", async (req, res) => {
  try {
    const { userId, plan } = req.body;

    await UserPlan.findOneAndUpdate(
      { userId },
      { plan },
      { upsert: true }
    );

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
// import express from "express";
// import { stripe } from "../config/stripe.js";
// import UserPlan from "../models/UserPlan.js";

// const router = express.Router();

// router.post("/create-checkout-session", async (req, res) => {
//   try {
//     console.log("REQ BODY:", req.body);

//     const { plan } = req.body;

//     const cleanPlan = plan?.trim().toLowerCase();
//     console.log("PLAN:", cleanPlan);

//     let price;

//     if (cleanPlan === "professional") {
//       price = 499;
//     } else if (cleanPlan === "enterprise") {
//       price = 1499;
//     } else {
//       console.log("INVALID PLAN");
//       return res.status(400).json({ error: "Invalid plan: " + plan });
//     }

//     console.log("PRICE:", price);

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: [
//         {
//           price_data: {
//             currency: "inr",
//             product_data: {
//               name: cleanPlan + " plan",
//             },
//             unit_amount: price * 100,
//           },
//           quantity: 1,
//         },
//       ],
//       success_url: "http://localhost:5173/success",
//       cancel_url: "http://localhost:5173/pricing",
//     });

//     console.log("SESSION CREATED:", session.url);

//     res.json({ url: session.url });

//   } catch (err) {
//     console.log("STRIPE ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });


// //API to get user plan
// // router.get("/user-plan/:userId", async (req, res) => {
// //   try {
// //     const { userId } = req.params;

// //     const userPlan = await UserPlan.findOne({ userId });

// //     res.json({
// //       plan: userPlan?.plan || "starter",
// //     });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// //GET COUNT OF USER ID'S INVOICES CREATION 
// // router.get("/count", async (req, res) => {
// //   try {
// //     const userId = req.auth?.userId; // ✅ CORRECT SOURCE

// //     const count = await Invoice.countDocuments({ userId });

// //     res.json({ count });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });
// // router.post("/create-checkout-session", async (req, res) => {
// //   try {
// //     const { plan } = req.body;

// //     let price;

// //     if (plan === "professional") price = 499;
// //     if (plan === "enterprise") price = 1499;

// //     const session = await stripe.checkout.sessions.create({
// //       payment_method_types: ["card"],
// //       mode: "payment",
// //       line_items: [
// //         {
// //           price_data: {
// //             currency: "inr",
// //             product_data: {
// //               name: plan + " plan",
// //             },
// //             unit_amount: price * 100,
// //           },
// //           quantity: 1,
// //         },
// //       ],
// //       success_url: "http://localhost:5174/success",
// //       cancel_url: "http://localhost:5174/pricing",
// //     });

// //     res.json({ url: session.url });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// import UserPlan from "../models/UserPlan.js";

// router.post("/upgrade", async (req, res) => {
//   try {
//     const { userId, plan } = req.body;

//     await UserPlan.findOneAndUpdate(
//       { userId },
//       { plan },
//       { upsert: true }
//     );

//     res.json({ success: true });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;

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
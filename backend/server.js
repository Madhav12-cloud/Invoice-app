import express from 'express'; 
import cors from 'cors'; 
import 'dotenv/config'; 
import { clerkMiddleware } from '@clerk/express' 
import { connectDB } from './config/db.js'; 
import path from 'path'; 
import invoiceRouter from './routes/invoiceRouter.js'; 
import businessProfileRouter from './routes/businessProfileRouter.js';
import aiInvoiceRouter from './routes/aiInvoiceRouter.js';

import paymentRouter from "./routes/paymentRouter.js";
import webhookRouter from "./routes/webhook.js";


const app = express(); 
const port = 5000; 
app.use("/api", webhookRouter);
//MIDDLEWARE
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://invoiceapp-seven-lovat.vercel.app"
  ],
  credentials: true
})); 
// app.use(cors({
//   origin: true,
//   credentials: true
// }));
// app.use(cors({
//     origin: "http://localhost:5174",
//   //origin: "http://localhost:5173",
//   credentials:true
//   })); 
app.use(clerkMiddleware()) 
app.use(express.json({limit:"20mb"})); 
app.use(express.urlencoded({limit:"20mb",extended:true})); 
//DB 
connectDB(); 
//ROUTES 
app.use('/uploads',express.static(path.join(process.cwd(),"uploads")));

app.use('/api/invoice',invoiceRouter);
app.use('/api/businessProfile', businessProfileRouter);
app.use('/api/ai',aiInvoiceRouter);
//Payment 
app.use("/api/payment", paymentRouter);

app.get('/',(req,res)=>{ res.send("API WORKING"); }); 

app.listen(port,() =>{ 
  console.log("CORS UPDATED TO 5174");
  console.log(`Server Started on http://localhost:${port}`);
    });

    
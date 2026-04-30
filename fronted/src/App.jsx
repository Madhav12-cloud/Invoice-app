import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import Dashboard from "./pages/Dashboard";
import AppShell from "./components/AppShell";
import CreateInvoice from "./pages/CreateInvoice";
import Invoices from "./pages/Invoices";
import InvoicePreview from "./components/InvoicePreview";
import BusinessProfile from "./pages/BusinessProfile";
import Success from "./components/Success";
import { ToastContainer } from "react-toastify";
import Notfound from "./pages/Notfound";
import PricingPage from "./pages/Pricing";
//logout route
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
const ClerkProtected = ({ children }) => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Navigate to="/" replace />; // ✅ FIX HERE
  }

  return children;
};

// const ClerkProtected = ({ children }) => (
//   <>
//     <SignedIn>{children}</SignedIn>
//     <SignedOut>
//       <RedirectToSignIn />
//     </SignedOut>
//   </>
// );

export default function App() {
  return (
    <div className="min-h-screen max-w-full overflow-x-hidden">
      <Routes>
        <Route path="/" element={<Home />} />
        {/*it must be a protect route */}
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/success" element={<Success />} />
        <Route
          path="/app"
          element={
            <ClerkProtected>
              <AppShell />
            </ClerkProtected>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoices/new" element={<CreateInvoice />} />
          <Route path="invoices/:id" element={<InvoicePreview />} />
          <Route path="invoices/:id/preview" element={<InvoicePreview />} />
          <Route path="invoices/:id/edit" element={<CreateInvoice />} />

          <Route path="create-invoice" element={<CreateInvoice />} />
          <Route path="business" element={<BusinessProfile />} />
        </Route>
        <Route path="*" element={<Notfound/>}/>
      </Routes>
                  <ToastContainer />
    </div>
  );
}

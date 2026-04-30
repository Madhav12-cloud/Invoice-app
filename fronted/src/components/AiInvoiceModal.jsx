import React, { use, useEffect, useState } from "react";
import { aiInvoiceModalStyles } from "../assets/dummyStyles";
import GeminiIcon from "./GeminiIcon";
import AnimatedButton from "../assets/GenerateBtn/Gbtn";

export default function AiInvoiceModal({
  open,
  onClose,
  onGenerate,
  initialText = "",
}) {
  const [text, setText] = useState(initialText || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setText(initialText || "");
    setError("");
    setLoading(false);
  }, [open, initialText]);

  if (!open) return null;

  async function handleGenerateClick() {
    setError("");
    const raw = (text || "").trim();
    if (!raw) {
      setError("Please paste invoice text to generate from AI.");
      return;
    }

    try {
      setLoading(true);
      const maybePromise = onGenerate && onGenerate(raw);
      if (maybePromise && typeof maybePromise.then === "function") {
        await maybePromise;
      }
    } catch (err) {
      console.error("onGenerate handler failed:", err);
      const msg =
        err &&
        (err.message || (typeof err === "string" ? err : JSON.stringify(err)));
      setError(msg || "failed to generate. Try again");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={aiInvoiceModalStyles.overlay}>
      <div
        className={aiInvoiceModalStyles.backdrop}
        onClick={() => onClose && onClose()}
      ></div>

      <div className={aiInvoiceModalStyles.modal}>
        <div className=" flex items-start justify-between">
          <div>
            <h3 className={aiInvoiceModalStyles.title}>
              <GeminiIcon className=" w-6 h-6 group-hover:scale-110 transition-transform flex-none" />
              Create Invoice with AI
            </h3>
            <p className={aiInvoiceModalStyles.description}>
              Paste any text that contains invoice details (client, item, qty,
              price) and we'll attempt to extract an invoice
            </p>
          </div>

          <button
            onClick={() => onClose && onClose()}
            className={aiInvoiceModalStyles.closeButton}
          >
            ✕
          </button>
        </div>

        <div className=" mt-4">
          <label className={aiInvoiceModalStyles.label}>
            Paste invoice text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`eg. A person wants a logo design for her organic brand "GreenVibe."
            Quoted for $120 for 2 logo options and final delivery in PNG and vector
            format`}
            rows={8}
            className={aiInvoiceModalStyles.textarea}
          ></textarea>
        </div>

        {error && (
          <div className={aiInvoiceModalStyles.error} role="alert">
            {String(error)
              .split("\n")
              .map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            {(/quota|exhausted|resource_exhausted/i.test(String(error)) && (
              <div style={{ marginTop: 8, fontSize: 13, color: "#374151" }}>
                Tip: AI is temporarily unavailable (quota). Try again in a few
                minutes, or create the invoice manually.
              </div>
            )) ||
              null}
          </div>
        )}
        <div className={aiInvoiceModalStyles.actions}>
          <AnimatedButton
            onClick={handleGenerateClick}
            isLoading={loading}
            disabled={loading}
            label="Generate"
          />
        </div>
      </div>
    </div>
  );
}

// import React, { useEffect, useState } from 'react';
// import { aiInvoiceModalStyles } from '../assets/dummyStyles';
// import GeminiIcon from './GeminiIcon';
// import AnimatedButton from "../assets/GenerateBtn/Gbtn"

// export default function AiInvoiceModal({open,onClose,onGenerate,initialText =""}) {
//   const [text, setText] = useState(initialText || "");
//   const [loading,setLoading] = useState(false);
//   const [error,setError] = useState("");

//   useEffect(() => {
//     setText(initialText || "");
//     setError("");
//     setLoading(false);
//   }, [open, initialText]);

//   if(!open) return null;

//   async function handleGenerateClick(){
//     setError("");
//     const raw = (text || "").trim();
//   if(!raw) {
//     setError("Please paste invoice text to generate from AI.");
//     return;
//   }

//   try {
//     setLoading(true);
//     const maybePromise = onGenerate && onGenerate(raw);
//     if(maybePromise && typeof maybePromise.then === "function"){
//       await maybePromise;
//     }
//   } catch (err) {
//       console.error("onGenerate handler failed:", err);
//       const msg = err && (err.message || (typeof err ==="string" ? err : JSON.stringify(err)));
//       setError(msg || "Failed to generate. Try again");
//   }
//   finally{
//     setLoading(false);
//   }
//   }
//   return (
//     <div className={aiInvoiceModalStyles.overlay}>

//       <div
//         className={aiInvoiceModalStyles.backdrop}
//         onClick={() => onClose && onClose()}
//         ></div>

//       <div className={aiInvoiceModalStyles.modal}>
//         <div className=" flex items-start justify-between">
//           <div>
//             <h3 className={aiInvoiceModalStyles.title}>
//               <GeminiIcon className=" w-6 h-6 group-hover:scale-110 transition-transform flex-none"/>
//               Create Invoice with AI
//             </h3>
//             <p className={aiInvoiceModalStyles.description}>
//               Paste any text that contains invoice details (client,items,qty,
//               prices) and we'll attempt to extract an invoice
//             </p>
//           </div>

//           <button onClick={() => onClose && onClose()}
//             className={aiInvoiceModalStyles.closeButton}>
//               ✕
//             </button>
//         </div>

//         <div className=" mt-4">
//           <label className={aiInvoiceModalStyles.label}>
//             Paste invoice text
//           </label>
//           <textarea value={text} onChange={(e) => setText(e.target.value)}
//             placeholder={`eg. A person wants a logo design for her organic brand "GreenVibe."
//             Quoted for $120 for 2 logo options and final delivery in PNG and vector
//             format`}
//             rows={8}
//             className={aiInvoiceModalStyles.textarea}
//             ></textarea>
//         </div>

//         {error && (
//                 <div className={aiInvoiceModalStyles.error} role="alert">
//                   {String(error)
//                     .split("\n")
//                     .map((line, i) => (
//                       <div key={i}>{line}</div>
//                     ))}
//                   {(/quota|exhausted|resource_exhausted/i.test(String(error)) && (
//                     <div style={{ marginTop: 8, fontSize: 13, color: "#374151" }}>
//                       Tip: AI is temporarily unavailable (quota). Try again in a few
//                       minutes, or create the invoice manually.
//                     </div>
//                   )) ||
//                     null}
//                 </div>
//         )}

//         <div className={aiInvoiceModalStyles.actions}>
//           <AnimatedButton
//             onClick={handleGenerateClick}
//             isLoading={loading}
//             disabled={loading}
//             label="Generate"
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// import React, { useEffect, useState } from "react";
// import { aiInvoiceModalStyles } from "../assets/dummyStyles";
// import GeminiIcon from "./GeminiIcon";
// import AnimatedButton from "../assets/GenerateBtn/Gbtn";

// export default function AiInvoiceModal({
//   open,
//   onClose,
//   onGenerate,
//   initialText = "",
// }) {
//   const [text, setText] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (open) {
//       setText(initialText || "");
//       setError("");
//       setLoading(false);
//     }
//   }, [open, initialText]);

//   if (!open) return null;

//   async function handleGenerateClick() {
//     setError("");

//     const raw = text.trim();

//     // ✅ ONLY validation lives here
//     if (!raw) {
//       setError("Please paste invoice text to generate from AI.");
//       return;
//     }

//     try {
//       setLoading(true);
//       await onGenerate(raw);
//     } catch (err) {
//       console.error("AI generate failed:", err);
//       setError(
//         err?.message ||
//           "Failed to generate invoice. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className={aiInvoiceModalStyles.overlay}>
//       <div
//         className={aiInvoiceModalStyles.backdrop}
//         onClick={onClose}
//       />

//       <div className={aiInvoiceModalStyles.modal}>
//         {/* HEADER */}
//         <div className="flex items-start justify-between">
//           <div>
//             <h3 className={aiInvoiceModalStyles.title}>
//               <GeminiIcon className="w-6 h-6 mr-2" />
//               Create Invoice with AI
//             </h3>
//             <p className={aiInvoiceModalStyles.description}>
//               Paste any text that contains invoice details (client, item,
//               quantity, price).
//             </p>
//           </div>

//           <button
//             className={aiInvoiceModalStyles.closeButton}
//             onClick={onClose}
//           >
//             ✕
//           </button>
//         </div>

//         {/* TEXTAREA */}
//         <div className="mt-4">
//           <label className={aiInvoiceModalStyles.label}>
//             Paste invoice text
//           </label>
//           <textarea
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             rows={8}
//             className={aiInvoiceModalStyles.textarea}
//             placeholder={`Create invoice for New Client
// TV for 1200
// PlayStation for 560
// Email: new@gmail.com
// Phone: 9988776655`}
//           />
//         </div>

//         {/* ERROR */}
//         {error && (
//           <div className={aiInvoiceModalStyles.error}>
//             {error}
//           </div>
//         )}

//         {/* ACTIONS */}
//         <div className={aiInvoiceModalStyles.actions}>
//           <AnimatedButton
//             label={loading ? "Generating..." : "Generate"}
//             onClick={handleGenerateClick}
//             disabled={loading}
//             isLoading={loading}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

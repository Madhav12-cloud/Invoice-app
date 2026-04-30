import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const upgradeUser = async () => {
      try {
        if (!isLoaded || !isSignedIn || !userId) return;

        const plan = localStorage.getItem("selectedPlan");

        console.log("SUCCESS PAGE PLAN:", plan);
        console.log("USER ID:", userId);

        if (!plan) {
          navigate("/app");
          return;
        }

        const res = await fetch("http://localhost:5000/api/payment/upgrade", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            plan,
          }),
        });

        const data = await res.json();
        console.log("UPGRADE RESPONSE:", data);

        localStorage.removeItem("selectedPlan");

        // ✅ IMPORTANT
        setTimeout(() => {
          navigate("/app");
        }, 1000);

      } catch (err) {
        console.log("ERROR:", err);
      }
    };

    upgradeUser();
  }, [isLoaded, isSignedIn, userId]);

  return <div>Processing payment...</div>;
}
// import { useEffect } from "react";
// import axios from "axios";
// import { useUser } from "@clerk/clerk-react";
// import { useNavigate } from "react-router-dom";

// const Success = () => {
//   const { user, isLoaded } = useUser();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isLoaded || !user) return;

//     const upgradeUser = async () => {
//       try {
//         const plan = localStorage.getItem("selectedPlan");

//         await axios.post(
//           "http://localhost:5000/api/payment/upgrade",
//           {
//             userId: user.id,
//             plan: plan,
//           }
//         );

//         console.log("User upgraded");

//         // ✅ REDIRECT AFTER SUCCESS
//         setTimeout(() => {
//           navigate("/app");
//         }, 2000);

//       } catch (err) {
//         console.log("Upgrade error:", err);
//       }
//     };

//     upgradeUser();
//   }, [isLoaded, user]);

//   return (
//     <div>
//       <h1>🎉 Payment Successful</h1>
//       <p>Redirecting to dashboard...</p>
//     </div>
//   );
// };

// export default Success;
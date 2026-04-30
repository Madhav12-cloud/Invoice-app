import React, { useState } from 'react';
import axios from "axios";
import { pricingStyles, pricingCardStyles } from '../assets/dummyStyles';
import { useClerk, useAuth, useUser} from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { useEffect } from "react";


const PricingCard = ({
  title,
  price,
  period,
  description,
  features = [],
  isPopular = false,
  isAnnual = false,
  delay = 0,
  onCtaClick,
  isSignedIn,   // ✅ ADD
  clerk,        // ✅ ADD
  navigate      // ✅ ADD
}) => (
    <div
      className={`${pricingCardStyles.card} ${
        isPopular ? pricingCardStyles.cardPopular : pricingCardStyles.cardRegular
      }`}
      style={{ transitionDelay: `${delay}ms` }}
      >
        {isPopular && (
            <div className={pricingCardStyles.popularBadge}>
                <div className={pricingCardStyles.popularBadgeContent}>
                    Most Popular
                </div>
            </div>
        )}

        {isPopular && <div className={pricingCardStyles.gradientOverlay}/>}
        <div className={pricingCardStyles.animatedBorder}></div>

        <div className={pricingCardStyles.content}>
            <div className={pricingCardStyles.header}>
                <h3
                    className={`${pricingCardStyles.title} ${
                        isPopular
                            ? pricingCardStyles.titlePopular
                            : pricingCardStyles.titleRegular
                    }`}
                    >{title}
                    </h3>
                    <p className={pricingCardStyles.description}>{description}</p>
            </div>

            <div className={pricingCardStyles.priceContainer}>
                <div className={pricingCardStyles.priceWrapper}>
                    <span
                        className={`${pricingCardStyles.price} ${
                            isPopular
                                ? pricingCardStyles.pricePopular
                                : pricingCardStyles.priceRegular
                        }`}
                        >
                         {price}   
                        </span>
                        {period && (
                            <span className={pricingCardStyles.period}>{period}</span>
                        )}
                </div>
                {isAnnual && (
                    <div className={pricingCardStyles.annualBadge}>Save 20% annually</div>
                )}
            </div>
             <ul className={pricingCardStyles.featuresList}>
        {features.map((feature, index) => (
          <li key={index} className={pricingCardStyles.featureItem}>
            <div
              className={`
                ${pricingCardStyles.featureIcon}
                ${
                  isPopular
                    ? pricingCardStyles.featureIconPopular
                    : pricingCardStyles.featureIconRegular
                }
              `}
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className={pricingCardStyles.featureText}>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA area: show different button/label depending on auth state */}
      <div style={{ marginTop: 12 }}>
        <button
              type="button"
                onClick={() => {
                  console.log("BUTTON CLICKED");
                  const planName = title?.toLowerCase();
                  //  PLAN FIRST
                  localStorage.setItem("selectedPlan", planName);
                  //  LOGIN FLOW
                  if (!isSignedIn) {
                    clerk.openSignIn({
                      redirectUrl: "/pricing",
                    });
                    return;
                  }
                  // ✅ DIRECTLY CALL PAYMENT
                  onCtaClick && onCtaClick({ title });
                }}
             
            className={`
              ${pricingCardStyles.ctaButton}
              ${
                isPopular
                  ? pricingCardStyles.ctaButtonPopular
                  : pricingCardStyles.ctaButtonRegular
              }
            `}
          >
            <span className={pricingCardStyles.ctaButtonText}>
              {isSignedIn
                ? (isPopular ? "Get Started" : "Choose Plan")
                : "Sign in to get started"}
            </span>
          </button>
        {/* <SignedIn>
          <button
            type="button"
            //temp check
            onClick={() => {
              console.log("BUTTON CLICKED - SIGNED IN"); // ✅ ADD HERE
              onCtaClick && onCtaClick({ title, isPopular, isAnnual });
            }}
            // onClick={() =>
            //   onCtaClick && onCtaClick({ title, isPopular, isAnnual })
            // }
            className={`
              ${pricingCardStyles.ctaButton}
              ${
                isPopular
                  ? pricingCardStyles.ctaButtonPopular
                  : pricingCardStyles.ctaButtonRegular
              }
            `}
          >
            <span
              className={`
                ${pricingCardStyles.ctaButtonText}
                ${
                  isPopular
                    ? pricingCardStyles.ctaButtonTextPopular
                    : pricingCardStyles.ctaButtonTextRegular
                }
              `}
            >
              {isPopular ? "Get Started" : "Choose Plan"}
            </span>
          </button>
        </SignedIn>

        <SignedOut>
          <button
            type="button"
            //temp check
            onClick={() => {
            console.log("BUTTON CLICKED - SIGNED OUT"); // ✅ ADD HERE
            onCtaClick &&
              onCtaClick(
                { title, isPopular, isAnnual },
                { openSignInFallback: true }
              );
          }}
            // onClick={() =>
            //   onCtaClick &&
            //   onCtaClick(
            //     { title, isPopular, isAnnual },
            //     { openSignInFallback: true }
            //   )
            // }
            className={`
              ${pricingCardStyles.ctaButton}
              ${pricingCardStyles.ctaButtonRegular}
            `}
          >
            <span className={pricingCardStyles.ctaButtonText}>
              Sign in to get started
            </span>
          </button>
        </SignedOut> */}
      </div>
        </div>

        {isPopular && (

        <>
        <div className={pricingCardStyles.cornerAccent1}></div>
        <div className={pricingCardStyles.cornerAccent2}></div>
        </>

            )}

      </div>
);

export default function Pricing() {
    const [billingPeriod,setBillingPeriod] = useState("monthly");
    const [checkingPlan, setCheckingPlan] = useState(true);
    const clerk = useClerk();
    const {isSignedIn,userId} = useAuth();
    const { isLoaded } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    //payment system
    const handleBuy = async (planName) => {
  const cleanPlan = planName.toLowerCase();

  try {
    const isDiscounted = billingPeriod === "annual";

    localStorage.setItem("selectedPlan", cleanPlan);

    const res = await fetch(
      "http://localhost:5000/api/payment/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: cleanPlan,
          isDiscounted,
        }),
      }
    );

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }

  } catch (err) {
    console.log(err);
  }
};
// const handleBuy = async (planName) => {
//   const cleanPlan = planName.toLowerCase();

//   if (cleanPlan === "starter") {
//     navigate("/app");
//     return;
//   }

//   try {
//     const isDiscounted = billingPeriod === "annual";

//     // 🔥 ADD THIS
//     localStorage.setItem("selectedPlan", cleanPlan);

//     const res = await fetch("http://localhost:5000/api/payment/create-checkout-session", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         plan: cleanPlan,
//         isDiscounted,
//       }),
//     });

//     const data = await res.json();

//     if (data.url) {
//       window.location.href = data.url;
//     }

//   } catch (err) {
//     console.log(err);
//   }
// };
//     const handleBuy = async (planName) => {
//   //  FREE PLAN LOGIC
//   if (planName === "starter") {
//     alert("You are already on Starter (Free) plan.\nLimit: 5 invoices only.");
//     return;
//   }

//   try {
//     const res = await axios.post(
//       "http://localhost:5000/api/payment/create-checkout-session",
//       { plan: planName }
//     );

//     window.location.href = res.data.url;

//   } catch (err) {
//     console.log("Payment error:", err);
//   }
// };
// const handleBuy = async (planName) => {
//   try {
    
//     console.log("Sending plan:", planName);
//     console.log("User ID:", userId);
//     const res = await fetch("http://localhost:5000/api/payment/create-checkout-session", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         plan: planName,
//         userId,
//       }),
//     });

//     const data = await res.json();

//     window.location.href = data.url;

//   } catch (err) {
//     console.log("Payment error:", err);
//   }
// };

useEffect(() => {
  const checkPlan = async () => {
    if (!isLoaded) return;

    if (!isSignedIn || !userId) {
      setCheckingPlan(false);
      return;
    }

    try {
      const forcedUpgrade = location.state?.forceShow === true;
      if (forcedUpgrade) {
        setCheckingPlan(false);
        return;
      }

      const res = await fetch(`http://localhost:5000/api/payment/user-plan/${userId}`);
      const data = await res.json();

      if (data.plan === "starter" || data.plan === "professional" || data.plan === "enterprise") {
        navigate("/app", { replace: true });
        return;
      }

      setCheckingPlan(false);

    } catch (err) {
      console.log(err);
      setCheckingPlan(false);
    }
  };

  checkPlan();
}, [isSignedIn, isLoaded, userId]);
// useEffect(() => {
//   const checkPlan = async () => {

//     // ⛔ wait until auth is ready
//     if (!isLoaded) return;

//     // ❌ not logged in → show pricing
//     if (!isSignedIn || !userId) {
//       setCheckingPlan(false);
//       return;
//     }
//     // ✅ REPLACE WITH
// try {
//   // If user was sent here intentionally to upgrade, skip auto-redirect
//   const forcedUpgrade = location.state?.forceShow === true;
//   if (forcedUpgrade) {
//     setCheckingPlan(false);
//     return;
//   }

//   const res = await fetch(
//     `http://localhost:5000/api/payment/user-plan/${userId}`
//   );
//   const data = await res.json();

//   if (
//     data.plan === "starter" ||
//     data.plan === "professional" ||
//     data.plan === "enterprise"
//   ) {
//     navigate("/app", { replace: true });
//     return;
//   }

//   setCheckingPlan(false);
//     // try {
//     //   const res = await fetch(
//     //     `http://localhost:5000/api/payment/user-plan/${userId}`
//     //   );
//     //   const data = await res.json();

//     //   // ✅ existing user → go dashboard
//     //   // ✅ ONLY redirect PAID users
//     //   if (
//     //     data.plan === "starter" ||
//     //     data.plan === "professional" ||
//     //     data.plan === "enterprise"
//     //   ) {
//     //     navigate("/app", { replace: true });
//     //     return;
//     //   }
//     //   // if (data.plan === "professional" || data.plan === "enterprise") {
//     //   //   navigate("/app", { replace: true });
//     //   //   return;
//     //   // }
//     //   // if (data.plan) {
//     //   //   navigate("/app", { replace: true });
//     //   //   return; // 🔥 stop execution completely
//     //   // }

//     //   // ❌ new user → show pricing
//     //   setCheckingPlan(false);

//     } catch (err) {
//       console.log(err);
//       setCheckingPlan(false);
//     }
//   };

//   checkPlan();
// }, [isSignedIn, isLoaded, userId]);
// useEffect(() => {
//   const checkPlan = async () => {
//     if (isLoaded && isSignedIn && userId) {
//       try {
//         const res = await fetch(
//           `http://localhost:5000/api/payment/user-plan/${userId}`
//         );
//         const data = await res.json();

//         if (
//           data.plan === "starter" ||
//           data.plan === "professional" ||
//           data.plan === "enterprise"
//         ) {
//           navigate("/app", { replace: true }); // ✅ replace: true prevents back-button loop
//           return; // ✅ Don't call setCheckingPlan(false) — no need to render pricing
//         }
//       } catch (err) {
//         console.log(err);
//       } finally {
//         setCheckingPlan(false); // ✅ Only reached if no redirect
//       }
//     } else if (isLoaded) {
//       setCheckingPlan(false); // ✅ Not signed in, show pricing normally
//     }
//   };

//   checkPlan();
// }, [isSignedIn, isLoaded, userId]);
// useEffect(() => {
//   const checkPlan = async () => {
//     if (isLoaded && isSignedIn && userId) {
//       try {
//         const res = await fetch(
//           `http://localhost:5000/api/payment/user-plan/${userId}`
//         );
//         const data = await res.json();

//         console.log("PLAN:", data.plan);

//         // 🟢 EXISTING USER → dashboard
//         if (data.plan === "starter" || 
//             data.plan === "professional" || 
//             data.plan === "enterprise") {
//           navigate("/app");
//         }

//         // 🔴 NEW USER → stay on pricing (plan = null)

//       } catch (err) {
//         console.log(err);
//       } finally {
//         setCheckingPlan(false);
//       }
//     } else {
//       setCheckingPlan(false);
//     }
//   };

//   checkPlan();
// }, [isSignedIn, isLoaded, userId]);
// useEffect(() => {
//   const savedPlan = localStorage.getItem("selectedPlan");

//   console.log("Checking saved plan:", savedPlan);

//   if (isLoaded && isSignedIn && savedPlan) {

//     // 🔥 HANDLE STARTER AFTER LOGIN
//     if (savedPlan === "starter") {
//       //localStorage.removeItem("selectedPlan");
//       navigate("/app"); // ✅ go to dashboard
//       return;
//     }

//     console.log("Resuming payment for:", savedPlan);

//     handleBuy(savedPlan);
//     localStorage.removeItem("selectedPlan");
//   }
// }, [isSignedIn, isLoaded]);
// useEffect(() => {
//   const savedPlan = localStorage.getItem("selectedPlan");

//   console.log("Checking saved plan:", savedPlan); // ✅ ADD

//   if (isSignedIn && savedPlan) {
//     console.log("Resuming payment for:", savedPlan);

//     handleBuy(savedPlan);

//     localStorage.removeItem("selectedPlan");
//   }
// }, [isSignedIn, isLoaded]);

     const plans = {
    monthly: [
      {
        title: "Starter",
        price: "₹0",
        period: "month",
        description: "Perfect for freelancers and small projects",
        features: [
          "5 invoices per month",
          "Basic AI parsing",
          "Standard templates",
          "Email support",
          "PDF export",
        ],
        isPopular: false,
      },
      {
        title: "Professional",
        price: "₹499",
        period: "month",
        description: "For growing businesses and agencies",
        features: [
          "Unlimited invoices",
          "Advanced AI parsing",
          "Custom branding",
          "Priority support",
          "Advanced analytics",
          "Team collaboration (3 members)",
          "API access",
        ],
        isPopular: true,
      },
      {
        title: "Enterprise",
        price: "₹1,499",
        period: "month",
        description: "For large organizations with custom needs",
        features: [
          "Everything in Professional",
          "Unlimited team members",
          "Custom workflows",
          "Dedicated account manager",
          "SLA guarantee",
          "White-label solutions",
          "Advanced security",
        ],
        isPopular: false,
      },
    ],
    annual: [
      {
        title: "Starter",
        price: "₹0",
        period: "month",
        description: "Perfect for freelancers and small projects",
        features: [
          "5 invoices per month",
          "Basic AI parsing",
          "Standard templates",
          "Email support",
          "PDF export",
        ],
        isPopular: false,
        isAnnual: false,
      },
      {
        title: "Professional",
        price: "₹399",
        period: "month",
        description: "For growing businesses and agencies",
        features: [
          "Unlimited invoices",
          "Advanced AI parsing",
          "Custom branding",
          "Priority support",
          "Advanced analytics",
          "Team collaboration (3 members)",
          "API access",
        ],
        isPopular: true,
        isAnnual: true,
      },
      {
        title: "Enterprise",
        price: "₹1,199",
        period: "month",
        description: "For large organizations with custom needs",
        features: [
          "Everything in Professional",
          "Unlimited team members",
          "Custom workflows",
          "Dedicated account manager",
          "SLA guarantee",
          "White-label solutions",
          "Advanced security",
        ],
        isPopular: false,
        isAnnual: true,
      },
    ],
  };

  const currentPlans = plans[billingPeriod];

  //Payment System
const handleCtaClick = async (planMeta) => {
  const planName = planMeta?.title?.toLowerCase();

  console.log("PLAN NAME:", planName);

  if (!planName) return;

  // ✅ FIXED STARTER FLOW
  if (planName === "starter") {
    try {
      await fetch("http://localhost:5000/api/payment/upgrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          plan: "starter",
        }),
      });

      alert("You are on Starter plan (5 invoices limit)");

      navigate("/app");
    } catch (err) {
      console.log("Starter upgrade error:", err);
    }

    return;
  }

  // ✅ Paid plans
  handleBuy(planName);
};
// function handleCtaClick(planMeta) {

//   const planName = planMeta?.title?.toLowerCase();

//   console.log("PLAN RECEIVED:", planMeta);
//   console.log("PLAN NAME:", planName);

//   // SAFETY CHECK
//   if (!planName) {
//     console.log("ERROR: planName is undefined ❌");
//     return;
//   }

//   // FREE PLAN FIX (MAIN LOGIC)
//   if (planName === "starter") {
//     alert("You are on Starter (Free) plan.\nLimit: 5 invoices only.");
//     return;
//   }

//   // SAVE ONLY FOR PAID PLANS
//   localStorage.setItem("selectedPlan", planName);

//   // AUTH CHECK
//   if (!isSignedIn) {
//     clerk.openSignIn({ redirectUrl: "/pricing" });
//     return;
//   }

//   // PAYMENT
//   handleBuy(planName);
// }
  // function handleCtaClick (planMeta, flags = {}){
  //   if(flags.openSignInFallback || !isSignedIn){
  //       if(clerk && typeof clerk.openSignIn === "function"){
  //           clerk.openSignIn({redirectUrl:"/app/create-invoice"})
  //       }
  //       else{
  //           navigate("/sign-in");
  //       }
  //       return;
  //   }
  //   navigate("/app/create-invoice",{
  //       state: {fromPlan: planMeta?.title || null},
  //   })
  // }

    //temporary
    if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (checkingPlan) {
  return <div>Loading...</div>;
}

  return (
    <section id="pricing" className={pricingStyles.section}>
        <div className={pricingStyles.bgElement1}></div>
        <div className={pricingStyles.bgElement2}></div>
        <div className={pricingStyles.bgElement3}></div>

        <div className={pricingStyles.container}>
            <div className={pricingStyles.headerContainer}>
                <div className={pricingStyles.badge}>
                    <span className={pricingStyles.badgeDot}></span>
                    <span className={pricingStyles.badgeText}>Transparent Pricing</span>
                </div>

                <h2 className={pricingStyles.title}>
                    Simple,{" "}
                    <span className={pricingStyles.titleGradient}>Fair Pricing</span>
                </h2>

                <p className={pricingStyles.description}>
                    Start free, upgrade as you grow. no hidden fees, no surprise
                    charges.
                </p>

                <div style={{ marginTop: 12 }} className={pricingStyles.billingToggle}>
                    <button onClick={() => setBillingPeriod("monthly")}
                      className={`${pricingStyles.billingButton} ${
                        billingPeriod === "monthly"
                          ? pricingStyles.billingButtonActive
                          : pricingStyles.billingButtonInactive
                      }`}
                      >
                        Monthly
                      </button>

                      <button onClick={() => setBillingPeriod("annual")}
                      className={`${pricingStyles.billingButton} ${
                        billingPeriod === "annual"
                          ? pricingStyles.billingButtonActive
                          : pricingStyles.billingButtonInactive
                      }`}
                      >
                        Annual 
                        <span className={pricingStyles.billingBadge}>Save 20%</span>
                      </button>
                </div>
            </div>

            <div className={pricingStyles.grid}>
                      {currentPlans.map((plan,index) => (
                      <PricingCard
                        key={plan.title}
                        {...plan}
                        delay={index * 100}
                        onCtaClick={() => handleCtaClick(plan)} // ✅ FIX
                        isSignedIn={isSignedIn}
                        clerk={clerk}
                        navigate={navigate}      // ✅ ALSO ADD
                        />
                      ))}
            </div>

            <div className={pricingStyles.additionalInfo}>
                <div className={pricingStyles.featuresCard}>
                    <h3 className={pricingStyles.featuresTitle}>All plans include</h3>
                    <div className={pricingStyles.featuresGrid}>
                        {[
                            "Secure cloud storage",
                            "Mobile-friendly interface",
                            "Automatic backups",
                            "Real-time notifications",
                            "Multi-currency support",
                            "Tax calculation",
                        ].map((feature, index) => (
                            <div key={index} className={pricingStyles.featureItem}>
                                <div className={pricingStyles.featureDot}></div>
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={pricingStyles.faqCta}>
                <p className={pricingStyles.faqText}>
                    Have questions about pricing?{" "}
                    <button className={pricingStyles.contactLink}>
                        Contact our sales team →
                    </button>
                </p>
            </div>
        </div>
    </section>
  )
}


// import React, { useState } from 'react';
// import { pricingStyles, pricingCardStyles } from '../assets/dummyStyles';
// import { useClerk, useAuth } from '@clerk/clerk-react';
// import { useNavigate } from 'react-router-dom';
// import { SignedIn, SignedOut } from '@clerk/clerk-react';

// const PricingCard = ({
//   title,
//   price,
//   period,
//   description,
//   features = [],
//   isPopular = false,
//   isAnnual = false,
//   delay = 0,
//   onCtaClick,
// }) => (
//   <div
//     className={`${pricingCardStyles.card} ${
//       isPopular ? pricingCardStyles.cardPopular : pricingCardStyles.cardRegular
//     }`}
//     style={{ transitionDelay: `${delay}ms` }}
//   >
//     {isPopular && (
//       <div className={pricingCardStyles.popularBadge}>
//         <div className={pricingCardStyles.popularBadgeContent}>
//           Most Popular
//         </div>
//       </div>
//     )}

//     {isPopular && <div className={pricingCardStyles.gradientOverlay} />}
//     <div className={pricingCardStyles.animatedBorder}></div>

//     <div className={pricingCardStyles.content}>
//       <div className={pricingCardStyles.header}>
//         <h3
//           className={`${pricingCardStyles.title} ${
//             isPopular
//               ? pricingCardStyles.titlePopular
//               : pricingCardStyles.titleRegular
//           }`}
//         >
//           {title}
//         </h3>
//         <p className={pricingCardStyles.description}>{description}</p>
//       </div>

//       <div className={pricingCardStyles.priceContainer}>
//         <div className={pricingCardStyles.priceWrapper}>
//           <span
//             className={`${pricingCardStyles.price} ${
//               isPopular
//                 ? pricingCardStyles.pricePopular
//                 : pricingCardStyles.priceRegular
//             }`}
//           >
//             {price}
//           </span>
//           {period && (
//             <span className={pricingCardStyles.period}>{period}</span>
//           )}
//         </div>
//         {isAnnual && (
//           <div className={pricingCardStyles.annualBadge}>
//             Save 20% annually
//           </div>
//         )}
//       </div>

//       <ul className={pricingCardStyles.featuresList}>
//         {features.map((feature, index) => (
//           <li key={index} className={pricingCardStyles.featureItem}>
//             <div
//               className={`
//                 ${pricingCardStyles.featureIcon}
//                 ${
//                   isPopular
//                     ? pricingCardStyles.featureIconPopular
//                     : pricingCardStyles.featureIconRegular
//                 }
//               `}
//             >
//               <svg
//                 className="w-3 h-3"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={3}
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//             </div>
//             <span className={pricingCardStyles.featureText}>
//               {feature}
//             </span>
//           </li>
//         ))}
//       </ul>

//       <div style={{ marginTop: 12 }}>
//         <SignedIn>
//           <button
//             type="button"
//             onClick={() =>
//               onCtaClick && onCtaClick({ title, isPopular, isAnnual })
//             }
//             className={`
//               ${pricingCardStyles.ctaButton}
//               ${
//                 isPopular
//                   ? pricingCardStyles.ctaButtonPopular
//                   : pricingCardStyles.ctaButtonRegular
//               }
//             `}
//           >
//             <span
//               className={`
//                 ${pricingCardStyles.ctaButtonText}
//                 ${
//                   isPopular
//                     ? pricingCardStyles.ctaButtonTextPopular
//                     : pricingCardStyles.ctaButtonTextRegular
//                 }
//               `}
//             >
//               {isPopular ? "Get Started" : "Choose Plan"}
//             </span>
//           </button>
//         </SignedIn>

//         <SignedOut>
//           <button
//             type="button"
//             onClick={() =>
//               onCtaClick &&
//               onCtaClick(
//                 { title, isPopular, isAnnual },
//                 { openSignInFallback: true }
//               )
//             }
//             className={`
//               ${pricingCardStyles.ctaButton}
//               ${pricingCardStyles.ctaButtonRegular}
//             `}
//           >
//             <span className={pricingCardStyles.ctaButtonText}>
//               Sign in to get started
//             </span>
//           </button>
//         </SignedOut>
//       </div>
//     </div>

//     {isPopular && (
//       <>
//         <div className={pricingCardStyles.cornerAccent1}></div>
//         <div className={pricingCardStyles.cornerAccent2}></div>
//       </>
//     )}
//   </div>
// );

// export default function Pricing() {
//   const [billingPeriod, setBillingPeriod] = useState("monthly");
//   const clerk = useClerk();

//   // ✅ FIX: added userId
//   const { isSignedIn, userId } = useAuth();

//   const navigate = useNavigate();

//   //payment system
//   const handleBuy = async (planName) => {
//     try {
//       const res = await fetch("http://localhost:5000/api/payment/create-checkout-session", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           plan: planName,
//           userId, // ✅ FIX
//         }),
//       });

//       const data = await res.json();

//       window.location.href = data.url;

//     } catch (err) {
//       console.log("Payment error:", err);
//     }
//   };

// const plans = {
//   monthly: [
//     {
//       title: "Starter",
//       price: "₹0",
//       period: "month",
//       description: "Perfect for freelancers and small projects",
//       features: [
//         "5 invoices per month",
//         "Basic AI parsing",
//         "Standard templates",
//         "Email support",
//         "PDF export",
//       ],
//       isPopular: false,
//     },
//     {
//       title: "Professional",
//       price: "₹499",
//       period: "month",
//       description: "For growing businesses and agencies",
//       features: [
//         "Unlimited invoices",
//         "Advanced AI parsing",
//         "Custom branding",
//         "Priority support",
//         "Advanced analytics",
//         "Team collaboration (3 members)",
//         "API access",
//       ],
//       isPopular: true,
//     },
//     {
//       title: "Enterprise",
//       price: "₹1,499",
//       period: "month",
//       description: "For large organizations with custom needs",
//       features: [
//         "Everything in Professional",
//         "Unlimited team members",
//         "Custom workflows",
//         "Dedicated account manager",
//         "SLA guarantee",
//         "White-label solutions",
//         "Advanced security",
//       ],
//       isPopular: false,
//     },
//   ],

//   annual: [
//     {
//       title: "Starter",
//       price: "₹0",
//       period: "month",
//       description: "Perfect for freelancers and small projects",
//       features: [
//         "5 invoices per month",
//         "Basic AI parsing",
//         "Standard templates",
//         "Email support",
//         "PDF export",
//       ],
//       isPopular: false,
//     },
//     {
//       title: "Professional",
//       price: "₹399",
//       period: "month",
//       description: "For growing businesses and agencies",
//       features: [
//         "Unlimited invoices",
//         "Advanced AI parsing",
//         "Custom branding",
//         "Priority support",
//         "Advanced analytics",
//         "Team collaboration (3 members)",
//         "API access",
//       ],
//       isPopular: true,
//       isAnnual: true,
//     },
//     {
//       title: "Enterprise",
//       price: "₹1,199",
//       period: "month",
//       description: "For large organizations with custom needs",
//       features: [
//         "Everything in Professional",
//         "Unlimited team members",
//         "Custom workflows",
//         "Dedicated account manager",
//         "SLA guarantee",
//         "White-label solutions",
//         "Advanced security",
//       ],
//       isPopular: false,
//       isAnnual: true,
//     },
//   ],
// };

//   const currentPlans = plans[billingPeriod];

//   function handleCtaClick(planMeta, flags = {}) {

//     if (flags.openSignInFallback || !isSignedIn) {
//       if (clerk && typeof clerk.openSignIn === "function") {

//         // ✅ FIX: changed redirect
//         clerk.openSignIn({ redirectUrl: "/pricing" });

//       } else {
//         navigate("/sign-in");
//       }
//       return;
//     }

//     const planName = planMeta?.title?.toLowerCase();

//     console.log("Clicked:", planName);

//     if (planName === "starter") {
//       navigate("/app/create-invoice", {
//         state: { fromPlan: "starter" },
//       });
//       return;
//     }

//     handleBuy(planName);
//   }

//   return (
//     <section id="pricing" className={pricingStyles.section}>
//       <div className={pricingStyles.container}>
//         <div className={pricingStyles.grid}>
//           {currentPlans.map((plan, index) => (
//             <PricingCard
//               key={plan.title}
//               {...plan}
//               delay={index * 100}
//               onCtaClick={handleCtaClick}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
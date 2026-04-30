import { useState, useRef, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useAuth,
  useClerk,
  useUser,
  SignedOut,
} from "@clerk/clerk-react";

import { navbarStyles } from "../assets/dummyStyles";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();
  const clerk = useClerk();

  const navigate = useNavigate();
  //upgrading logout fuction
const handleLogout = async () => {
  try {
    await clerk.signOut();
    localStorage.removeItem(TOKEN_KEY);
    navigate("/", { replace: true }); // ✅ important
  } catch (e) {
    console.error(e);
  }
  };


  const profileRef = useRef(null);
  const TOKEN_KEY = "token";

  //for token generation(meaning fetch and store also refresh for it not found)
  const fetchAndStoreToken = useCallback(async() =>{
  try {
    if(!getToken){
      return null;
    }
    const token = await getToken().catch(() => null);
    if(token){
      try{
        localStorage.setItem(TOKEN_KEY,token);
        console.log(token);
      } catch(e){
        //ignore any errors
      }
      return token;
    }
    else{
      return null;
    }
  } catch (err) {
        return null;
  }
},[getToken]);

//keep the localstorage token in async with clerk auth state
useEffect(() =>{
    let mounted = true;

    (async() => {
      if(isSignedIn){
        const t = await fetchAndStoreToken().catch(
        //const t = await fetchAndStoreToken({template:"default"}).catch( for logout routing 
            ()=> null
        );
        if(!t && mounted){
          await fetchAndStoreToken({forceRefresh:true}).catch(() => null);
        }
      }
      else{
        try{
          localStorage.removeItem(TOKEN_KEY);
        }catch{}
      }
    })();
return () => {
  mounted = false;
}
},[isSignedIn,user,fetchAndStoreToken])

//after successfully login redirect us to dashboard
useEffect(() => {
  if (isSignedIn) {
    const pathname = window.location.pathname || "/";
    const fromStripe = localStorage.getItem("fromStripeCheckout");

    if (
      (pathname === "/login" ||
        pathname === "/signup" ||
        pathname.startsWith("/auth")) &&
      !fromStripe
    ) {
      navigate("/app/dashboard", { replace: true });
    }
  }
}, [isSignedIn]);
// useEffect(() => {
//   if (isSignedIn) {
//     const pathname = window.location.pathname || "/";
//     const params = new URLSearchParams(window.location.search);
//     const fromStripe = params.get("from");

//     if (
//       (pathname === "/login" ||
//         pathname === "/signup" ||
//         pathname.startsWith("/auth")) &&
//       fromStripe !== "stripe"
//     ) {
//       navigate("/app/dashboard", { replace: true });
//     }
//   }
// }, [isSignedIn]);
// useEffect(() => {
//     if(isSignedIn){
//         const pathname = window.location.pathname || "/";
//         if(
//           pathname === "/login" ||
//           pathname === "/signup" ||
//           pathname.startsWith("/auth") ||
//           pathname === "/"
//         ){
//           navigate("/app/dashboard",{replace:true});
//           //navigate("/app?dashboard",{replace:true});
//         }
//     }
// });
// Close profile popover on outside click
useEffect(() => {
  function onDocClick(e) {
    if (!profileRef.current) return;
    if (!profileRef.current.contains(e.target)) {
      setProfileOpen(false);
    }
  }
  if (profileOpen) {
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("touchstart", onDocClick);
  }
  return () => {
    document.removeEventListener("mousedown", onDocClick);
    document.removeEventListener("touchstart", onDocClick);
  };
}, [profileOpen]);
  // open sign-in modal
  function openSignIn() {
    try {
      if (clerk && typeof clerk.openSignIn === "function") {
        clerk.openSignIn();
      } else {
        navigate("/login");
      }
    } catch (e) {
      console.error("openSignIn failed:", e);
      navigate("/login");
    }
  }

  // open signup modal
  function openSignUp() {
    try {
      if (clerk && typeof clerk.openSignUp === "function") {
        clerk.openSignUp();
      } else {
        navigate("/signup");
      }
    } catch (e) {
      console.error("openSignUp failed:", e);
      navigate("/signup");
    }
  }

  return (
    <header className={navbarStyles.header}>
      <div className={navbarStyles.container}>
        <nav className={navbarStyles.nav}>
          <div className={navbarStyles.logoSection}>
            <Link to='/' className={navbarStyles.logoLink}>
              <img
                src={logo}
                alt="logo"
                className={navbarStyles.logoImage}
              />
              <span className={navbarStyles.logoText}>InvoiceAI</span>
            </Link>

            <div className={navbarStyles.desktopNav}>
              <a href="#features" className={navbarStyles.navLink}>
                Features
              </a>
              <a href="#pricing" className={navbarStyles.navLinkInactive}>
                Pricing
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={navbarStyles.authSection}>
              <SignedOut>
                <button
                  onClick={openSignIn}
                  className={navbarStyles.signInButton}
                  type="button"
                >
                  Sign In
                </button>

                <button
                  onClick={openSignUp}
                  className={navbarStyles.signUpButton}
                  type="button"
                >
                <div className={navbarStyles.signUpOverlay}></div>
                <span className={navbarStyles.signUpText}>Get Started</span>
                <svg
                className={navbarStyles.signUpIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                >
                <path d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
                </button>
              </SignedOut>
            </div>
            {/*mobile toggle */}
            <button onClick={() => setOpen(!open)} className={navbarStyles.mobileMenuButton}>
                <div className={navbarStyles.mobileMenuIcon}>
                    <span
                        className={`${navbarStyles.mobileMenuLine1}${
                            open
                            ? navbarStyles.mobileMenuLine1Open
                            : navbarStyles.mobileMenuLine1Closed
                        }`}
                        ></span>

                            <span
                        className={`${navbarStyles.mobileMenuLine2}${
                            open
                            ? navbarStyles.mobileMenuLine2Open
                            : navbarStyles.mobileMenuLine2Closed
                        }`}
                        ></span>

                            <span
                        className={`${navbarStyles.mobileMenuLine3}${
                            open
                            ? navbarStyles.mobileMenuLine3Open
                            : navbarStyles.mobileMenuLine3Closed
                        }`}
                        ></span>
                </div>
            </button>
          </div>
        </nav>
      </div>
<div className={`${open ? "block" : "hidden"} ${navbarStyles.mobileMenu}`}>
        <div className={navbarStyles.mobileMenuContainer}>
          <a href="#features" className={navbarStyles.mobileNavLink}>
            Features
          </a>
          <a href="#Pricing" className={navbarStyles.mobileNavLink}>
            Pricing
          </a>
          <div className={navbarStyles.mobileAuthSection}>
            <SignedOut>
              <button onClick={openSignIn} className={navbarStyles.mobileSignIn}>
                Sign in
              </button>

               <button onClick={openSignUp} className={navbarStyles.mobileSignUp}>
                Get Started
              </button>
            </SignedOut>
            //upgrading logout route
            {isSignedIn && (
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Logout
              </button>
            )}


          </div>
        </div>
      </div>
    </header>
  );
}

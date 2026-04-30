import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        signInFallbackRedirectUrl="/pricing"
        signUpFallbackRedirectUrl="/pricing"
      >
        <App />
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
)
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { ClerkProvider } from '@clerk/clerk-react'
// import {BrowserRouter} from 'react-router-dom';


// // Import your Publishable Key
//   const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

//   if (!PUBLISHABLE_KEY) {
//     throw new Error('Add your Clerk Publishable Key to the .env file')
//   }

//   <BrowserRouter>
//   <ClerkProvider
//     publishableKey={PUBLISHABLE_KEY}
//     signInFallbackRedirectUrl="/pricing"
//     signUpFallbackRedirectUrl="/pricing"
//   >
//     <App />
//   </ClerkProvider>
// </BrowserRouter>
// {/* <ClerkProvider
//   publishableKey={PUBLISHABLE_KEY}
//   signInFallbackRedirectUrl="/pricing"
//   signUpFallbackRedirectUrl="/pricing"
// >
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>
// </ClerkProvider> */}
// // createRoot(document.getElementById('root')).render(
// //   <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
// //     <BrowserRouter>
// //      <App />
// //     </BrowserRouter>
// //   </ClerkProvider>,
// // )

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { auth } from "../firebase";

// // ✅ Import images from src/assets (Vite will bundle them correctly)
// import banner from "../assets/PLSP Banner New (1)-min.png";
// import logo from "../assets/logo.png";

// // ✅ Sign Out Icon component
// const SignOutIcon = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
//     <path
//       fill="currentColor"
//       d="M160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H128C57.3 32 0 89.3 0 160V416
//          c0 70.7 57.3 128 128 128h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H128
//          c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h32zm272 0c-17.7 0-32
//          14.3-32 32V224c0 17.7 14.3 32 32 32c17.7 0 32-14.3 32-32V128
//          c0-17.7-14.3-32-32-32zm48 16c0-8.8-7.2-16-16-16H304c-8.8 0-16 7.2-16
//          16v16c0 8.8 7.2 16 16 16h88.7L256.7 392.7c-6.2 6.2-6.2 16.4
//          0 22.6l22.6 22.6c6.2 6.2 16.4 6.2 22.6 0L496
//          226.6V400c0 8.8-7.2 16-16 16h-16c-8.8
//          0-16 7.2-16 16s7.2 16 16
//          16h32c8.8 0 16-7.2 16-16V128
//          c0-35.3-28.7-64-64-64H384
//          c-17.7 0-32 14.3-32 32z"
//     />
//   </svg>
// );

// export default function Home() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   // ✅ Firebase Auth listener
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       if (currentUser) setUser(currentUser);
//       else navigate("/login");
//     });
//     return () => unsubscribe();
//   }, [navigate]);

//   const handleLogout = async () => {
//     await signOut(auth);
//     navigate("/login");
//   };

//   if (!user) return null; // wait for Firebase to load

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-between bg-gray-50 text-gray-900 relative overflow-hidden">
//       {/* ✅ Background Banner */}
//       <div
//         className="absolute inset-0 flex justify-center items-center z-0"
//         style={{ backgroundColor: "rgba(255,255,255,0.85)" }}
//       >
//         <img
//           src={banner}
//           alt="Background"
//           className="w-full h-full object-contain opacity-40"
//         />
//       </div>

//       {/* ✅ Header Section */}
//       <header className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between p-6 z-10">
//         <div className="flex items-center gap-4 mb-6 sm:mb-0 ml-[-60px]">
//           <img
//             src={logo}
//             alt="Logo"
//             className="w-72 h-auto drop-shadow-[0_0_10px_rgba(0,132,61,0.4)]"
//           />
//           <div className="text-left">
//             <p className="text-xl text-gray-600 font-medium">Dashboard</p>
//             <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#00843D] to-[#00632d] bg-clip-text text-transparent">
//               Welcome, {user.email ? user.email.split("@")[0] : "User"}
//             </h1>
//           </div>
//         </div>

//         <div className="flex flex-col items-center sm:items-end">
//           <p className="text-sm text-gray-600 mb-2 z-10">
//             Logged in with Firebase
//           </p>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={handleLogout}
//             className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#00843D] to-[#00632d] text-white font-semibold shadow-md hover:shadow-[#00843D]/50 transition z-10"
//           >
//             <SignOutIcon className="w-5 h-5" /> Sign Out
//           </motion.button>
//         </div>
//       </header>

//       {/* ✅ Launch Chat Button */}
//       <div className="flex-grow flex items-center justify-center w-full z-10">
//         <motion.button
//           whileHover={{ scale: 1.03 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={() => navigate("/chat")}
//           className="px-20 py-2.5 rounded-full bg-gradient-to-r from-[#00843D] to-[#00632d] 
//                      text-white font-semibold text-lg shadow-md hover:shadow-[#00843D]/40 
//                      transition tracking-wide"
//         >
//           Launch Chat
//         </motion.button>
//       </div>

//       <div className="h-12"></div>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

// ✅ Import images
import banner from "../assets/PLSP Banner New (1)-min.png";
import logo from "../assets/logo.png";

// ✅ Sign Out Icon component
const SignOutIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path
      fill="currentColor"
      d="M160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H128C57.3 32 0 89.3 0 160V416
         c0 70.7 57.3 128 128 128h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H128
         c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h32zm272 0c-17.7 0-32
         14.3-32 32V224c0 17.7 14.3 32 32 32c17.7 0 32-14.3 32-32V128
         c0-17.7-14.3-32-32-32zm48 16c0-8.8-7.2-16-16-16H304c-8.8 0-16 7.2-16
         16v16c0 8.8 7.2 16 16 16h88.7L256.7 392.7c-6.2 6.2-6.2 16.4
         0 22.6l22.6 22.6c6.2 6.2 16.4 6.2 22.6 0L496
         226.6V400c0 8.8-7.2 16-16 16h-16c-8.8
         0-16 7.2-16 16s7.2 16 16
         16h32c8.8 0 16-7.2 16-16V128
         c0-35.3-28.7-64-64-64H384
         c-17.7 0-32 14.3-32 32z"
    />
  </svg>
);

export default function Home() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  // ✅ Check Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) navigate("/login");
    });
    return () => unsubscribe();
  }, [navigate]);

  // ✅ Load user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("authUser");
    navigate("/login");
  };

  if (!userData) return null; // wait for localStorage

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gray-50 text-gray-900 relative overflow-hidden">
      {/* Background Banner */}
      <div
        className="absolute inset-0 flex justify-center items-center z-0"
        style={{ backgroundColor: "rgba(255,255,255,0.85)" }}
      >
        <img
          src={banner}
          alt="Background"
          className="w-full h-full object-contain opacity-40"
        />
      </div>

      {/* Header Section */}
      <header className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between p-6 z-10">
        <div className="flex items-center gap-4 mb-6 sm:mb-0 ml-[-60px]">
          <img
            src={logo}
            alt="Logo"
            className="w-72 h-auto drop-shadow-[0_0_10px_rgba(0,132,61,0.4)]"
          />
          <div className="text-left">
            <p className="text-xl text-gray-600 font-medium">Dashboard</p>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#00843D] to-[#00632d] bg-clip-text text-transparent">
              Welcome, {userData.username || "User"}!
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-end">
          <p className="text-sm text-gray-600 mb-2 z-10">Logged in with Firebase</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#00843D] to-[#00632d] text-white font-semibold shadow-md hover:shadow-[#00843D]/50 transition z-10"
          >
            <SignOutIcon className="w-5 h-5" /> Sign Out
          </motion.button>
        </div>
      </header>

      {/* Launch Chat Button */}
      <div className="flex-grow flex items-center justify-center w-full z-10">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/chat")}
          className="px-20 py-2.5 rounded-full bg-gradient-to-r from-[#00843D] to-[#00632d] 
                     text-white font-semibold text-lg shadow-md hover:shadow-[#00843D]/40 
                     transition tracking-wide"
        >
          Launch Chat
        </motion.button>
      </div>

      <div className="h-12"></div>
    </div>
  );
}

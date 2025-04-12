import React from "react";
import { AuthProvider } from "../LoginAuthentication/AuthContext";
import { ProtectedRoute } from "../LoginAuthentication/ProtectedRoute";
import Profile from "../ui/Profile";


// const ProfilePage = () => {
//     return (
//         <div>
//             <Profile/>
//         </div>
//     );
// };

export default function ProfilePage(){
    return (
        <AuthProvider>
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
        </AuthProvider>
    )
        };

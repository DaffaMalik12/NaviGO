import React from "react";
import { useForm } from "@inertiajs/react";

const LogoutNavbar = ({ user }) => {
    const { post } = useForm();

    const handleLogout = (e) => {
        e.preventDefault();
        post("/logout");
    };

    return (
        <div className="fixed top-4 right-4 z-50  bg-opacity-0 shadow-md rounded-lg px-4 py-2 flex items-center gap-3">
            <span className="text-gray-700 font-medium">{user?.name}</span>
            <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-3 rounded-md text-sm transition duration-300"
            >
                Logout
            </button>
        </div>
    );
};

export default LogoutNavbar;

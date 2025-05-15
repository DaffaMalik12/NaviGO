import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        document.addEventListener("scroll", handleScroll);
        return () => {
            document.removeEventListener("scroll", handleScroll);
        };
    }, [scrolled]);

    return (
        <div
            className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
                scrolled ? "bg-white bg-opacity-80 shadow-md" : "bg-transparent"
            } rounded-lg px-4 py-2`}
        >
            <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 text-sm"
            >
                Login
            </Link>
        </div>
    );
};

export default Navbar;

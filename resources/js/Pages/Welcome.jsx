import CampusMap from "@/Components/CampusMap";
import CampusMapNavigation from "../Components/ CampusMapNavigation";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    // App.js - Add this function to your main App component
    return (
        <div className="relative h-screen w-full">
            <CampusMap auth={auth} />
        </div>
    );
}

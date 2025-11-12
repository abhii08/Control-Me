import { Link, useNavigate } from "react-router-dom"
import { Avatar } from "./Avatar"
import axios from "axios"
import { BACKEND_URL } from "../config"

export const Appbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(`${BACKEND_URL}/api/v1/auth/logout`, {}, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });
            
            localStorage.removeItem("token");
            
            navigate("/signin");
        } catch (error) {
            console.error("Logout failed:", error);
            localStorage.removeItem("token");
            navigate("/signin");
        }
    };

    return <div className="border-b flex justify-between px-10 py-4">
        <Link to={'/blogs'}  className="flex flex-col justify-center cursor-pointer">
            MEDIUM
        </Link>
        <div className="flex items-center">
            <Link to={`/publish`}>
                <button type="button" className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none
                 focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center
                  me-2 mb-2">+Add new Blog</button>
            </Link>
            
            <button 
                onClick={handleLogout}
                type="button" 
                className="mr-4 text-white bg-red-600 hover:bg-red-700 focus:outline-none
                 focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center
                  me-2 mb-2">
                Logout
            </button>
            
            <Avatar size={"big"} name="Abhinav" />
        </div>

    </div>
}
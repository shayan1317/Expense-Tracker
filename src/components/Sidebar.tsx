import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaMoneyBillAlt,
  FaWallet,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "@context/AuthProvider";

const Sidebar = () => {
  const { setUser, user } = useAuth() || {};
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const linkClass = (path: string) =>
    `flex items-center gap-2 px-4 py-2 rounded-md transition ${
      pathname.toLowerCase() === path.toLowerCase()
        ? "bg-purple-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;
  const handleLogout = () => {
    localStorage.clear();

    setUser && setUser(null);
    navigate("/login");
  };
  return (
    <div className="bg-gradient-to-b  h-screen flex flex-col items-center py-8 border-r border-gray-200">
      {/* User Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <img
            src={user?.image}
            alt="Alex William"
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-1 capitalize">
          {user?.name}
        </h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-3 w-full px-6">
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          <FaTachometerAlt className="text-lg" />
          <span>Dashboard</span>
        </Link>
        <Link to="/income" className={linkClass("/income")}>
          <FaMoneyBillAlt className="text-lg" />
          <span>Income</span>
        </Link>
        <Link to="/expenses" className={linkClass("/expenses")}>
          <FaWallet className="text-lg" />
          <span>Expenses</span>
        </Link>

        <Link to="/settings" className={linkClass("/settings")}>
          <FaWallet className="text-lg" />
          <span>Settings</span>
        </Link>
      </nav>

      {/* Spacer to push logout to bottom */}
      <div className="flex-1"></div>

      {/* Logout Button */}
      <div className="w-full px-6 pb-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-600 hover:text-red-600 hover:bg-red-50 w-full group border border-gray-200 hover:border-red-200"
        >
          <FaSignOutAlt className="text-lg group-hover:scale-110 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

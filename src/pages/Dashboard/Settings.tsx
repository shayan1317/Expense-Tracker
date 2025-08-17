import DashboardLayout from "@components/DashboardLayout";
import ProfilePhotoPicker from "@components/ProfilePhotoPicker";
import { useAuth } from "@context/AuthProvider";
import API from "@utils/axios";
import { saveUserToLocalStorage } from "@utils/LocalStorage";
import { useState } from "react";
import {
  FaUser,
  FaLock,
  FaBell,
  FaEye,
  FaTrash,
  FaSave,
  FaCamera,
  FaEnvelope,
  FaPhone,
  FaGlobe,
} from "react-icons/fa";
import { toast } from "react-toastify";

const Settings = () => {
  const { user, setUser } = useAuth() || {};
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: user?.name,
    email: user?.email,
    phone: "+1 234 567 8900",
    timezone: "America/New_York",
    currency: "USD",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
    pushNotifications: false,
    monthlyReports: true,
    budgetAlerts: true,
    image: user?.image,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    // Handle save logic here
    try {
      console.log("formdata", formData);
      const fileFormData = new FormData();
      fileFormData.append("file", formData.image);

      const imageUpload = await API.post("/upload", fileFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("imageUpload", imageUpload);
      const res = await API.patch("/user/update", {
        name: formData?.name,
        image: imageUpload?.data?.file?.path,
      });
      console.log("user", res.data);
      if (res?.data) {
        const { email, id, full_name, image } = res?.data;
        setUser &&
          setUser({ name: full_name, image: image, email: email, id: id });
        toast.success("updated susccessfuly");
        saveUserToLocalStorage({
          name: full_name,
          image: image,
          email: email,
          id: id,
        });

        // setUser &&
        //   setUser({ image: formData.image || "", name: formData.name || "" });
      }
    } catch (Err) {
      console.log(Err);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: FaUser },
    // { id: "security", label: "Security", icon: FaLock },
    // { id: "notifications", label: "Notifications", icon: FaBell },
    // { id: "preferences", label: "Preferences", icon: FaGlobe },
    // { id: "privacy", label: "Privacy", icon: FaEye },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Profile Information
                    </h3>

                    {/* Profile Picture */}
                    <div className="flex items-center space-x-6 mb-6">
                      {/* <div className="relative">
                        <img
                          src={user?.image}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                        />
                      </div> */}
                      <ProfilePhotoPicker
                        handleImageChange={(value) => {
                          setFormData((prev) => {
                            return {
                              ...prev,
                              image: value ? value : "",
                            };
                          });
                        }}
                        image={
                          typeof formData === "object" &&
                          formData?.image &&
                          formData?.image instanceof File
                            ? URL.createObjectURL(formData.image)
                            : typeof formData?.image === "string"
                            ? formData?.image
                            : ""
                        }
                      />
                      {/* <div>
                        <h4 className="font-medium text-gray-900">
                          Profile Picture
                        </h4>
                        <p className="text-sm text-gray-500">
                          JPG, GIF or PNG. Max size 2MB.
                        </p>
                        <button className="mt-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                          Change Photo
                        </button>
                      </div> */}
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSave("profile")}
                      className="mt-6 flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaSave className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

// {
//   /* Security Tab */
// }
// {
//   activeTab === "security" && (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-lg font-medium text-gray-900 mb-4">
//           Password & Security
//         </h3>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Current Password
//             </label>
//             <input
//               type="password"
//               name="currentPassword"
//               value={formData.currentPassword}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter current password"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               New Password
//             </label>
//             <input
//               type="password"
//               name="newPassword"
//               value={formData.newPassword}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter new password"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Confirm New Password
//             </label>
//             <input
//               type="password"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Confirm new password"
//             />
//           </div>
//         </div>

//         <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//           <h4 className="font-medium text-blue-900">Password Requirements:</h4>
//           <ul className="mt-2 text-sm text-blue-700 space-y-1">
//             <li>• At least 8 characters long</li>
//             <li>• Contains uppercase and lowercase letters</li>
//             <li>• Includes at least one number</li>
//             <li>• Contains at least one special character</li>
//           </ul>
//         </div>

//         <button
//           onClick={() => handleSave("security")}
//           className="mt-6 flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           <FaSave className="w-4 h-4" />
//           <span>Update Password</span>
//         </button>
//       </div>
//     </div>
//   );
// }

// {
//   /* Notifications Tab */
// }
// {
//   activeTab === "notifications" && (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-lg font-medium text-gray-900 mb-4">
//           Notification Preferences
//         </h3>

//         <div className="space-y-4">
//           <div className="flex items-center justify-between py-3">
//             <div>
//               <h4 className="font-medium text-gray-900">Email Notifications</h4>
//               <p className="text-sm text-gray-500">Receive updates via email</p>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="emailNotifications"
//                 checked={formData.emailNotifications}
//                 onChange={handleInputChange}
//                 className="sr-only peer"
//               />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//             </label>
//           </div>

//           <div className="flex items-center justify-between py-3">
//             <div>
//               <h4 className="font-medium text-gray-900">Push Notifications</h4>
//               <p className="text-sm text-gray-500">
//                 Receive push notifications on your device
//               </p>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="pushNotifications"
//                 checked={formData.pushNotifications}
//                 onChange={handleInputChange}
//                 className="sr-only peer"
//               />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//             </label>
//           </div>

//           <div className="flex items-center justify-between py-3">
//             <div>
//               <h4 className="font-medium text-gray-900">Monthly Reports</h4>
//               <p className="text-sm text-gray-500">
//                 Get monthly financial summaries
//               </p>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="monthlyReports"
//                 checked={formData.monthlyReports}
//                 onChange={handleInputChange}
//                 className="sr-only peer"
//               />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//             </label>
//           </div>

//           <div className="flex items-center justify-between py-3">
//             <div>
//               <h4 className="font-medium text-gray-900">Budget Alerts</h4>
//               <p className="text-sm text-gray-500">
//                 Get notified when you exceed budget limits
//               </p>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="budgetAlerts"
//                 checked={formData.budgetAlerts}
//                 onChange={handleInputChange}
//                 className="sr-only peer"
//               />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//             </label>
//           </div>
//         </div>

//         <button
//           onClick={() => handleSave("notifications")}
//           className="mt-6 flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           <FaSave className="w-4 h-4" />
//           <span>Save Preferences</span>
//         </button>
//       </div>
//     </div>
//   );
// }

// {
//   /* Preferences Tab */
// }
// {
//   activeTab === "preferences" && (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-lg font-medium text-gray-900 mb-4">
//           App Preferences
//         </h3>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Default Currency
//             </label>
//             <select
//               name="currency"
//               value={formData.currency}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="USD">US Dollar ($)</option>
//               <option value="EUR">Euro (€)</option>
//               <option value="GBP">British Pound (£)</option>
//               <option value="PKR">Pakistani Rupee (₨)</option>
//               <option value="INR">Indian Rupee (₹)</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Date Format
//             </label>
//             <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
//               <option value="MM/DD/YYYY">MM/DD/YYYY</option>
//               <option value="DD/MM/YYYY">DD/MM/YYYY</option>
//               <option value="YYYY-MM-DD">YYYY-MM-DD</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Theme
//             </label>
//             <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
//               <option value="light">Light</option>
//               <option value="dark">Dark</option>
//               <option value="auto">Auto (System)</option>
//             </select>
//           </div>
//         </div>

//         <button
//           onClick={() => handleSave("preferences")}
//           className="mt-6 flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           <FaSave className="w-4 h-4" />
//           <span>Save Preferences</span>
//         </button>
//       </div>
//     </div>
//   );
// }

// {
//   /* Privacy Tab */
// }
// {
//   activeTab === "privacy" && (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-lg font-medium text-gray-900 mb-4">
//           Privacy & Data
//         </h3>

//         <div className="space-y-6">
//           <div className="p-4 border border-gray-200 rounded-lg">
//             <h4 className="font-medium text-gray-900 mb-2">Export Data</h4>
//             <p className="text-sm text-gray-600 mb-3">
//               Download a copy of all your financial data
//             </p>
//             <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
//               Download Data
//             </button>
//           </div>

//           <div className="p-4 border border-gray-200 rounded-lg">
//             <h4 className="font-medium text-gray-900 mb-2">
//               Clear Activity History
//             </h4>
//             <p className="text-sm text-gray-600 mb-3">
//               Remove all transaction history and activity logs
//             </p>
//             <button className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100">
//               Clear History
//             </button>
//           </div>

//           <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
//             <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
//             <p className="text-sm text-red-600 mb-3">
//               Permanently delete your account and all associated data. This
//               action cannot be undone.
//             </p>
//             <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
//               <FaTrash className="w-3 h-3" />
//               <span>Delete Account</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  type: "email" | "password" | "text";
  value: string;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
  className?: string;
};

export const Input = ({
  type,
  handleChange,
  value,
  placeholder,
  className = "",
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  // For password inputs, override the type based on visibility state
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`bg-slate-100 px-3 py-4 text-black relative ${className}`}>
      <input
      type={inputType}
        className="w-full bg-transparent outline-none pr-8"
        onChange={handleChange}
        value={value}
        placeholder={placeholder}
        autoComplete={type === "password" ? "current-password" : "off"}
      />

      {type === "password" && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
};

export default Input;

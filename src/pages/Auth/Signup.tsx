import { Input } from "@components/atoms/Inputs";
import AuthLayout from "@components/AuthLayout";
import ProfilePhotoPicker from "@components/ProfilePhotoPicker";
import { useAuth } from "@context/AuthProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import API from "@utils/axios";
import { saveUserToLocalStorage } from "@utils/LocalStorage";
import { Controller, Form, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
const signupSchema = yup.object().shape({
  name: yup.string().required("Full name is required"),
  image: yup.mixed().required("Image is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

type SignupFormData = yup.InferType<typeof signupSchema>;

const Signup = () => {
  const { setUser } = useAuth() || {};
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      image: {},
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      console.log("data.image", data.image);
      const fileFormData = new FormData();
      fileFormData.append("file", data.image);

      const imageUpload = await API.post("/upload", fileFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("imageUpload", imageUpload?.data);
      if (imageUpload?.data) {
        let IValues: Omit<SignupFormData, "confirmPassword"> = {
          email: data?.email,
          password: data?.password,
          image: imageUpload?.data?.file?.path,
          name: data?.name,
        };

        // using form data beacuse i was also sending image first
        const res = await API.post("/auth/signup", IValues, {
          withCredentials: true,
        });
        if (res && res.data) {
          console.log("Signup successful", res.data);
          const { token, ...rest } = res.data.user;
          setUser && setUser(res.data.user);
          toast.success("User saved successfully");
          saveUserToLocalStorage(rest);
          saveUserToLocalStorage(token);
          navigate("/dashboard");
        } else {
          console.error("signup failed with empty response.");
        }
      }
    } catch (error: any) {
      if (error.response) {
        // Server responded with a status other than 2xx

        toast.error(error.response.data?.message);
      } else if (error.request) {
        // Request was made but no response received
        console.error("no ressponse from server:", error.request);
      } else {
        // Something else happendedd
        console.error("eror during signup:", error.message);
      }
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col">
        <h2 className="text-[clamp(1.2rem,2.2vw,2.1rem)] font-semibold mt-6">
          Create Account
        </h2>
        <p className="text-[clamp(1rem,1.5vw,1.2rem)] text-gray-500 mb-6">
          Join us today by entering your details
        </p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <ProfilePhotoPicker
                {...field}
                handleImageChange={(value) => {
                  console.log("value", value);
                  field.onChange(value);
              }}
                image={
                  field.value instanceof File
                    ? URL.createObjectURL(field.value)
                    : ""
                }
              />
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="text-start">
              <label className="text-[clamp(.8rem,2vw,1.2rem)] font-medium">
                Full Name
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter your full name"
                    handleChange={field.onChange}
                    value={field.value}
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            {/* Email */}
            <div className="text-start">
              <label className="text-[clamp(1rem,1.7vw,1.4rem)] font-medium">
                Email Address
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    handleChange={field.onChange}
                    value={field.value}
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="text-start">
            <label className="text-[clamp(1rem,1.7vw,1.4rem)] font-medium">
              Password
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  placeholder="Enter your password"
                  handleChange={field.onChange}
                  value={field.value}
                />
              )}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="text-start">
            <label className="text-[clamp(1rem,1.7vw,1.4rem)] font-medium">
              Confirm Password
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  placeholder="Confirm your password"
                  handleChange={field.onChange}
                  value={field.value}
                />
              )}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md"
          >
            SIGN UP
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;

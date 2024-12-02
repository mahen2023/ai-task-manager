import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { authService } from "../services/auth";
import { useAuthStore } from "../stores/auth";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    try {
      const response = await authService.register(data);
      login(response.token, response.user);
      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      {/* Website title */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          TaskMaster Pro
        </h1>
        <p className="mt-2 text-gray-600 text-center">
          Start managing your tasks effortlessly.
        </p>
      </header>

      {/* Register card */}
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-gray-500 text-sm">
          Sign up to start organizing your tasks today.
        </p>
        <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-red-100 p-4 text-red-700">
              <p className="text-sm">{error}</p>
            </div>
          )}
          <div className="space-y-4">
            <Input
              placeholder="Full name"
              error={errors.name?.message}
              {...register("name", { required: "Name is required" })}
            />
            <Input
              type="email"
              placeholder="Email address"
              error={errors.email?.message}
              {...register("email", { required: "Email is required" })}
            />
            <Input
              type="password"
              placeholder="Password"
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
          <div className="text-sm text-center mt-4">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

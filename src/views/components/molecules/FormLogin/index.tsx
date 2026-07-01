import { useState } from "react";
import { useFormik } from "formik";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "@/views/components/atoms/Button";
import Input from "@/views/components/atoms/Input";
import { Eye, EyeOff } from "lucide-react";

type LoginErrors = {
  username?: string;
  password?: string;
};

export default function FormLogin() {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate(values) {
      const nextErrors: LoginErrors = {};

      if (!values.username.trim()) {
        nextErrors.username = "Username wajib diisi.";
      }

      if (!values.password) {
        nextErrors.password = "Password wajib diisi.";
      } else if (values.password.length < 6) {
        nextErrors.password = "Password minimal 6 karakter.";
      }

      return nextErrors;
    },
    async onSubmit(values, helpers) {
      setAuthError("");

      const result = await signIn("credentials", {
        redirect: false,
        username: values.username,
        password: values.password,
      });

      if (result?.error) {
        setAuthError("Username atau password tidak sesuai.");
        helpers.setSubmitting(false);
        return;
      }

      window.sessionStorage.setItem("score-system-session-active", "true");
      await router.push("/");
    },
  });

  const getFieldError = (name: keyof LoginErrors) => {
    return formik.touched[name] ? formik.errors[name] : undefined;
  };

  const isLoading = formik.isSubmitting;

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full space-y-3"
      noValidate
    >
      {authError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
          {authError}
        </div>
      ) : null}

      <div className="space-y-4">
        <Input
          label="Username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="username"
          value={formik.values.username}
          error={getFieldError("username")}
          disabled={isLoading}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <Input
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Masukkan password"
          value={formik.values.password}
          error={getFieldError("password")}
          disabled={isLoading}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="pr-14"
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isLoading}
              aria-label={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
              aria-pressed={showPassword}
              title={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-slate-500 transition hover:text-cyan-800 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-800/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff className="h-4.5 w-4.5" strokeWidth={1.8} />
              ) : (
                <Eye className="h-4.5 w-4.5" strokeWidth={1.8} />
              )}
            </button>
          }
        />
      </div>

      <div className="flex items-center justify-between gap-4 text-xs">
        <label className="flex items-center gap-2 font-medium text-slate-600">
          <input
            type="checkbox"
            checked={rememberMe}
            disabled={isLoading}
            onChange={(event) => setRememberMe(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 accent-cyan-800 focus:ring-cyan-800"
          />
          Ingat saya
        </label>
      </div>

      <Button type="submit" isLoading={isLoading}>
        Masuk
      </Button>

      <p className="pt-3 text-sm text-slate-400">
        Belum punya akun?{" "}
        <Link
          href="#"
          className="font-semibold text-cyan-800 underline-offset-4 hover:underline"
        >
          Hubungi admin
        </Link>
      </p>
    </form>
  );
}

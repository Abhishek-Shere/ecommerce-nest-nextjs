import React, { useEffect } from "react";
import Register from "../components/Auth/Register";
import { useRouter } from "next/router";

const RegisterPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (!!localStorage.getItem("token")) {
      router.push("/products");
    }
  }, []);
  return (
    <div>
      <Register />
    </div>
  );
};

export default RegisterPage;

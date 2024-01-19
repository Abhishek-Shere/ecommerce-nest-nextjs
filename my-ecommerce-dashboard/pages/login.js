import React, { useEffect } from "react";
import Login from "../components/Auth/Login";
import { useRouter } from "next/router";

const LoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (!!localStorage.getItem("token")) {
      router.push("/products");
    }
  }, []);

  return (
    <div>
      <Login />
    </div>
  );
};

export default LoginPage;

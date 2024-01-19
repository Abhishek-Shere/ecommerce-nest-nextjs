"use client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const ProctedRoute = ({ children }) => {
  const router = useRouter();
  const [isAuthanticated, setIsAuthanticated] = useState(false);

  useEffect(() => {
    const storedToken =
      typeof window !== "undefined"
        ? window.localStorage?.getItem("token")
        : null;

    setIsAuthanticated(!!storedToken);
    const user = storedToken;
    if (!user) router.push("/login");
  }, []);

  return <div>{!!isAuthanticated && children}</div>;
};
export default ProctedRoute;

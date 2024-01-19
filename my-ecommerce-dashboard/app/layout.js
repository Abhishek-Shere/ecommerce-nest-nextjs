'use client';
import ProctedRoute from "@/components/ProctedRoute";
import Navbar from "../components/Common/Navbar";

const Layout = ({ children }) => {
  return (
    <ProctedRoute>
      <div>
        <Navbar />
        {children}
      </div>
    </ProctedRoute>
  );
};

export default Layout;

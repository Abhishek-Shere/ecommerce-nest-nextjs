import React, { useState } from "react";
import { Typography, TextField, Button, Container } from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

const StyledContainer = styled(Container)({
  textAlign: "center",
  marginTop: "50px",
});

const StyledPaper = styled("div")({
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const StyledForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  width: "300px",
  gap: "20px",
});
role: ["admin", "customer"];
const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleLogin = async () => {
    let payload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/users/login",
        payload
      );

      if (response.status === 201) {
        const { token } = response.data;
        localStorage.setItem("token", token);
        axios
          .get("http://localhost:4000/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            localStorage.setItem("currentUser", JSON.stringify(res.data));

            router.push("/products");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.error("Failed to login");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <StyledContainer>
      <Typography variant="h5">Login</Typography>
      <StyledPaper elevation={3}>
        <StyledForm>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            style={{ marginTop: "20px" }}
          >
            Login
          </Button>

          <Typography>
            Not have an accout{" "}
            <Link href="/register" passHref>
              Create account
            </Link>
          </Typography>
        </StyledForm>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Login;

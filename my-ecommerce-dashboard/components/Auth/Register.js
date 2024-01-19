import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Switch,
  FormControlLabel,
} from "@mui/material";
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
const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  });

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleLogin = async () => {
    let payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      roles: [!!formData?.isAdmin ? "admin" : "customer"],
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/users/signup",
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
      <Typography variant="h5">Register</Typography>
      <StyledPaper elevation={3}>
        <StyledForm>
          <TextField
            label="Name"
            type="name"
            variant="outlined"
            fullWidth
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
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

          <FormControlLabel
            control={
              <Switch
                checked={formData.isAdmin}
                onChange={() => handleInputChange("isAdmin", !formData.isAdmin)}
              />
            }
            label="Login as Admin"
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
            Already have an accout{" "}
            <Link href="/login" passHref>
              Login
            </Link>
          </Typography>
        </StyledForm>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Register;

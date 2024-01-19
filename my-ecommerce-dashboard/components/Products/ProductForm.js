"use client";
import React, { useState } from "react";
import { Container, Typography, TextField, Button, Paper } from "@mui/material";
import { styled } from "@mui/system";
import { useRouter } from "next/navigation";
import axios from "axios";

const StyledContainer = styled(Container)({
  textAlign: "center",
  marginTop: "20px",
});

const StyledPaper = styled("div")({
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const ProductForm = () => {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [stock, setStock] = useState(null);


  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !productPrice || !stock) {
      console.error("Please fill in all required fields");
      return;
    }

    const newProduct = {
      name: productName,
      price: parseFloat(productPrice),
      description: productDescription,
      stock: parseInt(stock),
      createdBy: JSON.parse(localStorage.getItem("currentUser"))._id,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/products/product",
        newProduct,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        console.log("Product created successfully");
      } else {
        console.error("Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }

    setProductName("");
    setProductPrice("");
    setProductDescription("");
    setStock("");
  };
  return (
    <StyledContainer>
      <StyledPaper elevation={3}>
        <Typography variant="h5">Create a New Product</Typography>
        <form
          onSubmit={handleFormSubmit}
          style={{ width: "100%", marginTop: "20px" }}
        >
          <TextField
            label="Product Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            helperText="Enter the name of the product"
          />
          <TextField
            label="Product Price"
            variant="outlined"
            fullWidth
            margin="normal"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            helperText="Enter the price of the product"
          />
          <TextField
            label="Product Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            helperText="Enter a brief description of the product"
          />
          <TextField
            type="number"
            label="Quantity In Stock"
            variant="outlined"
            fullWidth
            margin="normal"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            helperText="Enter Quantity In Stock"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            style={{ marginTop: "20px" }}
          >
            Create Product
          </Button>
        </form>
      </StyledPaper>
    </StyledContainer>
  );
};

export default ProductForm;

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import axios from "axios";
import Link from "next/link";

const ProductDetail = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleGetProduct = () => {
    axios
      .get(`http://localhost:4000/products/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setProduct(res.data);
      });
  };

  useEffect(() => {

    handleGetProduct();
    const storedCart =
      typeof window !== "undefined"
        ? window.localStorage?.getItem("cart")
        : null;
    const initialCart = storedCart ? JSON.parse(storedCart) : [];
    setCart(initialCart);

  }, [productId]);




  const addToCart = () => {
    const productToAdd = { ...product, quantity: 1 };
    const stock = product.stock; 

    const existingCartItem = cart.find((item) => item.id === product.id);

    if (existingCartItem) {
      if (existingCartItem.quantity < stock) {
        const updatedCart = cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity += 1) }
            : item
        );
        setCart(updatedCart);
      } else {
       
        console.log("Maximum stock reached for this product");
      }
    } else {
      if (stock > 0) {
        const updatedCart = [...cart, productToAdd];
        setCart(updatedCart);
      } else {
        
        console.log("This product is out of stock");
      }
    }

   
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  const productQuantityInCart =
    (cart.find((item) => item.id === product.id) || {}).quantity || 0;

  const removeFromCart = (productId) => {
    const productToAdd = { ...product, quantity: 1 };

    const existingCartItem = cart.find((item) => item.id === product.id);

    if (existingCartItem) {
      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity -= 1) }
          : item
      );
      setCart(updatedCart);
    } else {
      const updatedCart = [...cart, productToAdd];
      setCart(updatedCart);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };
  return (
    <Card sx={{ maxWidth: 500, margin: "auto" }}>
      <CardMedia
        component="img"
        height="300"
        image={"https://picsum.photos/seed/product1/300/400"}
        alt={product.name}
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Rs {product.price}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
        <Button size="small" onClick={addToCart}>
          {(cart.find((item) => item.id === product.id) || {}).quantity > 0
            ? "+"
            : "Add to Cart"}
        </Button>
        {(cart.find((item) => item.id === product.id) || {}).quantity || ""}
        {(cart.find((item) => item.id === product.id) || {}).quantity > 0 && (
          <Button size="small" onClick={removeFromCart}>
            {(cart.find((item) => item.id === product.id) || {}).quantity > 0
              ? "--"
              : ""}
          </Button>
        )}

        <Link href={`/cart`} passHref>
          <Button size="small">Proceed to Buy</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProductDetail;

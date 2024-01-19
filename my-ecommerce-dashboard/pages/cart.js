import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Link from "next/link";
import { styled } from "@mui/system";
import Layout from "@/app/layout";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useRouter } from "next/router";

const StyledContainer = styled(Container)({
  textAlign: "center",
  marginTop: "20px",
});

const StyledTableContainer = styled(TableContainer)({
  marginTop: "20px",
});

const StyledTotal = styled(Typography)({
  marginTop: "20px",
  display: "flex",
  justifyContent: "end",
});

const CartPage = () => {
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart =
      typeof window !== "undefined"
        ? window.localStorage?.getItem("cart")
        : null;
    const initialCart = storedCart ? JSON.parse(storedCart) : [];
    setCartItems(initialCart);
  }, []); 

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter((item) => item._id !== itemId);
    setCartItems(updatedCart);
    updateLocalStorage(updatedCart);
  };

  const handleIncreaseQuantity = (itemId) => {
    const cartItem = cartItems.find((item) => item._id === itemId);

    if (cartItem) {
      const { quantity, stock } = cartItem;

      if (quantity < stock) {
        const updatedCart = cartItems.map((item) =>
          item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );

        setCartItems(updatedCart);
        updateLocalStorage(updatedCart);
      } else {
        console.log("Maximum stock reached for this product");
      }
    }
  };

  const handleDecreaseQuantity = (itemId) => {
    const updatedCart = cartItems.map((item) =>
      item._id === itemId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCart);
    updateLocalStorage(updatedCart);
  };

  const updateLocalStorage = (cart) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("cart", JSON.stringify(cart));
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleProceed = () => {
    let products = JSON.parse(localStorage.getItem("cart"))?.map((product) => {
      return {
        productId: product._id,
        quantity: product.quantity,
      };
    });

    axios
      .post(
        `http://localhost:4000/orders/order`,
        {
          userId: JSON.parse(localStorage.getItem("currentUser"))?._id,
          products: products,
          totalAmount: cartTotal,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        localStorage.removeItem("cart");
        router.push("/products");
        setCartItems([]);
      });
  };

  return (
    <Layout>
      <StyledContainer>
        <Typography variant="h4">Shopping Cart</Typography>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            {!cartItems?.length && <TableBody>No items In cart</TableBody>}
            {!!cartItems?.length > 0 && (
              <TableBody>
                {cartItems.map((cartItem) => (
                  <TableRow key={cartItem._id}>
                    <TableCell>{cartItem.name}</TableCell>
                    <TableCell>Rs {cartItem.price}</TableCell>
                    <TableCell>
                      <span
                        style={{
                          width: "10px",
                          color: "#1976d2",
                          cursor: "pointer",
                        }}
                        onClick={() => handleIncreaseQuantity(cartItem._id)}
                      >
                        +
                      </span>
                      &nbsp; &nbsp;{cartItem.quantity}&nbsp; &nbsp;
                      <span
                        style={{
                          width: "10px",
                          color: "#1976d2",
                          cursor: "pointer",
                        }}
                        onClick={() => handleDecreaseQuantity(cartItem._id)}
                      >
                        --
                      </span>
                    </TableCell>
                    <TableCell>
                      Rs {cartItem.price * cartItem.quantity}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleRemoveItem(cartItem._id)}
                        startIcon={<DeleteIcon />}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </StyledTableContainer>
        <StyledTotal variant="h6">Total: Rs {cartTotal}</StyledTotal>
        {!!cartItems?.length > 0 && (
          <Button
            onClick={handleProceed}
            variant="contained"
            color="primary"
            size="large"
          >
            Proceed To Buy
          </Button>
        )}
      </StyledContainer>
    </Layout>
  );
};

export default CartPage;

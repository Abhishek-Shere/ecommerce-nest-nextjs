import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";
import EditProductModal from "./EditProductModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const ProductList = () => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );

  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleGetProducts = () => {
    axios
      .get("http://localhost:4000/products/all-products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setProducts(res.data);
      });
  };

  useEffect(() => {
    handleGetProducts();


    const storedCart =
      typeof window !== "undefined"
        ? window.localStorage?.getItem("cart")
        : null;
    const initialCart = storedCart ? JSON.parse(storedCart) : [];
    setCart(initialCart);
  }, []);
 const addToCart = (productId) => {
    const productToAdd = products.find((product) => product?._id === productId);
    const existingCartItem = cart.find((item) => item._id === productId);
    const stock = productToAdd.stock;

    if (existingCartItem) {
      if (existingCartItem.quantity < stock) {
        const updatedCart = cart.map((item) =>
          item._id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      } else {
        console.log("Maximum stock reached for this product");
      }
    } else {
      if (stock > 0) {
        const updatedCart = [...cart, { ...productToAdd, quantity: 1 }];
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      } else {
        console.log("This product is out of stock");
      }
    }
  }; 

  const removeFromCart = (productId) => {
    const updatedCart = cart?.map((item) =>
      item._id === productId
        ? { ...item, quantity: Math.max(0, item.quantity - 1) }
        : item
    );
    const nonZeroItems = updatedCart?.filter((item) => item.quantity > 0);
    setCart(nonZeroItems);
    localStorage.setItem("cart", JSON.stringify(nonZeroItems));
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    axios
      .delete(`http://localhost:4000/products/product/${product?._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        handleGetProducts();
      });
  };

  const handleSaveEdit = (editedProduct) => {
    axios
      .put(
        `http://localhost:4000/products/product/${selectedProduct?._id}`,
        {
          ...editedProduct,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        handleGetProducts();
      });
  };

  return (
    <div>
      {currentUser?.roles[0] === "admin" && (
        <Link href={`/products/new`} passHref>
          <Button>+ Add Product</Button>
        </Link>
      )}
      <Grid container spacing={2}>
        {products?.map((product) => (
          <Grid item key={product?._id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ maxWidth: 400 }}>
              <CardMedia
                component="img"
                height="140"
                image={"https://picsum.photos/seed/1/300/200"}
                alt={product?.name}
              />
              <CardContent sx={{ height: 100 }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography gutterBottom variant="h5" component="div">
                    {product?.name}
                  </Typography>
                  {currentUser?.roles[0] === "admin" && (
                    <div>
                      <EditIcon
                        style={{ margin: "0 10px", cursor: "pointer" }}
                        onClick={() => handleEditClick(product)}
                      />
                      <DeleteIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          handleDeleteClick(product);
                        }}
                      />
                    </div>
                  )}
                </div>
                <Typography
                  sx={{ height: "40px" }}
                  variant="body2"
                  color="text.secondary"
                >
                  {product?.description.slice(0, 80)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rs {product?.price}
                </Typography>
              </CardContent>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0 16px",
                }}
              >
                {product?.stock == 0 && (
                  <div>
                    <Button style={{ color: "red" }}>Out of stock</Button>
                  </div>
                )}

                <div>
                  {product?.stock > 0 && (
                    <>
                      {" "}
                      <Button
                        size="small"
                        onClick={() => addToCart(product?._id)}
                      >
                        {(cart.find((item) => item._id === product?._id) || {})
                          .quantity > 0
                          ? "+"
                          : "Add to Cart"}
                      </Button>
                      {(cart.find((item) => item._id === product?._id) || {})
                        .quantity || ""}
                      <Button
                        size="small"
                        onClick={() => removeFromCart(product?._id)}
                      >
                        {(cart.find((item) => item._id === product?._id) || {})
                          .quantity > 0
                          ? "--"
                          : ""}
                      </Button>
                    </>
                  )}

                  <Link href={`/products/${product?._id}`} passHref>
                    <Button size="small">View Details</Button>
                  </Link>
                </div>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
      <EditProductModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductList;

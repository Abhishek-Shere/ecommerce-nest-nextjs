import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";

const StyledPaper = styled(Paper)({
  maxWidth: 600,
  margin: "auto",
  padding: "24px",
  boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
  borderRadius: "8px",
});

const StyledTitle = styled(Typography)({
  marginBottom: "16px",
  color: "#0070f3",
  fontSize: "24px",
});

const StyledListItem = styled(ListItem)({
  display: "flex",
  justifyContent: "space-between",
  borderBottom: "1px solid #e0e0e0",
});

const StyledDivider = styled(Divider)({
  margin: "16px 0",
});

const OrderDetail = ({ orderId }) => {
  const [order, setOrder] = useState(null);

  const handleGetOrderDetails = () => {
    axios
      .get(`http://localhost:4000/orders/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setOrder(res.data);
      });
  };

  useEffect(() => {
    handleGetOrderDetails();

  }, [orderId]);

  if (!order) {
    return <p>Loading...</p>;
  }

  return (
    <StyledPaper elevation={3}>
      <StyledTitle variant="h4">Order Details</StyledTitle>
      <Typography variant="h6">Customer Id: #{order.userId}</Typography>
      <Typography variant="subtitle1">Total: Rs {order.totalAmount}</Typography>
      <Typography variant="subtitle1">Status: {order.status}</Typography>

      <div style={{ marginTop: "20px" }}>
        <Stepper
          activeStep={order.status === "Pending" ? 0 : 1}
          alternativeLabel
        >
          <Step>
            <StepLabel>Pending</StepLabel>
          </Step>
          <Step>
            <StepLabel>Shipped</StepLabel>
          </Step>
          <Step>
            <StepLabel>Delivered</StepLabel>
          </Step>
        </Stepper>
      </div>

      <StyledDivider />

      <Typography variant="h6">Products</Typography>
      <List>
        {order?.products?.map((product, i) => (
          <StyledListItem key={product.id}>
            <ListItemText primary={`${product?.productId?.name ??''}`} />
            <ListItemText primary={`Quantity: ${product.quantity}`} />
          </StyledListItem>
        ))}
      </List>
    </StyledPaper>
  );
};

export default OrderDetail;

import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import Link from "next/link";
import { styled } from "@mui/system";
import styles from "../../styles/OrderList.module.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOrderModal from "./EditOrderModal";
import axios from "axios";

const StyledOrderList = styled("div")({
  marginTop: "16px",
});

const StyledHeading = styled(Typography)({
  fontSize: "24px",
  marginBottom: "16px",
  color: "#333",
});

const StyledListItem = styled(ListItem)({
  transition: "background-color 0.3s, box-shadow 0.3s",
  textDecoration: "none",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  margin: "8px",
  "&:hover": {
    backgroundColor: "#f0f0f0",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
});

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (editedProduct) => {
    axios
      .put(
        `http://localhost:4000/orders/order/${selectedOrder?._id}`,
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
        handleGetList();
      });
  };

  const userId = JSON.parse(localStorage.getItem("currentUser"))?._id;

  const handleGetList = () => {
    let url =
      currentUser?.roles[0] === "admin"
        ? `http://localhost:4000/orders`
        : `http://localhost:4000/orders/user/${userId}`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setOrders(res.data ?? []);
      });
  };

  useEffect(() => {
    handleGetList();
  }, []);

  return (
    <StyledOrderList>
      <StyledHeading variant="h5">Order List</StyledHeading>
      <List>
        {orders?.map((order) => (
          <React.Fragment key={order?.id}>
            <StyledListItem button className={styles.listItem}>
              <Link
                style={{
                  textDecoration: "none",
                  display: "flex",
                  justifyContent: "space-between",
                }}
                href={`/orders/${order?._id}`}
                passHref
              >
                <ListItemText
                  primary={`Order Id #${order?._id}`}
                  secondary={`Customer ID: ${order?.userId} | Total: $${order?.totalAmount} | Status: ${order?.status}`}
                  className={styles.linkText}
                />
              </Link>
              
                <div>
                  <EditIcon
                    style={{ margin: "0  10px", cursor: "pointer" }}
                    onClick={() => handleEditClick(order)}
                  />
                </div>
              
            </StyledListItem>
          </React.Fragment>
        ))}
      </List>
      <EditOrderModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        order={selectedOrder}
      />
    </StyledOrderList>
  );
};

export default OrderList;

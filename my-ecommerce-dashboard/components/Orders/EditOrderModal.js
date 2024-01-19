import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
};

function EditOrderModal({ isOpen, onClose, onSave, order }) {
  const [editedOrder, setEditedOrder] = useState(order);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (editedOrder.products.some((product) => !product.quantity)) {
      setError("Invalid quantity detected");
      return;
    }
    if (
      editedOrder.products.some(
        (product) => product.quantity > product.productId.stock
      )
    ) {
      setError("Quantity exceeds available stock");
      return;
    }

    onSave(editedOrder);
    onClose();
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const productToUpdate = editedOrder.products.find(
      (product) => product._id === productId
    );

    const updatedProducts = editedOrder.products.map((product) =>
      product._id === productId
        ? { ...product, quantity: parseInt(newQuantity, 10) }
        : product
    );

    const newTotal = updatedProducts.reduce((total, product) => {
      return total + product.productId.price * product.quantity;
    }, 0);

    setEditedOrder({
      ...editedOrder,
      products: updatedProducts,
      totalAmount: newTotal,
    });
  };
  console.log(editedOrder, "editedOrder");

  useEffect(() => {
    setEditedOrder(order);

    return () => {
      setError("");
    };
  }, [order]);

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            {editedOrder?.products?.map((product) => (
              <>
                <Typography variant="h6">{product?.productId?.name}</Typography>

                <TextField
                  type="number"
                  label="Quantity In Stock"
                  variant="outlined"
                  fullWidth
                  defaultValue={0}
                  margin="normal"
                  value={product?.quantity}
                  onChange={(e) =>
                    handleQuantityChange(product._id, parseInt(e.target.value))
                  }
                  helperText="Enter Quantity In Stock"
                />
              </>
            ))}

            <Typography variant="h6">
              Total ={" "}
              {!editedOrder?.totalAmount ? "" : editedOrder?.totalAmount}
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <Button
              sx={{ marginRight: "20px" }}
              variant="outlined"
              color="primary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
export default EditOrderModal;

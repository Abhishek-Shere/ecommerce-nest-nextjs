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

function EditProductModal({ isOpen, onClose,    onSave, product }) {
  const [editedProduct, setEditedProduct] = useState({ ...product });

  const handleSave = () => {
    onSave(editedProduct);
    onClose();
  };

  useEffect(() => {
    setEditedProduct({ ...product });
  }, [product]);

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
            <TextField
              label="Product Name"
              value={editedProduct.name}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, name: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Product Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={editedProduct.description}
              onChange={(e) =>
                setEditedProduct({
                  ...editedProduct,
                  description: e.target.value,
                })
              }
              helperText="Enter a brief description of the product"
            />
            <TextField
            type="number"
              label="Product Price"
              value={editedProduct.price}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, price: parseInt(e.target.value) })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              type="number"
              label="Quantity In Stock"
              variant="outlined"
              fullWidth
              margin="normal"
              value={editedProduct?.stock}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, stock: e.target.value })
              }
              helperText="Enter Quantity In Stock"
            />
            <Button sx={{marginRight:"20px"}} variant="outlined" color="primary" onClick={onClose}>
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
export default EditProductModal;

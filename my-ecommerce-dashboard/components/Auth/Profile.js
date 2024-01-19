import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { useRouter } from "next/router";

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

const StyledAvatar = styled(Avatar)({
  width: "100px",
  height: "100px",
  marginBottom: "10px",
});

const Profile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );
  const [editedName, setEditedName] = useState(user.name);
  const router = useRouter();

  const handleEditClick = () => {
    setIsEditMode(true);
    setEditedName(user.name);
  };

  const handleDeleteClick = () => {
    axios
      .delete(`http://localhost:4000/profile/${user?._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("cart");
        router.push("/login");
      });
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleSaveEdit = () => {
    axios
      .put(
        `http://localhost:4000/profile/${user?._id}`,
        {
          name: editedName,
          email: user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setEditedName(res.data.name);
        localStorage.setItem("currentUser", JSON.stringify(res.data));
      });

    setIsEditMode(false);
  };

  return (
    <StyledContainer>
      <h2>Profile</h2>
      <StyledPaper elevation={3}>
        <StyledAvatar alt={user.username} src={user.avatarUrl} />
        <Typography variant="h5">
          {isEditMode ? (
            <TextField
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              fullWidth
            />
          ) : (
            editedName ?? user?.name
          )}
        </Typography>

        <Typography sx={{ marginTop: 5 }} variant="body1" color="textSecondary">
          Email: {user.email}
        </Typography>
        {isEditMode ? (
          <div style={{ display: "flex" }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancelEdit}
              sx={{ marginTop: "20px" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveEdit}
              sx={{ marginTop: "20px", marginLeft: "10px" }}
            >
              Save
            </Button>
          </div>
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditClick}
              sx={{ marginTop: "20px" }}
            >
              Edit Profile
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteClick}
              sx={{ marginTop: "20px" }}
            >
              Delete Profile
            </Button>
          </>
        )}
      </StyledPaper>
    </StyledContainer>
  );
};

export default Profile;

// src/pages/UserManager.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    username: "",
    email: "",
    password: "",
    rol: "USER",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/auth/get");
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Error al cargar la lista de usuarios.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.post("/auth/create-user", formData);
      setMessage("Usuario creado exitosamente.");
      fetchUsers(); // Recargar la lista de usuarios
      setFormData({
        // Limpiar formulario
        nombre: "",
        username: "",
        email: "",
        password: "",
        rol: "USER",
      });
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Error al crear el usuario. Verifica los datos."
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        await api.delete(`/auth/delete/${id}`);
        setMessage("Usuario eliminado correctamente.");
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.error || "Error al eliminar el usuario.");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/user-manager/edit/${id}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Gestión de Usuarios
      </Typography>

      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Formulario de creación de usuario */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Crear nuevo usuario
        </Typography>
        <Box component="form" onSubmit={handleCreateUser} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Nombre de usuario"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Correo electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
          />
          <FormControl fullWidth>
            <InputLabel>Rol</InputLabel>
            <Select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              label="Rol"
            >
              <MenuItem value="USER">USER</MenuItem>
              <MenuItem value="EDITOR">EDITOR</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary">
            Crear usuario
          </Button>
        </Box>
      </Paper>

      {/* Tabla de usuarios */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Lista de Usuarios
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.nombre}</TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.rol}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(u.id)}
                    disabled={user.id === u.id}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(u.id)}
                    disabled={user.id === u.id}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserManager;
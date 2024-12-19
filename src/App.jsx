import React, { useState, useEffect } from "react";
import {
    Button,
    TextField,
    Typography,
    Container,
    CircularProgress,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    createTheme,
    ThemeProvider,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Custom theme with a soft and user-friendly color palette
const theme = createTheme({
    palette: {
        primary: {
            main: "#00796b", // Teal color for primary action buttons
        },
        secondary: {
            main: "#004d40", // Darker teal for secondary elements
        },
        background: {
            default: "#f0f4f4", // Light greyish background for better readability
        },
        text: {
            primary: "#333333", // Dark text color for better contrast
        },
    },
});

const App = () => {
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        address: "",
        occupation: "",
    });
    const [loading, setLoading] = useState(false);
    const [loadingCustomers, setLoadingCustomers] = useState(false);

    // Fetch all customers
    const getAllCustomers = async () => {
        setLoadingCustomers(true);
        try {
            const response = await axios.get("http://localhost:8080/v1/getAll"); // Update with your API endpoint
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
            toast.error("Failed to fetch customers!");
        } finally {
            setLoadingCustomers(false);
        }
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Reset form inputs
    const resetForm = () => {
        setFormData({
            fullName: "",
            email: "",
            phoneNumber: "",
            address: "",
            occupation: "",
        });
    };

    // Add a new customer
    const addCustomer = async () => {
        const { fullName, email, phoneNumber, address, occupation } = formData;

        // Validate input
        if (!fullName || !email || !phoneNumber || !address || !occupation) {
            toast.error("All fields are required!");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8080/v1/add/CustomerInfo", formData, {
                headers: { "Content-Type": "application/json" },
            });
            setCustomers([...customers, response.data]); // Add the new customer to the list
            toast.success("Customer added successfully!");
        } catch (error) {
            console.error("Error adding customer:", error);
            toast.error("Failed to add customer!");
            toast.error("Error message: " + error.response.data.message)
        } finally {
            setLoading(false);
            resetForm(); // Reset form inputs
        }
    };

    // Fetch all customers on component mount
    useEffect(() => {
        getAllCustomers();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" style={{ marginTop: "30px" }}>
                <Typography variant="h4" gutterBottom align="center" style={{ color: theme.palette.primary.main }}>
                    Customer Management
                </Typography>

                <Paper style={{ padding: "20px", marginBottom: "20px", backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
                    <Typography variant="h6" gutterBottom>
                        Add New Customer
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Full Name"
                                variant="outlined"
                                fullWidth
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Phone Number"
                                variant="outlined"
                                fullWidth
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Address"
                                variant="outlined"
                                fullWidth
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Occupation"
                                variant="outlined"
                                fullWidth
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={addCustomer}
                                fullWidth
                                disabled={loading}
                                style={{
                                    backgroundColor: theme.palette.primary.main,
                                    color: "#fff",
                                    padding: "10px",
                                    borderRadius: "5px",
                                }}
                            >
                                {loading ? <CircularProgress size={24} style={{ color: "#fff" }} /> : "Add Customer"}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                <Typography variant="h6" gutterBottom align="center">
                    All Customers
                </Typography>
                {loadingCustomers ? (
                    <CircularProgress style={{ margin: "20px auto", display: "block" }} />
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Name</strong></TableCell>
                                    <TableCell><strong>Email</strong></TableCell>
                                    <TableCell><strong>Phone Number</strong></TableCell>
                                    <TableCell><strong>Address</strong></TableCell>
                                    <TableCell><strong>Occupation</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {customers.map((customer, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{customer.fullName}</TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell>{customer.phoneNumber}</TableCell>
                                        <TableCell>{customer.address}</TableCell>
                                        <TableCell>{customer.occupation}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <ToastContainer position="top-center" />
            </Container>
        </ThemeProvider>
    );
};

export default App;

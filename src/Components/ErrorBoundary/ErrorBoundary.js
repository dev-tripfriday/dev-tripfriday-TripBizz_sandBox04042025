import React, { Component } from "react";
import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoBack = () => {
    window.history.back();
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI
      return (
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            textAlign: "center",
            bgcolor: "#f8f9fa",
            p: 3,
            borderRadius: 2,
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Oops! Something went wrong.
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            We encountered an unexpected error. Please try refreshing the page
            or go back to the previous page.
          </Typography>
          <div className="flex gap-4 items-center">
            <Button
              variant="contained"
              onClick={this.handleRefresh}
              sx={{ backgroundColor: "black", color: "#fff" }}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              onClick={this.handleGoBack}
              sx={{ color: "black", borderColor: "black" }}
            >
              Go Back
            </Button>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

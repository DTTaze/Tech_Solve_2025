import React from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Select an Event",
      description:
        "Choose the event that participants will be joining. This ensures users are added to the correct event.",
    },
    {
      number: 2,
      title: "Scan User QR Code",
      description:
        "Ask participants to show their unique QR code from their user profile or event registration email.",
    },
    {
      number: 3,
      title: "Confirm Attendance",
      description:
        "The system automatically registers the user to the event. You can view and manage all participants in the User Management section.",
    },
  ];

  return (
    <Box mt={3}>
      <Typography variant="h6" gutterBottom>
        How It Works
      </Typography>
      <Grid container spacing={2}>
        {steps.map((step) => (
          <Grid item xs={12} sm={4} key={step.number}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Box
                    sx={{
                      bgcolor: "var(--light-green)",
                      color: "var(--primary-green)",
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,
                      fontWeight: "bold",
                    }}
                  >
                    {step.number}
                  </Box>
                  <Typography variant="h6">{step.title}</Typography>
                </Box>
                <Typography variant="body2">{step.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

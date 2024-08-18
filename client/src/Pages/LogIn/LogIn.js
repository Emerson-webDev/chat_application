import React from "react";
import { Avatar, Box, Grid, Typography } from "@mui/material";
import InputForm from "./InputForm";
import { LogInForm, WelcomeInterface } from "./Theme/Theme";
import chatlogo from "../../Assets/logo.webp";

export default function LogIn() {
  return (
    <Grid
      container
      sx={{
        height: "inherit",
      }}
    >
      <WelcomeInterface item sm={12} md={6} lg={6}>
        <Box>
          <Avatar src={chatlogo} alt="chat-logo" />
          <Typography variant="h3" sx={{ color: "text.primary" }}>
            Welcome to Chat App
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Just Chat app and connect.
          </Typography>
        </Box>
      </WelcomeInterface>
      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        lg={6}
      >
        <LogInForm>
          <InputForm />
        </LogInForm>
      </Grid>
    </Grid>
  );
}

import { Box, Typography } from '@mui/material';
import React from 'react'

function NotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <Typography variant="h1" color="error">
        404
      </Typography>
      <Typography variant="h4">
        Page Not Found
      </Typography>
    </Box>
  );
}

export default NotFound
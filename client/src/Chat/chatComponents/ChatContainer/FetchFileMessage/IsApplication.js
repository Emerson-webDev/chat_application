import { Box, Paper, Stack, styled } from "@mui/material";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import React from "react";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function IsApplication({ message, handleDownload }) {
  return (
    <Box>
      <Stack spacing={2}>
        {message.file?.map((msgfile, index) => (
          <Item
            key={index}
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
            }}
            onClick={() => {handleDownload(msgfile)}}
          >
            {/* <Typography
                  // onClick={handleDownload}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <InsertDriveFileOutlinedIcon />
                  {msgfile.name}
                </Typography> */}
            <InsertDriveFileOutlinedIcon />
            {msgfile.name}
          </Item>
        ))}
      </Stack>
    </Box>
  );
}

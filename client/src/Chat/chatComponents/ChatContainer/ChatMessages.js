import FetchChatMessage from "./FetchChatMessage";
import { Grid } from "@mui/material";

export default function ChatMessages({ message }) {
  
  return (
    <Grid
      container
      sx={{ justifyContent: "flex-end", flexDirection: "column" }}
    >
      {message?.map((msg) => (
        <FetchChatMessage
          chatMessage={msg[Object.keys(msg)]}
          last_message={msg}
          key={Object.keys(msg)}
          msgkey={Object.keys(msg)}
        />
      ))}
    </Grid>
  );
}

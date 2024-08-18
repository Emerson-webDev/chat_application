import React from 'react'
import MessagesPanel from '../chatComponents/MessagesPanel/MessagesPanel'
import { Box } from '@mui/material'

export default function Messages() {
  return (
    <Box sx={{display: "flex", height: "100vh", flexGrow: 1}}>
        <MessagesPanel />
    </Box>
  )
}

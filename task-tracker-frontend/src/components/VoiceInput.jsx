import { Button, Modal, Box, IconButton } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import MicIcon from "@mui/icons-material/Mic";

const VoiceInput = ({ onSubmit }) => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setText(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleOpen = () => {
    setText("");
    setOpen(true);
  };

  const handleClose = () => {
    stopListening();
    setText("");
    setOpen(false);
  };

  const startListening = () => {
    setIsListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognitionRef.current.stop();
  };

  return (
    <>
      <IconButton size="large" color="primary" onClick={handleOpen}>
        <MicIcon />
      </IconButton>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            bgcolor: "white",
            p: 3,
            width: "60%",
            mx: "auto",
            mt: "20%",
            borderRadius: 2,
          }}
        >
          <Box mb={2} fontWeight="bold" fontSize="h6.fontSize">
            Voice Input
          </Box>
          <Box
            mb={2}
            height={100}
            overflow="auto"
            border={1}
            borderColor="grey.400"
            p={1}
          >
            {text || "Your transcribed text will appear here..."}
          </Box>

          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button
              fullWidth
              onClick={startListening}
              disabled={isListening}
              sx={{ mt: 2 }}
            >
              Start Recording
            </Button>

            <Button
              fullWidth
              onClick={stopListening}
              disabled={!isListening}
              sx={{ mt: 1 }}
            >
              Stop Recording
            </Button>
          </Box>

          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              size="large"
              onClick={() => {
                onSubmit(text);
                handleClose();
              }}
            >
              Add Task
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default VoiceInput;

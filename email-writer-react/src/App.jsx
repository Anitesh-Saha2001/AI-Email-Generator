import React, { useState } from 'react';
import { Box, Container, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, CircularProgress } from '@mui/material';
import './App.css'
import axios from 'axios';

function App() {
  const[emailContent, setEmailContent] = useState("");
  const[tone, setTone] = useState("");
  const[generatedReply, setGeneratedReply] = useState("");
  const[loading, setLoading] = useState(false);
  const[error, setError] = useState("");
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try{
      const response = await axios.post("http://localhost:8080/api/email/generate",{
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data.reply));
    }catch(error){
      setError("An error occurred while generating the reply. Please try again.");
      console.error("Error generating reply:", error);
    }finally{
      setLoading(false);
    }
  }
  return (
    <Container maxWidth="md" sx={{py:4}}>
      <Typography variant="h3" component="h1" gutterBottom>
        Email Reply Generator
      </Typography>
      <Typography variant="body1" gutterBottom>
        Generate professional email replies with ease. Enter the email content and select the desired tone to get started.
      </Typography>
      {/* Add your form and other components here */}

      <Box sx={{mx : 0}}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          label="Original Email Content"
          value={emailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb:2 }}/>

          <FormControl fullWidth>
            <InputLabel>Tone(Optional)</InputLabel>
            <Select
              value={tone}
              label="Tone(Optional)"
              onChange={(e) => setTone(e.target.value)}
              sx={{ mb:2, minWidth: 120 }}>
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
            </Select>
          </FormControl>

          <Button
          variant="contained"
          onClick={handleSubmit}
          color="primary"
          disabled={!emailContent || loading}
          fullWidth>
            
            {loading ? <CircularProgress size={24}/>: "Generate Reply"}
          </Button>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          {generatedReply && (
            <Box sx={{ mt: 4, p: 2, border: '1px solid #ccc', borderRadius: 1, backgroundColor: '#f9f9f9' }}>
              <Typography variant="h6" gutterBottom>
                Generated Reply:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                value={generatedReply || ''}
                InputProps={{ readOnly: true }}
              />
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => {
                navigator.clipboard.writeText(generatedReply);
              }}>
              Copy to Clipboard
            </Button>
            </Box>
          )}
          
      </Box>
    </Container>
  )
}


export default App

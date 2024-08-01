//import React from 'react';
import { Container, Typography } from '@mui/material';
import CourseForm from './components/CourseForm';

function App() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Cadastro de Cursos
      </Typography>
      <CourseForm />
    </Container>
  );
}

export default App;
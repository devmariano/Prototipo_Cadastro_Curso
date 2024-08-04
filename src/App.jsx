//import React from 'react';
// import CourseForm from './components/CourseForm';

// const App = () => {
//   return (
//     <div>
//       <CourseForm />
//     </div>
//   );
// };

// export default App;
import { useState } from 'react';
import CourseForm from './components/CourseForm';
//import CourseForm_alt from './components/CourseForm_alt';
import { Button, Box, Grid, Typography, Paper } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookIcon from '@mui/icons-material/Book';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const App = () => {
  const [activeStep, setActiveStep] = useState(-1); // Start at -1 to show the initial selection screen
  const [courseType, setCourseType] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseData, setCourseData] = useState(null);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(-1); // Go back to the initial selection screen
    setCourseType('');
    setCourseName('');
    setCourseData(null);
  };

  const handleNormalizedClick = () => {
    toast.info('Cursos normalizados ainda não estão disponíveis.');
  };

  const handleNonNormalizedClick = () => {
    setActiveStep(0); // Start the stepper for non-normalized course
  };

  return (
    <Box display="flex">
      {activeStep === -1 ? (
        <Box mx="auto" mt={5}>
          <Grid container spacing={3}>
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleNonNormalizedClick}
                startIcon={<LibraryBooksIcon />}
                style={{ width: '200px', height: '200px', display: 'flex', flexDirection: 'column' }}
              >
                <Typography variant="h6">Curso Não Normalizado</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleNormalizedClick}
                startIcon={<BookIcon />}
                style={{ width: '200px', height: '200px', display: 'flex', flexDirection: 'column' }}
              >
                <Typography variant="h6">Curso Normalizado</Typography>
              </Button>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box flexGrow={1} ml={3}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <CourseForm
              courseType={courseType}
              setCourseType={setCourseType}
              courseName={courseName}
              setCourseName={setCourseName}
              courseData={courseData}
              setCourseData={setCourseData}
              handleNext={handleNext}
              handleBack={handleBack}
              handleReset={handleReset}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          </Paper>
        </Box>
      )}
      <ToastContainer />
    </Box>
  );
};

export default App;

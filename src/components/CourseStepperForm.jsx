import { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, Box, Paper, Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import CourseForm from './CourseForm';
import 'react-toastify/dist/ReactToastify.css';
import BookIcon from '@mui/icons-material/Book';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const steps = ['Tipo de Curso', 'Nome do Curso e Detalhes'];

const CourseStepperForm = () => {
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
        <>
          <Box minWidth="200px">
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          <Box flexGrow={1} ml={3}>
            {activeStep === steps.length ? (
              <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h6" gutterBottom>
                  Curso salvo com sucesso!
                </Typography>
                <Button onClick={handleReset}>Cadastrar Novo Curso</Button>
              </Paper>
            ) : (
              <Paper elevation={3} style={{ padding: '20px' }}>
                <div>
                  {activeStep === 0 && (
                    <CourseForm
                      courseType={courseType}
                      setCourseType={setCourseType}
                      courseName={courseName}
                      setCourseName={setCourseName}
                      courseData={courseData}
                      setCourseData={setCourseData}
                      handleNext={handleNext}
                    />
                  )}
                  {activeStep === 1 && (
                    <div>
                      <Typography variant="h6" gutterBottom>
                        Confirme os detalhes do curso:
                      </Typography>
                      <Typography variant="body1"><strong>Tipo:</strong> {courseType}</Typography>
                      <Typography variant="body1"><strong>Nome:</strong> {courseName}</Typography>
                      <Typography variant="body1"><strong>Detalhes:</strong> {courseData?.details}</Typography>
                      <Button onClick={handleBack} style={{ marginRight: '10px' }}>Voltar</Button>
                      <Button variant="contained" color="primary" onClick={handleNext}>Salvar</Button>
                    </div>
                  )}
                </div>
              </Paper>
            )}
            <ToastContainer />
          </Box>
        </>
      )}
    </Box>
  );
};

export default CourseStepperForm;

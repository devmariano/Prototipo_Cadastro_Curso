import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import mockCourses from '../data/mockCourses';

const steps = ['Definição do Curso', 'Detalhes do Curso', 'Perfil Profissional'];

const CourseForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [courseType, setCourseType] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseData, setCourseData] = useState({
    details: '',
    startDate: '',
    endDate: '',
    maxStudents: '',
    minStudents: '',
    educationLevel: '',
    minAge: '',
    maxAge: '',
    otherRequirements: [],
    technologicalAxis: '',
    technologicalArea: '',
    technologicalSegment: '',
    cbo: '',
  });
  const [suggestions, setSuggestions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [expanded, setExpanded] = useState('panel0');
  const [isNameValid, setIsNameValid] = useState(true);

  useEffect(() => {
    if (courseName && mockCourses.some(course => course.type === courseType && course.name === courseName)) {
      setIsNameValid(false);
    } else {
      setIsNameValid(true);
    }
  }, [courseName, courseType]);

  const handleAccordionChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleNext = () => {
    if (!isNameValid) {
      toast.error('O nome do curso deve ser diferente do original.');
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setExpanded(`panel${activeStep + 1}`);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setExpanded(`panel${activeStep - 1}`);
  };

  const handleReset = () => {
    setActiveStep(0);
    setExpanded('panel0');
    setCourseType('');
    setCourseName('');
    setCourseData({
      details: '',
      startDate: '',
      endDate: '',
      maxStudents: '',
      minStudents: '',
      educationLevel: '',
      minAge: '',
      maxAge: '',
      otherRequirements: [],
      technologicalAxis: '',
      technologicalArea: '',
      technologicalSegment: '',
      cbo: '',
    });
    setSuggestions([]);
    setIsNameValid(true);
  };

  const handleCourseTypeChange = (e) => {
    setCourseType(e.target.value);
    setCourseName('');
    setCourseData({ ...courseData, details: '' });
    setSuggestions([]);
  };

  const handleCourseNameChange = (e) => {
    const value = e.target.value;
    setCourseName(value);

    if (value) {
      const filteredCourses = mockCourses.filter((course) => course.type === courseType);
      const results = filteredCourses.filter((course) =>
        course.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (course) => {
    setCourseData({
      ...course,
      details: course.details,
      startDate: '',
      endDate: '',
      maxStudents: course.maxStudents,
      minStudents: course.minStudents,
      educationLevel: '',
      minAge: course.minAge,
      maxAge: course.maxAge,
      otherRequirements: [],
      technologicalAxis: course.technologicalAxis,
      technologicalArea: course.technologicalArea,
      technologicalSegment: course.technologicalSegment,
      cbo: course.cbo,
    });
    setCourseName(course.name);
    setSuggestions([]);
    toast.info('O nome do novo curso deve ser diferente do original.');
  };

  const handleSave = () => {
    if (!isNameValid) {
      toast.error('O nome do curso deve ser diferente do original.');
      return;
    }
    const newCourseData = {
      name: courseName,
      type: courseType,
      details: courseData.details,
      version: '1.0',
      versionDate: new Date().toISOString().split('T')[0],
      startDate: courseData.startDate,
      endDate: courseData.endDate,
      maxStudents: courseData.maxStudents,
      minStudents: courseData.minStudents,
      educationLevel: courseData.educationLevel,
      minAge: courseData.minAge,
      maxAge: courseData.maxAge,
      otherRequirements: courseData.otherRequirements,
      technologicalAxis: courseData.technologicalAxis,
      technologicalArea: courseData.technologicalArea,
      technologicalSegment: courseData.technologicalSegment,
      cbo: courseData.cbo,
    };
    localStorage.setItem('courseData', JSON.stringify(newCourseData));
    setCourseData(newCourseData);
    toast.success('Curso salvo com sucesso!');
    handleNext();
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const addOtherRequirement = () => {
    setCourseData({
      ...courseData,
      otherRequirements: [...courseData.otherRequirements, ''],
    });
  };

  const handleRequirementChange = (index, value) => {
    const updatedRequirements = courseData.otherRequirements.map((req, reqIndex) =>
      reqIndex === index ? value : req
    );
    setCourseData({
      ...courseData,
      otherRequirements: updatedRequirements,
    });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div>
            <FormControl fullWidth margin="normal">
              <InputLabel id="course-type-label">Tipo de Curso</InputLabel>
              <Select labelId="course-type-label" value={courseType} onChange={handleCourseTypeChange}>
                <MenuItem value="">
                  <em>Selecione o tipo de curso</em>
                </MenuItem>
                <MenuItem value="iniciacao">Iniciação Profissional</MenuItem>
                <MenuItem value="aperfeicoamento">Aperfeiçoamento Profissional</MenuItem>
                <MenuItem value="especializacao">Especialização Profissional</MenuItem>
              </Select>
            </FormControl>
            {courseType && (
              <TextField
                fullWidth
                margin="normal"
                label="Nome do Curso"
                value={courseName}
                onChange={handleCourseNameChange}
                error={!isNameValid}
                helperText={!isNameValid && 'O nome do novo curso deve ser diferente do original.'}
                //sx={{ borderColor: !isNameValid ? 'red' : 'initial', borderWidth: '1px', borderStyle: 'solid' }}
              />
            )}
            {suggestions.length > 0 && (
              <List>
                {suggestions.map((course) => (
                  <ListItem button key={course.id} onClick={() => handleSuggestionClick(course)}>
                    <ListItemText primary={`${course.name} - v.${course.version} ${course.versionDate}`} />
                  </ListItem>
                ))}
              </List>
            )}
            {courseType && courseName && (
              <TextField
                fullWidth
                margin="normal"
                label="Objetivo do Curso"
                value={courseData.details}
                onChange={(e) => setCourseData({ ...courseData, details: e.target.value })}
              />
            )}
            {courseType && courseName && (
              <Button onClick={handleOpenModal} style={{ marginTop: '10px' }}>
                Decreto Federal nº 5154/04 e Lei Federal nº 9394/96
              </Button>
            )}
          </div>
        );
      case 1:
        return (
          <div>
            <TextField
              fullWidth
              margin="normal"
              label="Data Inicial de Vigência"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={courseData.startDate}
              onChange={(e) => setCourseData({ ...courseData, startDate: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Data Final de Vigência"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={courseData.endDate}
              onChange={(e) => setCourseData({ ...courseData, endDate: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Nº Máximo de Alunos por Turma"
              type="number"
              inputProps={{ min: courseData.minStudents }}
              value={courseData.maxStudents}
              onChange={(e) => setCourseData({ ...courseData, maxStudents: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Nº Mínimo de Alunos por Turma"
              type="number"
              inputProps={{ max: courseData.maxStudents }}
              value={courseData.minStudents}
              onChange={(e) => setCourseData({ ...courseData, minStudents: e.target.value })}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="education-level-label">Escolaridade</InputLabel>
              <Select
                labelId="education-level-label"
                value={courseData.educationLevel}
                onChange={(e) => setCourseData({ ...courseData, educationLevel: e.target.value })}
              >
                <MenuItem value="">
                  <em>Selecione a escolaridade mínima</em>
                </MenuItem>
                <MenuItem value="Ensino Fundamental Incompleto">Ensino Fundamental Incompleto</MenuItem>
                <MenuItem value="Ensino Fundamental Completo">Ensino Fundamental Completo</MenuItem>
                <MenuItem value="Ensino Médio Incompleto">Ensino Médio Incompleto</MenuItem>
                <MenuItem value="Ensino Médio Completo">Ensino Médio Completo</MenuItem>
                <MenuItem value="Ensino Técnico">Ensino Técnico</MenuItem>
                <MenuItem value="Graduação">Graduação</MenuItem>
                <MenuItem value="Pós-graduação">Pós-graduação</MenuItem>
                <MenuItem value="Mestrado">Mestrado</MenuItem>
                <MenuItem value="Doutorado">Doutorado</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Idade Mínima"
              type="number"
              inputProps={{ min: courseData.minAge }}
              value={courseData.minAge}
              onChange={(e) => setCourseData({ ...courseData, minAge: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Idade Máxima"
              type="number"
              inputProps={{ max: courseData.maxAge }}
              value={courseData.maxAge}
              onChange={(e) => setCourseData({ ...courseData, maxAge: e.target.value })}
            />
            <Typography variant="h6" gutterBottom>
              Outros Requisitos
            </Typography>
            {courseData.otherRequirements.map((req, index) => (
              <TextField
                key={index}
                fullWidth
                margin="normal"
                label={`Requisito Adicional ${index + 1}`}
                value={req}
                onChange={(e) => handleRequirementChange(index, e.target.value)}
              />
            ))}
            <Button onClick={addOtherRequirement} style={{ marginTop: '10px', backgroundColor: 'white', color: '#1976d2', border: '1px solid #1976d2'}}>
              Adicionar Requisito
            </Button>
          </div>
        );
      case 2:
        return (
          <div>
            <TextField
              fullWidth
              margin="normal"
              label="Eixo Tecnológico"
              value={courseData.technologicalAxis}
              onChange={(e) => setCourseData({ ...courseData, technologicalAxis: e.target.value })}
              disabled
            />
            <TextField
              fullWidth
              margin="normal"
              label="Área Tecnológica"
              value={courseData.technologicalArea}
              onChange={(e) => setCourseData({ ...courseData, technologicalArea: e.target.value })}
              disabled
            />
            <TextField
              fullWidth
              margin="normal"
              label="Segmento de Área Tecnológica"
              value={courseData.technologicalSegment}
              onChange={(e) => setCourseData({ ...courseData, technologicalSegment: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="CBO (Código Brasileiro de Ocupações)"
              value={courseData.cbo}
              onChange={(e) => setCourseData({ ...courseData, cbo: e.target.value })}
            />
          </div>
        );
      default:
        return 'Passo desconhecido';
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
        {steps.map((label, index) => (
          <Step key={label} expanded={expanded === `panel${index}`}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Accordion expanded={expanded === `panel${index}`} onChange={handleAccordionChange(`panel${index}`)}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>{label}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {renderStepContent(index)}
                  {expanded === `panel${index}` && (
                    <Box sx={{ mt: 2 }}>
                      {activeStep !== 0 && (
                        <Button onClick={handleBack} sx={{ mr: 1 }}>
                          Voltar
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={index === steps.length - 1 ? handleSave : handleNext}
                      >
                        {index === steps.length - 1 ? 'Salvar' : 'Avançar'}
                      </Button>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Curso cadastrado com sucesso!
          </Typography>
          <Button onClick={handleReset}>Cadastrar Novo Curso</Button>
        </Box>
      )}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Decreto Federal nº 5154/04 e Lei Federal nº 9394/96
          </Typography>
          <Typography sx={{ mt: 2 }}>Texto do decreto e da lei aqui.</Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default CourseForm;

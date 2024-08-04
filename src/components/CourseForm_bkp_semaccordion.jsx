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
  Typography
} from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jsPDF } from 'jspdf';
import mockCourses from '../data/mockCourses';

const steps = ['Definição do Curso', 'Detalhes do Curso', 'Perfil Profissional', 'Resumo do curso'];

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
  const [isNameValid, setIsNameValid] = useState(true);

  useEffect(() => {
    if (courseName && mockCourses.some(course => course.type === courseType && course.name === courseName)) {
      setIsNameValid(false);
    } else {
      setIsNameValid(true);
    }
  }, [courseName, courseType]);


  const handleNext = () => {
    if (!isNameValid) {
      toast.error('O nome do curso deve ser diferente do original.');
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
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
              label="Número Máximo de Alunos"
              type="number"
              value={courseData.maxStudents}
              onChange={(e) => setCourseData({ ...courseData, maxStudents: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Número Mínimo de Alunos"
              type="number"
              value={courseData.minStudents}
              onChange={(e) => setCourseData({ ...courseData, minStudents: e.target.value })}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="education-level-label">Nível de Escolaridade</InputLabel>
              <Select
                labelId="education-level-label"
                value={courseData.educationLevel}
                onChange={(e) => setCourseData({ ...courseData, educationLevel: e.target.value })}
              >
                <MenuItem value="">
                  <em>Selecione o nível de escolaridade</em>
                </MenuItem>
                <MenuItem value="fundamental">Fundamental</MenuItem>
                <MenuItem value="medio">Médio</MenuItem>
                <MenuItem value="tecnico">Técnico</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Idade Mínima"
              type="number"
              value={courseData.minAge}
              onChange={(e) => setCourseData({ ...courseData, minAge: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Idade Máxima"
              type="number"
              value={courseData.maxAge}
              onChange={(e) => setCourseData({ ...courseData, maxAge: e.target.value })}
            />
            <Box mt={2}>
              <Typography>Outros Requisitos:</Typography>
              {courseData.otherRequirements.map((req, index) => (
                <TextField
                  key={index}
                  fullWidth
                  margin="normal"
                  value={req}
                  onChange={(e) => handleRequirementChange(index, e.target.value)}
                />
              ))}
            <Button onClick={addOtherRequirement} style={{ marginTop: '10px', backgroundColor: 'white', color: '#1976d2', border: '1px solid #1976d2'}}>
              Adicionar Requisito
            </Button>
            </Box>
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
            />
            <TextField
              fullWidth
              margin="normal"
              label="Área Tecnológica"
              value={courseData.technologicalArea}
              onChange={(e) => setCourseData({ ...courseData, technologicalArea: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Segmento Tecnológico"
              value={courseData.technologicalSegment}
              onChange={(e) => setCourseData({ ...courseData, technologicalSegment: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="CBO"
              value={courseData.cbo}
              onChange={(e) => setCourseData({ ...courseData, cbo: e.target.value })}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <Typography variant="h6">Resumo do Curso</Typography>
            <Typography>Nome do Curso: {courseName}</Typography>
            <Typography>Tipo de Curso: {courseType}</Typography>
            <Typography>Objetivo do Curso: {courseData.details}</Typography>
            <Typography>Data Inicial de Vigência: {courseData.startDate}</Typography>
            <Typography>Data Final de Vigência: {courseData.endDate}</Typography>
            <Typography>Número Máximo de Alunos: {courseData.maxStudents}</Typography>
            <Typography>Número Mínimo de Alunos: {courseData.minStudents}</Typography>
            <Typography>Nível de Escolaridade: {courseData.educationLevel}</Typography>
            <Typography>Idade Mínima: {courseData.minAge}</Typography>
            <Typography>Idade Máxima: {courseData.maxAge}</Typography>
            <Typography>Outros Requisitos:</Typography>
            <ul>
              {courseData.otherRequirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
            <Typography>Eixo Tecnológico: {courseData.technologicalAxis}</Typography>
            <Typography>Área Tecnológica: {courseData.technologicalArea}</Typography>
            <Typography>Segmento Tecnológico: {courseData.technologicalSegment}</Typography>
            <Typography>CBO: {courseData.cbo}</Typography>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: '20px' }}
              onClick={downloadPDF}
            >
              Baixar PDF
            </Button>
          </div>
        );
      default:
        return 'Unknown step';
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Resumo do Curso', 10, 10);
    doc.text(`Nome do Curso: ${courseName}`, 10, 20);
    doc.text(`Tipo de Curso: ${courseType}`, 10, 30);
    doc.text(`Objetivo do Curso: ${courseData.details}`, 10, 40);
    doc.text(`Data Inicial de Vigência: ${courseData.startDate}`, 10, 50);
    doc.text(`Data Final de Vigência: ${courseData.endDate}`, 10, 60);
    doc.text(`Número Máximo de Alunos: ${courseData.maxStudents}`, 10, 70);
    doc.text(`Número Mínimo de Alunos: ${courseData.minStudents}`, 10, 80);
    doc.text(`Nível de Escolaridade: ${courseData.educationLevel}`, 10, 90);
    doc.text(`Idade Mínima: ${courseData.minAge}`, 10, 100);
    doc.text(`Idade Máxima: ${courseData.maxAge}`, 10, 110);
    doc.text('Outros Requisitos:', 10, 120);
    courseData.otherRequirements.forEach((req, index) => {
      doc.text(`- ${req}`, 10, 130 + index * 10);
    });
    doc.text(`Eixo Tecnológico: ${courseData.technologicalAxis}`, 10, 140 + courseData.otherRequirements.length * 10);
    doc.text(`Área Tecnológica: ${courseData.technologicalArea}`, 10, 150 + courseData.otherRequirements.length * 10);
    doc.text(`Segmento Tecnológico: ${courseData.technologicalSegment}`, 10, 160 + courseData.otherRequirements.length * 10);
    doc.text(`CBO: ${courseData.cbo}`, 10, 170 + courseData.otherRequirements.length * 10);
    doc.save('Resumo_Curso.pdf');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              {renderStepContent(index)}
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={index === steps.length - 1 ? handleSave : handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finalizar' : 'Próximo'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Voltar
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Box sx={{ p: 3 }}>
          <Typography>Curso salvo com sucesso!</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Redefinir
          </Button>
        </Box>
      )}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2">
            Decreto Federal nº 5154/04 e Lei Federal nº 9394/96
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Decreto Federal nº 5154/04 e Lei Federal nº 9394/96 se referem às normas e diretrizes para a educação profissional e técnica no Brasil, estabelecendo parâmetros para a criação, organização e oferta de cursos técnicos e profissionais.
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default CourseForm;

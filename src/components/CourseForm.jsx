import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, List, ListItem, ListItemText } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import mockCourses from '../data/mockCourses';

const CourseForm = ({ courseType, setCourseType, courseName, setCourseName, setCourseData, courseData, handleNext }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isNameValid, setIsNameValid] = useState(true);

  useEffect(() => {
    if (courseName && courseData && courseName === courseData.name) {
      setIsNameValid(false);
    } else {
      setIsNameValid(true);
    }
  }, [courseName, courseData]);

  const handleCourseTypeChange = (e) => {
    setCourseType(e.target.value);
    setCourseName('');
    setCourseData(null);
    setSuggestions([]);
  };

  const handleCourseNameChange = (e) => {
    const value = e.target.value;
    setCourseName(value);

    if (value) {
      const filteredCourses = mockCourses.filter(course => course.type === courseType);
      const results = filteredCourses.filter(course => course.name.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (course) => {
    setCourseData(course);
    setCourseName(course.name);
    setSuggestions([]);
    toast.info('O nome do novo curso deve ser diferente do original.');
  };

  const handleSave = () => {
    if (courseName === courseData?.name) {
      toast.error('O nome do novo curso deve ser diferente do original.');
      setIsNameValid(false);
      return;
    }
    
    const newCourseData = { name: courseName, type: courseType, details: courseData?.details || '' };
    localStorage.setItem('courseData', JSON.stringify(newCourseData));
    setCourseData(newCourseData);
    toast.success('Curso salvo com sucesso!');
    handleNext();
  };

  return (
    <div style={{ padding: '20px' }}>
      <FormControl fullWidth margin="normal">
        <InputLabel id="course-type-label">Tipo de Curso</InputLabel>
        <Select
          labelId="course-type-label"
          value={courseType}
          onChange={handleCourseTypeChange}
        >
          <MenuItem value=""><em>Selecione o tipo de curso</em></MenuItem>
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
          helperText={!isNameValid && "O nome do novo curso deve ser diferente do original."}
          style={{ borderColor: isNameValid ? 'initial' : 'red' }}
        />
      )}
      
      {suggestions.length > 0 && (
        <List>
          {suggestions.map((course) => (
            <ListItem button key={course.id} onClick={() => handleSuggestionClick(course)}>
              <ListItemText primary={course.name} />
            </ListItem>
          ))}
        </List>
      )}
      
      {courseType && courseName && (
        <div style={{ marginTop: '20px' }}>
          <TextField
            fullWidth
            margin="normal"
            label="Detalhes do Curso"
            value={courseData?.details || ''}
            onChange={(e) => setCourseData({ ...courseData, details: e.target.value })}
          />
        </div>
      )}
      
      <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: '20px' }}>
        Salvar
      </Button>
    </div>
  );
};

CourseForm.propTypes = {
  courseType: PropTypes.string.isRequired,
  setCourseType: PropTypes.func.isRequired,
  courseName: PropTypes.string.isRequired,
  setCourseName: PropTypes.func.isRequired,
  setCourseData: PropTypes.func.isRequired,
  courseData: PropTypes.object,
  handleNext: PropTypes.func.isRequired,
};

export default CourseForm;

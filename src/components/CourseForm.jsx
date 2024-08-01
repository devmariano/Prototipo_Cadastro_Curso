import { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, List, ListItem, ListItemText } from '@mui/material';

const mockCourses = [
  { id: 1, name: 'Curso de Elétrica de automóveis', type: 'aperfeicoamento', details: 'Detalhes do curso de Elétrica de automóveis' },
  { id: 2, name: 'Curso de Elétrica geral', type: 'iniciacao', details: 'Detalhes do curso de Elétrica geral' },
  { id: 3, name: 'Curso de Elétrica de motos', type: 'especializacao', details: 'Detalhes do curso de Elétrica de motos' },
  { id: 4, name: 'Curso de React', type: 'aperfeicoamento', details: 'Detalhes do curso de React' },
  { id: 5, name: 'Curso de JavaScript', type: 'iniciacao', details: 'Detalhes do curso de JavaScript' },
  { id: 6, name: 'Curso de Phyton', type: 'aperfeicoamento', details: 'Detalhes do curso de Phyton' },
  { id: 7, name: 'Curso de C#', type: 'especializacao', details: 'Detalhes do curso de C#' },
];

const CourseForm = () => {
  const [courseType, setCourseType] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseData, setCourseData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const savedCourseData = localStorage.getItem('courseData');
    if (savedCourseData) {
      setCourseData(JSON.parse(savedCourseData));
    }
  }, []);

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
    setCourseName(course.name);
    setCourseData(course);
    setSuggestions([]);
  };

  const handleSave = () => {
    const newCourseData = { name: courseName, type: courseType, details: courseData?.details || '' };
    localStorage.setItem('courseData', JSON.stringify(newCourseData));
    setCourseData(newCourseData);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && suggestions.length === 0) {
      setCourseData({ name: courseName, type: courseType, details: '' });
    }
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
      <TextField
        fullWidth
        margin="normal"
        label="Nome do Curso"
        value={courseName}
        onChange={handleCourseNameChange}
        onKeyDown={handleKeyDown}
      />
      {suggestions.length > 0 && (
        <List>
          {suggestions.map((course) => (
            <ListItem button key={course.id} onClick={() => handleSuggestionClick(course)}>
              <ListItemText primary={course.name} />
            </ListItem>
          ))}
        </List>
      )}
      {courseData && (
        <div style={{ marginTop: '20px' }}>
          <TextField
            fullWidth
            margin="normal"
            label="Nome"
            value={courseData.name}
            onChange={(e) => setCourseData({ ...courseData, name: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Tipo"
            value={courseData.type}
            disabled
          />
          <TextField
            fullWidth
            margin="normal"
            label="Detalhes"
            value={courseData.details}
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

export default CourseForm;

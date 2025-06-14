const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/calculate', (req, res) => {
  const { subjectName, totalClasses, classesTaken, classesAttended } = req.body;
  
  // Convert to numbers
  const total = parseInt(totalClasses);
  const taken = parseInt(classesTaken);
  const attended = parseInt(classesAttended);
  
  // Calculate current percentage
  const currentPercentage = (attended / taken) * 100;
  
  // Calculate classes already bunked
  const classesBunked = taken - attended;
  
  // Calculate classes needed to reach 85%
  let classesToAttend = 0;
  
  if (currentPercentage < 85) {
    // Calculate remaining classes
    const remainingClasses = total - taken;
    
    // Calculate minimum classes needed to reach 85% overall
    const minClassesNeeded = (0.85 * total) - attended;
    
    // How many more classes to attend
    classesToAttend = Math.ceil(minClassesNeeded);
    
    // Make sure we don't exceed remaining classes
    classesToAttend = Math.min(classesToAttend, remainingClasses);
  }
  
  // Calculate classes that can be bunked while maintaining 85%
  const remainingClasses = total - taken;
  const classesCanBunk = Math.max(0, remainingClasses - classesToAttend);
  
  res.render('result', {
    subjectName,
    currentPercentage: currentPercentage.toFixed(2),
    classesToAttend: Math.max(0, classesToAttend),
    classesCanBunk: Math.max(0, classesCanBunk),
    classesBunked,
    classesTaken: taken
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});





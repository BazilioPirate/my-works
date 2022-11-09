document.addEventListener('DOMContentLoaded', function(){

  /* DATA BASE FILES */

  let formFieldsArray = [
    'name', 'surname', 'patronymic', 'birthDate', 'educationStartYear', 'faculty'
  ];

  let topicFieldsOfTable = {
    fullName: 'ФИО',
    faculty: 'Факультет',
    birthDate: 'Дата рождения',
    educationStartYear: 'Годы обучения'
  };

  let filtersFieldsArray = [
    'fullNameFilter', 'facultyFilter', 'educationStartYearFilter', 'educationLastYearFilter'
  ];

  let students = [];

  let timeoutId;


  /* FUNCTIONS FOR CREATE INPUTS FORM */

  function switchOfInputAttributes(name, item, label){
    switch(name){
      case 'name':
        item.setAttribute('placeholder', `Введите имя`);
        return label.textContent = `Имя:`;
      case 'surname':
        item.setAttribute('placeholder', `Введите фамилию`);
        return label.textContent = `Фамилия:`;
      case 'patronymic':
        item.setAttribute('placeholder', `Введите отчество `);
        return label.textContent = `Отчество:`;
      case 'fullNameFilter':
        item.setAttribute('placeholder', `Введите ФИО`);
        return label.textContent = 'ФИО:';
      case 'birthDate':
        item.setAttribute('placeholder', `Введите дату рождения `);
        return label.textContent = `Дата рождения:`;
      case 'educationStartYear':
      case 'educationStartYearFilter':
        item.setAttribute('placeholder', `Введите год начала обучения `);
        return label.textContent = `Год начала обучения:`;
      case 'educationLastYearFilter':
        item.setAttribute('placeholder', `Введите год конца обучения`);
        return label.textContent = 'Год конца обучения:';
      case 'faculty':
      case 'facultyFilter':
        item.setAttribute('placeholder', `Введите факультет `);
        return label.textContent = `Факультет:`;
    };
  };

  function changeNameStyle(item){
    let mySplits = item.split(/(?=[A-Z])/).join('-').toLowerCase();
    return mySplits;
  }

  function createDateInputsAttributes(name, item, label){
    label.setAttribute('for', `${name}`);
    if(name.toLowerCase().includes('date')){
      item.setAttribute('type', 'date');
    } else if(name.toLowerCase().includes('year')){
      item.setAttribute('type', 'number');
      item.setAttribute('maxlength', '4');
    } else{
      item.setAttribute('type', 'text');
    }
    return item, label;
  }

  function createInputs(input, cont, type){
    const fieldset = document.createElement('div');
    const label = document.createElement('label');
    let fieldName = input;
    input = document.createElement('input');

    fieldset.classList.add(`students__${type}-fieldset`);
    label.classList.add(`students__${type}-label`);
    input.classList.add(`students__${type}-input`,`students__${type}-${changeNameStyle(fieldName)}`);

    input.id = `${fieldName}`;

    switchOfInputAttributes(fieldName, input, label);
    createDateInputsAttributes(fieldName, input, label);

    fieldset.append(label);
    fieldset.append(input);
    cont.append(fieldset);

    return fieldset;
  }

  function createForm(){
    const form = document.createElement('form');
    const formHeading = document.createElement('h2');
    const inputsCont = document.createElement('div');
    const addButton = document.createElement('button');

    let inputClassName = 'form';

    formHeading.textContent = 'Журнал учета студентов';
    addButton.textContent = 'Добавить';

    form.classList.add('students__form');
    formHeading.classList.add('students__form-form-heading');
    inputsCont.classList.add('students__form-inputs-cont');
    addButton.classList.add('students__form-add-button');

    formFieldsArray.map(item => {
      createInputs(item, inputsCont, inputClassName);
    });
    form.append(formHeading);
    form.append(inputsCont);
    form.append(addButton);

    return {
      form,
      formHeading,
      inputsCont,
      addButton
    };
  };

  /* GET INPUTS VALUE */

  function getInputsValue(form){
    let name = form.name.value;
    let surname = form.surname.value;
    let patronymic = form.patronymic.value;
    let fullName = form.surname.value + ' ' + form.name.value + ' ' + form.patronymic.value;
    let educationStartYear = form.educationStartYear.value;
    let birthDate = form.birthDate.value;
    let faculty = form.faculty.value;

    return {
      name, surname, patronymic, fullName, birthDate, educationStartYear, faculty
    };
  };

  /* VALIDATE STUDENT FORM FIELDS */

  function validate(inputs, errorMessageCont){
    let errorCount = 0;
    let validateResult = validateAllStudentFormFields(inputs);

    for (let key in validateResult){
      if(validateResult[key] !== true){
        errorMessageCont.textContent += validateResult[key];
        errorCount++;
      };
    };

    return errorCount;
  }

  function validateAllStudentFormFields(form){
    let inputFieldFilled = verificationInputField(form);
    let birthDateFieldFilled = validateBirthDate(form.birthDate);
    let educationDateFieldFilled = validateStartEducationDate(form.educationStartYear);

    return {
      inputFieldFilled, birthDateFieldFilled, educationDateFieldFilled
    };
  };

  function verificationInputField(object){
    let erorsCount = 0;
    for (let key in object){
      if(object[key] === ''){
        erorsCount++;
      };
    };
    if (erorsCount > 0){
      return 'Заполните пожалуйста все пустые поля';
    }else{
      return true;
    };
  };

  function validateBirthDate(birthDate){
    let date = createBirthDate(birthDate);
    if(date.year >= 1900 && date.year <=2008){
      return true;
    }else{
      return ' Введите корректную дату рождения';
    };
  };

  function validateStartEducationDate(educationYear){
    if(educationYear >= '2000' && educationYear < 2022){
      return true;
    }else{
      return ' Введите корректную дату начала обучения';
    };
  };

  function clearErrorMessagesCont(errorMessageCont){
    let button = document.querySelector('.students__form-add-button');
    button.addEventListener('click', function(){
      errorMessageCont.textContent = '';
    });
  };

 /* ADD NEW STUDENT OBJECT TO ARRAY */

 function addStudCalcTable(form){
  let student = {
    fullName: form.surname + ' ' + form.name + ' ' + form.patronymic,
    faculty: form.faculty,
    birthDate: form.birthDate,
    age: calculateAge(form.birthDate),
    educationStartYear: Number(form.educationStartYear),
    educationLastYear: calculateEducationEndYear(form.educationStartYear)
  };
  if(student.fullName !== 'ФИО'){
    students.push(student);
  }
  return student;
};

 /* CALCULATE FUNCTIONS */

  function createBirthDate(birthDate){
    let birthArray = birthDate.split('-');
    let year = Number(birthArray[0]);
    let month = Number(birthArray[1]);
    let day = Number(birthArray[2]);
    return {
      year, month, day
    };
  };

  function calculateAge(birthDate){
    let bdate = createBirthDate(birthDate);
    let bday = bdate.year + '.' + bdate.month + '.' + bdate.day;
    let age = Math.floor((new Date().getTime() - new Date(bday))/(24 * 3600 * 365.25 * 1000));
    return age;
  };

  function calculateEducationYears(educationStartYear){
    let educationLastYear = Number(educationStartYear) + 4;
    return `${educationStartYear} - ${educationLastYear} (${calculateCourseNumber(educationStartYear)})`;
  };

  function calculateEducationEndYear(educationStartYear){
    let educationLastYear = Number(educationStartYear) + 4;
    return educationLastYear;
  };

  function calculateCourseNumber(startYear){
    let todayDate = new Date();
    let todayYear = todayDate.getFullYear();

    if(todayYear - startYear > 4){
      return 'закончил';
    }else{
      return `${todayYear - startYear} курс`;
    };
  };

 /* CREATE STUDENTS TABLE */

 function renderApp(inputs, event){
  let sorting = getSortElements();
  let filteredInputsArray = getFilterElements();
  let sortCount = 0;

  showHiddenHeading();
  showHiddenFilters();
  addStudCalcTable(inputs);
  addRowToTable(inputs);
  for (let key in filteredInputsArray){
    filteredInputsArray[key].addEventListener('input', function () {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        filterTable(filteredInputsArray);
      }, 500);
    });
  };
  for(let key in sorting){
    sortTable(sorting[key], sortCount, students);
  };
  event.reset();
 }

 function createTable(form){
  const table = document.createElement('div');
  const body = document.createElement('div');
  const header = document.createElement('div');
  const headerRow = createRow(form);

  table.classList.add('students__table');
  header.classList.add('students__table-header');
  body.classList.add('students__table-body');

  header.append(headerRow);
  table.append(header);
  table.append(body);

  return table;
};

  function addRowToTable(form){
    let row = createRow(form);
    let body = document.querySelector('.students__table-body');
    body.append(row);
    return body;
  }

  function createRow(form){
    const row = document.createElement('div');
    const fullNameCont = document.createElement('div');
    const facultyCont = document.createElement('div');
    const birthDateCont = document.createElement('div');
    const yearsOfEducation = document.createElement('div');

    (form.fullName === 'ФИО') ? createHeaderAttributes(form, row, fullNameCont, facultyCont, birthDateCont, yearsOfEducation) : createRowAttributes(form, row, fullNameCont, facultyCont, birthDateCont, yearsOfEducation);

    row.append(fullNameCont);
    row.append(facultyCont);
    row.append(birthDateCont);
    row.append(yearsOfEducation);
    return row;
  };

 function createHeaderAttributes(form, row, fullNameCont, facultyCont, birthDateCont, yearsOfEducation){
    row.classList.add('students__table-row-heading', 'display-none');
    fullNameCont.classList.add('students__table-cols', 'students__full-name-heading');
    facultyCont.classList.add('students__table-cols', 'students__faculty-heading');
    birthDateCont.classList.add('students__table-cols', 'students__birth-date-heading');
    yearsOfEducation.classList.add('students__table-cols', 'students__education-years-heading');

    fullNameCont.id = `fullName`;
    facultyCont.id = `faculty`;
    birthDateCont.id = `birthDate`;
    yearsOfEducation.id = `educationStartYear`;

    fullNameCont.textContent = form.fullName;
    facultyCont.textContent = form.faculty;
    birthDateCont.textContent = form.birthDate;
    yearsOfEducation.textContent = form.educationStartYear;

    return {form, row, fullNameCont, facultyCont, birthDateCont, yearsOfEducation};
  };

  function createRowAttributes(form, row, fullNameCont, facultyCont, birthDateCont, yearsOfEducation){
    row.classList.add('students__table-row');
    fullNameCont.classList.add('students__table-cols', 'students__table-full-name');
    facultyCont.classList.add('students__table-cols', 'students__table-faculty');
    birthDateCont.classList.add('students__table-cols', 'students__table-birth-date');
    yearsOfEducation.classList.add('students__table-cols', 'students__table-education-years');

    fullNameCont.textContent = form.fullName;
    facultyCont.textContent = form.faculty;

    birthDateCont.textContent = form.birthDate + ' (' + calculateAge(form.birthDate) + ' лет)';
    yearsOfEducation.textContent = `${calculateEducationYears(form.educationStartYear)}`;

    return {form, row, fullNameCont, facultyCont, birthDateCont, yearsOfEducation};
  }

  function showHiddenHeading(){
    let row = document.querySelector('.students__table-row-heading');
    row.classList.remove('display-none');
  };

  function showHiddenFilters(){
    let filterList = document.querySelector('.students__filter-list');
    filterList.classList.remove('display-none');
  };

 /* FILTER MODE */

 function getFilterElements(){
  const fullName = document.querySelector('#fullNameFilter');
  const faculty = document.querySelector('#facultyFilter');
  const educationStartYear = document.querySelector('#educationStartYearFilter');
  const educationLastYear = document.querySelector('#educationLastYearFilter');

  return{
    fullName, faculty, educationStartYear, educationLastYear
  };
};

  function createFiltersForm(){
    const filterCont = document.createElement('div');
    const heading = document.createElement('h2');
    let inputClassName = 'filter';

    filterCont.classList.add('students__filter-list', 'display-none');
    heading.classList.add('students__filter-heading');

    heading.textContent = 'Поиск:';

    filterCont.append(heading);

    filtersFieldsArray.map(item => {
      createInputs(item, filterCont, inputClassName);
    });
    return filterCont;
  };

  function filterTable(array){
    const filteredArray = students.filter((student)=>{
      let result = true;

      if(array.fullName.value && !student.fullName.toLowerCase().includes(array.fullName.value.toLowerCase())){
        result = false;
      };
      if(array.faculty.value && !student.faculty.toLowerCase().includes(array.faculty.value.toLowerCase())){
        result = false;
      };
      if(array.educationStartYear.value && student.educationStartYear != array.educationStartYear.value){
        result = false;
      };
      if(array.educationLastYear.value && student.educationLastYear != array.educationLastYear.value){
        result = false;
      };
      return result;
    });
    clearTable();
    renderFilteredTable(filteredArray);
  };

  function clearTable(){
    const body = document.querySelector('.students__table-body');
    // const header = document.querySelector('.students__table-header');
    // header.textContent = '';
    body.textContent = '';
    return body;
  };

  function renderFilteredTable(array){
    let sorting = getSortElements();
    let sortCount = 0;
    array.forEach(function(student){
      addRowToTable(student);
    });
    for(let key in sorting){
      sortTable(sorting[key], sortCount, array);
    };
  };

 /* SORTING */

 function getSortElements(){
   const fullName = document.querySelector('.students__full-name-heading');
   const faculty = document.querySelector('.students__faculty-heading');
   const birthDate = document.querySelector('.students__birth-date-heading');
   const educationStartYear = document.querySelector('.students__education-years-heading');

   return{
     fullName, faculty, birthDate, educationStartYear
   };
 };

  function sortTable(item, sortCount, array){
    item.addEventListener('click', function(){
      clearTable();
      let sortArray;
      if(sortCount == 1){
        sortArray = array.slice().sort(compareValues(item.id, 'desc'));
        sortArray.forEach(function(item){
          addRowToTable(item);
        });
        return sortCount = 0;
      } else if(sortCount == 0){
        sortArray = array.slice().sort(compareValues(item.id));
        sortArray.forEach(function(item){
          addRowToTable(item);
        });
        return sortCount++;
      };
    });
  };

  function compareValues(key, order='asc') {
    return function(first, second) {
      if(!first.hasOwnProperty(key) || !second.hasOwnProperty(key)) {
          return 0;
      }

      const firstVar = (typeof first[key] === 'string') ?
      first[key].toUpperCase() : first[key];
      const secondVar = (typeof second[key] === 'string') ?
      second[key].toUpperCase() : second[key];

      let comparison = 0;
      if (firstVar > secondVar) {
        comparison = 1;
      } else if (firstVar < secondVar) {
        comparison = -1;
      }
      return (
        (order == 'desc') ? (comparison * -1) : comparison
      );
    };
  };

 /* CREATE APP */

  function createApp(){
    const container = document.getElementById('students-book');
    const errorMessageCont = document.createElement('div');
    let studentsForm = createForm();
    let filterForm = createFiltersForm();
    let tableHeading = createTable(topicFieldsOfTable);

    errorMessageCont.classList.add('students__error-message');

    container.append(studentsForm.form);
    container.append(errorMessageCont);
    container.append(filterForm);
    container.append(tableHeading);

    clearErrorMessagesCont(errorMessageCont);

    studentsForm.form.addEventListener('submit', function(e){
      e.preventDefault();
      let inputs = getInputsValue(studentsForm.form);
      let valResult = validate(inputs, errorMessageCont);

      (valResult === 0) ? renderApp(inputs, e.target) : false;
    });
  };
  createApp();
});

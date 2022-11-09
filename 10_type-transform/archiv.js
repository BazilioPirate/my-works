/*
  function createForm(){
    let form = document.createElement('form');
    let formHeading = document.createElement('h2');
    let inputsCont = document.createElement('div');
    let name = document.createElement('input');
    let surname = document.createElement('input');
    let patronymic = document.createElement('input');
    let birthDate = document.createElement('input');
    let startOfEducationYear = document.createElement('input');
    let faculty = document.createElement('input');
    let addButton = document.createElement('button');

    formHeading.textContent = 'Журнал учета студентов';
    addButton.textContent = 'Добавить';

    form.classList.add('students__form');
    formHeading.classList.add('students__form-formHeading');
    inputsCont.classList.add('students__form-inputsCont');
    name.classList.add('students__form-name');
    surname.classList.add('students__form-surname');
    patronymic.classList.add('students__form-patronymic');
    birthDate.classList.add('students__form-birthDate');
    startOfEducationYear.classList.add('students__form-startOfEducationYear');
    faculty.classList.add('students__form-faculty');
    addButton.classList.add('students__form-addButton');

    inputsCont.append(name);
    inputsCont.append(surname);
    inputsCont.append(patronymic);
    inputsCont.append(birthDate);
    inputsCont.append(startOfEducationYear);
    inputsCont.append(faculty);

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
 */

  let student = {
    lastName: form.surname + ' ' + form.name + ' ' + form.patronymic,
    faculty: form.faculty,
    birthDate: form.birthDate,
    age: calculateAge(form.birthDate),
    educationYears: calculateEducationYears(form.startOfEducationYear),
    courseNumber: calculateCourseNumber(form.startOfEducationYear)
  }

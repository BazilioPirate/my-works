//Задание № 1

let passRep = ["Test-1", "1234-", "4321_", "qaz-xsw", "_zxd", "_-a", "qaz", "_-3", "123456789"];

passRep.forEach(function(item){
  validate(item);
});

function validate(password){
  if (password.length>=4 && (password.includes('-')|| password.includes('_'))){
    console.log('Пароль надёжный');
  }else{
    console.log("Пароль недостаточно надёжный");
  };

  // (password.length >= 4 && (password.includes('-')|| password.includes('_'))) ? console.log('Пароль надёжный') : console.log("Пароль недостаточно надёжный");
};







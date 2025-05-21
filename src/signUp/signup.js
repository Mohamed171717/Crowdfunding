

// let form = document.querySelector(".form-section");
let username = document.querySelector('#name');
  let email = document.querySelector('#email');
  let pass = document.querySelector('#pass');
  // let role = document.querySelector('.type');
  // let role = document.querySelector('input[type="radio"]:checked');
  let form = document.getElementById('signup-form');
  let link=document.querySelector('.link');
  let invalidName=document.querySelector(".invalidName");
  let invalidEmail=document.querySelector(".invalidEmail");
  let invalidpass=document.querySelector(".invalidpass");
username.addEventListener('blur',function(e){
if (!isNameValid(this.value)){
invalidName.style.display="block";
this.style.setProperty("border", "1px solid red");
// this.select();
}else{
      this.style.border="1px solid green"
      invalidName.style.display="none";
}
});
email.addEventListener('blur',function(){
  if(!isEmailValid(this.value)){
    invalidEmail.style.display="block";
this.style.setProperty("border", "1px solid red");
  }else{
      this.style.border="1px solid green"
      invalidEmail.style.display="none";
}
});
pass.addEventListener("blur",function(){
    if (this.value.length<5){
       invalidpass.style.display="block";
this.style.setProperty("border", "1px solid red");
    }else{
      this.style.border="1px solid green"
      invalidpass.style.display="none";
}
});
form.addEventListener('submit', function (e) {
  e.preventDefault(); 
  const role = form.role.value;
  console.log(role);
  
  signUp(username.value, email.value, pass.value, role);
});

async function signUp(name, email, password, role) {
  try {

    let checkEmail=await fetch(`http://localhost:3000/users?email=${email}`);
    const existEmail=await checkEmail.json();
    // console.log(check);
    if(existEmail.length>0){
      alert('this email already exist');
      return;
    }
    let checkName=await fetch(`http://localhost:3000/users?name=${name}`);
    let existName=await checkName.json();
    if(existName.length>0){
      alert('this userName already exist');
      return;
    }
    await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        role,
        isActive: true,
        isApprovedRole: false,
        email,
        password,
        
      })
    });

  } catch (e) {
    console.error("Error in fetch:", e);
    alert("There was an error");
  }
}

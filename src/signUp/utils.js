const isNameValid=(n)=>{
    let pattern=/^[a-zA-Z]{3,}([_ .][a-zA-Z0-9])?$/;
    return pattern.test(n);
}

const isEmailValid=(e)=>{
let emailPattern = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
return emailPattern.test(e);
}
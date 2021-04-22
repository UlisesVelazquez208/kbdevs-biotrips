const validate = (val,rules) =>{
    let isValid = true;
    for(let rule in rules){
        switch(rule){
            case 'isEmail':
            isValid = isValid && emailValidator(val);
            break;

            case 'required':
            isValid = isValid && requiredValidator(val);
            break;
                        
            default:
            isValid =true;
        }
    }
    return isValid;
}
const requiredValidator = (val) =>{
    
    return  val != '';
}

const emailValidator = val =>{
    return  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(val)
}


export default validate;
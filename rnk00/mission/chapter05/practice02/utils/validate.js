const emailPattern = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;

function validate(values) {
    const errors = {
        email: '',
        password: '',
    }

    if(emailPattern.test(values.email) === false) {
        errors.email = '올바른 이메일 형식이 아닙니다. 다시 확인해주세요!';
    }

    if(values.password && values.password.length < 8) {
        errors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    if(values.password && values.password.length > 16) {
        errors.password = '비밀번호는 16자 이하여야 합니다.';
    }

    return errors;
}

export function validateLogin(values) {
    return validate(values);
} 

export function validateSignup(values) {
    const errors = validate(values);

    if(values.password !== values.passwordCheck) {
        errors.passwordCheck = '비밀번호가 일치하지 않습니다.';
    }

    return errors;
} // login이랑 signup 비밀번호 일치하는지 확인하는 거 빼빼고 다 똑같음

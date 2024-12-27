import * as S from './login.style.js';
import useForm from '../../hooks/useForm';
import {validateLogin} from '../../../utils/validate';

const LoginPage = () => {
    const login = useForm({
        initialValue: { email: '', password: '' },
        validate: validateLogin
    });

    const onSubmit = (event) => {
        event.preventDefault();
        if (!login.errors.email && !login.errors.password) {
            console.log('폼 데이터 제출');
            console.log(login.values);
        }
    };

    return (
        <S.FormContainer onSubmit={onSubmit}>
            <S.Input 
                error={login.touched.email && login.errors.email}
                type="email" 
                placeholder="이메일을 입력해주세요!"
                {...login.getTextInputProps('email')} // value, onChange, onBlur를 한번에 전달
            />
            {login.touched.email && login.errors.email && <S.Err>{login.errors.email}</S.Err>}

            <S.Input 
                error={login.touched.password && login.errors.password}
                type="password" 
                placeholder="비밀번호를 입력해주세요!"
                {...login.getTextInputProps('password')}
            />
            {login.touched.password && login.errors.password && <S.Err>{login.errors.password}</S.Err>}

            <S.Submit type="submit" disabled={!!login.errors.email || !!login.errors.password}>로그인</S.Submit>
        </S.FormContainer>
    );
};

export default LoginPage;

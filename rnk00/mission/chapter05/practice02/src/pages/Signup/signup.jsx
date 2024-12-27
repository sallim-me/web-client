import * as S from './signup.style';
import useForm from '../../hooks/useForm';
import {validateSignup} from '../../../utils/validate';

const SignupPage = () => {
    const signup = useForm({
        initialValue: { email: '', password: '', passwordCheck: '' },
        validate: validateSignup
    });

    const onSubmit = (event) => {
        event.preventDefault(); // 기본 동작 취소
        if (!signup.errors.email 
            && !signup.errors.password 
            && !signup.errors.passwordCheck) {
            console.log('이메일, 패스워드, 패스워드 체크 문제 없음.');
            console.log(signup.values);
        }
    };

    return (
        <S.FormContainer onSubmit={onSubmit}>
            <S.Input 
                error={signup.touched.email && signup.errors.email}
                // 터치가 되었고 에러가 발생한 경우 true
                type="email" 
                placeholder="이메일을 입력해주세요!"
                {...signup.getTextInputProps('email')}
            />
            {signup.touched.email && signup.errors.email && <S.Err>{signup.errors.email}</S.Err>}
            {/* 터치가 됐고 에러가 발생하면 에러 메세지를 띄운다*/}

            <S.Input
                error={signup.touched.password && signup.errors.password} 
                type="password" 
                placeholder="비밀번호를 입력해주세요!"
                {...signup.getTextInputProps('password')}
            />
            {signup.touched.password && signup.errors.password && <S.Err>{signup.errors.password}</S.Err>}


            <S.Input
                error={signup.touched.passwordCheck && signup.errors.passwordCheck}
                type="password" 
                placeholder="비밀번호를 입력해주세요!"
                {...signup.getTextInputProps('passwordCheck')}
            />
            {signup.touched.passwordCheck && signup.errors.passwordCheck && <S.Err>{signup.errors.passwordCheck}</S.Err>}

            <S.Submit 
                type="submit" 
                disabled={!!signup.errors.email || !!signup.errors.password || !!signup.errors.passwordCheck}
            >회원가입</S.Submit>

        </S.FormContainer>
    );
};

export default SignupPage;

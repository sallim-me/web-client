import {useForm} from 'react-hook-form'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import * as S from './login.style'

const LoginPage = () => {
    const schema = yup.object().shape({
        email: yup.string().email("올바른 이메일 형식을 입력하세요.").required("이메일은 필수 입력 항목입니다."),
        password: yup
            .string()
            .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
            .max(16, "비밀번호는 최대 16자 이하여야 합니다.")
            .required("비밀번호는 필수 입력 항목입니다."),
    });

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange', // 입력 변경마다 유효성 검사
    });

    const onSubmit = (data) => {
        console.log('폼 데이터 제출')
        console.log(data);
    }

    return (
        <S.FormContainer onSubmit={handleSubmit(onSubmit)}>
            <h2>로그인</h2>
            <S.Input placeholder="이메일" {...register("email")}/>
            <S.Err>{errors.email?.message}</S.Err>
            <S.Input placeholder="패스워드" {...register("password")}/>
            <S.Err>{errors.password?.message}</S.Err>
            <S.Submit>로그인</S.Submit>
        </S.FormContainer>
    );
};

export default LoginPage;

import { useEffect, useState } from "react";

function useForm({initialValue, validate}) {
    const [values, setValues] = useState(initialValue); // 입력값
    const [touched, setTouched] = useState({}); // 포커스를 잃었는지 추적
    const [errors, setErrors] = useState({}); // 유효성 검사 오류 메세지

    const handleChangeInput = (name, value) => {
        setValues({
            ...values, // values 객체의 모든 속성을 새로운 객체로 복사
            [name]: value, // name에 해당하는 value를 바꿈
        });
    }

    const handleBlur = (name) => {
        setTouched({
            ...touched,
            [name]: true,
        });
    }

    const getTextInputProps = (name) => {
        const value = values[name];
        const onChange = (e) => {
            handleChangeInput(name, e.target.value);
        } // 값이 바뀌면 handleChangeInput 호출출
        const onBlur = () => {
            handleBlur(name);
        }

        return { value, onChange, onBlur };
    }

    useEffect(() => {
        const newErrors = validate(values);
        setErrors(newErrors);
    }, [validate, values]); // values가 바뀔 때마다 유효성 검사

    return { values, errors, touched, getTextInputProps };
}

export default useForm;
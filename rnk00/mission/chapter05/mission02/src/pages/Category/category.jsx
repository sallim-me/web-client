import {Link} from 'react-router-dom';
import * as S from './category.style';

const categories = [
    { name: "현재 상영중인", path: "now-playing" },
    { name: "인기있는", path: "popular" },
    { name: "높은 평가를 받은", path: "top-rated" },
    { name: "개봉 예정중인", path: "up-coming" },
];

const CategoryPage = () => {
    return (
        <S.CategoryContainer>
            {categories.map((category) => (
                <Link key={category.path} to={`/movie/${category.path}`}> 
                {/*movie 앞에 /가 있어야 상대경로로 취급된다. / 없으면 movie가 두 번 주소에 들어감*/}
                    <S.CategoryBox>
                        <p>{category.name}</p>
                    </S.CategoryBox>
                </Link>
            ))}
        </S.CategoryContainer>
    )
}

export default CategoryPage;

//category에서 path는 어떻게 설정되는 거지%%%

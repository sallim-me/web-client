import {Outlet} from 'react-router-dom'; 
import Sidebar from '../components/Sidebar/sidebar';
import * as S from './root-layout.style';

const RootLayout = () => {
    return (
        <>
            <S.StyledNavbar/> {/*네비게이션 바*/}

            <S.LayoutContainer>
                <Sidebar/> {/*사이드 바*/}

                <S.Content>
                    <Outlet/> {/*자식 컴포넌트 들어갈 자리*/}
                </S.Content>
            </S.LayoutContainer>
        </>
    );
};

export default RootLayout;

//Sidebar는 여기서 하는데 왜 Navbar는 style에서 하지%%%
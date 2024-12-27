import {Link} from 'react-router-dom';
import {FaSearch, FaFilm} from 'react-icons/fa'; 
import * as S from './sidebar.style'

const Sidebar = () => {
    return (
        <S.SidebarContainer>
            <S.Menu>
                <S.MenuItem>
                    <FaSearch/> {/*아이콘*/}
                    <Link to="/search">찾기</Link>
                </S.MenuItem>
                <S.MenuItem>
                    <FaFilm/> {/*아이콘*/}
                    <Link to="/movie">영화</Link>
                </S.MenuItem>
            </S.Menu>
        </S.SidebarContainer>
    )
}

export default Sidebar;
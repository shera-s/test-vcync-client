import { useSelector } from 'react-redux';
import { Navigate } from "react-router";


const UserPrivateRoute = ({children}) => {
    const user = useSelector((state) => Object.values(state.user)[0])
    // console.log(user);

    return user ? children : <Navigate to="/login" />
}

export default UserPrivateRoute
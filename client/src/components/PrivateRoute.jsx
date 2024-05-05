import {useSelector} from 'react-redux';
import {Navigate} from  'react-router-dom'

const PrivateRoute = ({children}) => {
    const {token} = useSelector((state) => state.user)
  
    if(token !== null){
        return children
    }else{
        return <Navigate to ="/auth"/>
    }
}

export default PrivateRoute

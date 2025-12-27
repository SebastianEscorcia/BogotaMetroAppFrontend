import { useNavigate } from "react-router-dom";


export const useNavigateTo = () => {

    const navigate = useNavigate();

    const goTo = (patch) => {
        navigate(patch)
    }

    return {goTo};
};

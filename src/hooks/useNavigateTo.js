import { useNavigate } from "react-router-dom";

export const useNavigateTo = () => {
  const navigate = useNavigate();

  const goTo = (path, options = {}) => {
    navigate(path, options);
  };

  return { goTo };
};

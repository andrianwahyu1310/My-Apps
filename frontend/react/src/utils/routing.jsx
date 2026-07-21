import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const GitHubPagesRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const redirect = sessionStorage.redirect;
    if (redirect) {
      const target = redirect.replace(window.location.origin, "");
      sessionStorage.removeItem("redirect");
      navigate(target, { replace: true });
    }
  }, [navigate, location]);

  return null;
};

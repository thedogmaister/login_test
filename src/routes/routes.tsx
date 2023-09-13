import React, { ReactElement, useEffect } from "react";
import {
  BrowserRouter,
  Link,
  Navigate,
  useNavigate,
  useRoutes,
} from "react-router-dom";
import Login from "../components/auth/Login";
import Home from "../components/Home/Home";
import { getSession } from "../utils/auth";
import { of } from "rxjs";
import { catchError } from "rxjs/operators";
const RoutesHook = () => {
  const element = useRoutes([
    {
      path: "/web",
      element: (
        <Authorization>
          <Home />
        </Authorization>
      ),
      children: [
        {
          index: true,
          element: <div>Index</div>,
        },
        {
          path: "/web/create-user",
          element: <div>Create element</div>,
        },
      ],
    },
    { path: "login", element: <Login /> },
    { path: "guest", element: <div>guest</div> },
  ]);

  return element;
};

const RoutesCustom = () => {
  return (
    <React.Fragment>
      <BrowserRouter>
        <RoutesHook />
      </BrowserRouter>
    </React.Fragment>
  );
};

export default RoutesCustom;

const Authorization = ({
  children,
}: {
  children?: ReactElement | ReactElement[];
}) => {
  const navigate = useNavigate();
  // const functionToken = () => {
  //   return null;
  // };

  // const token = functionToken();
  // if (!token) {
  //   return <Navigate to={"/login"} />;
  // }

  useEffect(() => {
    getSession()
      .pipe(
        catchError((err) => {
          return of(err);
        })
      )
      .subscribe((value) => {
        if (value.code === 403) {
          navigate("/login");
        }
      });
  }, [navigate]);

  return <React.Fragment>{children}</React.Fragment>;
};

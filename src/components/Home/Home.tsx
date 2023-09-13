import { Button } from "primereact/button";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { logout } from "../../utils/auth";

const Home = () => {
  return (
    <React.Fragment>
      <nav style={{ margin: 10 }}>
        <Link to="/web/create-user" style={{ padding: 10 }}>
          Create User
        </Link>
        {/* <a href="/learn">Learnhref</a> */}
        <Button style={{ height: "auto" }} onClick={logout} label="logout" />
      </nav>

      <Outlet />
    </React.Fragment>
  );
};

export default Home;

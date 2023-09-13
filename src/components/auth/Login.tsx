import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormGroup,
  WControlData,
  WForm,
  WFormControl,
  useFormConfig,
} from "rectangular-forms";
import { Container } from "./Login.styled";
// import { getRestSample } from "../utils/restApiUtils";
import { RestApi } from "../../utils/restApi";
import { authenticate, setCurrentToken } from "../../utils/auth";
import { catchError } from "rxjs/operators";
import { of } from "rxjs";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // const [dataS, setDataS] = useState<any>(null);
  const navigate = useNavigate();
  const formConfig = useFormConfig({
    createForm: (data) => {
      const form = new FormGroup({
        username: new FormControl(),
        password: new FormControl(),
      });
      form.patchValue(data);
      return form;
    },
    onSubmit: (form) => {
      const { username, password } = form.value;
      authenticate(username, password)
        .pipe(
          catchError((err) => {
            return of(err);
          })
        )
        .subscribe((value) => {
          if (value.code !== "UserNotFoundException") {
            setCurrentToken(value.accessToken.jwtToken);
            navigate("/web");
          }
        });
    },
  });

  const { loadSucceed } = formConfig;

  useEffect(() => {
    loadSucceed({
      username: "",
      password: "",
    });
  }, [loadSucceed]);

  return (
    <React.Fragment>
      <Container>
        {/* <pre>{JSON.stringify(dataS, null, 2)}</pre> */}
        <WForm formConfig={formConfig}>
          {/* <WControlData /> */}

          <WFormControl name="username">
            {({ control }) => {
              const { value, onChange, onBlur, disabled } = control;
              return (
                <div style={{ margin: "10px 0px 10px 0px" }}>
                  <label>Username</label>
                  <InputText
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                  />
                </div>
              );
            }}
          </WFormControl>
          <WFormControl name="password">
            {({ control }) => {
              const { value, onChange, onBlur, disabled } = control;
              return (
                <div style={{ margin: "10px 0px 10px 0px" }}>
                  <label>Password</label>
                  <Password
                    feedback
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                  />
                </div>
              );
            }}
          </WFormControl>
          <Button label="Login" />
        </WForm>
      </Container>
    </React.Fragment>
  );
};

export default Login;

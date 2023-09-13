import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import { from } from "rxjs";

const poolData = {
  UserPoolId: import.meta.env.VITE_USER_POOL_ID || "",
  ClientId: import.meta.env.VITE_CLIENT_ID || "",
};

const USER_POOL = new CognitoUserPool(poolData);

export const authenticate = (Username: string, Password: string) => {
  // return from(new Promise((resolve, reject) => {
  //     fetch("/bsackend_login", {method: "POST", headers: {'Content-Type': 'application/json'}}).then((resp) => resp.json())
  //     .then(data => {
  //         localStorage.setItem("token", data.token)
  //         sessionStorage.setItem("token", data.token)
  //         resolve({
  //             accessToken: {
  //                 jswtToken: ""
  //             }
  //         })
  //     })
  // })

  return from(
    new Promise((resolve, reject) => {
      const user = new CognitoUser({ Username, Pool: USER_POOL });
      const authDeatiails = new AuthenticationDetails({ Username, Password });
      user.setAuthenticationFlowType("USER_SRP_AUTH");
      user.authenticateUser(authDeatiails, {
        onSuccess: (data) => {
          resolve({ user, ...data });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    })
  );
};

export const getSession = () => {
  return from(
    new Promise((resolve, reject) => {
      const user = USER_POOL.getCurrentUser();
      if (user) {
        user.getSession((err: Error, session: any) => {
          if (err) {
            reject(err);
          } else {
            const refreshToken = session.getRefreshToken();
            user.refreshSession(refreshToken, (refreshErr, refresSession) => {
              if (refreshErr) {
                reject({ code: 403, message: "SESSION EXPIRED" });
              } else {
                sessionStorage.setItem(
                  "exp",
                  refresSession.idToken.payload.exp
                );
                resolve({ user, ...refresSession });
              }
            });
          }
        });
      } else {
        reject({ code: 403, message: "SESSION EXPIRED" });
      }
    })
  );
};

export const logout = () => {
  const user = USER_POOL.getCurrentUser();
  if (user) {
    user.signOut();
    closeSession();
  }
};

export const closeSession = () => {
  localStorage.removeItem("accessToken");
  window.location.href = "/login";
};

export const setCurrentToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};

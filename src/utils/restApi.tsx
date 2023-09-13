import { catchError, retry } from "rxjs/operators";
import { AjaxError, ajax } from "rxjs/ajax";
import { of } from "rxjs";
// export const getRestSample = () => {
//   return ajax.getJSON("https://api.github.com/users?per_page=5").pipe(
//     catchError((err: any) => {
//       return of(err);
//     })
//   );
// };

export class RestApi {
  static get = <T = any,>(url: string, headers?: Record<string, string>) => {
    return ajax.getJSON<T>(url, { ...(headers || {}), Bearer: "{token}" }).pipe(
      retry({ count: 2, delay: 2000 }),
      catchError((err: AjaxError) => {
        return of(err);
      })
    );
  };
}

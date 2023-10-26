import * as msal from "@azure/msal-browser";
import pkg from "../../package.json";
import { router } from "../router";

const TENANT_ID = import.meta.env.VITE_AZURE_COSMOSDB_TENANT_ID;
const CLIENT_ID = import.meta.env.VITE_AZURE_COSMOSDB_CLIENT_ID;

// Add here scopes for id token to be used at MS Identity Platform endpoints.
const loginRequest: msal.SilentRequest = {
  scopes: [
    // 'https://storage.azure.com/.default',
    // 'https://cosmos.azure.com/user_impersonation',
  ],
  forceRefresh: false, // Set this to "true" to skip a cached token and go to the server to get a new token
};

let _msalInstance: any = {
  initialize() {
    console.log("skip msalInstance.initialize");
  },
  async loginPopup(data: any) {
    data;
    console.log("skip msalInstance.loginPopup");
  },
  async loginRedirect(data: any) {
    data;
    console.log("skip msalInstance.loginRedirect");
  },
};
// init only if tenant and client id are set
if (TENANT_ID && CLIENT_ID && TENANT_ID !== "" && CLIENT_ID !== "") {
  _msalInstance = new msal.PublicClientApplication({
    auth: {
      clientId: CLIENT_ID,
      authority: "https://login.microsoftonline.com/" + TENANT_ID,
      // redirectUri: "http://localhost:8080/redirect",
    },
    cache: {
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
      loggerOptions: {
        logLevel: msal.LogLevel.Error,
        loggerCallback: (level: any, message: any, containsPii: any) => {
          if (containsPii) {
            return;
          }
          switch (level) {
            case msal.LogLevel.Error:
              console.error(message);
              return;
            case msal.LogLevel.Info:
              console.info(message);
              return;
            case msal.LogLevel.Verbose:
              console.debug(message);
              return;
            case msal.LogLevel.Warning:
              console.warn(message);
              return;
            default:
              console.log(message);
              return;
          }
        },
      },
    },
    telemetry: {
      application: {
        appName: pkg.name,
        appVersion: pkg.version,
      },
    },
  });
}

// Create the main MSAL instance.
export const msalInstance = _msalInstance;
msalInstance.initialize();

export async function signIn(method: "popup" | "redirect" = "popup") {
  if (method === "popup") {
    return msalInstance
      .loginPopup({
        scopes: loginRequest.scopes,
        // redirectUri: '/redirect',
      })
      .then(() => {
        return true;
      })
      .catch(function (error: any) {
        console.log(error);

        // Route back to home.
        router.replace({ name: "home" });

        return false;
      });
  } else if (method === "redirect") {
    return msalInstance.loginRedirect(loginRequest);
  }
}

// export function signOut(interactionType = 'popup') {
//   const logoutRequest = {
//     account: msalInstance.getAccountByHomeId(accountId),
//   };

//   if (interactionType === 'popup') {
//     msalInstance.logoutPopup(logoutRequest).then(() => {
//       window.location.reload();
//     });
//   } else {
//     msalInstance.logoutRedirect(logoutRequest);
//   }
// }

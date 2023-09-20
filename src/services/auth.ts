import * as msal from "@azure/msal-browser";

const TENANT_ID = import.meta.env.VITE_AZURE_COSMOSDB_TENANT_ID;
const CLIENT_ID = import.meta.env.VITE_AZURE_COSMOSDB_CLIENT_ID;
export const BASE_URL = "https://graph.microsoft.com/v1.0";

// Config object to be passed to Msal on creation
const msalConfig = {
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
      appName: "internal-calendar-checker",
      appVersion: "0.0.1",
    },
  },
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
const loginRequest = {
  scopes: [
    "User.Read",
    "Calendars.Read",
    "Calendars.Read.Shared",
    "https://cosmos.azure.com/user_impersonation",
  ],
  forceRefresh: false, // Set this to "true" to skip a cached token and go to the server to get a new token
};

export let signInType = "popup";
let accountId = "";
export let token: null | string = null;

// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
export const myMSALObj = new msal.PublicClientApplication(msalConfig);

myMSALObj.initialize().then(() => {
  // Redirect: once login is successful and redirects with tokens, call Graph API
  myMSALObj.handleRedirectPromise()
    .then(handleResponse)
    .catch((err) => {
      console.error(err);
    });
});

function handleResponse(resp: any): boolean {
  console.log(resp);

  if (resp !== null) {
    accountId = resp.account.homeAccountId;
    myMSALObj.setActiveAccount(resp.account);

    const test = myMSALObj.getActiveAccount();
    console.log(test);

    token = resp.idToken ?? null;
    if (token) {
      return true;
    }
  } else {
    // need to call getAccount here?
    const currentAccounts = myMSALObj.getAllAccounts();
    if (!currentAccounts || currentAccounts.length < 1) {
      return false;
    } else if (currentAccounts.length > 1) {
      // Add choose account code here
      return false;
    } else if (currentAccounts.length === 1) {
      const activeAccount = currentAccounts[0];
      myMSALObj.setActiveAccount(activeAccount);
      accountId = activeAccount.homeAccountId;

      console.log("accountId: " + accountId);

      console.log("logged in");
      token = activeAccount.idToken ?? null;
      // save token from idToken
      if (token) {
        return true;
      }
    }
  }
  return false;
}

export async function signIn(method: "popup" | "redirect" = "popup") {
  signInType = method;

  if (signInType === "popup") {
    return myMSALObj.loginPopup({
      ...loginRequest,
      redirectUri: "/redirect",
    })
      .then(handleResponse)
      .catch(function (error) {
        console.log(error);
        return false;
      });
  } else if (signInType === "redirect") {
    return myMSALObj.loginRedirect(loginRequest);
  }
}

export function signOut(interactionType = "popup") {
  const logoutRequest = {
    account: myMSALObj.getAccountByHomeId(accountId),
  };

  if (interactionType === "popup") {
    myMSALObj.logoutPopup(logoutRequest).then(() => {
      window.location.reload();
    });
  } else {
    myMSALObj.logoutRedirect(logoutRequest);
  }
}

// ???????
export async function getTokenPopup() {
  // console.log(request);

  // loginRequest.redirectUri = "/redirect"

  return await myMSALObj
    .acquireTokenSilent(loginRequest)
    .catch(async (error) => {
      console.error("silent token acquisition fails.");
      if (error instanceof msal.InteractionRequiredAuthError) {
        console.log("acquiring token using popup");
        return myMSALObj.acquireTokenPopup(loginRequest)
          .catch((error) => {
            throw error;
          });
      } else {
        throw error;
      }
    });
}

export async function checkForValidToken() {
  return await myMSALObj
    .acquireTokenSilent(loginRequest)
    .catch(async (error) => {
      console.error("silent token acquisition fails.");
      console.log(error);
      return { accessToken: "" };
    });
}
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from "@azure/msal-browser";

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig = {
  auth: {
    // clientId: "df5d3c36-0ba8-4f51-935d-8378d1695b0b",
    clientId: "5258934b-46cf-4b96-9460-2250776102c3",
    authority:
      "https://login.microsoftonline.com/742bc209-0ce8-4cf8-b2e2-32d4d1c2d9ea",
    redirectUri: "https://10.22.11.101:89/",
    // redirectUri: "https://mrf.kwglobal.com/",
    // redirectUri: "http://localhost:3000/",
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            // console.error(message);
            return;
          case LogLevel.Info:
            // console.info(message);
            return;
          case LogLevel.Verbose:
            // console.debug(message);
            return;
          case LogLevel.Warning:
            // console.warn(message);
            return;
        }
      },
    },
  },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: ["api://a827d3d2-82d9-4f0b-839e-5d1bcbaf9563/access_as_user"],
};

/**
 * Add here the scopes to request when obtaining an access token for MS Graph API. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const graphConfig = {
  // graphMeEndpoint: "https://localhost:7128/api/Login/Get",
  graphMeEndpoint: "https://10.22.11.101:90/api/Login/Get",
  // graphMeEndpoint: "https://mrf.kwglobal.com/mrf/api/Login/Get",
};

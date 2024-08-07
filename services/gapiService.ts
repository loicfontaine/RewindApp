declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

import { useServicesAuthStore } from "~/stores/servicesAuth.js";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "../app.vue";

const pinia = createPinia();

let servicesAuthStore: any;
let config: any;

type WindowWithGapi = Window & typeof globalThis & { gapi: any };
const windowWithGapi: WindowWithGapi = window as WindowWithGapi;

let tokenClient: any;

function storeToken(token: string) {
  localStorage.setItem("gapiToken", token);
}

function getToken() {
  return localStorage.getItem("gapiToken");
}

function clearToken() {
  localStorage.removeItem("gapiToken");
}

async function isTokenValid(token: string): Promise<boolean> {
  try {
    await window.gapi.client.request({
      path: "https://www.googleapis.com/oauth2/v3/tokeninfo",
      params: { access_token: token },
    });
    return true;
  } catch (e) {
    return false;
  }
}

export function gapiLoaded() {
  window.gapi.load("client", async () => {
    await initializeGapiClient();
    const token = getToken();
    if (token) {
      const valid = await isTokenValid(token);
      if (valid) {
        window.gapi.client.setToken({ access_token: token });
        console.log("Token is valid, user is authenticated.");
        // Trigger any necessary callback to inform the app of the authenticated state
        servicesAuthStore.googleAuth = true;
      } else {
        console.log("Token is invalid or expired.");
        servicesAuthStore.googleAuth = false;
        clearToken();
      }
    }
  });
}

async function initializeGapiClient() {
  await window.gapi.client.init({
    apiKey: config.public.googleApikey,
    discoveryDocs: [config.public.googleDiscoveryDoc],
  });
  servicesAuthStore.gapiLoaded = true;
  const token = getToken();
  if (token && (await isTokenValid(token))) {
    window.gapi.client.setToken({ access_token: token });
  }
}

export function gisLoaded() {
  console.log("gisLoaded");

  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: config.public.googleClientId,
    scope: config.public.googleScopes,
    callback: "",
  });
  servicesAuthStore.gisLoaded = true;
}

export function handleAuthClick(callback: (response: any) => boolean) {
  if (servicesAuthStore.gapiLoaded && servicesAuthStore.gisLoaded) {
    const token = getToken();

    if (token) {
      window.gapi.client.setToken({ access_token: token });
      callback({ access_token: token });
    } else {
      tokenClient.callback = async (resp: any) => {
        if (resp.error !== undefined) {
          throw resp;
        }
        servicesAuthStore.googleAuth = true;
        storeToken(resp.access_token); // Store the token in localStorage
        await callback(resp);
      };

      if (window.gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: "consent" });
      } else {
        tokenClient.requestAccessToken({ prompt: "" });
      }
    }
  }
}

export function handleSignoutClick() {
  const token = window.gapi.client.getToken();
  if (token !== null) {
    window.google.accounts.oauth2.revoke(token.access_token, () => {
      clearToken(); // Clear the token from localStorage
      window.gapi.client.setToken("");
      servicesAuthStore.googleAuth = false;
    });
  }
}

export function loadGapiAndGisScripts() {
  const app = createApp(App);
  config = useRuntimeConfig();
  app.use(pinia);
  servicesAuthStore = useServicesAuthStore();
  const gapiScript = document.createElement("script");
  gapiScript.defer = true;
  gapiScript.async = true;
  gapiScript.onload = () => {
    if (window.gapi) {
      gapiLoaded();
    } else {
      console.error("Failed to load gapi");
    }
  };
  gapiScript.src = "https://apis.google.com/js/api.js";
  document.head.appendChild(gapiScript);

  const gisScript = document.createElement("script");
  gisScript.defer = true;
  gisScript.async = true;
  gisScript.onload = () => {
    if (window.google && window.google.accounts) {
      gisLoaded();
    } else {
      console.error("Failed to load gis");
    }
  };
  gisScript.src = "https://accounts.google.com/gsi/client";
  document.head.appendChild(gisScript);
}

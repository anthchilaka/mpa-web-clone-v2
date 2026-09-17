import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaEnterpriseProvider, type AppCheck } from "firebase/app-check";
import { getFunctions, type Functions } from "firebase/functions";

// All NEXT_PUBLIC_* values are safe to expose client-side — none of these are
// secrets (unlike RESEND_API_KEY, which only ever lives server-side in
// Functions config). Real values get set once the Firebase project exists;
// until then these are undefined and the guarded getters below throw a clear
// error instead of silently failing.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const FUNCTIONS_REGION = "europe-west1";

let app: FirebaseApp | undefined;
let appCheck: AppCheck | undefined;
let functions: Functions | undefined;

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId
  );
}

function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase isn't configured yet (missing NEXT_PUBLIC_FIREBASE_* env vars) — the template-request feature isn't live yet."
    );
  }
  if (!app) {
    app = getApps()[0] ?? initializeApp(firebaseConfig);
  }
  return app;
}

export function getFunctionsClient(): Functions {
  const firebaseApp = getFirebaseApp();

  // App Check must be initialized before the first Functions call.
  if (!appCheck && RECAPTCHA_SITE_KEY) {
    appCheck = initializeAppCheck(firebaseApp, {
      provider: new ReCaptchaEnterpriseProvider(RECAPTCHA_SITE_KEY),
      isTokenAutoRefreshEnabled: true,
    });
  }

  if (!functions) {
    functions = getFunctions(firebaseApp, FUNCTIONS_REGION);
  }
  return functions;
}

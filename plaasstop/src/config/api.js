export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_TIMEOUT = 10000;
export const DEFAULT_RADIUS = 50;
export const AMPLIFY_CONFIG = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    },
  },
};

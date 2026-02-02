export const API_URL: string = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_TIMEOUT: number = 10000;
export const DEFAULT_RADIUS: number = 50;

export const AMPLIFY_CONFIG = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_POOL_ID as string,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID as string,
    },
  },
};

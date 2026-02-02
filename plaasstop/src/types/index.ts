import { AuthUser } from "aws-amplify/auth";

// 1. The Farm Object (Nested inside User)
export interface Farm {
  id: number;
  name: string;
  type: 'lead' | 'vendor';
  status: 'unclaimed' | 'pending_verification' | 'verified';
  products: string[];
  location: {
    x: number; // lng
    y: number; // lat
  } | string; // Depending on how PostGIS returns it
  distance?: string; // Optional field for search results
}

// 2. The Database User (from PostgreSQL)
export interface DbUser {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'vendor' | 'admin';
  farm?: Farm | null; // <--- Type Safe Nested Object
}

// 3. The Cognito User (from Amplify)
// We export this alias so we don't have to import AuthUser everywhere
export type CognitoUser = AuthUser;import { AuthUser } from "aws-amplify/auth";

// 1. The Farm Object (Nested inside User)
export interface Farm {
  id: number;
  name: string;
  type: 'lead' | 'vendor';
  status: 'unclaimed' | 'pending_verification' | 'verified';
  products: string[];
  location: {
    x: number; // lng
    y: number; // lat
  } | string; // Depending on how PostGIS returns it
  distance?: string; // Optional field for search results
}

// 2. The Database User (from PostgreSQL)
export interface DbUser {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'vendor' | 'admin';
  farm?: Farm | null; // <--- Type Safe Nested Object
}

// 3. The Cognito User (from Amplify)
// We export this alias so we don't have to import AuthUser everywhere
export type CognitoUser = AuthUser;

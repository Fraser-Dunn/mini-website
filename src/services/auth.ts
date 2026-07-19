import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  type CognitoUserSession,
} from "amazon-cognito-identity-js";

const userPool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
});

export function login(
  email: string,
  password: string
): Promise<CognitoUserSession> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(session),
      onFailure: (err) => reject(err),
    });
  });
}

export function logout(): void {
  userPool.getCurrentUser()?.signOut();
}

// Resolves the current session (auto-refreshing the token if needed), or
// null if there's no logged-in user.
function getSession(): Promise<CognitoUserSession | null> {
  return new Promise((resolve, reject) => {
    const user = userPool.getCurrentUser();
    if (!user) {
      resolve(null);
      return;
    }
    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(session);
    });
  });
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await getSession();
    return session?.isValid() ?? false;
  } catch {
    return false;
  }
}

export async function getIdToken(): Promise<string> {
  const session = await getSession();
  if (!session || !session.isValid()) {
    throw new Error("Not authenticated");
  }
  return session.getIdToken().getJwtToken();
}

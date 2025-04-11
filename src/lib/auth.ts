export function getUser() {
  if (typeof window === "undefined") {
    console.log("getUser: Running on the server, returning null");
    return null;
  }

  const userData = localStorage.getItem("user");
  console.log("getUser: Retrieved userData from localStorage:", userData);

  if (!userData) {
    console.log("getUser: No user data found in localStorage, returning null");
    return null;
  }

  try {
    const parsedUser = JSON.parse(userData);
    console.log("getUser: Successfully parsed user data:", parsedUser);
    return parsedUser;
  } catch (error) {
    console.error("getUser: Error parsing user data:", error);
    return null;
  }
}

export function isAuthenticated() {
  const user = getUser();
  const isAuth = !!user;
  console.log(
    "isAuthenticated: User is",
    isAuth ? "authenticated" : "not authenticated"
  );
  return isAuth;
}

export function hasRole(allowedRoles: string[]) {
  const user = getUser();
  const hasRole = user && allowedRoles.includes(user.role);
  console.log(
    "hasRole: User role is",
    user ? user.role : "undefined",
    "| Allowed roles:",
    allowedRoles,
    "| Has role:",
    hasRole
  );
  return hasRole;
}

export function logout() {
  console.log("logout: Clearing cookies and redirecting to login");

  // Clear cookies
  document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
  document.cookie =
    "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";

  // Redirect to login
  window.location.href = "/";
}

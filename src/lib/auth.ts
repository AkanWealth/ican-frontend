export function getUser() {
  if (typeof window === "undefined") return null;

  const userData = localStorage.getItem("user");

  if (!userData) return null;

  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!getUser();
}

export function hasRole(allowedRoles: string[]) {
  const user = getUser();
  return user && allowedRoles.includes(user.role);
}

export function logout() {
  // Clear cookies
  document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
  document.cookie =
    "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";

  // Redirect to login
  window.location.href = "/login";
}

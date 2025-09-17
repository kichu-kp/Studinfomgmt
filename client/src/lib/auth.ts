export function isAuthenticated(): boolean {
  try {
    return !!localStorage.getItem("auth.basic");
  } catch (e) {
    return false;
  }
}

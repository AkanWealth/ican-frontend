import axios from "axios";
import { BASE_API_URL } from "./setter";
import { useRouter } from "next/navigation";

const router = useRouter();

export async function handleUnauthorizedRequest(
  config: any,
  router: any,
  setData: (data: any) => void
) {
  try {
    const refreshConfig = {
      method: "post",
      url: `${BASE_API_URL}/auth/refresh`,
      withCredentials: true, // Ensure cookies are sent with the request
    };
    const refreshResult = await axios.request(refreshConfig);
    localStorage.setItem("access_token", refreshResult.data.access_token);
    document.cookie = `access_token=${refreshResult.data.access_token}; path=/; secure; HttpOnly;`;
    console.log(
      "Token refreshed successfully:",
      refreshResult.data.access_token
    );
  } catch (error) {
    console.error("Failed to refresh token or retry request", error);
    router.push("/login"); // Redirect to login if refresh fails
  }
}

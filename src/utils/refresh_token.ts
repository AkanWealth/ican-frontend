import axios from "axios";
import { BASE_API_URL } from "./setter";
import { useRouter } from "next/navigation";

export async function handleUnauthorizedRequest(
  config: any,
  router: any,
  setData: (data: any) => void
) {
  try {
    const refreshConfig = {
      method: "post",
      url: `${BASE_API_URL}/auth/refresh`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
      },
    };
    const refreshResult = await axios.request(refreshConfig);
    localStorage.setItem("access_token", refreshResult.data.access_token);

    // Retry the original request
    const retryConfig = {
      ...config,
      headers: {
        Authorization: `Bearer ${refreshResult.data.access_token}`,
      },
    };
    const retryResult = await axios.request(retryConfig);
    setData(retryResult.data);
  } catch (error) {
    console.error("Failed to refresh token or retry request", error);
    router.push("/login"); // Redirect to login if refresh fails
  }
}

import axios from "axios";
import { BASE_API_URL } from "./setter";
import { useRouter } from "next/navigation";

export async function handleUnauthorizedRequest(
  config: any,
  router: any,
  setData: (data: any) => void
) {
  try {
    console.log("Starting token refresh process...");
    const refreshConfig = {
      method: "post",
      url: `${BASE_API_URL}/auth/refresh`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
      },
    };
    console.log("Refresh config:", refreshConfig);

    const refreshResult = await axios.request(refreshConfig);
    console.log("Token refresh successful:", refreshResult.data);

    localStorage.setItem("access_token", refreshResult.data.access_token);

    // Retry the original request
    console.log("Retrying original request with new access token...");
    const retryConfig = {
      ...config,
      headers: {
        Authorization: `Bearer ${refreshResult.data.access_token}`,
      },
    };
    console.log("Retry config:", retryConfig);

    const retryResult = await axios.request(retryConfig);
    console.log("Original request retry successful:", retryResult.data);

    setData(retryResult.data);
  } catch (error) {
    console.error("Failed to refresh token or retry request", error);
    router.push("/login"); // Redirect to login if refresh fails
  }
}

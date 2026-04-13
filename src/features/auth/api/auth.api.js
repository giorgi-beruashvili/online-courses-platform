import { axiosInstance } from "../../../shared/api/axios";

function mapApiUser(apiUser = {}) {
  return {
    id: apiUser.id ?? null,
    username: apiUser.username ?? "",
    email: apiUser.email ?? "",
    avatar: apiUser.avatar ?? "",
    fullName: apiUser.fullName ?? "",
    mobileNumber: apiUser.mobileNumber ?? "",
    age: apiUser.age ?? null,
    profileComplete: Boolean(apiUser.profileComplete),
  };
}

function mapAuthPayload(responseData) {
  const payload = responseData?.data ?? responseData;

  return {
    token: payload?.token ?? "",
    user: mapApiUser(payload?.user),
  };
}

export async function loginUser(values) {
  const response = await axiosInstance.post("/login", values);
  return mapAuthPayload(response.data);
}

export async function registerUser(formData) {
  const response = await axiosInstance.post("/register", formData);
  return mapAuthPayload(response.data);
}

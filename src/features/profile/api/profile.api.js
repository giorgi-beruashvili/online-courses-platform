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

function buildProfileFormData(values) {
  const formData = new FormData();

  formData.append("full_name", values.fullName);
  formData.append("mobile_number", values.mobileNumber);
  formData.append("age", String(values.age));

  if (values.avatar instanceof File) {
    formData.append("avatar", values.avatar);
  }

  return formData;
}

export async function getMe(tokenOverride) {
  const config = tokenOverride
    ? {
        headers: {
          Authorization: `Bearer ${tokenOverride}`,
        },
      }
    : undefined;

  const response = await axiosInstance.get("/me", config);
  const payload = response.data?.data ?? response.data;

  return mapApiUser(payload);
}

export async function updateProfile(values) {
  const formData = buildProfileFormData(values);
  const response = await axiosInstance.put("/profile", formData);

  const payload = response.data?.data ?? response.data;
  return mapApiUser(payload);
}

import { axiosInstance } from "../../../shared/api/axios";

export async function completeEnrollment(enrollmentId) {
  const response = await axiosInstance.patch(
    `/enrollments/${enrollmentId}/complete`,
  );
  return response.data?.data ?? response.data;
}

export async function deleteEnrollment(enrollmentId) {
  await axiosInstance.delete(`/enrollments/${enrollmentId}`);
}

export async function rateCourse(courseId, rating) {
  const response = await axiosInstance.post(`/courses/${courseId}/reviews`, {
    rating,
  });

  return response.data?.data ?? response.data;
}

import { axiosInstance } from "../../../shared/api/axios";

function normalizeCourse(raw = {}) {
  return {
    id: raw.id ?? null,
    title: raw.title ?? "Untitled Course",
    description: raw.description ?? "",
    image: raw.image ?? "",
    basePrice: Number(raw.basePrice ?? 0),
    durationWeeks: raw.durationWeeks ?? 0,
    isFeatured: Boolean(raw.isFeatured),
    avgRating: raw.avgRating ?? null,
    reviewCount: raw.reviewCount ?? 0,
    reviews: Array.isArray(raw.reviews) ? raw.reviews : [],
    isRated: Boolean(raw.isRated),
    category: raw.category
      ? {
          id: raw.category.id ?? null,
          name: raw.category.name ?? "",
          icon: raw.category.icon ?? "",
        }
      : null,
    topic: raw.topic
      ? {
          id: raw.topic.id ?? null,
          name: raw.topic.name ?? "",
          categoryId: raw.topic.categoryId ?? null,
        }
      : null,
    instructor: raw.instructor
      ? {
          id: raw.instructor.id ?? null,
          name: raw.instructor.name ?? "",
          avatar: raw.instructor.avatar ?? "",
        }
      : null,
    enrollment: raw.enrollment ?? null,
  };
}

function normalizePaginatedCourses(responseData) {
  const payload = responseData?.data ?? responseData;

  const itemsSource = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

  const metaSource = responseData?.meta ?? payload?.meta ?? responseData ?? {};

  return {
    items: itemsSource.map(normalizeCourse),
    meta: {
      currentPage: Number(
        metaSource.currentPage ?? metaSource.current_page ?? 1,
      ),
      lastPage: Number(metaSource.lastPage ?? metaSource.last_page ?? 1),
      perPage: Number(
        metaSource.perPage ?? metaSource.per_page ?? itemsSource.length,
      ),
      total: Number(metaSource.total ?? itemsSource.length),
    },
  };
}

export async function getFeaturedCourses() {
  const response = await axiosInstance.get("/courses/featured");
  const payload = response.data?.data ?? response.data;
  const items = Array.isArray(payload) ? payload : [];

  return items.map(normalizeCourse);
}

export async function getCourses(params = { page: 1, sort: "newest" }) {
  const response = await axiosInstance.get("/courses", {
    params,
  });

  return normalizePaginatedCourses(response.data);
}

export async function getCourseDetails(courseId) {
  const response = await axiosInstance.get(`/courses/${courseId}`);
  const payload = response.data?.data ?? response.data;

  return normalizeCourse(payload);
}

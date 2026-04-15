import { axiosInstance } from "../../../shared/api/axios";

function normalizeEnrollment(raw = {}) {
  if (!raw) return null;

  return {
    id: raw.id ?? null,
    quantity: Number(raw.quantity ?? 1),
    totalPrice: Number(raw.totalPrice ?? 0),
    progress: Number(raw.progress ?? 0),
    completedAt: raw.completedAt ?? null,
    course: raw.course
      ? {
          id: raw.course.id ?? null,
          title: raw.course.title ?? "Untitled Course",
        }
      : null,
    schedule: {
      weeklySchedule: raw.schedule?.weeklySchedule
        ? {
            id: raw.schedule.weeklySchedule.id ?? null,
            label: raw.schedule.weeklySchedule.label ?? "",
            days: Array.isArray(raw.schedule.weeklySchedule.days)
              ? raw.schedule.weeklySchedule.days
              : [],
          }
        : null,
      timeSlot: raw.schedule?.timeSlot
        ? {
            id: raw.schedule.timeSlot.id ?? null,
            label: raw.schedule.timeSlot.label ?? "",
            startTime: raw.schedule.timeSlot.startTime ?? "",
            endTime: raw.schedule.timeSlot.endTime ?? "",
          }
        : null,
      sessionType: raw.schedule?.sessionType
        ? {
            id: raw.schedule.sessionType.id ?? null,
            courseScheduleId: raw.schedule.sessionType.courseScheduleId ?? null,
            name: raw.schedule.sessionType.name ?? "",
            priceModifier: Number(raw.schedule.sessionType.priceModifier ?? 0),
            availableSeats: Number(
              raw.schedule.sessionType.availableSeats ?? 0,
            ),
            location: raw.schedule.sessionType.location ?? null,
          }
        : null,
    },
    location: raw.location ?? raw.schedule?.sessionType?.location ?? null,
  };
}

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
    enrollment: normalizeEnrollment(raw.enrollment),
  };
}

function normalizeCategory(raw = {}) {
  return {
    id: raw.id ?? null,
    name: raw.name ?? "",
    icon: raw.icon ?? "",
  };
}

function normalizeTopic(raw = {}) {
  return {
    id: raw.id ?? null,
    name: raw.name ?? "",
    categoryId: raw.categoryId ?? null,
  };
}

function normalizeInstructor(raw = {}) {
  return {
    id: raw.id ?? null,
    name: raw.name ?? "",
    avatar: raw.avatar ?? "",
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

function buildCoursesQueryString(params = {}) {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.sort) {
    searchParams.set("sort", params.sort);
  }

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  (params.categories ?? []).forEach((categoryId) => {
    searchParams.append("categories[]", String(categoryId));
  });

  (params.topics ?? []).forEach((topicId) => {
    searchParams.append("topics[]", String(topicId));
  });

  (params.instructors ?? []).forEach((instructorId) => {
    searchParams.append("instructors[]", String(instructorId));
  });

  return searchParams.toString();
}

function buildTopicsQueryString(categoryIds = []) {
  const searchParams = new URLSearchParams();

  categoryIds.forEach((categoryId) => {
    searchParams.append("categories[]", String(categoryId));
  });

  return searchParams.toString();
}

export async function getFeaturedCourses() {
  const response = await axiosInstance.get("/courses/featured");
  const payload = response.data?.data ?? response.data;
  const items = Array.isArray(payload) ? payload : [];

  return items.map(normalizeCourse);
}

export async function getCourses(params = { page: 1, sort: "newest" }) {
  const queryString = buildCoursesQueryString(params);
  const response = await axiosInstance.get(`/courses?${queryString}`);

  return normalizePaginatedCourses(response.data);
}

export async function getCourseDetails(courseId) {
  const response = await axiosInstance.get(`/courses/${courseId}`);
  const payload = response.data?.data ?? response.data;

  return normalizeCourse(payload);
}

export async function getCategories() {
  const response = await axiosInstance.get("/categories");
  const payload = response.data?.data ?? response.data;
  const items = Array.isArray(payload) ? payload : [];

  return items
    .map(normalizeCategory)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getTopics(categoryIds = []) {
  const queryString = buildTopicsQueryString(categoryIds);
  const url = queryString ? `/topics?${queryString}` : "/topics";

  const response = await axiosInstance.get(url);
  const payload = response.data?.data ?? response.data;
  const items = Array.isArray(payload) ? payload : [];

  return items.map(normalizeTopic).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getInstructors() {
  const response = await axiosInstance.get("/instructors");
  const payload = response.data?.data ?? response.data;
  const items = Array.isArray(payload) ? payload : [];

  return items
    .map(normalizeInstructor)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCourseFilterOptions(categoryIds = []) {
  const [categories, topics, instructors] = await Promise.all([
    getCategories(),
    getTopics(categoryIds),
    getInstructors(),
  ]);

  return {
    categories,
    topics,
    instructors,
  };
}

export async function getCourseSchedules(courseId) {
  const response = await axiosInstance.get(
    `/courses/${courseId}/weekly-schedules`,
  );
  const payload = response.data?.data ?? response.data;
  const items = Array.isArray(payload) ? payload : [];

  return items.map((item) => ({
    id: item.id ?? null,
    label: item.label ?? "",
    days: Array.isArray(item.days) ? item.days : [],
  }));
}

export async function getCourseTimeSlots(courseId, weeklyScheduleId) {
  const response = await axiosInstance.get(`/courses/${courseId}/time-slots`, {
    params: {
      weekly_schedule_id: weeklyScheduleId,
    },
  });

  const payload = response.data?.data ?? response.data;
  const items = Array.isArray(payload) ? payload : [];

  return items.map((item) => ({
    id: item.id ?? null,
    label: item.label ?? "",
    startTime: item.startTime ?? "",
    endTime: item.endTime ?? "",
  }));
}

export async function getCourseSessionTypes(
  courseId,
  weeklyScheduleId,
  timeSlotId,
) {
  const response = await axiosInstance.get(
    `/courses/${courseId}/session-types`,
    {
      params: {
        weekly_schedule_id: weeklyScheduleId,
        time_slot_id: timeSlotId,
      },
    },
  );

  const payload = response.data?.data ?? response.data;
  const items = Array.isArray(payload) ? payload : [];

  return items.map((item) => ({
    id: item.id ?? null,
    courseScheduleId: item.courseScheduleId ?? null,
    name: item.name ?? "",
    priceModifier: Number(item.priceModifier ?? 0),
    availableSeats: Number(item.availableSeats ?? 0),
    location: item.location ?? null,
  }));
}

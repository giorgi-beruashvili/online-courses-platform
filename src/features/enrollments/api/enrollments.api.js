import { axiosInstance } from "../../../shared/api/axios";

function normalizeEnrollment(raw = {}) {
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
          description: raw.course.description ?? "",
          image: raw.course.image ?? "",
          basePrice: Number(raw.course.basePrice ?? 0),
          durationWeeks: raw.course.durationWeeks ?? 0,
          avgRating: raw.course.avgRating ?? null,
          reviewCount: raw.course.reviewCount ?? 0,
          category: raw.course.category
            ? {
                id: raw.course.category.id ?? null,
                name: raw.course.category.name ?? "",
                icon: raw.course.category.icon ?? "",
              }
            : null,
          topic: raw.course.topic
            ? {
                id: raw.course.topic.id ?? null,
                name: raw.course.topic.name ?? "",
                categoryId: raw.course.topic.categoryId ?? null,
              }
            : null,
          instructor: raw.course.instructor
            ? {
                id: raw.course.instructor.id ?? null,
                name: raw.course.instructor.name ?? "",
                avatar: raw.course.instructor.avatar ?? "",
              }
            : null,
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

export async function getEnrollments() {
  const response = await axiosInstance.get("/enrollments");
  const payload = response.data?.data ?? response.data;
  const items = Array.isArray(payload) ? payload : [];

  return items.map(normalizeEnrollment);
}

export async function getInProgressCourses() {
  const response = await axiosInstance.get("/courses/in-progress");
  const payload = response.data?.data ?? response.data;
  const items = Array.isArray(payload) ? payload : [];

  return items.map(normalizeEnrollment);
}

export async function enrollInCourse({
  courseId,
  courseScheduleId,
  force = false,
}) {
  const response = await axiosInstance.post("/enrollments", {
    courseId,
    courseScheduleId,
    force,
  });

  const payload = response.data?.data ?? response.data;
  return normalizeEnrollment(payload);
}

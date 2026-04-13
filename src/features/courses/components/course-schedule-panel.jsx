import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../../../app/providers/auth-provider";
import { useModal } from "../../../app/providers/modal-provider";
import { QUERY_KEYS } from "../../../shared/api/query-keys";
import { Loader } from "../../../shared/components/ui/loader";
import { ErrorState } from "../../../shared/components/ui/error-state";
import {
  getCourseSchedules,
  getCourseTimeSlots,
  getCourseSessionTypes,
} from "../api/courses.api";
import { enrollInCourse } from "../../enrollments/api/enrollments.api";
import { SessionTypeCard } from "./session-type-card";
import { EnrollmentConflictModal } from "./enrollment-conflict-modal";

function getApiErrorMessage(error, fallbackMessage) {
  const validationErrors = error?.response?.data?.errors;
  const firstValidationEntry = validationErrors
    ? Object.values(validationErrors)[0]
    : null;

  if (Array.isArray(firstValidationEntry) && firstValidationEntry[0]) {
    return firstValidationEntry[0];
  }

  return error?.response?.data?.message || fallbackMessage;
}

export function CourseSchedulePanel({ courseId, basePrice, onEnrollSuccess }) {
  const queryClient = useQueryClient();
  const { isAuthenticated, isProfileComplete } = useAuth();
  const { openLogin, openProfile } = useModal();

  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState(null);
  const [selectedSessionType, setSelectedSessionType] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [pendingConflicts, setPendingConflicts] = useState([]);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);

  const selectedCourseScheduleId =
    selectedSessionType?.courseScheduleId ?? null;

  const {
    data: schedules = [],
    isLoading: isLoadingSchedules,
    isError: isSchedulesError,
  } = useQuery({
    queryKey: QUERY_KEYS.COURSE_SCHEDULES(courseId),
    queryFn: () => getCourseSchedules(courseId),
    enabled: Boolean(courseId),
  });

  const {
    data: timeSlots = [],
    isLoading: isLoadingTimeSlots,
    isError: isTimeSlotsError,
  } = useQuery({
    queryKey: QUERY_KEYS.COURSE_TIME_SLOTS(courseId, selectedScheduleId),
    queryFn: () => getCourseTimeSlots(courseId, selectedScheduleId),
    enabled: Boolean(courseId && selectedScheduleId),
  });

  const {
    data: sessionTypes = [],
    isLoading: isLoadingSessionTypes,
    isError: isSessionTypesError,
  } = useQuery({
    queryKey: QUERY_KEYS.COURSE_SESSION_TYPES(
      courseId,
      selectedScheduleId,
      selectedTimeSlotId,
    ),
    queryFn: () =>
      getCourseSessionTypes(courseId, selectedScheduleId, selectedTimeSlotId),
    enabled: Boolean(courseId && selectedScheduleId && selectedTimeSlotId),
  });

  const enrollMutation = useMutation({
    mutationFn: ({ force }) =>
      enrollInCourse({
        courseId,
        courseScheduleId: selectedCourseScheduleId,
        force,
      }),
  });

  const sessionModifier = useMemo(
    () => Number(selectedSessionType?.priceModifier ?? 0),
    [selectedSessionType],
  );

  const totalPrice = useMemo(
    () => Number(basePrice || 0) + sessionModifier,
    [basePrice, sessionModifier],
  );

  const handleScheduleChange = (scheduleId) => {
    setSelectedScheduleId(scheduleId);
    setSelectedTimeSlotId(null);
    setSelectedSessionType(null);
    setSubmitError("");
    setPendingConflicts([]);
    setIsConflictModalOpen(false);
  };

  const handleTimeSlotChange = (timeSlotId) => {
    setSelectedTimeSlotId(timeSlotId);
    setSelectedSessionType(null);
    setSubmitError("");
    setPendingConflicts([]);
    setIsConflictModalOpen(false);
  };

  const handleSessionTypeChange = (sessionType) => {
    setSelectedSessionType(sessionType);
    setSubmitError("");
    setPendingConflicts([]);
    setIsConflictModalOpen(false);
  };

  const invalidateAfterEnroll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ENROLLMENTS }),
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.IN_PROGRESS_COURSES,
      }),
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COURSE_DETAILS(courseId),
      }),
    ]);
  };

  const runEnroll = async (force = false) => {
    if (!selectedScheduleId || !selectedTimeSlotId || !selectedSessionType) {
      setSubmitError(
        "Please select a weekly schedule, time slot, and session type.",
      );
      return;
    }

    if (!selectedCourseScheduleId) {
      setSubmitError(
        "The selected session type is missing courseScheduleId. Please reselect it.",
      );
      return;
    }

    if (selectedSessionType.availableSeats === 0) {
      setSubmitError("This session type is fully booked.");
      return;
    }

    if (!isAuthenticated) {
      openLogin();
      return;
    }

    if (!isProfileComplete) {
      toast.error("Please complete your profile to enroll in courses");
      openProfile();
      return;
    }

    try {
      setSubmitError("");
      await enrollMutation.mutateAsync({ force });

      toast.success("Enrollment completed successfully");
      setPendingConflicts([]);
      setIsConflictModalOpen(false);

      await invalidateAfterEnroll();
      onEnrollSuccess?.();
    } catch (error) {
      if (error?.response?.status === 409) {
        setPendingConflicts(error?.response?.data?.conflicts ?? []);
        setIsConflictModalOpen(true);
        return;
      }

      setSubmitError(
        getApiErrorMessage(error, "Enrollment failed. Please try again."),
      );
    }
  };

  if (isLoadingSchedules) {
    return <Loader label="Loading weekly schedules..." />;
  }

  if (isSchedulesError) {
    return <ErrorState title="Failed to load schedules" />;
  }

  return (
    <>
      <div className="stack">
        <div className="selector-group">
          <h3 className="catalog-section-title">Weekly Schedule</h3>

          {schedules.map((schedule) => (
            <button
              key={schedule.id}
              type="button"
              className={`selector-button ${
                selectedScheduleId === schedule.id ? "active" : ""
              }`}
              onClick={() => handleScheduleChange(schedule.id)}
            >
              {schedule.label}
            </button>
          ))}
        </div>

        <div className="selector-group">
          <h3 className="catalog-section-title">Time Slot</h3>

          {!selectedScheduleId ? (
            <div className="state-note">Select a weekly schedule first.</div>
          ) : isLoadingTimeSlots ? (
            <Loader label="Loading time slots..." />
          ) : isTimeSlotsError ? (
            <ErrorState title="Failed to load time slots" />
          ) : (
            timeSlots.map((timeSlot) => (
              <button
                key={timeSlot.id}
                type="button"
                className={`selector-button ${
                  selectedTimeSlotId === timeSlot.id ? "active" : ""
                }`}
                onClick={() => handleTimeSlotChange(timeSlot.id)}
              >
                {timeSlot.label}
              </button>
            ))
          )}
        </div>

        <div className="selector-group">
          <h3 className="catalog-section-title">Session Type</h3>

          {!selectedTimeSlotId ? (
            <div className="state-note">Select a time slot first.</div>
          ) : isLoadingSessionTypes ? (
            <Loader label="Loading session types..." />
          ) : isSessionTypesError ? (
            <ErrorState title="Failed to load session types" />
          ) : (
            sessionTypes.map((sessionType) => (
              <SessionTypeCard
                key={sessionType.id}
                sessionType={sessionType}
                isActive={selectedSessionType?.id === sessionType.id}
                onSelect={handleSessionTypeChange}
              />
            ))
          )}
        </div>

        <div className="summary-card">
          <p>
            <strong>Base Price:</strong> ${Number(basePrice || 0)}
          </p>
          <p>
            <strong>Session Type Modifier:</strong>{" "}
            {sessionModifier === 0 ? "Included" : `+$${sessionModifier}`}
          </p>
          <p>
            <strong>Total Price:</strong> ${totalPrice}
          </p>
        </div>

        <div className="state-note">
          `courseScheduleId` source of truth here is the final selected
          backend-resolved session type. It is not manually composed on the
          frontend.
        </div>

        {submitError ? <div className="warning-text">{submitError}</div> : null}

        <button
          type="button"
          className="button button-primary"
          onClick={() => runEnroll(false)}
          disabled={enrollMutation.isPending}
        >
          {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
        </button>
      </div>

      <EnrollmentConflictModal
        open={isConflictModalOpen}
        conflicts={pendingConflicts}
        onCancel={() => {
          setIsConflictModalOpen(false);
          setPendingConflicts([]);
        }}
        onContinue={() => runEnroll(true)}
        isSubmitting={enrollMutation.isPending}
      />
    </>
  );
}

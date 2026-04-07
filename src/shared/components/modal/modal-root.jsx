import { useModal } from "../../../app/providers/modal-provider";
import { LoginModal } from "../../../features/auth/components/login-modal";
import { RegistrationModal } from "../../../features/auth/components/registration-modal";
import { ProfileModal } from "../../../features/profile/components/profile-modal";

export function ModalRoot() {
  const { activeModal } = useModal();

  return (
    <>
      <LoginModal open={activeModal === "login"} />
      <RegistrationModal open={activeModal === "register"} />
      <ProfileModal open={activeModal === "profile"} />
    </>
  );
}

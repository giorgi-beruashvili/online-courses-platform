import { createContext, useContext, useMemo, useReducer } from "react";

const ModalContext = createContext(null);

const initialState = {
  activeModal: null,
  isEnrolledSidebarOpen: false,
};

function modalReducer(state, action) {
  switch (action.type) {
    case "OPEN_MODAL":
      return {
        ...state,
        activeModal: action.payload,
      };

    case "CLOSE_MODAL":
      return {
        ...state,
        activeModal: null,
      };

    case "OPEN_ENROLLED_SIDEBAR":
      return {
        ...state,
        isEnrolledSidebarOpen: true,
      };

    case "CLOSE_ENROLLED_SIDEBAR":
      return {
        ...state,
        isEnrolledSidebarOpen: false,
      };

    case "TOGGLE_ENROLLED_SIDEBAR":
      return {
        ...state,
        isEnrolledSidebarOpen: !state.isEnrolledSidebarOpen,
      };

    default:
      return state;
  }
}

export function ModalProvider({ children }) {
  const [state, dispatch] = useReducer(modalReducer, initialState);

  const value = useMemo(() => {
    const openModal = (modalName) => {
      dispatch({
        type: "OPEN_MODAL",
        payload: modalName,
      });
    };

    const closeModal = () => {
      dispatch({ type: "CLOSE_MODAL" });
    };

    const openLogin = () => openModal("login");
    const openRegister = () => openModal("register");
    const openProfile = () => openModal("profile");

    const openEnrolledSidebar = () => {
      dispatch({ type: "OPEN_ENROLLED_SIDEBAR" });
    };

    const closeEnrolledSidebar = () => {
      dispatch({ type: "CLOSE_ENROLLED_SIDEBAR" });
    };

    const toggleEnrolledSidebar = () => {
      dispatch({ type: "TOGGLE_ENROLLED_SIDEBAR" });
    };

    return {
      activeModal: state.activeModal,
      isEnrolledSidebarOpen: state.isEnrolledSidebarOpen,
      openModal,
      closeModal,
      openLogin,
      openRegister,
      openProfile,
      openEnrolledSidebar,
      closeEnrolledSidebar,
      toggleEnrolledSidebar,
    };
  }, [state]);

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used inside ModalProvider");
  }

  return context;
}

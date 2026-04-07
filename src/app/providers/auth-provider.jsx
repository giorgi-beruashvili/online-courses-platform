import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import {
  clearAuthStorage,
  loadAuthStorage,
  saveAuthStorage,
} from "../../shared/lib/storage";

const AuthContext = createContext(null);

const storedAuth = loadAuthStorage();

const initialState = {
  token: storedAuth?.token ?? null,
  user: storedAuth?.user ?? null,
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        token: action.payload.token,
        user: action.payload.user,
      };

    case "LOGOUT":
      return {
        token: null,
        user: null,
      };

    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      saveAuthStorage(state);
    } else {
      clearAuthStorage();
    }
  }, [state]);

  const value = useMemo(() => {
    const login = ({ token, user }) => {
      dispatch({
        type: "LOGIN",
        payload: { token, user },
      });
    };

    const logout = () => {
      dispatch({ type: "LOGOUT" });
    };

    const setUser = (nextUser) => {
      dispatch({
        type: "SET_USER",
        payload: nextUser,
      });
    };

    return {
      token: state.token,
      user: state.user,
      isAuthenticated: Boolean(state.token),
      isProfileComplete: Boolean(state.user?.profileComplete),
      login,
      logout,
      setUser,
    };
  }, [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

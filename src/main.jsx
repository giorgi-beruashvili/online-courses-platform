import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { router } from "./app/router";
import { QueryProvider } from "./app/providers/query-provider";
import { AuthProvider } from "./app/providers/auth-provider";
import { ModalProvider } from "./app/providers/modal-provider";

import "./styles/variables.css";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryProvider>
      <AuthProvider>
        <ModalProvider>
          <Toaster position="top-right" />
          <RouterProvider router={router} />
        </ModalProvider>
      </AuthProvider>
    </QueryProvider>
  </React.StrictMode>,
);

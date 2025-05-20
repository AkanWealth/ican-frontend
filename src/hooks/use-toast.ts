"use client";

// Inspired by react-hot-toast library
// This file implements a custom toast notification system using React
// It uses a simple state management pattern outside React's component tree

import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

// Maximum number of toasts that can be displayed simultaneously
const TOAST_LIMIT = 1;
// Delay in milliseconds before removing a toast from the DOM after it is dismissed
// This allows time for exit animations to complete before the toast is fully removed
const TOAST_REMOVE_DELAY = 100;

// Type definition for a toast with all required properties
type ToasterToast = ToastProps & {
  id: string; // Unique identifier for each toast
  title?: React.ReactNode; // Optional title content
  description?: React.ReactNode; // Optional description content
  action?: ToastActionElement; // Optional action button/element
};

// Action types for the reducer pattern
const actionTypes = {
  ADD_TOAST: "ADD_TOAST", // Add a new toast to the list
  UPDATE_TOAST: "UPDATE_TOAST", // Update an existing toast's properties
  DISMISS_TOAST: "DISMISS_TOAST", // Mark a toast as dismissed (starts removal process)
  REMOVE_TOAST: "REMOVE_TOAST", // Actually remove a toast from the state
} as const;

// Counter to generate unique IDs for toasts
let count = 0;

// Helper function to generate unique toast IDs
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// Type definitions for the action types and payload structures
type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

// State structure for the toast management system
interface State {
  toasts: ToasterToast[];
}

// Map to track timeout IDs for each toast's removal process
// This prevents duplicate removal timers and allows for cleanup
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

// Schedules a toast for removal after the animation delay
// This creates a two-phase removal process:
// 1. First toast is dismissed (animation starts)
// 2. After delay, toast is completely removed from the DOM
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return; // Don't create duplicate timeouts
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

// Reducer function that handles state updates based on dispatched actions
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      // Add new toast to the beginning of the array and enforce TOAST_LIMIT
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      // Update properties of an existing toast by ID
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        // Schedule single toast for removal
        addToRemoveQueue(toastId);
      } else {
        // Schedule all toasts for removal
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      // Set open: false on specified toast(s) to trigger exit animations
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        // Remove all toasts
        return {
          ...state,
          toasts: [],
        };
      }
      // Remove specific toast by ID
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

// Array of callback functions to notify when state changes
// This is how components subscribe to state changes outside React's normal flow
const listeners: Array<(state: State) => void> = [];

// In-memory state that persists between component renders
// This allows the toast system to work outside React's component tree
let memoryState: State = { toasts: [] };

// Dispatcher function that updates state and notifies all listeners
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

// Type for creating a new toast (ID is generated automatically)
type Toast = Omit<ToasterToast, "id">;

// Main toast creation function - can be used outside of React components
function toast({ ...props }: Toast) {
  const id = genId();

  // Methods to update or dismiss this specific toast
  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  // Create and add the toast to state
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss(); // Auto-dismiss when open state changes to false
      },
    },
  });

  // Auto-dismiss the toast after 0.5 seconds
  setTimeout(() => {
    dismiss();
  }, 500);

  // Return methods to interact with this toast
  return {
    id: id,
    dismiss,
    update,
  };
}

// React hook that provides access to the toast system from components
function useToast() {
  // Track toast state in the component
  const [state, setState] = React.useState<State>(memoryState);

  // Subscribe to state changes when component mounts
  // Unsubscribe when component unmounts
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  // Return the current state and methods to interact with toasts
  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };

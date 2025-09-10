// Firebase error code to user-friendly message mapping
export const getFirebaseErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/invalid-credential":
      return "Invalid email or password. Please check your credentials and try again.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please wait a moment before trying again.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    case "auth/weak-password":
      return "Password is too weak. Please choose a stronger password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "permission-denied":
      return "You do not have permission to access this data.";
    case "unavailable":
      return "Service is temporarily unavailable. Please try again later.";
    case "not-found":
      return "The requested data could not be found.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};

export const parseFirebaseError = (error: unknown): string => {
  // Type guard for Firebase errors
  if (error && typeof error === "object" && "code" in error) {
    return getFirebaseErrorMessage(error.code as string);
  }

  // Type guard for errors with message
  if (error && typeof error === "object" && "message" in error) {
    const message = error.message as string;
    // Extract Firebase error code from message if present
    const codeMatch = message.match(/\(([^)]+)\)/);
    if (codeMatch) {
      return getFirebaseErrorMessage(codeMatch[1]);
    }
    return message;
  }

  return "An unexpected error occurred. Please try again.";
};

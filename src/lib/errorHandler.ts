
/**
 * Converts Firebase Auth & Firestore error codes into user-friendly English messages
 * @param error - Firebase error object
 * @returns string - human-readable error message
 */
export function getFirebaseErrorMessage(error: string): string {
    switch (error) {
        case "auth/user-not-found":
            return "No account found with this email address.";
        case "auth/wrong-password":
            return "Incorrect password. Please try again.";
        case "auth/invalid-email":
            return "The email address is badly formatted.";
        case "auth/email-already-in-use":
            return "This email address is already in use.";
        case "auth/weak-password":
            return "The password is too weak. Please choose a stronger password.";
        case "auth/missing-password":
            return "Please enter your password.";
        case "auth/missing-email":
            return "Please enter your email address.";
        case "auth/too-many-requests":
            return "Too many attempts. Please try again later.";
        case "auth/network-request-failed":
            return "Network error. Please check your internet connection.";
        case "auth/invalid-credential":
            return "Invalid credentials. Please check your email and password.";
        case "auth/user-disabled":
            return "Your account has been disabled.";
        case "auth/operation-not-allowed":
            return "This sign in method is not enabled.";
        case "auth/missing-username":
            return "Please enter your username.";
        case "permission-denied":
            return "You do not have permission to perform this action.";
        default:
            return "An unexpected error occurred. Please try again.";
    }
}


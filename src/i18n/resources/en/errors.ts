const errors = {
  // Generic errors
  generic: "Something went wrong. Please try again.",
  network: "Network error. Check your internet connection.",

  // Auth errors
  auth: {
    loginFailed: "Login failed. Check your credentials.",
    registerFailed: "Registration failed. Please try again.",
    invalidCredentials: "Invalid email or password.",
    emailExists: "Email already exists.",
    verifyCodeFailed: "Invalid verification code.",
    sendCodeFailed: "Failed to send verification code.",
    resetPasswordFailed: "Failed to reset password.",
    logoutFailed: "Failed to logout.",
  },

  // Profile errors
  profile: {
    updateFailed: "Failed to update profile.",
    updatePasswordFailed: "Failed to update password.",
    deleteAccountFailed: "Failed to delete account.",
    updateLanguageFailed: "Failed to update language.",
    loadFailed: "Failed to load profile data.",
  },
};

export default errors;

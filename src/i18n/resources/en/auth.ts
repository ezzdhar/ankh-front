const auth = {
  login: {
    welcome: "Welcome Back !",
    subtitle: "Login to continue",
    tabs: {
      email: "Email",
      phone: "Phone",
    },
    email: {
      label: "Email",
      placeholder: "Enter Your Email",
    },
    phone: {
      label: "Phone Number",
      placeholder: "Enter Your Phone Number",
    },
    password: {
      label: "Password",
      placeholder: "Enter Password",
    },
    rememberMe: "Remember me",
    forgotPassword: "Forgot Password ?",
    submit: "Login",
    or: "Or",
    google: "Continue with Google",
    loginRequired: "You must login first to add products to cart",
    register: {
      text: "Don't have an account?",
      link: "Register now",
    },
  },
  changePassword: {
    title: "Change Password",
    subtitle: "Update your account password",
    currentPassword: {
      label: "Current Password",
      placeholder: "Enter Current Password",
    },
    newPassword: {
      label: "New Password",
      placeholder: "Enter New Password",
      hint: "Must contain at least 8 characters",
    },
    confirmPassword: {
      label: "Confirm New Password",
      placeholder: "Enter New Password",
    },
    submit: "Update Password",
    cancel: "Cancel",
  },
  register: {
    title: "Create New Account",
    subtitle: "Join us and start shopping now",
    fullName: {
      label: "Full Name",
      placeholder: "Enter Your Name",
    },
    email: {
      label: "Email",
      placeholder: "Enter Your Email",
    },
    phone: {
      label: "Phone Number",
      placeholder: "10 02694325",
    },
    password: {
      label: "Password",
      placeholder: "Enter Your Password",
    },
    confirmPassword: {
      label: "Confirm Password",
      placeholder: "Re-Enter Your Password",
    },
    submit: "Register",
    footer: {
      text: "Already have an account?",
      link: "Login",
    },
  },
  otp: {
    title: "Verify Code",
    subtitle: "Enter the 6-digit code sent to your email.",
    submit: "Verify",
    resendIn: "Resend in",
    resendSuccess: "New code sent successfully",
    invalidCode: "Invalid code, please try again",
    footer: {
      text: "Didn't receive the code?",
      link: "Resend",
    },
  },
  forgotPassword: {
    title: "Forgot Password?",
    subtitle:
      "Enter your email address and we'll send you a code to reset your password.",
    submit: "Send Verification Code",
    backToLogin: "Back to Login",
  },
  resetPassword: {
    title: "Set New Password",
    subtitle: "Create a new password for your account.",
    newPassword: {
      label: "New Password",
      placeholder: "Enter new password",
    },
    confirmPassword: {
      label: "Confirm Password",
      placeholder: "Re-enter password",
    },
    submit: "Reset Password",
  },
  logout: "Logout",
  validation: {
    emailRequired: "Email is required",
    emailInvalid: "Invalid email address",
    phoneRequired: "Phone number is required",
    phoneInvalid: "Invalid phone number",
    passwordRequired: "Password is required",
    passwordLength: "Password must be at least 8 characters",
    passwordMismatch: "Passwords do not match",
    currentPasswordRequired: "Current password is required",
    fullNameRequired: "Full name is required",
    governorateRequired: "Governorate is required",
    cityRequired: "City / Area is required",
    streetRequired: "Street name is required",
    buildingRequired: "Building number is required",
  },
};

export default auth;

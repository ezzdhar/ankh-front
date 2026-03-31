const errors = {
  // Generic errors
  generic: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
  network: "خطأ في الاتصال. تحقق من اتصالك بالإنترنت.",

  // Auth errors
  auth: {
    loginFailed: "فشل تسجيل الدخول. تحقق من بياناتك.",
    registerFailed: "فشل إنشاء الحساب. حاول مرة أخرى.",
    invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    emailExists: "البريد الإلكتروني مستخدم بالفعل.",
    verifyCodeFailed: "رمز التحقق غير صحيح.",
    sendCodeFailed: "فشل إرسال رمز التحقق.",
    resetPasswordFailed: "فشل إعادة تعيين كلمة المرور.",
    logoutFailed: "فشل تسجيل الخروج.",
  },

  // Profile errors
  profile: {
    updateFailed: "فشل تحديث الملف الشخصي.",
    updatePasswordFailed: "فشل تحديث كلمة المرور.",
    deleteAccountFailed: "فشل حذف الحساب.",
    updateLanguageFailed: "فشل تحديث اللغة.",
    loadFailed: "فشل تحميل بيانات الملف الشخصي.",
  },
};

export default errors;

const auth = {
  login: {
    welcome: "أهلاً بعودتك !",
    subtitle: "سجل الدخول للمتابعة",
    tabs: {
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
    },
    email: {
      label: "البريد الإلكتروني",
      placeholder: "أدخل بريدك الإلكتروني",
    },
    phone: {
      label: "رقم الهاتف",
      placeholder: "أدخل رقم هاتفك",
    },
    password: {
      label: "كلمة المرور",
      placeholder: "أدخل كلمة المرور",
    },
    rememberMe: "تذكرني",
    forgotPassword: "نسيت كلمة المرور ؟",
    submit: "تسجيل الدخول",
    or: "أو",
    google: "המتابعة باستخدام جوجل",
    loginRequired: "يجب تسجيل الدخول أولاً لإضافة المنتجات للسلة",
    register: {
      text: "ليس لديك حساب؟",
      link: "سجل الآن",
    },
  },
  changePassword: {
    title: "تغيير كلمة المرور",
    subtitle: "تحديث كلمة مرور حسابك",
    currentPassword: {
      label: "كلمة المرور الحالية",
      placeholder: "أدخل كلمة المرور الحالية",
    },
    newPassword: {
      label: "كلمة المرور الجديدة",
      placeholder: "أدخل كلمة المرور الجديدة",
      hint: "يجب أن تحتوي على 8 أحرف على الأقل",
    },
    confirmPassword: {
      label: "تأكيد كلمة المرور الجديدة",
      placeholder: "أدخل كلمة المرور الجديدة",
    },
    submit: "تحديث كلمة المرور",
    cancel: "إلغاء",
  },
  register: {
    title: "إنشاء حساب جديد",
    subtitle: "انضم إلينا وابدأ التسوق الآن",
    fullName: {
      label: "الاسم الكامل",
      placeholder: "أدخل اسمك",
    },
    email: {
      label: "البريد الإلكتروني",
      placeholder: "أدخل بريدك الإلكتروني",
    },
    phone: {
      label: "رقم الهاتف",
      placeholder: "10 02694325",
    },
    password: {
      label: "كلمة المرور",
      placeholder: "أدخل كلمة المرور",
    },
    confirmPassword: {
      label: "تأكيد كلمة المرور",
      placeholder: "أعد إدخال كلمة المرور",
    },
    submit: "إنشاء حساب",
    footer: {
      text: "لديك حساب بالفعل؟",
      link: "تسجيل الدخول",
    },
  },
  otp: {
    title: "التحقق من الرمز",
    subtitle: "أدخل الرمز المكون من 6 أرقام المرسل إلى بريدك الإلكتروني.",
    submit: "تحقق",
    resendIn: "إعادة الإرسال خلال",
    resendSuccess: "تم إرسال رمز جديد بنجاح",
    invalidCode: "الرمز غير صحيح، يرجى المحاولة مرة أخرى",
    footer: {
      text: "لم تستلم الرمز؟",
      link: "إعادة إرسال",
    },
  },
  forgotPassword: {
    title: "نسيت كلمة المرور؟",
    subtitle: "أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق لاستعادة حسابك.",
    submit: "إرسال رمز التحقق",
    backToLogin: "العودة لتسجيل الدخول",
  },
  resetPassword: {
    title: "تعيين كلمة مرور جديدة",
    subtitle: "قم بإنشاء كلمة مرور جديدة لحسابك.",
    newPassword: {
      label: "كلمة المرور الجديدة",
      placeholder: "أدخل كلمة المرور الجديدة",
    },
    confirmPassword: {
      label: "تأكيد كلمة المرور",
      placeholder: "أعد إدخال كلمة المرور",
    },
    submit: "تغيير كلمة المرور",
  },
  logout: "تسجيل الخروج",
  validation: {
    emailRequired: "البريد الإلكتروني مطلوب",
    emailInvalid: "بريد إلكتروني غير صالح",
    phoneRequired: "رقم الهاتف مطلوب",
    phoneInvalid: "رقم الهاتف غير صالح",
    passwordRequired: "كلمة المرور مطلوبة",
    passwordLength: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
    passwordMismatch: "كلمات المرور غير متطابقة",
    currentPasswordRequired: "كلمة المرور الحالية مطلوبة",
    fullNameRequired: "الاسم الكامل مطلوب",
    governorateRequired: "المحافظة مطلوبة",
    cityRequired: "المدينة / المنطقة مطلوبة",
    streetRequired: "اسم الشارع مطلوب",
    buildingRequired: "رقم المبنى مطلوب",
  },
};

export default auth;

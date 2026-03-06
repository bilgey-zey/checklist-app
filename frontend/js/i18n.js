const SUPPORTED_LOCALES = ["en", "tr", "no"];
const LOCALE_STORAGE_KEY = "appLocale";

const DICTIONARY = {
  en: {
    appName: "Shared Checklist",
    appTagline: "Organize tasks together, even when you are offline.",

    // Auth
    login: "Login",
    register: "Register",
    submit: "Submit",
    email: "Email",
    password: "Password",
    loading: "Loading…",
    loginSuccess: "Login successful!",
    registerSuccess: "Register successful! You can now login.",
    toggleToRegister: "Don't have an account? Register",
    toggleToLogin: "Already have an account? Login",

    // Todos
    myChecklists: "My Checklists",
    todosSubtitle: "Create, complete and share your checklists with others.",
    tabMine: "My checklists",
    tabShared: "Shared with me",
    logout: "Logout",
    newChecklistTitle: "New checklist title",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    shareChecklist: "Share Checklist",
    userEmail: "User email",
    shareAll: "Share all my checklists",
    shareEmailRequired: "Enter email",
    editPromptTitle: "Edit checklist title:",
    emptyMineTitle: "You don't have any checklists yet.",
    emptyMineText: "Use the field above to create your first checklist item.",
    emptySharedTitle: "Nothing has been shared with you yet.",
    emptySharedText: "Ask a teammate to share a checklist with your email address.",

    // Offline
    offlineTitle: "You are offline",
    offlineBody:
      "The app shell is available, but live server data is currently unavailable.",

    // Server/client error surfaces
    emailPasswordRequired: "Email and password required",
    userExists: "User already exists",
    invalidCredentials: "Invalid credentials",
    serverError: "Server error",
    notAuthenticated: "Not authenticated",
    deleted: "Deleted",
    notAllowed: "Not allowed",
    updateFailed: "Update failed",
    toggleFailed: "Toggle failed",
    shareFailed: "Share failed",
    accessDenied: "Access denied",
    allShared: "All checklists shared successfully",
    userMustBeRegistered:
      "The user must be registered in the application to share this checklist."
  },
  tr: {
    appName: "Paylaşımlı Checklist",
    appTagline: "Görevleri birlikte yönetin, çevrimdışıyken bile.",

    // Auth
    login: "Giriş yap",
    register: "Kayıt ol",
    submit: "Gönder",
    email: "E-posta",
    password: "Şifre",
    loading: "Yükleniyor…",
    loginSuccess: "Giriş başarılı!",
    registerSuccess: "Kayıt başarılı! Artık giriş yapabilirsiniz.",
    toggleToRegister: "Hesabın yok mu? Kayıt ol",
    toggleToLogin: "Zaten hesabın var mı? Giriş yap",

    // Todos
    myChecklists: "Checklistlerim",
    todosSubtitle: "Checklistlerini oluştur, tamamla ve başkalarıyla paylaş.",
    tabMine: "Checklistlerim",
    tabShared: "Benimle paylaşılanlar",
    logout: "Çıkış yap",
    newChecklistTitle: "Yeni checklist başlığı",
    add: "Ekle",
    edit: "Düzenle",
    delete: "Sil",
    shareChecklist: "Checklist Paylaş",
    userEmail: "Kullanıcı e-postası",
    shareAll: "Tüm checklistlerimi paylaş",
    shareEmailRequired: "E-posta girin",
    editPromptTitle: "Checklist başlığını düzenle:",
    emptyMineTitle: "Henüz hiçbir checklist'in yok.",
    emptyMineText: "Yukarıdaki alanı kullanarak ilk checklist öğeni oluşturabilirsin.",
    emptySharedTitle: "Seninle paylaşılan checklist yok.",
    emptySharedText: "Bir arkadaşından e-posta adresinle bir checklist paylaşmasını isteyebilirsin.",

    // Offline
    offlineTitle: "Çevrimdışısınız",
    offlineBody:
      "Uygulama arayüzü kullanılabilir; ancak canlı sunucu verileri şu anda erişilemiyor.",

    // Server/client error surfaces
    emailPasswordRequired: "E-posta ve şifre gerekli",
    userExists: "Bu kullanıcı zaten kayıtlı",
    invalidCredentials: "E-posta veya şifre hatalı",
    serverError: "Sunucu hatası",
    notAuthenticated: "Oturum açılmadı",
    deleted: "Silindi",
    notAllowed: "İzin yok",
    updateFailed: "Güncelleme başarısız",
    toggleFailed: "Durum değiştirilemedi",
    shareFailed: "Paylaşım başarısız",
    accessDenied: "Erişim reddedildi",
    allShared: "Tüm checklistler başarıyla paylaşıldı",
    userMustBeRegistered:
      "Bu checklisti paylaşmak için kullanıcı uygulamada kayıtlı olmalıdır."
  },
  no: {
    appName: "Delt sjekkliste",
    appTagline: "Organiser oppgaver sammen, selv uten nett.",

    // Auth
    login: "Logg inn",
    register: "Registrer deg",
    submit: "Send",
    email: "E-post",
    password: "Passord",
    loading: "Laster…",
    loginSuccess: "Innlogging vellykket!",
    registerSuccess: "Registrering vellykket! Du kan nå logge inn.",
    toggleToRegister: "Har du ikke konto? Registrer deg",
    toggleToLogin: "Har du allerede konto? Logg inn",

    // Todos
    myChecklists: "Sjekklistene mine",
    todosSubtitle: "Opprett, fullfør og del sjekklister med andre.",
    logout: "Logg ut",
    newChecklistTitle: "Ny sjekkliste tittel",
    add: "Legg til",
    edit: "Rediger",
    delete: "Slett",
    shareChecklist: "Del sjekkliste",
    userEmail: "Brukers e-post",
    shareAll: "Del alle sjekklistene mine",
    shareEmailRequired: "Skriv inn e-post",
    editPromptTitle: "Rediger tittel på sjekkliste:",
    emptyMineTitle: "Du har ingen sjekklister ennå.",
    emptyMineText: "Bruk feltet over for å lage din første sjekkliste.",
    emptySharedTitle: "Ingenting er delt med deg ennå.",
    emptySharedText: "Be en venn om å dele en sjekkliste med e-posten din.",

    // Offline
    offlineTitle: "Du er frakoblet",
    offlineBody:
      "Appskallet er tilgjengelig, men live data fra serveren er ikke tilgjengelig nå.",

    // Server/client error surfaces
    emailPasswordRequired: "E-post og passord er påkrevd",
    userExists: "Brukeren finnes allerede",
    invalidCredentials: "Ugyldig brukernavn eller passord",
    serverError: "Serverfeil",
    notAuthenticated: "Ikke autentisert",
    deleted: "Slettet",
    notAllowed: "Ikke tillatt",
    updateFailed: "Oppdatering feilet",
    toggleFailed: "Veksling feilet",
    shareFailed: "Deling feilet",
    accessDenied: "Ingen tilgang",
    allShared: "Alle sjekklister delt",
    userMustBeRegistered:
      "Brukeren må være registrert i appen for å dele denne sjekklisten."
  }
};

function normalizeLocale(locale) {
  const base = (locale || "").toLowerCase().split("-")[0];
  return SUPPORTED_LOCALES.includes(base) ? base : "en";
}

export function getLocale() {
  let stored = null;
  try {
    stored = typeof localStorage !== "undefined"
      ? localStorage.getItem(LOCALE_STORAGE_KEY)
      : null;
  } catch {
    stored = null;
  }

  if (stored) {
    return normalizeLocale(stored);
  }

  const preferred = Array.isArray(navigator.languages) && navigator.languages.length
    ? navigator.languages[0]
    : navigator.language;
  return normalizeLocale(preferred);
}

export function setLocale(locale) {
  const normalized = normalizeLocale(locale);
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(LOCALE_STORAGE_KEY, normalized);
    }
  } catch {
    // ignore
  }
  return normalized;
}

export function t(key) {
  const locale = getLocale();
  return (
    (DICTIONARY[locale] && DICTIONARY[locale][key]) ||
    (DICTIONARY.en && DICTIONARY.en[key]) ||
    key
  );
}

export function applyDocumentLocale() {
  const locale = getLocale();
  document.documentElement.lang = locale;
}

export function applyAuthPageTranslations({ isLogin }) {
  applyDocumentLocale();

  const formTitle = document.getElementById("formTitle");
  const toggleBtn = document.getElementById("toggleBtn");
  const submitBtn = document.getElementById("submitBtn");
  const emailLabel = document.getElementById("emailLabel");
  const passwordLabel = document.getElementById("passwordLabel");
  const appTitle = document.getElementById("appTitle");
  const appTagline = document.getElementById("appTagline");

  if (formTitle) formTitle.innerText = isLogin ? t("login") : t("register");
  if (toggleBtn) toggleBtn.innerText = isLogin ? t("toggleToRegister") : t("toggleToLogin");
  if (submitBtn) submitBtn.innerText = t("submit");
  if (emailLabel) emailLabel.innerText = t("email");
  if (passwordLabel) passwordLabel.innerText = t("password");
  if (appTitle) appTitle.innerText = t("appName");
  if (appTagline) appTagline.innerText = t("appTagline");
}

export function applyTodosPageTranslations() {
  applyDocumentLocale();

  const title = document.getElementById("pageTitle");
  const h2 = document.getElementById("todosTitle");
  const todosSubtitle = document.getElementById("todosSubtitle");
  const logoutBtn = document.getElementById("logoutBtn");
  const newTodo = document.getElementById("newTodo");
  const addBtn = document.getElementById("addBtn");
  const shareH3 = document.getElementById("shareTitle");
  const shareEmail = document.getElementById("shareEmail");
  const shareBtn = document.getElementById("shareBtn");
  const shareEmailLabel = document.getElementById("shareEmailLabel");
  const newTodoLabel = document.getElementById("newTodoLabel");
  const emptyTitle = document.getElementById("emptyTitle");
  const emptyText = document.getElementById("emptyText");
  const tabMine = document.getElementById("tabMine");
  const tabShared = document.getElementById("tabShared");

  if (title) title.innerText = t("myChecklists");
  if (h2) h2.innerText = t("myChecklists");
  if (todosSubtitle) todosSubtitle.innerText = t("todosSubtitle");
  if (logoutBtn) logoutBtn.innerText = t("logout");
  if (newTodo) newTodo.placeholder = t("newChecklistTitle");
  if (addBtn) addBtn.innerText = t("add");
  if (shareH3) shareH3.innerText = t("shareChecklist");
  if (shareEmail) shareEmail.placeholder = t("userEmail");
  if (shareBtn) shareBtn.innerText = t("shareAll");
  if (shareEmailLabel) shareEmailLabel.innerText = t("userEmail");
  if (newTodoLabel) newTodoLabel.innerText = t("newChecklistTitle");
  if (emptyTitle) emptyTitle.innerText = t("emptyMineTitle");
  if (emptyText) emptyText.innerText = t("emptyMineText");
  if (tabMine) tabMine.innerText = t("tabMine");
  if (tabShared) tabShared.innerText = t("tabShared");
}

export function applyOfflinePageTranslations() {
  applyDocumentLocale();
  const title = document.getElementById("offlineTitle");
  const body = document.getElementById("offlineBody");
  if (title) title.innerText = t("offlineTitle");
  if (body) body.innerText = t("offlineBody");
}

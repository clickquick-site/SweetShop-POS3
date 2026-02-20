

/* ================================================
   TRANSLATIONS — نظام الترجمة
================================================ */
const TRANSLATIONS = {
  ar: {
    login_title:"تسجيل الدخول", login_btn:"دخول", logout:"خروج",
    pin_placeholder:"رمز PIN",
    menu_sale:"واجهة البيع", menu_stock:"📦 المخزون",
    menu_customers:"👥 الزبائن", menu_users:"👤 إدارة المستخدمين",
    menu_reports:"📊 إدارة الأعمال", menu_settings:"⚙️ الإعدادات",
    back:"الرجوع",
    sale_title:"واجهة البيع",
    search_placeholder:"اسم أو باركود",
    add_btn:"➕ إضافة",
    col_item:"سلعة", col_qty:"كمية", col_price:"سعر",
    col_total:"مجموع", col_options:"خيارات",
    col_name:"الاسم", col_role:"الدور",
    paid_placeholder:"المبلغ المدفوع",
    pay_btn:"✅ تسديد", partial_btn:"💰 جزئي", debt_btn:"📋 دين",
    // مخزون
    tab_families:"العائلات", tab_brands:"الماركات", tab_all_stock:"كل السلع",
    families_title:"📁 العائلات — نوع المنتج",
    brands_title:"🏷️ الماركات — عائلة المنتج",
    add_product_title:"➕ إضافة منتج جديد",
    all_products:"📋 كل المنتجات",
    family_ph:"أدخل اسم العائلة...",
    brand_ph:"أدخل اسم الماركة...",
    add_family:"➕ إضافة", add_brand:"➕ إضافة",
    family_label:"العائلة", brand_label:"الماركة",
    size_label:"الحجم / المقاس", barcode_label:"باركود",
    price_label:"سعر البيع", cost_label:"سعر الشراء",
    qty_label:"الكمية", exp_label:"تاريخ الصلاحية",
    save_item:"💾 حفظ المنتج",
    stock_search_ph:"🔍 بحث في المخزون...",
    edit_btn:"تعديل", del_btn:"مسح",
    // تقارير
    tab_day:"اليوم", tab_week:"الأسبوع", tab_month:"الشهر",
    tab_year:"السنة", tab_all:"الكل",
    r_sales:"عمليات البيع", r_revenue:"المداخيل",
    r_cost:"تكلفة الشراء", r_profit:"صافي الربح",
    debts_title:"📋 تتبع الديون",
    total_debts:"إجمالي الديون", debtors_count:"عدد المدينين",
    sales_log:"📜 سجل العمليات",
    settle_btn:"تسوية",
    no_debts:"لا توجد ديون 🎉", no_sales:"لا توجد عمليات",
    // إعدادات
    stab_app:"🖥️ البرنامج", stab_store:"🏪 المتجر",
    stab_print:"🖨️ الطباعة", stab_system:"🔧 النظام",
    date_format:"صيغة التاريخ", time_format:"صيغة الوقت",
    currency_label:"رمز العملة", lang_label:"لغة البرنامج",
    save_app:"💾 حفظ إعدادات البرنامج",
    logo_label:"شعار المتجر",
    upload_logo:"📷 تحميل الشعار", remove_logo:"🗑️ حذف",
    shop_name:"اسم المتجر", phone_label:"رقم الهاتف",
    address_label:"العنوان", welcome_label:"رسالة ترحيب للفاتورة",
    save_store:"💾 حفظ بيانات المتجر",
    invoice_num:"رقم الفاتورة الحالي (قابل للتعديل)",
    printer_label:"اختيار الطابعة", paper_size:"مقاس الورق",
    copies_label:"عدد النسخ",
    print_logo:"طباعة شعار المتجر", print_name:"طباعة اسم المتجر",
    print_phone:"طباعة رقم الهاتف", print_welcome:"طباعة رسالة الترحيب",
    print_barcode:"طباعة باركود المنتجات",
    print_cust_barcode:"طباعة باركود على ورقة الزبون",
    save_print:"💾 حفظ إعدادات الطباعة",
    auto_backup_title:"💾 سجل العمليات والنسخ التلقائي",
    auto_backup_desc:"تفعيل النسخ اليومي التلقائي لبيانات التطبيق وسجل العمليات.",
    auto_backup_toggle:"تفعيل النسخ اليومي التلقائي",
    manual_backup:"📥 نسخ احتياطي الآن",
    reset_btn:"🔴 إعادة ضبط النظام",
    reset_warning:"⚠️ تحذير: هذا الجزء سيقوم بحذف جميع البيانات (المنتجات، الفواتير، الزبائن، التقارير) وإعادة البرنامج لحالته الأصلية من البداية.",
    customer_ph:"اسم الزبون",
    username_ph:"اسم المستخدم",
    role_seller:"بائع", role_manager:"مدير",
    add_user:"➕ إضافة",
    lang_preview:"سيتم تطبيق اللغة بعد الحفظ.",
    // رسائل
    msg_select_user:"اختر المستخدم أولاً",
    msg_wrong_pin:"اسم المستخدم أو الرمز خاطئ",
    msg_saved:"✅ تم الحفظ بنجاح!",
    msg_family_exists:"هذه العائلة موجودة مسبقاً",
    msg_brand_exists:"هذه الماركة موجودة مسبقاً",
    msg_select_family:"اختر العائلة أولاً",
    msg_barcode_exists:"هذا الباركود موجود مسبقاً",
    msg_item_updated:"المنتج موجود — تم تحديث الكمية!",
    msg_item_saved:"✅ تم إضافة المنتج بنجاح!",
    msg_fill_all:"الرجاء إدخال كل البيانات بشكل صحيح!",
    msg_no_cart:"لا يوجد منتجات في العربة!",
    msg_low_balance:"المبلغ المدفوع أقل من الإجمالي",
    msg_sold:"✅ تم تسجيل البيع بنجاح!",
    msg_change:"✅ تم البيع!\nالباقي للزبون: ",
    msg_partial_ok:"✅ دفع جزئي!\nمدفوع: ",
    msg_partial_rem:"\nمتبقي: ",
    msg_need_amount:"أدخل المبلغ المدفوع جزئياً",
    msg_covers_all:"المبلغ يغطي الكل، استخدم 'تسديد'",
    msg_select_customer:"اختر زبوناً لتسجيل الدين عليه",
    msg_debt_ok:"✅ تم تسجيل الدين على ",
    msg_debt_amount:"\nالمبلغ: ",
    msg_out_of_stock:"هذا المنتج نفذ من المخزون!",
    msg_not_enough:"لا يوجد مخزون كافٍ!",
    msg_not_found:"المنتج غير موجود في المخزون",
    msg_enter_search:"أدخل اسم السلعة أو الباركود",
    msg_customer_exists:"الزبون موجود مسبقاً",
    msg_enter_customer:"أدخل اسم الزبون",
    msg_user_exists:"اسم المستخدم موجود مسبقًا",
    msg_pin_format:"الرجاء إدخال اسم صحيح وPIN من 4 أرقام",
    msg_pin_4:"PIN يجب أن يكون 4 أرقام",
    msg_cant_delete:"لا يمكن حذف هذا المستخدم",
    msg_confirm_delete_user:"هل أنت متأكد من حذف هذا المستخدم؟",
    msg_confirm_delete:"حذف المنتج؟",
    msg_confirm_delete_customer:"هل أنت متأكد من حذف هذا الزبون؟",
    msg_confirm_delete_family:"حذف هذه العائلة؟ سيتم حذف ماركاتها أيضاً.",
    msg_confirm_delete_brand:"حذف هذه الماركة؟",
    msg_backup_done:"✅ تم تنزيل النسخة الاحتياطية!",
    msg_backup_auto_on:"✅ تم تفعيل النسخ التلقائي اليومي.",
    msg_backup_auto_off:"تم إيقاف النسخ التلقائي.",
    msg_reset_confirm:"اكتب 'نعم' للتأكيد:",
    msg_reset_done:"✅ تم إعادة ضبط النظام.",
    msg_reset_cancel:"تم إلغاء العملية.",
    settle_prompt:"أدخل المبلغ المدفوع:",
    settle_ok:"✅ تم تسجيل دفع ",
    settle_from:" من ",
    no_stock:"المخزون فارغ",
    no_families:"لا توجد عائلات بعد",
    no_brands:"لا توجد ماركات بعد",
    no_customers:"لا يوجد زبائن بعد",
  },

  fr: {
    login_title:"Connexion", login_btn:"Entrer", logout:"Déconnexion",
    pin_placeholder:"Code PIN",
    menu_sale:"Vente", menu_stock:"📦 Stock",
    menu_customers:"👥 Clients", menu_users:"👤 Utilisateurs",
    menu_reports:"📊 Gestion", menu_settings:"⚙️ Paramètres",
    back:"Retour",
    sale_title:"Interface de vente",
    search_placeholder:"Nom ou code-barres",
    add_btn:"➕ Ajouter",
    col_item:"Article", col_qty:"Qté", col_price:"Prix",
    col_total:"Total", col_options:"Options",
    col_name:"Nom", col_role:"Rôle",
    paid_placeholder:"Montant payé",
    pay_btn:"✅ Payer", partial_btn:"💰 Partiel", debt_btn:"📋 Crédit",
    tab_families:"Familles", tab_brands:"Marques", tab_all_stock:"Tous les articles",
    families_title:"📁 Familles — Type de produit",
    brands_title:"🏷️ Marques — Famille de produit",
    add_product_title:"➕ Ajouter un produit",
    all_products:"📋 Tous les produits",
    family_ph:"Entrer le nom de la famille...",
    brand_ph:"Entrer le nom de la marque...",
    add_family:"➕ Ajouter", add_brand:"➕ Ajouter",
    family_label:"Famille", brand_label:"Marque",
    size_label:"Taille / Format", barcode_label:"Code-barres",
    price_label:"Prix de vente", cost_label:"Prix d'achat",
    qty_label:"Quantité", exp_label:"Date d'expiration",
    save_item:"💾 Enregistrer",
    stock_search_ph:"🔍 Rechercher dans le stock...",
    edit_btn:"Modifier", del_btn:"Supprimer",
    tab_day:"Aujourd'hui", tab_week:"Semaine", tab_month:"Mois",
    tab_year:"Année", tab_all:"Tout",
    r_sales:"Ventes", r_revenue:"Revenus",
    r_cost:"Coût d'achat", r_profit:"Bénéfice net",
    debts_title:"📋 Suivi des dettes",
    total_debts:"Total dettes", debtors_count:"Nb débiteurs",
    sales_log:"📜 Journal des opérations",
    settle_btn:"Régler",
    no_debts:"Pas de dettes 🎉", no_sales:"Pas d'opérations",
    stab_app:"🖥️ Programme", stab_store:"🏪 Boutique",
    stab_print:"🖨️ Impression", stab_system:"🔧 Système",
    date_format:"Format de date", time_format:"Format de l'heure",
    currency_label:"Symbole monétaire", lang_label:"Langue",
    save_app:"💾 Sauvegarder",
    logo_label:"Logo de la boutique",
    upload_logo:"📷 Charger logo", remove_logo:"🗑️ Supprimer",
    shop_name:"Nom de la boutique", phone_label:"Téléphone",
    address_label:"Adresse", welcome_label:"Message de bienvenue",
    save_store:"💾 Sauvegarder",
    invoice_num:"Numéro de facture",
    printer_label:"Imprimante", paper_size:"Format papier",
    copies_label:"Nombre de copies",
    print_logo:"Imprimer logo", print_name:"Imprimer nom boutique",
    print_phone:"Imprimer téléphone", print_welcome:"Imprimer message accueil",
    print_barcode:"Imprimer codes-barres produits",
    print_cust_barcode:"Imprimer code-barres client",
    save_print:"💾 Sauvegarder",
    auto_backup_title:"💾 Sauvegarde automatique",
    auto_backup_desc:"Activer la sauvegarde quotidienne automatique des données.",
    auto_backup_toggle:"Activer la sauvegarde automatique quotidienne",
    manual_backup:"📥 Sauvegarder maintenant",
    reset_btn:"🔴 Réinitialiser le système",
    reset_warning:"⚠️ Attention : Cette action supprimera toutes les données (produits, factures, clients, rapports) et remettra le programme à son état initial.",
    customer_ph:"Nom du client",
    username_ph:"Nom d'utilisateur",
    role_seller:"Vendeur", role_manager:"Directeur",
    add_user:"➕ Ajouter",
    lang_preview:"La langue sera appliquée après sauvegarde.",
    msg_select_user:"Veuillez sélectionner un utilisateur",
    msg_wrong_pin:"Utilisateur ou PIN incorrect",
    msg_saved:"✅ Sauvegardé avec succès!",
    msg_family_exists:"Cette famille existe déjà",
    msg_brand_exists:"Cette marque existe déjà",
    msg_select_family:"Sélectionnez une famille d'abord",
    msg_barcode_exists:"Ce code-barres existe déjà",
    msg_item_updated:"Produit existant — quantité mise à jour!",
    msg_item_saved:"✅ Produit ajouté avec succès!",
    msg_fill_all:"Veuillez remplir tous les champs correctement!",
    msg_no_cart:"Aucun produit dans le panier!",
    msg_low_balance:"Montant payé inférieur au total",
    msg_sold:"✅ Vente enregistrée!",
    msg_change:"✅ Vente!\nMonnaie à rendre: ",
    msg_partial_ok:"✅ Paiement partiel!\nPayé: ",
    msg_partial_rem:"\nReste: ",
    msg_need_amount:"Entrez le montant partiel",
    msg_covers_all:"Le montant couvre tout, utilisez 'Payer'",
    msg_select_customer:"Sélectionnez un client pour le crédit",
    msg_debt_ok:"✅ Crédit enregistré pour ",
    msg_debt_amount:"\nMontant: ",
    msg_out_of_stock:"Produit en rupture de stock!",
    msg_not_enough:"Stock insuffisant!",
    msg_not_found:"Produit introuvable",
    msg_enter_search:"Entrez un nom ou code-barres",
    msg_customer_exists:"Ce client existe déjà",
    msg_enter_customer:"Entrez le nom du client",
    msg_user_exists:"Cet utilisateur existe déjà",
    msg_pin_format:"Entrez un nom valide et PIN à 4 chiffres",
    msg_pin_4:"Le PIN doit être 4 chiffres",
    msg_cant_delete:"Impossible de supprimer cet utilisateur",
    msg_confirm_delete_user:"Confirmer la suppression de cet utilisateur?",
    msg_confirm_delete:"Supprimer ce produit?",
    msg_confirm_delete_customer:"Confirmer la suppression de ce client?",
    msg_confirm_delete_family:"Supprimer cette famille? Ses marques seront supprimées.",
    msg_confirm_delete_brand:"Supprimer cette marque?",
    msg_backup_done:"✅ Sauvegarde téléchargée!",
    msg_backup_auto_on:"✅ Sauvegarde automatique activée.",
    msg_backup_auto_off:"Sauvegarde automatique désactivée.",
    msg_reset_confirm:"Tapez 'oui' pour confirmer:",
    msg_reset_done:"✅ Système réinitialisé.",
    msg_reset_cancel:"Opération annulée.",
    settle_prompt:"Entrez le montant payé:",
    settle_ok:"✅ Paiement enregistré: ",
    settle_from:" de ",
    no_stock:"Stock vide", no_families:"Pas encore de familles",
    no_brands:"Pas encore de marques", no_customers:"Pas encore de clients",
  },

  en: {
    login_title:"Login", login_btn:"Sign In", logout:"Logout",
    pin_placeholder:"PIN Code",
    menu_sale:"Sales", menu_stock:"📦 Stock",
    menu_customers:"👥 Customers", menu_users:"👤 Users",
    menu_reports:"📊 Business", menu_settings:"⚙️ Settings",
    back:"Back",
    sale_title:"Sales Interface",
    search_placeholder:"Name or barcode",
    add_btn:"➕ Add",
    col_item:"Item", col_qty:"Qty", col_price:"Price",
    col_total:"Total", col_options:"Options",
    col_name:"Name", col_role:"Role",
    paid_placeholder:"Amount paid",
    pay_btn:"✅ Pay", partial_btn:"💰 Partial", debt_btn:"📋 Credit",
    tab_families:"Families", tab_brands:"Brands", tab_all_stock:"All Items",
    families_title:"📁 Families — Product type",
    brands_title:"🏷️ Brands — Product family",
    add_product_title:"➕ Add New Product",
    all_products:"📋 All Products",
    family_ph:"Enter family name...",
    brand_ph:"Enter brand name...",
    add_family:"➕ Add", add_brand:"➕ Add",
    family_label:"Family", brand_label:"Brand",
    size_label:"Size / Format", barcode_label:"Barcode",
    price_label:"Sale price", cost_label:"Purchase price",
    qty_label:"Quantity", exp_label:"Expiry date",
    save_item:"💾 Save Product",
    stock_search_ph:"🔍 Search stock...",
    edit_btn:"Edit", del_btn:"Delete",
    tab_day:"Today", tab_week:"Week", tab_month:"Month",
    tab_year:"Year", tab_all:"All",
    r_sales:"Sales", r_revenue:"Revenue",
    r_cost:"Purchase cost", r_profit:"Net profit",
    debts_title:"📋 Debt Tracking",
    total_debts:"Total debts", debtors_count:"Debtors",
    sales_log:"📜 Operations Log",
    settle_btn:"Settle",
    no_debts:"No debts 🎉", no_sales:"No operations",
    stab_app:"🖥️ Program", stab_store:"🏪 Store",
    stab_print:"🖨️ Printing", stab_system:"🔧 System",
    date_format:"Date format", time_format:"Time format",
    currency_label:"Currency symbol", lang_label:"Language",
    save_app:"💾 Save Program Settings",
    logo_label:"Store logo",
    upload_logo:"📷 Upload logo", remove_logo:"🗑️ Remove",
    shop_name:"Store name", phone_label:"Phone number",
    address_label:"Address", welcome_label:"Invoice welcome message",
    save_store:"💾 Save Store Data",
    invoice_num:"Current invoice number",
    printer_label:"Printer", paper_size:"Paper size",
    copies_label:"Number of copies",
    print_logo:"Print store logo", print_name:"Print store name",
    print_phone:"Print phone number", print_welcome:"Print welcome message",
    print_barcode:"Print product barcodes",
    print_cust_barcode:"Print barcode on customer receipt",
    save_print:"💾 Save Print Settings",
    auto_backup_title:"💾 Operations Log & Auto Backup",
    auto_backup_desc:"Enable daily automatic backup of app data.",
    auto_backup_toggle:"Enable daily automatic backup",
    manual_backup:"📥 Backup Now",
    reset_btn:"🔴 Reset System",
    reset_warning:"⚠️ Warning: This will delete all data (products, invoices, customers, reports) and reset the program to its initial state.",
    customer_ph:"Customer name",
    username_ph:"Username",
    role_seller:"Seller", role_manager:"Manager",
    add_user:"➕ Add",
    lang_preview:"Language will be applied after saving.",
    msg_select_user:"Please select a user",
    msg_wrong_pin:"Incorrect username or PIN",
    msg_saved:"✅ Saved successfully!",
    msg_family_exists:"This family already exists",
    msg_brand_exists:"This brand already exists",
    msg_select_family:"Select a family first",
    msg_barcode_exists:"This barcode already exists",
    msg_item_updated:"Product exists — quantity updated!",
    msg_item_saved:"✅ Product added successfully!",
    msg_fill_all:"Please fill all fields correctly!",
    msg_no_cart:"No products in cart!",
    msg_low_balance:"Amount paid is less than total",
    msg_sold:"✅ Sale registered!",
    msg_change:"✅ Sale done!\nChange for customer: ",
    msg_partial_ok:"✅ Partial payment!\nPaid: ",
    msg_partial_rem:"\nRemaining: ",
    msg_need_amount:"Enter the partial amount",
    msg_covers_all:"Amount covers all, use 'Pay' instead",
    msg_select_customer:"Select a customer for credit",
    msg_debt_ok:"✅ Credit registered for ",
    msg_debt_amount:"\nAmount: ",
    msg_out_of_stock:"Product out of stock!",
    msg_not_enough:"Insufficient stock!",
    msg_not_found:"Product not found",
    msg_enter_search:"Enter a name or barcode",
    msg_customer_exists:"Customer already exists",
    msg_enter_customer:"Enter customer name",
    msg_user_exists:"Username already exists",
    msg_pin_format:"Enter valid name and 4-digit PIN",
    msg_pin_4:"PIN must be 4 digits",
    msg_cant_delete:"Cannot delete this user",
    msg_confirm_delete_user:"Confirm deleting this user?",
    msg_confirm_delete:"Delete this product?",
    msg_confirm_delete_customer:"Confirm deleting this customer?",
    msg_confirm_delete_family:"Delete this family? Its brands will also be removed.",
    msg_confirm_delete_brand:"Delete this brand?",
    msg_backup_done:"✅ Backup downloaded!",
    msg_backup_auto_on:"✅ Automatic daily backup enabled.",
    msg_backup_auto_off:"Automatic backup disabled.",
    msg_reset_confirm:"Type 'yes' to confirm:",
    msg_reset_done:"✅ System reset complete.",
    msg_reset_cancel:"Operation cancelled.",
    settle_prompt:"Enter amount paid:",
    settle_ok:"✅ Payment recorded: ",
    settle_from:" from ",
    no_stock:"Stock is empty", no_families:"No families yet",
    no_brands:"No brands yet", no_customers:"No customers yet",
  }
};


/* ================================================
   t() + applyTranslations
================================================ */
function t(key) {
  const lang = DB.settings.lang || "ar";
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) ||
         (TRANSLATIONS["ar"][key]) || key;
}

function applyTranslations() {
  const lang = DB.settings.lang || "ar";
  document.documentElement.lang = lang;
  document.documentElement.dir  = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.placeholder = t(key);
  });
}

function previewLangChange(lang) {
  const note = document.getElementById("langNote");
  if (note) note.textContent = TRANSLATIONS[lang]?.lang_preview || t("lang_preview");
}

/* ================================================
   DATABASE
================================================ */
let DB = JSON.parse(localStorage.getItem("POSDZ")) || {
  users:    [{ name: "Admin", pin: "1234", role: "manager", immutable: true }],
  settings: {
    name:"POS DZ", phone:"", addr:"", welcome:"",
    currency:"دج", lang:"ar",
    dateFormat:"DD-MM-YYYY", timeFormat:"24", logo:"",
    printer:"default", paperSize:"80mm", copies:1,
    printLogo:false, printShopName:true, printPhone:true,
    printWelcome:true, printBarcode:false, printCustBarcode:false,
    invoiceNum:1, autoBackup:false, lastBackup:""
  },
  families:[], brands:[], stock:[], cart:[],
  customers:[], debts:[], sales:[]
};

/* ================================================
   DOM ELEMENTS
================================================ */
const loginScreen    = document.getElementById("loginScreen");
const userSelect     = document.getElementById("userSelect");
const pinInput       = document.getElementById("pin");
const mainApp        = document.getElementById("mainApp");
const usersModal     = document.getElementById("usersModal");
const usersTableBody = document.querySelector("#usersTable tbody");
const addUserForm    = document.getElementById("addUserForm");
const newUserName    = document.getElementById("newUserName");
const newUserPin     = document.getElementById("newUserPin");
const newUserRole    = document.getElementById("newUserRole");
const alertUserName  = document.getElementById("alertUserName");
const alertUserPin   = document.getElementById("alertUserPin");
const alertUserRole  = document.getElementById("alertUserRole");
const addUserInAlerts= document.getElementById("addUserInAlerts");
const stockList      = document.getElementById("stockList");
const sideMenu       = document.getElementById("sideMenu");
const menuBtn        = document.getElementById("menuBtn");
const currentTimeEl  = document.getElementById("currentTime");
const currentDateEl  = document.getElementById("currentDate");
const salePage       = document.getElementById("sale");
const cartTableBody  = document.getElementById("cart");
const searchInput    = document.getElementById("search");
const custSelect     = document.getElementById("custSelect");
const totalEl        = document.getElementById("total");

/* ================================================
   UTILITY
================================================ */
function saveDB() { localStorage.setItem("POSDZ", JSON.stringify(DB)); }
function getCurrency() { return DB.settings.currency || "دج"; }
function formatPrice(val) { return Number(val).toFixed(2) + " " + getCurrency(); }

function formatDate(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  const dd = String(d.getDate()).padStart(2,"0");
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const yy = d.getFullYear();
  return (DB.settings.dateFormat||"DD-MM-YYYY")
    .replace("DD",dd).replace("MM",mm).replace("YYYY",yy);
}

function uid() { return Date.now().toString(36)+Math.random().toString(36).slice(2); }
function isSameDay(d1,d2){ return d1.toDateString()===d2.toDateString(); }
function isSameWeek(d1,d2){
  const sw=d=>{ const x=new Date(d); x.setDate(x.getDate()-x.getDay()); x.setHours(0,0,0,0); return x; };
  return sw(d1).getTime()===sw(d2).getTime();
}
function isSameMonth(d1,d2){ return d1.getFullYear()===d2.getFullYear()&&d1.getMonth()===d2.getMonth(); }
function isSameYear(d1,d2){ return d1.getFullYear()===d2.getFullYear(); }

/* ================================================
   TOAST SYSTEM — بدون alert() خارجي
================================================ */
function showToast(msg, type="success") {
  const toast = document.getElementById("globalToast");
  if (!toast) { console.log(msg); return; }
  const icons = { success:"✅", error:"❌", info:"ℹ️", warning:"⚠️" };
  toast.textContent = (icons[type]||"") + " " + msg;
  toast.className = "global-toast show";
  clearTimeout(toast._timer);
  toast._timer = setTimeout(()=>{ toast.classList.remove("show"); }, 3200);
}

function showMsgBox(id, msg, type="success") {
  const el = document.getElementById(id);
  if (!el) { showToast(msg, type); return; }
  el.textContent = msg;
  el.className = "toast-msg show " + type;
  clearTimeout(el._timer);
  el._timer = setTimeout(()=>{
    el.classList.remove("show");
    setTimeout(()=>{ el.textContent=""; el.className="toast-msg"; }, 300);
  }, 3500);
}

// Override window.alert
window.alert = function(msg) {
  if (document.getElementById("mainApp").style.display === "none") {
    const lm = document.getElementById("loginMsg");
    if (lm) {
      const isErr = /خاطئ|اختر|incorrect|Incorrect|Veuillez|sélectionnez/i.test(msg);
      lm.textContent = msg;
      lm.className = "login-msg " + (isErr ? "error" : "success");
      clearTimeout(lm._t);
      lm._t = setTimeout(()=>{ lm.className="login-msg"; lm.textContent=""; }, 4000);
      return;
    }
  }
  const type = /✅/.test(msg) ? "success" :
               /❌|خطأ|يجب|أدخل|الرجاء|لا يوجد|غير موجود|نفذ|موجود مسبق|insufficient|incorrect|introuvable|existe/i.test(msg) ? "error" : "info";
  showToast(msg, type);
};

window.confirm = function(msg) {
  return window._nativeConfirm ? window._nativeConfirm(msg) : window.__confirm(msg);
};
window.__confirm = window.confirm.bind(window);
// نبقي confirm أصلي للعمليات الحرجة
const _origConfirm = Function.prototype.call.bind(window.__proto__.__proto__.constructor.prototype.confirm || window.__proto__.confirm) ;

/* ================================================
   LOGIN
================================================ */
function renderUserSelect() {
  userSelect.innerHTML = `<option value="">— ${t("login_title")} —</option>`;
  DB.users.forEach(u => {
    const o = document.createElement("option");
    o.value=u.name; o.textContent=u.name;
    userSelect.appendChild(o);
  });
}

function login() {
  const name = userSelect.value;
  const pin  = pinInput.value.trim();
  if (!name) { showToast(t("msg_select_user"), "error"); return; }
  const user = DB.users.find(u=>u.name===name&&u.pin===pin);
  if (!user) {
    const lm = document.getElementById("loginMsg");
    if(lm){ lm.textContent=t("msg_wrong_pin"); lm.className="login-msg error"; clearTimeout(lm._t); lm._t=setTimeout(()=>{lm.className="login-msg";lm.textContent="";},4000); }
    return;
  }
  localStorage.setItem("POSDZ_LOGGED", JSON.stringify(user));
  pinInput.value = ""; // ← FIX: مسح PIN بعد الدخول
  loginScreen.style.display="none";
  mainApp.style.display="block";
  applyHeader(); showSale(); startClock();
}

function logout() {
  localStorage.removeItem("POSDZ_LOGGED");
  loginScreen.style.display="flex";
  mainApp.style.display="none";
  sideMenu.classList.add("hidden");
}

function applyHeader() {
  document.getElementById("shopName").textContent = DB.settings.name||"POS DZ";
  const logo=DB.settings.logo;
  const hl=document.getElementById("headerLogo");
  if (logo){ hl.src=logo; hl.style.display="block"; }
  else hl.style.display="none";

  // تطبيق الصلاحيات بناءً على الدور
  applyRolePermissions();
}

function applyRolePermissions() {
  const logged = JSON.parse(localStorage.getItem("POSDZ_LOGGED"));
  const role = logged ? logged.role : "baker";
  const isManager = role === "manager";

  // إخفاء قوائم المدير من العامل
  document.querySelectorAll("[data-role='manager']").forEach(el => {
    el.style.display = isManager ? "" : "none";
  });

  // زر الدين — العامل يستطيع البيع بالدين للزبائن المسجلين فقط
  // (الزر يبقى ظاهراً لكن يُفعَّل فقط إن كان زبون مختار)
  const debtBtn = document.getElementById("debtBtn");
  if (debtBtn && !isManager) {
    debtBtn.title = "البيع بالدين مسموح للزبائن المسجلين فقط";
  }
}

/* ================================================
   NAVIGATION — FIX: menu closes on any show()
================================================ */
function hideAllPages(){ document.querySelectorAll(".page").forEach(p=>p.classList.remove("active")); }

function showSale(){
  hideAllPages();
  salePage.classList.add("active");
  renderCustomerSelect();
  sideMenu.classList.add("hidden"); // ← دائماً يُغلق
}

function show(id){
  // تحقق من الصلاحيات
  const logged = JSON.parse(localStorage.getItem("POSDZ_LOGGED"));
  const role = logged ? logged.role : "baker";
  const restrictedPages = ["stock","alerts","reports","settings"];
  if (role !== "manager" && restrictedPages.includes(id)) {
    showToast("⛔ ليس لديك صلاحية الوصول", "error");
    sideMenu.classList.add("hidden");
    return;
  }
  hideAllPages();
  const page=document.getElementById(id);
  if (page) page.classList.add("active");
  sideMenu.classList.add("hidden"); // ← FIX: يُغلق دائماً
  if (id==="reports")   renderReports();
  if (id==="settings")  loadSettings();
  if (id==="alerts")    renderAlerts();
  if (id==="customers") renderCustomerList();
  if (id==="stock")     { renderFamilyList(); renderBrandList(); renderStock(); populateStockSelects(); }
}

function goBack(){ showSale(); }

/* ================================================
   MENU BUTTON — FIX: proper toggle
================================================ */
menuBtn.addEventListener("click", function(e){
  e.stopPropagation();
  sideMenu.classList.toggle("hidden");
});

document.addEventListener("click", function(e){
  if (!sideMenu.classList.contains("hidden") &&
      !sideMenu.contains(e.target) &&
      e.target !== menuBtn) {
    sideMenu.classList.add("hidden");
  }
});

/* ================================================
   SETTINGS
================================================ */
function loadSettings() {
  const s=DB.settings;
  document.getElementById("sDateFormat").value = s.dateFormat||"DD-MM-YYYY";
  document.getElementById("sTimeFormat").value = s.timeFormat||"24";
  // العملة — select بدلاً من input
  const currEl = document.getElementById("sCurrency");
  if (currEl) {
    const cur = s.currency || "دج";
    // حاول تطابق القيمة
    let matched = false;
    for (let opt of currEl.options) {
      if (opt.value === cur) { opt.selected = true; matched = true; break; }
    }
    // إن لم تُوجد، أضف خيار مخصص
    if (!matched) {
      const o = document.createElement("option");
      o.value = cur; o.textContent = cur; currEl.appendChild(o); currEl.value = cur;
    }
  }
  document.getElementById("sLang").value       = s.lang||"ar";
  document.getElementById("langNote").textContent = "";
  document.getElementById("sname").value    = s.name||"";
  document.getElementById("sphone").value   = s.phone||"";
  document.getElementById("saddr").value    = s.addr||"";
  document.getElementById("sWelcome").value = s.welcome||"";
  const lp=document.getElementById("logoPreview");
  if (s.logo&&lp){ lp.src=s.logo; lp.style.display="block"; }
  document.getElementById("sInvoiceNum").value      = s.invoiceNum||1;
  document.getElementById("sPrinter").value         = s.printer||"default";
  document.getElementById("sPaperSize").value       = s.paperSize||"80mm";
  document.getElementById("sCopies").value          = s.copies||1;
  document.getElementById("sPrintLogo").checked     = !!s.printLogo;
  document.getElementById("sPrintShopName").checked = s.printShopName!==false;
  document.getElementById("sPrintPhone").checked    = s.printPhone!==false;
  document.getElementById("sPrintWelcome").checked  = s.printWelcome!==false;
  document.getElementById("sPrintBarcode").checked  = !!s.printBarcode;
  document.getElementById("sPrintCustBarcode").checked=!!s.printCustBarcode;
  document.getElementById("sAutoBackup").checked    = !!s.autoBackup;
  updateBackupStatus();
  // Appearance
  const ff=document.getElementById("sFontFamily");
  if(ff&&s.fontFamily) ff.value=s.fontFamily;
  document.querySelectorAll(".fsz-btn").forEach(b=>{
    b.classList.toggle("active", parseInt(b.dataset.size)===(s.fontSize||15));
  });
  document.querySelectorAll(".theme-swatch").forEach(sw=>{
    sw.classList.toggle("active", sw.dataset.theme===(s.appTheme||"default"));
  });
  // Update invoice preview
  updateInvoicePreview();
}

function saveSettingsApp() {
  DB.settings.dateFormat  = document.getElementById("sDateFormat").value;
  DB.settings.timeFormat  = document.getElementById("sTimeFormat").value;
  DB.settings.currency    = document.getElementById("sCurrency").value || "دج";
  DB.settings.lang        = document.getElementById("sLang").value;
  const ff=document.getElementById("sFontFamily");
  if(ff) { DB.settings.fontFamily=ff.value; previewFont(); }
  const afsz=document.querySelector(".fsz-btn.active");
  if(afsz) DB.settings.fontSize=parseInt(afsz.dataset.size);
  const ath=document.querySelector(".theme-swatch.active");
  if(ath) DB.settings.appTheme=ath.dataset.theme;
  saveDB(); applyTranslations(); loadAppearanceSettings();
  showMsgBox("msgSettingsApp", t("msg_saved"), "success");
}

function saveSettingsStore() {
  DB.settings.name    = document.getElementById("sname").value.trim();
  DB.settings.phone   = document.getElementById("sphone").value.trim();
  DB.settings.addr    = document.getElementById("saddr").value.trim();
  DB.settings.welcome = document.getElementById("sWelcome").value.trim();
  saveDB(); applyHeader();
  updateInvoicePreview();
  showMsgBox("msgSettingsStore", t("msg_saved"), "success");
}

function saveSettingsPrint() {
  DB.settings.invoiceNum       = parseInt(document.getElementById("sInvoiceNum").value)||1;
  DB.settings.printer          = document.getElementById("sPrinter").value;
  DB.settings.paperSize        = document.getElementById("sPaperSize").value;
  DB.settings.copies           = parseInt(document.getElementById("sCopies").value)||1;
  DB.settings.printLogo        = document.getElementById("sPrintLogo").checked;
  DB.settings.printShopName    = document.getElementById("sPrintShopName").checked;
  DB.settings.printPhone       = document.getElementById("sPrintPhone").checked;
  DB.settings.printWelcome     = document.getElementById("sPrintWelcome").checked;
  DB.settings.printBarcode     = document.getElementById("sPrintBarcode").checked;
  DB.settings.printCustBarcode = document.getElementById("sPrintCustBarcode").checked;
  saveDB();
  updateInvoicePreview();
  showMsgBox("msgSettingsPrint", t("msg_saved"), "success");
}

function switchSettingsTab(panel, btn) {
  document.querySelectorAll(".settings-panel").forEach(p=>p.classList.remove("active"));
  document.querySelectorAll(".stab").forEach(b=>b.classList.remove("active"));
  const panelId = "settings" + panel.charAt(0).toUpperCase() + panel.slice(1);
  const panelEl = document.getElementById(panelId);
  if (panelEl) panelEl.classList.add("active");
  btn.classList.add("active");
  if (panel==="print") updateInvoicePreview();
}

function previewLogo(input) {
  const file=input.files[0]; if (!file) return;
  const r=new FileReader();
  r.onload=e=>{
    DB.settings.logo=e.target.result;
    const lp=document.getElementById("logoPreview");
    if(lp){ lp.src=e.target.result; lp.style.display="block"; }
    saveDB(); applyHeader(); updateInvoicePreview();
  };
  r.readAsDataURL(file);
}

function removeLogo() {
  DB.settings.logo="";
  const lp=document.getElementById("logoPreview");
  if(lp){ lp.src=""; lp.style.display="none"; }
  saveDB(); applyHeader(); updateInvoicePreview();
}

function saveSettings() { saveSettingsStore(); }

/* ================================================
   INVOICE PREVIEW — معاينة الفاتورة (جديد)
================================================ */
function updateInvoicePreview() {
  const preview = document.getElementById("invoicePreview");
  if (!preview) return;
  const s = DB.settings;
  const showLogo      = document.getElementById("sPrintLogo")?.checked;
  const showName      = document.getElementById("sPrintShopName")?.checked ?? s.printShopName;
  const showPhone     = document.getElementById("sPrintPhone")?.checked ?? s.printPhone;
  const showWelcome   = document.getElementById("sPrintWelcome")?.checked ?? s.printWelcome;
  const showBarcode   = document.getElementById("sPrintBarcode")?.checked ?? s.printBarcode;
  const showCustBC    = document.getElementById("sPrintCustBarcode")?.checked ?? s.printCustBarcode;
  const name    = document.getElementById("sname")?.value.trim() || s.name || "اسم المتجر";
  const phone   = document.getElementById("sphone")?.value.trim() || s.phone || "0XXX XXX XXX";
  const welcome = document.getElementById("sWelcome")?.value.trim() || s.welcome || "شكراً لزيارتكم!";

  preview.innerHTML = `
    <div class="inv-paper">
      <div class="inv-header">
        ${showLogo && s.logo ? `<img src="${s.logo}" class="inv-logo" alt="logo">` : ""}
        ${showName ? `<div class="inv-shop-name">${name}</div>` : ""}
        ${showPhone ? `<div class="inv-phone">📞 ${phone}</div>` : ""}
      </div>
      <div class="inv-divider"></div>
      <div class="inv-section-label">تفاصيل الفاتورة</div>
      <div class="inv-row"><span>تاريخ:</span><span>${formatDate(new Date().toISOString())}</span></div>
      <div class="inv-row"><span>رقم الفاتورة:</span><span>#${s.invoiceNum||1}</span></div>
      <div class="inv-row"><span>الزبون:</span><span>—</span></div>
      <div class="inv-divider"></div>
      <div class="inv-items-header">
        <span>السلعة</span><span>الكمية</span><span>السعر</span>
      </div>
      <div class="inv-item"><span>مثال منتج 1</span><span>2</span><span>150.00 دج</span></div>
      <div class="inv-item"><span>مثال منتج 2</span><span>1</span><span>80.00 دج</span></div>
      <div class="inv-divider"></div>
      <div class="inv-total"><span>المجموع:</span><span>380.00 دج</span></div>
      ${showBarcode ? `
      <div class="inv-divider"></div>
      <div class="inv-section-label">باركود المنتجات</div>
      <div class="inv-barcode-row">
        <div class="inv-barcode-item"><div class="inv-barcode-lines"></div><div class="inv-bc-num">123456789</div></div>
        <div class="inv-barcode-item"><div class="inv-barcode-lines"></div><div class="inv-bc-num">987654321</div></div>
      </div>` : ""}
      ${showCustBC ? `
      <div class="inv-divider"></div>
      <div class="inv-section-label">باركود الفاتورة</div>
      <div style="text-align:center"><div class="inv-barcode-lines wide"></div><div class="inv-bc-num">#${s.invoiceNum||1}-${Date.now().toString(36).toUpperCase()}</div></div>` : ""}
      ${showWelcome ? `
      <div class="inv-divider"></div>
      <div class="inv-welcome">${welcome}</div>` : ""}
    </div>`;
}

/* Add live preview listeners */
document.addEventListener("DOMContentLoaded", ()=>{
  ["sPrintLogo","sPrintShopName","sPrintPhone","sPrintWelcome","sPrintBarcode","sPrintCustBarcode"].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.addEventListener("change", updateInvoicePreview);
  });
  ["sname","sphone","sWelcome"].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.addEventListener("input", updateInvoicePreview);
  });
});

/* ================================================
   PIN VISIBILITY TOGGLE
================================================ */
function togglePinVisibility() {
  const pin = document.getElementById("pin");
  const icon = document.getElementById("eyeIcon");
  if (!pin) return;
  if (pin.type === "password") {
    pin.type = "text";
    icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
  } else {
    pin.type = "password";
    icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
  }
}

/* ================================================
   APPEARANCE
================================================ */
function previewFont() {
  const f = document.getElementById("sFontFamily")?.value;
  if(f) {
    document.documentElement.style.setProperty("--font", `'${f}', system-ui, sans-serif`);
    document.body.style.fontFamily = `'${f}', system-ui, sans-serif`;
  }
}
function setFontSize(size) {
  document.documentElement.style.setProperty("--font-size-base", size+"px");
  document.body.style.fontSize = size + "px";
  document.querySelectorAll(".fsz-btn").forEach(b=>b.classList.toggle("active", parseInt(b.dataset.size)===size));
  DB.settings.fontSize = size;
}
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelectorAll(".theme-swatch").forEach(s=>s.classList.toggle("active", s.dataset.theme===theme));
  DB.settings.appTheme = theme;
}
function loadAppearanceSettings() {
  const s = DB.settings;
  if (s.fontFamily) {
    const ff=document.getElementById("sFontFamily");
    if(ff) ff.value=s.fontFamily;
    document.documentElement.style.setProperty("--font", `'${s.fontFamily}', system-ui, sans-serif`);
    document.body.style.fontFamily=`'${s.fontFamily}', system-ui, sans-serif`;
  }
  if (s.fontSize) setFontSize(s.fontSize);
  if (s.appTheme) {
    document.documentElement.setAttribute("data-theme", s.appTheme);
    document.querySelectorAll(".theme-swatch").forEach(sw=>sw.classList.toggle("active", sw.dataset.theme===s.appTheme));
  }
}

/* ================================================
   SYSTEM
================================================ */
function toggleAutoBackup(enabled) {
  DB.settings.autoBackup=enabled; saveDB();
  showToast(enabled ? t("msg_backup_auto_on") : t("msg_backup_auto_off"), enabled?"success":"info");
  updateBackupStatus();
}
function updateBackupStatus() {
  const el=document.getElementById("backupStatus"); if(!el) return;
  if (DB.settings.autoBackup) {
    const last=DB.settings.lastBackup?formatDate(DB.settings.lastBackup):"—";
    el.textContent=`آخر نسخة: ${last}`;
  } else el.textContent="";
}
function manualBackup() {
  const data=JSON.stringify(DB,null,2);
  const blob=new Blob([data],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download=`POSDZ_backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click(); URL.revokeObjectURL(url);
  DB.settings.lastBackup=new Date().toISOString();
  saveDB();
  showMsgBox("msgBackup", t("msg_backup_done"), "success");
  updateBackupStatus();
}
function checkAutoBackup() {
  if (!DB.settings.autoBackup) return;
  const last=DB.settings.lastBackup;
  if (!last||!isSameDay(new Date(last),new Date())) manualBackup();
}
function confirmReset() {
  const confirmWord=DB.settings.lang==="fr"?"oui":DB.settings.lang==="en"?"yes":"نعم";
  const ans=window.prompt(t("msg_reset_confirm"));
  if (!ans||ans.trim().toLowerCase()!==confirmWord) { showToast(t("msg_reset_cancel"),"info"); return; }
  const freshDB={
    users:[{name:"Admin",pin:"1234",role:"manager",immutable:true}],
    settings:{name:"POS DZ",phone:"",addr:"",welcome:"",currency:"دج",lang:DB.settings.lang||"ar",dateFormat:"DD-MM-YYYY",timeFormat:"24",logo:"",printer:"default",paperSize:"80mm",copies:1,printLogo:false,printShopName:true,printPhone:true,printWelcome:true,printBarcode:false,printCustBarcode:false,invoiceNum:1,autoBackup:false,lastBackup:""},
    families:[],brands:[],stock:[],cart:[],customers:[],debts:[],sales:[]
  };
  DB=freshDB; saveDB();
  localStorage.removeItem("POSDZ_LOGGED");
  showToast(t("msg_reset_done"),"success");
  setTimeout(()=>location.reload(),1500);
}

/* ================================================
   STOCK TAB
================================================ */
function switchStockTab(panel, btn){
  document.querySelectorAll(".stock-panel").forEach(p=>p.classList.remove("active"));
  document.querySelectorAll(".sktab").forEach(b=>b.classList.remove("active"));
  document.getElementById("stock"+panel.charAt(0).toUpperCase()+panel.slice(1)).classList.add("active");
  btn.classList.add("active");
  if (panel==="all")      { populateStockSelects(); renderStock(); }
  if (panel==="brands")   { renderBrandList(); populateBrandFamilySelect(); }
  if (panel==="families") renderFamilyList();
}

/* ================================================
   FAMILIES
================================================ */
function addFamily(){
  const name=document.getElementById("familyInput").value.trim();
  if (!name) return;
  if (DB.families.find(f=>f.name.toLowerCase()===name.toLowerCase())){
    showToast(t("msg_family_exists"),"error"); return;
  }
  DB.families.push({id:uid(), name});
  document.getElementById("familyInput").value="";
  saveDB(); renderFamilyList(); populateStockSelects(); populateBrandFamilySelect();
  showToast("✅ تمت إضافة العائلة", "success");
}
function editFamily(id){
  const fam=DB.families.find(f=>f.id===id); if(!fam) return;
  const newName=window.prompt(t("edit_btn")+" — "+fam.name+":", fam.name);
  if (!newName||newName.trim()===fam.name) return;
  if (DB.families.find(f=>f.name.toLowerCase()===newName.trim().toLowerCase()&&f.id!==id)){
    showToast(t("msg_family_exists"),"error"); return;
  }
  fam.name=newName.trim(); saveDB();
  renderFamilyList(); populateStockSelects(); populateBrandFamilySelect();
}
function deleteFamily(id){
  if (!window.confirm(t("msg_confirm_delete_family"))) return;
  DB.families=DB.families.filter(f=>f.id!==id);
  DB.brands=DB.brands.filter(b=>b.familyId!==id);
  saveDB(); renderFamilyList(); renderBrandList(); populateStockSelects(); populateBrandFamilySelect();
}
function renderFamilyList(){
  const list=document.getElementById("familyList");
  list.innerHTML="";
  if (!DB.families.length){
    list.innerHTML=`<li style="color:var(--text3);text-align:center;padding:20px">${t("no_families")}</li>`; return;
  }
  DB.families.forEach(fam=>{
    const brandsCount=DB.brands.filter(b=>b.familyId===fam.id).length;
    const li=document.createElement("li");
    li.style.cssText="display:flex;justify-content:space-between;align-items:center;padding:10px 8px;border-bottom:1px solid var(--border)";
    li.innerHTML=`
      <span>📁 <strong>${fam.name}</strong> <span style="color:var(--text3);font-size:12px">(${brandsCount} ${t("tab_brands")})</span></span>
      <span>
        <button onclick="editFamily('${fam.id}')" style="padding:5px 10px;font-size:13px;background:#3b82f6;margin-left:4px">${t("edit_btn")}</button>
        <button onclick="deleteFamily('${fam.id}')" style="padding:5px 10px;font-size:13px;background:#ef4444">${t("del_btn")}</button>
      </span>`;
    list.appendChild(li);
  });
}

/* ================================================
   BRANDS
================================================ */
function populateBrandFamilySelect(){
  const sel=document.getElementById("brandFamilySelect");
  sel.innerHTML=`<option value="">— ${t("family_label")} —</option>`;
  DB.families.forEach(f=>{
    const o=document.createElement("option");
    o.value=f.id; o.textContent=f.name; sel.appendChild(o);
  });
}
function addBrand(){
  const name=document.getElementById("brandInput").value.trim();
  const familyId=document.getElementById("brandFamilySelect").value;
  if (!name) return;
  if (!familyId){ showToast(t("msg_select_family"),"error"); return; }
  if (DB.brands.find(b=>b.name.toLowerCase()===name.toLowerCase()&&b.familyId===familyId)){
    showToast(t("msg_brand_exists"),"error"); return;
  }
  DB.brands.push({id:uid(), name, familyId});
  document.getElementById("brandInput").value="";
  saveDB(); renderBrandList(); populateStockSelects();
  showToast("✅ تمت إضافة الماركة","success");
}
function editBrand(id){
  const brand=DB.brands.find(b=>b.id===id); if(!brand) return;
  const newName=window.prompt(t("edit_btn")+" — "+brand.name+":", brand.name);
  if (!newName||newName.trim()===brand.name) return;
  brand.name=newName.trim(); saveDB(); renderBrandList(); populateStockSelects();
}
function deleteBrand(id){
  if (!window.confirm(t("msg_confirm_delete_brand"))) return;
  DB.brands=DB.brands.filter(b=>b.id!==id);
  saveDB(); renderBrandList(); populateStockSelects();
}
function renderBrandList(){
  const list=document.getElementById("brandList");
  list.innerHTML="";
  if (!DB.brands.length){
    list.innerHTML=`<li style="color:var(--text3);text-align:center;padding:20px">${t("no_brands")}</li>`; return;
  }
  DB.families.forEach(fam=>{
    const famBrands=DB.brands.filter(b=>b.familyId===fam.id);
    if (!famBrands.length) return;
    const header=document.createElement("li");
    header.style.cssText="background:var(--bg2);padding:8px 10px;font-weight:700;border-radius:6px;margin:6px 0 4px;list-style:none";
    header.textContent=`📁 ${fam.name}`;
    list.appendChild(header);
    famBrands.forEach(brand=>{
      const li=document.createElement("li");
      li.style.cssText="display:flex;justify-content:space-between;align-items:center;padding:8px 8px 8px 16px;border-bottom:1px solid var(--border)";
      li.innerHTML=`
        <span>🏷️ <strong>${brand.name}</strong></span>
        <span>
          <button onclick="editBrand('${brand.id}')" style="padding:5px 10px;font-size:13px;background:#3b82f6;margin-left:4px">${t("edit_btn")}</button>
          <button onclick="deleteBrand('${brand.id}')" style="padding:5px 10px;font-size:13px;background:#ef4444">${t("del_btn")}</button>
        </span>`;
      list.appendChild(li);
    });
  });
  const orphans=DB.brands.filter(b=>!DB.families.find(f=>f.id===b.familyId));
  if (orphans.length){
    const header=document.createElement("li");
    header.style.cssText="background:#fef3c7;padding:8px 10px;font-weight:700;border-radius:6px;margin:6px 0 4px;list-style:none";
    header.textContent="⚠️ بدون عائلة";
    list.appendChild(header);
    orphans.forEach(brand=>{
      const li=document.createElement("li");
      li.style.cssText="display:flex;justify-content:space-between;align-items:center;padding:8px 8px 8px 16px;border-bottom:1px solid var(--border)";
      li.innerHTML=`<span>🏷️ ${brand.name}</span><button onclick="deleteBrand('${brand.id}')" style="padding:5px 10px;font-size:13px;background:#ef4444">${t("del_btn")}</button>`;
      list.appendChild(li);
    });
  }
}

/* ================================================
   STOCK SELECTS
================================================ */
function populateStockSelects(){
  const typeEl=document.getElementById("type");
  if (!typeEl) return;
  const savedType=typeEl.value;
  typeEl.innerHTML=`<option value="">— ${t("family_label")} —</option>`;
  DB.families.forEach(f=>{
    const o=document.createElement("option");
    o.value=f.name; o.textContent=f.name; o.dataset.id=f.id;
    typeEl.appendChild(o);
  });
  if (savedType) typeEl.value=savedType;
  updateBrandSelectByFamily();
}

function updateBrandSelectByFamily(){
  const typeEl=document.getElementById("type");
  const brandEl=document.getElementById("brand");
  if (!typeEl||!brandEl) return;
  const selectedFamName=typeEl.value;
  const fam=DB.families.find(f=>f.name===selectedFamName);
  const savedBrand=brandEl.value;
  brandEl.innerHTML=`<option value="">— ${t("brand_label")} —</option>`;
  const brands=fam?DB.brands.filter(b=>b.familyId===fam.id):DB.brands;
  brands.forEach(b=>{
    const o=document.createElement("option");
    o.value=b.name; o.textContent=b.name; brandEl.appendChild(o);
  });
  if (savedBrand) brandEl.value=savedBrand;
}

// Bind family change event
document.addEventListener("DOMContentLoaded",()=>{
  const typeEl=document.getElementById("type");
  if (typeEl) typeEl.addEventListener("change", updateBrandSelectByFamily);
});

/* ================================================
   STOCK MANAGEMENT — FIX: validation corrigée
================================================ */
function saveItem(){
  const typeEl      = document.getElementById("type");
  const brandEl     = document.getElementById("brand");
  const sizeEl      = document.getElementById("size");
  const barcodeEl   = document.getElementById("barcode");
  const priceEl     = document.getElementById("price");
  const costEl      = document.getElementById("costPrice");
  const qtyEl       = document.getElementById("qty");
  const expEl       = document.getElementById("exp");

  const type      = typeEl.value.trim();
  const brand     = brandEl.value.trim();
  const size      = sizeEl.value.trim();
  let   barcode   = barcodeEl.value.trim();
  const priceStr  = priceEl.value;
  const costStr   = costEl.value;
  const qtyStr    = qtyEl.value;
  const exp       = expEl.value;

  // FIX: validation — العائلة والماركة إجباريتان
  if (!type)    { showToast("اختر العائلة أولاً","error"); typeEl.focus(); return; }
  if (!brand)   { showToast("اختر الماركة أولاً","error"); brandEl.focus(); return; }

  // الباركود اختياري — يُولَّد تلقائياً إن كان فارغاً
  if (!barcode) {
    barcode = "AUTO-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2,5).toUpperCase();
    barcodeEl.value = barcode;
  }

  const price     = priceStr !== "" ? parseFloat(priceStr) : 0;
  const costPrice = costStr  !== "" ? parseFloat(costStr)  : 0;
  const qty       = qtyStr   !== "" ? parseInt(qtyStr)     : 0;

  if (isNaN(price) || price < 0)     { showToast("أدخل سعر البيع صحيحاً","error"); priceEl.focus(); return; }
  if (isNaN(costPrice) || costPrice < 0) { showToast("أدخل سعر الشراء صحيحاً","error"); costEl.focus(); return; }
  if (isNaN(qty) || qty < 0)         { showToast("أدخل الكمية صحيحة","error"); qtyEl.focus(); return; }

  const existing = DB.stock.find(i => i.barcode === barcode);
  if (existing) {
    existing.qty += qty;
    existing.price = price;
    existing.costPrice = costPrice;
    showToast(t("msg_item_updated"), "info");
  } else {
    DB.stock.push({ type, brand, size, barcode, price, costPrice, qty, exp });
    showToast(t("msg_item_saved"), "success");
  }

  // Reset fields
  typeEl.value=""; brandEl.value=""; sizeEl.value="";
  barcodeEl.value=""; priceEl.value=""; costEl.value="";
  qtyEl.value=""; expEl.value="";
  updateBrandSelectByFamily();
  saveDB(); renderStock();
}

function editItem(index){
  const item=DB.stock[index];
  const newPrice=window.prompt(t("price_label")+":", item.price);
  const newQty=window.prompt(t("qty_label")+":", item.qty);
  if (newPrice!==null&&!isNaN(newPrice)) item.price=parseFloat(newPrice);
  if (newQty!==null&&!isNaN(newQty))     item.qty=parseInt(newQty);
  saveDB(); renderStock();
}
function deleteItem(index){
  if (!window.confirm(t("msg_confirm_delete"))) return;
  DB.stock.splice(index,1); saveDB(); renderStock();
}

function renderStock(){
  stockList.innerHTML="";
  const q=(document.getElementById("stockSearch")?.value||"").toLowerCase();
  const list=q?DB.stock.filter(i=>i.type.toLowerCase().includes(q)||i.brand.toLowerCase().includes(q)||i.barcode.includes(q)):DB.stock;
  if (!list.length){ stockList.innerHTML=`<li style="color:var(--text3);text-align:center;padding:20px">${t("no_stock")}</li>`; return; }
  const grouped={};
  list.forEach(item=>{
    const key=`${item.type}||${item.brand}`;
    if (!grouped[key]) grouped[key]={type:item.type,brand:item.brand,items:[]};
    grouped[key].items.push(item);
  });
  Object.values(grouped).forEach(group=>{
    const header=document.createElement("li");
    header.style.cssText="background:var(--bg2);padding:8px 12px;font-weight:700;border-radius:6px;margin:8px 0 4px;list-style:none";
    header.innerHTML=`📁 ${group.type} &nbsp;›&nbsp; 🏷️ ${group.brand}`;
    stockList.appendChild(header);
    group.items.forEach(item=>{
      const realIndex=DB.stock.indexOf(item);
      const expired=item.exp&&new Date(item.exp)<new Date();
      const li=document.createElement("li");
      li.style.cssText="padding:8px 12px;border-bottom:1px solid var(--border)";
      li.innerHTML=`
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
          <div>
            ${item.size?`<span style="color:var(--text3)">${item.size}</span> | `:""}
            باركود: <code style="background:var(--bg2);padding:2px 6px;border-radius:4px">${item.barcode}</code>
            | ${t("price_label")}: <strong>${formatPrice(item.price)}</strong>
            | ${t("qty_label")}: <strong style="color:${item.qty<5?"#ef4444":"#10b981"}">${item.qty}</strong>
            ${expired?`<span style="color:#ef4444;font-size:12px"> ⚠ منتهي</span>`:""}
          </div>
          <div>
            <button onclick="editItem(${realIndex})" style="padding:5px 10px;font-size:13px;background:#3b82f6;margin-left:4px">${t("edit_btn")}</button>
            <button onclick="deleteItem(${realIndex})" style="padding:5px 10px;font-size:13px;background:#ef4444">${t("del_btn")}</button>
          </div>
        </div>`;
      stockList.appendChild(li);
    });
  });
}

/* ================================================
   CUSTOMERS
================================================ */
function renderCustomerSelect(){
  custSelect.innerHTML=`<option value="">👤 — ${t("no_customers").replace("بعد","").trim()} —</option>`;
  DB.customers.forEach(c=>{
    const o=document.createElement("option"); o.value=c.name; o.textContent=c.name;
    custSelect.appendChild(o);
  });
}
function addCustomer(){
  const name=document.getElementById("cname").value.trim();
  if (!name){ showToast(t("msg_enter_customer"),"error"); return; }
  if (DB.customers.find(c=>c.name===name)){ showToast(t("msg_customer_exists"),"error"); return; }
  DB.customers.push({name,debts:[]});
  document.getElementById("cname").value="";
  saveDB(); renderCustomerList(); renderCustomerSelect();
  showToast("✅ تمت إضافة الزبون","success");
}
function renderCustomerList(){
  const clist=document.getElementById("clist");
  clist.innerHTML="";
  if (!DB.customers.length){ clist.innerHTML=`<li style="color:var(--text3);text-align:center;padding:20px">${t("no_customers")}</li>`; return; }
  DB.customers.forEach((c,index)=>{
    const totalDebt=(c.debts||[]).reduce((s,d)=>s+(d.remaining||0),0);
    const li=document.createElement("li");
    li.style.cssText="display:flex;justify-content:space-between;align-items:center;padding:10px 8px;border-bottom:1px solid var(--border)";
    li.innerHTML=`
      <span><strong>${c.name}</strong>${totalDebt>0?` <span style="color:#ef4444;font-size:13px">(${formatPrice(totalDebt)})</span>`:""}</span>
      <button onclick="deleteCustomer(${index})" style="background:#ef4444;padding:5px 10px;font-size:13px">${t("del_btn")}</button>`;
    clist.appendChild(li);
  });
}
function deleteCustomer(index){
  if (window.confirm(t("msg_confirm_delete_customer"))){ DB.customers.splice(index,1); saveDB(); renderCustomerList(); renderCustomerSelect(); }
}

/* ================================================
   USER MANAGEMENT
================================================ */
function renderUsersTable(){
  usersTableBody.innerHTML="";
  DB.users.forEach((user,index)=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`
      <td>${user.name}</td>
      <td>${"*".repeat(user.pin.length)}</td>
      <td>${user.role==="manager"?t("role_manager"):t("role_seller")}</td>
      <td>
        <button onclick="editUser(${index})" ${user.immutable?"disabled":""}>${t("edit_btn")}</button>
        <button onclick="deleteUser(${index})" ${user.immutable?"disabled":""} style="background:#ef4444;margin-right:4px">${t("del_btn")}</button>
      </td>`;
    usersTableBody.appendChild(tr);
  });
}
function addUser(e){
  e.preventDefault();
  const name=newUserName.value.trim(), pin=newUserPin.value.trim(), role=newUserRole.value;
  if (!name||pin.length!==4||!/^\d+$/.test(pin)){ showToast(t("msg_pin_format"),"error"); return; }
  if (DB.users.find(u=>u.name===name)){ showToast(t("msg_user_exists"),"error"); return; }
  DB.users.push({name,pin,role,immutable:false});
  saveDB(); renderUsersTable(); renderUserSelect(); renderAlerts(); addUserForm.reset();
  showToast("✅ تمت إضافة المستخدم","success");
}
function editUser(index){
  const user = DB.users[index];
  // نبني نموذج تعديل داخلي
  const nameIn  = window.prompt("✏️ اسم المستخدم الجديد:", user.name);
  if (nameIn === null) return;
  const pinIn   = window.prompt("🔑 PIN الجديد (4 أرقام):", "");
  if (pinIn === null) return;

  const newName = nameIn.trim() || user.name;
  const newPin  = pinIn.trim();

  // تحقق من الاسم
  if (newName !== user.name && DB.users.find((u,i) => u.name === newName && i !== index)) {
    showToast(t("msg_user_exists"), "error"); return;
  }
  // تحقق من PIN إن أدخله
  if (newPin && (newPin.length !== 4 || !/^\d+$/.test(newPin))) {
    showToast(t("msg_pin_4"), "error"); return;
  }

  // تغيير الدور — فقط للمدير على مستخدمين آخرين
  const logged = JSON.parse(localStorage.getItem("POSDZ_LOGGED"));
  let newRole = user.role;
  if (logged && logged.role === "manager" && index !== DB.users.findIndex(u=>u.name===logged.name)) {
    const roleIn = window.prompt("👤 الدور (manager / baker):", user.role);
    if (roleIn && ["manager","baker"].includes(roleIn.trim())) newRole = roleIn.trim();
  }

  user.name = newName;
  if (newPin) user.pin = newPin;
  user.role = newRole;

  // تحديث جلسة المستخدم الحالي إن كان هو نفسه
  if (logged && logged.name === (nameIn.trim() ? user.name : logged.name)) {
    localStorage.setItem("POSDZ_LOGGED", JSON.stringify(user));
  }

  saveDB(); renderUsersTable(); renderUserSelect(); renderAlerts();
  showToast("✅ تم تعديل المستخدم بنجاح", "success");
}
function deleteUser(index){
  if (DB.users[index].immutable){ showToast(t("msg_cant_delete"),"error"); return; }
  if (window.confirm(t("msg_confirm_delete_user"))){ DB.users.splice(index,1); saveDB(); renderUsersTable(); renderUserSelect(); renderAlerts(); }
}
function renderAlerts(){
  const alertList=document.getElementById("alertList");
  alertList.innerHTML="";
  DB.users.forEach((user,index)=>{
    const li=document.createElement("li");
    li.style.cssText="display:flex;justify-content:space-between;align-items:center;padding:10px 8px;border-bottom:1px solid var(--border)";
    li.innerHTML=`
      <span><strong>${user.name}</strong> — ${user.role==="manager"?t("role_manager"):t("role_seller")}</span>
      <span>
        <button onclick="editUser(${index})" ${user.immutable?"disabled":""} style="font-size:13px;padding:5px 10px;margin-left:4px">${t("edit_btn")}</button>
        <button onclick="deleteUser(${index})" ${user.immutable?"disabled":""} style="background:#ef4444;font-size:13px;padding:5px 10px">${t("del_btn")}</button>
      </span>`;
    alertList.appendChild(li);
  });
}
function addUserInAlertsFunc(e){
  e.preventDefault();
  const name=alertUserName.value.trim(), pin=alertUserPin.value.trim(), role=alertUserRole.value;
  if (!name||pin.length!==4||!/^\d+$/.test(pin)){ showToast(t("msg_pin_format"),"error"); return; }
  if (DB.users.find(u=>u.name===name)){ showToast(t("msg_user_exists"),"error"); return; }
  DB.users.push({name,pin,role,immutable:false});
  saveDB(); renderUsersTable(); renderUserSelect(); renderAlerts(); addUserInAlerts.reset();
  showToast("✅ تمت إضافة المستخدم","success");
}
function closeUsersModal(){ usersModal.style.display="none"; }

/* ================================================
   SEARCH SUGGESTIONS
================================================ */
function searchSuggestions() {
  const val=document.getElementById("search").value.trim().toLowerCase();
  const box=document.getElementById("searchSuggestions");
  if (!val){ box.classList.add("hidden"); return; }
  const results=DB.stock.filter(i=>
    i.type.toLowerCase().includes(val)||
    i.brand.toLowerCase().includes(val)||
    (i.size&&i.size.toLowerCase().includes(val))||
    i.barcode.includes(val)
  ).slice(0,8);
  if (!results.length){ box.classList.add("hidden"); return; }
  box.innerHTML="";
  results.forEach(item=>{
    const div=document.createElement("div");
    div.className="suggestion-item";
    const name=`${item.type} ${item.brand}${item.size?" — "+item.size:""}`;
    const sc=item.qty<=0?"color:#ef4444":item.qty<5?"color:#f59e0b":"color:#10b981";
    div.innerHTML=`
      <div>
        <div class="sug-name">${name}</div>
        <div class="sug-meta">باركود: <code>${item.barcode}</code> | <span style="${sc}">مخزون: ${item.qty}</span></div>
      </div>
      <span class="sug-price">${formatPrice(item.price)}</span>`;
    div.addEventListener("click",()=>{
      document.getElementById("search").value=item.barcode;
      box.classList.add("hidden");
      addItem();
    });
    box.appendChild(div);
  });
  box.classList.remove("hidden");
}
document.addEventListener("click",e=>{
  const box=document.getElementById("searchSuggestions");
  const inp=document.getElementById("search");
  if(box&&inp&&!box.contains(e.target)&&e.target!==inp) box.classList.add("hidden");
});
document.addEventListener("keydown",e=>{
  if(e.key==="Enter"&&document.activeElement===document.getElementById("search")){
    document.getElementById("searchSuggestions")?.classList.add("hidden");
    addItem();
  }
});

/* ================================================
   CART
================================================ */
function renderSaleStock(){
  cartTableBody.innerHTML="";
  DB.cart.forEach((cItem,index)=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`
      <td><input class="cart-editable" value="${cItem.name.replace(/"/g,'&quot;')}" style="width:130px" onchange="updateCartName(${index},this.value)" title="انقر للتعديل"></td>
      <td>
        <div style="display:flex;align-items:center;justify-content:center;gap:6px">
          <button onclick="decreaseQty(${index})" style="padding:4px 10px;background:var(--bg2);color:var(--text);border-radius:6px;font-size:16px;font-weight:900;min-width:30px">−</button>
          <strong style="font-size:15px;min-width:24px;text-align:center">${cItem.qty}</strong>
          <button onclick="increaseQty(${index})" style="padding:4px 10px;background:var(--bg2);color:var(--text);border-radius:6px;font-size:16px;font-weight:900;min-width:30px">+</button>
        </div>
      </td>
      <td><input class="cart-editable" value="${cItem.price}" type="number" min="0" step="0.01" style="width:90px;color:var(--primary);font-weight:800" onchange="updateCartPrice(${index},this.value)" title="انقر لتغيير السعر"></td>
      <td style="font-weight:800;color:#10b981;font-family:'IBM Plex Mono',monospace">${formatPrice(cItem.price*cItem.qty)}</td>
      <td><button onclick="removeFromCart(${index})" style="background:#fef2f2;color:#ef4444;border:1px solid #fecaca;padding:5px 10px;font-size:13px;border-radius:6px">${t("del_btn")}</button></td>`;
    cartTableBody.appendChild(tr);
  });
  updateTotal();
}
function updateCartName(index,val){ if(val.trim()) DB.cart[index].name=val.trim(); saveDB(); renderSaleStock(); }
function updateCartPrice(index,val){ const p=parseFloat(val); if(!isNaN(p)&&p>=0) DB.cart[index].price=p; saveDB(); renderSaleStock(); }
function increaseQty(index){
  const c=DB.cart[index];
  const s=DB.stock.find(s=>s.barcode===c.barcode);
  if(s&&c.qty>=s.qty){ showToast(t("msg_not_enough"),"error"); return; }
  c.qty+=1; saveDB(); renderSaleStock();
}
function decreaseQty(index){
  DB.cart[index].qty-=1;
  if(DB.cart[index].qty<=0) DB.cart.splice(index,1);
  saveDB(); renderSaleStock();
}
function addItem(){
  const val=document.getElementById("search").value.trim().toLowerCase();
  if(!val){ showToast(t("msg_enter_search"),"error"); return; }
  const item=DB.stock.find(i=>i.type.toLowerCase().includes(val)||i.brand.toLowerCase().includes(val)||i.barcode===val||i.barcode.includes(val));
  if(!item){ showToast(t("msg_not_found"),"error"); return; }
  if(item.qty<=0){ showToast(t("msg_out_of_stock"),"error"); return; }
  const cartItem=DB.cart.find(c=>c.barcode===item.barcode);
  if(cartItem){
    if(cartItem.qty>=item.qty){ showToast(t("msg_not_enough"),"error"); return; }
    cartItem.qty+=1;
  } else {
    DB.cart.push({name:`${item.type} ${item.brand}`,barcode:item.barcode,price:item.price,costPrice:item.costPrice,qty:1});
  }
  document.getElementById("search").value="";
  document.getElementById("searchSuggestions")?.classList.add("hidden");
  saveDB(); renderSaleStock();
}
function removeFromCart(index){ DB.cart.splice(index,1); saveDB(); renderSaleStock(); }
function updateTotal(){ totalEl.textContent=formatPrice(DB.cart.reduce((s,i)=>s+i.price*i.qty,0)); }

/* ================================================
   PAYMENT
================================================ */
function getCartTotal(){ return DB.cart.reduce((s,i)=>s+i.price*i.qty,0); }
function deductStock(){
  DB.cart.forEach(cItem=>{
    const s=DB.stock.find(s=>s.barcode===cItem.barcode);
    if(s) s.qty-=cItem.qty;
  });
}
function buildSale(type,paid){
  const invoiceNum=DB.settings.invoiceNum||1;
  DB.settings.invoiceNum=invoiceNum+1;
  return{invoiceNum,date:new Date().toISOString(),customer:custSelect.value||"—",type,paid:paid||0,total:getCartTotal(),items:DB.cart.map(i=>({name:i.name,barcode:i.barcode,price:i.price,cost:i.costPrice||0,qty:i.qty}))};
}
function pay(){
  if(!DB.cart.length){ showToast(t("msg_no_cart"),"error"); return; }
  const paidVal=parseFloat(document.getElementById("paid").value);
  const total=getCartTotal();
  if(!isNaN(paidVal)&&paidVal<total){ showToast(t("msg_low_balance"),"error"); return; }
  const change=!isNaN(paidVal)?paidVal-total:0;
  deductStock();
  DB.sales.push(buildSale("كامل",paidVal||total));
  DB.cart=[]; document.getElementById("paid").value="";
  saveDB();
  showToast(change>0?t("msg_change")+formatPrice(change):t("msg_sold"),"success");
  renderSaleStock(); renderReports();
}
function partial(){
  if(!DB.cart.length){ showToast(t("msg_no_cart"),"error"); return; }
  const paidVal=parseFloat(document.getElementById("paid").value);
  const total=getCartTotal();
  if(isNaN(paidVal)||paidVal<=0){ showToast(t("msg_need_amount"),"error"); return; }
  if(paidVal>=total){ showToast(t("msg_covers_all"),"error"); return; }
  const remaining=total-paidVal;
  const customerName=custSelect.value||"—";
  const customer=DB.customers.find(c=>c.name===customerName);
  const debtRecord={date:new Date().toISOString(),total,paid:paidVal,remaining};
  if(customer){ customer.debts=customer.debts||[]; customer.debts.push(debtRecord); }
  deductStock();
  DB.sales.push(buildSale("جزئي",paidVal));
  DB.debts=DB.debts||[];
  DB.debts.push({customer:customerName,...debtRecord});
  DB.cart=[]; document.getElementById("paid").value="";
  saveDB();
  showToast(t("msg_partial_ok")+formatPrice(paidVal)+t("msg_partial_rem")+formatPrice(remaining),"success");
  renderSaleStock(); renderReports();
}
function toDebt(){
  if(!DB.cart.length){ showToast(t("msg_no_cart"),"error"); return; }
  const customerName=custSelect.value;

  // قيد العامل: يجب اختيار زبون مسجل
  if(!customerName){ showToast(t("msg_select_customer"),"error"); return; }

  // العامل لا يستطيع البيع بالدين لغير المسجلين
  const logged = JSON.parse(localStorage.getItem("POSDZ_LOGGED"));
  const isManager = logged && logged.role === "manager";
  const registeredCustomer = DB.customers.find(c => c.name === customerName);
  if (!isManager && !registeredCustomer) {
    showToast("⛔ العامل يستطيع البيع بالدين للزبائن المسجلين فقط", "error"); return;
  }

  const total=getCartTotal();
  const customer=DB.customers.find(c=>c.name===customerName);
  const debtRecord={date:new Date().toISOString(),total,paid:0,remaining:total};
  if(customer){ customer.debts=customer.debts||[]; customer.debts.push(debtRecord); }
  deductStock();
  DB.sales.push(buildSale("دين",0));
  DB.debts=DB.debts||[];
  DB.debts.push({customer:customerName,...debtRecord});
  DB.cart=[]; saveDB();
  showToast(t("msg_debt_ok")+customerName+t("msg_debt_amount")+formatPrice(total),"success");
  renderSaleStock(); renderReports();
}

/* ================================================
   REPORTS
================================================ */
let currentReportTab="daily";
function switchReportTab(tab,btn){
  currentReportTab=tab;
  document.querySelectorAll(".rtab").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  renderReports();
}
function filterSalesByPeriod(tab){
  const now=new Date();
  return(DB.sales||[]).filter(s=>{
    const d=new Date(s.date);
    if(tab==="daily")   return isSameDay(d,now);
    if(tab==="weekly")  return isSameWeek(d,now);
    if(tab==="monthly") return isSameMonth(d,now);
    if(tab==="yearly")  return isSameYear(d,now);
    return true;
  });
}
function renderReports(){
  const sales=filterSalesByPeriod(currentReportTab);
  let revenue=0,cost=0;
  sales.forEach(s=>s.items.forEach(i=>{ revenue+=i.price*i.qty; cost+=(i.cost||0)*i.qty; }));
  document.getElementById("rSales").textContent=sales.length;
  document.getElementById("rRevenue").textContent=formatPrice(revenue);
  document.getElementById("rCost").textContent=formatPrice(cost);
  document.getElementById("rProfit").textContent=formatPrice(revenue-cost);
  renderDebts(); renderSalesLog(sales);
}
function renderDebts(){
  const byCustomer={};
  (DB.debts||[]).forEach(d=>{
    if(!byCustomer[d.customer]) byCustomer[d.customer]=0;
    byCustomer[d.customer]+=d.remaining||0;
  });
  const totalDebt=Object.values(byCustomer).reduce((s,v)=>s+v,0);
  const debtCount=Object.keys(byCustomer).filter(k=>byCustomer[k]>0).length;
  document.getElementById("rTotalDebt").textContent=formatPrice(totalDebt);
  document.getElementById("rDebtCount").textContent=debtCount;
  const debtList=document.getElementById("debtList");
  debtList.innerHTML="";
  const entries=Object.entries(byCustomer).filter(([,v])=>v>0);
  if(!entries.length){ debtList.innerHTML=`<li style="color:var(--text3);text-align:center;padding:20px">${t("no_debts")}</li>`; return; }
  entries.forEach(([name,amount])=>{
    const li=document.createElement("li");
    li.style.cssText="display:flex;justify-content:space-between;align-items:center;padding:10px 8px;border-bottom:1px solid var(--border)";
    li.innerHTML=`
      <span>👤 <strong>${name}</strong></span>
      <div style="display:flex;align-items:center;gap:8px">
        <span style="color:#ef4444;font-weight:700">${formatPrice(amount)}</span>
        <button onclick="settleDebt('${name}')" style="background:#10b981;padding:4px 10px;font-size:13px">${t("settle_btn")}</button>
      </div>`;
    debtList.appendChild(li);
  });
}
function settleDebt(customerName){
  const amount=window.prompt(t("settle_prompt"));
  if(!amount||isNaN(amount)||Number(amount)<=0) return;
  const pay=parseFloat(amount);
  let remaining=pay;
  (DB.debts||[]).forEach(d=>{
    if(d.customer===customerName&&d.remaining>0&&remaining>0){
      const deduct=Math.min(d.remaining,remaining);
      d.remaining-=deduct; d.paid+=deduct; remaining-=deduct;
    }
  });
  const customer=DB.customers.find(c=>c.name===customerName);
  if(customer){ let r2=pay; (customer.debts||[]).forEach(d=>{ if(d.remaining>0&&r2>0){const x=Math.min(d.remaining,r2);d.remaining-=x;r2-=x;} }); }
  saveDB();
  showToast(t("settle_ok")+formatPrice(pay)+t("settle_from")+customerName,"success");
  renderDebts();
}
function renderSalesLog(sales){
  const salesLog=document.getElementById("salesLog");
  salesLog.innerHTML="";
  if(!sales.length){ salesLog.innerHTML=`<li style="color:var(--text3);text-align:center;padding:20px">${t("no_sales")}</li>`; return; }
  const typeColor={"كامل":"#10b981","جزئي":"#f59e0b","دين":"#ef4444"};
  [...sales].reverse().forEach(sale=>{
    const li=document.createElement("li");
    li.style.cssText="padding:10px 8px;border-bottom:1px solid var(--border);font-size:14px";
    li.innerHTML=`
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px">
        <span>${sale.invoiceNum?`<strong>#${sale.invoiceNum}</strong> | `:""}<span style="color:${typeColor[sale.type]||"var(--text)"};font-weight:700">${sale.type}</span> | 👤 ${sale.customer}</span>
        <span style="font-weight:800">${formatPrice(sale.total)}</span>
      </div>
      <div style="color:var(--text3);font-size:12px">${formatDate(sale.date)}</div>`;
    salesLog.appendChild(li);
  });
}

/* ================================================
   CLOCK
================================================ */
function startClock(){
  function updateTime(){
    const now=new Date();
    const fmt=DB.settings.timeFormat||"24";
    const opts=fmt==="12"?{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:true}:{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false};
    if(currentTimeEl) currentTimeEl.textContent=now.toLocaleTimeString(undefined,opts);
    if(currentDateEl) currentDateEl.textContent=formatDate(now.toISOString());
  }
  updateTime(); setInterval(updateTime,1000);
}

/* ================================================
   INIT
================================================ */
addUserForm.addEventListener("submit", addUser);
addUserInAlerts.addEventListener("submit", addUserInAlertsFunc);

applyTranslations();
renderUsersTable();
renderUserSelect();
renderStock();
renderSaleStock();
renderCustomerSelect();
renderCustomerList();
renderFamilyList();
renderBrandList();
loadAppearanceSettings();

const logged=JSON.parse(localStorage.getItem("POSDZ_LOGGED"));
if(logged){
  loginScreen.style.display="none";
  mainApp.style.display="block";
  applyHeader(); showSale(); startClock();
  checkAutoBackup();
} else {
  loginScreen.style.display="flex";
  mainApp.style.display="none";
}

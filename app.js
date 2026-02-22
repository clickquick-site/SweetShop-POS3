


/* ================================================
   BARCODE & QR SCANNER — نظام مسح الباركود و QR
================================================ */
let scannerActive = false;
let scannerContext = null;

// فتح نافذة المسح
function startBarcodeScanner(context) {
  scannerContext = context;
  const scannerModal = document.getElementById('scannerModal');
  const video = document.getElementById('scannerVideo');
  
  if (scannerModal) scannerModal.style.display = 'flex';
  
  // طلب الوصول للكاميرا
  navigator.mediaDevices.getUserMedia({ 
    video: { facingMode: 'environment' } 
  }).then(stream => {
    if (video) {
      video.srcObject = stream;
      video.play();
      scannerActive = true;
      scanBarcodeFromVideo();
    }
  }).catch(err => {
    showToast('لا يمكن الوصول للكاميرا: ' + err.message, 'error');
    closeScannerModal();
  });
}

// إغلاق نافذة المسح
function closeScannerModal() {
  const scannerModal = document.getElementById('scannerModal');
  const video = document.getElementById('scannerVideo');
  
  if (scannerModal) scannerModal.style.display = 'none';
  scannerActive = false;
  
  // إيقاف الفيديو
  if (video && video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  }
}

// مسح الباركود من الفيديو
function scanBarcodeFromVideo() {
  const video = document.getElementById('scannerVideo');
  const canvas = document.getElementById('scannerCanvas');
  
  if (!scannerActive || !video || !canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  function scan() {
    if (!scannerActive) return;
    
    // التحقق من أن الفيديو يعمل
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      requestAnimationFrame(scan);
      return;
    }
    
    // رسم الفيديو على Canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    try {
      // محاولة قراءة Barcode و QR
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const codeReader = new ZXing.BrowserMultiFormatReader();
      
      // محاولة فك تشفير الصورة
      const hints = new ZXing.Map();
      hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [
        ZXing.BarcodeFormat.QR_CODE,
        ZXing.BarcodeFormat.CODE_128,
        ZXing.BarcodeFormat.CODE_39,
        ZXing.BarcodeFormat.EAN_13,
        ZXing.BarcodeFormat.EAN_8,
        ZXing.BarcodeFormat.UPCA
      ]);
      
      const luminanceSource = new ZXing.HTMLCanvasElementLuminanceSource(canvas);
      const binaryBitmap = new ZXing.BinaryBitmap(new ZXing.HybridBinarizer(luminanceSource));
      const result = new ZXing.MultiFormatReader().decode(binaryBitmap);
      
      if (result) {
        processScanResult(result.getText());
      }
    } catch (e) {
      // لا توجد نتيجة حتى الآن
    }
    
    requestAnimationFrame(scan);
  }
  
  scan();
}

// معالجة نتيجة المسح
function processScanResult(scannedValue) {
  if (!scannedValue || scannedValue.trim() === '') return;
  
  closeScannerModal();
  
  if (scannerContext === 'product') {
    // في قسم إضافة المنتج
    document.getElementById('barcode').value = scannedValue.trim();
    showToast('✓ تم قراءة الكود بنجاح', 'success');
    document.getElementById('barcode').focus();
  } else if (scannerContext === 'sale') {
    // في واجهة البيع
    document.getElementById('search').value = scannedValue.trim();
    document.getElementById('searchQty').value = 1;
    addItem();
    showToast('✓ تم إضافة المنتج من الكود', 'success');
  }
}

/* ================================================
   BARCODE INPUT — نظام إدخال الباركود اليدوي
================================================ */
let barcodeInput = '';
let barcodeTimeout;

// تفعيل قارئ الباركود عند الضغط على أي مفتاح
document.addEventListener('keypress', function(e) {
  // تجنب تفعيل قارئ الباركود عند الكتابة في حقول معينة
  if (document.activeElement.tagName === 'INPUT' && 
      (document.activeElement.id === 'search' || 
       document.activeElement.id === 'barcode' ||
       document.activeElement.type === 'text')) return;
  
  if (document.activeElement.type === 'password') return;
  
  barcodeInput += e.key;
  clearTimeout(barcodeTimeout);
  
  barcodeTimeout = setTimeout(function() {
    if (barcodeInput.length > 0) {
      processBarcodeScan(barcodeInput.trim());
    }
    barcodeInput = '';
  }, 50);
});

// معالجة البيانات المسحوئة من الباركود (الإدخال اليدوي)
function processBarcodeScan(barcode) {
  const product = DB.stock.find(p => p.barcode === barcode);
  
  if (product) {
    document.getElementById('search').value = product.name;
    document.getElementById('searchQty').value = 1;
    addItem();
    showBarcodeSuccess();
  } else {
    showBarcodeError('لم يتم العثور على المنتج');
  }
}

// تنبيه بصري عند النجاح
function showBarcodeSuccess() {
  const search = document.getElementById('search');
  if (!search) return;
  const originalStyle = search.style.borderColor;
  search.style.borderColor = '#10b981';
  setTimeout(() => {
    search.style.borderColor = originalStyle;
  }, 500);
}

// تنبيه بصري عند الفشل
function showBarcodeError(msg) {
  const search = document.getElementById('search');
  if (!search) return;
  const originalStyle = search.style.borderColor;
  search.style.borderColor = '#ef4444';
  showToast(msg, 'error');
  setTimeout(() => {
    search.style.borderColor = originalStyle;
  }, 500);
}

/* ================================================
   TRANSLATIONS — نظام الترجمة
================================================ */
const TRANSLATIONS = {
  ar: {
    login_title:"تسجيل الدخول", login_btn:"دخول", logout:"خروج",
    pin_placeholder:"رمز PIN",
    menu_sale:"البيع", menu_stock:"المخزون",
    menu_customers:"الزبائن", menu_users:"إدارة المستخدمين",
    menu_reports:"إدارة الأعمال", menu_settings:"الإعدادات",
    back:"الرجوع",
    sale_title:"واجهة البيع",
    search_placeholder:"اسم أو باركود",
    add_btn:"إضافة",
    col_item:"سلعة", col_qty:"كمية", col_price:"سعر",
    col_total:"مجموع", col_options:"خيارات",
    col_name:"الاسم", col_role:"الدور",
    paid_placeholder:"المبلغ المدفوع",
    pay_btn:"تسديد", partial_btn:"جزئي", debt_btn:"دين",
    tab_families:"العائلات", tab_brands:"الماركات", tab_all_stock:"كل السلع",
    families_title:"العائلات — نوع المنتج",
    brands_title:"الماركات — عائلة المنتج",
    add_product_title:"إضافة منتج جديد",
    all_products:"كل المنتجات",
    family_ph:"أدخل اسم العائلة...",
    brand_ph:"أدخل اسم الماركة...",
    add_family:"إضافة", add_brand:"إضافة",
    family_label:"العائلة", brand_label:"الماركة",
    size_label:"الحجم / المقاس", barcode_label:"باركود",
    price_label:"سعر البيع", cost_label:"سعر الشراء",
    qty_label:"الكمية", exp_label:"تاريخ الصلاحية",
    save_item:"حفظ المنتج",
    stock_search_ph:"بحث في المخزون...",
    edit_btn:"تعديل", del_btn:"مسح",
    tab_day:"اليوم", tab_week:"الأسبوع", tab_month:"الشهر",
    tab_year:"السنة", tab_all:"الكل",
    r_sales:"عمليات البيع", r_revenue:"المداخيل",
    r_cost:"تكلفة الشراء", r_profit:"صافي الربح",
    debts_title:"تتبع الديون",
    total_debts:"إجمالي الديون", debtors_count:"عدد المدينين",
    sales_log:"سجل العمليات",
    settle_btn:"تسوية",
    no_debts:"لا توجد ديون", no_sales:"لا توجد عمليات",
    stab_app:"البرنامج", stab_store:"المتجر",
    stab_print:"الطباعة", stab_system:"النظام",
    date_format:"صيغة التاريخ", time_format:"صيغة الوقت",
    currency_label:"رمز العملة", lang_label:"لغة البرنامج",
    save_app:"حفظ إعدادات البرنامج",
    logo_label:"شعار المتجر",
    upload_logo:"تحميل الشعار", remove_logo:"حذف",
    shop_name:"اسم المتجر", phone_label:"رقم الهاتف",
    address_label:"العنوان", welcome_label:"رسالة ترحيب للفاتورة",
    save_store:"حفظ بيانات المتجر",
    invoice_num:"رقم الفاتورة الحالي (قابل للتعديل)",
    printer_label:"اختيار الطابعة", paper_size:"مقاس الورق",
    copies_label:"عدد النسخ",
    print_logo:"طباعة شعار المتجر", print_name:"طباعة اسم المتجر",
    print_phone:"طباعة رقم الهاتف", print_welcome:"طباعة رسالة الترحيب",
    print_barcode:"طباعة باركود المنتجات",
    print_cust_barcode:"طباعة باركود الفاتورة",
    save_print:"حفظ إعدادات الطباعة",
    auto_backup_title:"سجل العمليات والنسخ التلقائي",
    auto_backup_desc:"تفعيل النسخ اليومي التلقائي لبيانات التطبيق.",
    auto_backup_toggle:"تفعيل النسخ اليومي التلقائي",
    manual_backup:"نسخ احتياطي الآن",
    reset_btn:"إعادة ضبط النظام",
    reset_warning:"تحذير: هذا الجزء سيقوم بحذف جميع البيانات (المنتجات، الفواتير، الزبائن، التقارير) وإعادة البرنامج لحالته الأصلية من البداية.",
    customer_ph:"اسم الزبون",
    username_ph:"اسم المستخدم",
    role_seller:"بائع", role_manager:"مدير",
    add_user:"إضافة",
    lang_preview:"سيتم تطبيق اللغة بعد الحفظ.",
    msg_select_user:"اختر المستخدم أولاً",
    msg_wrong_pin:"اسم المستخدم أو الرمز خاطئ",
    msg_saved:"تم الحفظ بنجاح!",
    msg_family_exists:"هذه العائلة موجودة مسبقاً",
    msg_brand_exists:"هذه الماركة موجودة مسبقاً",
    msg_select_family:"اختر العائلة أولاً",
    msg_barcode_exists:"هذا الباركود موجود مسبقاً",
    msg_item_updated:"المنتج موجود — تم تحديث الكمية!",
    msg_item_saved:"تم إضافة المنتج بنجاح!",
    msg_fill_all:"الرجاء إدخال كل البيانات بشكل صحيح!",
    msg_no_cart:"لا يوجد منتجات في العربة!",
    msg_low_balance:"المبلغ المدفوع أقل من الإجمالي",
    msg_sold:"تم تسجيل البيع بنجاح!",
    msg_change:"تم البيع!\nالباقي للزبون: ",
    msg_partial_ok:"دفع جزئي!\nمدفوع: ",
    msg_partial_rem:"\nمتبقي: ",
    msg_need_amount:"أدخل المبلغ المدفوع جزئياً",
    msg_covers_all:"المبلغ يغطي الكل، استخدم 'تسديد'",
    msg_select_customer:"اختر زبوناً لتسجيل الدين عليه",
    msg_debt_ok:"تم تسجيل الدين على ",
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
    msg_backup_done:"تم تنزيل النسخة الاحتياطية!",
    msg_backup_auto_on:"تم تفعيل النسخ التلقائي اليومي.",
    msg_backup_auto_off:"تم إيقاف النسخ التلقائي.",
    msg_reset_confirm:"اكتب 'نعم' للتأكيد:",
    msg_reset_done:"تم إعادة ضبط النظام.",
    msg_reset_cancel:"تم إلغاء العملية.",
    settle_prompt:"أدخل المبلغ المدفوع:",
    settle_ok:"تم تسجيل دفع ",
    settle_from:" من ",
    no_stock:"المخزون فارغ",
    no_families:"لا توجد عائلات بعد",
    no_brands:"لا توجد ماركات بعد",
    no_customers:"لا يوجد زبائن بعد",
    msg_clear_month_confirm:"هل تريد مسح جميع بيانات المبيعات لهذا الشهر؟ لا يمكن التراجع.",
    msg_clear_year_confirm:"هل تريد مسح جميع بيانات المبيعات لهذه السنة؟ لا يمكن التراجع.",
    msg_clear_done:"تم مسح البيانات بنجاح.",
    msg_clear_cancel:"تم إلغاء العملية.",
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
    reset_warning:"⚠️ Attention : Cette action supprimera toutes les données et remettra le programme à son état initial.",
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
    msg_clear_month_confirm:"Supprimer toutes les ventes de ce mois? Irréversible.",
    msg_clear_year_confirm:"Supprimer toutes les ventes de cette année? Irréversible.",
    msg_clear_done:"✅ Données supprimées avec succès.",
    msg_clear_cancel:"Opération annulée.",
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
    reset_warning:"⚠️ Warning: This will delete all data and reset the program to its initial state.",
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
    msg_clear_month_confirm:"Delete all sales data for this month? This cannot be undone.",
    msg_clear_year_confirm:"Delete all sales data for this year? This cannot be undone.",
    msg_clear_done:"✅ Data cleared successfully.",
    msg_clear_cancel:"Operation cancelled.",
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
   DATABASE — قاعدة البيانات مع ضمان سلامة البيانات
================================================ */

/* المستخدم الافتراضي المضمون دائماً */
const DEFAULT_ADMIN = { name: "Admin", pin: "1234", role: "manager", immutable: true };

/* القيم الافتراضية الكاملة للإعدادات */
const DEFAULT_SETTINGS = {
  name:"POS DZ", phone:"", addr:"", welcome:"",
  currency:"دج", lang:"ar",
  dateFormat:"DD-MM-YYYY", timeFormat:"24", logo:"",
  printer:"default", paperSize:"80mm", copies:1,
  printLogo:false, printShopName:true, printPhone:true,
  printWelcome:true, printBarcode:false, printCustBarcode:false,
  invoiceNum:1, autoBackup:false, lastBackup:"",
  soundAdd:false, soundPay:false, barcodeReader:true,
  fontFamily:"Cairo", fontSize:15, appTheme:"default"
};

/* تحميل قاعدة البيانات مع ضمان سلامتها */
function loadDB() {
  let raw = null;
  try { raw = JSON.parse(localStorage.getItem("POSDZ")); } catch(e) { raw = null; }

  /* إذا لم تكن هناك بيانات — قاعدة بيانات جديدة نظيفة */
  if (!raw || typeof raw !== "object") {
    return {
      users:    [{ ...DEFAULT_ADMIN }],
      settings: { ...DEFAULT_SETTINGS },
      families:[], brands:[], stock:[], cart:[],
      customers:[], debts:[], sales:[], suppliers:[], orders:[]
    };
  }

  /* ضمان وجود مصفوفة المستخدمين */
  if (!Array.isArray(raw.users)) raw.users = [];

  /* ✅ ضمان وجود Admin — بالبحث عن immutable أو عن الاسم "Admin" */
  const hasAdmin = raw.users.some(u => u.immutable === true || u.name === "Admin");
  if (!hasAdmin) {
    raw.users.unshift({ ...DEFAULT_ADMIN });
  } else {
    /* التأكد من أن Admin يملك الصلاحيات الصحيحة */
    const adminIdx = raw.users.findIndex(u => u.immutable === true || u.name === "Admin");
    if (adminIdx !== -1) {
      raw.users[adminIdx] = {
        ...raw.users[adminIdx],
        role: "manager",
        immutable: true
      };
    }
  }

  /* ضمان سلامة الإعدادات — دمج القيم الناقصة مع الافتراضية */
  raw.settings = Object.assign({}, DEFAULT_SETTINGS, raw.settings || {});

  /* ضمان وجود المصفوفات الأساسية */
  raw.families  = Array.isArray(raw.families)  ? raw.families  : [];
  raw.brands    = Array.isArray(raw.brands)    ? raw.brands    : [];
  raw.stock     = Array.isArray(raw.stock)     ? raw.stock     : [];
  raw.cart      = Array.isArray(raw.cart)      ? raw.cart      : [];
  raw.customers = Array.isArray(raw.customers) ? raw.customers : [];
  raw.debts     = Array.isArray(raw.debts)     ? raw.debts     : [];
  raw.sales     = Array.isArray(raw.sales)     ? raw.sales     : [];
  raw.suppliers = Array.isArray(raw.suppliers) ? raw.suppliers : [];
  raw.orders    = Array.isArray(raw.orders)    ? raw.orders    : [];

  return raw;
}

let DB = loadDB();

/* حفظ فوري بعد التحميل لضمان البيانات المُصلحة */
(function(){ try { localStorage.setItem("POSDZ", JSON.stringify(DB)); } catch(e){} })();

/* ================================================
   DOM ELEMENTS — بشكل آمن لتفادي توقف الكود
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

/* ربط زر القائمة يتم لاحقاً في قسم MENU BUTTON */

/* ================================================
   UTILITY
================================================ */
function saveDB() {
  /* ضمان Admin قبل كل عملية حفظ */
  if (!Array.isArray(DB.users)) DB.users = [];
  const hasAdmin = DB.users.some(u => u.immutable === true);
  if (!hasAdmin) DB.users.unshift({ ...DEFAULT_ADMIN });
  try { localStorage.setItem("POSDZ", JSON.stringify(DB)); } catch(e) {
    console.warn("POSDZ: تعذّر الحفظ في localStorage", e);
  }
}
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
   TOAST SYSTEM
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

/* window.confirm — الإبقاء على النسخة الأصلية بدون تعديل */

/* ================================================
   SAFE CONFIRM — نافذة تأكيد مخصصة موثوقة
================================================ */
function safeConfirm(msg, onYes) {
  // إنشاء المودال إذا لم يكن موجوداً
  let overlay = document.getElementById("safeConfirmOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "safeConfirmOverlay";
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:99999;
      display:flex;align-items:center;justify-content:center;
      backdrop-filter:blur(4px);animation:fadeIn .15s ease;
    `;
    overlay.innerHTML = `
      <div style="background:var(--surface,#fff);border-radius:16px;padding:28px 28px 22px;max-width:360px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.25);border:1px solid var(--border,#e2e5f0);text-align:center">
        <div style="font-size:28px;margin-bottom:12px">⚠️</div>
        <div id="safeConfirmMsg" style="font-size:15px;font-weight:600;color:var(--text,#0f172a);line-height:1.6;margin-bottom:22px"></div>
        <div style="display:flex;gap:10px;justify-content:center">
          <button id="safeConfirmNo"  style="flex:1;padding:11px;background:var(--bg2,#e8eaf2);color:var(--text,#0f172a);border-radius:10px;font-weight:700;font-size:14px;border:none;cursor:pointer">إلغاء</button>
          <button id="safeConfirmYes" style="flex:1;padding:11px;background:linear-gradient(135deg,#ef4444,#dc2626);color:white;border-radius:10px;font-weight:700;font-size:14px;border:none;cursor:pointer">تأكيد الحذف</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  }
  document.getElementById("safeConfirmMsg").textContent = msg;
  overlay.style.display = "flex";
  const close = () => { overlay.style.display = "none"; };
  document.getElementById("safeConfirmNo").onclick  = close;
  document.getElementById("safeConfirmYes").onclick = () => { close(); onYes(); };
  overlay.onclick = (e) => { if (e.target === overlay) close(); };
}

/* نافذة إدخال مخصصة — بديل window.prompt */
function safePrompt(msg, onConfirm, defaultVal="") {
  let overlay = document.getElementById("safePromptOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "safePromptOverlay";
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:99999;
      display:flex;align-items:center;justify-content:center;
      backdrop-filter:blur(4px);
    `;
    overlay.innerHTML = `
      <div style="background:var(--surface,#fff);border-radius:16px;padding:28px 28px 22px;max-width:360px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.25);border:1px solid var(--border,#e2e5f0)">
        <div id="safePromptMsg" style="font-size:15px;font-weight:600;color:var(--text,#0f172a);margin-bottom:14px;line-height:1.6"></div>
        <input id="safePromptInput" type="number" min="0" step="0.01"
          style="width:100%;padding:12px 14px;border-radius:10px;border:1.5px solid var(--border,#e2e5f0);font-size:15px;font-family:inherit;margin-bottom:16px;outline:none;box-sizing:border-box">
        <div style="display:flex;gap:10px">
          <button id="safePromptNo"  style="flex:1;padding:11px;background:var(--bg2,#e8eaf2);color:var(--text,#0f172a);border-radius:10px;font-weight:700;font-size:14px;border:none;cursor:pointer">إلغاء</button>
          <button id="safePromptYes" style="flex:1;padding:11px;background:linear-gradient(135deg,#10b981,#059669);color:white;border-radius:10px;font-weight:700;font-size:14px;border:none;cursor:pointer">تأكيد</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  }
  document.getElementById("safePromptMsg").textContent = msg;
  const inp = document.getElementById("safePromptInput");
  inp.value = defaultVal;
  overlay.style.display = "flex";
  setTimeout(()=>inp.focus(), 100);
  const close = () => { overlay.style.display = "none"; inp.value = ""; };
  document.getElementById("safePromptNo").onclick  = close;
  document.getElementById("safePromptYes").onclick = () => { const v=inp.value; close(); onConfirm(v); };
  inp.onkeydown = (e) => { if(e.key==="Enter"){ const v=inp.value; close(); onConfirm(v); } };
  overlay.onclick = (e) => { if(e.target===overlay) close(); };
}

/* نافذة إدخال نصي مخصصة */
function safeTextPrompt(label, defaultVal, onConfirm) {
  let overlay = document.getElementById("safeTextPromptOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "safeTextPromptOverlay";
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)";
    overlay.innerHTML = `
      <div style="background:var(--surface,#fff);border-radius:16px;padding:28px 28px 22px;max-width:360px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.25);border:1px solid var(--border,#e2e5f0)">
        <div id="safeTextLabel" style="font-size:15px;font-weight:700;color:var(--text,#0f172a);margin-bottom:12px"></div>
        <input id="safeTextInput" type="text"
          style="width:100%;padding:12px 14px;border-radius:10px;border:1.5px solid var(--border,#e2e5f0);font-size:15px;font-family:inherit;margin-bottom:16px;outline:none;box-sizing:border-box">
        <div style="display:flex;gap:10px">
          <button id="safeTextNo"  style="flex:1;padding:11px;background:var(--bg2,#e8eaf2);color:var(--text,#0f172a);border-radius:10px;font-weight:700;font-size:14px;border:none;cursor:pointer">إلغاء</button>
          <button id="safeTextYes" style="flex:1;padding:11px;background:linear-gradient(135deg,#6366f1,#a855f7);color:white;border-radius:10px;font-weight:700;font-size:14px;border:none;cursor:pointer">✅ حفظ</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  }
  document.getElementById("safeTextLabel").textContent = label;
  const inp = document.getElementById("safeTextInput");
  inp.value = defaultVal || "";
  overlay.style.display = "flex";
  setTimeout(()=>{ inp.focus(); inp.select(); }, 100);
  const close = () => { overlay.style.display = "none"; };
  document.getElementById("safeTextNo").onclick  = close;
  document.getElementById("safeTextYes").onclick = () => { const v=inp.value; close(); onConfirm(v); };
  inp.onkeydown = (e) => { if(e.key==="Enter"){ const v=inp.value; close(); onConfirm(v); } };
  overlay.onclick = (e) => { if(e.target===overlay) close(); };
}
/* ================================================ */
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === 'add') {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'pay') {
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch(e) {}
}

function triggerSound(type) {
  const s = DB.settings;
  if (type === 'add' && s.soundAdd) playSound('add');
  if (type === 'pay' && s.soundPay) playSound('pay');
}

function testSound(type) { playSound(type); }

function saveSoundSettings() {
  DB.settings.soundAdd       = document.getElementById("sSoundAdd")?.checked || false;
  DB.settings.soundPay       = document.getElementById("sSoundPay")?.checked || false;
  DB.settings.barcodeReader  = document.getElementById("sBarcodeReader")?.checked || false;
  saveDB();
  showToast("✅ تم حفظ الإعدادات", "success");
}

/* ================================================
   BARCODE READER — قارئ الباركود (مُصلَح)
   يعتمد على قياس الزمن بين الضغطات لتمييز السكانر عن الكتابة اليدوية
   السكانر يُدخل عادةً أكثر من 4 أحرف في أقل من 120ms
================================================ */
let barcodeBuffer    = "";
let barcodeTimer     = null;
let barcodeStartTime = null;
const SCANNER_MAX_DELAY_MS = 120; // حد أقصى للفترة بين أول وآخر حرف للسكانر

document.addEventListener("keydown", function(e) {
  if (!DB.settings.barcodeReader) return;
  const activePage = document.querySelector(".page.active");
  if (!activePage || activePage.id !== "sale") return;

  const focused = document.activeElement;
  const isInput = focused && (focused.tagName === "INPUT" || focused.tagName === "SELECT" || focused.tagName === "TEXTAREA");
  if (isInput && focused.id !== "search") return;

  if (e.key === "Enter") {
    if (barcodeBuffer.length > 2) {
      const elapsed = barcodeStartTime ? (Date.now() - barcodeStartTime) : 9999;
      const bc = barcodeBuffer.trim();
      barcodeBuffer = "";
      barcodeStartTime = null;
      clearTimeout(barcodeTimer);

      // التحقق من أن الإدخال جاء بسرعة السكانر وليس الكتابة اليدوية
      if (elapsed <= SCANNER_MAX_DELAY_MS) {
        const item = DB.stock.find(i => i.barcode === bc);
        if (item) {
          document.getElementById("search").value = bc;
          addItemByBarcode(bc);
        } else {
          showToast(t("msg_not_found") + ": " + bc, "error");
        }
      }
      // إن كانت الفترة أطول → كتابة يدوية، تُنفَّذ عبر addItem() العادية
    }
    return;
  }

  if (e.key.length === 1) {
    if (!barcodeBuffer) barcodeStartTime = Date.now();
    barcodeBuffer += e.key;
    clearTimeout(barcodeTimer);
    barcodeTimer = setTimeout(() => {
      barcodeBuffer    = "";
      barcodeStartTime = null;
    }, 300);
  }
});

function addItemByBarcode(bc) {
  const item = DB.stock.find(i => i.barcode === bc);
  if (!item) { showToast(t("msg_not_found"), "error"); return; }
  if (item.qty <= 0) { showToast(t("msg_out_of_stock"), "error"); return; }
  const cartItem = DB.cart.find(c => c.barcode === item.barcode);
  if (cartItem) {
    if (cartItem.qty >= item.qty) { showToast(t("msg_not_enough"), "error"); return; }
    cartItem.qty += 1;
  } else {
    DB.cart.push({ name:`${item.type} ${item.brand}`, barcode:item.barcode, price:item.price, costPrice:item.costPrice, qty:1 });
  }
  triggerSound('add');
  document.getElementById("search").value = "";
  document.getElementById("searchSuggestions")?.classList.add("hidden");
  saveDB(); renderSaleStock();
}

/* ================================================
   PRINTER SEARCH — البحث عن طابعة
================================================ */
async function searchForPrinters() {
  const statusEl = document.getElementById("printerSearchStatus");
  const select   = document.getElementById("sPrinter");
  if (statusEl) statusEl.innerHTML = "⏳ جارٍ البحث عن الطابعات...";

  try {
    /* ===== محاولة 1: Web Serial API (Chrome 89+) ===== */
    if (navigator.serial) {
      const ports = await navigator.serial.getPorts().catch(()=>[]);
      if (ports.length > 0) {
        select.innerHTML = "";
        ports.forEach((p, i) => {
          const o = document.createElement("option");
          o.value = "serial_" + i;
          const info = p.getInfo ? p.getInfo() : {};
          o.textContent = info.usbVendorId
            ? "طابعة USB — VID:" + info.usbVendorId.toString(16).toUpperCase()
            : "منفذ تسلسلي #" + (i+1);
          select.appendChild(o);
        });
        /* خيار الطابعة الافتراضية دائماً */
        const def = document.createElement("option");
        def.value = "default"; def.textContent = "الطابعة الافتراضية للنظام";
        select.insertBefore(def, select.firstChild);
        select.value = DB.settings.printer || "default";
        if (statusEl) statusEl.innerHTML = "✅ تم الكشف عن <strong>" + ports.length + "</strong> طابعة عبر USB.";
        showToast("✅ تم الكشف عن الطابعات", "success");
        return;
      }
    }

    /* ===== محاولة 2: window.print() مع تحديد الطابعة عبر CSS ===== */
    /* المتصفح سيفتح نافذة اختيار الطابعة تلقائياً */
    select.innerHTML = "";
    const printersList = [
      { value: "default",  label: "🖨️ الطابعة الافتراضية للنظام" },
      { value: "thermal",  label: "🔥 طابعة حرارية 80mm (XP-80C, POS-80)" },
      { value: "thermal58",label: "🔥 طابعة حرارية 58mm" },
      { value: "inkjet",   label: "💧 طابعة عادية (Inkjet/Laser)" },
    ];
    printersList.forEach(p => {
      const o = document.createElement("option");
      o.value = p.value; o.textContent = p.label;
      select.appendChild(o);
    });
    select.value = DB.settings.printer || "default";

    if (statusEl) statusEl.innerHTML =
      "ℹ️ <strong>ملاحظة:</strong> المتصفح سيفتح قائمة الطابعات تلقائياً عند الطباعة.<br>" +
      "لتعيين الطابعة الافتراضية مباشرة: افتح <strong>إعدادات Windows ← الطابعات</strong> وضع طابعتك الحرارية كافتراضية.";
    showToast("✅ اختر نوع طابعتك من القائمة", "info");

  } catch(e) {
    if (statusEl) statusEl.textContent = "⚠️ تعذّر الكشف. اختر نوع الطابعة يدوياً من القائمة.";
  }
}

/* ================================================
   LOGIN
================================================ */
function renderUserSelect() {
  /* ✅ إذا كانت القائمة فارغة — أعد إضافة Admin طارئاً */
  if (!DB.users || DB.users.length === 0) {
    DB.users = [{ ...DEFAULT_ADMIN }];
    try { localStorage.setItem("POSDZ", JSON.stringify(DB)); } catch(e){}
  }
  userSelect.innerHTML = `<option value="">— اختر المستخدم —</option>`;
  DB.users.forEach(u => {
    const o = document.createElement("option");
    o.value = u.name; o.textContent = u.name;
    userSelect.appendChild(o);
  });
  /* إظهار/إخفاء زر الطوارئ */
  const emergBtn = document.getElementById("emergencyResetBtn");
  if (emergBtn) emergBtn.style.display = "none";
}

/* ✅ إصلاح طارئ — يمسح localStorage تماماً ويعيد التشغيل */
function emergencyReset() {
  if (!confirm("⚠️ هذا سيمسح كل البيانات ويعيد ضبط التطبيق.\nهل أنت متأكد؟")) return;
  try { localStorage.removeItem("POSDZ"); } catch(e){}
  try { localStorage.removeItem("POSDZ_LOGGED"); } catch(e){}
  location.reload();
}

function login() {
  const name = userSelect.value;
  const pin  = pinInput.value.trim();
  if (!name) { showToast(t("msg_select_user"), "error"); return; }
  const user = DB.users.find(u=>u.name===name&&u.pin===pin);
  if (!user) {
    const lm = document.getElementById("loginMsg");
    if (lm) {
      lm.textContent = t("msg_wrong_pin");
      lm.className = "login-msg error";
      clearTimeout(lm._t);
      lm._t = setTimeout(()=>{ lm.className="login-msg"; lm.textContent=""; }, 4000);
    }
    return;
  }
  localStorage.setItem("POSDZ_LOGGED", JSON.stringify(user));
  loginScreen.style.display="none";
  mainApp.style.display="block";
  applyHeader(); showSale(); startClock();
  checkAutoBackup();
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
  applyRolePermissions();
  checkLowStockAlert();
  // ✅ Fix #7: تنبيه إذا كانت هناك سلة متبقية من جلسة سابقة
  if(DB.cart && DB.cart.length>0){
    setTimeout(()=>{
      showToast(`🛒 تنبيه: يوجد ${DB.cart.length} منتج في السلة من جلسة سابقة`, "warning");
    }, 1500);
  }
}

function checkLowStockAlert() {
  const threshold = DB.settings.lowStockThreshold || 5;
  const today = new Date(); today.setHours(0,0,0,0);
  const soon  = new Date(today); soon.setDate(soon.getDate() + 30); // 30 يوماً

  const outItems  = DB.stock.filter(i => i.qty <= 0);
  const lowItems  = DB.stock.filter(i => i.qty > 0 && i.qty <= threshold);
  const expItems  = DB.stock.filter(i => {
    if (!i.exp) return false;
    const d = new Date(i.exp); d.setHours(0,0,0,0);
    return d <= soon && d >= today;
  });
  const expiredItems = DB.stock.filter(i => {
    if (!i.exp) return false;
    const d = new Date(i.exp); d.setHours(0,0,0,0);
    return d < today && i.qty > 0;
  });

  const messages = [];
  if (outItems.length)    messages.push(`🔴 ${outItems.length} منتج نفذ من المخزون`);
  if (lowItems.length)    messages.push(`🟡 ${lowItems.length} منتج أقل من ${threshold}`);
  if (expiredItems.length) messages.push(`☠️ ${expiredItems.length} منتج منتهي الصلاحية`);
  if (expItems.length)    messages.push(`⏰ ${expItems.length} منتج ينتهي خلال 30 يوماً`);

  if (messages.length) {
    const combined = messages.join(" | ");
    setTimeout(() => showToast(combined, "warning"), 1200);
  }
}

function applyRolePermissions() {
  const logged = JSON.parse(localStorage.getItem("POSDZ_LOGGED"));
  const role = logged ? logged.role : "baker";
  const isManager = role === "manager";
  document.querySelectorAll("[data-role='manager']").forEach(el => {
    el.style.display = isManager ? "" : "none";
  });
  const debtBtn = document.getElementById("debtBtn");
  if (debtBtn && !isManager) {
    debtBtn.title = "البيع بالدين مسموح للزبائن المسجلين فقط";
  }
}

/* ================================================
   NAVIGATION
================================================ */
function hideAllPages(){ document.querySelectorAll(".page").forEach(p=>p.classList.remove("active")); }

function showSale(){
  hideAllPages();
  salePage.classList.add("active");
  renderCustomerSelect();
  sideMenu.classList.add("hidden");
}

function show(id){
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
  sideMenu.classList.add("hidden");
  if (id==="reports")   renderReports();
  if (id==="settings")  loadSettings();
  if (id==="alerts")    renderAlerts();
  if (id==="customers") { renderCustomerList(); renderDebts(); }
  if (id==="stock")     { renderFamilyList(); renderBrandList(); renderStock(); populateStockSelects(); }
}

function goBack(){ showSale(); }

/* ================================================
   KEYBOARD SHORTCUTS — اختصارات لوحة المفاتيح
================================================ */
document.addEventListener("keydown", function(e){
  // F2: انتقال سريع لحقل البحث في البيع
  if(e.key==="F2"){
    const activePage=document.querySelector(".page.active");
    if(activePage&&activePage.id==="sale"){
      e.preventDefault();
      const search=document.getElementById("search");
      if(search){search.focus();search.select();}
    }
  }
  // Escape: إغلاق القائمة الجانبية
  if(e.key==="Escape"){
    sideMenu.classList.add("hidden");
    // إغلاق أي مودال مفتوح
    ["safeConfirmOverlay","safePromptOverlay","safeTextPromptOverlay",
     "editItemOverlay","editUserOverlay","printModalOverlay","dailyCloseOverlay"].forEach(id=>{
      const el=document.getElementById(id);
      if(el&&el.style.display!=="none") el.style.display="none";
    });
  }
});

/* ================================================
   MENU BUTTON
================================================ */
if(menuBtn) menuBtn.addEventListener("click", function(e){
  e.stopPropagation();
  sideMenu.classList.toggle("hidden");
});

document.addEventListener("click", function(e){
  if (sideMenu && !sideMenu.classList.contains("hidden") &&
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
  const currEl = document.getElementById("sCurrency");
  if (currEl) {
    const cur = s.currency || "دج";
    let matched = false;
    for (let opt of currEl.options) {
      if (opt.value === cur) { opt.selected = true; matched = true; break; }
    }
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
  // ✅ Fix #35: تحميل حد المخزون المنخفض
  const sLowST=document.getElementById("sLowStockThreshold");
  if(sLowST) sLowST.value=s.lowStockThreshold||5;
  // إعدادات الصوت والباركود
  const sSoundAdd = document.getElementById("sSoundAdd");
  const sSoundPay = document.getElementById("sSoundPay");
  const sBarcodeReader = document.getElementById("sBarcodeReader");
  if (sSoundAdd) sSoundAdd.checked = !!s.soundAdd;
  if (sSoundPay) sSoundPay.checked = !!s.soundPay;
  if (sBarcodeReader) sBarcodeReader.checked = !!s.barcodeReader;
  const ff=document.getElementById("sFontFamily");
  if(ff&&s.fontFamily) ff.value=s.fontFamily;
  document.querySelectorAll(".fsz-btn").forEach(b=>{
    b.classList.toggle("active", parseInt(b.dataset.size)===(s.fontSize||15));
  });
  document.querySelectorAll(".theme-swatch").forEach(sw=>{
    sw.classList.toggle("active", sw.dataset.theme===(s.appTheme||"default"));
  });
  updateInvoicePreview();
  // تحديث معاينة الخط
  updateFontPreview();
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
  // ✅ Fix #30: تحذير إذا الصورة كبيرة جداً (>200KB)
  if(file.size > 200*1024){
    showToast("⚠️ الصورة كبيرة ("+Math.round(file.size/1024)+"KB). يُنصح بصورة أقل من 200KB لتجنب مشاكل الحفظ.","warning");
  }
  const r=new FileReader();
  r.onload=e=>{
    // التحقق من حجم localStorage المتبقي
    try{
      const currentSize=JSON.stringify(DB).length;
      const logoSize=e.target.result.length;
      const totalKB=Math.round((currentSize+logoSize)/1024);
      if(totalKB>4000){
        showToast("❌ الصورة كبيرة جداً — ستتجاوز حد الذاكرة (5MB). اختر صورة أصغر.","error");
        return;
      }
    }catch(ex){}
    DB.settings.logo=e.target.result;
    const lp=document.getElementById("logoPreview");
    if(lp){ lp.src=e.target.result; lp.style.display="block"; }
    saveDB(); applyHeader(); updateInvoicePreview();
  };
  r.readAsDataURL(file);
}

function saveSettingsApp() {
  DB.settings.dateFormat  = document.getElementById("sDateFormat").value;
  DB.settings.timeFormat  = document.getElementById("sTimeFormat").value;
  DB.settings.currency    = document.getElementById("sCurrency").value || "دج";
  DB.settings.lang        = document.getElementById("sLang").value;
  // ✅ Fix #35: حفظ حد المخزون المنخفض
  const threshold=document.getElementById("sLowStockThreshold");
  if(threshold) DB.settings.lowStockThreshold=Math.max(1,parseInt(threshold.value)||5);
  const ff=document.getElementById("sFontFamily");
  if(ff) { DB.settings.fontFamily=ff.value; previewFont(); }
  const afsz=document.querySelector(".fsz-btn.active");
  if(afsz) DB.settings.fontSize=parseInt(afsz.dataset.size);
  const ath=document.querySelector(".theme-swatch.active");
  if(ath) DB.settings.appTheme=ath.dataset.theme;
  saveDB(); applyTranslations(); loadAppearanceSettings();
  showMsgBox("msgSettingsApp", t("msg_saved"), "success");
}

function removeLogo() {
  DB.settings.logo="";
  const lp=document.getElementById("logoPreview");
  if(lp){ lp.src=""; lp.style.display="none"; }
  saveDB(); applyHeader(); updateInvoicePreview();
}

function saveSettings() { saveSettingsStore(); }

/* ================================================
   INVOICE PREVIEW
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
function updateFontPreview() {
  const box = document.getElementById("fontPreviewBox");
  if (!box) return;
  const ff = document.getElementById("sFontFamily")?.value || DB.settings.fontFamily || "Cairo";
  box.style.fontFamily = `'${ff}', system-ui, sans-serif`;
}

function previewFont() {
  const f = document.getElementById("sFontFamily")?.value;
  if(f) {
    document.documentElement.style.setProperty("--font", `'${f}', system-ui, sans-serif`);
    document.body.style.fontFamily = `'${f}', system-ui, sans-serif`;
    // ✅ إصلاح Gap #6: حفظ الخط في الإعدادات عند المعاينة لضمان استمراريته
    DB.settings.fontFamily = f;
    updateFontPreview();
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
    updateFontPreview();
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

// ✅ Fix #33: استيراد النسخة الاحتياطية
function importBackup(input){
  const file=input.files[0]; if(!file) return;
  input.value="";
  const reader=new FileReader();
  reader.onload=function(e){
    try{
      const imported=JSON.parse(e.target.result);
      if(!imported||!imported.users||!imported.settings){
        showToast("❌ الملف غير صالح أو تالف","error"); return;
      }
      safeConfirm("⚠️ استيراد النسخة الاحتياطية سيحل محل البيانات الحالية. هل تريد المتابعة؟", function(){
        DB=imported;
        // ضمان Admin دائماً
        if(!DB.users.some(u=>u.immutable)) DB.users.unshift({...DEFAULT_ADMIN});
        DB.settings=Object.assign({},DEFAULT_SETTINGS,DB.settings);
        saveDB();
        showToast("✅ تم استيراد النسخة الاحتياطية بنجاح! سيتم إعادة التشغيل...","success");
        setTimeout(()=>location.reload(),1800);
      });
    }catch(err){
      showToast("❌ خطأ في قراءة الملف: "+err.message,"error");
    }
  };
  reader.readAsText(file,"UTF-8");
}

function checkAutoBackup() {
  if (!DB.settings.autoBackup) return;
  const last=DB.settings.lastBackup;
  if (!last||!isSameDay(new Date(last),new Date())) manualBackup();
}
function confirmPartialReset() {
  safeConfirm("هل تريد مسح المبيعات والديون وسجل العمليات فقط؟\nأسماء المنتجات والماركات والعائلات ستبقى.", function(){
    DB.sales = [];
    DB.debts  = [];
    DB.customers.forEach(c => { c.debts = []; });
    saveDB();
    showToast("✅ تم المسح الجزئي — أسماء المنتجات والماركات محفوظة.", "success");
    renderReports();
  });
}

function confirmReset() {
  // ✅ Fix #34: طلب PIN قبل الحذف + نسخة احتياطية تلقائية
  safePrompt("🔐 أدخل رمز PIN الخاص بك لتأكيد الحذف الكلي:", function(pin){
    if(!pin){ showToast("تم الإلغاء","info"); return; }
    const logged=JSON.parse(localStorage.getItem("POSDZ_LOGGED")||"null");
    if(!logged||logged.pin!==pin.trim()){
      showToast("❌ رمز PIN خاطئ — تم رفض العملية","error"); return;
    }
    safeConfirm("⚠️ تحذير أخير: سيتم تنزيل نسخة احتياطية ثم حذف كل البيانات. لا يمكن التراجع.", function(){
      try{
        const data=JSON.stringify(DB,null,2);
        const blob=new Blob([data],{type:"application/json"});
        const url=URL.createObjectURL(blob);
        const a=document.createElement("a");
        a.href=url; a.download=`POSDZ_before_reset_${new Date().toISOString().slice(0,10)}.json`;
        a.click(); URL.revokeObjectURL(url);
      }catch(ex){}
      const freshDB = {
        users:    [{ ...DEFAULT_ADMIN }],
        settings: { ...DEFAULT_SETTINGS, lang: DB.settings.lang || "ar" },
        families:[], brands:[], stock:[], cart:[],
        customers:[], debts:[], sales:[], suppliers:[], orders:[]
      };
      DB = freshDB;
      saveDB();
      localStorage.removeItem("POSDZ_LOGGED");
      showToast(t("msg_reset_done"), "success");
      setTimeout(()=>location.reload(), 1500);
    });
  });
}

/* ================================================
   STOCK TAB
================================================ */
function switchStockTab(panel, btn){
  document.querySelectorAll(".stock-panel").forEach(p=>p.classList.remove("active"));
  document.querySelectorAll(".sktab").forEach(b=>b.classList.remove("active"));
  document.getElementById("stock"+panel.charAt(0).toUpperCase()+panel.slice(1)).classList.add("active");
  btn.classList.add("active");
  // تحديث placeholder بحث ديناميكي حسب التبويب
  const dynSearch = document.getElementById("stockDynSearch");
  if (dynSearch) {
    if (panel === "families") dynSearch.placeholder = "🔍 بحث في العائلات...";
    else if (panel === "brands") dynSearch.placeholder = "🔍 بحث في الماركات...";
    else dynSearch.placeholder = "🔍 بحث في المنتجات...";
    dynSearch.value = "";
  }
  if (panel==="all")      { populateStockSelects(); renderStock(); }
  if (panel==="brands")   { renderBrandList(); populateBrandFamilySelect(); }
  if (panel==="families") renderFamilyList();
}

/* ================================================
   STOCK DYNAMIC SEARCH
================================================ */
function stockDynFilter() {
  const q = (document.getElementById("stockDynSearch")?.value || "").toLowerCase().trim();
  // أي تبويب نشط؟
  if (document.getElementById("stockFamilies")?.classList.contains("active")) {
    renderFamilyListFiltered(q);
  } else if (document.getElementById("stockBrands")?.classList.contains("active")) {
    renderBrandListFiltered(q);
  } else {
    // tab all — تحديث بحث المنتجات
    const stockSearchEl = document.getElementById("stockSearch");
    if (stockSearchEl) { stockSearchEl.value = q; renderStock(); }
  }
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
  safeTextPrompt(t("edit_btn")+" — "+fam.name, fam.name, function(newName){
    if (!newName||newName.trim()===fam.name) return;
    if (DB.families.find(f=>f.name.toLowerCase()===newName.trim().toLowerCase()&&f.id!==id)){
      showToast(t("msg_family_exists"),"error"); return;
    }
    fam.name=newName.trim(); saveDB();
    renderFamilyList(); populateStockSelects(); populateBrandFamilySelect();
    showToast("✅ تم تعديل العائلة","success");
  });
}
function deleteFamily(id){
  safeConfirm(t("msg_confirm_delete_family"), function(){
    DB.families=DB.families.filter(f=>f.id!==id);
    DB.brands=DB.brands.filter(b=>b.familyId!==id);
    saveDB(); renderFamilyList(); renderBrandList(); populateStockSelects(); populateBrandFamilySelect();
    showToast("✅ تم حذف العائلة","success");
  });
}
function renderFamilyList(filter=""){
  const list=document.getElementById("familyList");
  list.innerHTML="";
  let families = DB.families;
  if (filter) families = families.filter(f=>f.name.toLowerCase().includes(filter));
  if (!families.length){
    list.innerHTML=`<li style="color:var(--text3);text-align:center;padding:20px">${filter?"لا نتائج للبحث":t("no_families")}</li>`; return;
  }
  families.forEach(fam=>{
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
function renderFamilyListFiltered(q){ renderFamilyList(q); }

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
  safeTextPrompt(t("edit_btn")+" — "+brand.name, brand.name, function(newName){
    if (!newName||newName.trim()===brand.name) return;
    brand.name=newName.trim(); saveDB(); renderBrandList(); populateStockSelects();
    showToast("✅ تم تعديل الماركة","success");
  });
}
function deleteBrand(id){
  safeConfirm(t("msg_confirm_delete_brand"), function(){
    DB.brands=DB.brands.filter(b=>b.id!==id);
    saveDB(); renderBrandList(); populateStockSelects();
    showToast("✅ تم حذف الماركة","success");
  });
}
function renderBrandList(filter=""){
  const list=document.getElementById("brandList");
  list.innerHTML="";
  let allBrands = DB.brands;
  if (filter) allBrands = allBrands.filter(b=>b.name.toLowerCase().includes(filter));
  if (!allBrands.length){
    list.innerHTML=`<li style="color:var(--text3);text-align:center;padding:20px">${filter?"لا نتائج للبحث":t("no_brands")}</li>`; return;
  }
  DB.families.forEach(fam=>{
    const famBrands=allBrands.filter(b=>b.familyId===fam.id);
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
  const orphans=allBrands.filter(b=>!DB.families.find(f=>f.id===b.familyId));
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
function renderBrandListFiltered(q){ renderBrandList(q); }

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
  // لا تحتاج إلى تحديث - الماركة الآن حقل نصي مباشر
}

document.addEventListener("DOMContentLoaded",()=>{
  // تم إزالة event listener غير المطلوب
});

/* ================================================
   STOCK MANAGEMENT
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
  const unitEl      = document.getElementById("unit");

  const type      = typeEl.value.trim();
  let   brand     = brandEl.value.trim();
  const size      = sizeEl.value.trim();
  let   barcode   = barcodeEl.value.trim();
  const priceStr  = priceEl.value;
  const costStr   = costEl.value;
  const qtyStr    = qtyEl.value;
  const exp       = expEl.value;
  const unit      = unitEl ? unitEl.value : "قطعة";

  if (!type)    { showToast("اختر العائلة أولاً","error"); typeEl.focus(); return; }
  if (!brand)   { showToast("أدخل اسم الماركة","error"); brandEl.focus(); return; }

  if (!barcode) {
    barcode = "AUTO-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2,5).toUpperCase();
    barcodeEl.value = barcode;
    showToast("⚠️ باركود تلقائي — لن يعمل مع القارئ. يُنصح بإدخال باركود حقيقي.", "warning");
  }

  const price     = priceStr !== "" ? parseFloat(priceStr) : 0;
  const costPrice = costStr  !== "" ? parseFloat(costStr)  : 0;
  const qty       = qtyStr   !== "" ? parseInt(qtyStr)     : 0;

  if (isNaN(price) || price < 0)     { showToast("أدخل سعر البيع صحيحاً","error"); priceEl.focus(); return; }
  if (isNaN(costPrice) || costPrice < 0) { showToast("أدخل سعر الشراء صحيحاً","error"); costEl.focus(); return; }
  if (isNaN(qty) || qty < 0)         { showToast("أدخل الكمية صحيحة","error"); qtyEl.focus(); return; }

  const existing = DB.stock.find(i => i.barcode === barcode);
  if (existing) {
    if (existing.type !== type || existing.brand !== brand) {
      safeConfirm(
        `⚠️ هذا الباركود مسجّل مسبقاً لـ:\n"${existing.type} ${existing.brand}"\n\nهل تريد تحديث كميته وسعره بدلاً من إضافة منتج جديد؟`,
        function() {
          existing.qty += qty;
          if (price > 0) existing.price = price;
          if (costPrice > 0) existing.costPrice = costPrice;
          typeEl.value=""; brandEl.value=""; sizeEl.value="";
          barcodeEl.value=""; priceEl.value=""; costEl.value="";
          qtyEl.value=""; expEl.value="";
          updateBrandSelectByFamily();
          saveDB(); renderStock();
          showToast(t("msg_item_updated"), "info");
        }
      );
      return;
    }
    existing.qty += qty;
    existing.price = price;
    existing.costPrice = costPrice;
    showToast(t("msg_item_updated"), "info");
  } else {
    DB.stock.push({ id: uid(), type, brand, size, barcode, price, costPrice, qty, exp, unit });
    showToast(t("msg_item_saved"), "success");
  }

  typeEl.value=""; brandEl.value=""; sizeEl.value="";
  barcodeEl.value=""; priceEl.value=""; costEl.value="";
  qtyEl.value=""; expEl.value="";
  updateBrandSelectByFamily();
  saveDB(); renderStock();
}


/* ================================================
   IMPORT/EXPORT CSV
================================================ */
/* ================================================
   EXPORT STOCK TO CSV — تصدير المخزون (Fix #14)
================================================ */
function exportStockCSV(){
  if(!DB.stock.length){showToast("المخزون فارغ","warning");return;}
  const header="عائلة,ماركة,حجم,باركود,سعر_بيع,سعر_شراء,كمية,وحدة,صلاحية";
  const rows=DB.stock.map(i=>[
    `"${i.type||""}"`,`"${i.brand||""}"`,`"${i.size||""}"`,
    `"${i.barcode||""}"`,i.price||0,i.costPrice||0,
    i.qty||0,`"${i.unit||"قطعة"}"`,`"${i.exp||""}"`
  ].join(","));
  const csv=[header,...rows].join("\n");
  const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=`مخزون_POSDZ_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  showToast("✅ تم تصدير المخزون ("+DB.stock.length+" منتج)","success");
}

/* ================================================
   PRINT CUSTOMER STATEMENT — كشف حساب الزبون (Fix #22)
================================================ */
function printCustomerStatement(customerName){
  const cust=DB.customers.find(c=>c.name===customerName)||{name:customerName,phone:""};
  const custDebts=(DB.debts||[]).filter(d=>d.customer===customerName);
  const total=custDebts.reduce((s,d)=>s+(d.total||0),0);
  const paid=custDebts.reduce((s,d)=>s+(d.paid||0),0);
  const remaining=custDebts.reduce((s,d)=>s+(d.remaining||0),0);
  const st=DB.settings;
  const rows=custDebts.map(d=>`
    <tr>
      <td>${formatDate(d.date)}</td>
      <td>${formatPrice(d.total)}</td>
      <td>${formatPrice(d.paid)}</td>
      <td style="color:${d.remaining>0?"#dc2626":"#10b981"}">${formatPrice(d.remaining)}</td>
    </tr>`).join("");
  const html=`<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8">
  <style>body{font-family:Arial,sans-serif;font-size:11pt;direction:rtl;margin:0;padding:12mm}
  h2{text-align:center;font-size:16pt;margin:0 0 4mm}
  .sub{text-align:center;font-size:10pt;color:#555;margin-bottom:6mm}
  table{width:100%;border-collapse:collapse}
  th,td{border:0.4mm solid #000;padding:3mm 4mm;font-size:10pt}
  th{background:#f0f0f0;font-weight:900}
  .total{font-size:12pt;font-weight:900;margin-top:6mm;text-align:left}
  @page{margin:8mm}@media print{body{padding:0}}</style></head><body>
  <h2>${st.name||"POS DZ"}</h2>
  <div class="sub">كشف حساب الزبون — ${customerName}${cust.phone?" | 📞 "+cust.phone:""}</div>
  <div class="sub">تاريخ الطباعة: ${formatDate(new Date().toISOString())}</div>
  <table><thead><tr><th>التاريخ</th><th>المبلغ الكلي</th><th>المدفوع</th><th>المتبقي</th></tr></thead>
  <tbody>${rows||'<tr><td colspan="4" style="text-align:center">لا يوجد ديون</td></tr>'}</tbody></table>
  <div class="total">إجمالي: ${formatPrice(total)} | مدفوع: ${formatPrice(paid)} | <span style="color:${remaining>0?"#dc2626":"#10b981"}">متبقي: ${formatPrice(remaining)}</span></div>
  </body></html>`;
  _printHtml(html);
}

function downloadCSVTemplate() {
  const header = "عائلة,ماركة,حجم,باركود,سعر_بيع,سعر_شراء,كمية,وحدة,صلاحية";
  const rows = [
    "حلويات,مرهبا,250g,6900000001234,350,200,100,علبة,2025-12-31",
    "تغليف,نايلون شفاف,رول 50cm,,1500,900,20,رول,",
    "بسكويت,كيف,,,120,60,200,قطعة,"
  ];
  const csv = [header,...rows].join("\n");
  const blob = new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
  a.download="نموذج_استيراد_المنتجات.csv"; a.click();
}

function parseCSVLine(line){
  // ✅ Fix #11: تحليل CSV صحيح يدعم الفاصلة داخل القيم (مثل "اسم, خاص")
  const result=[];
  let current="";
  let inQuotes=false;
  for(let i=0;i<line.length;i++){
    const ch=line[i];
    if(ch==='"'){
      inQuotes=!inQuotes;
    } else if(ch===','&&!inQuotes){
      result.push(current.trim());
      current="";
    } else {
      current+=ch;
    }
  }
  result.push(current.trim());
  return result;
}

function importProductsFromCSV(input) {
  const file=input.files[0]; if(!file) return;
  input.value="";
  const reader=new FileReader();
  reader.onload=function(e){
    const text=e.target.result.replace(/^\uFEFF/,"");
    const lines=text.split(/\r?\n/).filter(l=>l.trim());
    if(lines.length<2){showToast("الملف فارغ أو لا يحتوي على بيانات","error");return;}
    const dataLines=lines.slice(1);
    let added=0,updated=0,errors=0,autoBarcodes=0;
    dataLines.forEach((line,idx)=>{
      const cols=parseCSVLine(line); // ✅ Fix #11
      const [famName,brandName,size,barcode,priceStr,costStr,qtyStr,unit,exp]=cols;
      if(!famName||!brandName){errors++;return;}
      const price=parseFloat(priceStr)||0;
      const costPrice=parseFloat(costStr)||0;
      const qty=parseInt(qtyStr)||0;
      const bc=barcode||("AUTO-"+Date.now().toString(36).toUpperCase()+"-"+idx);
      if(!barcode) autoBarcodes++; // ✅ Fix #12: عدّ الباركودات التلقائية
      let fam=DB.families.find(f=>f.name===famName);
      if(!fam){fam={id:uid(),name:famName};DB.families.push(fam);}
      let brand=DB.brands.find(b=>b.name===brandName&&b.familyId===fam.id);
      if(!brand){brand={id:uid(),name:brandName,familyId:fam.id};DB.brands.push(brand);}
      const existing=barcode?DB.stock.find(i=>i.barcode===barcode):null;
      if(existing){
        existing.qty+=qty;
        if(price>0)existing.price=price;
        if(costPrice>0)existing.costPrice=costPrice;
        updated++;
      }else{
        DB.stock.push({id:uid(),type:famName,brand:brandName,size:size||"",barcode:bc,price,costPrice,qty,exp:exp||"",unit:unit||"قطعة"});
        added++;
      }
    });
    saveDB();
    renderStock();populateStockSelects();renderFamilyList();renderBrandList();
    let msg="✅ الاستيراد مكتمل: "+added+" مضاف، "+updated+" محدَّث"+(errors?" | "+errors+" أخطاء":"");
    if(autoBarcodes>0) msg+=" | ⚠️ "+autoBarcodes+" باركود تلقائي (لن يعمل مع السكانر)";
    showToast(msg,errors>0?"warning":"success");
  };
  reader.readAsText(file,"UTF-8");
}

function editItem(index){
  let overlay = document.getElementById("editItemOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "editItemOverlay";
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)";
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `
    <div style="background:var(--surface,#fff);border-radius:16px;padding:28px;max-width:420px;width:92%;box-shadow:0 20px 60px rgba(0,0,0,0.25);border:1px solid var(--border,#e2e5f0);max-height:90vh;overflow-y:auto">
      <h3 style="margin:0 0 6px;font-size:17px;font-weight:800;color:var(--text,#0f172a)">✏️ تعديل المنتج</h3>
      <div style="font-size:13px;color:var(--text3,#94a3b8);margin-bottom:20px">${item.type} ${item.brand}${item.size?" — "+item.size:""}</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
        <div>
          <label style="display:block;font-size:12px;font-weight:700;color:var(--text2,#475569);margin-bottom:5px">${t("price_label")}</label>
          <input id="eiPrice" type="number" min="0" step="0.01" value="${item.price}"
            style="width:100%;padding:10px 12px;border-radius:8px;border:1.5px solid var(--border,#e2e5f0);font-size:14px;box-sizing:border-box">
        </div>
        <div>
          <label style="display:block;font-size:12px;font-weight:700;color:var(--text2,#475569);margin-bottom:5px">${t("cost_label")}</label>
          <input id="eiCost" type="number" min="0" step="0.01" value="${item.costPrice||0}"
            style="width:100%;padding:10px 12px;border-radius:8px;border:1.5px solid var(--border,#e2e5f0);font-size:14px;box-sizing:border-box">
        </div>
        <div>
          <label style="display:block;font-size:12px;font-weight:700;color:var(--text2,#475569);margin-bottom:5px">${t("qty_label")} (إضافة للمخزون)</label>
          <input id="eiQtyAdd" type="number" min="0" value="0" placeholder="0"
            style="width:100%;padding:10px 12px;border-radius:8px;border:1.5px solid var(--border,#e2e5f0);font-size:14px;box-sizing:border-box">
        </div>
        <div>
          <label style="display:block;font-size:12px;font-weight:700;color:var(--text2,#475569);margin-bottom:5px">الكمية الحالية</label>
          <input id="eiQtyCurrent" type="number" min="0" value="${item.qty}"
            style="width:100%;padding:10px 12px;border-radius:8px;border:1.5px solid var(--border,#e2e5f0);font-size:14px;box-sizing:border-box">
        </div>
        <div>
          <label style="display:block;font-size:12px;font-weight:700;color:var(--text2,#475569);margin-bottom:5px">${t("size_label")}</label>
          <input id="eiSize" type="text" value="${item.size||""}"
            style="width:100%;padding:10px 12px;border-radius:8px;border:1.5px solid var(--border,#e2e5f0);font-size:14px;box-sizing:border-box">
        </div>
        <div>
          <label style="display:block;font-size:12px;font-weight:700;color:var(--text2,#475569);margin-bottom:5px">الوحدة</label>
          <select id="eiUnit"
            style="width:100%;padding:10px 12px;border-radius:8px;border:1.5px solid var(--border,#e2e5f0);font-size:14px;box-sizing:border-box">
            <option value="قطعة" ${(item.unit||'قطعة')==='قطعة'?'selected':''}>قطعة</option>
            <option value="كيلو" ${item.unit==='كيلو'?'selected':''}>كيلو</option>
            <option value="غرام" ${item.unit==='غرام'?'selected':''}>غرام</option>
            <option value="لتر" ${item.unit==='لتر'?'selected':''}>لتر</option>
            <option value="رول" ${item.unit==='رول'?'selected':''}>رول</option>
            <option value="علبة" ${item.unit==='علبة'?'selected':''}>علبة</option>
            <option value="كرتون" ${item.unit==='كرتون'?'selected':''}>كرتون</option>
            <option value="متر" ${item.unit==='متر'?'selected':''}>متر</option>
            <option value="عبوة" ${item.unit==='عبوة'?'selected':''}>عبوة</option>
          </select>
        </div>
        <div>
          <label style="display:block;font-size:12px;font-weight:700;color:var(--text2,#475569);margin-bottom:5px">${t("barcode_label")} ✏️</label>
          <input id="eiBarcode" type="text" value="${item.barcode||""}"
            style="width:100%;padding:10px 12px;border-radius:8px;border:1.5px solid #f59e0b;font-size:13px;box-sizing:border-box;font-family:'IBM Plex Mono',monospace">
        </div>
        <div>
          <label style="display:block;font-size:12px;font-weight:700;color:var(--text2,#475569);margin-bottom:5px">${t("exp_label")}</label>
          <input id="eiExp" type="date" value="${item.exp||""}"
            style="width:100%;padding:10px 12px;border-radius:8px;border:1.5px solid var(--border,#e2e5f0);font-size:14px;box-sizing:border-box">
        </div>
      </div>

      <div style="background:var(--bg2,#e8eaf2);border-radius:8px;padding:10px 14px;font-size:13px;color:var(--text2,#475569);margin-bottom:18px">
        💡 "إضافة للمخزون" تُضاف للكمية الحالية | "الكمية الحالية" لتعديلها مباشرة
      </div>

      <div style="display:flex;gap:10px">
        <button id="eiCancel" style="flex:1;padding:11px;background:var(--bg2,#e8eaf2);color:var(--text,#0f172a);border-radius:10px;font-weight:700;font-size:14px;border:none;cursor:pointer">إلغاء</button>
        <button id="eiSave"   style="flex:1;padding:11px;background:linear-gradient(135deg,#10b981,#059669);color:white;border-radius:10px;font-weight:700;font-size:14px;border:none;cursor:pointer">💾 حفظ التعديلات</button>
      </div>
    </div>`;
  overlay.style.display = "flex";
  const close = () => { overlay.style.display = "none"; };
  document.getElementById("eiCancel").onclick = close;
  overlay.onclick = (e) => { if(e.target===overlay) close(); };

  document.getElementById("eiSave").onclick = () => {
    const newPrice      = parseFloat(document.getElementById("eiPrice").value);
    const newCost       = parseFloat(document.getElementById("eiCost").value);
    const qtyAdd        = parseInt(document.getElementById("eiQtyAdd").value) || 0;
    const qtyCurrent    = parseInt(document.getElementById("eiQtyCurrent").value);
    const newSize       = document.getElementById("eiSize").value.trim();
    const newExp        = document.getElementById("eiExp").value;
    const newBarcode    = document.getElementById("eiBarcode").value.trim();
    const newUnit       = document.getElementById("eiUnit").value;

    if (isNaN(newPrice)||newPrice<0){ showToast("أدخل سعر البيع صحيحاً","error"); return; }
    if (isNaN(qtyCurrent)||qtyCurrent<0){ showToast("أدخل الكمية الحالية صحيحة","error"); return; }

    // ✅ التحقق من عدم تكرار الباركود الجديد مع منتج آخر
    if (newBarcode && newBarcode !== item.barcode) {
      const conflict = DB.stock.find(i => i.barcode === newBarcode && i !== item);
      if (conflict) {
        showToast(`⚠️ الباركود "${newBarcode}" موجود مسبقاً لـ: ${conflict.type} ${conflict.brand}`, "error");
        return;
      }
    }

    item.price     = newPrice;
    item.costPrice = isNaN(newCost) ? 0 : newCost;
    item.qty       = qtyCurrent + qtyAdd;
    item.size      = newSize;
    item.exp       = newExp;
    item.unit      = newUnit;
    if (newBarcode) item.barcode = newBarcode;

    saveDB(); renderStock();
    showToast("✅ تم تحديث المنتج بنجاح","success");
    close();
  };
}
function deleteItem(index){
  safeConfirm(t("msg_confirm_delete"), function(){
    DB.stock.splice(index,1); saveDB(); renderStock();
    showToast("✅ تم حذف المنتج","success");
  });
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
      // ✅ مؤشر واضح للمخزون المنخفض والنافد
      const qtyColor = item.qty<=0 ? "#ef4444" : item.qty<5 ? "#f59e0b" : "#10b981";
      const qtyBadge = item.qty<=0
        ? `<span style="background:#fef2f2;color:#ef4444;font-size:11px;padding:1px 6px;border-radius:20px;font-weight:700;border:1px solid #fecaca">نفذ ⚠️</span>`
        : item.qty<5
        ? `<span style="background:#fffbeb;color:#d97706;font-size:11px;padding:1px 6px;border-radius:20px;font-weight:700;border:1px solid #fde68a">منخفض</span>`
        : "";
      const li=document.createElement("li");
      li.style.cssText="padding:8px 12px;border-bottom:1px solid var(--border)";
      li.innerHTML=`
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
          <div>
            ${item.size?`<span style="color:var(--text3)">${item.size}</span> | `:""}
            باركود: <code style="background:var(--bg2);padding:2px 6px;border-radius:4px">${item.barcode}</code>
            | ${t("price_label")}: <strong>${formatPrice(item.price)}</strong>
            | ${t("qty_label")}: <strong style="color:${qtyColor}">${item.qty}</strong> ${qtyBadge}
            ${expired?`<span style="color:#ef4444;font-size:12px"> ⚠ منتهي الصلاحية</span>`:""}
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
            <button onclick="printProductBarcode(${realIndex})" class="btn-print-barcode" title="طباعة باركود المنتج مع اسم المحل">🏷️ طباعة باركود</button>
            <button onclick="editItem(${realIndex})" style="padding:5px 10px;font-size:13px;background:#3b82f6">${t("edit_btn")}</button>
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
    const o=document.createElement("option"); o.value=c.name; o.textContent=c.name; // الاسم فقط في واجهة البيع
    custSelect.appendChild(o);
  });
}
/* ================================================
   SUPPLIERS — الموردون (النقيصة #13)
================================================ */
function switchSupTab(tab, btn) {
  document.querySelectorAll("#suppliers .cust-panel").forEach(p=>p.classList.remove("active"));
  document.querySelectorAll("#suppliers .ctab").forEach(b=>b.classList.remove("active"));
  document.getElementById(tab==="list"?"supTabList":"supTabOrders").classList.add("active");
  btn.classList.add("active");
  if (tab==="orders") { renderOrderList(); populateOrderSupplierSelect(); }
  else renderSupplierList();
}

function addSupplier(){
  const name    = document.getElementById("supName").value.trim();
  const phone   = document.getElementById("supPhone").value.trim();
  const products= document.getElementById("supProducts").value.trim();
  const notes   = document.getElementById("supNotes").value.trim();
  if(!name){showToast("أدخل اسم المورد","error");return;}
  if(!DB.suppliers) DB.suppliers=[];
  if(DB.suppliers.find(s=>s.name===name)){showToast("المورد موجود مسبقاً","error");return;}
  DB.suppliers.push({id:uid(),name,phone,products,notes,createdAt:new Date().toISOString()});
  document.getElementById("supName").value="";
  document.getElementById("supPhone").value="";
  document.getElementById("supProducts").value="";
  document.getElementById("supNotes").value="";
  saveDB(); renderSupplierList(); populateOrderSupplierSelect();
  showToast("✅ تمت إضافة المورد","success");
}

function deleteSupplier(id){
  safeConfirm("حذف هذا المورد؟", function(){
    DB.suppliers=(DB.suppliers||[]).filter(s=>s.id!==id);
    saveDB(); renderSupplierList(); populateOrderSupplierSelect();
    showToast("✅ تم حذف المورد","success");
  });
}

function renderSupplierList(){
  const list=document.getElementById("supList"); if(!list) return;
  list.innerHTML="";
  if(!DB.suppliers||!DB.suppliers.length){
    list.innerHTML='<li style="color:var(--text3);text-align:center;padding:20px">لا يوجد موردون بعد</li>'; return;
  }
  DB.suppliers.forEach(s=>{
    const totalOrders=(DB.orders||[]).filter(o=>o.supplierId===s.id);
    const totalSpent=totalOrders.reduce((t,o)=>t+(o.total||0),0);
    const totalDebt =totalOrders.reduce((t,o)=>t+Math.max(0,(o.total||0)-(o.paid||0)),0);
    const li=document.createElement("li");
    li.style.cssText="padding:10px 12px;border-bottom:1px solid var(--border)";
    li.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:6px">
        <div>
          <strong style="font-size:15px">🚚 ${s.name}</strong>
          ${s.phone?` <span style="font-size:12px;color:var(--text3)">📞 ${s.phone}</span>`:""}
          ${s.products?`<div style="font-size:12px;color:var(--text2);margin-top:2px">📦 ${s.products}</div>`:""}
          <div style="font-size:12px;color:var(--text3);margin-top:2px">
            مجموع المشتريات: <strong>${formatPrice(totalSpent)}</strong>
            ${totalDebt>0?`<span style="color:#ef4444"> | دين: ${formatPrice(totalDebt)}</span>`:""}
          </div>
        </div>
        <button onclick="deleteSupplier('${s.id}')" style="background:#ef4444;padding:5px 10px;font-size:13px">مسح</button>
      </div>`;
    list.appendChild(li);
  });
}

function populateOrderSupplierSelect(){
  const sel=document.getElementById("orderSupplier"); if(!sel) return;
  sel.innerHTML='<option value="">— اختر المورد —</option>';
  (DB.suppliers||[]).forEach(s=>{
    const o=document.createElement("option"); o.value=s.id; o.textContent=s.name; sel.appendChild(o);
  });
}

function addOrder(){
  const supplierId = document.getElementById("orderSupplier").value;
  const dateVal    = document.getElementById("orderDate").value || new Date().toISOString().slice(0,10);
  const total      = parseFloat(document.getElementById("orderTotal").value)||0;
  const paid       = parseFloat(document.getElementById("orderPaid").value)||0;
  const details    = document.getElementById("orderDetails").value.trim();
  if(!supplierId){showToast("اختر المورد أولاً","error");return;}
  if(!total){showToast("أدخل المبلغ الإجمالي","error");return;}
  if(!DB.orders) DB.orders=[];
  DB.orders.push({id:uid(),supplierId,date:new Date(dateVal).toISOString(),total,paid,details,remaining:Math.max(0,total-paid)});
  document.getElementById("orderTotal").value="";
  document.getElementById("orderPaid").value="";
  document.getElementById("orderDetails").value="";
  saveDB(); renderOrderList();
  showToast("✅ تم تسجيل عملية الشراء","success");
}

function renderOrderList(){
  const list=document.getElementById("orderList"); if(!list) return;
  list.innerHTML="";
  if(!DB.orders||!DB.orders.length){
    list.innerHTML='<li style="color:var(--text3);text-align:center;padding:20px">لا يوجد مشتريات مسجّلة بعد</li>'; return;
  }
  const sorted=[...DB.orders].sort((a,b)=>new Date(b.date)-new Date(a.date));
  sorted.forEach(o=>{
    const sup=(DB.suppliers||[]).find(s=>s.id===o.supplierId);
    const remaining=Math.max(0,(o.total||0)-(o.paid||0));
    const li=document.createElement("li");
    li.style.cssText="padding:10px 12px;border-bottom:1px solid var(--border)";
    li.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:6px">
        <div>
          <strong>🚚 ${sup?sup.name:"مورد غير معروف"}</strong>
          <span style="font-size:12px;color:var(--text3);margin-right:8px">${formatDate(o.date)}</span>
          ${o.details?`<div style="font-size:12px;color:var(--text2);margin-top:2px">📦 ${o.details}</div>`:""}
          <div style="font-size:13px;margin-top:4px">
            إجمالي: <strong>${formatPrice(o.total)}</strong>
            | مدفوع: <strong style="color:#10b981">${formatPrice(o.paid)}</strong>
            ${remaining>0?`<span style="color:#ef4444"> | متبقي: ${formatPrice(remaining)}</span>`:`<span style="color:#10b981"> ✅ مسدَّد</span>`}
          </div>
        </div>
      </div>`;
    list.appendChild(li);
  });
}


function addCustomer(){
  const name=document.getElementById("cname").value.trim();
  const phone=(document.getElementById("cphone")?.value||"").trim();
  if (!name){ showToast(t("msg_enter_customer"),"error"); return; }
  if (DB.customers.find(c=>c.name===name)){ showToast(t("msg_customer_exists"),"error"); return; }
  // ✅ إصلاح Bug #4: إضافة ID فريد لكل زبون لتجنب الحذف بالفهرس
  DB.customers.push({id: uid(), name, phone, debts:[]});
  document.getElementById("cname").value="";
  if(document.getElementById("cphone")) document.getElementById("cphone").value="";
  saveDB(); renderCustomerList(); renderCustomerSelect();
  showToast("✅ تمت إضافة الزبون","success");
}
function renderCustomerList(){
  const clist=document.getElementById("clist");
  clist.innerHTML="";
  const q=(document.getElementById("customerSearch")?.value||"").toLowerCase().trim();
  let customers = DB.customers;
  if (q) customers = customers.filter(c=>c.name.toLowerCase().includes(q));
  if (!customers.length){
    clist.innerHTML=`<li style="color:var(--text3);text-align:center;padding:20px">${q?"لا نتائج للبحث":t("no_customers")}</li>`; return;
  }
  customers.forEach((c)=>{
    const totalDebt=(c.debts||[]).reduce((s,d)=>s+(d.remaining||0),0);
    // ✅ Fix #20: آخر تاريخ شراء للزبون
    const custSales=(DB.sales||[]).filter(s=>s.customer===c.name);
    const lastSale=custSales.length?custSales[custSales.length-1].date:null;
    // ✅ Fix #21: حد الائتمان
    const creditLimit=c.creditLimit||0;
    const overLimit=creditLimit>0&&totalDebt>creditLimit;
    const li=document.createElement("li");
    li.style.cssText="padding:10px 8px;border-bottom:1px solid var(--border)";
    const custId = c.id || c.name;
    li.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
        <div>
          <strong>${c.name}</strong>
          ${c.phone?` <span style="color:var(--text3);font-size:12px">📞 ${c.phone}</span>`:""}
          ${totalDebt>0?` <span style="color:#ef4444;font-size:13px;font-weight:700">(${formatPrice(totalDebt)})</span>`:""}
          ${overLimit?` <span style="background:#fef2f2;color:#dc2626;font-size:11px;padding:1px 6px;border-radius:10px;border:1px solid #fecaca">⚠️ تجاوز الحد</span>`:""}
          ${lastSale?`<div style="font-size:11px;color:var(--text3)">آخر شراء: ${formatDate(lastSale)}</div>`:""}
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button onclick="printCustomerStatement('${c.name.replace(/'/g,"\\'")}\")" style="background:#3b82f6;padding:5px 10px;font-size:12px">🖨️ كشف</button>
          <button onclick="deleteCustomer('${custId}')" style="background:#ef4444;padding:5px 10px;font-size:13px">${t("del_btn")}</button>
        </div>
      </div>`;
    clist.appendChild(li);
  });
}
function deleteCustomer(custId){
  safeConfirm(t("msg_confirm_delete_customer"), function(){
    const cust = DB.customers.find(c => (c.id && c.id === custId) || c.name === custId);
    // ✅ Fix #18: تنظيف الديون اليتيمة عند حذف الزبون
    if(cust){
      const hasDebt = (DB.debts||[]).some(d=>d.customer===cust.name&&(d.remaining||0)>0);
      if(hasDebt){
        // تنظيف ديون الزبون المحذوف من DB.debts
        DB.debts = (DB.debts||[]).filter(d=>d.customer!==cust.name);
      }
    }
    const idx = DB.customers.findIndex(c => (c.id && c.id === custId) || c.name === custId);
    if (idx !== -1) DB.customers.splice(idx,1);
    saveDB(); renderCustomerList(); renderCustomerSelect(); renderDebts();
    showToast("✅ تم حذف الزبون وديونه","success");
  });
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
  const logged = JSON.parse(localStorage.getItem("POSDZ_LOGGED"));
  const isManager = logged && logged.role === "manager";
  const canChangeRole = isManager && index !== DB.users.findIndex(u=>u.name===logged.name);

  // مودال تعديل مخصص
  let overlay = document.getElementById("editUserOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "editUserOverlay";
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)";
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `
    <div style="background:var(--surface,#fff);border-radius:16px;padding:28px;max-width:380px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.25);border:1px solid var(--border,#e2e5f0)">
      <h3 style="margin:0 0 20px;font-size:17px;font-weight:800;color:var(--text,#0f172a)">✏️ تعديل المستخدم</h3>
      <label style="display:block;font-size:12px;font-weight:700;color:var(--text2,#475569);margin-bottom:5px">اسم المستخدم</label>
      <input id="euName" value="${user.name}" style="width:100%;padding:10px 12px;border-radius:8px;border:1.5px solid var(--border,#e2e5f0);font-size:14px;margin-bottom:12px;box-sizing:border-box">
      <label style="display:block;font-size:12px;font-weight:700;color:var(--text2,#475569);margin-bottom:5px">PIN جديد (4 أرقام — اتركه فارغاً للإبقاء على الحالي)</label>
      <input id="euPin" type="password" placeholder="****" maxlength="4" style="width:100%;padding:10px 12px;border-radius:8px;border:1.5px solid var(--border,#e2e5f0);font-size:14px;margin-bottom:12px;box-sizing:border-box">
      ${canChangeRole ? `
      <label style="display:block;font-size:12px;font-weight:700;color:var(--text2,#475569);margin-bottom:5px">الدور</label>
      <select id="euRole" style="width:100%;padding:10px 12px;border-radius:8px;border:1.5px solid var(--border,#e2e5f0);font-size:14px;margin-bottom:16px;box-sizing:border-box">
        <option value="baker" ${user.role==="baker"?"selected":""}>بائع</option>
        <option value="manager" ${user.role==="manager"?"selected":""}>مدير</option>
      </select>` : `<div style="margin-bottom:16px"></div>`}
      <div style="display:flex;gap:10px">
        <button id="euCancel" style="flex:1;padding:11px;background:var(--bg2,#e8eaf2);color:var(--text,#0f172a);border-radius:10px;font-weight:700;font-size:14px;border:none;cursor:pointer">إلغاء</button>
        <button id="euSave"   style="flex:1;padding:11px;background:linear-gradient(135deg,#6366f1,#a855f7);color:white;border-radius:10px;font-weight:700;font-size:14px;border:none;cursor:pointer">💾 حفظ</button>
      </div>
    </div>`;
  overlay.style.display = "flex";
  const close = () => { overlay.style.display = "none"; };
  document.getElementById("euCancel").onclick = close;
  overlay.onclick = (e) => { if(e.target===overlay) close(); };
  document.getElementById("euSave").onclick = () => {
    const newName = document.getElementById("euName").value.trim() || user.name;
    const newPin  = document.getElementById("euPin").value.trim();
    const newRole = canChangeRole ? document.getElementById("euRole").value : user.role;
    if (newName !== user.name && DB.users.find((u,i)=>u.name===newName&&i!==index)){
      showToast(t("msg_user_exists"),"error"); return;
    }
    if (newPin && (newPin.length!==4||!/^\d+$/.test(newPin))){
      showToast(t("msg_pin_4"),"error"); return;
    }
    // ✅ إصلاح Bug #10: حفظ الاسم القديم قبل التعديل لمقارنته مع الجلسة
    const oldName = user.name;
    user.name = newName;
    if (newPin) user.pin = newPin;
    user.role = newRole;
    if (logged && logged.name === oldName) localStorage.setItem("POSDZ_LOGGED", JSON.stringify(user));
    saveDB(); renderUsersTable(); renderUserSelect(); renderAlerts();
    showToast("✅ تم تعديل المستخدم بنجاح","success");
    close();
  };
}
function deleteUser(index){
  const user = DB.users[index];
  if (!user) return;
  if (user.immutable){ showToast(t("msg_cant_delete"),"error"); return; }
  safeConfirm(t("msg_confirm_delete_user"), function(){
    DB.users.splice(index,1);
    /* ضمان بقاء Admin بعد أي حذف */
    if (!DB.users.some(u=>u.immutable)) DB.users.unshift({ ...DEFAULT_ADMIN });
    saveDB(); renderUsersTable(); renderUserSelect(); renderAlerts();
    showToast("✅ تم حذف المستخدم","success");
  });
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
    // ✅ Fix #9: تحذير المنتج منتهي الصلاحية في السلة
    const stockItem=DB.stock.find(s=>s.barcode===cItem.barcode);
    const isExpired=stockItem&&stockItem.exp&&new Date(stockItem.exp)<new Date();
    const expWarn=isExpired?`<span title="منتهي الصلاحية!" style="color:#ef4444;cursor:help"> ⚠️</span>`:"";
    tr.innerHTML=`
      <td><input class="cart-editable" value="${cItem.name.replace(/"/g,'&quot;')}" style="width:130px" onchange="updateCartName(${index},this.value)" title="انقر للتعديل">${expWarn}</td>
      <td>
        <div style="display:flex;align-items:center;justify-content:center;gap:6px">
          <button onclick="decreaseQty(${index})" style="padding:4px 10px;background:var(--bg2);color:var(--text);border-radius:6px;font-size:16px;font-weight:900;min-width:30px">−</button>
          <input type="number" min="1" value="${cItem.qty}"
            style="font-size:15px;font-weight:800;width:48px;text-align:center;border:1.5px solid var(--border);border-radius:6px;padding:3px;background:var(--surface)"
            onchange="setCartQty(${index},this.value)" onclick="this.select()">
          <button onclick="increaseQty(${index})" style="padding:4px 10px;background:var(--bg2);color:var(--text);border-radius:6px;font-size:16px;font-weight:900;min-width:30px">+</button>
        </div>
      </td>
      <td><input class="cart-editable" value="${cItem.price}" type="number" min="0" step="0.01" style="width:90px;color:var(--primary);font-weight:800" onchange="updateCartPrice(${index},this.value)" title="انقر لتغيير السعر"></td>
      <td style="font-weight:800;color:#10b981;font-family:'IBM Plex Mono',monospace">${formatPrice(cItem.price*cItem.qty)}</td>
      <td><button onclick="removeFromCart(${index})" style="background:#fef2f2;color:#ef4444;border:1px solid #fecaca;padding:5px 10px;font-size:13px;border-radius:6px">${t("del_btn")}</button></td>`;
    cartTableBody.appendChild(tr);
  });
  updateTotal();
  // ✅ Fix #6: عرض زر تفريغ السلة إذا فيها منتجات
  const clearBtn=document.getElementById("clearCartBtn");
  if(clearBtn) clearBtn.style.display=DB.cart.length>0?"inline-flex":"none";
}
function updateCartName(index,val){ if(val&&val.trim()) DB.cart[index].name=val.trim(); saveDB(); renderSaleStock(); }
function clearCart(){
  if(!DB.cart.length) return;
  safeConfirm("🗑️ تفريغ السلة كاملاً؟", function(){
    DB.cart=[];
    const dvEl=document.getElementById("discountVal"); if(dvEl) dvEl.value="0";
    saveDB(); renderSaleStock();
    showToast("✅ تم تفريغ السلة","success");
  });
}
function updateCartPrice(index,val){
  const p=parseFloat(val);
  if(isNaN(p)||p<0){ showToast("⚠️ السعر لا يمكن أن يكون سالباً","warning"); renderSaleStock(); return; }
  // ✅ Fix #5: تحذير إذا السعر صفر
  if(p===0) showToast("⚠️ تنبيه: سعر المنتج = صفر","warning");
  DB.cart[index].price=p; saveDB(); renderSaleStock();
}
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
  const val=document.getElementById("search").value.trim();
  if(!val){ showToast(t("msg_enter_search"),"error"); return; }
  const valLow = val.toLowerCase();
  // ✅ النقيصة #11: استخدام الكمية المحددة في حقل البحث
  const addQty = Math.max(1, parseInt(document.getElementById("searchQty")?.value) || 1);

  // ✅ إصلاح Bug #8: الأولوية للمطابقة الكاملة للباركود أولاً، ثم البحث النصي
  let item = DB.stock.find(i => i.barcode === val);
  if (!item) {
    item = DB.stock.find(i =>
      i.type.toLowerCase().includes(valLow) ||
      i.brand.toLowerCase().includes(valLow) ||
      (i.size && i.size.toLowerCase().includes(valLow))
    );
  }

  if(!item){ showToast(t("msg_not_found"),"error"); return; }
  if(item.qty<=0){ showToast(t("msg_out_of_stock"),"error"); return; }
  const cartItem=DB.cart.find(c=>c.barcode===item.barcode);
  if(cartItem){
    if(cartItem.qty + addQty > item.qty){ showToast(t("msg_not_enough"),"error"); return; }
    cartItem.qty += addQty;
  } else {
    if(addQty > item.qty){ showToast(t("msg_not_enough"),"error"); return; }
    DB.cart.push({name:`${item.type} ${item.brand}${item.size?" — "+item.size:""}`,barcode:item.barcode,price:item.price,costPrice:item.costPrice,qty:addQty,unit:item.unit||"قطعة"});
  }
  document.getElementById("search").value="";
  const sqEl = document.getElementById("searchQty"); if(sqEl) sqEl.value="1";
  document.getElementById("searchSuggestions")?.classList.add("hidden");
  triggerSound('add');
  saveDB(); renderSaleStock();
}
function setCartQty(index, val) {
  const qty = parseInt(val);
  if (isNaN(qty) || qty < 1) { renderSaleStock(); return; }
  const c = DB.cart[index];
  const s = DB.stock.find(s => s.barcode === c.barcode);
  if (s && qty > s.qty) {
    showToast(t("msg_not_enough"),"error");
    renderSaleStock(); return;
  }
  c.qty = qty;
  saveDB(); renderSaleStock();
}
function removeFromCart(index){ DB.cart.splice(index,1); saveDB(); renderSaleStock(); }
function getDiscountAmount(subtotal) {
  const val  = parseFloat(document.getElementById("discountVal")?.value) || 0;
  const type = document.getElementById("discountType")?.value || "fixed";
  if (val <= 0) return 0;
  if (type === "percent") return Math.min(subtotal, subtotal * val / 100);
  return Math.min(subtotal, val);
}
function updateTotal(){
  const subtotal = DB.cart.reduce((s,i)=>s+i.price*i.qty,0);
  const discount = getDiscountAmount(subtotal);
  const final    = Math.max(0, subtotal - discount);
  totalEl.textContent = formatPrice(subtotal);
  const after = document.getElementById("afterDiscount");
  if (after) {
    if (discount > 0) { after.textContent = "→ " + formatPrice(final); }
    else { after.textContent = ""; }
  }
}

/* ================================================
   PAYMENT
================================================ */
function getCartTotal(){
  const subtotal = DB.cart.reduce((s,i)=>s+i.price*i.qty,0);
  return Math.max(0, subtotal - getDiscountAmount(subtotal));
}
function deductStock(){
  DB.cart.forEach(cItem=>{
    const s=DB.stock.find(s=>s.barcode===cItem.barcode);
    if(s){
      s.qty = Math.max(0, s.qty - cItem.qty);
    } else {
      // ✅ Fix #2: تحذير صامت في console إذا المنتج غير موجود في المخزون
      console.warn("POSDZ: منتج في السلة غير موجود في المخزون:", cItem.name, cItem.barcode);
    }
  });
}
function buildSale(type,paid){
  const invoiceNum=DB.settings.invoiceNum||1;
  DB.settings.invoiceNum=invoiceNum+1; // ✅ النقيصة #10: رقم الفاتورة يتزايد تلقائياً
  const logged = JSON.parse(localStorage.getItem("POSDZ_LOGGED"));
  const userName = logged ? logged.name : "—";
  const subtotal = DB.cart.reduce((s,i)=>s+i.price*i.qty,0);
  const discount = getDiscountAmount(subtotal);
  const total    = Math.max(0, subtotal - discount);
  return {
    invoiceNum, date: new Date().toISOString(),
    customer: custSelect.value||"—", userName,
    type, paid: paid||0, total, subtotal, discount,
    items: DB.cart.map(i=>({name:i.name,barcode:i.barcode,price:i.price,cost:i.costPrice||0,qty:i.qty,unit:i.unit||"قطعة"}))
  };
}
function pay(){
  if(!DB.cart.length){ showToast(t("msg_no_cart"),"error"); return; }
  const paidVal=parseFloat(document.getElementById("paid").value);
  const total=getCartTotal();
  if(!isNaN(paidVal)&&paidVal<total){ showToast(t("msg_low_balance"),"error"); return; }
  const change=!isNaN(paidVal)?paidVal-total:0;
  deductStock();
  const saleData=buildSale("كامل",paidVal||total);
  DB.sales.push(saleData);
  DB.cart=[]; document.getElementById("paid").value="";
  // ✅ النقيصة #8: إعادة تصفير الخصم بعد كل بيع
  const dvEl = document.getElementById("discountVal");
  if (dvEl) dvEl.value = "0";
  saveDB();
  triggerSound('pay');
  showToast(change>0?t("msg_change")+formatPrice(change):t("msg_sold"),"success");
  renderSaleStock(); renderReports();
  showPrintModal(saleData, change); // ✅ النقيصة #9: الفاتورة تظهر تلقائياً بعد كل بيع
}

/* ================================================
   PRINT MODAL
================================================ */
function showPrintModal(saleData, change) {
  const s = DB.settings;
  const itemsHTML = (saleData.items || []).map(item =>
    `<div class="pm-inv-item"><span class="pm-inv-name">${item.name}</span><span class="pm-inv-qty">x${item.qty}</span><span class="pm-inv-price">${formatPrice(item.price * item.qty)}</span></div>`
  ).join("");
  const logoHTML  = s.printLogo && s.logo ? `<img src="${s.logo}" class="pm-inv-logo" alt="logo">` : "";
  const nameHTML  = s.printShopName ? `<div class="pm-inv-shop">${s.name||"POS DZ"}</div>` : "";
  const phoneHTML = s.printPhone && s.phone ? `<div class="pm-inv-phone">  ${s.phone}</div>` : "";
  const welcomeHTML = s.printWelcome && s.welcome ? `<div class="pm-inv-welcome">${s.welcome}</div>` : "";
  const changeHTML = change > 0 ? `<div class="pm-inv-change">الباقي: <strong>${formatPrice(change)}</strong></div>` : "";
  const customerHTML = saleData.customer && saleData.customer !== "—"
    ? `<div class="pm-inv-row"><span>الزبون:</span><span>${saleData.customer}</span></div>` : "";

  const discountHTML = saleData.discount > 0
    ? `<div class="pm-inv-paid"><span>خصم:</span><span style="color:#10b981">− ${formatPrice(saleData.discount)}</span></div>` : "";

  const invoiceBodyHTML = `
    <div class="pm-inv-paper" id="pmPrintArea">
      <div class="pm-inv-header">${logoHTML}${nameHTML}${phoneHTML}</div>
      <div class="pm-inv-divider"></div>
      <div class="pm-inv-row"><span>التاريخ:</span><span>${formatDate(saleData.date)}</span></div>
      <div class="pm-inv-row"><span>رقم الفاتورة:</span><span>#${saleData.invoiceNum}</span></div>
      ${customerHTML}
      <div class="pm-inv-divider"></div>
      <div class="pm-inv-items-head"><span>السلعة</span><span>ك</span><span>المبلغ</span></div>
      ${itemsHTML}
      <div class="pm-inv-divider"></div>
      ${saleData.discount>0?`<div class="pm-inv-paid"><span>مجموع فرعي:</span><span>${formatPrice(saleData.subtotal||saleData.total)}</span></div>`:""}
      ${discountHTML}
      <div class="pm-inv-total"><span>الإجمالي:</span><span>${formatPrice(saleData.total)}</span></div>
      <div class="pm-inv-paid"><span>المدفوع:</span><span>${formatPrice(saleData.paid)}</span></div>
      ${changeHTML}${welcomeHTML}
    </div>`;

  let overlay = document.getElementById("printModalOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "printModalOverlay";
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:99998;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)";
    overlay.innerHTML = `
      <div style="background:var(--surface,#fff);border-radius:20px;padding:24px;max-width:420px;width:94%;max-height:90vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,0.3)">
        <div style="text-align:center;margin-bottom:16px">
          <div style="font-size:20px;font-weight:800;color:var(--primary,#6366f1)"> فاتورة البيع</div>
          <div style="font-size:13px;color:var(--text3,#94a3b8);margin-top:4px">تم تسجيل البيع بنجاح</div>
        </div>
        <div id="pmInvoiceBody"></div>
        <div style="display:flex;gap:10px;margin-top:20px">
          <button id="pmBtnPrint" style="flex:1;padding:13px;background:linear-gradient(135deg,#6366f1,#a855f7);color:white;border-radius:12px;font-weight:800;font-size:15px;border:none;cursor:pointer"> طباعة</button>
          <button id="pmBtnClose" style="flex:1;padding:13px;background:var(--bg2,#e8eaf2);color:var(--text,#0f172a);border-radius:12px;font-weight:800;font-size:15px;border:none;cursor:pointer">X اغلاق</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  }

  document.getElementById("pmInvoiceBody").innerHTML = invoiceBodyHTML;
  overlay.style.display = "flex";

  document.getElementById("pmBtnClose").onclick = () => { overlay.style.display = "none"; };
  document.getElementById("pmBtnPrint").onclick = () => {
    const printArea = document.getElementById("pmPrintArea");
    const paperWidth = (()=>{
      const pt = DB&&DB.settings&&DB.settings.printer;
      if (pt==='thermal58') return '50mm';
      if (pt==='A4' || pt==='A5') return '190mm';
      return '72mm';
    })();

    // ✅ إصلاح Gap #5: استخدام _printHtml (iframe) بدلاً من window.open الذي يُحجب
    const css = [
      `@page{size:${paperWidth} auto;margin:0mm}`,
      `*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}`,
      `html,body{margin:0!important;padding:0!important;width:${paperWidth};max-width:${paperWidth};font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#000;background:#fff;height:auto!important}`,
      `.pm-inv-paper{width:${paperWidth};max-width:${paperWidth};padding:3mm 2mm 6mm 2mm;overflow:hidden}`,
      `.pm-inv-header{text-align:center;margin-bottom:2mm}`,
      `.pm-inv-logo{max-height:14mm;margin:0 auto 1mm;display:block}`,
      `.pm-inv-shop{font-size:14pt;font-weight:900;letter-spacing:0.5px;margin-bottom:1mm;color:#000;text-transform:uppercase}`,
      `.pm-inv-phone{font-size:9pt;color:#000;margin-top:0.5mm;font-weight:600}`,
      `.pm-inv-divider{border:none;border-top:0.4mm dashed #000;margin:1.5mm 0;width:100%}`,
      `.pm-inv-row{display:flex;justify-content:space-between;align-items:baseline;margin:1mm 0;font-size:9pt;color:#000;font-weight:700;width:100%;overflow:hidden}`,
      `.pm-inv-row span:first-child{white-space:nowrap}`,
      `.pm-inv-row span:last-child{white-space:nowrap;font-weight:900}`,
      `.pm-inv-items-head{display:flex;justify-content:space-between;font-weight:900;font-size:9pt;margin:1.5mm 0 1mm;padding-bottom:1mm;border-bottom:0.3mm solid #000;color:#000;width:100%}`,
      `.pm-inv-items-head span:nth-child(1){flex:1}`,
      `.pm-inv-items-head span:nth-child(2){width:7mm;text-align:center}`,
      `.pm-inv-items-head span:nth-child(3){width:18mm;text-align:left}`,
      `.pm-inv-item{display:flex;justify-content:space-between;align-items:baseline;margin:1mm 0;font-size:9pt;color:#000;line-height:1.4;width:100%}`,
      `.pm-inv-name{flex:1;font-weight:700;word-break:break-word;padding-left:1mm}`,
      `.pm-inv-qty{width:7mm;text-align:center;font-weight:700;white-space:nowrap}`,
      `.pm-inv-price{width:18mm;text-align:left;font-weight:700;white-space:nowrap}`,
      `.pm-inv-total{display:flex;justify-content:space-between;font-weight:900;font-size:12pt;margin:2mm 0 1mm;color:#000;width:100%}`,
      `.pm-inv-total span:last-child{white-space:nowrap}`,
      `.pm-inv-paid{display:flex;justify-content:space-between;font-size:9pt;margin:1mm 0;color:#000;font-weight:700;width:100%}`,
      `.pm-inv-paid span:last-child{white-space:nowrap}`,
      `.pm-inv-change{text-align:center;margin-top:2mm;font-size:10pt;color:#000;font-weight:900;border:0.4mm solid #000;border-radius:1mm;padding:1mm 2mm;width:100%}`,
      `.pm-inv-welcome{text-align:center;margin-top:2mm;font-size:9pt;color:#000;font-weight:700;padding-top:2mm;border-top:0.4mm dashed #000;width:100%}`,
      `@media print{html,body{height:auto!important;overflow:hidden}.pm-inv-paper{page-break-after:avoid;page-break-inside:avoid;orphans:0;widows:0}}`
    ].join('');

    const html = `<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>فاتورة</title><style>${css}</style></head><body><div class="pm-inv-paper">${printArea.innerHTML}</div></body></html>`;
    _printHtml(html);

    // إغلاق مودال الفاتورة
    const ov = document.getElementById('printModalOverlay');
    if(ov) ov.style.display = 'none';
  };

  overlay.onclick = (e) => { if(e.target===overlay) overlay.style.display="none"; };
}
function partial(){
  if(!DB.cart.length){ showToast(t("msg_no_cart"),"error"); return; }
  const paidVal=parseFloat(document.getElementById("paid").value);
  const total=getCartTotal();
  if(isNaN(paidVal)||paidVal<=0){ showToast(t("msg_need_amount"),"error"); return; }
  if(paidVal>=total){ showToast(t("msg_covers_all"),"error"); return; }

  const customerName = custSelect.value;
  if(!customerName){
    showToast(t("msg_select_customer"), "error"); return;
  }

  const remaining=total-paidVal;
  const customer=DB.customers.find(c=>c.name===customerName);
  const debtRecord={id:uid(), date:new Date().toISOString(),total,paid:paidVal,remaining};
  if(customer){ customer.debts=customer.debts||[]; customer.debts.push(debtRecord); }
  deductStock();
  DB.sales.push(buildSale("جزئي",paidVal));
  DB.debts=DB.debts||[];
  // ✅ Fix #3: إضافة id فريد لكل سجل دين لتتبعه لاحقاً
  DB.debts.push({id:debtRecord.id, customer:customerName,...debtRecord});
  DB.cart=[]; document.getElementById("paid").value="";
  // إعادة تصفير الخصم
  const dvEl=document.getElementById("discountVal"); if(dvEl) dvEl.value="0";
  saveDB();
  showToast(t("msg_partial_ok")+formatPrice(paidVal)+t("msg_partial_rem")+formatPrice(remaining),"success");
  renderSaleStock(); renderReports();
}
function toDebt(){
  if(!DB.cart.length){ showToast(t("msg_no_cart"),"error"); return; }
  const customerName=custSelect.value;
  if(!customerName){ showToast(t("msg_select_customer"),"error"); return; }
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
   REPORTS — مع إظهار/إخفاء + تاريخ مخصص + مداخيل المستخدمين
================================================ */
let currentReportTab="daily";
let reportNumbersVisible = false;

function toggleReportNumbers() {
  reportNumbersVisible = !reportNumbersVisible;
  const wrap = document.getElementById("reportCardsWrap");
  const btn  = document.getElementById("btnToggleNumbers");
  if (reportNumbersVisible) {
    wrap.classList.remove("hidden");
    btn.textContent = "🙈 إخفاء الأرقام";
  } else {
    wrap.classList.add("hidden");
    btn.textContent = "👁️ إظهار الأرقام";
  }
}

function switchReportTab(tab,btn){
  currentReportTab=tab;
  document.querySelectorAll(".rtab").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  // إظهار/إخفاء صف التاريخ المخصص
  const customRow = document.getElementById("customDateRow");
  if (tab==="custom") {
    customRow.classList.remove("hidden");
  } else {
    customRow.classList.add("hidden");
  }
  renderReports();
}

function filterSalesByPeriod(tab){
  const now=new Date();
  if (tab==="custom") {
    const from = document.getElementById("reportDateFrom")?.value;
    const to   = document.getElementById("reportDateTo")?.value;
    return (DB.sales||[]).filter(s=>{
      const d=new Date(s.date);
      const afterFrom = from ? d >= new Date(from) : true;
      const beforeTo  = to   ? d <= new Date(to+"T23:59:59") : true;
      return afterFrom && beforeTo;
    });
  }
  return(DB.sales||[]).filter(s=>{
    const d=new Date(s.date);
    if(tab==="daily")   return isSameDay(d,now);
    if(tab==="weekly")  return isSameWeek(d,now);
    if(tab==="monthly") return isSameMonth(d,now);
    if(tab==="yearly")  return isSameYear(d,now);
    return true;
  });
}

function getReportPeriodLabel(tab) {
  const labels = { daily:"📊 إجمالي اليوم", weekly:"📊 إجمالي الأسبوع", monthly:"📊 إجمالي الشهر", yearly:"📊 إجمالي السنة", all:"📊 إجمالي الكل", custom:"📅 نتائج البحث" };
  return labels[tab] || "📊 البيانات";
}

function renderReports(){
  const sales=filterSalesByPeriod(currentReportTab);
  let revenue=0,cost=0,cashRevenue=0,debtRevenue=0;
  sales.forEach(s=>{
    // ✅ Fix #23: استخدام s.total (بعد الخصم) بدلاً من price*qty
    const saleRevenue = s.total || s.items.reduce((t,i)=>t+i.price*i.qty,0) - (s.discount||0);
    revenue += saleRevenue;
    s.items.forEach(i=>{ cost+=(i.cost||0)*i.qty; });
    // ✅ Fix #24: تمييز النقد عن الديون
    if(s.type==="دين") debtRevenue += saleRevenue;
    else cashRevenue += s.paid || saleRevenue;
  });
  document.getElementById("rSales").textContent=sales.length;
  document.getElementById("rRevenue").textContent=formatPrice(revenue);
  document.getElementById("rCost").textContent=formatPrice(cost);
  document.getElementById("rProfit").textContent=formatPrice(revenue-cost);
  // عرض النقد الفعلي والديون إن وُجدت العناصر
  const rCash=document.getElementById("rCashRevenue");
  const rDebt=document.getElementById("rDebtRevenue");
  if(rCash) rCash.textContent=formatPrice(cashRevenue);
  if(rDebt) rDebt.textContent=formatPrice(debtRevenue);
  const label = document.getElementById("reportsToggleLabel");
  if (label) label.textContent = getReportPeriodLabel(currentReportTab);
  renderDebts();
  renderSalesLog(sales);
  renderUserRevenue(sales);
  renderProductReport("top"); // ✅ النقيصة #14: تحديث تقرير المنتجات
}

/* ================================================
   PRODUCT REPORT — تقرير المنتجات (النقيصة #14)
================================================ */
let _productReportMode = "top";
function renderProductReport(mode) {
  _productReportMode = mode || _productReportMode;
  const list = document.getElementById("productReportList"); if(!list) return;
  list.innerHTML = "";

  // تحديث أزرار التبويب
  ["btnTopProducts","btnSlowProducts","btnLowProducts"].forEach(id=>{
    const btn=document.getElementById(id); if(btn) btn.classList.remove("active");
  });
  const activeBtn = _productReportMode==="top"?"btnTopProducts":
                    _productReportMode==="slow"?"btnSlowProducts":"btnLowProducts";
  const ab = document.getElementById(activeBtn); if(ab) ab.classList.add("active");

  if (_productReportMode === "low") {
    const threshold = DB.settings.lowStockThreshold || 5;
    const items = DB.stock.filter(i=>i.qty<=threshold).sort((a,b)=>a.qty-b.qty);
    if(!items.length){list.innerHTML='<li style="color:#10b981;text-align:center;padding:16px">✅ كل المخزون كافٍ</li>';return;}
    items.forEach(item=>{
      const li=document.createElement("li");
      li.style.cssText="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;border-bottom:1px solid var(--border)";
      const qc=item.qty<=0?"#ef4444":item.qty<3?"#f97316":"#f59e0b";
      li.innerHTML=`<span>${item.type} ${item.brand}${item.size?" — "+item.size:""}</span>
        <span style="color:${qc};font-weight:800">${item.qty} ${item.unit||"قطعة"}</span>`;
      list.appendChild(li);
    });
    return;
  }

  // ✅ Fix #26: استخدام المبيعات المُفلترة بالفترة الحالية
  const filteredSales = filterSalesByPeriod(currentReportTab);
  const productSales = {};
  filteredSales.forEach(s=>{
    (s.items||[]).forEach(i=>{
      if(!productSales[i.barcode]) productSales[i.barcode]={name:i.name,qty:0,revenue:0,barcode:i.barcode};
      productSales[i.barcode].qty     += i.qty;
      productSales[i.barcode].revenue += i.price*i.qty;
    });
  });

  const allItems = DB.stock.map(item=>{
    const sales = productSales[item.barcode];
    return { name:`${item.type} ${item.brand}${item.size?" — "+item.size:""}`,
             qty: sales?sales.qty:0, revenue: sales?sales.revenue:0, stock:item.qty,
             unit: item.unit||"قطعة", barcode: item.barcode };
  });

  let sorted;
  if (_productReportMode === "top") {
    sorted = allItems.filter(i=>i.qty>0).sort((a,b)=>b.qty-a.qty).slice(0,15);
    if(!sorted.length){list.innerHTML='<li style="color:var(--text3);text-align:center;padding:16px">لا توجد مبيعات بعد</li>';return;}
    sorted.forEach((item,idx)=>{
      const li=document.createElement("li");
      li.style.cssText="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;border-bottom:1px solid var(--border)";
      const medal=idx===0?"🥇":idx===1?"🥈":idx===2?"🥉":"";
      li.innerHTML=`<span>${medal} ${item.name}</span>
        <span style="font-size:12px;color:var(--text3)">${item.qty} ${item.unit} | ${formatPrice(item.revenue)}</span>`;
      list.appendChild(li);
    });
  } else {
    sorted = allItems.filter(i=>i.stock>0).sort((a,b)=>a.qty-b.qty).slice(0,15);
    if(!sorted.length){list.innerHTML='<li style="color:var(--text3);text-align:center;padding:16px">لا توجد منتجات في المخزون</li>';return;}
    sorted.forEach(item=>{
      const li=document.createElement("li");
      li.style.cssText="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;border-bottom:1px solid var(--border)";
      li.innerHTML=`<span>${item.name}</span>
        <span style="font-size:12px;color:var(--text3)">${item.qty===0?"لم يُباع":item.qty+" "+item.unit} | مخزون: ${item.stock}</span>`;
      list.appendChild(li);
    });
  }
}

function renderUserRevenue(sales) {
  const list = document.getElementById("userRevenueList");
  if (!list) return;
  list.innerHTML="";
  // تجميع حسب المستخدم
  const byUser = {};
  sales.forEach(s=>{
    const u = s.userName || "—";
    if (!byUser[u]) byUser[u] = { revenue:0, count:0 };
    s.items.forEach(i=>{ byUser[u].revenue += i.price*i.qty; });
    byUser[u].count++;
  });
  const entries = Object.entries(byUser).sort((a,b)=>b[1].revenue-a[1].revenue);
  if (!entries.length) {
    list.innerHTML=`<li style="color:var(--text3);text-align:center;padding:12px">لا توجد بيانات</li>`;
    return;
  }
  entries.forEach(([name,data])=>{
    const li = document.createElement("li");
    li.className = "user-rev-item";
    li.innerHTML=`
      <span class="user-rev-name">👤 ${name}</span>
      <span>
        <span class="user-rev-count">${data.count} عملية</span>
        &nbsp;&nbsp;
        <span class="user-rev-amount">${formatPrice(data.revenue)}</span>
      </span>`;
    list.appendChild(li);
  });
}

function renderDebts(){
  const searchQ = (document.getElementById("debtSearch")?.value||"").toLowerCase().trim();
  const byCustomer={};
  (DB.debts||[]).forEach(d=>{
    if(!byCustomer[d.customer]) byCustomer[d.customer]=0;
    byCustomer[d.customer]+=d.remaining||0;
  });
  const totalDebt=Object.values(byCustomer).reduce((s,v)=>s+v,0);
  const debtCount=Object.keys(byCustomer).filter(k=>byCustomer[k]>0).length;
  document.getElementById("rTotalDebt").textContent=formatPrice(totalDebt);
  document.getElementById("rDebtCount").textContent=debtCount;
  var ct=document.getElementById("cTotalDebt"); if(ct) ct.textContent=formatPrice(totalDebt);
  var cc=document.getElementById("cDebtCount"); if(cc) cc.textContent=debtCount;
  const debtList=document.getElementById("debtList");
  debtList.innerHTML="";
  let entries=Object.entries(byCustomer).filter(([,v])=>v>0);
  // فلترة البحث
  if (searchQ) entries = entries.filter(([name])=>name.toLowerCase().includes(searchQ));
  if(!entries.length){
    debtList.innerHTML=`<li style="color:var(--text3);text-align:center;padding:20px">${searchQ?"لا نتائج":t("no_debts")}</li>`; return;
  }
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
  // ✅ إصلاح Bug #11: حساب الحد الأقصى للتسوية قبل فتح نافذة الإدخال
  const totalRemaining = (DB.debts||[])
    .filter(d=>d.customer===customerName&&d.remaining>0)
    .reduce((s,d)=>s+d.remaining, 0);

  if (totalRemaining <= 0) {
    showToast("✅ لا يوجد دين متبقٍّ على هذا الزبون", "info"); return;
  }

  safePrompt(t("settle_prompt") + " (الحد الأقصى: " + formatPrice(totalRemaining) + ")", function(amount){
    if(!amount||isNaN(amount)||Number(amount)<=0) return;
    // تقييد المبلغ بالحد الأقصى المتبقي
    const pay = Math.min(parseFloat(amount), totalRemaining);
    let remaining=pay;
    (DB.debts||[]).forEach(d=>{
      if(d.customer===customerName&&d.remaining>0&&remaining>0){
        const deduct=Math.min(d.remaining,remaining);
        d.remaining=Math.max(0, d.remaining-deduct);
        d.paid+=deduct;
        remaining-=deduct;
      }
    });
    const customer=DB.customers.find(c=>c.name===customerName);
    if(customer){ let r2=pay; (customer.debts||[]).forEach(d=>{ if(d.remaining>0&&r2>0){const x=Math.min(d.remaining,r2);d.remaining=Math.max(0,d.remaining-x);r2-=x;} }); }
    saveDB();
    showToast(t("settle_ok")+formatPrice(pay)+t("settle_from")+customerName,"success");
    renderDebts();
  });
}
let _salesLogPage = 0;
const SALES_PER_PAGE = 30;

function renderSalesLog(sales){
  const salesLog=document.getElementById("salesLog");
  salesLog.innerHTML="";
  if(!sales.length){ salesLog.innerHTML=`<li style="color:var(--text3);text-align:center;padding:20px">${t("no_sales")}</li>`; return; }
  const typeColor={"كامل":"#10b981","جزئي":"#f59e0b","دين":"#ef4444"};
  const sorted=[...sales].reverse();
  const total=sorted.length;
  const pages=Math.ceil(total/SALES_PER_PAGE);
  if(_salesLogPage>=pages) _salesLogPage=0;
  const start=_salesLogPage*SALES_PER_PAGE;
  const slice=sorted.slice(start,start+SALES_PER_PAGE);
  slice.forEach(sale=>{
    const li=document.createElement("li");
    li.style.cssText="padding:10px 8px;border-bottom:1px solid var(--border);font-size:14px";
    li.innerHTML=`
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px">
        <span>${sale.invoiceNum?`<strong>#${sale.invoiceNum}</strong> | `:""}<span style="color:${typeColor[sale.type]||"var(--text)"};font-weight:700">${sale.type}</span> | 👤 ${sale.customer}${sale.userName&&sale.userName!=="—"?` <span style="color:var(--text3);font-size:12px">(${sale.userName})</span>`:""}</span>
        <span style="font-weight:800">${formatPrice(sale.total)}</span>
      </div>
      <div style="color:var(--text3);font-size:12px;display:flex;justify-content:space-between">
        <span>${formatDate(sale.date)}</span>
        ${sale.discount>0?`<span style="color:#10b981;font-size:11px">خصم: -${formatPrice(sale.discount)}</span>`:""}
      </div>`;
    salesLog.appendChild(li);
  });
  // ✅ Pagination controls
  if(pages>1){
    const nav=document.createElement("li");
    nav.style.cssText="display:flex;justify-content:center;align-items:center;gap:10px;padding:12px 8px;list-style:none";
    nav.innerHTML=`
      <button onclick="_salesLogPage=Math.max(0,_salesLogPage-1);renderReports()"
        style="padding:6px 14px;border-radius:8px;background:var(--bg2);border:1px solid var(--border);cursor:pointer;font-weight:700"
        ${_salesLogPage===0?"disabled":""}>⬅</button>
      <span style="font-size:13px;color:var(--text2)">صفحة ${_salesLogPage+1} / ${pages} &nbsp;|&nbsp; ${total} عملية</span>
      <button onclick="_salesLogPage=Math.min(${pages-1},_salesLogPage+1);renderReports()"
        style="padding:6px 14px;border-radius:8px;background:var(--bg2);border:1px solid var(--border);cursor:pointer;font-weight:700"
        ${_salesLogPage>=pages-1?"disabled":""}>➡</button>`;
    salesLog.appendChild(nav);
  }
  // إجمالي الصفحة الحالية
  if(total>0){
    const info=document.createElement("li");
    info.style.cssText="padding:6px 8px;font-size:12px;color:var(--text3);text-align:center;list-style:none";
    info.textContent=`عرض ${start+1}–${Math.min(start+SALES_PER_PAGE,total)} من ${total} عملية`;
    salesLog.insertBefore(info,salesLog.firstChild);
  }
}

/* ================================================
   مسح بيانات المبيعات — شهر أو سنة
================================================ */
function clearSalesData(period) {
  const confirmMsg = period==="month" ? t("msg_clear_month_confirm") : t("msg_clear_year_confirm");
  safeConfirm(confirmMsg, function(){
    const now = new Date();
    if (period === "month") {
      DB.sales = (DB.sales||[]).filter(s=>!isSameMonth(new Date(s.date),now));
      DB.debts  = (DB.debts||[]).filter(d=>!isSameMonth(new Date(d.date),now));
      // ✅ إصلاح Bug #12: تنظيف ديون الزبائن الداخلية عند مسح الشهر (كما يفعل مسح السنة)
      DB.customers.forEach(c=>{
        if (c.debts) c.debts = c.debts.filter(d=>!isSameMonth(new Date(d.date),now));
      });
    } else {
      DB.sales = (DB.sales||[]).filter(s=>!isSameYear(new Date(s.date),now));
      DB.debts  = (DB.debts||[]).filter(d=>!isSameYear(new Date(d.date),now));
      DB.customers.forEach(c=>{
        if (c.debts) c.debts = c.debts.filter(d=>!isSameYear(new Date(d.date),now));
      });
    }
    saveDB();
    showToast(t("msg_clear_done"), "success");
    renderReports();
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
   PRINT ENGINE — محرك طباعة موثوق عبر iframe
   يعمل مع GitHub Pages بدون قيود Blob/popup
================================================ */
function _printHtml(htmlContent) {
  // إزالة أي iframe سابق
  const old = document.getElementById('_printFrame');
  if (old) old.remove();

  const iframe = document.createElement('iframe');
  iframe.id = '_printFrame';
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:none;visibility:hidden';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(htmlContent);
  doc.close();

  // ننتظر تحميل المحتوى ثم نطبع
  iframe.onload = function() {
    setTimeout(function() {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch(e) {
        window.print();
      }
      // تنظيف بعد الطباعة
      setTimeout(function() {
        const f = document.getElementById('_printFrame');
        if (f) f.remove();
      }, 3000);
    }, 250);
  };
}


/* ================================================
   CUSTOMER TABS
================================================ */
function switchCustTab(tab, btn) {
  document.querySelectorAll('.ctab').forEach(function(b){ b.classList.remove('active'); });
  document.querySelectorAll('.cust-panel').forEach(function(p){ p.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  var panel = document.getElementById(tab === 'list' ? 'custTabList' : 'custTabDebts');
  if (panel) panel.classList.add('active');
  if (tab === 'debts') renderDebts();
  if (tab === 'list')  renderCustomerList();
}

/* ================================================
   DAILY CLOSE
================================================ */
function showDailyClose() {
  var today = new Date();
  var todaySales = filterSalesByPeriod('daily');
  var revenue = 0, cost = 0, cashSales = 0, debtSales = 0;
  todaySales.forEach(function(s) {
    s.items.forEach(function(i){ revenue += i.price*i.qty; cost += (i.cost||0)*i.qty; });
    if (s.type === 'دين') debtSales += s.total;
    else cashSales += s.paid || s.total;
  });
  var profit = revenue - cost;
  var byC = (DB.debts||[]).reduce(function(acc,d){ acc[d.customer]=(acc[d.customer]||0)+(d.remaining||0); return acc; },{});
  var totalDebt = Object.values(byC).reduce(function(s,v){ return s+v; }, 0);

  var overlay = document.getElementById('dailyCloseOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'dailyCloseOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:99997;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = [
    '<div style="background:var(--surface);border-radius:20px;padding:24px;max-width:440px;width:94%;max-height:90vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,0.3)">',
      '<div style="text-align:center;margin-bottom:18px">',
        '<div style="font-size:24px">&#9733;</div>',
        '<div style="font-size:18px;font-weight:900;color:var(--primary)">تقرير إقفال اليوم</div>',
        '<div style="font-size:13px;color:var(--text3);margin-top:4px">' + formatDate(today.toISOString()) + '</div>',
      '</div>',
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">',
        '<div class="dc-card green"><div class="dc-label">🛒 عمليات البيع</div><div class="dc-val">' + todaySales.length + '</div></div>',
        '<div class="dc-card blue"><div class="dc-label">💰 المداخيل</div><div class="dc-val">' + formatPrice(revenue) + '</div></div>',
        '<div class="dc-card orange"><div class="dc-label">💵 النقد المحصّل</div><div class="dc-val">' + formatPrice(cashSales) + '</div></div>',
        '<div class="dc-card purple"><div class="dc-label">📈 صافي الربح</div><div class="dc-val">' + formatPrice(profit) + '</div></div>',
        '<div class="dc-card red"><div class="dc-label">📋 مبيعات بالدين</div><div class="dc-val">' + formatPrice(debtSales) + '</div></div>',
        '<div class="dc-card indigo"><div class="dc-label">⚠️ إجمالي الديون</div><div class="dc-val">' + formatPrice(totalDebt) + '</div></div>',
      '</div>',
      '<div style="background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:12px;padding:14px;text-align:center;margin-bottom:16px;color:white">',
        '<div style="font-size:13px;opacity:0.9">صافي الإيراد اليومي</div>',
        '<div style="font-size:22px;font-weight:900">' + formatPrice(profit) + '</div>',
      '</div>',
      '<div style="display:flex;gap:8px">',
        '<button onclick="printDailyClose()" style="flex:1;padding:12px;background:linear-gradient(135deg,#6366f1,#a855f7);color:white;border-radius:10px;font-weight:800;font-size:14px;border:none;cursor:pointer">🖨️ طباعة</button>',
        '<button id="dcCloseBtn" style="flex:1;padding:12px;background:var(--bg2);color:var(--text);border-radius:10px;font-weight:800;font-size:14px;border:none;cursor:pointer">✖ إغلاق</button>',
      '</div>',
    '</div>'
  ].join('');

  overlay.style.display = 'flex';
  var closeBtn = document.getElementById('dcCloseBtn');
  if (closeBtn) closeBtn.onclick = function(){ overlay.style.display='none'; };
  overlay.onclick = function(e){ if(e.target===overlay) overlay.style.display='none'; };
}

function printDailyClose() {
  var today = new Date();
  var todaySales = filterSalesByPeriod('daily');
  var revenue = 0, cost = 0, cashSales = 0, debtSales = 0;
  todaySales.forEach(function(s) {
    s.items.forEach(function(i){ revenue += i.price*i.qty; cost += (i.cost||0)*i.qty; });
    if (s.type === 'دين') debtSales += s.total;
    else cashSales += s.paid || s.total;
  });
  var st = DB.settings;
  // ✅ إصلاح Gap #4: عرض ورق صحيح حسب نوع الطابعة
  var paperW = st.printer === 'thermal58' ? '50mm' : (st.printer === 'A4' || st.printer === 'A5') ? '190mm' : '72mm';
  var css = [
    '@page{size:'+paperW+' auto;margin:0mm}',
    '*{box-sizing:border-box}',
    'html,body{margin:0!important;padding:0!important;width:'+paperW+';font-family:Arial,Helvetica,sans-serif;font-size:10pt;color:#000;direction:rtl}',
    '.w{width:'+paperW+';padding:3mm 3mm 8mm}',
    '.ti{text-align:center;font-size:14pt;font-weight:900;margin-bottom:1mm}',
    '.su{text-align:center;font-size:9pt;color:#333;margin-bottom:3mm}',
    'hr{border:none;border-top:0.4mm dashed #000;margin:2mm 0;width:100%}',
    '.ro{display:flex;justify-content:space-between;margin:1.5mm 0;font-size:9.5pt;font-weight:700}',
    '.to{display:flex;justify-content:space-between;font-size:13pt;font-weight:900;margin:3mm 0}',
    '.fo{text-align:center;font-size:9pt;margin-top:4mm;padding-top:2mm;border-top:0.4mm dashed #000}',
    '@media print{html,body{height:auto!important}}'
  ].join('');

  var body = [
    '<div class="w">',
    '<div class="ti">' + (st.name||'POS DZ') + '</div>',
    '<div class="su">تقرير إقفال اليوم &#8212; ' + formatDate(today.toISOString()) + '</div>',
    '<hr>',
    '<div class="ro"><span>عمليات البيع:</span><span>' + todaySales.length + '</span></div>',
    '<div class="ro"><span>المداخيل:</span><span>' + formatPrice(revenue) + '</span></div>',
    '<div class="ro"><span>النقد المحصّل:</span><span>' + formatPrice(cashSales) + '</span></div>',
    '<div class="ro"><span>مبيعات بالدين:</span><span>' + formatPrice(debtSales) + '</span></div>',
    '<div class="ro"><span>تكلفة الشراء:</span><span>' + formatPrice(cost) + '</span></div>',
    '<hr>',
    '<div class="to"><span>صافي الربح:</span><span>' + formatPrice(revenue-cost) + '</span></div>',
    '<hr>',
    '<div class="fo">' + (st.name||'POS DZ') + '</div>',
    '</div>'
  ].join('');

  var html = '<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><style>' + css + '</style></head><body>' + body + '</body></html>';
  _printHtml(html);
}


/* ================================================
   INIT — التهيئة الآمنة الشاملة
================================================ */
try { if(addUserForm)   addUserForm.addEventListener("submit", addUser); } catch(e){}
try { if(addUserInAlerts) addUserInAlerts.addEventListener("submit", addUserInAlertsFunc); } catch(e){}

try { applyTranslations(); } catch(e){ console.error("applyTranslations",e); }
try { renderUsersTable(); } catch(e){ console.error("renderUsersTable",e); }
try { renderUserSelect(); } catch(e){ console.error("renderUserSelect",e); }
try { renderStock(); } catch(e){ console.error("renderStock",e); }
try { renderSaleStock(); } catch(e){ console.error("renderSaleStock",e); }
try { renderCustomerSelect(); } catch(e){ console.error("renderCustomerSelect",e); }
try { renderCustomerList(); } catch(e){ console.error("renderCustomerList",e); }
try { renderFamilyList(); } catch(e){ console.error("renderFamilyList",e); }
try { renderBrandList(); } catch(e){ console.error("renderBrandList",e); }
try { loadAppearanceSettings(); } catch(e){ console.error("loadAppearanceSettings",e); }

/* التحقق من جلسة المستخدم المحفوظة */
(function initSession() {
  let logged = null;
  try { logged = JSON.parse(localStorage.getItem("POSDZ_LOGGED")); } catch(e) { logged = null; }

  /* التحقق من أن المستخدم المحفوظ لا يزال موجوداً في قاعدة البيانات */
  if (logged && logged.name) {
    const stillExists = DB.users.find(u => u.name === logged.name && u.pin === logged.pin);
    if (!stillExists) {
      localStorage.removeItem("POSDZ_LOGGED");
      logged = null;
    }
  }

  if (logged) {
    loginScreen.style.display = "none";
    mainApp.style.display     = "block";
    applyHeader(); showSale(); startClock();
    checkAutoBackup();
  } else {
    loginScreen.style.display = "flex";
    mainApp.style.display     = "none";
    /* تلميح بيانات الدخول الافتراضية إن لم يكن هناك مستخدم آخر */
    setTimeout(()=>{
      if (DB.users.length === 1 && DB.users[0].immutable) {
        const lm = document.getElementById("loginMsg");
        if (lm && !lm.textContent) {
          lm.textContent = "مرحباً 👋 الرجاء اختيار المستخدم وإدخال رمز PIN";
          lm.className = "login-msg info";
        }
      }
      /* ✅ إظهار زر الطوارئ إذا القائمة فارغة أو بها خيار واحد فقط */
      const sel = document.getElementById("userSelect");
      const emergBtn = document.getElementById("emergencyResetBtn");
      if (sel && emergBtn && sel.options.length <= 1) {
        emergBtn.style.display = "block";
      }
    }, 800);
  }
})();
/* ================================================
   STOCK NEW SYSTEM — نظام المخزون الجديد
================================================ */

/* ---- تبديل الأقسام الأربعة ---- */
function switchStockView(view, btn) {
  document.querySelectorAll('.stock-action-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.stock-view').forEach(v => v.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const el = document.getElementById('stockView' + view.charAt(0).toUpperCase() + view.slice(1));
  if (el) el.classList.add('active');

  if (view === 'all')      { renderStock(); renderStockNotifications(); updateStockStatBadges(); }
  if (view === 'add')      { populateStockSelects(); updateCurrencyBadges(); }
  if (view === 'families') { renderFamilyList(); updateFamiliesCounter(); }
  if (view === 'import')   { updateIEStats(); }
}

/* تجاوز دالة show() الأصلية لتهيئة المخزون */
const _origShow = show;
show = function(id) {
  _origShow(id);
  if (id === 'stock') {
    setTimeout(() => {
      switchStockView('all', document.getElementById('saBtnAll'));
    }, 60);
  }
};

/* تجاوز switchStockTab القديمة */
switchStockTab = function(panel, btn) {
  const map = { all: 'all', families: 'families', brands: 'families' };
  switchStockView(map[panel] || 'all', document.getElementById('saBtnAll'));
};

/* ---- شارات الإحصائيات ---- */
function updateStockStatBadges() {
  const el = document.getElementById('stockStatsBadges');
  if (!el) return;
  const total = DB.stock.length;
  const thresh = DB.settings.lowStockThreshold || 5;
  const low = DB.stock.filter(i => i.qty > 0 && i.qty <= thresh).length;
  const out = DB.stock.filter(i => i.qty <= 0).length;
  el.innerHTML =
    `<span class="stock-stat-b total">📦 ${total} منتج</span>` +
    (low > 0 ? `<span class="stock-stat-b low">⚠️ ${low} منخفض</span>` : '') +
    (out > 0 ? `<span class="stock-stat-b out">🔴 ${out} نفذ</span>` : '');
}

/* ---- Notifications المخزون ---- */
function renderStockNotifications() {
  const container = document.getElementById('stockNotifBar');
  if (!container) return;
  container.innerHTML = '';
  const today = new Date(); today.setHours(0,0,0,0);
  const soon  = new Date(today); soon.setDate(soon.getDate() + 30);
  const thresh = DB.settings.lowStockThreshold || 5;

  const out     = DB.stock.filter(i => i.qty <= 0);
  const low     = DB.stock.filter(i => i.qty > 0 && i.qty <= thresh);
  const expired = DB.stock.filter(i => { if(!i.exp) return false; const d=new Date(i.exp); d.setHours(0,0,0,0); return d < today && i.qty > 0; });
  const expSoon = DB.stock.filter(i => { if(!i.exp) return false; const d=new Date(i.exp); d.setHours(0,0,0,0); return d >= today && d <= soon; });

  const notifs = [];
  if (out.length)     notifs.push({ type:'error', icon:'🔴', text:`${out.length} منتج نفد من المخزون تماماً: ${out.slice(0,3).map(i=>i.brand).join('، ')}${out.length>3?'...':''}` });
  if (expired.length) notifs.push({ type:'error', icon:'☠️', text:`${expired.length} منتج منتهي الصلاحية في المخزون` });
  if (expSoon.length) notifs.push({ type:'warn',  icon:'⏰', text:`${expSoon.length} منتج ينتهي خلال 30 يوماً` });
  if (low.length)     notifs.push({ type:'warn',  icon:'⚠️', text:`${low.length} منتج وصل لحد التنبيه (أقل من ${thresh})` });

  notifs.forEach(n => {
    const div = document.createElement('div');
    div.className = `stock-notif ${n.type}`;
    div.innerHTML = `<span class="sn-icon">${n.icon}</span><span class="sn-text">${n.text}</span><button class="sn-close" onclick="this.parentElement.remove()">✕</button>`;
    container.appendChild(div);
  });
}

/* ---- رمز العملة في حقول الأسعار ---- */
function updateCurrencyBadges() {
  const cur = DB.settings.currency || 'دج';
  ['priceCurrencyBadge','costCurrencyBadge'].forEach(id => {
    const el = document.getElementById(id); if(el) el.textContent = cur;
  });
}

/* ---- عداد العائلات ---- */
function updateFamiliesCounter() {
  const el = document.getElementById('familiesCounter');
  if (el) el.textContent = DB.families.length + ' عائلة';
}

/* ---- إحصائيات الاستيراد/التصدير ---- */
function updateIEStats() {
  const thresh = DB.settings.lowStockThreshold || 5;
  const cnt  = document.getElementById('ieStockCount');  if(cnt) cnt.textContent = DB.stock.length;
  const low  = DB.stock.filter(i => i.qty > 0 && i.qty <= thresh).length;
  const out  = DB.stock.filter(i => i.qty <= 0).length;
  const lb   = document.getElementById('ieLowBadge');
  const ob   = document.getElementById('ieOutBadge');
  const lc   = document.getElementById('ieLowCount');
  const oc   = document.getElementById('ieOutCount');
  if(lb) lb.style.display = low > 0 ? '' : 'none';
  if(lc) lc.textContent = low;
  if(ob) ob.style.display = out > 0 ? '' : 'none';
  if(oc) oc.textContent = out;
}

/* ---- تفريغ نموذج الإضافة ---- */
function clearStockAddForm() {
  ['barcode','size','price','costPrice','qty','exp'].forEach(id => {
    const el = document.getElementById(id); if(el) el.value = '';
  });
  const t = document.getElementById('type'); if(t) t.value = '';
  const b = document.getElementById('brand'); if(b) b.value = '';
  const u = document.getElementById('unit'); if(u) u.value = 'قطعة';
  const dot = document.getElementById('barcodeStatusDot');
  if(dot) { dot.className = 'barcode-status-dot'; }
  updateBrandSelectByFamily();
  showToast('تم تفريغ الحقول', 'info');
}

/* ---- التحقق من الباركود أثناء الكتابة ---- */
document.addEventListener('DOMContentLoaded', () => {
  const bcInput = document.getElementById('barcode');
  if (bcInput) {
    bcInput.addEventListener('input', function() {
      const dot = document.getElementById('barcodeStatusDot');
      if (!dot) return;
      const val = this.value.trim();
      if (!val) { dot.className = 'barcode-status-dot'; return; }
      const existing = DB.stock.find(i => i.barcode === val);
      if (existing) {
        dot.className = 'barcode-status-dot exists';
        dot.title = `موجود مسبقاً: ${existing.type} ${existing.brand}`;
      } else {
        dot.className = 'barcode-status-dot new';
        dot.title = 'باركود جديد';
      }
    });
  }
});

/* ---- طباعة باركود المنتج مع اسم المحل ---- */
function printProductBarcode(itemIndex) {
  const item = DB.stock[itemIndex];
  if (!item) return;
  const shopName = DB.settings.name || 'POS DZ';
  const logo = DB.settings.logo || '';
  const paperW = '60mm';

  // توليد SVG للباركود بشكل مبسط (خطوط عمودية)
  const bc = item.barcode || '';
  const barsHTML = generateBarcodeSVG(bc);

  const css = [
    `@page{size:${paperW} auto;margin:0}`,
    `*{box-sizing:border-box}`,
    `html,body{margin:0;padding:0;width:${paperW};font-family:'Cairo',Arial,sans-serif;direction:rtl;background:#fff}`,
    `.wrap{width:${paperW};padding:3mm 2mm;text-align:center}`,
    `.shop{font-size:10pt;font-weight:900;margin-bottom:1mm;color:#000}`,
    `.logo{max-height:10mm;max-width:30mm;margin:0 auto 1mm;display:block}`,
    `.product{font-size:8pt;font-weight:700;color:#333;margin-bottom:1.5mm;line-height:1.3}`,
    `.price{font-size:11pt;font-weight:900;color:#000;margin-bottom:1.5mm}`,
    `.bc-wrap{margin:1mm auto;display:inline-block}`,
    `.bc-num{font-size:7pt;letter-spacing:1px;color:#000;margin-top:1mm;font-family:monospace}`,
    `.divider{border:none;border-top:0.3mm dashed #999;margin:1.5mm 0}`,
    `@media print{html,body{height:auto!important}}`
  ].join('');

  const productName = `${item.type} ${item.brand}${item.size ? ' — ' + item.size : ''}`;
  const priceStr = item.price ? `${Number(item.price).toFixed(2)} ${DB.settings.currency || 'دج'}` : '';

  const body = `
    <div class="wrap">
      ${logo ? `<img src="${logo}" class="logo" alt="logo">` : ''}
      <div class="shop">${shopName}</div>
      <hr class="divider">
      <div class="product">${productName}</div>
      ${priceStr ? `<div class="price">${priceStr}</div>` : ''}
      <div class="bc-wrap">${barsHTML}</div>
      <div class="bc-num">${bc}</div>
    </div>`;

  const html = `<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><style>${css}</style></head><body>${body}</body></html>`;
  _printHtml(html);
}

/* توليد SVG بسيط للباركود (Code 128 مبسط) */
function generateBarcodeSVG(code) {
  if (!code) return '<svg width="100" height="40"></svg>';
  const str = String(code);
  const barWidth = 2;
  const height = 35;
  let bars = '';
  let x = 0;
  // نمط بسيط: كل حرف يولد خطوطاً عمودية بناءً على قيمته
  for (let i = 0; i < str.length; i++) {
    const v = str.charCodeAt(i) % 8;
    for (let j = 0; j < 7; j++) {
      const w = (j % 3 === 0 ? 2 : 1);
      if ((v >> (j % 3)) & 1 || j % 2 === 0) {
        bars += `<rect x="${x}" y="0" width="${w}" height="${height}" fill="${j%2===0?'#000':'#fff'}"/>`;
      }
      x += w;
    }
    x += 1; // فراغ بين الأحرف
  }
  // إضافة حدود البداية والنهاية
  const totalW = x + 8;
  const startBars = `<rect x="0" y="0" width="2" height="${height}" fill="#000"/><rect x="3" y="0" width="1" height="${height}" fill="#000"/><rect x="5" y="0" width="2" height="${height}" fill="#000"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW+8}" height="${height}" viewBox="0 0 ${totalW+8} ${height}" style="display:block;margin:auto">${startBars}${bars}<rect x="${totalW}" y="0" width="2" height="${height}" fill="#000"/><rect x="${totalW+3}" y="0" width="1" height="${height}" fill="#000"/><rect x="${totalW+5}" y="0" width="2" height="${height}" fill="#000"/></svg>`;
}

/* ---- استيراد CSV ذكي مع كشف التكرار ---- */
function importProductsFromCSVSmart(input) {
  const file = input.files[0]; if (!file) return;
  input.value = '';
  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result.replace(/^\uFEFF/, '');
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) { showToast('الملف فارغ أو لا يحتوي على بيانات', 'error'); return; }

    const dataLines = lines.slice(1);
    const toAdd = [];
    const duplicates = [];
    let errors = 0;

    dataLines.forEach((line, idx) => {
      const cols = parseCSVLine(line);
      const [famName, brandName, size, barcode, priceStr, costStr, qtyStr, unit, exp] = cols;
      if (!famName || !brandName) { errors++; return; }
      const price = parseFloat(priceStr) || 0;
      const costPrice = parseFloat(costStr) || 0;
      const qty = parseInt(qtyStr) || 0;
      const bc = barcode || ('AUTO-' + Date.now().toString(36).toUpperCase() + '-' + idx);
      const existing = barcode ? DB.stock.find(i => i.barcode === barcode) : null;

      if (existing) {
        duplicates.push({ existing, newData: { famName, brandName, size, bc, price, costPrice, qty, unit: unit||'قطعة', exp: exp||'' } });
      } else {
        toAdd.push({ famName, brandName, size: size||'', bc, price, costPrice, qty, unit: unit||'قطعة', exp: exp||'' });
      }
    });

    // دالة تنفيذ الإضافة الفعلية
    function doImport(resolvedDuplicates) {
      let added = 0, updated = 0;
      // إضافة المنتجات الجديدة
      toAdd.forEach(item => {
        let fam = DB.families.find(f => f.name === item.famName);
        if (!fam) { fam = { id: uid(), name: item.famName }; DB.families.push(fam); }
        let brand = DB.brands.find(b => b.name === item.brandName && b.familyId === fam.id);
        if (!brand) { brand = { id: uid(), name: item.brandName, familyId: fam.id }; DB.brands.push(brand); }
        DB.stock.push({ id: uid(), type: item.famName, brand: item.brandName, size: item.size, barcode: item.bc, price: item.price, costPrice: item.costPrice, qty: item.qty, exp: item.exp, unit: item.unit });
        added++;
      });
      // تطبيق قرارات التكرار
      resolvedDuplicates.forEach(r => {
        if (r.action === 'update') {
          r.existing.qty += r.newData.qty;
          if (r.newData.price > 0) r.existing.price = r.newData.price;
          if (r.newData.costPrice > 0) r.existing.costPrice = r.newData.costPrice;
          updated++;
        }
        // إذا action === 'skip' لا نفعل شيئاً
      });
      saveDB();
      renderStock(); renderFamilyList(); populateStockSelects(); renderStockNotifications(); updateStockStatBadges();
      // الانتقال تلقائياً لقسم كل المنتجات
      switchStockView('all', document.getElementById('saBtnAll'));
      showToast(`✅ الاستيراد مكتمل: ${added} مضاف، ${updated} محدَّث${errors ? ' | ' + errors + ' أخطاء' : ''}`, errors ? 'warning' : 'success');
    }

    // إذا لا يوجد تكرارات — نفذ مباشرة
    if (duplicates.length === 0) {
      doImport([]);
      return;
    }

    // عرض نافذة التكرارات
    showDuplicatesModal(duplicates, doImport);
  };
  reader.readAsText(file, 'UTF-8');
}

/* نافذة معالجة التكرارات عند الاستيراد */
function showDuplicatesModal(duplicates, onDone) {
  let overlay = document.getElementById('dupModalOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'dupModalOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
    document.body.appendChild(overlay);
  }

  const decisions = duplicates.map(d => ({ ...d, action: 'update' }));

  function renderModal() {
    const rows = decisions.map((d, i) => `
      <div class="dup-row" id="dupRow${i}">
        <div class="dup-info">
          <div class="dup-name">🏷️ <strong>${d.existing.type} ${d.existing.brand}${d.existing.size ? ' — ' + d.existing.size : ''}</strong></div>
          <div class="dup-detail">باركود: <code>${d.existing.barcode}</code> | المخزون الحالي: <strong>${d.existing.qty}</strong> | الجديد: <strong>+${d.newData.qty}</strong></div>
        </div>
        <div class="dup-actions">
          <button class="dup-btn update ${d.action==='update'?'active':''}" onclick="setDupAction(${i},'update')">✅ تحديث الكمية</button>
          <button class="dup-btn skip  ${d.action==='skip' ?'active':''}" onclick="setDupAction(${i},'skip')">❌ تجاهل</button>
        </div>
      </div>`).join('');

    overlay.innerHTML = `
      <div style="background:var(--surface);border-radius:16px;padding:24px;max-width:520px;width:95%;max-height:85vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,0.3)">
        <div style="font-size:17px;font-weight:800;color:var(--text);margin-bottom:6px">⚠️ منتجات موجودة مسبقاً (${duplicates.length})</div>
        <div style="font-size:13px;color:var(--text3);margin-bottom:18px">اختر لكل منتج: تحديث الكمية أو تجاهله</div>
        <div id="dupRowsContainer" style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">${rows}</div>
        <div style="display:flex;gap:10px">
          <button onclick="applyAllDup('update')" style="flex:1;padding:10px;background:var(--bg2);color:var(--text);border-radius:8px;font-weight:700;border:1.5px solid var(--border);cursor:pointer;font-size:13px">✅ تحديث الكل</button>
          <button onclick="applyAllDup('skip')"   style="flex:1;padding:10px;background:var(--bg2);color:var(--text);border-radius:8px;font-weight:700;border:1.5px solid var(--border);cursor:pointer;font-size:13px">❌ تجاهل الكل</button>
          <button id="dupConfirmBtn"              style="flex:1.5;padding:10px;background:linear-gradient(135deg,#10b981,#059669);color:white;border-radius:8px;font-weight:800;border:none;cursor:pointer;font-size:14px">✅ تأكيد</button>
        </div>
      </div>`;

    // ربط الأزرار
    window._dupDecisions = decisions;
    document.getElementById('dupConfirmBtn').onclick = () => {
      overlay.style.display = 'none';
      onDone(window._dupDecisions);
    };
  }

  window.setDupAction = function(i, action) {
    window._dupDecisions[i].action = action;
    renderModal();
  };
  window.applyAllDup = function(action) {
    window._dupDecisions.forEach(d => d.action = action);
    renderModal();
  };

  overlay.style.display = 'flex';
  renderModal();

  // CSS للنافذة
  if (!document.getElementById('dupModalCSS')) {
    const style = document.createElement('style');
    style.id = 'dupModalCSS';
    style.textContent = `
      .dup-row{background:var(--surface2,#f8fafc);border:1.5px solid var(--border);border-radius:10px;padding:12px 14px}
      .dup-name{font-size:14px;color:var(--text);margin-bottom:4px}
      .dup-detail{font-size:12px;color:var(--text3)}
      .dup-detail code{background:var(--bg2);padding:1px 6px;border-radius:4px;font-size:11px}
      .dup-actions{display:flex;gap:8px;margin-top:10px}
      .dup-btn{flex:1;padding:7px;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;border:1.5px solid var(--border);background:var(--bg2);color:var(--text);transition:.15s}
      .dup-btn.update.active{background:rgba(16,185,129,0.12);border-color:#10b981;color:#059669}
      .dup-btn.skip.active{background:rgba(239,68,68,0.1);border-color:#ef4444;color:#dc2626}
    `;
    document.head.appendChild(style);
  }
}

/* ================================================
   STOCK VIEW SYSTEM — نظام أقسام المخزون
================================================ */

/* التنقل بين أقسام المخزون الأربعة */
function switchStockView(view, btn) {
  document.querySelectorAll('.snav-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.stock-view').forEach(v => v.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const viewEl = {
    all: 'stockViewAll',
    add: 'stockViewAdd',
    families: 'stockViewFamilies',
    import: 'stockViewImport'
  }[view];
  if (viewEl) document.getElementById(viewEl)?.classList.add('active');

  if (view === 'all')      { renderStock(); updateSVStats(); }
  if (view === 'add')      { populateStockSelects(); }
  if (view === 'families') { renderFamilyList(); updateFamCounter(); }
  if (view === 'import')   { updateIE2Stats(); }
}

/* تجاوز دالة show() الأصلية للمخزون */
/* تجاوز show() لتفعيل تنبيهات المخزون */
(function() {
  const __origShow = show;
  show = function(id) {
    __origShow(id);
    if (id === 'stock') {
      setTimeout(() => {
        const allBtn = document.getElementById('snavAll');
        switchStockView('all', allBtn);
        renderStockAlertBanner();
      }, 60);
    }
  };
})();

/* تجاوز switchStockTab القديمة */
switchStockTab = function(panel, btn) {};

/* ── إحصائيات شريط البحث ── */
function updateSVStats() {
  const el = document.getElementById('sv-stats');
  if (!el) return;
  const threshold = DB.settings.lowStockThreshold || 5;
  const total = DB.stock.length;
  const low   = DB.stock.filter(i => i.qty > 0 && i.qty <= threshold).length;
  const out   = DB.stock.filter(i => i.qty <= 0).length;
  el.innerHTML =
    `<span class="sv-stat all">📦 ${total}</span>` +
    (low ? `<span class="sv-stat low">⚠️ ${low} منخفض</span>` : '') +
    (out ? `<span class="sv-stat out">🔴 ${out} نفذ</span>` : '');
}

/* ── شريط تنبيهات المخزون العلوي ── */
function renderStockAlertBanner() {
  const banner = document.getElementById('stockAlertBanner');
  if (!banner) return;
  const threshold = DB.settings.lowStockThreshold || 5;
  const today = new Date(); today.setHours(0,0,0,0);
  const soon  = new Date(today); soon.setDate(soon.getDate() + 30);

  const out      = DB.stock.filter(i => i.qty <= 0);
  const low      = DB.stock.filter(i => i.qty > 0 && i.qty <= threshold);
  const expired  = DB.stock.filter(i => { if(!i.exp) return false; const d=new Date(i.exp); d.setHours(0,0,0,0); return d < today && i.qty > 0; });
  const expSoon  = DB.stock.filter(i => { if(!i.exp) return false; const d=new Date(i.exp); d.setHours(0,0,0,0); return d >= today && d <= soon; });

  const chips = [];
  if (out.length)     chips.push(`<span class="alert-chip chip-out">🔴 ${out.length} منتج نفذ من المخزون</span>`);
  if (low.length)     chips.push(`<span class="alert-chip chip-low">⚠️ ${low.length} منتج مخزونه منخفض</span>`);
  if (expired.length) chips.push(`<span class="alert-chip chip-exp">☠️ ${expired.length} منتج منتهي الصلاحية</span>`);
  if (expSoon.length) chips.push(`<span class="alert-chip chip-soon">⏰ ${expSoon.length} منتج ينتهي خلال 30 يوماً</span>`);

  if (chips.length) {
    banner.innerHTML = '<strong>تنبيهات المخزون:</strong> ' + chips.join('');
    banner.style.display = 'flex';
  } else {
    banner.style.display = 'none';
  }
}

/* ── عداد العائلات ── */
function updateFamCounter() {
  const el = document.getElementById('famCounter');
  if (el) el.textContent = DB.families.length;
}

/* ── إحصائيات الاستيراد/تصدير ── */
function updateIE2Stats() {
  const el = document.getElementById('ie2Count');
  if (el) el.textContent = DB.stock.length;
}

/* ── تفريغ نموذج إضافة منتج ── */
function clearStockAddForm() {
  ['barcode','size','price','costPrice','qty','exp'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const typeEl = document.getElementById('type');
  if (typeEl) typeEl.value = '';
  const unitEl = document.getElementById('unit');
  if (unitEl) unitEl.value = 'قطعة';
  updateBrandSelectByFamily();
  showToast('تم تفريغ الحقول', 'info');
}

/* ── طباعة باركود المنتج مع اسم المحل ── */
function printProductBarcode(item) {
  const shopName = DB.settings.name || 'POS DZ';
  const barcode  = item.barcode || '';
  const name     = `${item.type} ${item.brand}${item.size ? ' ' + item.size : ''}`;
  const price    = item.price ? item.price.toFixed(2) + ' ' + (DB.settings.currency || 'دج') : '';

  // رسم الباركود SVG تلقائياً بخوارزمية Code128 مبسطة
  const barsHTML = generateBarcodeSVG(barcode);

  const html = `<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8">
  <style>
    @page{size:58mm 30mm;margin:0}
    *{box-sizing:border-box;margin:0;padding:0}
    body{width:58mm;font-family:Arial,sans-serif;background:#fff;color:#000}
    .label{width:56mm;padding:2mm;text-align:center;border:0.3mm solid #ccc;margin:1mm auto}
    .shop{font-size:8pt;font-weight:900;letter-spacing:0.5px;margin-bottom:1mm;text-transform:uppercase}
    .pname{font-size:7pt;color:#333;margin-bottom:1.5mm;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
    .barcode-wrap{margin:1.5mm auto;text-align:center}
    .barcode-num{font-size:7pt;letter-spacing:1px;font-weight:700;margin-top:1mm;font-family:monospace}
    .price-row{font-size:9pt;font-weight:900;margin-top:1.5mm;color:#000}
    @media print{html,body{height:auto}}
  </style></head><body>
  <div class="label">
    <div class="shop">${shopName}</div>
    <div class="pname">${name}</div>
    <div class="barcode-wrap">${barsHTML}</div>
    <div class="barcode-num">${barcode}</div>
    <div class="price-row">${price}</div>
  </div>
  <script>window.onload=function(){window.print();}<\/script>
  </body></html>`;

  _printHtml(html);
}

/* توليد SVG باركود بسيط (خطوط عشوائية تمثيلية — للطباعة المرئية) */
function generateBarcodeSVG(text) {
  if (!text) text = '000000';
  const W = 160, H = 40;
  let bars = '';
  let x = 2;
  const charCodes = Array.from(text).map(c => c.charCodeAt(0));
  // بدء بخط عريض
  bars += `<rect x="${x}" y="0" width="3" height="${H}" fill="#000"/>`; x += 5;
  charCodes.forEach(code => {
    for (let b = 7; b >= 0; b--) {
      const bit = (code >> b) & 1;
      const w = bit ? 3 : 1;
      bars += `<rect x="${x}" y="0" width="${w}" height="${H}" fill="#000"/>`;
      x += w + 1;
      if (x > W - 5) return;
    }
  });
  bars += `<rect x="${x}" y="0" width="3" height="${H}" fill="#000"/>`;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${bars}</svg>`;
}

/* ── استيراد ذكي مع تنبيه عند التشابه ── */
function importProductsSmartNew(input) {
  const file = input.files[0];
  if (!file) return;
  input.value = '';
  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result.replace(/^﻿/, '');
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) { showToast('الملف فارغ أو لا يحتوي على بيانات', 'error'); return; }

    const dataLines = lines.slice(1);
    const pending = []; // منتجات تحتاج تأكيد
    const toAdd   = []; // منتجات جديدة مباشرة
    let errors = 0, autoBarcodes = 0;

    dataLines.forEach((line, idx) => {
      const cols = parseCSVLine(line);
      const [famName, brandName, size, barcode, priceStr, costStr, qtyStr, unit, exp] = cols;
      if (!famName || !brandName) { errors++; return; }
      const price = parseFloat(priceStr) || 0;
      const costPrice = parseFloat(costStr) || 0;
      const qty = parseInt(qtyStr) || 0;
      const bc = barcode || ('AUTO-' + Date.now().toString(36).toUpperCase() + '-' + idx);
      if (!barcode) autoBarcodes++;

      const existing = barcode ? DB.stock.find(i => i.barcode === barcode) : null;
      if (existing) {
        pending.push({ existing, newData: { famName, brandName, size, barcode: bc, price, costPrice, qty, unit: unit || 'قطعة', exp: exp || '' } });
      } else {
        toAdd.push({ famName, brandName, size, barcode: bc, price, costPrice, qty, unit: unit || 'قطعة', exp: exp || '' });
      }
    });

    // إضافة المنتجات الجديدة مباشرة
    function finalizeImport(accepted, skipped) {
      toAdd.forEach(item => {
        let fam = DB.families.find(f => f.name === item.famName);
        if (!fam) { fam = {id: uid(), name: item.famName}; DB.families.push(fam); }
        let brand = DB.brands.find(b => b.name === item.brandName && b.familyId === fam.id);
        if (!brand) { brand = {id: uid(), name: item.brandName, familyId: fam.id}; DB.brands.push(brand); }
        DB.stock.push({ id: uid(), type: item.famName, brand: item.brandName, size: item.size || '', barcode: item.barcode, price: item.price, costPrice: item.costPrice, qty: item.qty, exp: item.exp, unit: item.unit });
      });
      accepted.forEach(item => {
        item.existing.qty += item.newData.qty;
        if (item.newData.price > 0) item.existing.price = item.newData.price;
        if (item.newData.costPrice > 0) item.existing.costPrice = item.newData.costPrice;
      });
      saveDB();
      renderStock(); populateStockSelects(); renderFamilyList(); renderBrandList();

      const added = toAdd.length + accepted.length;
      let msg = `✅ استيراد مكتمل: ${toAdd.length} مضاف، ${accepted.length} محدَّث، ${skipped} متجاهَل`;
      if (errors)       msg += ` | ${errors} أخطاء`;
      if (autoBarcodes) msg += ` | ⚠️ ${autoBarcodes} باركود تلقائي`;
      showToast(msg, errors > 0 ? 'warning' : 'success');

      // انتقال تلقائي لقسم "كل المنتجات"
      setTimeout(() => switchStockView('all', document.getElementById('snavAll')), 400);
    }

    // إذا لا يوجد تضارب — اكمل مباشرة
    if (pending.length === 0) {
      finalizeImport([], 0);
      return;
    }

    // عرض نافذة التأكيد للمنتجات المتضاربة
    showImportConflictModal(pending, function(accepted, skipped) {
      finalizeImport(accepted, skipped);
    });
  };
  reader.readAsText(file, 'UTF-8');
}

/* نافذة حل التعارض عند الاستيراد */
function showImportConflictModal(conflicts, onDone) {
  let overlay = document.getElementById('importConflictOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'importConflictOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
    document.body.appendChild(overlay);
  }

  const rows = conflicts.map((c, i) => `
    <tr style="border-bottom:1px solid var(--border)">
      <td style="padding:8px 10px;font-size:13px"><strong>${c.existing.type} ${c.existing.brand}</strong><br><code style="font-size:11px;color:var(--text3)">${c.existing.barcode}</code></td>
      <td style="padding:8px 10px;text-align:center;font-size:13px">
        مخزون حالي: <strong>${c.existing.qty}</strong><br>
        سيُضاف: <strong style="color:#10b981">+${c.newData.qty}</strong>
      </td>
      <td style="padding:8px 10px;text-align:center">
        <label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-size:13px">
          <input type="checkbox" id="conflict_${i}" checked style="width:16px;height:16px;cursor:pointer"> قبول التحديث
        </label>
      </td>
    </tr>`).join('');

  overlay.innerHTML = `
    <div style="background:var(--surface);border-radius:16px;padding:24px;max-width:560px;width:94%;max-height:88vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,0.3)">
      <div style="font-size:18px;font-weight:900;color:var(--text);margin-bottom:6px">⚠️ منتجات مشابهة موجودة</div>
      <div style="font-size:13px;color:var(--text3);margin-bottom:18px">حدد المنتجات التي تريد تحديث كميتها وسعرها</div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <thead><tr style="background:var(--bg2)">
          <th style="padding:8px 10px;text-align:right;font-size:12px">المنتج</th>
          <th style="padding:8px 10px;text-align:center;font-size:12px">الكمية</th>
          <th style="padding:8px 10px;text-align:center;font-size:12px">القرار</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="display:flex;gap:10px">
        <button id="icBtnSkipAll" style="flex:1;padding:11px;background:var(--bg2);color:var(--text);border-radius:10px;font-weight:700;font-size:14px;border:1.5px solid var(--border);cursor:pointer">تجاهل الكل</button>
        <button id="icBtnConfirm" style="flex:1;padding:11px;background:linear-gradient(135deg,#10b981,#059669);color:white;border-radius:10px;font-weight:700;font-size:14px;border:none;cursor:pointer">✅ تأكيد</button>
      </div>
    </div>`;

  overlay.style.display = 'flex';

  document.getElementById('icBtnSkipAll').onclick = () => {
    overlay.style.display = 'none';
    onDone([], conflicts.length);
  };
  document.getElementById('icBtnConfirm').onclick = () => {
    const accepted = [], skipped_count = 0;
    conflicts.forEach((c, i) => {
      if (document.getElementById(`conflict_${i}`)?.checked) accepted.push(c);
    });
    overlay.style.display = 'none';
    onDone(accepted, conflicts.length - accepted.length);
  };
}

/* ── تحديث renderStock لإضافة زر الباركود ── */
renderStock = function() {
  const stockList = document.getElementById('stockList');
  if (!stockList) return;
  stockList.innerHTML = '';
  const q = (document.getElementById('stockSearch')?.value || '').toLowerCase();
  const list = q
    ? DB.stock.filter(i => i.type.toLowerCase().includes(q) || i.brand.toLowerCase().includes(q) || i.barcode.includes(q))
    : DB.stock;

  if (!list.length) {
    stockList.innerHTML = `<li style="color:var(--text3);text-align:center;padding:24px">${t('no_stock')}</li>`;
    updateSVStats();
    return;
  }

  const threshold = DB.settings.lowStockThreshold || 5;
  const today = new Date(); today.setHours(0,0,0,0);

  // تجميع حسب العائلة ثم الماركة
  const grouped = {};
  list.forEach(item => {
    const key = `${item.type}||${item.brand}`;
    if (!grouped[key]) grouped[key] = { type: item.type, brand: item.brand, items: [] };
    grouped[key].items.push(item);
  });

  Object.values(grouped).forEach(group => {
    const header = document.createElement('li');
    header.style.cssText = 'background:var(--bg2);padding:8px 12px;font-weight:700;border-radius:6px;margin:8px 0 4px;list-style:none;font-size:13px';
    header.innerHTML = `📁 ${group.type} &nbsp;›&nbsp; 🏷️ ${group.brand}`;
    stockList.appendChild(header);

    group.items.forEach(item => {
      const realIndex = DB.stock.indexOf(item);
      const isExpired = item.exp && new Date(item.exp) < today;
      const isExpSoon = item.exp && (() => { const d=new Date(item.exp); d.setHours(0,0,0,0); const soon=new Date(today); soon.setDate(soon.getDate()+30); return d>=today&&d<=soon; })();
      const qtyColor  = item.qty <= 0 ? '#ef4444' : item.qty <= threshold ? '#f59e0b' : '#10b981';
      const qtyBadge  = item.qty <= 0
        ? `<span style="background:#fef2f2;color:#ef4444;font-size:11px;padding:1px 7px;border-radius:20px;font-weight:800;border:1px solid #fecaca">نفذ ⚠️</span>`
        : item.qty <= threshold
        ? `<span style="background:#fffbeb;color:#d97706;font-size:11px;padding:1px 7px;border-radius:20px;font-weight:800;border:1px solid #fde68a">منخفض</span>`
        : '';

      const li = document.createElement('li');
      li.style.cssText = 'padding:9px 12px;border-bottom:1px solid var(--border);list-style:none';
      li.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <div style="font-size:13px;line-height:1.6">
            ${item.size ? `<span style="color:var(--text3)">${item.size}</span> | ` : ''}
            باركود: <code style="background:var(--bg2);padding:1px 6px;border-radius:4px;font-size:12px">${item.barcode}</code>
            | السعر: <strong>${formatPrice(item.price)}</strong>
            | الكمية: <strong style="color:${qtyColor}">${item.qty} ${item.unit || ''}</strong> ${qtyBadge}
            ${isExpired ? `<span style="color:#dc2626;font-size:12px;font-weight:700"> ☠️ منتهي الصلاحية</span>` : ''}
            ${isExpSoon && !isExpired ? `<span style="color:#1d4ed8;font-size:12px;font-weight:700"> ⏰ ينتهي قريباً</span>` : ''}
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0;flex-wrap:wrap">
            <button onclick="printProductBarcode(DB.stock[${realIndex}])" class="btn-print-barcode">🏷️ باركود</button>
            <button onclick="editItem(${realIndex})" style="padding:5px 10px;font-size:13px;background:#3b82f6">${t('edit_btn')}</button>
            <button onclick="deleteItem(${realIndex})" style="padding:5px 10px;font-size:13px;background:#ef4444">${t('del_btn')}</button>
          </div>
        </div>`;
      stockList.appendChild(li);
    });
  });

  updateSVStats();
};

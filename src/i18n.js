import { format, subDays, eachDayOfInterval } from 'date-fns';
import { el } from 'date-fns/locale';

export const TRANSLATIONS = {
  el: {
    // Navigation
    nav_home: 'Αρχική',
    nav_expenses: 'Έξοδα',
    nav_add: 'Προσθήκη',
    nav_categories: 'Κατηγορίες',
    nav_budgets: 'Προϋπολογισμοί',
    nav_insights: 'Στατιστικά',
    nav_plan: 'Αποταμίευση',
    nav_story: 'Ανασκόπηση',
    nav_reminders: 'Υπενθυμίσεις',
    nav_reset: 'Επαναφορά',
    nav_more: 'Περισσότερα',
    nav_my_wallet: 'Το Πορτοφόλι μου',
    nav_wallet_of: 'Πορτοφόλι: {name}',

    // Common Actions
    save: 'Αποθήκευση',
    cancel: 'Ακύρωση',
    delete: 'Διαγραφή',
    edit: 'Επεξεργασία',
    close: 'Κλείσιμο',
    confirm: 'Επιβεβαίωση',
    undo: 'Αναίρεση',
    all: 'Όλα',
    total: 'Σύνολο',
    live: 'Ενεργό',
    optional: 'Προαιρετικό',
    search: 'Αναζήτηση...',
    today: 'Σήμερα',
    yesterday: 'Χθες',
    days_ago: 'πριν {n} ημέρες',
    lang_name: 'Ελληνικά',

    // Dashboard Header
    greeting: 'Γεια σου, {name}',
    dashboard_title: 'Αρχική',
    month_overview: 'Επισκόπηση {month}',
    payday_checkin_btn: 'Πληρώθηκες;',
    alerts_btn: 'Ειδοποιήσεις',
    reset_btn: 'Επαναφορά',
    add_expense_btn: 'Νέο Έξοδο',

    // Stat Cards
    current_balance: 'Τρέχον Υπόλοιπο',
    tap_to_adjust: 'Πάτησε για προσαρμογή',
    total_monthly_spending: 'Μηνιαία Έξοδα',
    updated_today: 'Ενημερώθηκε σήμερα',
    monthly_income: 'Μηνιαία Έσοδα',
    tap_to_manage_sources: 'Πηγές εσόδων',
    spent_this_week: 'Έξοδα Εβδομάδας',
    past_7_days: 'Τελευταίες 7 ημέρες',

    // Streak Feature
    streak_badge_start: 'Ξεκίνα Σερί',
    streak_badge_count: 'Σερί {count} Ημερών',
    streak_banner_keep: 'Κράτα το σερί {count} ημερών ζωντανό!',
    streak_banner_start: 'Ξεκίνα το ημερήσιο σερί σου σήμερα',
    streak_banner_tap: 'Πάτησε μια συντόμευση παρακάτω για να καταγράψεις τα σημερινά έξοδα ✨',
    streak_banner_gentle: 'Χρειάζονται 5 δευτερόλεπτα. Χωρίς άγχος, χωρίς τύψεις.',
    streak_banner_view: 'Δες το Σερί →',

    // Streak Modal
    streak_modal_title: 'Ημερήσιο Σερί Καταγραφής',
    streak_modal_sub: 'Χτίσε μια συνήθεια χωρίς άγχος',
    streak_ready_day1: 'Έτοιμος για την 1η Μέρα!',
    streak_days_count: '{count} Ημέρες',
    streak_safe_msg: 'Μπράβο! Κατέγραψες τα έξοδά σου για σήμερα. Το σερί σου είναι ενεργό!',
    streak_pending_msg: 'Κράτα τη φλόγα αναμμένη! Κατάγραψε τα σημερινά σου έξοδα για να φτάσεις τις {count} ημέρες.',
    streak_start_msg: 'Κατάγραψε ένα έξοδο σήμερα για να ξεκινήσεις το ημερήσιο σερί σου.',
    streak_completed_today: 'Ολοκληρώθηκε Σήμερα',
    streak_pending_today: 'Σε Αναμονή Σήμερα',
    streak_current: 'Τρέχον',
    streak_best: 'Ρεκόρ',
    streak_this_month: 'Αυτόν τον μήνα',
    streak_philosophy_title: 'Ήρεμη συνήθεια χωρίς άγχος',
    streak_philosophy_desc: 'Έχασες μια μέρα; Κανένα πρόβλημα, συμβαίνει σε όλους! Δεν υπάρχει καμία ποινή ούτε τύψεις. Χρησιμοποίησε τη Γρήγορη Καταχώρηση για να περάσεις έναν καφέ ή φαγητό σε 1 δευτερόλεπτο.',
    streak_action_log: '+ Καταχώρηση Εξόδου Σήμερα',
    streak_action_keep: 'Συνέχισε έτσι! ✨',

    // Streak Celebration Modal
    streak_celeb_levelup: 'Νέο Επίπεδο Συνήθειας!',
    streak_celeb_day1_title: 'Ξεκίνησε το Σερί 1ης Μέρας!',
    streak_celeb_days_title: 'Σερί {count} Ημερών!',
    streak_celeb_day1_desc: 'Μπράβο που κατέγραψες τα σημερινά σου έξοδα! Η τακτική καταγραφή κάνει τον έλεγχο των χρημάτων πανεύκολο.',
    streak_celeb_days_desc: 'Είσαι σε τρομερή πορεία! Καταγράφεις τα έξοδά σου για {count} συνεχόμενες ημέρες.',
    streak_celeb_btn: 'Τέλεια! Συνεχίζουμε',

    // 1-Tap Quick Add
    quick_add_title: 'Γρήγορη Καταχώρηση',
    quick_add_sub: 'Πάτησε για να καταγράψεις ένα έξοδο στη στιγμή',
    quick_add_customize: 'Προσαρμογή',
    quick_toast_title: 'Το έξοδο προστέθηκε!',
    quick_toast_balance_updated: 'Το υπόλοιπο ενημερώθηκε',
    quick_toast_undo: 'Αναίρεση',

    // Quick Add Modal
    qa_modal_title: 'Προσαρμογή Γρήγορης Καταχώρησης',
    qa_modal_sub: 'Όρισε τις αγαπημένες σου συντομεύσεις για άμεση καταγραφή',
    qa_edit_shortcut: 'Επεξεργασία Συντόμευσης',
    qa_new_shortcut: 'Νέα Συντόμευση',
    qa_label: 'Όνομα Συντόμευσης',
    qa_label_placeholder: 'π.χ. Καφές, Μεσημεριανό...',
    qa_amount: 'Προκαθορισμένο Ποσό (€)',
    qa_category: 'Κατηγορία',
    qa_tap_category: 'Πάτησε κατηγορία για αλλαγή',
    qa_choose_emoji: 'Επιλογή Εικονιδίου',
    qa_save_shortcut: 'Αποθήκευση Συντόμευσης',
    qa_active_shortcuts: 'Ενεργές Συντομεύσεις ({current}/{max})',
    qa_add_preset: '+ Προσθήκη',
    qa_reset_defaults: 'Επαναφορά Αρχικών',
    qa_save_shortcuts: 'Αποθήκευση Αλλαγών',
    qa_editing_badge: 'Επεξεργασία',
    qa_err_title: 'Συμπλήρωσε ένα σύντομο όνομα (π.χ. Καφές)',
    qa_err_amount: 'Συμπλήρωσε ένα έγκυρο ποσό μεγαλύτερο από 0',
    qa_err_max: 'Μπορείς να έχεις έως 8 συντομεύσεις.',
    qa_err_min: 'Πρέπει να κρατήσεις τουλάχιστον 1 συντόμευση.',

    // Dashboard Charts & Lists
    trend_30d_title: 'Πορεία Εξόδων 30 Ημερών',
    trend_30d_sub: 'Ημερήσια εξέλιξη εξόδων αυτόν τον μήνα',
    cat_distribution_title: 'Κατανομή ανά Κατηγορία',
    cat_distribution_sub: 'Οι μεγαλύτερες κατηγορίες εξόδων αυτόν τον μήνα',
    week_spending_title: 'Έξοδα Αυτής της Εβδομάδας',
    week_spending_sub: 'Κατανομή ανά ημέρα τις τελευταίες 7 ημέρες',
    recent_transactions_title: 'Πρόσφατα Έξοδα',
    recent_transactions_sub: 'Οι τελευταίες σου καταχωρήσεις',
    view_all_link: 'Προβολή όλων',
    no_expenses_title: 'Δεν υπάρχουν έξοδα ακόμα',
    no_expenses_desc: 'Πάτησε "+ Νέο Έξοδο" ή χρησιμοποίησε τη Γρήγορη Καταχώρηση.',

    // Expenses Page
    expenses_title: 'Όλα τα Έξοδα',
    expenses_sub: 'Ιστορικό συναλλαγών, αναζήτηση και φίλτρα',
    search_placeholder: 'Αναζήτηση εξόδων (π.χ. σουπερμάρκετ, βενζίνη)...',
    all_categories: 'Όλες οι Κατηγορίες',
    all_time: 'Όλες οι Ημερομηνίες',
    this_month: 'Αυτόν τον Μήνα',
    this_week: 'Αυτή την Εβδομάδα',
    export_csv: 'Εξαγωγή σε CSV',
    no_results_found: 'Δεν βρέθηκαν έξοδα με αυτά τα κριτήρια',

    // Add Expense Page
    add_page_title: 'Νέο Έξοδο',
    add_page_sub: 'Κατάγραψε ένα έξοδο εύκολα σε λίγα δευτερόλεπτα',
    field_description: 'Περιγραφή',
    field_desc_placeholder: 'π.χ. Σούπερ Μάρκετ, Καφές, Βενζίνη...',
    field_amount: 'Ποσό (€)',
    field_category: 'Κατηγορία',
    field_date: 'Ημερομηνία',
    field_notes: 'Σημειώσεις (Προαιρετικό)',
    field_notes_placeholder: 'Πρόσθετες λεπτομέρειες ή κατάστημα...',
    field_recurring: 'Μηνιαίο / Τακτικό Έξοδο',
    field_recurring_sub: 'Επαναλαμβάνεται κάθε μήνα (π.χ. ενοίκιο, συνδρομή)',
    btn_save_expense: 'Αποθήκευση Εξόδου',
    toast_expense_saved: 'Το έξοδο αποθηκεύτηκε επιτυχώς!',

    // Categories Page
    cat_page_title: 'Διαχείριση Κατηγοριών',
    cat_page_sub: 'Προσάρμοσε τις κατηγορίες σου και οργάνωσέ τες σε ομάδες',
    cat_add_btn: 'Νέα Κατηγορία',
    cat_manage_groups: 'Διαχείριση Ομάδων',
    cat_edit_title: 'Επεξεργασία Κατηγορίας',
    cat_new_title: 'Νέα Κατηγορία',
    cat_name_label: 'Όνομα Κατηγορίας',
    cat_group_label: 'Ομάδα',
    cat_icon_label: 'Επιλογή Εικονιδίου',
    cat_color_label: 'Επιλογή Χρώματος',

    // Budgets Page
    budgets_page_title: 'Μηνιαίοι Προϋπολογισμοί',
    budgets_page_sub: 'Βάλε όρια εξόδων για να παραμένεις εντός πλάνου',
    budget_add_btn: 'Νέο Όριο',
    budget_limit: 'Όριο',
    budget_spent: 'Ξοδεύτηκαν',
    budget_remaining: 'Απομένουν',
    budget_over: 'Υπέρβαση ορίου',

    // Insights Page
    insights_page_title: 'Στατιστικά Εξόδων',
    insights_page_sub: 'Ανάλυση και συνήθειες εξόδων',

    // Saving Plan Page
    plan_page_title: 'Πλάνο Αποταμίευσης',
    plan_page_sub: 'Βάλε στόχους και δες τις οικονομίες σου να μεγαλώνουν',

    // Monthly Story Page
    story_page_title: 'Μηνιαία Ανασκόπηση',
    story_page_sub: 'Η οικονομική σου ιστορία σε απλή σύνοψη',

    // Notification Modal
    notif_modal_title: 'Υπενθυμίσεις & Ειδοποιήσεις',
    notif_modal_sub: 'Ρύθμισε ειδοποιήσεις για να μην ξεχνάς να καταγράφεις',
    notif_daily_reminder: 'Καθημερινή Υπενθύμιση Εξόδων',
    notif_daily_sub: 'Ευγενική υπενθύμιση το βράδυ για να καταγράψεις τα έξοδα της ημέρας',
    notif_time_label: 'Ώρα Υπενθύμισης',
    notif_payday: 'Ειδοποίηση Ημέρας Πληρωμής',
    notif_payday_sub: 'Ειδοποίηση για έλεγχο και καταγραφή της πληρωμής σου',
    notif_save: 'Αποθήκευση Ρυθμίσεων',

    // Adjust Balance Modal
    balance_modal_title: 'Προσαρμογή Τρέχοντος Υπολοίπου',
    balance_modal_sub: 'Ενημέρωσε το ποσό ώστε να ταιριάζει με την τράπεζα ή τα μετρητά σου',
    balance_amount_label: 'Ποσό Υπολοίπου (€)',
    balance_save_btn: 'Αποθήκευση Υπολοίπου',

    // Income Sources Modal
    income_modal_title: 'Πηγές Εσόδων',
    income_modal_sub: 'Διαχείριση μισθών και τακτικών εσόδων',
    income_monthly_total: 'Συνολικό Μηνιαίο Εισόδημα',
    income_add_btn: 'Νέα Πηγή Εσόδου',

    // Payday Prompt Modal
    payday_prompt_title: 'Ημέρα Πληρωμής 🎉',
    payday_prompt_question: 'Μπήκε η αναμενόμενη πληρωμή σου σήμερα;',
    payday_prompt_yes: 'Ναι, Προσθήκη στο Υπόλοιπο',
    payday_prompt_no: 'Όχι Ακόμα',

    // Reset Modal
    reset_modal_title: 'Επαναφορά Δεδομένων',
    reset_modal_sub: 'Επαναφορά δοκιμαστικών δεδομένων ή πλήρης καθαρισμός',
    reset_demo_btn: 'Επαναφορά Δοκιμαστικών',
    reset_clear_btn: 'Πλήρης Διαγραφή Όλων',

    // Onboarding
    onboarding_welcome: 'Καλωσόρισες στο Spendy!',
    onboarding_sub: 'Ας ρυθμίσουμε το πορτοφόλι σου σε 5 απλά βήματα.',
    onboarding_step1_title: 'Πώς θέλεις να σε λέμε;',
    onboarding_step1_placeholder: 'Το όνομά σου',
    onboarding_step2_title: 'Πόσα χρήματα έχεις τώρα;',
    onboarding_step2_sub: 'Γράψε το ποσό που έχεις αυτή τη στιγμή σε κάρτες και μετρητά',
    onboarding_step3_title: 'Κάθε πότε πληρώνεσαι;',
    onboarding_schedule_twice: 'Κάθε 15 ημέρες (2 φορές το μήνα)',
    onboarding_schedule_monthly: 'Μία φορά το μήνα',
    onboarding_schedule_weekly: 'Κάθε εβδομάδα',
    onboarding_step4_title: 'Πόσα περίπου πληρώνεσαι;',
    onboarding_step5_title: 'Μείνε ενήμερος με υπενθυμίσεις',
    onboarding_start_btn: 'Έναρξη!',

    // Language Toggle
    language_label: 'Γλώσσα',
    language_switch_to: 'Switch to English',
  },

  en: {
    // Navigation
    nav_home: 'Dashboard',
    nav_expenses: 'Expenses',
    nav_add: 'Add Expense',
    nav_categories: 'Categories',
    nav_budgets: 'Budgets',
    nav_insights: 'Insights',
    nav_plan: 'Saving Plan',
    nav_story: 'Monthly Story',
    nav_reminders: 'Reminders',
    nav_reset: 'Reset Data',
    nav_more: 'More',
    nav_my_wallet: 'My Wallet',
    nav_wallet_of: "{name}'s Wallet",

    // Common Actions
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    confirm: 'Confirm',
    undo: 'Undo',
    all: 'All',
    total: 'Total',
    live: 'Live',
    optional: 'Optional',
    search: 'Search...',
    today: 'Today',
    yesterday: 'Yesterday',
    days_ago: '{n} days ago',
    lang_name: 'English',

    // Dashboard Header
    greeting: 'Hi, {name}',
    dashboard_title: 'Dashboard',
    month_overview: '{month} overview',
    payday_checkin_btn: 'Payday Check-In',
    alerts_btn: 'Alerts',
    reset_btn: 'Reset',
    add_expense_btn: 'Add Expense',

    // Stat Cards
    current_balance: 'Current Balance',
    tap_to_adjust: 'Tap to adjust funds',
    total_monthly_spending: 'Total Monthly Spending',
    updated_today: 'Updated today',
    monthly_income: 'Monthly Income',
    tap_to_manage_sources: 'Tap to manage sources',
    spent_this_week: 'Spent This Week',
    past_7_days: 'Past 7 days',

    // Streak Feature
    streak_badge_start: 'Start Streak',
    streak_badge_count: '{count}-Day Streak',
    streak_banner_keep: 'Keep your {count}-day streak alive!',
    streak_banner_start: 'Start your gentle daily streak today',
    streak_banner_tap: "Tap a quick shortcut below to log today's spending ✨",
    streak_banner_gentle: 'Takes 5 seconds. No stress, no guilt, just gentle awareness.',
    streak_banner_view: 'View Streak →',

    // Streak Modal
    streak_modal_title: 'Daily Tracking Streak',
    streak_modal_sub: 'Build a stress-free money habit',
    streak_ready_day1: 'Ready for Day 1!',
    streak_days_count: '{count} Days',
    streak_safe_msg: "Awesome job! You've logged your spending today. Your streak is safe and active!",
    streak_pending_msg: "Keep the flame burning! Log today's spending to extend your streak to {count} days.",
    streak_start_msg: 'Log today to start your daily streak and build financial control.',
    streak_completed_today: 'Completed Today',
    streak_pending_today: 'Pending Today',
    streak_current: 'Current',
    streak_best: 'Best',
    streak_this_month: 'This Month',
    streak_philosophy_title: 'Gentle & Stress-Free Habit',
    streak_philosophy_desc: 'Missed a day? No worries, life happens! There are no penalties or guilt. Use the 1-Tap Quick Add buttons on your home screen to log coffee or lunch in 1 second.',
    streak_action_log: '+ Log an Expense Today',
    streak_action_keep: 'Keep It Up! ✨',

    // Streak Celebration Modal
    streak_celeb_levelup: 'Habit Level Up!',
    streak_celeb_day1_title: 'Day 1 Streak Started!',
    streak_celeb_days_title: '{count}-Day Streak!',
    streak_celeb_day1_desc: "Great job logging today's spending! Consistent tracking makes staying on budget effortless.",
    streak_celeb_days_desc: "You're on fire! You have logged your expenses for {count} consecutive days.",
    streak_celeb_btn: 'Awesome! Keep Going',

    // 1-Tap Quick Add
    quick_add_title: '1-Tap Quick Add',
    quick_add_sub: 'Tap any shortcut to log an expense instantly',
    quick_add_customize: 'Customize',
    quick_toast_title: '1-Tap Expense Added!',
    quick_toast_balance_updated: 'Balance updated',
    quick_toast_undo: 'Undo',

    // Quick Add Modal
    qa_modal_title: 'Customize 1-Tap Quick Add',
    qa_modal_sub: 'Set your go-to shortcuts for instant logging',
    qa_edit_shortcut: 'Edit Shortcut',
    qa_new_shortcut: 'New Shortcut',
    qa_label: 'Shortcut Label',
    qa_label_placeholder: 'e.g. Coffee, Lunch...',
    qa_amount: 'Preset Amount (€)',
    qa_category: 'Assigned Category',
    qa_tap_category: 'Tap category to switch',
    qa_choose_emoji: 'Choose Emoji Icon',
    qa_save_shortcut: 'Save Shortcut',
    qa_active_shortcuts: 'Active Shortcuts ({current}/{max})',
    qa_add_preset: '+ Add Preset',
    qa_reset_defaults: 'Reset Defaults',
    qa_save_shortcuts: 'Save Shortcuts',
    qa_editing_badge: 'Editing',
    qa_err_title: 'Please provide a short title (e.g. Coffee)',
    qa_err_amount: 'Please provide a valid amount greater than 0',
    qa_err_max: 'You can have at most 8 quick presets.',
    qa_err_min: 'You must keep at least 1 quick preset.',

    // Dashboard Charts & Lists
    trend_30d_title: '30-Day Spending Trend',
    trend_30d_sub: 'Daily expense trajectory this past month',
    cat_distribution_title: 'Category Distribution',
    cat_distribution_sub: 'Top categories this month',
    week_spending_title: "This Week's Spending",
    week_spending_sub: 'Daily distribution over the last 7 days',
    recent_transactions_title: 'Recent Transactions',
    recent_transactions_sub: 'Your latest logged expenses',
    view_all_link: 'View all',
    no_expenses_title: 'No expenses yet',
    no_expenses_desc: 'Tap "+ Add Expense" or use 1-Tap Quick Add above.',

    // Expenses Page
    expenses_title: 'All Expenses',
    expenses_sub: 'Transaction history, search and filters',
    search_placeholder: 'Search expenses (e.g. supermarket, gas)...',
    all_categories: 'All Categories',
    all_time: 'All Time',
    this_month: 'This Month',
    this_week: 'This Week',
    export_csv: 'Export CSV',
    no_results_found: 'No expenses found matching filters',

    // Add Expense Page
    add_page_title: 'Add Expense',
    add_page_sub: 'Record an expense easily in a few seconds',
    field_description: 'Description',
    field_desc_placeholder: 'e.g. Groceries, Coffee, Gas...',
    field_amount: 'Amount (€)',
    field_category: 'Category',
    field_date: 'Date',
    field_notes: 'Notes (Optional)',
    field_notes_placeholder: 'Additional details or merchant...',
    field_recurring: 'Recurring Monthly Expense',
    field_recurring_sub: 'Repeats every month (e.g. rent, subscription)',
    btn_save_expense: 'Save Expense',
    toast_expense_saved: 'Expense Saved Successfully!',

    // Categories Page
    cat_page_title: 'Manage Categories',
    cat_page_sub: 'Customize your spending categories and organize them into groups',
    cat_add_btn: 'Add Category',
    cat_manage_groups: 'Manage Groups',
    cat_edit_title: 'Edit Category',
    cat_new_title: 'New Category',
    cat_name_label: 'Category Name',
    cat_group_label: 'Group',
    cat_icon_label: 'Choose Icon',
    cat_color_label: 'Choose Color',

    // Budgets Page
    budgets_page_title: 'Monthly Budgets',
    budgets_page_sub: 'Set spending limits to stay on track',
    budget_add_btn: 'Create Budget',
    budget_limit: 'Limit',
    budget_spent: 'Spent',
    budget_remaining: 'Remaining',
    budget_over: 'Over budget',

    // Insights Page
    insights_page_title: 'Spending Insights',
    insights_page_sub: 'Analytics and spending patterns',

    // Saving Plan Page
    plan_page_title: 'Saving Plan',
    plan_page_sub: 'Set goals and grow your savings',

    // Monthly Story Page
    story_page_title: 'Monthly Story',
    story_page_sub: 'Your financial summary at a glance',

    // Notification Modal
    notif_modal_title: 'Reminders & Notifications',
    notif_modal_sub: 'Set reminders so you never forget to log',
    notif_daily_reminder: 'Daily Expense Reminder',
    notif_daily_sub: 'Gentle evening reminder to log your daily spending',
    notif_time_label: 'Reminder Time',
    notif_payday: 'Payday Notification',
    notif_payday_sub: 'Notification to check and log your paycheck',
    notif_save: 'Save Settings',

    // Adjust Balance Modal
    balance_modal_title: 'Adjust Current Balance',
    balance_modal_sub: 'Update your balance to match your bank account or cash',
    balance_amount_label: 'Current Balance Amount (€)',
    balance_save_btn: 'Save Balance',

    // Income Sources Modal
    income_modal_title: 'Income Sources',
    income_modal_sub: 'Manage paychecks and recurring income',
    income_monthly_total: 'Total Monthly Income',
    income_add_btn: 'Add Income Source',

    // Payday Prompt Modal
    payday_prompt_title: 'Payday Check-In 🎉',
    payday_prompt_question: 'Did you receive your expected paycheck today?',
    payday_prompt_yes: 'Yes, Add to Balance',
    payday_prompt_no: 'Not Yet',

    // Reset Modal
    reset_modal_title: 'Reset Data',
    reset_modal_sub: 'Reset demo data or completely clear everything',
    reset_demo_btn: 'Reset Demo Data',
    reset_clear_btn: 'Clear All Data',

    // Onboarding
    onboarding_welcome: 'Welcome to Spendy!',
    onboarding_sub: "Let's personalize your wallet in 5 quick steps.",
    onboarding_step1_title: 'What should we call you?',
    onboarding_step1_placeholder: 'Your name or nickname',
    onboarding_step2_title: 'How much money do you have right now?',
    onboarding_step2_sub: 'Enter the money currently in your wallet & accounts',
    onboarding_step3_title: 'How often do you get paid?',
    onboarding_schedule_twice: 'Twice a month (Every 15 days)',
    onboarding_schedule_monthly: 'Once a month',
    onboarding_schedule_weekly: 'Weekly',
    onboarding_step4_title: 'Typical Paycheck Amount',
    onboarding_step5_title: 'Stay on Track with Reminders',
    onboarding_start_btn: 'Start Budgeting',

    // Language Toggle
    language_label: 'Language',
    language_switch_to: 'Αλλαγή σε Ελληνικά',
  },
};

// ─── Localized Category Names ──────────────────────────────────────────────────
export const CATEGORY_TRANSLATIONS = {
  el: {
    food: 'Φαγητό & Καφές',
    transport: 'Μετακίνηση & Καύσιμα',
    housing: 'Σπίτι & Ενοίκιο',
    utilities: 'Λογαριασμοί & Ρεύμα',
    health: 'Υγεία & Φαρμακείο',
    shopping: 'Ψώνια & Αγορές',
    entertainment: 'Διασκέδαση & Έξοδοι',
    fitness: 'Γυμναστήριο & Σπορ',
    education: 'Εκπαίδευση & Βιβλία',
    subscriptions: 'Συνδρομές',
    travel: 'Ταξίδια & Διακοπές',
    savings: 'Αποταμίευση',
    investment: 'Επενδύσεις',
    other: 'Άλλα',
  },
  en: {
    food: 'Food & Dining',
    transport: 'Transport',
    housing: 'Housing',
    utilities: 'Utilities',
    health: 'Health',
    shopping: 'Shopping',
    entertainment: 'Entertainment',
    fitness: 'Fitness',
    education: 'Education',
    subscriptions: 'Subscriptions',
    travel: 'Travel',
    savings: 'Savings',
    investment: 'Investment',
    other: 'Other',
  },
};

// ─── Localized Category Groups ────────────────────────────────────────────────
export const GROUP_TRANSLATIONS = {
  el: {
    Essentials: 'Βασικά Έξοδα',
    Lifestyle: 'Τρόπος Ζωής',
    Subscriptions: 'Συνδρομές',
    Finance: 'Οικονομικά',
    Other: 'Άλλα',
  },
  en: {
    Essentials: 'Essentials',
    Lifestyle: 'Lifestyle',
    Subscriptions: 'Subscriptions',
    Finance: 'Finance',
    Other: 'Other',
  },
};

// ─── Localized Default Quick Presets ──────────────────────────────────────────
export const QUICK_PRESET_TRANSLATIONS = {
  el: {
    'qp-coffee': 'Καφές',
    'qp-lunch': 'Μεσημεριανό',
    'qp-gas': 'Βενζίνη',
  },
  en: {
    'qp-coffee': 'Coffee',
    'qp-lunch': 'Lunch',
    'qp-gas': 'Gas',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function t(key, lang = 'el', params = {}) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.el;
  let text = dict[key] || TRANSLATIONS.en[key] || key;
  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    });
  }
  return text;
}

export function getCategoryName(category, lang = 'el') {
  if (!category) return '';
  const id = typeof category === 'string' ? category : category.id;
  const originalName = typeof category === 'object' ? category.name : category;
  const dict = CATEGORY_TRANSLATIONS[lang] || CATEGORY_TRANSLATIONS.el;
  return dict[id] || originalName || id;
}

export function getGroupName(groupName, lang = 'el') {
  if (!groupName) return '';
  const dict = GROUP_TRANSLATIONS[lang] || GROUP_TRANSLATIONS.el;
  return dict[groupName] || groupName;
}

export function getPresetTitle(preset, lang = 'el') {
  if (!preset) return '';
  const dict = QUICK_PRESET_TRANSLATIONS[lang] || QUICK_PRESET_TRANSLATIONS.el;
  return dict[preset.id] || preset.title;
}

export function formatLocalizedMonth(date = new Date(), lang = 'el') {
  try {
    if (lang === 'el') {
      return format(date, 'MMMM yyyy', { locale: el });
    }
    return format(date, 'MMMM yyyy');
  } catch {
    return format(date, 'MMMM yyyy');
  }
}

export function formatLocalizedDayName(date = new Date(), lang = 'el') {
  try {
    if (lang === 'el') {
      return format(date, 'EEE', { locale: el });
    }
    return format(date, 'EEE');
  } catch {
    return format(date, 'EEE');
  }
}

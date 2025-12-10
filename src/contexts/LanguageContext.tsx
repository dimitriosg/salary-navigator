import { createContext, useContext, useState } from 'react';

type Language = 'el' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  el: {
    'app.title': 'Υπολογιστής Μισθού',
    'app.subtitle': 'Υπολογίστε τον καθαρό μισθό σας, τις εισφορές σας και προετοιμάστε τη φορολογική σας δήλωση',
    'tabs.calculator': 'Μισθοδοσία',
    'tabs.calculator.short': 'Μισθ.',
    'tabs.employer': 'Εργοδότης',
    'tabs.employer.short': 'Εργοδ.',
    'tabs.yearly': 'Ετήσια',
    'footer.disclaimer': 'Οι υπολογισμοί βασίζονται στα φορολογικά δεδομένα του 2025. Για επίσημη χρήση συμβουλευτείτε λογιστή.',

    // Navigation
    'nav.title': 'Μενού εργαλείων',
    'nav.subtitle': 'Γρήγορη πρόσβαση σε όλους τους υπολογισμούς',
    'nav.payroll': 'Μισθοδοσία',
    'nav.payrollDesc': 'Μικτά και καθαρά δίπλα-δίπλα',
    'nav.yearly': 'Ετήσια σύνοψη',
    'nav.yearlyDesc': 'Προβλέψτε τη φορολογική δήλωση',
    'nav.employer': 'Κόστος εργοδότη',
    'nav.employerDesc': 'Συνολικό κόστος και εισφορές',
    'nav.easter': 'Δώρο Πάσχα',
    'nav.easterDesc': 'Υπολογισμός εποχικού δώρου',
    'nav.christmas': 'Δώρο Χριστουγέννων',
    'nav.christmasDesc': 'Μικτά και καθαρά για το δώρο',
    'nav.vacation': 'Επίδομα άδειας',
    'nav.vacationDesc': 'Αποδοχές καλοκαιρινής άδειας',
    'nav.severance': 'Αποζημίωση απόλυσης',
    'nav.severanceDesc': 'Εκτίμηση αποζημίωσης βάσει προϋπηρεσίας',
    
    // Calculator
    'calc.title': 'Μισθοδοσία',
    'calc.description': 'Υπολογίστε μικτά και καθαρά σε πραγματικό χρόνο',
    'calc.grossToNet': 'Μικτά → Καθαρά',
    'calc.netToGross': 'Καθαρά → Μικτά',
    'calc.grossSalary': 'Μηνιαίος Μικτός Μισθός (€)',
    'calc.netSalary': 'Επιθυμητός Καθαρός Μισθός (€)',
    'calc.children': 'Αριθμός Τέκνων',
    'calc.noChildren': 'Χωρίς τέκνα',
    'calc.child': 'τέκνο',
    'calc.children.plural': 'τέκνα',
    'calc.calculateNet': 'Υπολογισμός Καθαρού',
    'calc.calculateGross': 'Υπολογισμός Μικτού',
    'calc.gross': 'Μικτός Μισθός',
    'calc.net': 'Καθαρός Μισθός',
    'calc.breakdown': 'Ανάλυση Κρατήσεων',
    'calc.efka': 'ΕΦΚΑ Εργαζομένου (13.37%)',
    'calc.incomeTax': 'Φόρος Εισοδήματος',
    'calc.solidarity': 'Εισφορά Αλληλεγγύης',
    'calc.totalDeductions': 'Συνολικές Κρατήσεις',
    'calc.note14': '* Υπολογισμοί βάσει 14 μισθών (12 + Δώρα)',
    'calc.noteSolidarity': '* Εισφορά Αλληλεγγύης: Αναστολή για 2025',

    // Bonuses
    'bonus.monthlyGross': 'Μηνιαίος μικτός μισθός (€)',
    'bonus.monthsWorked': 'Μήνες εργασίας (τρέχον έτος)',
    'bonus.monthsHint': 'Ρυθμίστε τους μήνες για να προσαρμοστεί το ποσό του δώρου.',
    'bonus.calculate': 'Υπολογισμός ποσού',
    'bonus.gross': 'Μικτό ποσό',
    'bonus.net': 'Καθαρό ποσό',
    'bonus.note': '* Απλή εκτίμηση με βάση τις κρατήσεις ενός μηνιαίου ποσού.',
    'bonus.easter.title': 'Δώρο Πάσχα',
    'bonus.easter.description': 'Υπολογίστε γρήγορα το δώρο Πάσχα σε μικτά και καθαρά.',
    'bonus.christmas.title': 'Δώρο Χριστουγέννων',
    'bonus.christmas.description': 'Εκτίμηση για την πληρωμή του δώρου Χριστουγέννων.',
    'bonus.vacation.title': 'Επίδομα άδειας',
    'bonus.vacation.description': 'Υπολογισμός του επιδόματος καλοκαιρινής άδειας.',

    // Severance
    'severance.title': 'Αποζημίωση Απόλυσης',
    'severance.description': 'Απλή εκτίμηση με βάση τον μηνιαίο μισθό και την προϋπηρεσία.',
    'severance.monthlyGross': 'Μηνιαίος μικτός μισθός (€)',
    'severance.years': 'Χρόνια προϋπηρεσίας',
    'severance.hint': 'Χρησιμοποιείται απλή αναλογία 0,5 μισθού ανά έτος με ελάχιστο 1 μισθό.',
    'severance.calculate': 'Υπολογισμός αποζημίωσης',
    'severance.note': '* Το αποτέλεσμα είναι ενδεικτικό και δεν αντικαθιστά νομική συμβουλή.',
    
    // Employer
    'employer.title': 'Κόστος Εργοδότη',
    'employer.description': 'Υπολογίστε το συνολικό κόστος για τον εργοδότη ανά εργαζόμενο',
    'employer.calculate': 'Υπολογισμός',
    'employer.totalCost': 'Κόστος Εργοδότη',
    'employer.netToEmployee': 'Καθαρά στον Εργαζόμενο',
    'employer.breakdownTitle': 'Ανάλυση Εισφορών',
    'employer.efkaEmployee': 'ΕΦΚΑ Εργαζομένου (13.37%)',
    'employer.efkaEmployer': 'ΕΦΚΑ Εργοδότη (21.79%)',
    'employer.comparison': 'Σύγκριση',
    'employer.totalContributions': 'Συνολικές Εισφορές',
    'employer.costPercent': '% Κόστους σε Εισφορές',
    'employer.netPercent': '% Κόστους σε Καθαρά',
    'employer.noteEmployer': '* Εργοδοτικές εισφορές ΕΦΚΑ: 21.79%',

    // Yearly
    'yearly.title': 'Ετήσια Σύνοψη',
    'yearly.description': 'Καταχωρήστε τους μισθούς σας για πρόβλεψη φορολογικής δήλωσης',
    'yearly.month': 'Μήνας',
    'yearly.grossSalary': 'Μικτός Μισθός (€)',
    'yearly.children.short': 'Τέκνα',
    'yearly.without': 'Χωρίς',
    'yearly.add': 'Προσθήκη',
    'yearly.sameYear': 'Ίδιος μισθός όλη τη χρονιά',
    'yearly.registered': 'Καταχωρημένοι Μισθοί',
    'yearly.editHint': '(κλικ στο μολύβι για επεξεργασία)',
    'yearly.yearlyGross': 'Ετήσια Μικτά',
    'yearly.yearlyNet': 'Ετήσια Καθαρά',
    'yearly.taxDeclaration': 'Στοιχεία για Φορολογική Δήλωση',
    'yearly.efkaEmployee': 'ΕΦΚΑ Εργαζομένου',
    'yearly.incomeTax': 'Φόρος Εισοδήματος',
    'yearly.solidarity': 'Εισφορά Αλληλεγγύης',
    'yearly.totalDeductions': 'Συνολικές Κρατήσεις',
    'yearly.prediction': 'Πρόβλεψη Φορολογικής Δήλωσης',
    'yearly.predictionText': 'Με βάση τις εισφορές που έχετε πληρώσει, το φορολογητέο εισόδημά σας είναι',
    'yearly.withheldTax': 'Ο παρακρατηθείς φόρος είναι',
    'yearly.comparison': 'Σύγκριση με Σταθερό Μισθό',
    'yearly.standardSalary': 'Σταθερός Μισθός (χωρίς μπόνους)',
    'yearly.actualSalary': 'Πραγματικές Αποδοχές',
    'yearly.difference': 'Διαφορά (Επιπλέον Φόροι)',
    'yearly.extraGross': 'Επιπλέον Μικτά',
    'yearly.extraTax': 'Επιπλέον Φόρος',
    'yearly.noBonus': 'Αν δεν είχατε λάβει κανένα μπόνους, θα είχατε πληρώσει λιγότερο φόρο κατά',
    'yearly.refundIntro':
      'Επιπλέον, με βάση τον σταθερό μισθό σας χωρίς μπόνους και σε σύγκριση με τις πραγματικές σας αποδοχές, προκύπτει διαφορά εισπραχθέντων φόρων ύψους',
    'yearly.refundLikely':
      'η οποία πιθανότατα θα εμφανιστεί ως επιστροφή φόρου στην επόμενη φορολογική σας δήλωση.',
    'yearly.refundDisclaimer':
      '* Οι παραπάνω υπολογισμοί είναι ενδεικτικοί και δεν αποτελούν φορολογική ή λογιστική συμβουλή. Επιβεβαιώστε τα τελικά ποσά με τον λογιστή σας.',

    // Common
    'common.yes': 'Ναι',
    'common.no': 'Όχι',
  },
  en: {
    // App
    'app.title': 'Salary Calculator',
    'app.subtitle': 'Calculate your net salary, contributions and prepare your tax return',
    'tabs.calculator': 'Payroll',
    'tabs.calculator.short': 'Payroll',
    'tabs.employer': 'Employer',
    'tabs.employer.short': 'Empl.',
    'tabs.yearly': 'Yearly',
    'footer.disclaimer': 'Calculations are based on 2025 tax data. For official use, consult an accountant.',

    // Navigation
    'nav.title': 'Tools menu',
    'nav.subtitle': 'Quick access to every calculator',
    'nav.payroll': 'Payroll',
    'nav.payrollDesc': 'Gross and net side by side',
    'nav.yearly': 'Yearly summary',
    'nav.yearlyDesc': 'Predict your tax return',
    'nav.employer': 'Employer cost',
    'nav.employerDesc': 'Total cost and contributions',
    'nav.easter': 'Easter bonus',
    'nav.easterDesc': 'Seasonal bonus estimation',
    'nav.christmas': 'Christmas bonus',
    'nav.christmasDesc': 'Gross and net for the holiday gift',
    'nav.vacation': 'Vacation allowance',
    'nav.vacationDesc': 'Summer leave allowance',
    'nav.severance': 'Severance',
    'nav.severanceDesc': 'Estimate based on service years',
    
    // Calculator
    'calc.title': 'Payroll',
    'calc.description': 'Compare gross and net in real time',
    'calc.grossToNet': 'Gross → Net',
    'calc.netToGross': 'Net → Gross',
    'calc.grossSalary': 'Monthly Gross Salary (€)',
    'calc.netSalary': 'Desired Net Salary (€)',
    'calc.children': 'Number of Children',
    'calc.noChildren': 'No children',
    'calc.child': 'child',
    'calc.children.plural': 'children',
    'calc.calculateNet': 'Calculate Net',
    'calc.calculateGross': 'Calculate Gross',
    'calc.gross': 'Gross Salary',
    'calc.net': 'Net Salary',
    'calc.breakdown': 'Deductions Breakdown',
    'calc.efka': 'EFKA Employee (13.37%)',
    'calc.incomeTax': 'Income Tax',
    'calc.solidarity': 'Solidarity Contribution',
    'calc.totalDeductions': 'Total Deductions',
    'calc.note14': '* Calculations based on 14 salaries (12 + Bonuses)',
    'calc.noteSolidarity': '* Solidarity Contribution: Suspended for 2025',

    // Bonuses
    'bonus.monthlyGross': 'Monthly gross salary (€)',
    'bonus.monthsWorked': 'Months worked (current year)',
    'bonus.monthsHint': 'Adjust months to prorate the bonus amount.',
    'bonus.calculate': 'Calculate amount',
    'bonus.gross': 'Gross amount',
    'bonus.net': 'Net amount',
    'bonus.note': '* Simple estimate based on monthly deductions.',
    'bonus.easter.title': 'Easter Bonus',
    'bonus.easter.description': 'Quickly estimate Easter bonus in gross and net.',
    'bonus.christmas.title': 'Christmas Bonus',
    'bonus.christmas.description': 'Estimation for the Christmas gift payment.',
    'bonus.vacation.title': 'Vacation Allowance',
    'bonus.vacation.description': 'Calculate the summer vacation allowance.',

    // Severance
    'severance.title': 'Severance Pay',
    'severance.description': 'Simple estimate based on monthly salary and service.',
    'severance.monthlyGross': 'Monthly gross salary (€)',
    'severance.years': 'Years of service',
    'severance.hint': 'Uses a 0.5 salary per year multiplier with a minimum of 1 salary.',
    'severance.calculate': 'Calculate severance',
    'severance.note': '* Indicative result only; not legal advice.',
    
    // Employer
    'employer.title': 'Employer Cost',
    'employer.description': 'Calculate the total employer cost per employee',
    'employer.calculate': 'Calculate',
    'employer.totalCost': 'Employer Cost',
    'employer.netToEmployee': 'Net to Employee',
    'employer.breakdownTitle': 'Contributions Breakdown',
    'employer.efkaEmployee': 'EFKA Employee (13.37%)',
    'employer.efkaEmployer': 'EFKA Employer (21.79%)',
    'employer.comparison': 'Comparison',
    'employer.totalContributions': 'Total Contributions',
    'employer.costPercent': '% of Cost in Contributions',
    'employer.netPercent': '% of Cost as Net',
    'employer.noteEmployer': '* Employer EFKA contributions: 21.79%',

    // Yearly
    'yearly.title': 'Yearly Summary',
    'yearly.description': 'Enter your salaries for tax return prediction',
    'yearly.month': 'Month',
    'yearly.grossSalary': 'Gross Salary (€)',
    'yearly.children.short': 'Children',
    'yearly.without': 'None',
    'yearly.add': 'Add',
    'yearly.sameYear': 'Same salary for the whole year',
    'yearly.registered': 'Registered Salaries',
    'yearly.editHint': '(click pencil to edit)',
    'yearly.yearlyGross': 'Yearly Gross',
    'yearly.yearlyNet': 'Yearly Net',
    'yearly.taxDeclaration': 'Tax Declaration Details',
    'yearly.efkaEmployee': 'EFKA Employee',
    'yearly.incomeTax': 'Income Tax',
    'yearly.solidarity': 'Solidarity Contribution',
    'yearly.totalDeductions': 'Total Deductions',
    'yearly.prediction': 'Tax Return Prediction',
    'yearly.predictionText': 'Based on the contributions you have paid, your taxable income is',
    'yearly.withheldTax': 'The withheld tax is',
    'yearly.comparison': 'Comparison with Standard Salary',
    'yearly.standardSalary': 'Standard Salary (no bonus)',
    'yearly.actualSalary': 'Actual Earnings',
    'yearly.difference': 'Difference (Extra Taxes)',
    'yearly.extraGross': 'Extra Gross',
    'yearly.extraTax': 'Extra Tax',
    'yearly.noBonus': 'If you had not received any bonus, you would have paid less tax by',
    'yearly.refundIntro':
      'In addition, based on your standard salary without bonuses and compared to your actual earnings, there is a difference in taxes paid of',
    'yearly.refundLikely':
      'which is likely to appear as a tax refund in your next tax return.',
    'yearly.refundDisclaimer':
      '* The above calculations are indicative and do not constitute tax or accounting advice. Please confirm the final amounts with your accountant.',

    // Common
    'common.yes': 'Yes',
    'common.no': 'No',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    return (stored as Language) || 'el';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

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
    'tabs.calculator': 'Υπολογιστής',
    'tabs.calculator.short': 'Υπολ.',
    'tabs.employer': 'Εργοδότης',
    'tabs.employer.short': 'Εργοδ.',
    'tabs.yearly': 'Ετήσια',
    'footer.disclaimer': 'Οι υπολογισμοί βασίζονται στα φορολογικά δεδομένα του 2025. Για επίσημη χρήση συμβουλευτείτε λογιστή.',
    
    // Calculator
    'calc.title': 'Υπολογιστής Μισθού',
    'calc.description': 'Υπολογίστε τον μισθό σας με βάση τα ελληνικά φορολογικά δεδομένα 2025',
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
  },
  en: {
    'app.title': 'Salary Calculator',
    'app.subtitle': 'Calculate your net salary, contributions and prepare your tax return',
    'tabs.calculator': 'Calculator',
    'tabs.calculator.short': 'Calc.',
    'tabs.employer': 'Employer',
    'tabs.employer.short': 'Empl.',
    'tabs.yearly': 'Yearly',
    'footer.disclaimer': 'Calculations are based on 2025 tax data. For official use, consult an accountant.',
    
    // Calculator
    'calc.title': 'Salary Calculator',
    'calc.description': 'Calculate your salary based on Greek tax data 2025',
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

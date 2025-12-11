import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type WeekType = '5' | '6';

interface EmploymentContextValue {
  hireDate: string;
  setHireDate: (value: string) => void;
  weekType: WeekType;
  setWeekType: (value: WeekType) => void;
}

const EmploymentContext = createContext<EmploymentContextValue | undefined>(undefined);

export function EmploymentProvider({ children }: { children: React.ReactNode }) {
  const [hireDate, setHireDateState] = useState<string>(() => {
    return localStorage.getItem('hireDate') || '';
  });
  const [weekType, setWeekTypeState] = useState<WeekType>(() => {
    return (localStorage.getItem('weekType') as WeekType) || '5';
  });

  const setHireDate = (value: string) => {
    setHireDateState(value);
  };

  const setWeekType = (value: WeekType) => {
    setWeekTypeState(value);
  };

  useEffect(() => {
    localStorage.setItem('hireDate', hireDate);
  }, [hireDate]);

  useEffect(() => {
    localStorage.setItem('weekType', weekType);
  }, [weekType]);

  const value = useMemo(
    () => ({ hireDate, setHireDate, weekType, setWeekType }),
    [hireDate, weekType]
  );

  return <EmploymentContext.Provider value={value}>{children}</EmploymentContext.Provider>;
}

export function useEmployment() {
  const context = useContext(EmploymentContext);
  if (!context) {
    throw new Error('useEmployment must be used within an EmploymentProvider');
  }
  return context;
}

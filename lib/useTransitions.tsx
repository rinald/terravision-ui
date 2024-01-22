'use client';

import { useState, createContext, useContext, useTransition } from 'react';

type Props = ReturnType<typeof useTransisions>;

const TransitionsContext = createContext<Props>({
  validationTransition: [false, () => {}],
  generationTransition: [false, () => {}]
});

const useTransisions = () => {
  const validationTransition = useTransition();
  const generationTransition = useTransition();

  return {
    validationTransition,
    generationTransition
  };
};

const TransitionsProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useTransisions();

  return (
    <TransitionsContext.Provider value={value}>
      {children}
    </TransitionsContext.Provider>
  );
};

const useTransitionsContext = () => useContext(TransitionsContext);

export { TransitionsProvider, useTransitionsContext as useTransitions };

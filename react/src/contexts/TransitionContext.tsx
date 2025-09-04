import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TransitionContextType {
  sharedElement: {
    id: string;
    rect: DOMRect | null;
    image: string | null;
  } | null;
  setSharedElement: (element: { id: string; rect: DOMRect | null; image: string | null } | null) => void;
  isTransitioning: boolean;
  setIsTransitioning: (transitioning: boolean) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
};

interface TransitionProviderProps {
  children: ReactNode;
}

export const TransitionProvider: React.FC<TransitionProviderProps> = ({ children }) => {
  const [sharedElement, setSharedElement] = useState<{
    id: string;
    rect: DOMRect | null;
    image: string | null;
  } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  return (
    <TransitionContext.Provider
      value={{
        sharedElement,
        setSharedElement,
        isTransitioning,
        setIsTransitioning,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
};


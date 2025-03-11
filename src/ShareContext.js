import React, { createContext, useState } from 'react';

export const ShareContext = createContext({
  sharedUrl: null,
  setSharedUrl: (url) => {},
});

export const ShareProvider = ({ children }) => {
  const [sharedUrl, setSharedUrl] = useState(null);
  return (
    <ShareContext.Provider value={{ sharedUrl, setSharedUrl }}>
      {children}
    </ShareContext.Provider>
  );
};

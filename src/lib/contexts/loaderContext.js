import { createContext, useState } from "react";
let initialState = {
  loading: false,
};

export const LoaderContext = createContext([initialState, () => {}]);
export const LoaderProvider = (props) => {
  const [loaderContext, setLoaderContext] = useState(initialState);
  return (
    <LoaderContext.Provider value={[loaderContext, setLoaderContext]}>
      {props.children}
    </LoaderContext.Provider>
  );
};

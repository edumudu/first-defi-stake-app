export type EnvVars = {
  NODE_ENV: string;
  REACT_APP_RPC_NETWORK: string;
};

type RemoveReacApp<S extends string> = S extends `REACT_APP_${infer U}` ? U : S;

type RemoveReacAppNested<T> = T extends object ? {
  [K in keyof T as RemoveReacApp<K & string>]: RemoveReacAppNested<T[K]>
} : T;

export const useEnv = () => Object.entries(process.env).reduce((acc, [key, value]) => {
  const newKey = key.replace(/^REACT_APP_/, '');

  return {
    ...acc,
    [newKey]: value,
  };
}, {}) as RemoveReacAppNested<EnvVars>;

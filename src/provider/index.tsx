import { PropsWithChildren } from 'react';

import { Mui } from "./mui";

export default function Provider({ children }: PropsWithChildren) {
  return(
    <Mui>
      {children}
    </Mui>
  );
}

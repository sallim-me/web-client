import { PropsWithChildren } from 'react';
import { ReactQuery } from './react-query';
import { Mui } from './mui';

export default function Provider({ children }: PropsWithChildren) {
  return(
    <ReactQuery>
      <Mui>
        {children}
      </Mui>
    </ReactQuery>
  );
}

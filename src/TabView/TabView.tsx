import React, { ReactElement, ReactNode } from 'react';
import s from './TabView.module.scss';

interface Props {
  children: ReactNode;
}

export default function TabView({ children }: Props): ReactElement {
  return <div className={s.tabView}>{children}</div>;
}

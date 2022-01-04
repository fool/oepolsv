import { FC } from 'react';

export type HeaderProps = {
  title: string;
};

export const Header: FC<HeaderProps> = ({ title }) => {
  return <h1 className="title">{title}</h1>;
};

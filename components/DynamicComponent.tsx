import { FC } from 'react';
import SbEditable, { SbEditableContent } from 'storyblok-react';
import { Page } from './Page';
import { Text } from './Text';

interface IComponents {
  [key: string]: React.ElementType;
}

interface DynamicComponentProps {
  blok?: SbEditableContent;
}

const Components: IComponents = {
  page: Page,
  text: Text,
};

export const DynamicComponent: FC<DynamicComponentProps> = ({ blok }) => {
  if (blok) {
    if (typeof Components[blok.component] !== 'undefined') {
      const FoundComponent = Components[blok.component];
      return (
        <SbEditable content={blok} key={blok._uid}>
          <FoundComponent blok={blok} />
        </SbEditable>
      );
    } else {
      return (
        <p>
          <strong>{blok.component}</strong> has not been created yet.
        </p>
      );
    }
  }
  return null;
};

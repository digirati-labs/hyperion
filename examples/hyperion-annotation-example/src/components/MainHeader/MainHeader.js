import React, { useCallback } from 'react';
import { AppHeader as Header } from '../../blocks/AppHeader/AppHeader';
import imageUrl from '../../../hyperion-icon.png';
import { useManifest } from '@hyperion-framework/react-vault';

export const MainHeader = ({ onChangeMenu, currentMenu }) => {
  const { id, label } = useManifest({
    selector: manifest => ({
      id: manifest.id,
      label: manifest.label[Object.keys(manifest.label)[0]].join(''),
    }),
  });
  const tidyId = id.replace(/^http(s)?:\/\//, '');

  const handleChangeMenu = useCallback(name => () => onChangeMenu(name), [onChangeMenu]);

  return (
    <Header>
      <Header.Logo>
        <img src={imageUrl} />
      </Header.Logo>
      <Header.Resource>
        <React.Fragment>
          <Header.ResourceHeading>{label}</Header.ResourceHeading>
          <Header.ResourceLink target="_blank" href={`${id}?manifest=${id}`}>
            {tidyId}
          </Header.ResourceLink>
        </React.Fragment>
      </Header.Resource>
      <Header.Menu>
        <Header.MenuItem onClick={handleChangeMenu('tweets')} isSelected={currentMenu === 'tweets'}>
          Tweets
        </Header.MenuItem>
        <Header.MenuItem onClick={handleChangeMenu('metadata')} isSelected={currentMenu === 'metadata'}>
          Metadata
        </Header.MenuItem>
        <Header.MenuItem onClick={handleChangeMenu('share')} isSelected={currentMenu === 'share'}>
          Share
        </Header.MenuItem>
      </Header.Menu>
    </Header>
  );
};

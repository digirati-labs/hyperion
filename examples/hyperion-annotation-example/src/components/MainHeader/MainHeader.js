import React, { useCallback, useState } from 'react';
import { AppHeader as Header } from '../../blocks/AppHeader/AppHeader';
import imageUrl from '../../../hyperion-icon.png';
import { createSelector, manifestContext } from '@hyperion-framework/vault';
import { languageCtx } from '../MainView/MainView';
import { useSelector, useCanvas } from '@hyperion-framework/react-vault';

const mainHeaderSelector = createSelector({
  context: [manifestContext, languageCtx],
  selector: (state, ctx) => {
    return {
      id: ctx.manifest.id,
      label: ctx.manifest.label[ctx.language],
    };
  },
});

export const MainHeader = ({ onChangeMenu, currentMenu }) => {
  const { id, label } = useSelector(mainHeaderSelector);
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

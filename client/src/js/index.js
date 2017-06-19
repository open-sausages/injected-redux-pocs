import Injector from 'lib/Injector';
import GenericPreviewImage from './GenericPreviewImage';
import BlockBadges from './BlockBadges';
import LogoToBreadcrumbs from './LogoToBreadcrumbs';
import RenameFilesCrumb from './RenameFilesCrumb';

Injector.transform('reduxPOC', (update) => {
  update.reducer('assetAdmin', GenericPreviewImage);
  update.reducer('assetAdmin', BlockBadges);
  update.reducer('breadcrumbs', RenameFilesCrumb);
  update.reducer('breadcrumbs', LogoToBreadcrumbs);
});

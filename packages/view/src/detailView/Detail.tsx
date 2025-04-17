import type { RuntimeLogEntry } from '@axonivy/log-view-protocol';
import { Button, Flex } from '@axonivy/ui-components';
import './Detail.css';
import { IvyIcons } from '@axonivy/ui-icons';
import { LogEntryDetail } from './LogEntryDetail';
import { useTranslation } from 'react-i18next';

interface ViewProps {
  RuntimeLogEntry: RuntimeLogEntry;
  CloseDetailView: () => void;
}

export const Detail = ({ RuntimeLogEntry, CloseDetailView }: ViewProps) => {
  const { t } = useTranslation();
  return (
    <Flex direction='column' gap={2} className='master-content-container detail-view'>
      <Flex className='detail-view-close' direction='row' gap={2}>
        <Button onClick={() => CloseDetailView()} icon={IvyIcons.Close}>
          {t('common.label.close')}
        </Button>
      </Flex>

      <LogEntryDetail label={t('label.time')} value={RuntimeLogEntry.timestamp} />
      <LogEntryDetail label={t('label.request')} value={RuntimeLogEntry.request} />
      <LogEntryDetail label={t('label.userDialog')} value={RuntimeLogEntry.userDialogId} />

      <Flex gap={2} direction='row'>
        <LogEntryDetail label={t('label.level')} value={RuntimeLogEntry.level} />
        <LogEntryDetail label={t('label.category')} value={RuntimeLogEntry.category} />
      </Flex>

      <LogEntryDetail label={t('common.label.message')} value={RuntimeLogEntry.message} />
      <LogEntryDetail label={t('label.stack')} value={RuntimeLogEntry.throwableInformationMsg} />
    </Flex>
  );
};

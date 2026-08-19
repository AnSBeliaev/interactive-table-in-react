import { memo, useMemo } from 'react';

import { TableHead, TableStatistic, TableBody } from './components';
import { useGetScrollbarGutter, useNormalizedDocuments, useSyncScroll } from './hooks';
import { useTheme } from '../../constext';

import styles from './Table.module.css';

import type { TableRowItem, TableProps, NormalizedDocuments } from './types';

export const Table = memo(({ data, leftColumns, rightColumns, isBigData }: TableProps<TableRowItem>) => {
  const { isDark } = useTheme();
  const { documents, tagsForHeader } = data;
  const normalizedDocuments: NormalizedDocuments = useNormalizedDocuments({ documents });

  const tableData = useMemo(() => {
    return !isBigData ? normalizedDocuments : documents;
  }, [isBigData, normalizedDocuments, documents]);

  const { scrollbarGutter, viewportRef } = useGetScrollbarGutter(normalizedDocuments);
  const { handleScroll, headerScrollRef, bodyScrollRef, footerScrollRef } = useSyncScroll<HTMLDivElement>();

  const dynamicColumns = useMemo(() => {
    if (!isBigData && tagsForHeader) {
      return tagsForHeader.map((tag) => tag.order);
    } else {
      let numberOfColumns = 0;
      documents.forEach((document) => {
        if (document.claims && document.claims.length > numberOfColumns) {
          numberOfColumns = document.claims.length;
        }
      });
      const columns = Array.from({ length: numberOfColumns }, (_, index) => index);
      return columns;
    }
  }, [tagsForHeader, isBigData, documents]);

  const midData = useMemo(() => {
    const bigDataTags = dynamicColumns.map((column) => {
      return {
        id: column,
        order: column,
        color: '',
      };
    });
    return isBigData ? bigDataTags : data.tagsForHeader;
  }, [data.tagsForHeader, isBigData, dynamicColumns]);

  return (
    <>
      <div className={styles['table-container']}>
        <div className={styles['table']}>
          <div className={styles['table-header']}>
            <div className={styles['header-left']}>
              {leftColumns.map((headItem) => {
                return <TableHead key={headItem.id} item={headItem.title} className={String(headItem.id)} />;
              })}
            </div>
            <div
              ref={headerScrollRef}
              onScroll={() =>
                handleScroll({
                  sourceRef: headerScrollRef,
                  firstTargetRef: bodyScrollRef,
                  secondTargetRef: footerScrollRef,
                })
              }
              className={styles['header-mid']}
            >
              {midData?.map((tag) => (
                <TableHead
                  key={tag.order}
                  item={String(tag.order + 1)}
                  tagColor={tag.color}
                  className={String(tag.id)}
                />
              ))}
            </div>
            <div className={styles['header-right']}>
              {rightColumns.map((headItem) => {
                return <TableHead key={headItem.dataIndex} item={headItem.title} className={String(headItem.id)} />;
              })}
            </div>
            {scrollbarGutter > 0 && <div className={styles['scrollbar-spacer']} style={{ width: scrollbarGutter }} />}
          </div>
          <TableBody
            normalizedDocuments={normalizedDocuments}
            tableData={tableData}
            leftColumns={leftColumns}
            dynamicColumns={dynamicColumns}
            rightColumns={rightColumns}
            scrollbarGutter={scrollbarGutter}
            viewportRef={viewportRef}
            isBigData={isBigData}
            isDark={isDark}
            documents={documents}
            midData={midData}
          />
        </div>
      </div>
      <TableStatistic normalizedDocuments={normalizedDocuments} isBigData={isBigData} documents={documents} />
    </>
  );
});

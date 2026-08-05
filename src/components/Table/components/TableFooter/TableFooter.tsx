import type { TagsForHeader } from '../../types';
import styles from './TableFooter.module.css';

type TableRow = {
  allExcerptSums?: { [order: number]: number };
  allTagsSum?: number | null;
  aria: 'left' | 'right' | 'mid';
  tag?: TagsForHeader;
};

export const TableFooter = ({ allExcerptSums, allTagsSum, aria, tag }: TableRow) => {
  const isLeft = aria === 'left';
  const isMid = aria === 'mid';
  const isRight = aria === 'right';

  const getAllExcerptSum = () => {
    if (!tag) return;
    return allExcerptSums?.[tag?.order] ?? '';
  };
  return (
    <>
      {isLeft && <div className={`${styles['footer-left-td']}`}>All documents</div>}
      {isMid && <div className={`${styles['footer-td']}  ${styles['footer-mid-td']}`}>{getAllExcerptSum()}</div>}
      {isRight && (
        <div className={`${styles['footer-td']} ${allTagsSum ? styles['footer-sum-td'] : styles['footer-empty-td']}`}>
          {allTagsSum ?? ''}
        </div>
      )}
    </>
  );
};

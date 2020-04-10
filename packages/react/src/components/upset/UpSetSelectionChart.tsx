import { ISetLike } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetDataInfo } from './deriveDataDependent';
import { UpSetSizeInfo } from './deriveSizeDependent';
import { UpSetStyleInfo } from './deriveStyleDependent';
import UpSetDot from './UpSetDot';
import { clsx } from './utils';

function UpSetSelectionChart<T>({
  data,
  size,
  style,
  selection,
}: PropsWithChildren<{
  data: UpSetDataInfo<T>;
  size: UpSetSizeInfo;
  style: UpSetStyleInfo;
  selection: ISetLike<T> | null;
}>) {
  const cy = data.sets.bandWidth / 2;
  const cx = data.combinations.cx;
  const r = data.r;
  const height = size.sets.h + size.sets.after;
  const width = data.combinations.bandWidth;

  if (!selection || selection.type === 'set') {
    return null;
  }
  const d = selection;
  return (
    <g transform={`translate(${size.labels.w + data.combinations.x(d.name)!}, 0)`}>
      <rect width={width} height={height} className={`selectionHint-${style.id}`} />
      {data.sets.v
        .filter((s) => d.sets.has(s))
        .map((s) => {
          return (
            <UpSetDot
              key={s.name}
              r={r * 1.1}
              cx={cx}
              cy={data.sets.y(s.name)! + cy}
              name={s.name}
              className={clsx(`fillSelection-${style.id}`, `pnone-${style.id}`, style.classNames.dot)}
              style={style.styles.dot}
            />
          );
        })}
      {d.sets.size > 1 && (
        <line
          x1={cx}
          y1={data.sets.y(data.sets.v.find((p) => d.sets.has(p))!.name)! + cy}
          x2={cx}
          y2={data.sets.y(data.sets.rv.find((p) => d.sets.has(p))!.name)! + cy}
          className={`upsetSelectionLine-${data.id}`}
        />
      )}
    </g>
  );
}

export default UpSetSelectionChart;

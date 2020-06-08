/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISet, ISetLike } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { clsx } from '../../utils';
import { VennDiagramStyleInfo } from '../derive/deriveVennStyleDependent';
import { ICircle } from '../layout/interfaces';

export function SelectionPattern({
  id,
  suffix,
  v,
  style,
}: {
  id: string;
  suffix: string;
  v: number;
  style: VennDiagramStyleInfo;
}) {
  if (v === 1) {
    return null;
  }
  const ratio = Math.round(v * 10.0) / 100;
  return (
    <defs>
      <pattern id={id} width="1" height="0.1" patternContentUnits="objectBoundingBox">
        <rect x="0" y="0" width="1" height="0.1" className={`fillPrimary-${style.id}`} />
        <rect x="0" y="0" width="1" height={ratio} className={`fill${suffix}`} />
      </pattern>
    </defs>
  );
}

export default function VennCircleSelection<T>({
  circle,
  d,
  i,
  style,
  suffix,
  elemOverlap,
  tooltip,
}: PropsWithChildren<{
  circle: ICircle;
  suffix: string;
  i: number;
  d: ISet<T>;
  elemOverlap: (s: ISetLike<T>) => number;
  secondary?: boolean;
  tooltip?: string;
  style: VennDiagramStyleInfo;
}>) {
  const o = elemOverlap(d);
  if (o === 0) {
    return null;
  }
  const className = clsx(o === d.cardinality && `fill${suffix}`, !tooltip && `pnone-${style.id}`, style.classNames.set);
  const title = tooltip && <title>{`${d.name} ∩ ${tooltip}: ${o}`}</title>;
  const id = `upset-${style.id}-s${i}`;
  return (
    <g transform={`translate(${circle.x},${circle.y})`}>
      <SelectionPattern id={id} v={o / d.cardinality} style={style} suffix={suffix} />
      <circle
        r={circle.r}
        fill={o < d.cardinality ? `url(#${id})` : undefined}
        transform={`rotate(${circle.align === 'center' ? 0 : circle.align === 'left' ? 45 : -45})`}
        className={className}
      >
        {title}
      </circle>
    </g>
  );
}

/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { forwardRef, Ref, memo } from 'react';
import { UpSetJSSkeletonProps, defaults } from '../UpSetJSSkeleton';
import { vennDiagramLayout } from './layout/vennDiagramLayout';

/**
 * VennDiagram Skeleton a simple VennDiagram skeleton
 *
 * with React.forwardRef support to specify a reference to the SVG element
 */
const VennDiagramSkeleton: React.FC<UpSetJSSkeletonProps & React.RefAttributes<SVGSVGElement>> = memo(
  forwardRef(function VennDiagramSkeleton(props: UpSetJSSkeletonProps, ref: Ref<SVGSVGElement>) {
    const c = props.color ?? defaults.color;
    const s = props.secondaryColor ?? defaults.secondaryColor;

    const padding = 10;
    const l = vennDiagramLayout(
      3,
      {
        w: 300 - padding * 2,
        h: 200 - padding * 2,
        cx: 150,
        cy: 100,
        r: 100 - padding,
      },
      0.25
    );
    return (
      <svg viewBox="0 0 300 200" ref={ref} width={props.width} height={props.height}>
        <rect width={300} height={300} fill={props.background ?? defaults.background} />
        {l.sets.map((set, i) => (
          <circle key={i} cx={set.cx} cy={set.cy + padding} r={set.r} fill={s} />
        ))}
        {l.sets.map((set, i) => (
          <circle key={i} cx={set.cx} cy={set.cy + padding} r={set.r} stroke={c} fill="none" />
        ))}
      </svg>
    );
  })
);

export { VennDiagramSkeleton };

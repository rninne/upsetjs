/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo, forwardRef, Ref, useCallback } from 'react';
import { UpSetProps } from './interfaces';
import { exportSVG, exportVegaLite } from './exporter';
import { exportDump, exportSharedLink } from './exporter/exportDump';
import deriveDataDependent from './derive/deriveDataDependent';
import deriveSizeDependent from './derive/deriveSizeDependent';
import deriveStyleDependent from './derive/deriveStyleDependent';
import ExportButtons from './components/ExportButtons';
import QueryLegend from './components/QueryLegend';
import UpSetAxis from './components/UpSetAxis';
import UpSetChart from './components/UpSetChart';
import UpSetQueries from './components/UpSetQueries';
import UpSetSelection from './components/UpSetSelection';
import { generateId, clsx, generateSelectionName } from './utils';
import { fillDefaults } from './fillDefaults';
import { baseRules } from './rules';

export * from './interfaces';

/**
 * UpSetJS main pure functional stateless React component, the generic argument T refers to the type of the elements
 *
 * with React.forwardRef support to specify a reference to the SVG element
 */
const UpSetJS = forwardRef(function UpSetJS<T = any>(props: UpSetProps<T>, ref: Ref<SVGSVGElement>) {
  const p = fillDefaults<T>(props);
  const { selection = null, onClick, queries = [], fontSizes } = p;

  // generate a "random" but attribute stable id to avoid styling conflicts
  const styleId = useMemo(
    () =>
      p.id
        ? p.id
        : generateId([
            p.fontFamily,
            fontSizes.axisTick,
            fontSizes.barLabel,
            fontSizes.chartLabel,
            fontSizes.legend,
            fontSizes.setLabel,
            fontSizes.title,
            fontSizes.exportLabel,
            fontSizes.description,
            p.textColor,
            p.hoverHintColor,
            p.color,
            p.hasSelectionColor,
            p.selectionColor,
            p.notMemberColor,
            p.alternatingBackgroundColor,
            p.opacity,
            p.hasSelectionOpacity,
          ]),
    [
      p.id,
      p.fontFamily,
      fontSizes.axisTick,
      fontSizes.barLabel,
      fontSizes.chartLabel,
      fontSizes.legend,
      fontSizes.setLabel,
      fontSizes.title,
      fontSizes.exportLabel,
      fontSizes.description,
      p.textColor,
      p.hoverHintColor,
      p.color,
      p.hasSelectionColor,
      p.selectionColor,
      p.notMemberColor,
      p.alternatingBackgroundColor,
      p.opacity,
      p.hasSelectionOpacity,
    ]
  );
  const styleInfo = useMemo(
    () =>
      deriveStyleDependent(
        p.theme,
        p.styles,
        p.classNames,
        p.combinationName,
        p.combinationNameAxisOffset,
        p.setName,
        p.setNameAxisOffset,
        styleId,
        p.barLabelOffset,
        p.selectionColor,
        p.emptySelection,
        p.title,
        p.description
      ),
    [
      p.theme,
      p.styles,
      p.classNames,
      p.barLabelOffset,
      p.combinationName,
      p.combinationNameAxisOffset,
      p.setName,
      p.setNameAxisOffset,
      styleId,
      p.selectionColor,
      p.emptySelection,
      p.title,
      p.description,
    ]
  );

  const sizeInfo = useMemo(
    () =>
      deriveSizeDependent(
        p.width,
        p.height,
        p.padding,
        p.barPadding,
        p.widthRatios,
        p.heightRatios,
        p.setAddons,
        p.combinationAddons,
        p.id
      ),
    [p.width, p.height, p.padding, p.barPadding, p.widthRatios, p.heightRatios, p.setAddons, p.combinationAddons, p.id]
  );

  const dataInfo = useMemo(
    () =>
      deriveDataDependent(
        p.sets,
        p.combinations,
        sizeInfo,
        p.numericScale,
        p.bandScale,
        p.barLabelOffset + Number.parseInt(fontSizes.barLabel ?? '10'),
        p.dotPadding,
        p.barPadding,
        Number.parseInt(fontSizes.axisTick ?? '10'),
        p.toKey,
        p.toElemKey,
        p.id
      ),
    [
      p.sets,
      p.combinations,
      sizeInfo,
      p.numericScale,
      p.bandScale,
      p.barLabelOffset,
      fontSizes.barLabel,
      p.dotPadding,
      p.barPadding,
      fontSizes.axisTick,
      p.toKey,
      p.toElemKey,
      p.id,
    ]
  );

  const rulesHelper = baseRules(styleId, p, p.fontFamily, fontSizes);
  const rules = `
  ${rulesHelper.root}
  ${rulesHelper.text}

  .axisTextStyle-${styleId} {
    fill: ${p.textColor};
    ${rulesHelper.p(fontSizes.axisTick)}
    text-anchor: middle;
  }
  .barTextStyle-${styleId} {
    fill: ${p.textColor};
    ${rulesHelper.p(fontSizes.barLabel)}
  }
  .cBarTextStyle-${styleId} {
    fill: ${p.textColor};
    ${rulesHelper.p(fontSizes.barLabel)}
    text-anchor: middle;
  }
  .sBarTextStyle-${styleId} {
    fill: ${p.textColor};
    ${rulesHelper.p(fontSizes.barLabel)}
    text-anchor: end;
    dominant-baseline: central;
  }
  .hoverBarTextStyle-${styleId} {
    ${rulesHelper.p(fontSizes.barLabel)}
    fill: ${p.hoverHintColor};
    display: none;
    text-anchor: middle;
  }
  .setTextStyle-${styleId} {
    fill: ${p.textColor};
    ${rulesHelper.p(fontSizes.setLabel)}
    text-anchor: middle;
    dominant-baseline: central;
  }
  .cChartTextStyle-${styleId} {
    fill: ${p.textColor};
    ${rulesHelper.p(fontSizes.chartLabel)}
    text-anchor: middle;
  }
  .sChartTextStyle-${styleId} {
    fill: ${p.textColor};
    ${rulesHelper.p(fontSizes.chartLabel)}
    text-anchor: middle;
    dominant-baseline: hanging;
  }

  ${rulesHelper.fill}
  .fillNotMember-${styleId} { fill: ${p.notMemberColor}; }
  .fillAlternating-${styleId} { fill: ${p.alternatingBackgroundColor || 'transparent'}; }

  .axisLine-${styleId} {
    fill: none;
    stroke: ${p.textColor};
  }
  .hoverBar-${styleId} {
    fill: transparent;
  }

  .interactive-${styleId}:hover > .hoverBar-${styleId} {
    stroke: ${p.hoverHintColor};
  }
  .interactive-${styleId}:hover > .hoverBarTextStyle-${styleId} {
    display: unset;
  }

  ${rulesHelper.export}

  .upsetLine-${dataInfo.id} {
    stroke-linecap: round;
    stroke-width: ${dataInfo.r * 0.6};
    stroke: ${p.color};
    stroke-opacity: ${p.opacity};
  }
  ${
    rulesHelper.hasSStroke
      ? `.root-${styleId}[data-selection] .upsetLine-${dataInfo.id} { ${rulesHelper.hasSStroke} }`
      : ''
  }

  .upsetSelectionLine-${dataInfo.id} {
    stroke-width: ${dataInfo.r * 0.6 * 1.1};
    ${rulesHelper.p(p.selectionColor, 'stroke')}
    pointer-events: none;
  }

  ${queries
    .map(
      (q, i) => `.fillQ${i}-${dataInfo.id} {
    fill: ${q.color};
  }`
    )
    .join('\n')}
  `;

  const exportChart = useCallback(
    (evt: React.MouseEvent<SVGElement>) => {
      const svg = evt.currentTarget.closest('svg') as SVGSVGElement;
      const type = (evt.currentTarget.dataset.type || 'png') as 'svg' | 'png' | 'vega' | 'dump' | 'share';
      switch (type) {
        case 'vega':
          exportVegaLite(svg);
          break;
        case 'dump':
          exportDump(svg, props, dataInfo);
          break;
        case 'share':
          exportSharedLink(props, dataInfo);
          break;
        case 'svg':
        case 'png':
          exportSVG(svg, {
            type,
            toRemove: `.${evt.currentTarget.getAttribute('class')}`,
          });
      }
    },
    [dataInfo, props]
  );

  const selectionName = generateSelectionName(selection);

  const reset = useCallback((evt: React.MouseEvent<SVGElement>) => (onClick ? onClick(null, evt.nativeEvent) : null), [
    onClick,
  ]);

  return (
    <svg
      id={p.id}
      className={clsx(`root-${styleId}`, p.className)}
      style={p.style}
      width={p.width}
      height={p.height}
      ref={ref}
      viewBox={`0 0 ${p.width} ${p.height}`}
      data-theme={p.theme ?? 'light'}
      data-selection={selectionName ? selectionName : undefined}
    >
      <style>{rules}</style>
      <defs>
        <clipPath id={`clip-${sizeInfo.id}`}>
          <rect x={sizeInfo.sets.w} y={0} width={sizeInfo.labels.w} height={sizeInfo.sets.h} />
        </clipPath>
      </defs>
      {p.queryLegend && <QueryLegend queries={queries} x={sizeInfo.legend.x} style={styleInfo} data={dataInfo} />}
      <ExportButtons
        transform={`translate(${sizeInfo.w - 2},${sizeInfo.h - 3})`}
        styleId={styleId}
        exportButtons={p.exportButtons}
        exportChart={exportChart}
      />
      <g transform={`translate(${p.padding},${p.padding})`} data-upset="base">
        {p.onClick && (
          <rect
            width={sizeInfo.cs.x}
            height={sizeInfo.sets.y}
            onClick={reset}
            className={`fillTransparent-${styleId}`}
          />
        )}
        <UpSetAxis size={sizeInfo} style={styleInfo} data={dataInfo} />
        <UpSetChart<T>
          size={sizeInfo}
          style={styleInfo}
          data={dataInfo}
          onClick={p.onClick}
          onHover={p.onHover}
          onContextMenu={p.onContextMenu}
          setChildrenFactory={p.setChildrenFactory}
          combinationChildrenFactory={p.combinationChildrenFactory}
        />
        <UpSetSelection size={sizeInfo} style={styleInfo} data={dataInfo} onHover={p.onHover} selection={selection} />
        <UpSetQueries
          size={sizeInfo}
          style={styleInfo}
          data={dataInfo}
          onHover={p.onHover}
          queries={queries}
          secondary={p.onHover != null || selection != null}
        />
      </g>
      {props.children}
    </svg>
  );
});

export { UpSetJS };

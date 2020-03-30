import { render, h } from 'preact';
import UpSetElement, { UpSetProps as UpSetElementProps, fillDefaults as fillDefaultsImpl } from '@upsetjs/react';

import {
  ISets,
  ISetLike,
  ISetCombinations,
  UpSetQuery,
  GenerateSetCombinationsOptions,
  NumericScaleFactory,
  BandScaleFactory,
} from '@upsetjs/model';
export * from '@upsetjs/model';

export interface UpSetSizeProps {
  /**
   * width of the chart
   */
  width: number;
  /**
   * height of the chart
   */
  height: number;
  /**
   * padding within the svg
   * @default 20
   */
  padding?: number;
  /**
   * padding argument for scaleBand
   * @default 0.1
   */
  barPadding?: number;
  /**
   * width ratios for different plots
   * [set chart, set labels, intersection chart]
   * @default [0.25, 0.1, 0.65]
   */
  widthRatios?: [number, number, number];
  /**
   * height ratios for different plots
   * [intersection chart, set chart]
   * @default [0.6, 0.4]
   */
  heightRatios?: [number, number];
}

export interface UpSetDataProps<T> {
  /**
   * the sets to visualize
   */
  sets: ISets<T>;
  /**
   * the combinations to visualize by default all combinations
   */
  combinations?: ISetCombinations<T> | GenerateSetCombinationsOptions;
}

export interface UpSetSelectionProps<T> {
  selection?: ISetLike<T> | null | ReadonlyArray<T>;
  onHover?(selection: ISetLike<T> | null): void;
  onClick?(selection: ISetLike<T> | null): void;

  queries?: ReadonlyArray<UpSetQuery<T>>;
}

export interface UpSetThemeProps {
  selectionColor?: string;
  alternatingBackgroundColor?: string | false;
  color?: string;
  textColor?: string;
  hoverHintColor?: string;
  notMemberColor?: string;
}

export interface UpSetStyleProps extends UpSetThemeProps {
  theme?: 'light' | 'dark';

  triangleSize?: number;
  combinationNameAxisOffset?: number;
  /**
   * show a legend of queries
   * enabled by default when queries are set
   */
  queryLegend?: boolean;

  /**
   * show export buttons
   * @default true
   */
  exportButtons?: boolean;
  /**
   * set to false to use the default font family
   * @default sans-serif
   */
  fontFamily?: string | false;
  /**
   * @default 16px
   */
  fontSize?: string;
  /**
   * @default 10px
   */
  axisFontSize?: string;

  numericScale?: 'linear' | 'log' | NumericScaleFactory;
  bandScale?: 'band' | BandScaleFactory;

  setName?: string;
  combinationName?: string;
}

export declare type UpSetCSSStyles = CSSStyleDeclaration & {
  backfaceVisibility: '-moz-initial' | 'inherit' | 'initial' | 'revert' | 'unset' | 'hidden' | 'visible';
};

export interface UpSetPlainStyleProps {
  labelStyle?: UpSetCSSStyles;
  setLabelStyle?: UpSetCSSStyles;
  setNameStyle?: UpSetCSSStyles;
  axisStyle?: UpSetCSSStyles;
  combinationNameStyle?: UpSetCSSStyles;
}

export declare type UpSetProps<T> = UpSetDataProps<T> &
  UpSetSizeProps &
  UpSetStyleProps &
  UpSetPlainStyleProps &
  UpSetSelectionProps<T>;

export function fillDefaults<T>(props: UpSetProps<T>) {
  const p: UpSetElementProps<T> = props;
  return fillDefaultsImpl(p) as Required<UpSetDataProps<T>> &
    Required<UpSetSizeProps> &
    Required<UpSetStyleProps> &
    UpSetPlainStyleProps &
    UpSetSelectionProps<T>;
}

export function renderUpSet<T>(node: HTMLElement, props: UpSetProps<T>) {
  const p: UpSetElementProps<T> = props;
  render(h(UpSetElement as any, p), node);
}

// export class UpSet<T> extends Eventemitter implements Omit<UpSetProps<T>, 'onHover'> {
//   constructor(sets: ISets<T>, width: number, height: number) {
//     super();
//     this.parent = parent;
//   }

//   update() {
//     this.render();
//   }

//   private render() {
//     render(
//       h(UpSetElement as any, {
//         ...this.props,
//         onClick: (s: ISetLike<T>) => this.emit('click', s),
//         onHover: (s: ISetLike<T> | null) => this.emit('hover', s),
//       }),
//       this.parent
//     );
//   }
// }

// export default UpSet;

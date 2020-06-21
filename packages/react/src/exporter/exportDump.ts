/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import {
  GenerateSetCombinationsOptions,
  isElemQuery,
  ISetCombinations,
  isSetLike,
  isSetQuery,
  toDump,
  toStaticDump,
  UpSetElemQuery,
  UpSetSetQuery,
} from '@upsetjs/model';
import LZString from 'lz-string';
import { toUpSetJSDump, toUpSetJSStaticDump } from '../dump';
import { UpSetProps } from '../interfaces';
import { downloadUrl } from './exportSVG';

declare type IDumpDataInfo = { cs: { v: ISetCombinations<any> } };

export function exportDumpData(props: UpSetProps<any>, data: IDumpDataInfo, compress = false) {
  const elems: any[] = [];
  const lookup = new Map<any, number>();
  const toElemIndex = (elem: any) => {
    if (lookup.has(elem)) {
      return lookup.get(elem)!;
    }
    lookup.set(elem, elems.length);
    elems.push(elem);
    return elems.length - 1;
  };
  const dump = toDump(
    {
      sets: props.sets,
      queries: props.queries?.filter((d): d is UpSetElemQuery | UpSetSetQuery => isElemQuery(d) || isSetQuery(d)) ?? [],
      toElemIndex,
      selection: props.selection && isSetLike(props.selection) ? props.selection : undefined,
      combinations: data.cs.v,
      combinationOptions: Array.isArray(props.combinations)
        ? {}
        : (props.combinations as GenerateSetCombinationsOptions<any>),
    },
    {
      compress: compress ? 'yes' : 'no',
    }
  );

  return toUpSetJSDump(dump, elems, props);
}

export function exportStaticDumpData(props: UpSetProps<any>, data: IDumpDataInfo, compress = false) {
  const dump = toStaticDump(
    {
      sets: props.sets,
      queries: props.queries?.filter((d): d is UpSetElemQuery | UpSetSetQuery => isElemQuery(d) || isSetQuery(d)) ?? [],
      selection: props.selection && isSetLike(props.selection) ? props.selection : undefined,
      combinations: data.cs.v,
    },
    {
      compress: compress ? 'yes' : 'no',
    }
  );

  return toUpSetJSStaticDump(dump, props);
}

export function exportDump(svg: SVGSVGElement, props: UpSetProps<any>, data: IDumpDataInfo) {
  const dump = exportDumpData(props, data);
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(dump, null, 2)], {
      type: 'application/json',
    })
  );
  downloadUrl(url, `${dump.name}.json`, svg.ownerDocument!);
  URL.revokeObjectURL(url);
}

export const MAX_URL_LENGTH = 2048 * 2;

export function exportSharedLink(props: UpSetProps<any>, data: IDumpDataInfo) {
  const r = exportDumpData(props, data, true);
  delete r.$schema;
  const arg = LZString.compressToEncodedURIComponent(JSON.stringify(r));
  const url = new URL('https://upset.js.org/app/embed.html');
  url.searchParams.set('p', arg);

  if (url.toString().length < MAX_URL_LENGTH) {
    window.open(url.toString(), '_blank');
    return true;
  }

  // try other compression
  const r2 = exportStaticDumpData(props, data, true);
  delete r2.$schema;
  const arg2 = LZString.compressToEncodedURIComponent(JSON.stringify(r2));
  url.searchParams.set('p', arg2);

  if (url.toString().length < MAX_URL_LENGTH) {
    window.open(url.toString(), '_blank');
    return true;
  }

  // send via frame message
  url.searchParams.delete('p');
  const w = window.open(url.toString(), '_blank');
  w?.addEventListener('load', () => {
    w?.postMessage(r, url.origin);
  });
  return false;
}

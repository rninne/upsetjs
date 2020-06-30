/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetCombinations, ISets } from '@upsetjs/model';
import venn0 from './data/venn0.json';
import venn1 from './data/venn1.json';
import venn2 from './data/venn2.json';
import venn3 from './data/venn3.json';
import venn4 from './data/venn4.json';
import { isEllipse, ITextArcSlice, ITextCircle, ITextEllipse, IVennDiagramLayoutGenerator } from './interfaces';

interface ILayout {
  circles: (ITextCircle | ITextEllipse)[];
  intersections: ITextArcSlice[];
  bb: { x: number; y: number; width: number; height: number };
}

export const vennDiagramLayout: IVennDiagramLayoutGenerator = {
  maxSets: 4,
  compute<T>(sets: ISets<T>, _combinations: ISetCombinations<T>, width: number, height: number) {
    const lookup = [venn0, venn1, venn2, venn3, venn4];
    const r = lookup[Math.min(lookup.length - 1, sets.length)] as ILayout;
    const f = Math.min(width / r.bb.width, height / r.bb.height);
    const x = f * r.bb.x + (width - f * r.bb.width);
    const y = f * r.bb.y + (height - f * r.bb.height);
    const mx = (v: number) => x + f * v;
    const my = (v: number) => y + f * v;

    return {
      sets: r.circles.map((c) =>
        Object.assign(
          {},
          c,
          {
            cx: mx(c.cx),
            cy: my(c.cy),
            text: {
              x: mx(c.text.x),
              y: my(c.text.y),
            },
          },
          isEllipse(c)
            ? {
                rx: mx(c.rx),
                ry: my(c.ry),
              }
            : {
                r: Math.min(mx(c.r), my(c.r)),
              }
        )
      ),
      intersections: r.intersections.map((c) => ({
        text: {
          x: mx(c.text.x),
          y: my(c.text.y),
        },
        x1: mx(c.x1),
        y1: my(c.y1),
        arcs: c.arcs.map((a) =>
          Object.assign({}, a, {
            rx: mx(a.rx),
            ry: my(a.ry),
            x2: mx(a.x2),
            y2: my(a.y2),
          })
        ),
      })),
    };
  },
};

import { describe, expect, it } from 'vitest';
import {
  coordinateToDMS,
  coordinatesToDMSTemplate,
  coordinatesToNumberTemplate,
  coordinatesToTemplate,
} from './format.js';

describe('format', () => {
  const xy = [7.1253, 46.7216];

  it('coordinatesToTemplate', () => {
    expect(coordinatesToTemplate(xy)).toEqual(`${xy[0]} ${xy[1]}`);
    expect(coordinatesToTemplate(xy, '{x}')).toEqual(`${xy[0]}`);
    expect(coordinatesToTemplate(xy, '{y}')).toEqual(`${xy[1]}`);
    expect(coordinatesToTemplate(xy, '{y}; {x}')).toEqual(`${xy[1]}; ${xy[0]}`);
    expect(coordinatesToTemplate([])).toEqual(` `);
    expect(coordinatesToTemplate([1.12])).toEqual(`1.12 `);
  });

  it('coordinateToDMS', () => {
    expect(coordinateToDMS(xy[0]!, 'EW')).toEqual('7° 07\' 31" E');
    expect(coordinateToDMS(xy[1]!, 'NS', 2)).toEqual('46° 43\' 17.76" N');
    expect(coordinateToDMS(-48.12, 'EW', 0)).toEqual('48° 07\' 12" W');
    expect(coordinateToDMS(-13.45, 'NS')).toEqual('13° 26\' 60" S');
  });

  it('coordinatesToDMSTemplate', () => {
    expect(coordinatesToDMSTemplate(xy)).toEqual('46° 43\' 18" N 7° 07\' 31" E');
    expect(coordinatesToDMSTemplate(xy, 4, '{x} / {y}')).toEqual(
      '46° 43\' 17.7600" N / 7° 07\' 31.0800" E',
    );
    expect(coordinatesToDMSTemplate([])).toEqual(' ');
    expect(coordinatesToDMSTemplate([xy[0]!])).toEqual('7° 07\' 31" E ');
  });

  it('coordinatesToNumberTemplate', () => {
    expect(coordinatesToNumberTemplate(xy)).toEqual('7 47');
    expect(coordinatesToNumberTemplate(xy, 1)).toEqual('7.1 46.7');
    expect(coordinatesToNumberTemplate([])).toEqual(' ');
    expect(coordinatesToNumberTemplate([xy[0]!])).toEqual('7 ');
  });
});

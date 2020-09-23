import React, {useState, useCallback} from 'react';
import { DEFAULT_TILESETS } from './App';

function Tileset({ index, tileset, setTileset, setFilter, setActive }) {
  return <div className={`tileset ${tileset.active ? '' : 'disabled'}`}>
    <span>
      {index > 0 && <input type="checkbox" checked={tileset.active} onChange={(event) => setActive(index, event.target.checked)} />}
    </span>
    <fieldset>
      <label htmlFor={`tileset_${index}`} />
      <input id={`tileset_${index}`} type="text" value={tileset.tileset} onChange={(event) => setTileset(index, event.target.value)} />
    </fieldset>
    <fieldset>
      <label htmlFor={`filters_${index}`}>filters</label>
      <input id={`filters_${index}`} type="text" value={tileset.filter} onChange={(event) => setFilter(index, event.target.value)} />
    </fieldset>
  </div>
}

export default function Tilesets({ onChange }) {
  const [tilesets, updateTilesets] = useState(DEFAULT_TILESETS)

  const setTileset = useCallback((index, tileset) => {
    const newTilesets = [...tilesets]
    newTilesets[index].tileset = tileset
    updateTilesets(newTilesets)
  })
  const setFilter = useCallback((index, filter) => {
    const newTilesets = [...tilesets]
    newTilesets[index].filter = filter
    updateTilesets(newTilesets)
  })
  const setActive = useCallback((index, active) => {
    const newTilesets = [...tilesets]
    newTilesets[index].active = active
    updateTilesets(newTilesets)
  })

  const [combinationMode, setCombinationMode] = useState('add')

  return <>
    {tilesets.map((tileset, i) => <Tileset key={i} index={i} tileset={tileset} setTileset={setTileset} setFilter={setFilter} setActive={setActive} />)}
    <select id="combinationMode" onChange={(event) => { setCombinationMode(event.target.value)}}>
      <option value="add">combine:add</option>
      <option value="compare">combine:compare</option>
      <option value="bivariate">combine:bivariate</option>
    </select>
    <button onClick={() => onChange(tilesets, combinationMode)}>ok</button>
  </>
}

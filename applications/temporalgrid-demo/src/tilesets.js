import React, {useState, useCallback} from 'react';
import { DEFAULT_SUBLAYERS } from './App';

function Sublayer({ index, sublayer, setDatasets, setFilter, setActive }) {
  return <div className={`tileset ${sublayer.active ? '' : 'disabled'}`}>
    <span>
      {index > 0 && <input type="checkbox" checked={sublayer.active} onChange={(event) => setActive(index, event.target.checked)} />}
    </span>
    <fieldset>
      <label htmlFor={`datsets_${index}`} />
      <input id={`datsets_${index}`} type="text" value={sublayer.datasets} onChange={(event) => setDatasets(index, event.target.value)} />
    </fieldset>
    <fieldset>
      <label htmlFor={`filters_${index}`}>filters</label>
      <input id={`filters_${index}`} type="text" value={sublayer.filter} onChange={(event) => setFilter(index, event.target.value)} />
    </fieldset>
  </div>
}

export default function Sublayers({ onChange }) {
  const [sublayers, updateSublayers] = useState(DEFAULT_SUBLAYERS)

  const setDatasets = useCallback((index, datasets) => {
    const newSublayers = [...sublayers]
    newSublayers[index].datasets = datasets
    updateSublayers(newSublayers)
  })
  const setFilter = useCallback((index, filter) => {
    const newSublayers = [...sublayers]
    newSublayers[index].filter = filter
    updateSublayers(newSublayers)
  })
  const setActive = useCallback((index, active) => {
    const newSublayers = [...sublayers]
    newSublayers[index].active = active
    updateSublayers(newSublayers)
  })

  const [combinationMode, setCombinationMode] = useState('add')

  return <>
    {sublayers.map((sublayer, i) => <Sublayer key={i} index={i} sublayer={sublayer} setDatasets={setDatasets} setFilter={setFilter} setActive={setActive} />)}
    <select id="combinationMode" onChange={(event) => { setCombinationMode(event.target.value)}}>
      <option value="add">combine:add</option>
      <option value="compare">combine:compare</option>
      <option value="bivariate">combine:bivariate</option>
    </select>
    <button onClick={() => onChange(sublayers, combinationMode)}>ok</button>
  </>
}

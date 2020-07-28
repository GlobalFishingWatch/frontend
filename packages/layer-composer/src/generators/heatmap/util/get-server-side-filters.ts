export default (start: string, end: string, serverSideFilter = '') => {
  const serverSideFiltersList = serverSideFilter ? [serverSideFilter] : []
  serverSideFiltersList.push(`timestamp >= '${start.slice(0, 19).replace('T', ' ')}'`)
  serverSideFiltersList.push(`timestamp <= '${end.slice(0, 19).replace('T', ' ')}'`)

  return serverSideFiltersList.join(' AND ')
}

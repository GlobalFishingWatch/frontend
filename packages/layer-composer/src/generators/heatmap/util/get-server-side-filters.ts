export default (start: string, end: string, serverSideFilter = '') => {
  return serverSideFilter
  // TODO remove once merged with latest @nerik changes moving dates to its own filter
  // const serverSideFiltersList = serverSideFilter ? [serverSideFilter] : []
  // if (start) {
  //   serverSideFiltersList.push(`timestamp >= '${start.slice(0, 19).replace('T', ' ')}'`)
  // }
  // if (end) {
  //   serverSideFiltersList.push(`timestamp <= '${end.slice(0, 19).replace('T', ' ')}'`)
  // }

  // return serverSideFiltersList.join(' AND ')
}

export function getTrackFromCsvQuery({
  lineId,
  pointId,
  fileName,
}: {
  lineId: string
  pointId: string
  fileName: string
}) {
  return [
    '-dialect',
    'SQLite',
    '-sql',
    `SELECT ${lineId}, ${pointId}, ST_Multi(MakeLine(geom)) AS geometry FROM
    (SELECT ${lineId}, ${pointId}, MakePoint(CAST(longitude AS float),CAST(latitude AS float)) AS geom
    FROM ${fileName} WHERE CAST(longitude AS float) <> 0 AND CAST(latitude AS float) <> 0
    ORDER BY ${lineId}, ${pointId})
  GROUP BY ${lineId}
  `,
  ]
}

# libs/data-transforms/src/list-to-track-segments/list-to-track-segments.test.ts · [[track-segment-processing-pipeline]]

- Columns · type · L89-L89 — Type definition specifying the required column names for latitude, longitude, start time, and line identifier in track data.
- readCsv · function · L94-L104 — Reads and parses a CSV file with dynamic typing and column name cleaning using the getFilterIdClean transformation.
- describeTrackCsv · function · L106-L173 — Factory function that creates a test suite for validating track segment conversion from CSV records, including column guessing, record validity, and point ordering.
- getPointsById · function · L119-L119 — Retrieves the points for a specific track line identifier from the processed segments.
- getExpectedPoints · function · L121-L129 — Extracts and sorts the expected points for a given line identifier by filtering records and converting timestamps to milliseconds.
- guess · function · L134-L135 — Helper function that guesses and cleans a column name from raw headers using the guessColumn utility.
- toSegments · function · L191-L196 — Converts track records into track segments using the configured column mappings and line color options.

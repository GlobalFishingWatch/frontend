---
'@globalfishingwatch/dataviews-client': major
'@globalfishingwatch/react-hooks': major
---

BREAKING CHANGE

In order to Support multiple dataviewsConfig for different dataviews in the same workspace, for example multiple vessels with same track-dataview, the types moves from key-value structure to an array with dataviewId and datasetId 



  SELECT jsonb_build_object(
    "id",
	jsonb_build_object(
		'id', "id",
	    'label',      "label"
		)
  ) as region FROM (SELECT distinct gfw_id as "id", name as "label" FROM public."wdpa_may_2021_marine_1623923366398" ORDER BY "name" ASC) row;


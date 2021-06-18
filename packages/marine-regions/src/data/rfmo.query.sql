
  SELECT jsonb_build_object(
    "id",
	jsonb_build_object(
		'id', "id",
	    'label',      "label"
		)
  ) as region FROM (SELECT distinct "id", "id" as "label" FROM public."tuna-rfmo" ORDER BY "id" ASC) row;


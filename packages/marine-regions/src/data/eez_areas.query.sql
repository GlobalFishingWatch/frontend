

    SELECT jsonb_build_object(
    "id",
	jsonb_build_object(
		'id', "id",
	    'label',      "label"
		)
    ) as region FROM (SELECT mrgid as "id", geoname as "label" FROM public.eez_areas ORDER BY "geoname" ASC) row;


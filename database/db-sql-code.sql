CREATE TYPE public.account_type AS ENUM
    ('Employee', 'Admin');

ALTER TYPE public.account_type
    OWNER TO cse340;



INSERT INTO public.classification (classification_name)
VALUES ('Custom'),
	('Suport'),
	('SUV'),
	('Truck'),
	('Sedan');
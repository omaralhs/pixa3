--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: capitals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.capitals (
    id integer NOT NULL,
    country character varying(45),
    capital character varying(45)
);


ALTER TABLE public.capitals OWNER TO postgres;

--
-- Name: capitals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.capitals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.capitals_id_seq OWNER TO postgres;

--
-- Name: capitals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.capitals_id_seq OWNED BY public.capitals.id;


--
-- Name: game; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game (
    id character(5) NOT NULL,
    submission_id integer,
    image_1_id integer,
    image_2_id integer,
    started boolean DEFAULT false,
    current_image integer DEFAULT 1
);


ALTER TABLE public.game OWNER TO postgres;

--
-- Name: game_submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game_submissions (
    game_id text NOT NULL,
    submission_id integer NOT NULL
);


ALTER TABLE public.game_submissions OWNER TO postgres;

--
-- Name: game_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game_users (
    game_id text NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.game_users OWNER TO postgres;

--
-- Name: images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.images (
    id integer NOT NULL,
    url text NOT NULL
);


ALTER TABLE public.images OWNER TO postgres;

--
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.images_id_seq OWNER TO postgres;

--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.images_id_seq OWNED BY public.images.id;


--
-- Name: submission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.submission (
    id integer NOT NULL,
    image_url character varying(255),
    prompt text,
    tip text,
    score double precision,
    user_name text,
    game_id character varying(10),
    trys integer DEFAULT 0,
    user_id integer
);


ALTER TABLE public.submission OWNER TO postgres;

--
-- Name: submission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.submission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.submission_id_seq OWNER TO postgres;

--
-- Name: submission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.submission_id_seq OWNED BY public.submission.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    firstname character varying(45),
    avatar text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: world_food; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.world_food (
    id integer NOT NULL,
    country character varying(45),
    rice_production double precision,
    wheat_production double precision
);


ALTER TABLE public.world_food OWNER TO postgres;

--
-- Name: world_food_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.world_food_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.world_food_id_seq OWNER TO postgres;

--
-- Name: world_food_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.world_food_id_seq OWNED BY public.world_food.id;


--
-- Name: capitals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capitals ALTER COLUMN id SET DEFAULT nextval('public.capitals_id_seq'::regclass);


--
-- Name: images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.images ALTER COLUMN id SET DEFAULT nextval('public.images_id_seq'::regclass);


--
-- Name: submission id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submission ALTER COLUMN id SET DEFAULT nextval('public.submission_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: world_food id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_food ALTER COLUMN id SET DEFAULT nextval('public.world_food_id_seq'::regclass);


--
-- Data for Name: capitals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.capitals (id, country, capital) FROM stdin;
1	Afghanistan	Kabul
2	Aland Islands	Mariehamn
3	Albania	Tirana
4	Algeria	Algiers
5	American Samoa	Pago Pago
6	Andorra	Andorra la Vella
7	Angola	Luanda
8	Anguilla	The Valley
9	Antarctica	\N
10	Antigua And Barbuda	St. John's
11	Argentina	Buenos Aires
12	Armenia	Yerevan
13	Aruba	Oranjestad
14	Australia	Canberra
15	Austria	Vienna
16	Azerbaijan	Baku
18	Bahrain	Manama
19	Bangladesh	Dhaka
20	Barbados	Bridgetown
21	Belarus	Minsk
22	Belgium	Brussels
23	Belize	Belmopan
24	Benin	Porto-Novo
25	Bermuda	Hamilton
26	Bhutan	Thimphu
27	Bolivia	Sucre
155	Bonaire, Sint Eustatius and Saba	Kralendijk
28	Bosnia and Herzegovina	Sarajevo
29	Botswana	Gaborone
30	Bouvet Island	\N
31	Brazil	Brasilia
32	British Indian Ocean Territory	Diego Garcia
33	Brunei	Bandar Seri Begawan
34	Bulgaria	Sofia
35	Burkina Faso	Ouagadougou
36	Burundi	Bujumbura
37	Cambodia	Phnom Penh
38	Cameroon	Yaounde
39	Canada	Ottawa
40	Cape Verde	Praia
41	Cayman Islands	George Town
42	Central African Republic	Bangui
43	Chad	N'Djamena
44	Chile	Santiago
45	China	Beijing
46	Christmas Island	Flying Fish Cove
47	Cocos (Keeling) Islands	West Island
48	Colombia	Bogotá
49	Comoros	Moroni
50	Congo	Brazzaville
52	Cook Islands	Avarua
53	Costa Rica	San Jose
54	Cote D'Ivoire (Ivory Coast)	Yamoussoukro
55	Croatia	Zagreb
56	Cuba	Havana
249	Curaçao	Willemstad
57	Cyprus	Nicosia
58	Czech Republic	Prague
51	Democratic Republic of the Congo	Kinshasa
59	Denmark	Copenhagen
60	Djibouti	Djibouti
61	Dominica	Roseau
62	Dominican Republic	Santo Domingo
63	East Timor	Dili
64	Ecuador	Quito
65	Egypt	Cairo
66	El Salvador	San Salvador
67	Equatorial Guinea	Malabo
68	Eritrea	Asmara
69	Estonia	Tallinn
70	Ethiopia	Addis Ababa
71	Falkland Islands	Stanley
72	Faroe Islands	Torshavn
73	Fiji Islands	Suva
74	Finland	Helsinki
75	France	Paris
76	French Guiana	Cayenne
77	French Polynesia	Papeete
78	French Southern Territories	Port-aux-Francais
79	Gabon	Libreville
80	Gambia The	Banjul
81	Georgia	Tbilisi
82	Germany	Berlin
83	Ghana	Accra
84	Gibraltar	Gibraltar
85	Greece	Athens
86	Greenland	Nuuk
87	Grenada	St. George's
88	Guadeloupe	Basse-Terre
89	Guam	Hagatna
90	Guatemala	Guatemala City
91	Guernsey and Alderney	St Peter Port
92	Guinea	Conakry
93	Guinea-Bissau	Bissau
94	Guyana	Georgetown
95	Haiti	Port-au-Prince
96	Heard Island and McDonald Islands	\N
97	Honduras	Tegucigalpa
98	Hong Kong S.A.R.	Hong Kong
99	Hungary	Budapest
100	Iceland	Reykjavik
101	India	New Delhi
102	Indonesia	Jakarta
103	Iran	Tehran
104	Iraq	Baghdad
105	Ireland	Dublin
106	Israel	Jerusalem
107	Italy	Rome
108	Jamaica	Kingston
109	Japan	Tokyo
110	Jersey	Saint Helier
111	Jordan	Amman
112	Kazakhstan	Astana
113	Kenya	Nairobi
114	Kiribati	Tarawa
248	Kosovo	Pristina
117	Kuwait	Kuwait City
118	Kyrgyzstan	Bishkek
119	Laos	Vientiane
120	Latvia	Riga
121	Lebanon	Beirut
122	Lesotho	Maseru
123	Liberia	Monrovia
124	Libya	Tripolis
125	Liechtenstein	Vaduz
126	Lithuania	Vilnius
127	Luxembourg	Luxembourg
128	Macau S.A.R.	Macao
130	Madagascar	Antananarivo
131	Malawi	Lilongwe
132	Malaysia	Kuala Lumpur
133	Maldives	Male
134	Mali	Bamako
135	Malta	Valletta
136	Man (Isle of)	Douglas, Isle of Man
137	Marshall Islands	Majuro
138	Martinique	Fort-de-France
139	Mauritania	Nouakchott
140	Mauritius	Port Louis
141	Mayotte	Mamoudzou
142	Mexico	Ciudad de México
143	Micronesia	Palikir
144	Moldova	Chisinau
145	Monaco	Monaco
146	Mongolia	Ulan Bator
147	Montenegro	Podgorica
148	Montserrat	Plymouth
149	Morocco	Rabat
150	Mozambique	Maputo
151	Myanmar	Nay Pyi Taw
152	Namibia	Windhoek
153	Nauru	Yaren
154	Nepal	Kathmandu
156	Netherlands	Amsterdam
157	New Caledonia	Noumea
158	New Zealand	Wellington
159	Nicaragua	Managua
160	Niger	Niamey
161	Nigeria	Abuja
162	Niue	Alofi
163	Norfolk Island	Kingston
115	North Korea	Pyongyang
129	North Macedonia	Skopje
164	Northern Mariana Islands	Saipan
165	Norway	Oslo
166	Oman	Muscat
167	Pakistan	Islamabad
168	Palau	Melekeok
169	Palestinian Territory Occupied	East Jerusalem
170	Panama	Panama City
171	Papua new Guinea	Port Moresby
172	Paraguay	Asuncion
173	Peru	Lima
174	Philippines	Manila
175	Pitcairn Island	Adamstown
176	Poland	Warsaw
177	Portugal	Lisbon
178	Puerto Rico	San Juan
179	Qatar	Doha
180	Reunion	Saint-Denis
181	Romania	Bucharest
182	Russia	Moscow
183	Rwanda	Kigali
184	Saint Helena	Jamestown
185	Saint Kitts And Nevis	Basseterre
186	Saint Lucia	Castries
187	Saint Pierre and Miquelon	Saint-Pierre
188	Saint Vincent And The Grenadines	Kingstown
189	Saint-Barthelemy	Gustavia
190	Saint-Martin (French part)	Marigot
191	Samoa	Apia
192	San Marino	San Marino
193	Sao Tome and Principe	Sao Tome
194	Saudi Arabia	Riyadh
195	Senegal	Dakar
196	Serbia	Belgrade
197	Seychelles	Victoria
198	Sierra Leone	Freetown
199	Singapore	Singapur
250	Sint Maarten (Dutch part)	Philipsburg
200	Slovakia	Bratislava
201	Slovenia	Ljubljana
202	Solomon Islands	Honiara
203	Somalia	Mogadishu
204	South Africa	Pretoria
205	South Georgia	Grytviken
116	South Korea	Seoul
206	South Sudan	Juba
207	Spain	Madrid
208	Sri Lanka	Colombo
209	Sudan	Khartoum
210	Suriname	Paramaribo
211	Svalbard And Jan Mayen Islands	Longyearbyen
212	Swaziland	Mbabane
213	Sweden	Stockholm
214	Switzerland	Bern
215	Syria	Damascus
216	Taiwan	Taipei
217	Tajikistan	Dushanbe
218	Tanzania	Dodoma
219	Thailand	Bangkok
17	The Bahamas	Nassau
220	Togo	Lome
221	Tokelau	\N
222	Tonga	Nuku'alofa
223	Trinidad And Tobago	Port of Spain
224	Tunisia	Tunis
225	Turkey	Ankara
226	Turkmenistan	Ashgabat
227	Turks And Caicos Islands	Cockburn Town
228	Tuvalu	Funafuti
229	Uganda	Kampala
230	Ukraine	Kyiv
231	United Arab Emirates	Abu Dhabi
232	United Kingdom	London
233	United States	Washington
234	United States Minor Outlying Islands	\N
235	Uruguay	Montevideo
236	Uzbekistan	Tashkent
237	Vanuatu	Port Vila
238	Vatican City State (Holy See)	Vatican City
239	Venezuela	Caracas
240	Vietnam	Hanoi
241	Virgin Islands (British)	Road Town
242	Virgin Islands (US)	Charlotte Amalie
243	Wallis And Futuna Islands	Mata Utu
244	Western Sahara	El-Aaiun
245	Yemen	Sanaa
246	Zambia	Lusaka
247	Zimbabwe	Harare
\.


--
-- Data for Name: game; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.game (id, submission_id, image_1_id, image_2_id, started, current_image) FROM stdin;
46281	\N	\N	\N	f	1
97277	\N	\N	\N	f	1
62119	\N	\N	\N	f	1
69565	\N	\N	\N	f	1
33695	\N	\N	\N	f	1
96688	\N	\N	\N	f	1
39184	\N	\N	\N	f	1
58045	\N	\N	\N	f	1
68460	\N	\N	\N	f	1
28860	\N	\N	\N	f	1
57472	\N	\N	\N	f	1
12069	\N	\N	\N	f	1
74561	\N	\N	\N	f	1
48183	\N	\N	\N	f	1
20065	\N	\N	\N	f	1
44158	\N	4	5	t	1
12345	\N	\N	\N	t	2
14609	\N	4	\N	t	1
17729	\N	6	5	t	1
\.


--
-- Data for Name: game_submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.game_submissions (game_id, submission_id) FROM stdin;
\.


--
-- Data for Name: game_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.game_users (game_id, user_id) FROM stdin;
12345	47
12345	69
12345	50
12345	51
12345	52
12345	53
12345	54
12345	55
12345	56
12345	57
12345	58
12345	59
\.


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.images (id, url) FROM stdin;
4	https://im.runware.ai/image/ii/d00128d3-8510-44a9-8b45-ee272e08e43f.JPG?_gl=1*196vanw*_gcl_au*MTQ3MjA4MDU3OS4xNzUzNTQwMDMyLjczODY4ODEzMC4xNzU0MzMzOTU2LjE3NTQzMzM5NTY.
5	https://im.runware.ai/image/ii/695d4a90-64a9-41ca-9496-8f1285598513.JPG?_gl=1*1d82n50*_gcl_au*MTQ3MjA4MDU3OS4xNzUzNTQwMDMyLjczODY4ODEzMC4xNzU0MzMzOTU2LjE3NTQzMzM5NTY.
6	https://im.runware.ai/image/ii/40021615-a973-4177-830a-bfe48d7a93c4.JPEG?_gl=1*xb0v6p*_gcl_au*MTQ3MjA4MDU3OS4xNzUzNTQwMDMyLjczODY4ODEzMC4xNzU0MzMzOTU2LjE3NTQzMzM5NTY.
\.


--
-- Data for Name: submission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.submission (id, image_url, prompt, tip, score, user_name, game_id, trys, user_id) FROM stdin;
1	https://i.postimg.cc/RVzww2Nn/3bb6163c-88e8-4ea9-8865-013d26e192e2.jpg	A surreal, imaginative scene of a World War II bomber plane flying in the sky, but instead of a regular nose, the front of the plane is fused with the head of a fierce crocodile, mouth open with sharp teeth visible. The plane’s propellers are spinning, and it’s carrying a large bomb hanging beneath it by a cable. The background shows a bright blue sky with scattered clouds, blending military and animalistic elements in a fantastical, slightly humorous style.	add more about the background	95	John Doe	\N	\N	\N
36	https://im.runware.ai/image/ws/2/ii/6a274efd-ae9d-4e31-8527-b6bc49d50b37.jpg	CAR	GOOD PROMPT MY BOY	77	RAN M	12345	2	529
37	https://im.runware.ai/image/ws/2/ii/51ae704a-3c9b-4565-b8a5-a5ef3d4d4106.jpg	car	GOOD PROMPT MY BOY	77	RAN M	12345	2	529
2	https://i.postimg.cc/tCtWkDxv/7c3feade-2378-44ec-8fe7-0c3470a1a614.jpg	A serene sunset over a calm lake, with mountains in the background and a small wooden boat floating near the shore.	you dont know how to write prompts	40	Jane Smith	\N	\N	\N
3	https://i.imgur.com/r9Ld7HQ.jpeg	A squirrel wearing a superhero cape, flying through a forest while holding a bunch of acorns. The trees are tall and majestic, and the squirrel looks proud and ready for adventure	i like the squirrel	70	Alice Johnson	\N	\N	\N
4	https://im.runware.ai/image/ws/2/ii/73cc0d5a-ef75-4e81-8ebf-5f143d92f77b.jpg	dog	77	NaN	GOOD PROMPT MY BOY	\N	\N	\N
7	https://im.runware.ai/image/ws/2/ii/0b49b306-0664-4f9b-af4b-640d2c93e07c.jpg	phone	GOOD PROMPT MY BOY	77	RAN M	\N	\N	\N
8	https://im.runware.ai/image/ws/2/ii/0b49b306-0664-4f9b-af4b-640d2c93e07c.jpg	phone	GOOD PROMPT MY BOY	77	RAN M	\N	\N	\N
9	https://im.runware.ai/image/ws/2/ii/0b49b306-0664-4f9b-af4b-640d2c93e07c.jpg	phone	GOOD PROMPT MY BOY	77	RAN M	\N	\N	\N
12	https://im.runware.ai/image/ws/2/ii/ae06098d-2b4f-4693-a25f-dc78e630a3cc.jpg	dog	GOOD PROMPT MY BOY	77	RAN M	\N	\N	\N
13	https://im.runware.ai/image/ws/2/ii/3f50717a-7597-4119-8e4a-ba8759a079f1.jpg	cat	GOOD PROMPT MY BOY	77	RAN M	\N	\N	\N
14	https://im.runware.ai/image/ws/2/ii/70c84b21-9e7a-42cd-8065-245b09456d4d.jpg	pc	GOOD PROMPT MY BOY	77	RAN M	\N	\N	\N
15	https://im.runware.ai/image/ws/2/ii/28b715fc-085d-47b4-b37a-d667f3a57ead.jpg	cat	GOOD PROMPT MY BOY	77	RAN M	\N	\N	\N
16	https://im.runware.ai/image/ws/2/ii/e66e8c9e-ba46-4cc4-9133-026c8e3f9a03.jpg	car	GOOD PROMPT MY BOY	77	RAN M	12345	\N	\N
17	https://im.runware.ai/image/ws/2/ii/e66e8c9e-ba46-4cc4-9133-026c8e3f9a03.jpg	car	GOOD PROMPT MY BOY	77	RAN M	12345	\N	\N
18	https://im.runware.ai/image/ws/2/ii/74d21223-4dad-44a6-b287-aed1567b817f.jpg	icecream	GOOD PROMPT MY BOY	77	RAN M	12345	\N	\N
19	https://im.runware.ai/image/ws/2/ii/6aca00e3-149b-41b8-a2e8-a77884e7bf87.jpg	dog	GOOD PROMPT MY BOY	77	RAN M	12345	\N	\N
20	https://im.runware.ai/image/ws/2/ii/45c20e69-f93d-4489-a21a-7c218276171d.jpg	dog	GOOD PROMPT MY BOY	77	RAN M	12345	0	\N
21	https://im.runware.ai/image/ws/2/ii/45c20e69-f93d-4489-a21a-7c218276171d.jpg	dog	GOOD PROMPT MY BOY	77	RAN M	12345	2	\N
23	https://im.runware.ai/image/ws/2/ii/b1ff259a-9081-4bc6-b13f-32a295658620.jpg	football	GOOD PROMPT MY BOY	77	RAN M	20065	1	\N
24	https://im.runware.ai/image/ws/2/ii/b1ff259a-9081-4bc6-b13f-32a295658620.jpg	football	GOOD PROMPT MY BOY	77	RAN M	20065	2	\N
25	https://im.runware.ai/image/ws/2/ii/f5f12925-7cf3-4e91-8a4f-2e134ed012a4.jpg	car	GOOD PROMPT MY BOY	77	RAN M	20065	2	\N
26	https://im.runware.ai/image/ws/2/ii/b3023894-9fb4-46b4-84b1-d09ac74e0a43.jpg	food	GOOD PROMPT MY BOY	77	RAN M	20065	2	\N
27	https://im.runware.ai/image/ws/2/ii/1cc3671f-040a-4b24-8be8-c34bc7b76304.jpg	car	GOOD PROMPT MY BOY	77	RAN M	12345	2	494
28	https://im.runware.ai/image/ws/2/ii/650c2115-52dd-405c-986b-476b915ab586.jpg	cat	GOOD PROMPT MY BOY	77	RAN M	12345	2	502
29	https://im.runware.ai/image/ws/2/ii/bc2cf0a0-bea5-4bac-b9d0-e3c53f414af0.jpg	number	GOOD PROMPT MY BOY	77	RAN M	12345	2	508
30	https://im.runware.ai/image/ws/2/ii/7448ab5a-413e-4700-a136-0532c775d941.jpg	car	GOOD PROMPT MY BOY	77	RAN M	12345	2	512
31	https://im.runware.ai/image/ws/2/ii/818c16de-03fa-456e-8840-9205b8e2cd9a.jpg	car	GOOD PROMPT MY BOY	77	RAN M	12345	2	514
32	https://im.runware.ai/image/ws/2/ii/4d51161f-6946-41ac-8f65-b1b87f4963d8.jpg	CAR	GOOD PROMPT MY BOY	77	RAN M	12345	2	517
33	https://im.runware.ai/image/ws/2/ii/4f78967e-256f-45e9-babf-83bb75b9bf24.jpg	DOG	GOOD PROMPT MY BOY	77	RAN M	12345	2	520
34	https://im.runware.ai/image/ws/2/ii/128368cf-202d-4983-a061-798862e676d7.jpg	CC	GOOD PROMPT MY BOY	77	RAN M	12345	2	523
35	https://im.runware.ai/image/ws/2/ii/c5e20443-c95f-496e-8517-308a5c7a9531.jpg	AAA	GOOD PROMPT MY BOY	77	RAN M	12345	2	523
38	https://im.runware.ai/image/ws/2/ii/54812cb3-df19-45b2-b5c4-22c847349c8b.jpg	dog	GOOD PROMPT MY BOY	77	RAN M	12345	2	533
39	https://im.runware.ai/image/ws/2/ii/a74b6099-9d9f-4121-bda8-730b3203cc7f.jpg	123	GOOD PROMPT MY BOY	77	RAN M	12345	2	536
40	https://im.runware.ai/image/ws/2/ii/ed7f24e4-0272-4b82-918e-489dded8b435.jpg	aaa	GOOD PROMPT MY BOY	77	RAN M	12345	2	539
41	https://im.runware.ai/image/ws/2/ii/44cce539-af65-4436-a355-1e5d9e0633a3.jpg	qwe	GOOD PROMPT MY BOY	77	RAN M	12345	1	542
42	https://im.runware.ai/image/ws/2/ii/2af52c2b-139b-4559-94e0-9ffb63dbbf01.jpg	dog	GOOD PROMPT MY BOY	77	RAN M	12345	1	542
43	https://im.runware.ai/image/ws/2/ii/2af52c2b-139b-4559-94e0-9ffb63dbbf01.jpg	dog	GOOD PROMPT MY BOY	77	RAN M	12345	1	542
44	https://im.runware.ai/image/ws/2/ii/5d64bd6a-507f-4713-b7e0-6d49edb73596.jpg	car	GOOD PROMPT MY BOY	77	RAN M	12345	1	549
45	https://im.runware.ai/image/ws/2/ii/39e789a8-2725-4f0c-9a83-4baf1ea28205.jpg	dog	GOOD PROMPT MY BOY	77	RAN M	12345	2	549
72	https://im.runware.ai/image/ws/2/ii/4815c9d4-7297-4ba4-bd8e-1c9e85b14682.jpg	car	GOOD PROMPT MY BOY	77	RAN M	12345	1	561
73	https://im.runware.ai/image/ws/2/ii/016f04c6-95a8-472d-8173-90764793d59f.jpg	submit	GOOD PROMPT MY BOY	77	RAN M	12345	2	561
74	https://im.runware.ai/image/ws/2/ii/cee8ac9a-ed8d-4965-b4f6-fa3f7e595dc4.jpg	car	GOOD PROMPT MY BOY	77	RAN M	12345	1	761
75	https://im.runware.ai/image/ws/2/ii/e18bfd61-70a5-4297-a967-28fc3cbe4e01.jpg	cat	GOOD PROMPT MY BOY	77	RAN M	12345	2	761
76	https://im.runware.ai/image/ws/2/ii/d435a44a-049a-4afc-ab56-4107d0b49f12.jpg	car	GOOD PROMPT MY BOY	77	RAN M	12345	1	764
77	https://im.runware.ai/image/ws/2/ii/23e4b1b4-1b95-4865-95ee-826cc505baf6.jpg	cat	GOOD PROMPT MY BOY	77	RAN M	12345	1	773
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, firstname, avatar) FROM stdin;
33	\N	\N
34	\N	\N
35	\N	\N
36	\N	\N
37	\N	\N
38	\N	\N
39	\N	\N
40	\N	\N
41	\N	\N
42	\N	\N
43	\N	\N
44	\N	\N
45	\N	\N
46	\N	\N
47	omar	https://api.dicebear.com/9.x/bottts/svg?seed=4
48	\N	\N
49	\N	\N
50	\N	\N
51	\N	\N
52	\N	\N
53	\N	\N
56	\N	\N
57	\N	\N
58	\N	\N
59	\N	\N
60	\N	\N
61	\N	\N
62	\N	\N
63	\N	\N
64	\N	\N
65	\N	\N
66	\N	\N
67	\N	\N
68	\N	\N
69	maya	https://api.dicebear.com/9.x/bottts/svg?seed=19
70	\N	\N
71	\N	\N
72	ran	https://api.dicebear.com/9.x/bottts/svg?seed=-2
73	\N	\N
74	\N	\N
75		
76		
77		
78		
79		
80		
81		
82		
83		
84		
85		
86		
87		
88		
89		
90		
91		
92		
93		
94		
95		
96		
97		
98		
99		
100		
101		
102		
103		
104		
105		
106		
107		
108		
109		
110		
111		
112		
113		
114		
115		
116		
117		
118		
119		
120		
121		
122		
123		
124		
125		
126		
127		
128		
129		
130		
131		
132		
133		
134		
135		
136		
137		
138		
139		
140		
141		
142		
143		
144		
145		
146		
147		
148		
149		
150		
151		
152		
153		
154		
155		
156		
157		
158		
159		
160		
161		
162		
163		
164		
165		
166		
167		
168		
169		
170		
171		
172		
173		
174		
175		
176		
177		
178		
179		
180		
181		
182		
183		
184		
185		
186		
187		
188		
189		
190		
191		
192		
193		
194		
195		
196		
197		
198		
199		
200		
201		
202		
203		
204		
205		
206		
207		
208		
209		
210		
211		
212		
213		
214		
215		
216		
217		
218		
219		
54	omar	https://api.dicebear.com/9.x/bottts/svg?seed=2
55	omar alhsnat alhsnat 	https://api.dicebear.com/9.x/bottts/svg?seed=7
220		
221		
222		
223		
224		
225		
226		
227		
228		
229		
230		
231		
232		
233		
234		
235		
236		
237		
238		
239		
240		
241		
242		
243		
244		
245		
246		
247		
248		
249		
250		
251		
252		
253		
254		
255		
256		
257		
258		
259		
260		
261		
262		
263		
264		
265		
266		
267		
268		
269		
270		
271		
272		
273		
274		
275		
276		
277		
278		
279		
280		
281		
282		
283		
284		
285		
286		
287		
288		
289		
290		
291		
292		
293		
294		
295		
296		
297		
298		
299		
300		
301		
302		
303		
304		
305		
306		
307		
308		
309		
310		
311		
312		
313		
314		
315		
316		
317		
318		
319		
320		
321		
322		
323		
324		
325		
326		
327		
328		
329		
330		
331		
332		
333		
334		
335		
336		
337		
338		
339		
340		
341		
342		
343		
344		
345		
346		
347		
348		
349		
350		
351		
352		
353		
354		
355		
356		
357		
358		
359		
360		
361		
362		
363		
364		
365		
366		
367		
368		
369		
370		
371		
372		
373		
374		
375		
376		
377		
378		
379		
380		
381		
382		
383		
384		
385		
386		
387		
388		
389		
390		
391		
392		
393		
394		
395		
396		
397		
398		
399		
400		
401		
402		
403		
404		
405		
406		
407		
408		
409		
410		
411		
412		
413		
414		
415		
416		
417		
418		
419		
420		
421		
422		
423		
424		
425		
426		
427		
428		
429		
430		
431		
432		
433		
434		
435		
436		
437		
438		
439		
440		
441		
442		
443		
444		
445		
446		
447		
448		
449		
450		
451		
452		
453		
454		
455		
456		
457		
458		
459		
460		
461		
462		
463		
464		
465		
466		
467		
468		
469		
470		
471		
472		
473		
474		
475		
476		
477		
478		
479		
480		
481		
482		
483		
484		
485		
486		
487		
488		
489		
490		
491		
492		
493		
494		
495		
496		
497		
498		
499		
500		
501		
502		
503		
504		
505		
506		
507		
508		
509		
510		
511		
512		
513		
514		
515		
516		
517		
518		
519		
520		
521		
522		
523		
524		
525		
526		
527		
528		
529		
530		
531		
532		
533		
534		
535		
536		
537		
538		
539		
540		
541		
542		
543		
544		
545		
546		
547		
548		
549		
550		
551		
552		
553		
554		
555		
556		
557		
558		
559		
560		
561		
562		
563		
564		
565		
566		
567		
568		
569		
570		
571		
572		
573		
574		
575		
576		
577		
578		
579		
580		
581		
582		
583		
584		
585		
586		
587		
588		
589		
590		
591		
592		
593		
594		
595		
596		
597		
598		
599		
600		
601		
602		
603		
604		
605		
606		
607		
608		
609		
610		
611		
612		
613		
614		
615		
616		
617		
618		
619		
620		
621		
622		
623		
624		
625		
626		
627		
628		
629		
630		
631		
632		
633		
634		
635		
636		
637		
638		
639		
640		
641		
642		
643		
644		
645		
646		
647		
648		
649		
650		
651		
652		
653		
654		
655		
656		
657		
658		
659		
660		
661		
662		
663		
664		
665		
666		
667		
668		
669		
670		
671		
672		
673		
674		
675		
676		
677		
678		
679		
680		
681		
682		
683		
684		
685		
686		
687		
688		
689		
690		
691		
692		
693		
694		
695		
696		
697		
698		
699		
700		
701		
702		
703		
704		
705		
706		
707		
708		
709		
710		
711		
712		
713		
714		
715		
716		
717		
718		
719		
720		
721		
722		
723		
724		
725		
726		
727		
728		
729		
730		
731		
732		
733		
734		
735		
736		
737		
738		
739		
740		
741		
742		
761	omar11	https://api.dicebear.com/9.x/bottts/svg?seed=1
762		
763		
764		
765		
766		
767		
768		
769		
770		
771		
772		
773	qqqqqq	https://api.dicebear.com/9.x/bottts/svg?seed=23
774		
775		
776		
777		
778		
779		
780		
781		
782		
783		
784		
785		
786		
787		
788		
789		
790		
791		
792		
793		
794		
795		
796		
797		
798		
799		
800		
801		
802	qwe	https://api.dicebear.com/9.x/bottts/svg?seed=4
\.


--
-- Data for Name: world_food; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.world_food (id, country, rice_production, wheat_production) FROM stdin;
1	Australia	0.42	31.9
2	Brazil	13.98	7.9
3	China	212.84	136.9
4	Ethiopia	0.2	5.2
5	India	195.43	109.6
6	Iran	1.6	10.1
7	Pakistan	13.98	27.5
8	Ukraine	0.05	32.2
9	United States	8.7	44.8
\.


--
-- Name: capitals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.capitals_id_seq', 1, false);


--
-- Name: images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.images_id_seq', 36, true);


--
-- Name: submission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.submission_id_seq', 77, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 802, true);


--
-- Name: world_food_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.world_food_id_seq', 9, true);


--
-- Name: capitals capitals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capitals
    ADD CONSTRAINT capitals_pkey PRIMARY KEY (id);


--
-- Name: game_submissions game_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_submissions
    ADD CONSTRAINT game_submissions_pkey PRIMARY KEY (game_id, submission_id);


--
-- Name: game_users game_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_users
    ADD CONSTRAINT game_users_pkey PRIMARY KEY (game_id, user_id);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: game submission_images_pair_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT submission_images_pair_pkey PRIMARY KEY (id);


--
-- Name: submission submission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submission
    ADD CONSTRAINT submission_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: world_food world_food_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_food
    ADD CONSTRAINT world_food_pkey PRIMARY KEY (id);


--
-- Name: submission fk_game; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submission
    ADD CONSTRAINT fk_game FOREIGN KEY (game_id) REFERENCES public.game(id) ON DELETE CASCADE;


--
-- Name: submission fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submission
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: game_submissions game_submissions_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_submissions
    ADD CONSTRAINT game_submissions_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.game(id);


--
-- Name: game_submissions game_submissions_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_submissions
    ADD CONSTRAINT game_submissions_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submission(id);


--
-- Name: game_users game_users_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_users
    ADD CONSTRAINT game_users_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.game(id) ON DELETE CASCADE;


--
-- Name: game_users game_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_users
    ADD CONSTRAINT game_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: game submission_images_pair_image_1_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT submission_images_pair_image_1_id_fkey FOREIGN KEY (image_1_id) REFERENCES public.images(id) ON DELETE SET NULL;


--
-- Name: game submission_images_pair_image_2_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT submission_images_pair_image_2_id_fkey FOREIGN KEY (image_2_id) REFERENCES public.images(id) ON DELETE SET NULL;


--
-- Name: game submission_images_pair_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT submission_images_pair_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submission(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


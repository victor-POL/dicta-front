--
-- PostgreSQL database dump
--

\restrict zK3lDlOeeIvgeNhe6AWJ1s1dOX5bHkLfJryghYtn97pxsaHSFKFn5VRngGARDvJ

-- Dumped from database version 16.10 (Debian 16.10-1.pgdg13+1)
-- Dumped by pg_dump version 16.10 (Debian 16.10-1.pgdg13+1)

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

ALTER TABLE IF EXISTS ONLY negocio.usuario_estudio DROP CONSTRAINT IF EXISTS fk_usuario_estudio_usuario;
ALTER TABLE IF EXISTS ONLY negocio.usuario_estudio DROP CONSTRAINT IF EXISTS fk_usuario_estudio_estudio;
ALTER TABLE IF EXISTS ONLY negocio.transcripcion DROP CONSTRAINT IF EXISTS fk_transcripcion_usuario;
ALTER TABLE IF EXISTS ONLY negocio.transcripcion DROP CONSTRAINT IF EXISTS fk_transcripcion_audiencia;
ALTER TABLE IF EXISTS ONLY negocio.expediente DROP CONSTRAINT IF EXISTS fk_expediente_estudio;
ALTER TABLE IF EXISTS ONLY negocio.estudio DROP CONSTRAINT IF EXISTS fk_estudio_propietario;
ALTER TABLE IF EXISTS ONLY negocio.equipo_miembro DROP CONSTRAINT IF EXISTS fk_equipo_miembro_usuario;
ALTER TABLE IF EXISTS ONLY negocio.equipo_miembro DROP CONSTRAINT IF EXISTS fk_equipo_miembro_equipo;
ALTER TABLE IF EXISTS ONLY negocio.equipo DROP CONSTRAINT IF EXISTS fk_equipo_estudio;
ALTER TABLE IF EXISTS ONLY negocio.audiencia DROP CONSTRAINT IF EXISTS fk_audiencia_expediente;
ALTER TABLE IF EXISTS ONLY negocio.usuario DROP CONSTRAINT IF EXISTS usuario_pkey;
ALTER TABLE IF EXISTS ONLY negocio.usuario_estudio DROP CONSTRAINT IF EXISTS usuario_estudio_pkey;
ALTER TABLE IF EXISTS ONLY negocio.usuario DROP CONSTRAINT IF EXISTS usuario_email_key;
ALTER TABLE IF EXISTS ONLY negocio.usuario_estudio DROP CONSTRAINT IF EXISTS uk_usuario_estudio;
ALTER TABLE IF EXISTS ONLY negocio.audiencia DROP CONSTRAINT IF EXISTS uk_titulo_expediente;
ALTER TABLE IF EXISTS ONLY negocio.expediente DROP CONSTRAINT IF EXISTS uk_expediente_numero_estudio;
ALTER TABLE IF EXISTS ONLY negocio.equipo_miembro DROP CONSTRAINT IF EXISTS uk_equipo_miembro;
ALTER TABLE IF EXISTS ONLY negocio.transcripcion DROP CONSTRAINT IF EXISTS transcripcion_pkey;
ALTER TABLE IF EXISTS ONLY negocio.transcripcion DROP CONSTRAINT IF EXISTS transcripcion_hash_key;
ALTER TABLE IF EXISTS ONLY negocio.expediente DROP CONSTRAINT IF EXISTS expediente_pkey;
ALTER TABLE IF EXISTS ONLY negocio.estudio DROP CONSTRAINT IF EXISTS estudio_pkey;
ALTER TABLE IF EXISTS ONLY negocio.equipo DROP CONSTRAINT IF EXISTS equipo_pkey;
ALTER TABLE IF EXISTS ONLY negocio.equipo_miembro DROP CONSTRAINT IF EXISTS equipo_miembro_pkey;
ALTER TABLE IF EXISTS ONLY negocio.audiencia DROP CONSTRAINT IF EXISTS audiencia_pkey;
ALTER TABLE IF EXISTS negocio.usuario_estudio ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS negocio.usuario ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS negocio.transcripcion ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS negocio.expediente ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS negocio.estudio ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS negocio.equipo_miembro ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS negocio.equipo ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS negocio.audiencia ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS negocio.usuario_id_seq;
DROP SEQUENCE IF EXISTS negocio.usuario_estudio_id_seq;
DROP TABLE IF EXISTS negocio.usuario_estudio;
DROP TABLE IF EXISTS negocio.usuario;
DROP SEQUENCE IF EXISTS negocio.transcripcion_id_seq;
DROP TABLE IF EXISTS negocio.transcripcion;
DROP SEQUENCE IF EXISTS negocio.expediente_id_seq;
DROP TABLE IF EXISTS negocio.expediente;
DROP SEQUENCE IF EXISTS negocio.estudio_id_seq;
DROP TABLE IF EXISTS negocio.estudio;
DROP SEQUENCE IF EXISTS negocio.equipo_miembro_id_seq;
DROP TABLE IF EXISTS negocio.equipo_miembro;
DROP SEQUENCE IF EXISTS negocio.equipo_id_seq;
DROP TABLE IF EXISTS negocio.equipo;
DROP SEQUENCE IF EXISTS negocio.audiencia_id_seq;
DROP TABLE IF EXISTS negocio.audiencia;
DROP SCHEMA IF EXISTS negocio;
--
-- Name: negocio; Type: SCHEMA; Schema: -; Owner: dicta
--

CREATE SCHEMA negocio;


ALTER SCHEMA negocio OWNER TO dicta;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audiencia; Type: TABLE; Schema: negocio; Owner: dicta
--

CREATE TABLE negocio.audiencia (
    id integer NOT NULL,
    titulo character varying(300) NOT NULL,
    fecha_hora timestamp with time zone NOT NULL,
    lugar character varying(200),
    descripcion text,
    expediente_id integer NOT NULL
);


ALTER TABLE negocio.audiencia OWNER TO dicta;

--
-- Name: audiencia_id_seq; Type: SEQUENCE; Schema: negocio; Owner: dicta
--

CREATE SEQUENCE negocio.audiencia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE negocio.audiencia_id_seq OWNER TO dicta;

--
-- Name: audiencia_id_seq; Type: SEQUENCE OWNED BY; Schema: negocio; Owner: dicta
--

ALTER SEQUENCE negocio.audiencia_id_seq OWNED BY negocio.audiencia.id;


--
-- Name: equipo; Type: TABLE; Schema: negocio; Owner: dicta
--

CREATE TABLE negocio.equipo (
    id integer NOT NULL,
    nombre character varying(200) NOT NULL,
    descripcion text,
    estudio_id integer NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE negocio.equipo OWNER TO dicta;

--
-- Name: equipo_id_seq; Type: SEQUENCE; Schema: negocio; Owner: dicta
--

CREATE SEQUENCE negocio.equipo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE negocio.equipo_id_seq OWNER TO dicta;

--
-- Name: equipo_id_seq; Type: SEQUENCE OWNED BY; Schema: negocio; Owner: dicta
--

ALTER SEQUENCE negocio.equipo_id_seq OWNED BY negocio.equipo.id;


--
-- Name: equipo_miembro; Type: TABLE; Schema: negocio; Owner: dicta
--

CREATE TABLE negocio.equipo_miembro (
    id integer NOT NULL,
    equipo_id integer NOT NULL,
    usuario_id integer NOT NULL,
    fecha_invitacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_aceptacion timestamp with time zone,
    estado character varying(20) DEFAULT 'pendiente'::character varying,
    CONSTRAINT chk_equipo_miembro_estado CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'aceptado'::character varying, 'rechazado'::character varying])::text[])))
);


ALTER TABLE negocio.equipo_miembro OWNER TO dicta;

--
-- Name: equipo_miembro_id_seq; Type: SEQUENCE; Schema: negocio; Owner: dicta
--

CREATE SEQUENCE negocio.equipo_miembro_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE negocio.equipo_miembro_id_seq OWNER TO dicta;

--
-- Name: equipo_miembro_id_seq; Type: SEQUENCE OWNED BY; Schema: negocio; Owner: dicta
--

ALTER SEQUENCE negocio.equipo_miembro_id_seq OWNED BY negocio.equipo_miembro.id;


--
-- Name: estudio; Type: TABLE; Schema: negocio; Owner: dicta
--

CREATE TABLE negocio.estudio (
    id integer NOT NULL,
    nombre character varying(200) NOT NULL,
    direccion text,
    telefono character varying(20),
    propietario_id integer NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE negocio.estudio OWNER TO dicta;

--
-- Name: estudio_id_seq; Type: SEQUENCE; Schema: negocio; Owner: dicta
--

CREATE SEQUENCE negocio.estudio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE negocio.estudio_id_seq OWNER TO dicta;

--
-- Name: estudio_id_seq; Type: SEQUENCE OWNED BY; Schema: negocio; Owner: dicta
--

ALTER SEQUENCE negocio.estudio_id_seq OWNED BY negocio.estudio.id;


--
-- Name: expediente; Type: TABLE; Schema: negocio; Owner: dicta
--

CREATE TABLE negocio.expediente (
    id integer NOT NULL,
    numero character varying(50) NOT NULL,
    cliente character varying(200) NOT NULL,
    fecha_inicio date NOT NULL,
    descripcion text,
    estado character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    estudio_id integer NOT NULL,
    CONSTRAINT chk_expediente_estado CHECK (((estado)::text = ANY ((ARRAY['activo'::character varying, 'cerrado'::character varying, 'suspendido'::character varying])::text[])))
);


ALTER TABLE negocio.expediente OWNER TO dicta;

--
-- Name: expediente_id_seq; Type: SEQUENCE; Schema: negocio; Owner: dicta
--

CREATE SEQUENCE negocio.expediente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE negocio.expediente_id_seq OWNER TO dicta;

--
-- Name: expediente_id_seq; Type: SEQUENCE OWNED BY; Schema: negocio; Owner: dicta
--

ALTER SEQUENCE negocio.expediente_id_seq OWNED BY negocio.expediente.id;


--
-- Name: transcripcion; Type: TABLE; Schema: negocio; Owner: dicta
--

CREATE TABLE negocio.transcripcion (
    id integer NOT NULL,
    hash character varying(64) NOT NULL,
    nombre character varying(300),
    tipo character varying(50) DEFAULT 'audio'::character varying NOT NULL,
    estado character varying(30) DEFAULT 'pendiente'::character varying NOT NULL,
    duracion character varying(10),
    url text,
    archivo character varying(500),
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    audiencia_id integer,
    usuario_id integer NOT NULL,
    CONSTRAINT chk_transcripcion_estado CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'procesado'::character varying, 'error'::character varying])::text[]))),
    CONSTRAINT chk_transcripcion_tipo CHECK (((tipo)::text = ANY ((ARRAY['youtube'::character varying, 'audio'::character varying, 'en_vivo'::character varying])::text[])))
);


ALTER TABLE negocio.transcripcion OWNER TO dicta;

--
-- Name: transcripcion_id_seq; Type: SEQUENCE; Schema: negocio; Owner: dicta
--

CREATE SEQUENCE negocio.transcripcion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE negocio.transcripcion_id_seq OWNER TO dicta;

--
-- Name: transcripcion_id_seq; Type: SEQUENCE OWNED BY; Schema: negocio; Owner: dicta
--

ALTER SEQUENCE negocio.transcripcion_id_seq OWNED BY negocio.transcripcion.id;


--
-- Name: usuario; Type: TABLE; Schema: negocio; Owner: dicta
--

CREATE TABLE negocio.usuario (
    id integer NOT NULL,
    nombres character varying(100) NOT NULL,
    apellidos character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    "contraseña" character varying(255) NOT NULL
);


ALTER TABLE negocio.usuario OWNER TO dicta;

--
-- Name: usuario_estudio; Type: TABLE; Schema: negocio; Owner: dicta
--

CREATE TABLE negocio.usuario_estudio (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    estudio_id integer NOT NULL,
    rol character varying(20) DEFAULT 'miembro'::character varying NOT NULL,
    fecha_asignacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_usuario_estudio_rol CHECK (((rol)::text = ANY ((ARRAY['propietario'::character varying, 'miembro'::character varying])::text[])))
);


ALTER TABLE negocio.usuario_estudio OWNER TO dicta;

--
-- Name: usuario_estudio_id_seq; Type: SEQUENCE; Schema: negocio; Owner: dicta
--

CREATE SEQUENCE negocio.usuario_estudio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE negocio.usuario_estudio_id_seq OWNER TO dicta;

--
-- Name: usuario_estudio_id_seq; Type: SEQUENCE OWNED BY; Schema: negocio; Owner: dicta
--

ALTER SEQUENCE negocio.usuario_estudio_id_seq OWNED BY negocio.usuario_estudio.id;


--
-- Name: usuario_id_seq; Type: SEQUENCE; Schema: negocio; Owner: dicta
--

CREATE SEQUENCE negocio.usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE negocio.usuario_id_seq OWNER TO dicta;

--
-- Name: usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: negocio; Owner: dicta
--

ALTER SEQUENCE negocio.usuario_id_seq OWNED BY negocio.usuario.id;


--
-- Name: audiencia id; Type: DEFAULT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.audiencia ALTER COLUMN id SET DEFAULT nextval('negocio.audiencia_id_seq'::regclass);


--
-- Name: equipo id; Type: DEFAULT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.equipo ALTER COLUMN id SET DEFAULT nextval('negocio.equipo_id_seq'::regclass);


--
-- Name: equipo_miembro id; Type: DEFAULT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.equipo_miembro ALTER COLUMN id SET DEFAULT nextval('negocio.equipo_miembro_id_seq'::regclass);


--
-- Name: estudio id; Type: DEFAULT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.estudio ALTER COLUMN id SET DEFAULT nextval('negocio.estudio_id_seq'::regclass);


--
-- Name: expediente id; Type: DEFAULT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.expediente ALTER COLUMN id SET DEFAULT nextval('negocio.expediente_id_seq'::regclass);


--
-- Name: transcripcion id; Type: DEFAULT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.transcripcion ALTER COLUMN id SET DEFAULT nextval('negocio.transcripcion_id_seq'::regclass);


--
-- Name: usuario id; Type: DEFAULT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.usuario ALTER COLUMN id SET DEFAULT nextval('negocio.usuario_id_seq'::regclass);


--
-- Name: usuario_estudio id; Type: DEFAULT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.usuario_estudio ALTER COLUMN id SET DEFAULT nextval('negocio.usuario_estudio_id_seq'::regclass);


--
-- Data for Name: audiencia; Type: TABLE DATA; Schema: negocio; Owner: dicta
--

COPY negocio.audiencia (id, titulo, fecha_hora, lugar, descripcion, expediente_id) FROM stdin;
1	aud 1	2025-09-17 23:05:00+00	mi casa	\N	1
2	Aud1	2000-10-02 17:07:00+00	Juzgado	\N	2
3	caca	2025-09-10 21:41:00+00	\N	\N	3
4	Aud 1	2025-10-01 16:22:00+00	Juzgado	\N	4
5	aaa	2025-09-30 22:08:00+00	\N	\N	5
6	Audiencia 1	2025-10-15 22:28:00+00	\N	\N	6
7	Prueba chat	2025-10-15 15:00:00+00	\N	\N	7
8	1er Audiencia	2025-10-16 00:10:00+00	CABA	\N	8
9	Audiencia Oral	2024-06-26 12:00:00+00	Tribunal Oral en lo Criminal Federal N°6	\N	9
10	Audiencia 1	2025-11-07 19:28:00+00	CABA	asdad	11
11	Audiencia test	2025-11-13 00:48:00+00	\N	\N	12
12	Primera	2025-11-14 16:00:00+00	Juzgado Civil N3	\N	13
\.


--
-- Data for Name: equipo; Type: TABLE DATA; Schema: negocio; Owner: dicta
--

COPY negocio.equipo (id, nombre, descripcion, estudio_id, fecha_creacion) FROM stdin;
1	tukson	tukito	1	2025-09-17 23:04:21.165669+00
2	Derecho penal	Mi equipo de derecho penal	2	2025-09-20 17:05:38.804834+00
3	Equipo 1	\N	5	2025-09-27 21:42:54.012965+00
4	Equipo1	Equipo1	11	2025-11-13 19:27:28.275661+00
\.


--
-- Data for Name: equipo_miembro; Type: TABLE DATA; Schema: negocio; Owner: dicta
--

COPY negocio.equipo_miembro (id, equipo_id, usuario_id, fecha_invitacion, fecha_aceptacion, estado) FROM stdin;
1	2	1	2025-09-20 17:05:45.613879+00	\N	aceptado
\.


--
-- Data for Name: estudio; Type: TABLE DATA; Schema: negocio; Owner: dicta
--

COPY negocio.estudio (id, nombre, direccion, telefono, propietario_id, fecha_creacion) FROM stdin;
1	Estudiazo	tuko	1234567	1	2025-09-17 23:04:11.344929+00
2	Esutdio	Midir	\N	2	2025-09-20 17:05:28.002063+00
4	caca	caca	1234567	4	2025-09-27 19:40:46.436142+00
5	Estudio Gonzalez	Calle falsa 123	1138031007	5	2025-09-27 21:40:27.698574+00
6	Estudio 1	\N	\N	11	2025-10-14 22:28:02.493067+00
7	Doneitor	\N	\N	6	2025-10-15 17:23:53.052061+00
8	Estudio Los Clementes	Av. Cordoba 5160	1155226123	12	2025-10-16 22:34:16.165302+00
9	Expo Proyecto 2025	Florencio Varela 1903	\N	14	2025-10-21 00:50:50.671377+00
10	Estudio Marcelo	Marcelino 4561	1155226123	15	2025-11-13 02:29:02.798961+00
11	Estudio 1	Av. Cordoba 5160	1155226123	16	2025-11-13 19:27:10.424636+00
12	Estudio Victorino	Victorio	11111111	17	2025-11-13 23:39:59.478531+00
13	Proyecto Final	\N	\N	14	2025-11-14 20:20:16.196182+00
\.


--
-- Data for Name: expediente; Type: TABLE DATA; Schema: negocio; Owner: dicta
--

COPY negocio.expediente (id, numero, cliente, fecha_inicio, descripcion, estado, estudio_id) FROM stdin;
1	expo	nisman	2025-09-10	tuki	activo	1
2	Expediente causa divorcio	Nisman	2000-01-03	\N	activo	2
3	caca	caca	2025-09-03	\N	activo	4
4	Causa Sabag	Sabag	2021-01-03	\N	activo	2
5	expo2	aaa	2025-09-30	\N	activo	2
6	Expediente 1	Pepe	2025-10-15	\N	activo	6
7	Prueba chat	Dona	2025-10-15	probando si funciona el chat bloqueado	activo	7
8	EXP-test-1	Ricardo Lopez	2025-10-10	Texto de prueba	activo	8
9	Causa Sabag	Expo Proyecto	2024-06-26	Causa: 2998/2022\nCaratulada "Sabag Montiel, Fernando André y otros s/ homicidio agravado"	activo	9
10	EXP-test-1	Marcelo Marcelino	2025-11-28	Chelo	activo	10
11	EXP-test-1	Cliente de prueba	2025-11-06	asdasda	activo	11
12	Expediente Victorsito	Victorio	2025-11-05	\N	activo	12
13	Causa Robo	Agustin	2025-11-12	\N	activo	9
\.


--
-- Data for Name: transcripcion; Type: TABLE DATA; Schema: negocio; Owner: dicta
--

COPY negocio.transcripcion (id, hash, nombre, tipo, estado, duracion, url, archivo, fecha_creacion, audiencia_id, usuario_id) FROM stdin;
91	97e9c1c46843eb57b0670fab0f49b71da32e74f143012b9176d2aa5e38c098dd	Transcripción YouTube - 1761150810438	youtube	procesado	03:54:55	https://www.youtube.com/watch?v=kzHhX_jAwlo	\N	2025-10-22 16:33:30.43751+00	9	14
92	5e128509f4cbe586d481b3389dad1c905077affa5e6122d2c585639abe4690c6	Transcripción YouTube - 1761151037022	youtube	procesado	01:24:55	https://www.youtube.com/watch?v=GCJ8LxIC4hg	\N	2025-10-22 16:37:17.020139+00	9	14
17	dcaec63abd8dfc38025190f86f7036b8d293aaead57dedfe167a50476c5a42bd	Transcripción YouTube - 1759002389074	youtube	procesado	00:14:19	https://www.youtube.com/watch?v=Enko7Wq-S7Q	\N	2025-09-27 19:46:20.754874+00	3	4
41	26e0446d13921d471aecd7a097caae019fee5136eaf91558f73d98450e9476c3	Transcripción YouTube - 1760143703525	youtube	procesado	00:30:6.	https://www.youtube.com/watch?v=GDNc13R1YA4	\N	2025-10-11 00:48:23.524387+00	\N	9
42	ca749d6a060fcfafeb12b7662c6dc4411d604f30bc7d52bee6fed6f0c881625c	Transcripción YouTube - 1760146377132	youtube	procesado	00:18:34	https://www.youtube.com/watch?v=A2I_h5yUW0w	\N	2025-10-11 01:32:57.132255+00	\N	9
47	4996063d0ded48826c9ce0709f41fd81a5e14322b7674361b58baa190955da8b	Transcripción YouTube - 1760150597290	youtube	procesado	00:02:24	https://www.youtube.com/watch?v=8cRxeVNH2lw	\N	2025-10-11 02:43:17.289484+00	\N	9
48	6ecc80e3849650b5d0a3a8c45cc2bacf2ad32af83ed60f0e3447cb8fbd6c885b	Transcripción YouTube - 1760151359192	youtube	procesado	00:15:3.	https://www.youtube.com/watch?v=GDNc13R1YA4	\N	2025-10-11 02:55:59.191483+00	\N	9
49	49ccd33cf5e5460c2e6c2efce048d1b3a4a619f37d7aa4d017038ced124ea3ed	Transcripción YouTube - 1760151907855	youtube	procesado	00:12:32	https://www.youtube.com/watch?v=hMddt2qnliA	\N	2025-10-11 03:05:07.854973+00	\N	9
50	1760154018323_hmqzv6cby	Transcripción Audio - MANO a MANO con PASSERINI, NUEVO INTENDENTE de la CIUDAD de CÓRDOBA [hMddt2qnliA] - 1760154020311	audio	procesado	00:12:32	\N	MANO a MANO con PASSERINI, NUEVO INTENDENTE de la CIUDAD de CÓRDOBA [hMddt2qnliA].mp3	2025-10-11 03:40:20.310521+00	\N	9
60	28059c5364c36eca6d5908097a18e5f5f7cca66415325ea7c2a3e8b9117a3dc0	Transcripción YouTube - 1760456342039	youtube	procesado	00:03:22	https://www.youtube.com/watch?v=RHIvFzOn-jQ&pp=ygU1c2kgcXVpZXJlbiB2ZW5pciBxdWUgdmVuZ2FuIGxlcyBwcmVzZW50YXJlbW9zIGJhdGFsbGE%3D	\N	2025-10-14 15:39:02.037767+00	\N	11
61	1fa3b3161e534b81dbfbb898c1d003abb51f8a3282f3638142ecf6b80ce187ce	Transcripción YouTube - 1760533794068	youtube	procesado	00:08:0.	https://www.youtube.com/watch?v=zZHm7D8VgD4	\N	2025-10-15 13:09:54.067328+00	\N	11
63	6e8ce7a017a13918e6029f70f9f577c1ba061030809247f40aa18bba6b51d536	Transcripción YouTube - 1760654237517	youtube	procesado	00:20:30	https://www.youtube.com/watch?v=Gr6c_PCNw4k	\N	2025-10-16 22:37:17.5162+00	8	12
94	1ddeff34582dd332f660788dfec9f2bce45ab2c5d8fe117db168efae47cc6d65	Transcripción YouTube - 1761151055202	youtube	procesado	03:08:4.	https://www.youtube.com/watch?v=sSbD3APnFnk	\N	2025-10-22 16:37:35.201408+00	9	14
195	df80f97a3f6209fb8214071c19f4bb6f26ab0201d9ecdd64e775cec441155258	Transcripción YouTube - 1763183700797	youtube	procesado	00:26:37	https://www.youtube.com/watch?v=alwL5ZxFnC4&list=PLOBlyC5cDroE_fNXbg2GiLUN8yn76_or5	\N	2025-11-15 05:15:00.797015+00	\N	14
93	542e331fce97ddd227f3297e1e95ab49aed812ae1f48944de6dd2871bffee87a	Transcripción YouTube - 1761151046585	youtube	procesado	01:24:26	https://www.youtube.com/watch?v=f15Xu0d_6Lw	\N	2025-10-22 16:37:26.585103+00	9	14
95	aaaf67d31d71d894813da894c012cf4b5df82468a6a6d3856ae9685bf665b91c	Transcripción YouTube - 1761151062037	youtube	procesado	02:41:59	https://www.youtube.com/watch?v=wt39fnkecaQ	\N	2025-10-22 16:37:42.036715+00	9	14
96	3df0ffecc338b043f04b863be04ea7215284ef95495b511ebe83898b912deb31	Transcripción YouTube - 1761151067485	youtube	procesado	01:30:34	https://www.youtube.com/watch?v=p_xUt_aHcok	\N	2025-10-22 16:37:47.484714+00	9	14
97	33c98af2b5ceb5f3dde659fe1a12c4e567e190249680456f8875601dd2141bc6	Transcripción YouTube - 1761151074703	youtube	procesado	05:00:55	https://www.youtube.com/watch?v=RKKGjnb_Ux8	\N	2025-10-22 16:37:54.702711+00	9	14
99	7b6c2bd52766aa6c6d4be028c30a3f50efa398291551d093a2e772b6c6609815	Transcripción YouTube - 1761151085158	youtube	procesado	02:28:31	https://www.youtube.com/watch?v=6zopwy9Nzrw	\N	2025-10-22 16:38:05.158201+00	9	14
100	9ab33638e2316456aa3164fb110093035576fe0e9c66a55b812dadf9a0c954e2	Transcripción YouTube - 1761151091242	youtube	procesado	02:56:23	https://www.youtube.com/watch?v=MRoBpvodT9Q	\N	2025-10-22 16:38:11.24153+00	9	14
101	ff5670c81e94177e80681efb4c0854de6898a4a6a257e1d3791b7a0fd6180a52	Transcripción YouTube - 1761151098578	youtube	procesado	04:43:8.	https://www.youtube.com/watch?v=g_UzLUZoIaY	\N	2025-10-22 16:38:18.577493+00	9	14
102	8b7d91a942d664cac764f5ed108274ec73fdc121f6477e45313b8d52941d8034	Transcripción YouTube - 1761151103989	youtube	procesado	01:51:47	https://www.youtube.com/watch?v=e1BvTL6Smp8	\N	2025-10-22 16:38:23.989008+00	9	14
103	51bfa8efb6316f3ac06fc611d7f344cbfae492f782c90ebdc23ac40d339f773c	Transcripción YouTube - 1761151110145	youtube	procesado	04:40:31	https://www.youtube.com/watch?v=breMZDBLBbo	\N	2025-10-22 16:38:30.144598+00	9	14
104	2706f780889fbdb311a8c55d852301277729d57cb9b5170b8b48a6f061f1b6ba	Transcripción YouTube - 1761151115924	youtube	procesado	03:19:24	https://www.youtube.com/watch?v=kjgM9odeHQQ	\N	2025-10-22 16:38:35.923377+00	9	14
105	630ab2accb05da054d4feef3e734bcc831c29c05db0a33b4db90edfa7c205166	Transcripción YouTube - 1761151121369	youtube	procesado	03:37:20	https://www.youtube.com/watch?v=BcoitBA97Ow	\N	2025-10-22 16:38:41.368633+00	9	14
106	c8775925ce250425106a48627c4d5c15392cf3ddc11fb08a959c84ea4db90973	Transcripción YouTube - 1761151127893	youtube	procesado	04:14:10	https://www.youtube.com/watch?v=0SGvPClrffI	\N	2025-10-22 16:38:47.892395+00	9	14
107	b09f697e70b6e5194aaea22a9cd8eeed343884b82b28b07b677faad1cd94d7a5	Transcripción YouTube - 1761151255797	youtube	procesado	01:20:39	https://www.youtube.com/watch?v=Wi_RHnQ3a5w	\N	2025-10-22 16:40:55.79707+00	9	14
108	d2d547104aad740aa6c04580295ec5fc6c0d3b5ebf76111c89cd9cd53948f042	Transcripción YouTube - 1761151283859	youtube	procesado	04:09:57	https://www.youtube.com/watch?v=EQRvFS1eX1w	\N	2025-10-22 16:41:23.859178+00	9	14
109	14d757327636bc78894638ca10a3e02f9f0adfd3f11a1084e851268159dce8c1	Transcripción YouTube - 1761151292415	youtube	procesado	04:51:12	https://www.youtube.com/watch?v=akngIK1PF80	\N	2025-10-22 16:41:32.414366+00	9	14
110	50a457e0fb90b568113ac61c312b12ca2a8a7ffd56ea7eed855931948d1e3b19	Transcripción YouTube - 1761151299385	youtube	procesado	07:10:49	https://www.youtube.com/watch?v=iyzdRYKwYuc	\N	2025-10-22 16:41:39.384835+00	9	14
111	0acb83caf9b953d1579f705b7936f0fff94917d6fe43b6ddff06e77bbfc65309	Transcripción YouTube - 1761151306090	youtube	procesado	03:51:59	https://www.youtube.com/watch?v=unzpC11byAQ	\N	2025-10-22 16:41:46.089546+00	9	14
112	e6b5877f8e7f01969020e248b6eb20ac6a14b3402b09987d673e97a26821fa36	Transcripción YouTube - 1761151310767	youtube	procesado	04:22:16	https://www.youtube.com/watch?v=mcFzP5ThbiU	\N	2025-10-22 16:41:50.766633+00	9	14
113	607989b0b1230f9b73cd4539df727e82694e8779469cc81b0d648a011a7e36ff	Transcripción YouTube - 1761151316759	youtube	procesado	02:51:0.	https://www.youtube.com/watch?v=b7OqXNElS8Q	\N	2025-10-22 16:41:56.758855+00	9	14
114	a5e6e315ce5c28242c54fd828e11bc41e41db8b44e12062eb0be46ac199c1092	Transcripción YouTube - 1761151322476	youtube	procesado	04:30:58	https://www.youtube.com/watch?v=DBxHHYdWf8Q	\N	2025-10-22 16:42:02.475039+00	9	14
115	48ed840634fb0154677e516ee0dabb252b168cd3a66ffd8000b1f6d88d2e5a71	Transcripción YouTube - 1761151328349	youtube	procesado	03:36:29	https://www.youtube.com/watch?v=fhv4h9XjBY8	\N	2025-10-22 16:42:08.34923+00	9	14
116	25bc5969c9f96ef7cd6e1e5e2b63497f50a7615defdc99e8b051f77469e6b45c	Transcripción YouTube - 1761151335238	youtube	procesado	05:20:25	https://www.youtube.com/watch?v=thVYO4CShQk	\N	2025-10-22 16:42:15.238161+00	9	14
117	df5da591e9f302e0c8ca5fdc77b6cb424c230e0e89dfea652a2cac80c38930f0	Transcripción YouTube - 1761151339550	youtube	procesado	02:07:38	https://www.youtube.com/watch?v=YPFBH2D1fF0	\N	2025-10-22 16:42:19.549895+00	9	14
118	81caecffdd5f00debc302490ad89d52c84cf3d0abecf6e2d1aa8a2c96816a755	Transcripción YouTube - 1761151344684	youtube	procesado	01:35:12	https://www.youtube.com/watch?v=6K7D_cRwjJs	\N	2025-10-22 16:42:24.683018+00	9	14
119	852112bfd7c30e355d4fc271aea46e9a9f11e89ce7723e0c530dcc13229a4629	Transcripción YouTube - 1761151349560	youtube	procesado	01:50:55	https://www.youtube.com/watch?v=PXTdGEXenHE	\N	2025-10-22 16:42:29.553415+00	9	14
122	52f39a24c671a6cfd36203b8e536e2161bf62a8522cb56e04d23399296d36d37	Transcripción YouTube - 1761151366312	youtube	procesado	03:09:1.	https://www.youtube.com/watch?v=s1xTNqNCm9c	\N	2025-10-22 16:42:46.311734+00	9	14
123	b4a9e1d293e3ff3b98555103918f1fbea4df843eff68195f42a8b6ff4e4e9b5f	Transcripción YouTube - 1761151373075	youtube	procesado	06:39:26	https://www.youtube.com/watch?v=G29eRY_xuW0	\N	2025-10-22 16:42:53.075166+00	9	14
124	fed423d7f3026bc2a9ee6efa699979ee79cd22a0cf902b8c80f5ff07f9bc6fee	Transcripción YouTube - 1761151379970	youtube	procesado	03:49:33	https://www.youtube.com/watch?v=y3jkKQirDjU	\N	2025-10-22 16:42:59.969489+00	9	14
125	c0eb88a3150ed424491948831feaa089cec114c74ffd9b535cf9d5728627f091	Transcripción YouTube - 1761151385783	youtube	procesado	07:02:24	https://www.youtube.com/watch?v=LuvUKJUtb5o	\N	2025-10-22 16:43:05.782982+00	9	14
128	live_83579578-cf56-4b1c-b8c5-faba877ee704	Transcripción Audio - live-session-2025-11-01T18-10-39-433Z - 1762020637898	audio	pendiente	00:00:52	\N	live-session-2025-11-01T18-10-39-433Z.mp3	2025-11-01 18:10:37.897678+00	\N	1
130	live_e23bc93f-e96c-423c-b7c6-9019e422556a	Transcripción Audio - live-session-2025-11-01T19-14-45-684Z - 1762024483829	audio	pendiente	00:00:50	\N	live-session-2025-11-01T19-14-45-684Z.mp3	2025-11-01 19:14:43.828586+00	\N	1
131	live_2891dcf6-e706-4bc1-85e2-4fe70a9e11b9	Transcripción Audio - live-session-2025-11-01T19-27-12-156Z - 1762025229786	audio	pendiente	00:00:44	\N	live-session-2025-11-01T19-27-12-156Z.mp3	2025-11-01 19:27:09.78613+00	\N	1
132	live_1cd743b8-9111-48ed-acef-739294c0d683	Transcripción Audio - live-session-2025-11-01T19-35-36-452Z - 1762025734609	audio	pendiente	00:00:45	\N	live-session-2025-11-01T19-35-36-452Z.mp3	2025-11-01 19:35:34.608591+00	\N	1
133	live_a02f7515-dbbb-4323-9ed5-782d5090a629	Transcripción Audio - live-session-2025-11-01T19-44-03-479Z - 1762026242332	audio	pendiente	00:00:45	\N	live-session-2025-11-01T19-44-03-479Z.mp3	2025-11-01 19:44:02.331836+00	\N	1
134	live_fbd8288b-c9e5-40fc-b296-d028b1cf4508	Transcripción Audio - live-session-2025-11-01T19-50-22-778Z - 1762026620323	audio	pendiente	00:00:40	\N	live-session-2025-11-01T19-50-22-778Z.mp3	2025-11-01 19:50:20.322483+00	\N	1
135	live_4a6a764d-fd33-4942-9a51-b4a516e499fc	Transcripción Audio - live-session-2025-11-01T19-54-01-165Z - 1762026838496	audio	pendiente	00:00:38	\N	live-session-2025-11-01T19-54-01-165Z.mp3	2025-11-01 19:53:58.49505+00	\N	1
136	live_42b96e23-1d2c-414b-9201-7c4ebdffeb11	Transcripción Audio - live-session-2025-11-01T19-56-11-519Z - 1762026970479	audio	pendiente	00:00:41	\N	live-session-2025-11-01T19-56-11-519Z.mp3	2025-11-01 19:56:10.478199+00	\N	1
137	live_fb985bef-a279-40cc-849b-1246d0d6e478	Transcripción Audio - live-session-2025-11-01T19-58-45-125Z - 1762027123034	audio	pendiente	00:00:42	\N	live-session-2025-11-01T19-58-45-125Z.mp3	2025-11-01 19:58:43.033931+00	\N	1
138	live_e46218f2-1e02-47cc-8542-cc7c166c1e65	Transcripción Audio - live-session-2025-11-01T20-02-51-855Z - 1762027369542	audio	pendiente	00:00:43	\N	live-session-2025-11-01T20-02-51-855Z.mp3	2025-11-01 20:02:49.541872+00	\N	1
139	live_32fb3da9-1cd6-4925-a0d8-0ed5610e14d2	Transcripción Audio - live-session-2025-11-01T20-11-11-609Z - 1762027869083	audio	pendiente	00:00:42	\N	live-session-2025-11-01T20-11-11-609Z.mp3	2025-11-01 20:11:09.083069+00	\N	1
140	live_7d821bf1-3464-4b30-8a1c-2f7fa0933704	Transcripción Audio - live-session-2025-11-01T20-18-32-118Z - 1762028309305	audio	pendiente	00:00:50	\N	live-session-2025-11-01T20-18-32-118Z.mp3	2025-11-01 20:18:29.30434+00	\N	1
141	live_201a6fb3-e6d4-4f39-8684-435568f68146	Transcripción Audio - live-session-2025-11-01T20-36-21-487Z - 1762029380118	audio	pendiente	00:00:47	\N	live-session-2025-11-01T20-36-21-487Z.mp3	2025-11-01 20:36:20.118327+00	\N	1
142	live_6696ed6c-aa9f-4099-9611-b71ba7357bc6	Transcripción Audio - live-session-2025-11-01T20-39-33-058Z - 1762029571493	audio	pendiente	00:00:38	\N	live-session-2025-11-01T20-39-33-058Z.mp3	2025-11-01 20:39:31.492908+00	\N	1
143	live_1e6b1870-879f-42d8-93c4-3cf09de48e4a	Transcripción Audio - live-session-2025-11-01T20-41-53-197Z - 1762029711753	audio	pendiente	00:00:08	\N	live-session-2025-11-01T20-41-53-197Z.mp3	2025-11-01 20:41:51.752413+00	\N	1
144	live_c062e2d6-e706-43a4-af6e-6fae0e612564	Transcripción Audio - live-session-2025-11-01T20-46-13-951Z - 1762029971161	audio	pendiente	00:00:05	\N	live-session-2025-11-01T20-46-13-951Z.mp3	2025-11-01 20:46:11.161083+00	\N	1
145	live_0c4685fc-413b-4ff9-85c8-551e8203d35a	Transcripción Audio - live-session-2025-11-01T20-49-50-057Z - 1762030189120	audio	pendiente	00:00:05	\N	live-session-2025-11-01T20-49-50-057Z.mp3	2025-11-01 20:49:49.119665+00	\N	1
146	live_7b7806af-ca7d-46a4-8151-182790c0f7f2	Transcripción Audio - live-session-2025-11-01T20-50-45-706Z - 1762030244675	audio	pendiente	00:00:04	\N	live-session-2025-11-01T20-50-45-706Z.mp3	2025-11-01 20:50:44.674377+00	\N	1
147	live_47a7671d-c896-4c2b-8324-f6230db18d90	Transcripción Audio - live-session-2025-11-02T17-07-25-807Z - 1762103246295	audio	pendiente	00:00:46	\N	live-session-2025-11-02T17-07-25-807Z.mp3	2025-11-02 17:07:26.295027+00	\N	1
148	live_53db2a05-5b29-48d5-90d3-97e6ce364de5	Transcripción Audio - live-session-2025-11-02T17-12-28-891Z - 1762103548773	audio	pendiente	00:00:40	\N	live-session-2025-11-02T17-12-28-891Z.mp3	2025-11-02 17:12:28.772371+00	\N	1
149	51c32fa4f8f98931a93f1822f71b05e0bb9d87a614936d2378f6c1d21f11ae6d	Transcripción Audio - live-session-2025-11-02T17-20-45-079Z - 1762104045415	audio	pendiente	00:00:44	\N	live-session-2025-11-02T17-20-45-079Z.mp3	2025-11-02 17:20:45.414724+00	\N	1
150	29407f2ed35bd69b091a3f99fc109e53c346284182d16c4db25ab7db05e4c63a	Transcripción Audio - live-session-2025-11-02T17-22-30-701Z - 1762104150589	audio	pendiente	00:01:04	\N	live-session-2025-11-02T17-22-30-701Z.mp3	2025-11-02 17:22:30.587991+00	\N	1
151	f7be46a188b46c27ae45739de5ad97f14b5d6c47e0d9cb93915e51417dc9d1f9	Transcripción Audio - live-session-2025-11-02T17-32-47-735Z - 1762104767015	audio	pendiente	00:00:48	\N	live-session-2025-11-02T17-32-47-735Z.mp3	2025-11-02 17:32:47.014154+00	\N	1
152	live_82287af8-dafb-431c-9171-94715514da1c	Transcripción Audio - live-session-2025-11-02T17-43-26-774Z - 1762105406499	audio	pendiente	00:01:03	\N	live-session-2025-11-02T17-43-26-774Z.mp3	2025-11-02 17:43:26.499024+00	\N	1
153	db3f393733cbfc3f89da4eac4fb5ab8bfd05cc59f9b3520631c8f8aced95cc28	Transcripción Audio - live-session-2025-11-02T17-45-58-746Z - 1762105558789	audio	pendiente	00:00:43	\N	live-session-2025-11-02T17-45-58-746Z.mp3	2025-11-02 17:45:58.78812+00	\N	1
154	2012ff5a2d85b889390a71a83b02b96817f152682c6064bd31e96c1ca7d8e4c6	Transcripción Audio - live-session-2025-11-02T17-57-28-292Z - 1762106249960	audio	pendiente	00:00:44	\N	live-session-2025-11-02T17-57-28-292Z.mp3	2025-11-02 17:57:29.959367+00	\N	1
155	931e85b0a6e4ebbe626cb2238a7d5a022dc9a5b7281aed833a6b1e62d6f1816a	Transcripción Audio - live-session-2025-11-02T18-15-13-725Z - 1762107314296	audio	pendiente	00:01:54	\N	live-session-2025-11-02T18-15-13-725Z.mp3	2025-11-02 18:15:14.295888+00	\N	1
156	d6916c5909b9a941eae5d159b62d1bc5ddb7e24a67482fc64dc78aed18447f0f	Transcripción Audio - live-session-2025-11-02T18-24-25-841Z - 1762107866884	audio	pendiente	00:01:41	\N	live-session-2025-11-02T18-24-25-841Z.mp3	2025-11-02 18:24:26.883964+00	\N	1
157	61deb35326c88bb6535c1041c881f1a27da010755fbf7125609e96502c852a4c	Transcripción Audio - live-session-2025-11-02T18-35-39-419Z - 1762108541297	audio	pendiente	00:01:54	\N	live-session-2025-11-02T18-35-39-419Z.mp3	2025-11-02 18:35:41.296536+00	\N	1
158	727f14236d6e6373d8573c047339eb64d1416e6af34a9cae2968365c4a2cd5e2	Transcripción Audio - live-session-2025-11-02T18-38-25-112Z - 1762108706697	audio	pendiente	00:02:13	\N	live-session-2025-11-02T18-38-25-112Z.mp3	2025-11-02 18:38:26.696175+00	\N	1
159	live_c7330f18-4f8f-4876-bf22-8a0e190e8a7b	Transcripción Audio - live-session-2025-11-03T12-51-41-428Z - 1762174301031	audio	pendiente	00:00:04	\N	live-session-2025-11-03T12-51-41-428Z.mp3	2025-11-03 12:51:41.030805+00	\N	11
168	871defe6f085110dc2626d7cc05d276348936af95a30885ef0ca8d50820f0612	Transcripción Audio - live-session-2025-11-13T00-16-43-582Z - 1762993003693	audio	pendiente	00:00:45	\N	live-session-2025-11-13T00-16-43-582Z.mp3	2025-11-13 00:16:43.693011+00	\N	15
169	24eb1d1c5029e6f83e1dda54ef2714b324a7c3ba046650d358d3fad4c3a37c95	Transcripción Audio - live-session-2025-11-13T02-32-43-447Z - 1763001164358	audio	pendiente	00:01:04	\N	live-session-2025-11-13T02-32-43-447Z.mp3	2025-11-13 02:32:44.35761+00	\N	15
170	b41819751be6e39abc34d53b3c003ea259315b5f7bc658a520a390ed9ccf5ac8	Transcripción Audio - live-session-2025-11-13T19-26-39-577Z - 1763062001167	audio	pendiente	00:01:21	\N	live-session-2025-11-13T19-26-39-577Z.mp3	2025-11-13 19:26:41.165836+00	\N	16
171	0f744731853954fc33ff8eff74dc798fe08cec45e11e38b757a58c35b1bf2686	Transcripción Audio - live-session-2025-11-13T19-33-46-582Z - 1763062427696	audio	pendiente	00:01:52	\N	live-session-2025-11-13T19-33-46-582Z.mp3	2025-11-13 19:33:47.694132+00	\N	16
173	d9cf80836e76e7a3a74473a95b81a5dd36c76f58a7b5941aae0bd74bef4d5229	Transcripción YouTube - 1763072735581	youtube	procesado	00:30:33	https://www.youtube.com/watch?v=i1LALmRWIs0	\N	2025-11-13 22:25:35.580269+00	\N	6
175	0ae7058a54884618fc27ba80e4944357c597d28d80cc14ae850669d56e24dc18	Transcripción Audio - live-session-2025-11-13T23-46-02-350Z - 1763077564497	audio	pendiente	00:04:29	\N	live-session-2025-11-13T23-46-02-350Z.mp3	2025-11-13 23:46:04.496681+00	\N	17
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: negocio; Owner: dicta
--

COPY negocio.usuario (id, nombres, apellidos, email, "contraseña") FROM stdin;
1	Manuel Santiago	Ruiz Diaz	manuelrd57@gmail.com	$2b$12$vq4B81rJEVEge0bYUa5HZ.TYD7vnBQZwUG9OEApbuz5SUBHO/9swq
2	Manu	Ruiz Diaz	manuelrd47@gmail.com	$2b$12$6fU0XmJ4qGO82pUBgGkAaOk1W5ibT4zGUyvfg8Gv5LuLAc69CCbZa
3	Santiago	Castellani	santicastellani16@gmail.com	$2b$12$8RI/4tbixxx8mRHj/IT8ueB1COl5fl4bAceUzuGA3mSKhFzQ/K8Ru
4	bob	bob	bob@gmail.com	$2b$12$yVk/5c1zvFuz55gnFNrb8e8ezdwlFQbULYAuEPh6Pn6Z1ma4K1RgC
5	Manuel Ruiz	DIAZ	manu@gmail.com	$2b$12$ZfjWTDND242rX3oioTAAweraT/Ddj1b4Y5NXR1mGfOkm6hWy6i/f.
6	Donatella	Fragassi	fragassidonatella1@gmail.com	$2b$12$cUyyOtJ7L.TqOXCZ2QktmuJpND1JGJgU13V5PyIC0sxgZfu3Ai6pC
7	Contre	Contre	cnmyroniuk@gmail.com	$2b$12$kphkw..Bnz8pVx6e6kvFs.EVJvFsw1IsPYfLzYdQbF.VtUvKDfFF6
8	Agustin	contreras	agustincontreras@dicta.com	$2b$12$8TNUH46WxlbVxmnEPljYf.LKI5NoS.6eEvaaFD2INmn41jLm7r.d2
9	Donatella	Fragassi	fragassidonatella@gmail.com	$2b$12$K1pAaPvH1oro8CFMXLRaE.8CXPKapiH8VcolU4WMO4/k4BLSkxlLC
10	Facundo	Carballo	carballofacundo70@gmail.com	$2b$12$zNfre/jcUeAd/IDWEEP1FeoKZBpW14sbtSmbD8BqJ.X/wNgpfwtRK
11	Prueba	Prueba	prueba@gmail.com	$2b$12$P.8r1JwK3i.hIO5snBwKWeD/IiMxEYgTDtsNjvHUti0Fqza3mWAni
12	Clemente	Rodriguez	clementerodriguez@gmail.com	$2b$12$0onNs0w9/l1JyqdZeCF8/e6HchQIjpsUNh0tqOmuposM8gcF0WOVu
13	Agustin	Contreras	contreras.agustin.1999@gmail.com	$2b$12$QbA2DHi9MX7uqXja3.RGhOuOStGjWori2QFSrMKi4zmH6mw0Qid9a
14	Expo	2025	expo@unlam.edu.ar	$2b$12$fbzq9mQhpjEL0.WnHBigd.Bh1QQUZ4YcE8Y1H4WLMdUeZSo0juQuq
15	Test	Demo	testdemo@gmai.com	$2b$12$xf9mKfwl14fOOadKpljbYe1WgjeSbtI9CqDIvVfvqXWx/2xEe8cMq
16	Test	Demo	testdemo@gmail.com	$2b$12$.hQSB7MRODgXcnvhmT6Av.vIBGyc0eg4lSkWyQA2eJXb38QD2oQYC
17	Victor	Victor	victor@victor.com	$2b$12$FYXP5Yr2AqHXYVhCRj5blePbLliQ2nqhqEBPECN7Kdkg3lAMUW46i
\.


--
-- Data for Name: usuario_estudio; Type: TABLE DATA; Schema: negocio; Owner: dicta
--

COPY negocio.usuario_estudio (id, usuario_id, estudio_id, rol, fecha_asignacion) FROM stdin;
1	1	1	propietario	2025-09-17 23:04:11.344929+00
2	2	2	propietario	2025-09-20 17:05:28.002063+00
3	1	2	miembro	2025-09-20 17:05:45.613879+00
5	4	4	propietario	2025-09-27 19:40:46.436142+00
6	5	5	propietario	2025-09-27 21:40:27.698574+00
7	11	6	propietario	2025-10-14 22:28:02.493067+00
8	6	7	propietario	2025-10-15 17:23:53.052061+00
9	12	8	propietario	2025-10-16 22:34:16.165302+00
10	14	9	propietario	2025-10-21 00:50:50.671377+00
11	15	10	propietario	2025-11-13 02:29:02.798961+00
12	16	11	propietario	2025-11-13 19:27:10.424636+00
13	17	12	propietario	2025-11-13 23:39:59.478531+00
14	14	13	propietario	2025-11-14 20:20:16.196182+00
\.


--
-- Name: audiencia_id_seq; Type: SEQUENCE SET; Schema: negocio; Owner: dicta
--

SELECT pg_catalog.setval('negocio.audiencia_id_seq', 13, true);


--
-- Name: equipo_id_seq; Type: SEQUENCE SET; Schema: negocio; Owner: dicta
--

SELECT pg_catalog.setval('negocio.equipo_id_seq', 4, true);


--
-- Name: equipo_miembro_id_seq; Type: SEQUENCE SET; Schema: negocio; Owner: dicta
--

SELECT pg_catalog.setval('negocio.equipo_miembro_id_seq', 1, true);


--
-- Name: estudio_id_seq; Type: SEQUENCE SET; Schema: negocio; Owner: dicta
--

SELECT pg_catalog.setval('negocio.estudio_id_seq', 13, true);


--
-- Name: expediente_id_seq; Type: SEQUENCE SET; Schema: negocio; Owner: dicta
--

SELECT pg_catalog.setval('negocio.expediente_id_seq', 13, true);


--
-- Name: transcripcion_id_seq; Type: SEQUENCE SET; Schema: negocio; Owner: dicta
--

SELECT pg_catalog.setval('negocio.transcripcion_id_seq', 195, true);


--
-- Name: usuario_estudio_id_seq; Type: SEQUENCE SET; Schema: negocio; Owner: dicta
--

SELECT pg_catalog.setval('negocio.usuario_estudio_id_seq', 14, true);


--
-- Name: usuario_id_seq; Type: SEQUENCE SET; Schema: negocio; Owner: dicta
--

SELECT pg_catalog.setval('negocio.usuario_id_seq', 17, true);


--
-- Name: audiencia audiencia_pkey; Type: CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.audiencia
    ADD CONSTRAINT audiencia_pkey PRIMARY KEY (id);


--
-- Name: equipo_miembro equipo_miembro_pkey; Type: CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.equipo_miembro
    ADD CONSTRAINT equipo_miembro_pkey PRIMARY KEY (id);


--
-- Name: equipo equipo_pkey; Type: CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.equipo
    ADD CONSTRAINT equipo_pkey PRIMARY KEY (id);


--
-- Name: estudio estudio_pkey; Type: CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.estudio
    ADD CONSTRAINT estudio_pkey PRIMARY KEY (id);


--
-- Name: expediente expediente_pkey; Type: CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.expediente
    ADD CONSTRAINT expediente_pkey PRIMARY KEY (id);


--
-- Name: transcripcion transcripcion_hash_key; Type: CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.transcripcion
    ADD CONSTRAINT transcripcion_hash_key UNIQUE (hash);


--
-- Name: transcripcion transcripcion_pkey; Type: CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.transcripcion
    ADD CONSTRAINT transcripcion_pkey PRIMARY KEY (id);


--
-- Name: equipo_miembro uk_equipo_miembro; Type: CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.equipo_miembro
    ADD CONSTRAINT uk_equipo_miembro UNIQUE (equipo_id, usuario_id);


--
-- Name: expediente uk_expediente_numero_estudio; Type: CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.expediente
    ADD CONSTRAINT uk_expediente_numero_estudio UNIQUE (numero, estudio_id);


--
-- Name: audiencia uk_titulo_expediente; Type: CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.audiencia
    ADD CONSTRAINT uk_titulo_expediente UNIQUE (titulo, expediente_id);


--
-- Name: usuario_estudio uk_usuario_estudio; Type: CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.usuario_estudio
    ADD CONSTRAINT uk_usuario_estudio UNIQUE (usuario_id, estudio_id);


--
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- Name: usuario_estudio usuario_estudio_pkey; Type: CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.usuario_estudio
    ADD CONSTRAINT usuario_estudio_pkey PRIMARY KEY (id);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- Name: audiencia fk_audiencia_expediente; Type: FK CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.audiencia
    ADD CONSTRAINT fk_audiencia_expediente FOREIGN KEY (expediente_id) REFERENCES negocio.expediente(id);


--
-- Name: equipo fk_equipo_estudio; Type: FK CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.equipo
    ADD CONSTRAINT fk_equipo_estudio FOREIGN KEY (estudio_id) REFERENCES negocio.estudio(id);


--
-- Name: equipo_miembro fk_equipo_miembro_equipo; Type: FK CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.equipo_miembro
    ADD CONSTRAINT fk_equipo_miembro_equipo FOREIGN KEY (equipo_id) REFERENCES negocio.equipo(id) ON DELETE CASCADE;


--
-- Name: equipo_miembro fk_equipo_miembro_usuario; Type: FK CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.equipo_miembro
    ADD CONSTRAINT fk_equipo_miembro_usuario FOREIGN KEY (usuario_id) REFERENCES negocio.usuario(id) ON DELETE CASCADE;


--
-- Name: estudio fk_estudio_propietario; Type: FK CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.estudio
    ADD CONSTRAINT fk_estudio_propietario FOREIGN KEY (propietario_id) REFERENCES negocio.usuario(id);


--
-- Name: expediente fk_expediente_estudio; Type: FK CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.expediente
    ADD CONSTRAINT fk_expediente_estudio FOREIGN KEY (estudio_id) REFERENCES negocio.estudio(id);


--
-- Name: transcripcion fk_transcripcion_audiencia; Type: FK CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.transcripcion
    ADD CONSTRAINT fk_transcripcion_audiencia FOREIGN KEY (audiencia_id) REFERENCES negocio.audiencia(id);


--
-- Name: transcripcion fk_transcripcion_usuario; Type: FK CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.transcripcion
    ADD CONSTRAINT fk_transcripcion_usuario FOREIGN KEY (usuario_id) REFERENCES negocio.usuario(id);


--
-- Name: usuario_estudio fk_usuario_estudio_estudio; Type: FK CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.usuario_estudio
    ADD CONSTRAINT fk_usuario_estudio_estudio FOREIGN KEY (estudio_id) REFERENCES negocio.estudio(id) ON DELETE CASCADE;


--
-- Name: usuario_estudio fk_usuario_estudio_usuario; Type: FK CONSTRAINT; Schema: negocio; Owner: dicta
--

ALTER TABLE ONLY negocio.usuario_estudio
    ADD CONSTRAINT fk_usuario_estudio_usuario FOREIGN KEY (usuario_id) REFERENCES negocio.usuario(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict zK3lDlOeeIvgeNhe6AWJ1s1dOX5bHkLfJryghYtn97pxsaHSFKFn5VRngGARDvJ


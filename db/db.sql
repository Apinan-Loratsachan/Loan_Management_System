--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3

-- Started on 2024-06-17 16:23:39 UTC

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

DROP DATABASE IF EXISTS loan_management_system;
--
-- TOC entry 3378 (class 1262 OID 16384)
-- Name: loan_management_system; Type: DATABASE; Schema: -; Owner: admin
--

CREATE DATABASE loan_management_system WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE loan_management_system OWNER TO admin;

\connect loan_management_system

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
-- TOC entry 216 (class 1259 OID 16417)
-- Name: customers; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.customers (
    id bigint NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    name text,
    address text,
    tel text,
    email text,
    id_card_number bigint NOT NULL
);


ALTER TABLE public.customers OWNER TO admin;

--
-- TOC entry 215 (class 1259 OID 16416)
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.customers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_id_seq OWNER TO admin;

--
-- TOC entry 3379 (class 0 OID 0)
-- Dependencies: 215
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- TOC entry 218 (class 1259 OID 32814)
-- Name: loans; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.loans (
    id bigint NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    amount numeric,
    loan_interest numeric,
    start_date date,
    due_date date,
    customer_id bigint
);


ALTER TABLE public.loans OWNER TO admin;

--
-- TOC entry 217 (class 1259 OID 32813)
-- Name: loans_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.loans_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loans_id_seq OWNER TO admin;

--
-- TOC entry 3380 (class 0 OID 0)
-- Dependencies: 217
-- Name: loans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.loans_id_seq OWNED BY public.loans.id;


--
-- TOC entry 220 (class 1259 OID 40962)
-- Name: payments; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.payments (
    id bigint NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    amount numeric,
    date date,
    loan_id bigint
);


ALTER TABLE public.payments OWNER TO admin;

--
-- TOC entry 219 (class 1259 OID 40961)
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO admin;

--
-- TOC entry 3381 (class 0 OID 0)
-- Dependencies: 219
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- TOC entry 3210 (class 2604 OID 16420)
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- TOC entry 3211 (class 2604 OID 32817)
-- Name: loans id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.loans ALTER COLUMN id SET DEFAULT nextval('public.loans_id_seq'::regclass);


--
-- TOC entry 3212 (class 2604 OID 40965)
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- TOC entry 3368 (class 0 OID 16417)
-- Dependencies: 216
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.customers (id, created_at, updated_at, deleted_at, name, address, tel, email, id_card_number) VALUES (13, '2024-06-14 13:33:32.369865+00', '2024-06-14 16:06:13.430616+00', NULL, 'อนันกร วงศ์สุรวัฒนา', '678 หมู่ 6 ตำบลแม่สา อำเภอแม่ริม จังหวัดเชียงใหม่ 50180', '0637528469', 'customer2@gmail.com', 3180763704125);
INSERT INTO public.customers (id, created_at, updated_at, deleted_at, name, address, tel, email, id_card_number) VALUES (11, '2024-06-14 08:43:40.553047+00', '2024-06-14 08:47:08.313398+00', NULL, 'นวิศา วัฒนโกศล', '234 หมู่ 3 ตำบลท่าศาลา อำเภอท่าศาลา จังหวัดนครศรีธรรมราช 80160', '0856396182', 'customer11@gmail.com', 3756740548810);
INSERT INTO public.customers (id, created_at, updated_at, deleted_at, name, address, tel, email, id_card_number) VALUES (15, '2024-06-14 13:50:09.085093+00', '2024-06-14 16:06:46.025251+00', NULL, 'นิชาภรณ์ ทรัพย์มา', '101 หมู่ 9 ตำบลแม่ปั๋ง อำเภอพร้าว จังหวัดเชียงใหม่ 50190', '0984635214', 'customer2@gmail.com', 7622237390161);
INSERT INTO public.customers (id, created_at, updated_at, deleted_at, name, address, tel, email, id_card_number) VALUES (10, '2024-06-14 08:38:54.024347+00', '2024-06-14 08:46:55.627174+00', NULL, 'สุนิสร จุลพัฒน์', '98 หมู่ 2 ตำบลหินกอง อำเภอแก่งคอย จังหวัดสระบุรี 18110', '0865936852', 'customer10@gmail.com', 2937885458758);
INSERT INTO public.customers (id, created_at, updated_at, deleted_at, name, address, tel, email, id_card_number) VALUES (3, '2024-06-13 11:17:14.87712+00', '2024-06-14 11:21:55.741383+00', NULL, 'ญานิษา อินทรประสิทธิ์', '199/84 หมู่10 ต.บึง อ.ศรีราชา จ.ชลบุรี', '0963658472', 'customer3@gmail.com', 7768888435132);
INSERT INTO public.customers (id, created_at, updated_at, deleted_at, name, address, tel, email, id_card_number) VALUES (4, '2024-06-13 11:41:37.776397+00', '2024-06-14 10:51:59.940649+00', NULL, 'ปิยรมย์ สุรศักดิ์อุดม', '345 หมู่ 1 ตำบลบางพระ อำเภอศรีราชา จังหวัดชลบุรี 20110', '0856349874', 'customer4@gmail.com', 3013034290939);
INSERT INTO public.customers (id, created_at, updated_at, deleted_at, name, address, tel, email, id_card_number) VALUES (5, '2024-06-14 06:45:26.962764+00', '2024-06-14 10:54:39.341959+00', NULL, 'ปาริยา เจริญกิจธารา', '123 หมู่ 4 ตำบลสวนดอก อำเภอเมืองลำปาง จังหวัดลำปาง 52000', '0693547892', 'customer5@gmail.com', 7522221443571);
INSERT INTO public.customers (id, created_at, updated_at, deleted_at, name, address, tel, email, id_card_number) VALUES (6, '2024-06-14 06:47:15.762375+00', '2024-06-14 08:46:26.472121+00', NULL, 'ถิรพล แสนสิรา', '123 หมู่ 4 ตำบลบางเสร่ อำเภอสัตหีบ จังหวัดชลบุรี 20250', '0884596352', 'customer6@gmail.com', 7009146969435);
INSERT INTO public.customers (id, created_at, updated_at, deleted_at, name, address, tel, email, id_card_number) VALUES (2, '2024-06-13 11:16:28.505708+00', '2024-06-14 14:38:45.993849+00', NULL, 'ณภัตรา พงษ์พัฒนโยธิน', '123 ถนนสุขุมวิท แขวงบางนา เขตบางนา กรุงเทพมหานคร 10260', '0685479365', 'customer2@gmail.com', 2146116691116);
INSERT INTO public.customers (id, created_at, updated_at, deleted_at, name, address, tel, email, id_card_number) VALUES (1, '2024-06-13 11:13:39.840984+00', '2024-06-14 15:26:00.67797+00', NULL, 'อภินันท์ ล้ออัศจรรย์', '35 เพชรเกษม 48 แขวงบางด้วน เขตภาษีเจริญ กรุงเทพมหานคร 10160', '0990645333', 'sunseasame2556@gmail.com', 1102003379247);
INSERT INTO public.customers (id, created_at, updated_at, deleted_at, name, address, tel, email, id_card_number) VALUES (7, '2024-06-14 06:48:08.25228+00', '2024-06-14 08:46:32.213653+00', NULL, 'ศศิพร นรินทร์ชนก', '789 หมู่ 5 ตำบลบ้านแพรก อำเภอบ้านแพรก จังหวัดพระนครศรีอยุธยา 13240', '0863429863', 'customer7@gmail.com', 1665088086191);
INSERT INTO public.customers (id, created_at, updated_at, deleted_at, name, address, tel, email, id_card_number) VALUES (8, '2024-06-14 06:53:04.618834+00', '2024-06-14 08:46:36.873558+00', NULL, 'พงษ์อนันต์ จรัสธรรม', '456 หมู่ 7 ตำบลป่าตาล อำเภอเมือง จังหวัดลพบุรี 15000', '0963658741', 'customer8@gmail.com', 2348745573496);
INSERT INTO public.customers (id, created_at, updated_at, deleted_at, name, address, tel, email, id_card_number) VALUES (9, '2024-06-14 06:54:01.809164+00', '2024-06-14 08:46:43.249152+00', NULL, 'พร้อมพงศ์ วงศ์วริศธารา', '12 ซอยสุขุมวิท 31 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพมหานคร 10110', '0918735642', 'customer9@gmail.com', 9309165279337);
INSERT INTO public.customers (id, created_at, updated_at, deleted_at, name, address, tel, email, id_card_number) VALUES (12, '2024-06-14 08:44:05.182615+00', '2024-06-14 11:23:31.614021+00', NULL, 'พนาวัฒน์ ลือขำ', '567 ถนนวิภาวดีรังสิต แขวงตลาดบางเขน เขตหลักสี่ กรุงเทพมหานคร 10210', '0657428169', 'customer12@gmail.com', 8219057401596);
INSERT INTO public.customers (id, created_at, updated_at, deleted_at, name, address, tel, email, id_card_number) VALUES (14, '2024-06-14 13:34:31.901099+00', '2024-06-14 16:07:42.260504+00', NULL, 'ภูริวัฒน์ อาชาไชย', '901 หมู่ 8 ตำบลสันทรายหลวง อำเภอสันทราย จังหวัดเชียงใหม่ 50210', '0693584746', 'customer2@gmail.com', 4798169151224);


--
-- TOC entry 3370 (class 0 OID 32814)
-- Dependencies: 218
-- Data for Name: loans; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.loans (id, created_at, updated_at, deleted_at, amount, loan_interest, start_date, due_date, customer_id) VALUES (1, '2024-06-15 15:43:53.170975+00', '2024-06-16 13:28:38.134393+00', NULL, 2000, 5.5, '2024-06-15', '2024-08-15', 1);
INSERT INTO public.loans (id, created_at, updated_at, deleted_at, amount, loan_interest, start_date, due_date, customer_id) VALUES (2, '2024-06-15 16:06:44.467869+00', '2024-06-16 14:26:40.812969+00', NULL, 30000, 7.5, '2023-05-14', '2024-06-14', 5);
INSERT INTO public.loans (id, created_at, updated_at, deleted_at, amount, loan_interest, start_date, due_date, customer_id) VALUES (35, '2024-06-16 16:45:14.533085+00', '2024-06-16 17:10:59.162898+00', NULL, 100000, 7, '2024-06-16', '2024-07-16', 11);
INSERT INTO public.loans (id, created_at, updated_at, deleted_at, amount, loan_interest, start_date, due_date, customer_id) VALUES (36, '2024-06-16 16:48:13.307976+00', '2024-06-17 04:53:21.907087+00', NULL, 100000, 7, '2023-06-16', '2024-07-16', 1);


--
-- TOC entry 3372 (class 0 OID 40962)
-- Dependencies: 220
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.payments (id, created_at, updated_at, deleted_at, amount, date, loan_id) VALUES (2, NULL, NULL, NULL, 5000, '2024-06-16', 2);
INSERT INTO public.payments (id, created_at, updated_at, deleted_at, amount, date, loan_id) VALUES (3, '2024-06-16 10:51:34.499158+00', '2024-06-16 10:51:34.499158+00', NULL, 5000, '2024-06-17', 2);
INSERT INTO public.payments (id, created_at, updated_at, deleted_at, amount, date, loan_id) VALUES (4, '2024-06-16 13:28:38.127029+00', '2024-06-16 13:28:38.127029+00', NULL, 2110, '2024-06-16', 1);
INSERT INTO public.payments (id, created_at, updated_at, deleted_at, amount, date, loan_id) VALUES (5, '2024-06-16 14:24:49.567074+00', '2024-06-16 14:24:49.567074+00', NULL, 10000, '2024-06-16', 2);
INSERT INTO public.payments (id, created_at, updated_at, deleted_at, amount, date, loan_id) VALUES (6, '2024-06-16 14:26:40.807218+00', '2024-06-16 14:26:40.807218+00', '2024-06-16 14:26:40.807218+00', 12250, '2024-06-16', 2);
INSERT INTO public.payments (id, created_at, updated_at, deleted_at, amount, date, loan_id) VALUES (7, '2024-06-16 17:00:29.476215+00', '2024-06-16 17:00:29.476215+00', NULL, 7000, '2024-06-16', 36);
INSERT INTO public.payments (id, created_at, updated_at, deleted_at, amount, date, loan_id) VALUES (8, '2024-06-16 17:00:43.47069+00', '2024-06-16 17:00:43.47069+00', NULL, 10000, '2024-06-16', 36);
INSERT INTO public.payments (id, created_at, updated_at, deleted_at, amount, date, loan_id) VALUES (9, '2024-06-16 17:02:01.60482+00', '2024-06-16 17:02:01.60482+00', NULL, 3000, '2024-06-16', 36);
INSERT INTO public.payments (id, created_at, updated_at, deleted_at, amount, date, loan_id) VALUES (10, '2024-06-16 17:05:36.793182+00', '2024-06-16 17:05:36.793182+00', NULL, 7000, '2024-06-16', 36);
INSERT INTO public.payments (id, created_at, updated_at, deleted_at, amount, date, loan_id) VALUES (11, '2024-06-16 17:10:59.159393+00', '2024-06-16 17:10:59.159393+00', '2024-06-16 18:05:59.294855+00', 7000, '2024-06-16', 35);


--
-- TOC entry 3382 (class 0 OID 0)
-- Dependencies: 215
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.customers_id_seq', 15, true);


--
-- TOC entry 3383 (class 0 OID 0)
-- Dependencies: 217
-- Name: loans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.loans_id_seq', 36, true);


--
-- TOC entry 3384 (class 0 OID 0)
-- Dependencies: 219
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.payments_id_seq', 11, true);


--
-- TOC entry 3214 (class 2606 OID 16424)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- TOC entry 3218 (class 2606 OID 32821)
-- Name: loans loans_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.loans
    ADD CONSTRAINT loans_pkey PRIMARY KEY (id);


--
-- TOC entry 3221 (class 2606 OID 40969)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 3215 (class 1259 OID 16425)
-- Name: idx_customers_deleted_at; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_customers_deleted_at ON public.customers USING btree (deleted_at);


--
-- TOC entry 3216 (class 1259 OID 32827)
-- Name: idx_loans_deleted_at; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_loans_deleted_at ON public.loans USING btree (deleted_at);


--
-- TOC entry 3219 (class 1259 OID 40975)
-- Name: idx_payments_deleted_at; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_payments_deleted_at ON public.payments USING btree (deleted_at);


--
-- TOC entry 3222 (class 2606 OID 32822)
-- Name: loans fk_loans_customer; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.loans
    ADD CONSTRAINT fk_loans_customer FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- TOC entry 3223 (class 2606 OID 40970)
-- Name: payments fk_payments_loan; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fk_payments_loan FOREIGN KEY (loan_id) REFERENCES public.loans(id);


-- Completed on 2024-06-17 16:23:39 UTC

--
-- PostgreSQL database dump complete
--


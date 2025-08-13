--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Debian 16.8-1.pgdg120+1)
-- Dumped by pg_dump version 16.9 (Debian 16.9-1.pgdg120+1)

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

--
-- Data for Name: providers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.providers VALUES ('cmdlk6hc90000n82wks5nr708', 'Openserve', 'openserve', NULL, true, '2025-07-27 10:51:04.906', '2025-07-27 10:51:04.906');
INSERT INTO public.providers VALUES ('cmdlk6hco0001n82w6snjfe9g', 'Frogfoot', 'frogfoot', NULL, true, '2025-07-27 10:51:04.921', '2025-07-27 10:51:04.921');
INSERT INTO public.providers VALUES ('cmdlk6hcz0002n82w2pkzgv60', 'Vuma', 'vuma', NULL, true, '2025-07-27 10:51:04.931', '2025-07-27 10:51:04.931');
INSERT INTO public.providers VALUES ('cmdlk6hd80003n82wqczg8f1d', 'Octotel', 'octotel', NULL, true, '2025-07-27 10:51:04.94', '2025-07-27 10:51:04.94');
INSERT INTO public.providers VALUES ('cmdlk6hdh0004n82w2ifjj4gu', 'TT Connect', 'tt connect', NULL, true, '2025-07-27 10:51:04.949', '2025-07-27 10:51:04.949');
INSERT INTO public.providers VALUES ('cmdlk6hdr0005n82w1gl6y9p3', 'Mitsol', 'mitsol', NULL, true, '2025-07-27 10:51:04.959', '2025-07-27 10:51:04.959');
INSERT INTO public.providers VALUES ('cmdlk6he00006n82wja4xfo6a', 'Evotel', 'evotel', NULL, true, '2025-07-27 10:51:04.968', '2025-07-27 10:51:04.968');
INSERT INTO public.providers VALUES ('cmdlk6heb0007n82wu3bhw0oz', 'Thinkspeed', 'thinkspeed', NULL, true, '2025-07-27 10:51:04.979', '2025-07-27 10:51:04.979');
INSERT INTO public.providers VALUES ('cmdlk6hek0008n82wo7mqrnkj', 'Clearaccess', 'clearaccess', NULL, true, '2025-07-27 10:51:04.989', '2025-07-27 10:51:04.989');
INSERT INTO public.providers VALUES ('cmdlk6hf00009n82wmz7jz3kb', 'DNATel', 'dnatel', NULL, true, '2025-07-27 10:51:05.005', '2025-07-27 10:51:05.005');
INSERT INTO public.providers VALUES ('cmdlk6hfd000an82wewqqn6sp', 'Link Layer', 'link layer', NULL, true, '2025-07-27 10:51:05.018', '2025-07-27 10:51:05.018');
INSERT INTO public.providers VALUES ('cmdlk6hfn000bn82w00oz95ka', 'MetroFibre Nexus', 'metrofibre nexus', NULL, true, '2025-07-27 10:51:05.027', '2025-07-27 10:51:05.027');
INSERT INTO public.providers VALUES ('cmdlk6hfz000cn82wmprofpjp', 'MetroFibre Nova', 'metrofibre nova', NULL, true, '2025-07-27 10:51:05.039', '2025-07-27 10:51:05.039');
INSERT INTO public.providers VALUES ('cmdlk6hg9000dn82wutl4960n', 'Steyn City', 'steyn city', NULL, true, '2025-07-27 10:51:05.05', '2025-07-27 10:51:05.05');
INSERT INTO public.providers VALUES ('cmdlk6hgi000en82whqvar0a1', 'Zoom Fibre', 'zoom fibre', NULL, true, '2025-07-27 10:51:05.058', '2025-07-27 10:51:05.058');
INSERT INTO public.providers VALUES ('cmdlk6hgr000fn82wvfek1xqf', 'Netstream', 'netstream', NULL, true, '2025-07-27 10:51:05.067', '2025-07-27 10:51:05.067');
INSERT INTO public.providers VALUES ('cmdlk6hh3000gn82wn1l40wk1', 'Lightstruck', 'lightstruck', NULL, true, '2025-07-27 10:51:05.079', '2025-07-27 10:51:05.079');
INSERT INTO public.providers VALUES ('cmdlk6hhc000hn82wroybn5u1', 'PPHG', 'pphg', NULL, true, '2025-07-27 10:51:05.088', '2025-07-27 10:51:05.088');
INSERT INTO public.providers VALUES ('cmdlk6hhj000in82wqwfucnb9', 'MTN', 'mtn', NULL, true, '2025-07-27 10:51:05.096', '2025-07-27 10:51:05.096');
INSERT INTO public.providers VALUES ('cmdlk6hht000jn82wnijxrug5', 'Vodacom', 'vodacom', NULL, true, '2025-07-27 10:51:05.105', '2025-07-27 10:51:05.105');
INSERT INTO public.providers VALUES ('cmdlk6hi2000kn82w7lunuwib', 'Telkom', 'telkom', NULL, true, '2025-07-27 10:51:05.115', '2025-07-27 10:51:05.115');


--
-- Data for Name: packages; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.packages VALUES ('openserve_openserve_50_25mbps', 'Openserve 50/25Mbps', 'cmdlk6hc90000n82wks5nr708', 'FIBRE', '50Mbps/25Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 525, 525, true, false, '2025-07-27 10:51:05.125', '2025-07-27 10:51:05.125', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('openserve_openserve_50_50mbps', 'Openserve 50/50Mbps', 'cmdlk6hc90000n82wks5nr708', 'FIBRE', '50Mbps/50Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 765, 765, true, false, '2025-07-27 10:51:05.133', '2025-07-27 10:51:05.133', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('openserve_openserve_100_50mbps', 'Openserve 100/50Mbps', 'cmdlk6hc90000n82wks5nr708', 'FIBRE', '100Mbps/50Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 865, 865, true, false, '2025-07-27 10:51:05.14', '2025-07-27 10:51:05.14', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('openserve_openserve_100_100mbps', 'Openserve 100/100Mbps', 'cmdlk6hc90000n82wks5nr708', 'FIBRE', '100Mbps/100Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 965, 965, true, false, '2025-07-27 10:51:05.147', '2025-07-27 10:51:05.147', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('openserve_openserve_200_100mbps', 'Openserve 200/100Mbps', 'cmdlk6hc90000n82wks5nr708', 'FIBRE', '200Mbps/100Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1105, 1105, true, false, '2025-07-27 10:51:05.154', '2025-07-27 10:51:05.154', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('openserve_openserve_200_200mbps', 'Openserve 200/200Mbps', 'cmdlk6hc90000n82wks5nr708', 'FIBRE', '200Mbps/200Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1175, 1175, true, false, '2025-07-27 10:51:05.162', '2025-07-27 10:51:05.162', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('openserve_openserve_300_150mbps', 'Openserve 300/150Mbps', 'cmdlk6hc90000n82wks5nr708', 'FIBRE', '300Mbps/150Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1335, 1335, true, false, '2025-07-27 10:51:05.169', '2025-07-27 10:51:05.169', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('openserve_openserve_500_250mbps', 'Openserve 500/250Mbps', 'cmdlk6hc90000n82wks5nr708', 'FIBRE', '500Mbps/250Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1535, 1535, true, false, '2025-07-27 10:51:05.175', '2025-07-27 10:51:05.175', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('frogfoot_frogfoot_60_30mbps', 'Frogfoot 60/30Mbps', 'cmdlk6hco0001n82w6snjfe9g', 'FIBRE', '60Mbps/30Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 619, 619, true, false, '2025-07-27 10:51:05.182', '2025-07-27 10:51:05.182', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('frogfoot_frogfoot_60_60mbps', 'Frogfoot 60/60Mbps', 'cmdlk6hco0001n82w6snjfe9g', 'FIBRE', '60Mbps/60Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 755, 755, true, false, '2025-07-27 10:51:05.188', '2025-07-27 10:51:05.188', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('frogfoot_frogfoot_120_60mbps', 'Frogfoot 120/60Mbps', 'cmdlk6hco0001n82w6snjfe9g', 'FIBRE', '120Mbps/60Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 780, 780, true, false, '2025-07-27 10:51:05.195', '2025-07-27 10:51:05.195', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('frogfoot_frogfoot_120_120mbps', 'Frogfoot 120/120Mbps', 'cmdlk6hco0001n82w6snjfe9g', 'FIBRE', '120Mbps/120Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 880, 880, true, false, '2025-07-27 10:51:05.202', '2025-07-27 10:51:05.202', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('frogfoot_frogfoot_240_120mbps', 'Frogfoot 240/120Mbps', 'cmdlk6hco0001n82w6snjfe9g', 'FIBRE', '240Mbps/120Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 980, 980, true, false, '2025-07-27 10:51:05.208', '2025-07-27 10:51:05.208', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('frogfoot_frogfoot_240_240mbps', 'Frogfoot 240/240Mbps', 'cmdlk6hco0001n82w6snjfe9g', 'FIBRE', '240Mbps/240Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1140, 1140, true, false, '2025-07-27 10:51:05.215', '2025-07-27 10:51:05.215', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('frogfoot_frogfoot_400_200mbps', 'Frogfoot 400/200Mbps', 'cmdlk6hco0001n82w6snjfe9g', 'FIBRE', '400Mbps/200Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1180, 1180, true, false, '2025-07-27 10:51:05.222', '2025-07-27 10:51:05.222', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('frogfoot_frogfoot_400_400mbps', 'Frogfoot 400/400Mbps', 'cmdlk6hco0001n82w6snjfe9g', 'FIBRE', '400Mbps/400Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1335, 1335, true, false, '2025-07-27 10:51:05.23', '2025-07-27 10:51:05.23', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('frogfoot_frogfoot_1000_500mbps', 'Frogfoot 1000/500Mbps', 'cmdlk6hco0001n82w6snjfe9g', 'FIBRE', '1000Mbps/500Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1540, 1540, true, false, '2025-07-27 10:51:05.237', '2025-07-27 10:51:05.237', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('frogfoot_frogfoot_1000_1000mbps', 'Frogfoot 1000/1000Mbps', 'cmdlk6hco0001n82w6snjfe9g', 'FIBRE', '1000Mbps/1000Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1710, 1710, true, false, '2025-07-27 10:51:05.243', '2025-07-27 10:51:05.243', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vuma_vuma_25_25mbps', 'Vuma 25/25Mbps', 'cmdlk6hcz0002n82w2pkzgv60', 'FIBRE', '25Mbps/25Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 480, 480, true, false, '2025-07-27 10:51:05.254', '2025-07-27 10:51:05.254', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vuma_vuma_50_25mbps', 'Vuma 50/25Mbps', 'cmdlk6hcz0002n82w2pkzgv60', 'FIBRE', '50Mbps/25Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 594, 594, true, false, '2025-07-27 10:51:05.263', '2025-07-27 10:51:05.263', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vuma_vuma_50_50mbps', 'Vuma 50/50Mbps', 'cmdlk6hcz0002n82w2pkzgv60', 'FIBRE', '50Mbps/50Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 794, 794, true, false, '2025-07-27 10:51:05.27', '2025-07-27 10:51:05.27', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vuma_vuma_100_50mbps', 'Vuma 100/50Mbps', 'cmdlk6hcz0002n82w2pkzgv60', 'FIBRE', '100Mbps/50Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 794, 794, true, false, '2025-07-27 10:51:05.276', '2025-07-27 10:51:05.276', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vuma_vuma_100_100mbps', 'Vuma 100/100Mbps', 'cmdlk6hcz0002n82w2pkzgv60', 'FIBRE', '100Mbps/100Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 994, 994, true, false, '2025-07-27 10:51:05.284', '2025-07-27 10:51:05.284', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vuma_vuma_200_200mbps', 'Vuma 200/200Mbps', 'cmdlk6hcz0002n82w2pkzgv60', 'FIBRE', '200Mbps/200Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1144, 1144, true, false, '2025-07-27 10:51:05.29', '2025-07-27 10:51:05.29', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vuma_vuma_500_200mbps', 'Vuma 500/200Mbps', 'cmdlk6hcz0002n82w2pkzgv60', 'FIBRE', '500Mbps/200Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1294, 1294, true, false, '2025-07-27 10:51:05.296', '2025-07-27 10:51:05.296', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vuma_vuma_1000_250mbps', 'Vuma 1000/250Mbps', 'cmdlk6hcz0002n82w2pkzgv60', 'FIBRE', '1000Mbps/250Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1634, 1634, true, false, '2025-07-27 10:51:05.302', '2025-07-27 10:51:05.302', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vuma_vuma_1000_500mbps', 'Vuma 1000/500Mbps', 'cmdlk6hcz0002n82w2pkzgv60', 'FIBRE', '1000Mbps/500Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 2355, 2355, true, false, '2025-07-27 10:51:05.308', '2025-07-27 10:51:05.308', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('octotel_octotel_25_25mbps', 'Octotel 25/25Mbps', 'cmdlk6hd80003n82wqczg8f1d', 'FIBRE', '25Mbps/25Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 375, 375, true, false, '2025-07-27 10:51:05.314', '2025-07-27 10:51:05.314', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('octotel_octotel_55_25mbps', 'Octotel 55/25Mbps', 'cmdlk6hd80003n82wqczg8f1d', 'FIBRE', '55Mbps/25Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 640, 640, true, false, '2025-07-27 10:51:05.319', '2025-07-27 10:51:05.319', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('octotel_octotel_100_100mbps', 'Octotel 100/100Mbps', 'cmdlk6hd80003n82wqczg8f1d', 'FIBRE', '100Mbps/100Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 860, 860, true, false, '2025-07-27 10:51:05.327', '2025-07-27 10:51:05.327', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('octotel_octotel_150_150mbps', 'Octotel 150/150Mbps', 'cmdlk6hd80003n82wqczg8f1d', 'FIBRE', '150Mbps/150Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 960, 960, true, false, '2025-07-27 10:51:05.335', '2025-07-27 10:51:05.335', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('octotel_octotel_300_200mbps', 'Octotel 300/200Mbps', 'cmdlk6hd80003n82wqczg8f1d', 'FIBRE', '300Mbps/200Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1115, 1115, true, false, '2025-07-27 10:51:05.341', '2025-07-27 10:51:05.341', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('octotel_octotel_500_200mbps', 'Octotel 500/200Mbps', 'cmdlk6hd80003n82wqczg8f1d', 'FIBRE', '500Mbps/200Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1315, 1315, true, false, '2025-07-27 10:51:05.347', '2025-07-27 10:51:05.347', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('octotel_octotel_1000_200mbps', 'Octotel 1000/200Mbps', 'cmdlk6hd80003n82wqczg8f1d', 'FIBRE', '1000Mbps/200Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1585, 1585, true, false, '2025-07-27 10:51:05.355', '2025-07-27 10:51:05.355', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('tt_connect_tt_connect_30_30mbps', 'TT Connect 30/30Mbps', 'cmdlk6hdh0004n82w2ifjj4gu', 'FIBRE', '30Mbps/30Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 725, 725, true, false, '2025-07-27 10:51:05.363', '2025-07-27 10:51:05.363', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('tt_connect_tt_connect_50_50mbps', 'TT Connect 50/50Mbps', 'cmdlk6hdh0004n82w2ifjj4gu', 'FIBRE', '50Mbps/50Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 935, 935, true, false, '2025-07-27 10:51:05.369', '2025-07-27 10:51:05.369', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('tt_connect_tt_connect_100_100mbps', 'TT Connect 100/100Mbps', 'cmdlk6hdh0004n82w2ifjj4gu', 'FIBRE', '100Mbps/100Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1030, 1030, true, false, '2025-07-27 10:51:05.375', '2025-07-27 10:51:05.375', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('tt_connect_tt_connect_200_200mbps', 'TT Connect 200/200Mbps', 'cmdlk6hdh0004n82w2ifjj4gu', 'FIBRE', '200Mbps/200Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1235, 1235, true, false, '2025-07-27 10:51:05.382', '2025-07-27 10:51:05.382', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('tt_connect_tt_connect_400_400mbps', 'TT Connect 400/400Mbps', 'cmdlk6hdh0004n82w2ifjj4gu', 'FIBRE', '400Mbps/400Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1525, 1525, true, false, '2025-07-27 10:51:05.388', '2025-07-27 10:51:05.388', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('tt_connect_tt_connect_525_525mbps', 'TT Connect 525/525Mbps', 'cmdlk6hdh0004n82w2ifjj4gu', 'FIBRE', '525Mbps/525Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1725, 1725, true, false, '2025-07-27 10:51:05.395', '2025-07-27 10:51:05.395', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('tt_connect_tt_connect_850_850mbps', 'TT Connect 850/850Mbps', 'cmdlk6hdh0004n82w2ifjj4gu', 'FIBRE', '850Mbps/850Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1915, 1915, true, false, '2025-07-27 10:51:05.4', '2025-07-27 10:51:05.4', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('tt_connect_tt_connect_1000_1000mbps', 'TT Connect 1000/1000Mbps', 'cmdlk6hdh0004n82w2ifjj4gu', 'FIBRE', '1000Mbps/1000Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 2369, 2369, true, false, '2025-07-27 10:51:05.406', '2025-07-27 10:51:05.406', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('mitsol_mitsol_20_20mbps', 'Mitsol 20/20Mbps', 'cmdlk6hdr0005n82w1gl6y9p3', 'FIBRE', '20Mbps/20Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 535, 535, true, false, '2025-07-27 10:51:05.413', '2025-07-27 10:51:05.413', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('mitsol_mitsol_50_25mbps', 'Mitsol 50/25Mbps', 'cmdlk6hdr0005n82w1gl6y9p3', 'FIBRE', '50Mbps/25Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 615, 615, true, false, '2025-07-27 10:51:05.418', '2025-07-27 10:51:05.418', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('mitsol_mitsol_120_60mbps', 'Mitsol 120/60Mbps', 'cmdlk6hdr0005n82w1gl6y9p3', 'FIBRE', '120Mbps/60Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 815, 815, true, false, '2025-07-27 10:51:05.424', '2025-07-27 10:51:05.424', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('mitsol_mitsol_120_120mbps', 'Mitsol 120/120Mbps', 'cmdlk6hdr0005n82w1gl6y9p3', 'FIBRE', '120Mbps/120Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 915, 915, true, false, '2025-07-27 10:51:05.431', '2025-07-27 10:51:05.431', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('mitsol_mitsol_240_240mbps', 'Mitsol 240/240Mbps', 'cmdlk6hdr0005n82w1gl6y9p3', 'FIBRE', '240Mbps/240Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1105, 1105, true, false, '2025-07-27 10:51:05.438', '2025-07-27 10:51:05.438', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('mitsol_mitsol_500_500mbps', 'Mitsol 500/500Mbps', 'cmdlk6hdr0005n82w1gl6y9p3', 'FIBRE', '500Mbps/500Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1325, 1325, true, false, '2025-07-27 10:51:05.444', '2025-07-27 10:51:05.444', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('mitsol_mitsol_1000_1000mbps', 'Mitsol 1000/1000Mbps', 'cmdlk6hdr0005n82w1gl6y9p3', 'FIBRE', '1000Mbps/1000Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1525, 1525, true, false, '2025-07-27 10:51:05.451', '2025-07-27 10:51:05.451', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('evotel_evotel_20_10mbps', 'Evotel 20/10Mbps', 'cmdlk6he00006n82wja4xfo6a', 'FIBRE', '20Mbps/10Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 634, 634, true, false, '2025-07-27 10:51:05.458', '2025-07-27 10:51:05.458', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('evotel_evotel_60_60mbps', 'Evotel 60/60Mbps', 'cmdlk6he00006n82wja4xfo6a', 'FIBRE', '60Mbps/60Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 760, 760, true, false, '2025-07-27 10:51:05.464', '2025-07-27 10:51:05.464', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('evotel_evotel_125_125mbps', 'Evotel 125/125Mbps', 'cmdlk6he00006n82wja4xfo6a', 'FIBRE', '125Mbps/125Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 920, 920, true, false, '2025-07-27 10:51:05.471', '2025-07-27 10:51:05.471', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('evotel_evotel_250_250mbps', 'Evotel 250/250Mbps', 'cmdlk6he00006n82wja4xfo6a', 'FIBRE', '250Mbps/250Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1090, 1090, true, false, '2025-07-27 10:51:05.479', '2025-07-27 10:51:05.479', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('evotel_evotel_600_600mbps', 'Evotel 600/600Mbps', 'cmdlk6he00006n82wja4xfo6a', 'FIBRE', '600Mbps/600Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1170, 1170, true, false, '2025-07-27 10:51:05.486', '2025-07-27 10:51:05.486', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('evotel_evotel_850_850mbps', 'Evotel 850/850Mbps', 'cmdlk6he00006n82wja4xfo6a', 'FIBRE', '850Mbps/850Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1470, 1470, true, false, '2025-07-27 10:51:05.492', '2025-07-27 10:51:05.492', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('thinkspeed_thinkspeed_30_30mbps', 'Thinkspeed 30/30Mbps', 'cmdlk6heb0007n82wu3bhw0oz', 'FIBRE', '30Mbps/30Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 675, 675, true, false, '2025-07-27 10:51:05.498', '2025-07-27 10:51:05.498', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('thinkspeed_thinkspeed_50_50mbps', 'Thinkspeed 50/50Mbps', 'cmdlk6heb0007n82wu3bhw0oz', 'FIBRE', '50Mbps/50Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 875, 875, true, false, '2025-07-27 10:51:05.504', '2025-07-27 10:51:05.504', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('thinkspeed_thinkspeed_100_100mbps', 'Thinkspeed 100/100Mbps', 'cmdlk6heb0007n82wu3bhw0oz', 'FIBRE', '100Mbps/100Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 975, 975, true, false, '2025-07-27 10:51:05.51', '2025-07-27 10:51:05.51', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('thinkspeed_thinkspeed_200_200mbps', 'Thinkspeed 200/200Mbps', 'cmdlk6heb0007n82wu3bhw0oz', 'FIBRE', '200Mbps/200Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1175, 1175, true, false, '2025-07-27 10:51:05.516', '2025-07-27 10:51:05.516', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('thinkspeed_thinkspeed_500_500mbps', 'Thinkspeed 500/500Mbps', 'cmdlk6heb0007n82wu3bhw0oz', 'FIBRE', '500Mbps/500Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1375, 1375, true, false, '2025-07-27 10:51:05.522', '2025-07-27 10:51:05.522', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('thinkspeed_thinkspeed_1000_500mbps', 'Thinkspeed 1000/500Mbps', 'cmdlk6heb0007n82wu3bhw0oz', 'FIBRE', '1000Mbps/500Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1475, 1475, true, false, '2025-07-27 10:51:05.529', '2025-07-27 10:51:05.529', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('clearaccess_clearaccess_8_8mbps', 'Clearaccess 8/8Mbps', 'cmdlk6hek0008n82wo7mqrnkj', 'FIBRE', '8Mbps/8Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 320, 320, true, false, '2025-07-27 10:51:05.537', '2025-07-27 10:51:05.537', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('clearaccess_clearaccess_25_25mbps', 'Clearaccess 25/25Mbps', 'cmdlk6hek0008n82wo7mqrnkj', 'FIBRE', '25Mbps/25Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 775, 775, true, false, '2025-07-27 10:51:05.543', '2025-07-27 10:51:05.543', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('clearaccess_clearaccess_50_50mbps', 'Clearaccess 50/50Mbps', 'cmdlk6hek0008n82wo7mqrnkj', 'FIBRE', '50Mbps/50Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 985, 985, true, false, '2025-07-27 10:51:05.55', '2025-07-27 10:51:05.55', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('clearaccess_clearaccess_100_100mbps', 'Clearaccess 100/100Mbps', 'cmdlk6hek0008n82wo7mqrnkj', 'FIBRE', '100Mbps/100Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1135, 1135, true, false, '2025-07-27 10:51:05.556', '2025-07-27 10:51:05.556', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('clearaccess_clearaccess_200_200mbps', 'Clearaccess 200/200Mbps', 'cmdlk6hek0008n82wo7mqrnkj', 'FIBRE', '200Mbps/200Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1365, 1365, true, false, '2025-07-27 10:51:05.562', '2025-07-27 10:51:05.562', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('dnatel_dnatel_10_10mbps', 'DNATel 10/10Mbps', 'cmdlk6hf00009n82wmz7jz3kb', 'FIBRE', '10Mbps/10Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 620, 620, true, false, '2025-07-27 10:51:05.568', '2025-07-27 10:51:05.568', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('dnatel_dnatel_30_30mbps', 'DNATel 30/30Mbps', 'cmdlk6hf00009n82wmz7jz3kb', 'FIBRE', '30Mbps/30Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 650, 650, true, false, '2025-07-27 10:51:05.575', '2025-07-27 10:51:05.575', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('dnatel_dnatel_50_50mbps', 'DNATel 50/50Mbps', 'cmdlk6hf00009n82wmz7jz3kb', 'FIBRE', '50Mbps/50Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 785, 785, true, false, '2025-07-27 10:51:05.582', '2025-07-27 10:51:05.582', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('dnatel_dnatel_100_100mbps', 'DNATel 100/100Mbps', 'cmdlk6hf00009n82wmz7jz3kb', 'FIBRE', '100Mbps/100Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 915, 915, true, false, '2025-07-27 10:51:05.588', '2025-07-27 10:51:05.588', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('dnatel_dnatel_200_200mbps', 'DNATel 200/200Mbps', 'cmdlk6hf00009n82wmz7jz3kb', 'FIBRE', '200Mbps/200Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 985, 985, true, false, '2025-07-27 10:51:05.595', '2025-07-27 10:51:05.595', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vodacom_vodacom_20_10mbps', 'Vodacom 20/10Mbps', 'cmdlk6hht000jn82wnijxrug5', 'FIBRE', '20Mbps/10Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 594, 594, true, false, '2025-07-27 10:51:05.602', '2025-07-27 10:51:05.602', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vodacom_vodacom_20_20mbps', 'Vodacom 20/20Mbps', 'cmdlk6hht000jn82wnijxrug5', 'FIBRE', '20Mbps/20Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 694, 694, true, false, '2025-07-27 10:51:05.608', '2025-07-27 10:51:05.608', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vodacom_vodacom_50_25mbps', 'Vodacom 50/25Mbps', 'cmdlk6hht000jn82wnijxrug5', 'FIBRE', '50Mbps/25Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 794, 794, true, false, '2025-07-27 10:51:05.615', '2025-07-27 10:51:05.615', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vodacom_vodacom_50_50mbps', 'Vodacom 50/50Mbps', 'cmdlk6hht000jn82wnijxrug5', 'FIBRE', '50Mbps/50Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 894, 894, true, false, '2025-07-27 10:51:05.621', '2025-07-27 10:51:05.621', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vodacom_vodacom_100_100mbps', 'Vodacom 100/100Mbps', 'cmdlk6hht000jn82wnijxrug5', 'FIBRE', '100Mbps/100Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 994, 994, true, false, '2025-07-27 10:51:05.628', '2025-07-27 10:51:05.628', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vodacom_vodacom_200_200mbps', 'Vodacom 200/200Mbps', 'cmdlk6hht000jn82wnijxrug5', 'FIBRE', '200Mbps/200Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1094, 1094, true, false, '2025-07-27 10:51:05.636', '2025-07-27 10:51:05.636', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('link_layer_link_layer_30_30mbps', 'Link Layer 30/30Mbps', 'cmdlk6hfd000an82wewqqn6sp', 'FIBRE', '30Mbps/30Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 520, 520, true, false, '2025-07-27 10:51:05.644', '2025-07-27 10:51:05.644', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('link_layer_link_layer_50_50mbps', 'Link Layer 50/50Mbps', 'cmdlk6hfd000an82wewqqn6sp', 'FIBRE', '50Mbps/50Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 720, 720, true, false, '2025-07-27 10:51:05.651', '2025-07-27 10:51:05.651', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('link_layer_link_layer_100_100mbps', 'Link Layer 100/100Mbps', 'cmdlk6hfd000an82wewqqn6sp', 'FIBRE', '100Mbps/100Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 870, 870, true, false, '2025-07-27 10:51:05.657', '2025-07-27 10:51:05.657', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('link_layer_link_layer_200_200mbps', 'Link Layer 200/200Mbps', 'cmdlk6hfd000an82wewqqn6sp', 'FIBRE', '200Mbps/200Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1030, 1030, true, false, '2025-07-27 10:51:05.664', '2025-07-27 10:51:05.664', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('link_layer_link_layer_500_500mbps', 'Link Layer 500/500Mbps', 'cmdlk6hfd000an82wewqqn6sp', 'FIBRE', '500Mbps/500Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1325, 1325, true, false, '2025-07-27 10:51:05.677', '2025-07-27 10:51:05.677', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('metrofibre_nexus_nexus_25_25mbps', 'Nexus 25/25Mbps', 'cmdlk6hfn000bn82w00oz95ka', 'FIBRE', '25Mbps/25Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 395, 395, true, false, '2025-07-27 10:51:05.687', '2025-07-27 10:51:05.687', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('metrofibre_nexus_nexus_45_45mbps', 'Nexus 45/45Mbps', 'cmdlk6hfn000bn82w00oz95ka', 'FIBRE', '45Mbps/45Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 685, 685, true, false, '2025-07-27 10:51:05.694', '2025-07-27 10:51:05.694', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('metrofibre_nexus_nexus_75_75mbps', 'Nexus 75/75Mbps', 'cmdlk6hfn000bn82w00oz95ka', 'FIBRE', '75Mbps/75Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 785, 785, true, false, '2025-07-27 10:51:05.701', '2025-07-27 10:51:05.701', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('metrofibre_nexus_nexus_150_150mbps', 'Nexus 150/150Mbps', 'cmdlk6hfn000bn82w00oz95ka', 'FIBRE', '150Mbps/150Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 885, 885, true, false, '2025-07-27 10:51:05.707', '2025-07-27 10:51:05.707', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('metrofibre_nexus_nexus_250_250mbps', 'Nexus 250/250Mbps', 'cmdlk6hfn000bn82w00oz95ka', 'FIBRE', '250Mbps/250Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 955, 955, true, false, '2025-07-27 10:51:05.714', '2025-07-27 10:51:05.714', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('metrofibre_nexus_nexus_500_500mbps', 'Nexus 500/500Mbps', 'cmdlk6hfn000bn82w00oz95ka', 'FIBRE', '500Mbps/500Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1375, 1375, true, false, '2025-07-27 10:51:05.721', '2025-07-27 10:51:05.721', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('metrofibre_nexus_nexus_1000_200mbps', 'Nexus 1000/200Mbps', 'cmdlk6hfn000bn82w00oz95ka', 'FIBRE', '1000Mbps/200Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1435, 1435, true, false, '2025-07-27 10:51:05.729', '2025-07-27 10:51:05.729', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('metrofibre_nova_nova_20_20mbps', 'Nova 20/20Mbps', 'cmdlk6hfz000cn82wmprofpjp', 'FIBRE', '20Mbps/20Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 485, 485, true, false, '2025-07-27 10:51:05.735', '2025-07-27 10:51:05.735', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('metrofibre_nova_nova_40_40mbps', 'Nova 40/40Mbps', 'cmdlk6hfz000cn82wmprofpjp', 'FIBRE', '40Mbps/40Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 585, 585, true, false, '2025-07-27 10:51:05.743', '2025-07-27 10:51:05.743', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('metrofibre_nova_nova_60_60mbps', 'Nova 60/60Mbps', 'cmdlk6hfz000cn82wmprofpjp', 'FIBRE', '60Mbps/60Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 685, 685, true, false, '2025-07-27 10:51:05.75', '2025-07-27 10:51:05.75', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('metrofibre_nova_nova_150_150mbps', 'Nova 150/150Mbps', 'cmdlk6hfz000cn82wmprofpjp', 'FIBRE', '150Mbps/150Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 885, 885, true, false, '2025-07-27 10:51:05.756', '2025-07-27 10:51:05.756', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('metrofibre_nova_nova_250_250mbps', 'Nova 250/250Mbps', 'cmdlk6hfz000cn82wmprofpjp', 'FIBRE', '250Mbps/250Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 955, 955, true, false, '2025-07-27 10:51:05.763', '2025-07-27 10:51:05.763', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('metrofibre_nova_nova_500_500mbps', 'Nova 500/500Mbps', 'cmdlk6hfz000cn82wmprofpjp', 'FIBRE', '500Mbps/500Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1385, 1385, true, false, '2025-07-27 10:51:05.771', '2025-07-27 10:51:05.771', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('metrofibre_nova_nova_1000_250mbps', 'Nova 1000/250Mbps', 'cmdlk6hfz000cn82wmprofpjp', 'FIBRE', '1000Mbps/250Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1445, 1445, true, false, '2025-07-27 10:51:05.779', '2025-07-27 10:51:05.779', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('steyn_city_steyn_city_10_10mbps', 'Steyn City 10/10Mbps', 'cmdlk6hg9000dn82wutl4960n', 'FIBRE', '10Mbps/10Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 675, 675, true, false, '2025-07-27 10:51:05.786', '2025-07-27 10:51:05.786', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('steyn_city_steyn_city_25_25mbps', 'Steyn City 25/25Mbps', 'cmdlk6hg9000dn82wutl4960n', 'FIBRE', '25Mbps/25Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 875, 875, true, false, '2025-07-27 10:51:05.793', '2025-07-27 10:51:05.793', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('steyn_city_steyn_city_50_50mbps', 'Steyn City 50/50Mbps', 'cmdlk6hg9000dn82wutl4960n', 'FIBRE', '50Mbps/50Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1175, 1175, true, false, '2025-07-27 10:51:05.802', '2025-07-27 10:51:05.802', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('steyn_city_steyn_city_100_100mbps', 'Steyn City 100/100Mbps', 'cmdlk6hg9000dn82wutl4960n', 'FIBRE', '100Mbps/100Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1555, 1555, true, false, '2025-07-27 10:51:05.809', '2025-07-27 10:51:05.809', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('steyn_city_steyn_city_200_200mbps', 'Steyn City 200/200Mbps', 'cmdlk6hg9000dn82wutl4960n', 'FIBRE', '200Mbps/200Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1975, 1975, true, false, '2025-07-27 10:51:05.815', '2025-07-27 10:51:05.815', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('zoom_fibre_zoom_fibre_50_50mbps', 'Zoom Fibre 50/50Mbps', 'cmdlk6hgi000en82whqvar0a1', 'FIBRE', '50Mbps/50Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 685, 685, true, false, '2025-07-27 10:51:05.822', '2025-07-27 10:51:05.822', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('zoom_fibre_zoom_fibre_100_100mbps', 'Zoom Fibre 100/100Mbps', 'cmdlk6hgi000en82whqvar0a1', 'FIBRE', '100Mbps/100Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 885, 885, true, false, '2025-07-27 10:51:05.828', '2025-07-27 10:51:05.828', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('zoom_fibre_zoom_fibre_200_200mbps', 'Zoom Fibre 200/200Mbps', 'cmdlk6hgi000en82whqvar0a1', 'FIBRE', '200Mbps/200Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 985, 985, true, false, '2025-07-27 10:51:05.835', '2025-07-27 10:51:05.835', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('zoom_fibre_zoom_fibre_500_250mbps', 'Zoom Fibre 500/250Mbps', 'cmdlk6hgi000en82whqvar0a1', 'FIBRE', '500Mbps/250Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1150, 1150, true, false, '2025-07-27 10:51:05.842', '2025-07-27 10:51:05.842', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('zoom_fibre_zoom_fibre_1000_500mbps', 'Zoom Fibre 1000/500Mbps', 'cmdlk6hgi000en82whqvar0a1', 'FIBRE', '1000Mbps/500Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1275, 1275, true, false, '2025-07-27 10:51:05.847', '2025-07-27 10:51:05.847', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('netstream_netstream_4_4mbps', 'Netstream 4/4Mbps', 'cmdlk6hgr000fn82wvfek1xqf', 'FIBRE', '4Mbps/4Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 605, 605, true, false, '2025-07-27 10:51:05.856', '2025-07-27 10:51:05.856', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('netstream_netstream_10_10mbps', 'Netstream 10/10Mbps', 'cmdlk6hgr000fn82wvfek1xqf', 'FIBRE', '10Mbps/10Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 735, 735, true, false, '2025-07-27 10:51:05.863', '2025-07-27 10:51:05.863', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('netstream_netstream_20_20mbps', 'Netstream 20/20Mbps', 'cmdlk6hgr000fn82wvfek1xqf', 'FIBRE', '20Mbps/20Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 905, 905, true, false, '2025-07-27 10:51:05.869', '2025-07-27 10:51:05.869', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('netstream_netstream_50_50mbps', 'Netstream 50/50Mbps', 'cmdlk6hgr000fn82wvfek1xqf', 'FIBRE', '50Mbps/50Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1105, 1105, true, false, '2025-07-27 10:51:05.878', '2025-07-27 10:51:05.878', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('netstream_netstream_100_100mbps', 'Netstream 100/100Mbps', 'cmdlk6hgr000fn82wvfek1xqf', 'FIBRE', '100Mbps/100Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1305, 1305, true, false, '2025-07-27 10:51:05.885', '2025-07-27 10:51:05.885', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('lightstruck_lightstruck_50_50mbps', 'Lightstruck 50/50Mbps', 'cmdlk6hh3000gn82wn1l40wk1', 'FIBRE', '50Mbps/50Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 790, 790, true, false, '2025-07-27 10:51:05.892', '2025-07-27 10:51:05.892', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('lightstruck_lightstruck_200_100mbps', 'Lightstruck 200/100Mbps', 'cmdlk6hh3000gn82wn1l40wk1', 'FIBRE', '200Mbps/100Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1090, 1090, true, false, '2025-07-27 10:51:05.899', '2025-07-27 10:51:05.899', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('lightstruck_lightstruck_250_200mbps', 'Lightstruck 250/200Mbps', 'cmdlk6hh3000gn82wn1l40wk1', 'FIBRE', '250Mbps/200Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1290, 1290, true, false, '2025-07-27 10:51:05.906', '2025-07-27 10:51:05.906', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('lightstruck_lightstruck_250_250mbps', 'Lightstruck 250/250Mbps', 'cmdlk6hh3000gn82wn1l40wk1', 'FIBRE', '250Mbps/250Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1390, 1390, true, false, '2025-07-27 10:51:05.912', '2025-07-27 10:51:05.912', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('lightstruck_lightstruck_500_500mbps', 'Lightstruck 500/500Mbps', 'cmdlk6hh3000gn82wn1l40wk1', 'FIBRE', '500Mbps/500Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1490, 1490, true, false, '2025-07-27 10:51:05.921', '2025-07-27 10:51:05.921', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('lightstruck_lightstruck_1000_1000mbps', 'Lightstruck 1000/1000Mbps', 'cmdlk6hh3000gn82wn1l40wk1', 'FIBRE', '1000Mbps/1000Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 2190, 2190, true, false, '2025-07-27 10:51:05.929', '2025-07-27 10:51:05.929', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('pphg_pphg_50_25mbps', 'PPHG 50/25Mbps', 'cmdlk6hhc000hn82wroybn5u1', 'FIBRE', '50Mbps/25Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 690, 690, true, false, '2025-07-27 10:51:05.938', '2025-07-27 10:51:05.938', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('pphg_pphg_50_50mbps', 'PPHG 50/50Mbps', 'cmdlk6hhc000hn82wroybn5u1', 'FIBRE', '50Mbps/50Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 790, 790, true, false, '2025-07-27 10:51:05.943', '2025-07-27 10:51:05.943', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('pphg_pphg_100_50mbps', 'PPHG 100/50Mbps', 'cmdlk6hhc000hn82wroybn5u1', 'FIBRE', '100Mbps/50Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 890, 890, true, false, '2025-07-27 10:51:05.95', '2025-07-27 10:51:05.95', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('pphg_pphg_100_100mbps', 'PPHG 100/100Mbps', 'cmdlk6hhc000hn82wroybn5u1', 'FIBRE', '100Mbps/100Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 990, 990, true, false, '2025-07-27 10:51:05.957', '2025-07-27 10:51:05.957', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('pphg_pphg_200_100mbps', 'PPHG 200/100Mbps', 'cmdlk6hhc000hn82wroybn5u1', 'FIBRE', '200Mbps/100Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1090, 1090, true, false, '2025-07-27 10:51:05.965', '2025-07-27 10:51:05.965', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('pphg_pphg_200_200mbps', 'PPHG 200/200Mbps', 'cmdlk6hhc000hn82wroybn5u1', 'FIBRE', '200Mbps/200Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1190, 1190, true, false, '2025-07-27 10:51:05.972', '2025-07-27 10:51:05.972', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('pphg_pphg_250_200mbps', 'PPHG 250/200Mbps', 'cmdlk6hhc000hn82wroybn5u1', 'FIBRE', '250Mbps/200Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1290, 1290, true, false, '2025-07-27 10:51:05.979', '2025-07-27 10:51:05.979', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('pphg_pphg_250_250mbps', 'PPHG 250/250Mbps', 'cmdlk6hhc000hn82wroybn5u1', 'FIBRE', '250Mbps/250Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1390, 1390, true, false, '2025-07-27 10:51:05.985', '2025-07-27 10:51:05.985', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('pphg_pphg_500_500mbps', 'PPHG 500/500Mbps', 'cmdlk6hhc000hn82wroybn5u1', 'FIBRE', '500Mbps/500Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 1490, 1490, true, false, '2025-07-27 10:51:05.993', '2025-07-27 10:51:05.993', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('pphg_pphg_1000_1000mbps', 'PPHG 1000/1000Mbps', 'cmdlk6hhc000hn82wroybn5u1', 'FIBRE', '1000Mbps/1000Mbps', 'Uncapped', NULL, NULL, NULL, NULL, NULL, 'Pro Rata applies to all Fibre Accounts', NULL, 'Fibre', NULL, NULL, 2190, 2190, true, false, '2025-07-27 10:51:05.999', '2025-07-27 10:51:05.999', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vodacom_lte_up_to_20mbps', 'Up to 20Mbps', 'cmdlk6hht000jn82wnijxrug5', 'LTE_FIXED', '20Mbps', 'Uncapped', NULL, NULL, '50GB', '2Mbps', NULL, 'Once AUP limit is reached, speed will change to 2Mbps', 'Speed is dependant on LTE router and network coverage', 'LTE', NULL, NULL, 269, 269, true, false, '2025-07-27 10:51:06.006', '2025-07-27 10:51:06.006', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vodacom_lte_up_to_30mbps', 'Up to 30Mbps', 'cmdlk6hht000jn82wnijxrug5', 'LTE_FIXED', '30Mbps', 'Uncapped', NULL, NULL, '150GB', '2Mbps', NULL, 'Once AUP limit is reached, speed will change to 2Mbps', 'Speed is dependant on LTE router and network coverage', 'LTE', NULL, NULL, 369, 369, true, false, '2025-07-27 10:51:06.012', '2025-07-27 10:51:06.012', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vodacom_lte_up_to_50mbps', 'Up to 50Mbps', 'cmdlk6hht000jn82wnijxrug5', 'LTE_FIXED', '50Mbps', 'Uncapped', NULL, NULL, '300GB', '2Mbps', NULL, 'Once AUP limit is reached, speed will change to 2Mbps', 'Speed is dependant on LTE router and network coverage', 'LTE', NULL, NULL, 469, 469, true, false, '2025-07-27 10:51:06.019', '2025-07-27 10:51:06.019', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vodacom_lte_uncapped_pro', 'Uncapped LTE PRO', 'cmdlk6hht000jn82wnijxrug5', 'LTE_FIXED', '100Mbps+ unlimited', 'Uncapped', NULL, NULL, '600GB', '1Mbps', NULL, 'Once AUP limit is reached, speed will change to 1Mbps', NULL, 'LTE', NULL, NULL, 669, 669, true, false, '2025-07-27 10:51:06.029', '2025-07-27 10:51:06.029', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('mtn_lte_up_to_30mbps', 'Up to 30Mbps', 'cmdlk6hhj000in82wqwfucnb9', 'LTE_FIXED', '30Mbps', 'Uncapped', NULL, NULL, '50GB', '2Mbps', NULL, 'Speed is dependent on LTE router and available capacity on the LTE tower your device is connected to', NULL, 'LTE', NULL, NULL, 339, 339, true, false, '2025-07-27 10:51:06.036', '2025-07-27 10:51:06.036', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('mtn_lte_up_to_75mbps', 'Up to 75Mbps', 'cmdlk6hhj000in82wqwfucnb9', 'LTE_FIXED', '75Mbps', 'Uncapped', NULL, NULL, '150GB', '2Mbps', NULL, 'Speed is dependent on LTE router and available capacity on the LTE tower your device is connected to', NULL, 'LTE', NULL, NULL, 379, 379, true, false, '2025-07-27 10:51:06.044', '2025-07-27 10:51:06.044', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('mtn_lte_up_to_125mbps', 'Up to 125Mbps', 'cmdlk6hhj000in82wqwfucnb9', 'LTE_FIXED', '125Mbps', 'Uncapped', NULL, NULL, '300GB', '2Mbps', NULL, 'Speed is dependent on LTE router and available capacity on the LTE tower your device is connected to', NULL, 'LTE', NULL, NULL, 469, 469, true, false, '2025-07-27 10:51:06.05', '2025-07-27 10:51:06.05', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('mtn_lte_up_to_150mbps', 'Up to 150Mbps', 'cmdlk6hhj000in82wqwfucnb9', 'LTE_FIXED', '150Mbps', 'Uncapped', NULL, NULL, '500GB', '2Mbps', NULL, 'Speed is dependent on LTE router and available capacity on the LTE tower your device is connected to', NULL, 'LTE', NULL, NULL, 569, 569, true, false, '2025-07-27 10:51:06.058', '2025-07-27 10:51:06.058', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('mtn_lte_uncapped_pro', 'Uncapped LTE (Pro)', 'cmdlk6hhj000in82wqwfucnb9', 'LTE_FIXED', '150Mbps+ unlimited', 'Uncapped', NULL, NULL, '1000GB', '1Mbps', NULL, 'Once AUP limit is reached, speed will change to 1Mbps. Speed is dependent on LTE router and network coverage', 'Operating time - 24 Hours', 'LTE', NULL, NULL, 799, 799, true, false, '2025-07-27 10:51:06.066', '2025-07-27 10:51:06.066', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('telkom_lte_10mbps', '10 Mbps Package', 'cmdlk6hi2000kn82w7lunuwib', 'LTE_FIXED', '10Mbps', 'Uncapped', NULL, NULL, '100GB', '4Mbps', '2Mbps', '100GB data @ 10Mbps. Thereafter 20GB data @ 4Mbps. Thereafter 2Mbps uncapped data rest of the month', 'P2P/NNTP type traffic will be further throttled. The promotional price is valid until 31 December 2025', 'LTE', NULL, NULL, 298, 298, true, false, '2025-07-27 10:51:06.073', '2025-07-27 10:51:06.073', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('telkom_lte_20mbps', '20 Mbps Package', 'cmdlk6hi2000kn82w7lunuwib', 'LTE_FIXED', '20Mbps', 'Uncapped', NULL, NULL, '500GB', '4Mbps', '2Mbps', '500GB data @ 20Mbps. Thereafter 50GB data @ 4Mbps. Thereafter 2Mbps uncapped data rest of the month', 'P2P/NNTP type traffic will be further throttled', 'LTE', NULL, NULL, 589, 589, true, false, '2025-07-27 10:51:06.079', '2025-07-27 10:51:06.079', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('telkom_lte_30mbps', '30 Mbps Package', 'cmdlk6hi2000kn82w7lunuwib', 'LTE_FIXED', '30Mbps', 'Uncapped', NULL, NULL, '600GB', '4Mbps', '2Mbps', '600GB data @ 30Mbps. Thereafter 50GB data @ 4Mbps. Thereafter 2Mbps uncapped data rest of the month', 'P2P/NNTP type traffic will be further throttled', 'LTE', NULL, NULL, 679, 679, true, false, '2025-07-27 10:51:06.089', '2025-07-27 10:51:06.089', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('mtn_5g_standard', 'STANDARD', 'cmdlk6hhj000in82wqwfucnb9', '5G_FIXED', 'up to 500Mbps', 'Uncapped', NULL, NULL, '300GB', '2Mbps', NULL, 'Speed is up to 500Mbps (dependent on 5G router capability and available capacity on the 5G tower your device is connected to). Once AUP limit is reached, speed will change to 2Mbps', NULL, '5G', NULL, NULL, 399, 399, true, false, '2025-07-27 10:51:06.097', '2025-07-27 10:51:06.097', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('mtn_5g_advanced', 'ADVANCED', 'cmdlk6hhj000in82wqwfucnb9', '5G_FIXED', 'up to 500Mbps', 'Uncapped', NULL, NULL, '450GB', '2Mbps', NULL, 'Speed is up to 500Mbps (dependent on 5G router capability and available capacity on the 5G tower your device is connected to). Once AUP limit is reached, speed will change to 2Mbps', NULL, '5G', NULL, NULL, 549, 549, true, false, '2025-07-27 10:51:06.104', '2025-07-27 10:51:06.104', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('mtn_5g_pro', 'PRO', 'cmdlk6hhj000in82wqwfucnb9', '5G_FIXED', 'up to 500Mbps', 'Uncapped', NULL, NULL, '600GB', '2Mbps', NULL, 'Speed is up to 500Mbps (dependent on 5G router capability and available capacity on the 5G tower your device is connected to). Once AUP limit is reached, speed will change to 2Mbps', NULL, '5G', NULL, NULL, 649, 649, true, false, '2025-07-27 10:51:06.11', '2025-07-27 10:51:06.11', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('mtn_5g_pro_plus', 'PRO+', 'cmdlk6hhj000in82wqwfucnb9', '5G_FIXED', 'up to 500Mbps', 'Uncapped', NULL, NULL, '1000GB', '2Mbps', NULL, 'Speed is up to 500Mbps (dependent on 5G router capability and available capacity on the 5G tower your device is connected to). Once AUP limit is reached, speed will change to 2Mbps', NULL, '5G', NULL, NULL, 849, 849, true, false, '2025-07-27 10:51:06.117', '2025-07-27 10:51:06.117', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vodacom_5g_standard', 'STANDARD', 'cmdlk6hht000jn82wnijxrug5', '5G_FIXED', NULL, 'Uncapped', NULL, NULL, '250GB', NULL, NULL, 'Acceptable Use Policy (AUP) applies', NULL, '5G', NULL, NULL, 445, 445, true, false, '2025-07-27 10:51:06.124', '2025-07-27 10:51:06.124', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vodacom_5g_advanced', 'ADVANCED', 'cmdlk6hht000jn82wnijxrug5', '5G_FIXED', NULL, 'Uncapped', NULL, NULL, '350GB', NULL, NULL, 'Acceptable Use Policy (AUP) applies', NULL, '5G', NULL, NULL, 645, 645, true, false, '2025-07-27 10:51:06.129', '2025-07-27 10:51:06.129', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vodacom_5g_pro', 'PRO', 'cmdlk6hht000jn82wnijxrug5', '5G_FIXED', NULL, 'Uncapped', NULL, NULL, '550GB', NULL, NULL, 'Acceptable Use Policy (AUP) applies', NULL, '5G', NULL, NULL, 845, 845, true, false, '2025-07-27 10:51:06.135', '2025-07-27 10:51:06.135', NULL, NULL, NULL, false);
INSERT INTO public.packages VALUES ('vodacom_5g_pro_plus', 'PRO+', 'cmdlk6hht000jn82wnijxrug5', '5G_FIXED', NULL, 'Uncapped', NULL, NULL, '750GB', NULL, NULL, 'Acceptable Use Policy (AUP) applies', NULL, '5G', NULL, NULL, 945, 945, true, false, '2025-07-27 10:51:06.141', '2025-07-27 10:51:06.141', NULL, NULL, NULL, false);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES ('rSINEHGkXCRAsWpKbW554y0ZuhhBpOR0', 'admin@starcast.co.za', NULL, NULL, NULL, 'Leonard Roelofse', NULL, NULL, NULL, NULL, NULL, NULL, 'PENDING_APPROVAL', 'NOT_ACTIVE', '2025-07-27 22:12:32.981', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, 'ADMIN', true, true, NULL, '2025-07-27 22:12:32.979', '2025-07-27 22:12:33.012');
INSERT INTO public.users VALUES ('cmdm9cqc10005mt0f7lxhc4g5', 'leonard508@outlook.com', NULL, 'Leonard', 'Roelofse', NULL, '0834409624', '325 DAHLIA, FRIEMERSHEIM', 'Groot Brak Rivier', 'Western Cape', '6526', NULL, 'APPROVED', 'PENDING_PAYMENT', '2025-07-27 22:35:46.897', NULL, NULL, NULL, NULL, NULL, NULL, 'clearaccess_clearaccess_8_8mbps', NULL, NULL, true, 'USER', false, true, NULL, '2025-07-27 22:35:46.897', '2025-07-28 17:12:56.982');
INSERT INTO public.users VALUES ('cmdm95r4z0001mt0f20dxwdr9', 'apptv109@gmail.com', NULL, 'Leonard', 'Roelofse', NULL, '0815082450', '11 Brick road', 'George Industria, George, WC', 'Western Cape', '6530', NULL, 'APPROVED', 'PENDING_PAYMENT', '2025-07-27 22:30:21.348', NULL, NULL, NULL, NULL, NULL, NULL, 'clearaccess_clearaccess_100_100mbps', NULL, NULL, true, 'USER', false, true, NULL, '2025-07-27 22:30:21.348', '2025-07-28 17:13:23.493');
INSERT INTO public.users VALUES ('aZ800ema4rtUqOoEureY8HISuL4Qavda', 'admin2@starcast.co.za', NULL, NULL, NULL, 'Admin User Alt', NULL, NULL, NULL, NULL, NULL, NULL, 'PENDING_APPROVAL', 'NOT_ACTIVE', '2025-07-30 19:22:13.207', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 'USER', false, true, NULL, '2025-07-30 19:22:13.205', '2025-07-30 19:22:13.205');


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.accounts VALUES ('QVLakAI4OOU0foVAoncioBKMDMqopdxa', 'rSINEHGkXCRAsWpKbW554y0ZuhhBpOR0', 'rSINEHGkXCRAsWpKbW554y0ZuhhBpOR0', 'credential', NULL, NULL, NULL, NULL, NULL, NULL, 'c82be8b123417a62efd93a852097c663:b7755b226c8e91d05dffa554a9c691d02111f110154180ab9c3f21a04bdadb4b8d0cb9d8d2802c542381b9be2f91c472e378d2842143498de5c47057eb15c87b', '2025-07-27 22:12:32.989', '2025-07-27 22:12:32.989');
INSERT INTO public.accounts VALUES ('RDUgOwmnQyI82hX6Asm4lluoyiYfioxY', 'aZ800ema4rtUqOoEureY8HISuL4Qavda', 'aZ800ema4rtUqOoEureY8HISuL4Qavda', 'credential', NULL, NULL, NULL, NULL, NULL, NULL, '549e0e4845d2ca8c66e5ed18e356fd68:88a23b48b4680335a1be8debf8632450f76ee5e75e8b69a315c34f1f34299e5a8cd40502cebaff1344c1faaa5f3dddd8a1571ce85c75e251846f1afc0a9ec373', '2025-07-30 19:22:13.214', '2025-07-30 19:22:13.214');


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.applications VALUES ('cmdm9cqcp0007mt0f1j063veh', 'APP-1753655746920', 'cmdm9cqc10005mt0f7lxhc4g5', 'clearaccess_clearaccess_8_8mbps', '{"city": "Groot Brak Rivier", "street": "325 DAHLIA, FRIEMERSHEIM", "province": "Western Cape", "postalCode": "6526", "fullAddress": "325 DAHLIA, FRIEMERSHEIM, Groot Brak Rivier, Western Cape 6526"}', '0834409624', NULL, NULL, NULL, NULL, 'APPROVED', '2025-07-27 22:35:46.922', '2025-07-28 17:12:56.944', 'rSINEHGkXCRAsWpKbW554y0ZuhhBpOR0', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.applications VALUES ('cmdm95r5b0003mt0f5mv8gimp', 'APP-1753655421358', 'cmdm95r4z0001mt0f20dxwdr9', 'clearaccess_clearaccess_100_100mbps', '{"city": "George Industria, George, WC", "street": "11 Brick road", "province": "Western Cape", "postalCode": "6530", "fullAddress": "11 Brick road, George Industria, George, WC, Western Cape 6530"}', '0815082450', NULL, NULL, NULL, NULL, 'APPROVED', '2025-07-27 22:30:21.359', '2025-07-28 17:13:23.484', 'rSINEHGkXCRAsWpKbW554y0ZuhhBpOR0', NULL, NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: bills; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: data_consents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: data_processing_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: data_retention_policies; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: email_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: package_urls; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: price_history; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: rica_communication_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: security_audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.sessions VALUES ('9i4HMi820I3lp2edZpU7bL3QIf2QfkzV', 'rSINEHGkXCRAsWpKbW554y0ZuhhBpOR0', '9uBY6189VhxTeJER3tyPbUYxKRWCBAxF', '2025-08-03 22:12:32.998', '', '', '2025-07-27 22:12:32.998', '2025-07-27 22:12:32.998');
INSERT INTO public.sessions VALUES ('daWo7erNckXiE3ddaUSkK36Yf5sUSjit', 'rSINEHGkXCRAsWpKbW554y0ZuhhBpOR0', 'TZaasrKuJYxUIwC9lNKlBeQSSYv8nF3U', '2025-08-03 22:35:12.79', '102.132.221.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36', '2025-07-27 22:35:12.79', '2025-07-27 22:35:12.79');
INSERT INTO public.sessions VALUES ('jNWvPUmiAYmlsq8GUvoKBrRWOH1zIDum', 'aZ800ema4rtUqOoEureY8HISuL4Qavda', '0DFGeJ1h0wrGxAAjsbUEkP0t5duR1HD5', '2025-08-06 19:22:13.221', '102.132.243.111', 'node', '2025-07-30 19:22:13.221', '2025-07-30 19:22:13.221');
INSERT INTO public.sessions VALUES ('WkMW6AT9Dr8mDYjyENsWl3gw2UWbqVuf', 'aZ800ema4rtUqOoEureY8HISuL4Qavda', 'XxOGCRdj131Yk04mCGq41vAymH3jS02I', '2025-08-06 19:22:29.928', '102.132.243.111', 'node', '2025-07-30 19:22:29.928', '2025-07-30 19:22:29.928');


--
-- Data for Name: special_rates; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: verifications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: whatsapp_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- PostgreSQL database dump complete
--


SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '6b537b31-b380-4e8a-a588-5de1f5c26e86', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"iankatana51@gmail.com","user_id":"3c0e79b0-28b9-41ea-8586-b71566451233","user_phone":""}}', '2025-08-03 08:40:42.241944+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e607914c-6dd0-4610-8251-fafdb5f845c1', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-03 08:41:12.497831+00', ''),
	('00000000-0000-0000-0000-000000000000', '4dd6975c-0be2-4c14-a82b-28eb47f37075', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-03 10:47:28.700669+00', ''),
	('00000000-0000-0000-0000-000000000000', '4d4e7cff-5a57-4dec-87bd-ecfdafcc1ef9', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-03 11:03:42.65827+00', ''),
	('00000000-0000-0000-0000-000000000000', '43058455-e2aa-4677-8365-b2cb358dea69', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-03 11:05:20.619072+00', ''),
	('00000000-0000-0000-0000-000000000000', '8c6824c9-d1ab-4b22-b7df-a629bc07715a', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-03 11:09:16.854813+00', ''),
	('00000000-0000-0000-0000-000000000000', '26559878-1146-42ea-a559-2174a57d27bd', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-03 11:25:39.553512+00', ''),
	('00000000-0000-0000-0000-000000000000', '5ac40c20-9ede-4049-b5a0-844a95ee3f9a', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-03 11:28:21.530506+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ae338e2d-ed45-49c7-a7ae-ab356d52ada9', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-03 11:58:37.324299+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd53bb1ca-eac2-4066-80da-0be01c65f3e1', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-03 12:16:03.080143+00', ''),
	('00000000-0000-0000-0000-000000000000', '3c295202-e0c9-4ed4-b911-a6d471e24e8b', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-03 12:23:56.067789+00', ''),
	('00000000-0000-0000-0000-000000000000', '057a0f2b-e15f-4432-b6a7-919c22e2cfd8', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-03 13:19:55.944532+00', ''),
	('00000000-0000-0000-0000-000000000000', '7f12eeb8-5d63-4c35-8292-3b8c7eca43e2', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-04 04:44:29.354685+00', ''),
	('00000000-0000-0000-0000-000000000000', '68d24ac3-569e-4a56-b1c9-3442358dc44f', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-04 04:44:29.355535+00', ''),
	('00000000-0000-0000-0000-000000000000', '942ed239-cdeb-4fa8-8ef9-ab8b47a3ee6f', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-04 04:51:45.774215+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eaee6469-c611-4ed0-87d5-b701e82292a7', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-04 04:58:26.690728+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a4a81583-5237-4cea-b3ea-c6b257756077', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-04 05:07:34.895226+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd206a93f-99de-4fe4-8630-7661bc1e4a99', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-04 05:09:42.965445+00', ''),
	('00000000-0000-0000-0000-000000000000', '5f442be7-fbbf-49ac-afd3-39bd5bba92bb', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-04 05:13:07.623902+00', ''),
	('00000000-0000-0000-0000-000000000000', '7d852c20-a796-4065-93e8-117d7a46c8cf', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-04 05:13:23.287874+00', ''),
	('00000000-0000-0000-0000-000000000000', '5b4e8ed7-1cca-48e9-9297-49903dbe435a', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-04 05:15:33.330347+00', ''),
	('00000000-0000-0000-0000-000000000000', '2ea78893-e5b6-49fe-b92a-d97bfd557be7', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-04 05:22:59.00086+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a9910e92-b539-42a7-bb38-98691055dd57', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-04 05:33:40.670472+00', ''),
	('00000000-0000-0000-0000-000000000000', '787ddce7-0ba2-43f9-9e2e-26fa3db1ca93', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-04 05:51:23.202301+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e55fd909-666b-4ab2-85f4-cbf8e58109df', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-04 06:10:31.677536+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dfe141f3-a96a-4e8f-b9a3-22b4e658683f', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-04 06:17:30.274538+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd6c008f9-51dd-4e22-bb12-2a59b4ad3606', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-04 06:37:40.722911+00', ''),
	('00000000-0000-0000-0000-000000000000', '5d89172f-886f-4fd8-bc5b-35af4ed60ee1', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-04 09:03:21.132758+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c40b5bc1-f4c4-4dce-ab82-98bb8ae3399c', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-04 09:03:21.13366+00', ''),
	('00000000-0000-0000-0000-000000000000', '29772432-578c-4e6a-bcfb-ae3da5528259', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-04 09:57:49.919157+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ad62f160-e8ef-4798-9ecc-bacbc2ddcb65', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-04 10:10:54.547691+00', ''),
	('00000000-0000-0000-0000-000000000000', '1b28f38e-2604-4ad6-9ae9-fd014720dce2', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-04 11:09:13.894172+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ff94ec22-a69c-4a19-90f7-34aaedec0331', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-04 12:11:59.674519+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c42c8178-41d3-4165-84ac-7dd1fc75024d', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-04 12:11:59.675417+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e4798ac8-c26e-45fa-818f-2478aab87bd8', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-04 12:59:33.981031+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd7fd5053-d205-441a-9200-ff0dc9c395e5', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-04 13:08:17.149185+00', ''),
	('00000000-0000-0000-0000-000000000000', '6651f335-485b-4bc2-a0cc-f6427f1cdc12', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-04 13:27:08.058895+00', ''),
	('00000000-0000-0000-0000-000000000000', '675e190a-d0fa-4b55-9210-197b8bc65e3a', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-04 13:54:07.396812+00', ''),
	('00000000-0000-0000-0000-000000000000', '1b9a7493-822e-44a8-9252-9174a7c352b2', '{"action":"login","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-04 14:05:27.542574+00', ''),
	('00000000-0000-0000-0000-000000000000', '2933364a-5524-4490-ab82-c4e78e7b7078', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-05 03:32:04.949506+00', ''),
	('00000000-0000-0000-0000-000000000000', '060c6697-ecf7-4b92-b90f-678123f2d362', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-05 03:32:04.954703+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd668f5bf-a3e4-4b55-af72-20936c4654ab', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-05 06:29:59.233558+00', ''),
	('00000000-0000-0000-0000-000000000000', '6b656565-3ded-4f0c-a51d-81f358bdb26a', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-05 06:29:59.235204+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd6e007c3-307f-4e5b-9376-102a250cecef', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-05 06:30:00.615151+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd3da2c6d-1028-415e-94f1-ab883d9f12c7', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-05 07:49:28.040616+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a0a3a924-6dbc-4795-af7d-8e082f86aefe', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-05 07:49:28.042451+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c31c87d2-8b87-4596-b2b6-dafcbcb0c96a', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-05 08:48:06.414616+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a4dc135b-51c2-4f73-bd2c-bb01eb6044aa', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-05 08:48:06.41639+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd579c4dc-7eef-448a-a79a-9ae1f4c2d8e2', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-05 10:20:34.903076+00', ''),
	('00000000-0000-0000-0000-000000000000', '0265c44d-e982-426d-8e14-3b10917df20b', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-05 10:20:34.90484+00', ''),
	('00000000-0000-0000-0000-000000000000', 'de9fa067-7c3c-4685-8f00-ad5a86a9196d', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-05 11:22:31.584551+00', ''),
	('00000000-0000-0000-0000-000000000000', '0c25ea6d-7cfe-47c3-ba21-ceb0b9d82c55', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-05 11:22:31.585489+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b6845022-6b71-442f-9a83-704398bedc43', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-05 13:51:23.593922+00', ''),
	('00000000-0000-0000-0000-000000000000', '53c0c6d4-3641-47ef-9dd8-59c6ccf1af2a', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-05 13:51:23.595742+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c2cb485d-20ec-4194-91c5-f2eaff1e711e', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-05 14:58:22.518927+00', ''),
	('00000000-0000-0000-0000-000000000000', '692bca6b-2142-4f1c-93a2-0b04b9bd85f2', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-05 14:58:22.51978+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e54da796-72c5-4989-af6c-c92f7d427c06', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-05 15:57:22.336044+00', ''),
	('00000000-0000-0000-0000-000000000000', '387f6e4a-71de-4154-b025-cc433869fe84', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-05 15:57:22.337583+00', ''),
	('00000000-0000-0000-0000-000000000000', '11ebf90a-48a4-4509-aa4a-a94d83a44046', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-05 16:57:55.146867+00', ''),
	('00000000-0000-0000-0000-000000000000', '27df7653-23fa-415d-8a24-6786c700c850', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-05 16:57:55.147812+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f673684e-8f56-4672-bb81-d41bc381e81a', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-06 06:23:45.432904+00', ''),
	('00000000-0000-0000-0000-000000000000', '7800fef5-22ea-426b-b34f-70cec7754e07', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-06 06:23:45.43721+00', ''),
	('00000000-0000-0000-0000-000000000000', '9d3d4a5e-1cfe-408f-b795-e9a08908ae84', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-06 08:46:32.624756+00', ''),
	('00000000-0000-0000-0000-000000000000', '8923f0eb-82b1-4d52-9973-ae002ca0a679', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-06 08:46:32.627606+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd2d5b756-5b85-4aa9-84d4-028ca6456582', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-08 19:16:04.318523+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e202c882-90d7-4972-9199-05d0d786dab3', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-08 19:16:04.323607+00', ''),
	('00000000-0000-0000-0000-000000000000', 'abbdbaee-18a5-479a-87a6-66b57f9b3fcc', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-08 20:22:31.089195+00', ''),
	('00000000-0000-0000-0000-000000000000', '1400d09d-1fec-417d-9732-1bdeff9e43f1', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-08 20:22:31.091938+00', ''),
	('00000000-0000-0000-0000-000000000000', '35ecd8ae-bd49-4b1f-b302-10b4d07309b0', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-09 04:59:46.052736+00', ''),
	('00000000-0000-0000-0000-000000000000', '0cc758e3-ee8b-4ec1-8fc2-9a323de406e3', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-09 04:59:46.053675+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b1a51da0-eb0e-4d53-b527-a4ca8bdac8be', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-09 06:14:42.595847+00', ''),
	('00000000-0000-0000-0000-000000000000', '176e15ec-0c4e-4c1e-8ec7-f1cd5c2860c7', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-09 06:14:42.596815+00', ''),
	('00000000-0000-0000-0000-000000000000', '93a8655f-5e50-45e5-994e-c5ef8f96f1c3', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-09 07:13:34.584778+00', ''),
	('00000000-0000-0000-0000-000000000000', '6e60d89f-46a0-4ec1-bcca-c1963dfd4b22', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-09 07:13:34.586966+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cf8f2bbd-840e-4707-b07c-806e573e32c1', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-09 08:40:37.422398+00', ''),
	('00000000-0000-0000-0000-000000000000', '64c75f72-4fbe-4033-911c-b1a76dd19caa', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-09 08:40:37.424751+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c7a3ab20-5b05-4daf-940e-4f5bed3aaa1b', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-09 10:08:51.962654+00', ''),
	('00000000-0000-0000-0000-000000000000', '6054f2e0-4df7-41c4-88bf-c47416188663', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-09 10:08:51.96512+00', ''),
	('00000000-0000-0000-0000-000000000000', '629e1ffc-f6b7-47e4-95de-66703dbeaa24', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-09 11:07:23.384585+00', ''),
	('00000000-0000-0000-0000-000000000000', '4740acca-c9a6-4d8b-b2e1-e242ca57a3c7', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-09 11:07:23.386742+00', ''),
	('00000000-0000-0000-0000-000000000000', '8a53a409-a43d-4704-abba-02cc951430c8', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-09 12:13:08.629931+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b1a0b1d7-7b3a-4341-a635-4ae9bb79b90a', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-09 12:13:08.631447+00', ''),
	('00000000-0000-0000-0000-000000000000', '42752007-5f5e-47b6-8821-6c9de3cadd7b', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-10 05:25:31.146397+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c59b89e1-a23a-4df0-b28e-ad5eb8501183', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-10 05:25:31.151694+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b874cba4-7802-4570-b0e9-e798e922151a', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"admin@iska-rms.com","user_id":"423b2f89-ed35-4537-866e-d4fe702e577c","user_phone":""}}', '2025-08-10 06:01:28.86618+00', ''),
	('00000000-0000-0000-0000-000000000000', '4fb1585c-346e-42e7-87f9-1ee0fb695513', '{"action":"token_refreshed","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-10 06:25:06.969094+00', ''),
	('00000000-0000-0000-0000-000000000000', '870a9927-c016-421c-b1a9-8a934e3d9b69', '{"action":"token_revoked","actor_id":"3c0e79b0-28b9-41ea-8586-b71566451233","actor_username":"iankatana51@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-10 06:25:06.970898+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '423b2f89-ed35-4537-866e-d4fe702e577c', 'authenticated', 'authenticated', 'admin@iska-rms.com', '$2a$10$aZHg5Whou1sdqNewUiKJAuRhuS6v/Z.SfZreCsOCMC21lcLef5exO', '2025-08-10 06:01:28.869108+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-08-10 06:01:28.855761+00', '2025-08-10 06:01:28.870055+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '3c0e79b0-28b9-41ea-8586-b71566451233', 'authenticated', 'authenticated', 'iankatana51@gmail.com', '$2a$10$s6645sgVV8W7qG.ZKZ98xOhNgpbwbpBapfLvG7MraO2Tcw476rKtC', '2025-08-03 08:40:42.246789+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-08-04 14:05:27.543619+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-08-03 08:40:42.232639+00', '2025-08-10 06:25:06.974106+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('3c0e79b0-28b9-41ea-8586-b71566451233', '3c0e79b0-28b9-41ea-8586-b71566451233', '{"sub": "3c0e79b0-28b9-41ea-8586-b71566451233", "email": "iankatana51@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2025-08-03 08:40:42.240191+00', '2025-08-03 08:40:42.240302+00', '2025-08-03 08:40:42.240302+00', '202ebfe2-4331-4bc5-ab4d-047825256539'),
	('423b2f89-ed35-4537-866e-d4fe702e577c', '423b2f89-ed35-4537-866e-d4fe702e577c', '{"sub": "423b2f89-ed35-4537-866e-d4fe702e577c", "email": "admin@iska-rms.com", "email_verified": false, "phone_verified": false}', 'email', '2025-08-10 06:01:28.864426+00', '2025-08-10 06:01:28.864486+00', '2025-08-10 06:01:28.864486+00', '375d9870-3988-4e89-bd64-ea761653b722');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('195a18e9-702a-4e23-a33f-bc1ec9fe4317', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-03 10:47:28.70243+00', '2025-08-03 10:47:28.70243+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '83.110.112.110', NULL),
	('e450a083-773e-442c-bd73-9652c3bce6f0', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-03 11:03:42.660919+00', '2025-08-03 11:03:42.660919+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '83.110.112.110', NULL),
	('19a106e7-28a1-4841-b72a-a4602c82e640', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-03 11:05:20.620142+00', '2025-08-03 11:05:20.620142+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '83.110.112.110', NULL),
	('c5d392c0-75f7-4d05-9413-3c34f5a9302f', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-03 11:09:16.855892+00', '2025-08-03 11:09:16.855892+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '83.110.112.110', NULL),
	('07d9855a-ff2d-4295-b6b2-16635a1fa7b0', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-03 11:25:39.555328+00', '2025-08-03 11:25:39.555328+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '83.110.112.110', NULL),
	('b1fd20e8-5fa3-4cf3-9825-3df106a58fb1', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-03 11:28:21.5316+00', '2025-08-03 11:28:21.5316+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1', '83.110.112.110', NULL),
	('d6d9596a-fe28-48f1-b938-a7c0a9d023c3', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-03 11:58:37.325358+00', '2025-08-03 11:58:37.325358+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '83.110.112.110', NULL),
	('a1725347-36e0-4141-9285-995930157e06', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-03 12:16:03.081286+00', '2025-08-03 12:16:03.081286+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '83.110.112.110', NULL),
	('a5a4fc9f-d6e7-489c-8f0c-4df962c674bd', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-03 12:23:56.068914+00', '2025-08-03 12:23:56.068914+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '83.110.112.110', NULL),
	('3f5ce099-984b-4df7-998e-d8fcee15791f', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-03 13:19:55.945695+00', '2025-08-04 04:44:29.35975+00', NULL, 'aal1', NULL, '2025-08-04 04:44:29.359671', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '217.165.113.113', NULL),
	('73de5c65-6d9c-402b-b666-70b9249f7b1c', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 04:51:45.775977+00', '2025-08-04 04:51:45.775977+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '217.165.113.113', NULL),
	('1f94b519-047a-4054-b684-0e359625698e', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 04:58:26.691825+00', '2025-08-04 04:58:26.691825+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '217.165.113.113', NULL),
	('80b03a15-ff4b-48ec-81fc-22a8225e12a4', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 05:07:34.896994+00', '2025-08-04 05:07:34.896994+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '217.165.113.113', NULL),
	('607233f4-f673-439d-a156-ae47723965ab', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 05:09:42.966525+00', '2025-08-04 05:09:42.966525+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '217.165.113.113', NULL),
	('1024e8d0-fdef-438c-a7e0-44895202ad69', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 05:13:07.625065+00', '2025-08-04 05:13:07.625065+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1', '217.165.113.113', NULL),
	('adc0ba50-7ee7-4d4f-8ad9-d64e54087582', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 05:13:23.288727+00', '2025-08-04 05:13:23.288727+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1', '217.165.113.113', NULL),
	('4787526f-6213-43c7-a0f6-448c36cd8565', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 05:15:33.33145+00', '2025-08-04 05:15:33.33145+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '217.165.113.113', NULL),
	('a88650b7-f46b-4bb1-8cab-cfcbed00fb28', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 05:22:59.002577+00', '2025-08-04 05:22:59.002577+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '217.165.113.113', NULL),
	('a919162f-df97-46c0-9e65-c04a7524f5e1', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 05:33:40.67243+00', '2025-08-04 05:33:40.67243+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '217.165.113.113', NULL),
	('5bbd6af5-bfca-4ce3-ac71-9c2903654875', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 05:51:23.203417+00', '2025-08-04 05:51:23.203417+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '217.165.113.113', NULL),
	('d6d8f279-fc0e-40b1-b817-b3084246e967', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 06:10:31.67862+00', '2025-08-04 06:10:31.67862+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '217.165.113.113', NULL),
	('72d906c3-9280-4f47-86ce-1f715364670e', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 06:17:30.275719+00', '2025-08-04 06:17:30.275719+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '217.165.113.113', NULL),
	('9898c09f-b686-4971-a456-6317e0a70e25', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 06:37:40.72409+00', '2025-08-04 09:03:21.13745+00', NULL, 'aal1', NULL, '2025-08-04 09:03:21.137374', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15', '217.165.113.113', NULL),
	('bb8f1bd5-651a-4229-9a76-c67394629431', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 09:57:49.920353+00', '2025-08-04 09:57:49.920353+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '217.165.113.113', NULL),
	('e27e304d-9566-482b-8568-29e4e0e9c78b', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 10:10:54.548955+00', '2025-08-04 10:10:54.548955+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '217.165.113.113', NULL),
	('61a3d7ab-7ca1-408a-8d1d-4814c37115fc', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 11:09:13.895278+00', '2025-08-04 12:11:59.679129+00', NULL, 'aal1', NULL, '2025-08-04 12:11:59.679059', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '217.165.113.113', NULL),
	('82fe0d44-a72f-48e6-9e76-e2f335a949de', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 12:59:33.982096+00', '2025-08-04 12:59:33.982096+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '217.165.113.113', NULL),
	('5a42639d-96a6-4535-9cbf-1f94e514a394', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 13:08:17.15096+00', '2025-08-04 13:08:17.15096+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '217.165.113.113', NULL),
	('ddcf84b5-4670-4222-bc91-8a35b57ba2bd', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 13:27:08.060756+00', '2025-08-04 13:27:08.060756+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '217.165.113.113', NULL),
	('d76b5fac-cf35-4940-a04b-350c3fc681eb', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 13:54:07.397857+00', '2025-08-04 13:54:07.397857+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '217.165.113.113', NULL),
	('b691a14e-f1dc-46ba-904a-7e48f38db463', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 14:05:27.543717+00', '2025-08-04 14:05:27.543717+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '217.165.113.113', NULL),
	('0e09638c-c4e7-4528-b1f4-7d16fe61ae26', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-03 08:41:12.498738+00', '2025-08-10 06:25:06.975534+00', NULL, 'aal1', NULL, '2025-08-10 06:25:06.975463', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '83.110.112.110', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('0e09638c-c4e7-4528-b1f4-7d16fe61ae26', '2025-08-03 08:41:12.506358+00', '2025-08-03 08:41:12.506358+00', 'password', '69424653-bac7-43d5-8ba6-0b1a4cc252f0'),
	('195a18e9-702a-4e23-a33f-bc1ec9fe4317', '2025-08-03 10:47:28.705479+00', '2025-08-03 10:47:28.705479+00', 'password', '1c6ddae9-c58a-4b54-b2aa-e16d6afc7b32'),
	('e450a083-773e-442c-bd73-9652c3bce6f0', '2025-08-03 11:03:42.664128+00', '2025-08-03 11:03:42.664128+00', 'password', '14df60ef-d76d-49ac-8229-665a26425078'),
	('19a106e7-28a1-4841-b72a-a4602c82e640', '2025-08-03 11:05:20.623367+00', '2025-08-03 11:05:20.623367+00', 'password', 'da956767-7e8b-4876-895d-6bd69cb2591e'),
	('c5d392c0-75f7-4d05-9413-3c34f5a9302f', '2025-08-03 11:09:16.859102+00', '2025-08-03 11:09:16.859102+00', 'password', 'b8463cef-9f1c-4ac7-87c5-b4a7e3136ce9'),
	('07d9855a-ff2d-4295-b6b2-16635a1fa7b0', '2025-08-03 11:25:39.558918+00', '2025-08-03 11:25:39.558918+00', 'password', '90b0873c-d3aa-41ae-a9c5-dcc079ddf96c'),
	('b1fd20e8-5fa3-4cf3-9825-3df106a58fb1', '2025-08-03 11:28:21.534768+00', '2025-08-03 11:28:21.534768+00', 'password', '95267862-b7a6-4377-91d3-4389a73ca365'),
	('d6d9596a-fe28-48f1-b938-a7c0a9d023c3', '2025-08-03 11:58:37.328445+00', '2025-08-03 11:58:37.328445+00', 'password', '66483e4d-c873-456d-9a28-ae6793038841'),
	('a1725347-36e0-4141-9285-995930157e06', '2025-08-03 12:16:03.084524+00', '2025-08-03 12:16:03.084524+00', 'password', 'a1bc499d-b93d-4e5d-adb8-3186244fcad0'),
	('a5a4fc9f-d6e7-489c-8f0c-4df962c674bd', '2025-08-03 12:23:56.072209+00', '2025-08-03 12:23:56.072209+00', 'password', 'b2a7d6ee-21e2-43af-8661-2e30b9805d4c'),
	('3f5ce099-984b-4df7-998e-d8fcee15791f', '2025-08-03 13:19:55.948837+00', '2025-08-03 13:19:55.948837+00', 'password', '37a06efa-3ae7-45e6-9f2f-a30723bfe688'),
	('73de5c65-6d9c-402b-b666-70b9249f7b1c', '2025-08-04 04:51:45.779826+00', '2025-08-04 04:51:45.779826+00', 'password', '997a975f-5e58-4ac9-bdc0-769051a4f470'),
	('1f94b519-047a-4054-b684-0e359625698e', '2025-08-04 04:58:26.695047+00', '2025-08-04 04:58:26.695047+00', 'password', 'ddb6d826-7d4d-4681-a49c-3687f2aa47b5'),
	('80b03a15-ff4b-48ec-81fc-22a8225e12a4', '2025-08-04 05:07:34.901039+00', '2025-08-04 05:07:34.901039+00', 'password', '64c02609-ee86-4423-8776-92585eb1e68f'),
	('607233f4-f673-439d-a156-ae47723965ab', '2025-08-04 05:09:42.969693+00', '2025-08-04 05:09:42.969693+00', 'password', '956cb6a7-69da-4910-ad70-584b959b84c7'),
	('1024e8d0-fdef-438c-a7e0-44895202ad69', '2025-08-04 05:13:07.628249+00', '2025-08-04 05:13:07.628249+00', 'password', '4d8351e7-b492-4199-8ac1-1a71bd761fbb'),
	('adc0ba50-7ee7-4d4f-8ad9-d64e54087582', '2025-08-04 05:13:23.29093+00', '2025-08-04 05:13:23.29093+00', 'password', 'a377491e-084c-4e1c-9418-c53f0c142e2f'),
	('4787526f-6213-43c7-a0f6-448c36cd8565', '2025-08-04 05:15:33.334606+00', '2025-08-04 05:15:33.334606+00', 'password', 'dd173b91-c330-4ccf-b462-a318731a1f26'),
	('a88650b7-f46b-4bb1-8cab-cfcbed00fb28', '2025-08-04 05:22:59.00698+00', '2025-08-04 05:22:59.00698+00', 'password', '8ebb2573-5617-4268-be15-5b6e13d8ce43'),
	('a919162f-df97-46c0-9e65-c04a7524f5e1', '2025-08-04 05:33:40.675704+00', '2025-08-04 05:33:40.675704+00', 'password', '4a992a4d-3f61-475a-b3bb-2e8c7f9ab08d'),
	('5bbd6af5-bfca-4ce3-ac71-9c2903654875', '2025-08-04 05:51:23.20656+00', '2025-08-04 05:51:23.20656+00', 'password', '1ede4a5c-ed53-45f7-8a8f-db7fb634ad78'),
	('d6d8f279-fc0e-40b1-b817-b3084246e967', '2025-08-04 06:10:31.681878+00', '2025-08-04 06:10:31.681878+00', 'password', 'b5f63b29-a7c3-4830-b626-5bf8ebb90448'),
	('72d906c3-9280-4f47-86ce-1f715364670e', '2025-08-04 06:17:30.279293+00', '2025-08-04 06:17:30.279293+00', 'password', '4792f98e-83fe-41d2-bf09-35bf7d458c8b'),
	('9898c09f-b686-4971-a456-6317e0a70e25', '2025-08-04 06:37:40.727303+00', '2025-08-04 06:37:40.727303+00', 'password', 'fee50dec-26d4-4b90-8837-5de73a60fe81'),
	('bb8f1bd5-651a-4229-9a76-c67394629431', '2025-08-04 09:57:49.923604+00', '2025-08-04 09:57:49.923604+00', 'password', 'b60697e2-b497-46de-aca0-d4c6921c6fc8'),
	('e27e304d-9566-482b-8568-29e4e0e9c78b', '2025-08-04 10:10:54.552111+00', '2025-08-04 10:10:54.552111+00', 'password', '1778cdfc-5ef2-44c1-849d-3fe7b866c6c8'),
	('61a3d7ab-7ca1-408a-8d1d-4814c37115fc', '2025-08-04 11:09:13.898367+00', '2025-08-04 11:09:13.898367+00', 'password', 'd5ba85f9-0603-4138-8a40-a9d4e19715e5'),
	('82fe0d44-a72f-48e6-9e76-e2f335a949de', '2025-08-04 12:59:33.985406+00', '2025-08-04 12:59:33.985406+00', 'password', 'cbc00c3e-a2f1-451e-830c-bc32b63a460c'),
	('5a42639d-96a6-4535-9cbf-1f94e514a394', '2025-08-04 13:08:17.154222+00', '2025-08-04 13:08:17.154222+00', 'password', '515d6615-dd37-4947-8b50-5b1cb481012f'),
	('ddcf84b5-4670-4222-bc91-8a35b57ba2bd', '2025-08-04 13:27:08.064302+00', '2025-08-04 13:27:08.064302+00', 'password', 'f54b1459-4806-481e-8463-d6efe6244483'),
	('d76b5fac-cf35-4940-a04b-350c3fc681eb', '2025-08-04 13:54:07.400917+00', '2025-08-04 13:54:07.400917+00', 'password', 'e64c6e18-1529-42b1-92d9-b802a5a86642'),
	('b691a14e-f1dc-46ba-904a-7e48f38db463', '2025-08-04 14:05:27.547173+00', '2025-08-04 14:05:27.547173+00', 'password', 'e2555fdf-26f1-446b-8824-f0b427090029');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 2, 'qnj4nvlc25iw', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-03 10:47:28.703517+00', '2025-08-03 10:47:28.703517+00', NULL, '195a18e9-702a-4e23-a33f-bc1ec9fe4317'),
	('00000000-0000-0000-0000-000000000000', 3, 'imkneyuqh4og', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-03 11:03:42.66211+00', '2025-08-03 11:03:42.66211+00', NULL, 'e450a083-773e-442c-bd73-9652c3bce6f0'),
	('00000000-0000-0000-0000-000000000000', 4, 'wtavyxvs2y2w', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-03 11:05:20.621305+00', '2025-08-03 11:05:20.621305+00', NULL, '19a106e7-28a1-4841-b72a-a4602c82e640'),
	('00000000-0000-0000-0000-000000000000', 5, 'ihv6optm2six', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-03 11:09:16.857054+00', '2025-08-03 11:09:16.857054+00', NULL, 'c5d392c0-75f7-4d05-9413-3c34f5a9302f'),
	('00000000-0000-0000-0000-000000000000', 6, 'lhlo6cdo2v3z', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-03 11:25:39.556597+00', '2025-08-03 11:25:39.556597+00', NULL, '07d9855a-ff2d-4295-b6b2-16635a1fa7b0'),
	('00000000-0000-0000-0000-000000000000', 7, 'eakgiiokbavv', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-03 11:28:21.53279+00', '2025-08-03 11:28:21.53279+00', NULL, 'b1fd20e8-5fa3-4cf3-9825-3df106a58fb1'),
	('00000000-0000-0000-0000-000000000000', 8, 'cf24ru57ljq5', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-03 11:58:37.326492+00', '2025-08-03 11:58:37.326492+00', NULL, 'd6d9596a-fe28-48f1-b938-a7c0a9d023c3'),
	('00000000-0000-0000-0000-000000000000', 9, 'w6zw3l4lsuwi', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-03 12:16:03.082447+00', '2025-08-03 12:16:03.082447+00', NULL, 'a1725347-36e0-4141-9285-995930157e06'),
	('00000000-0000-0000-0000-000000000000', 10, 'wurt4f74cs4z', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-03 12:23:56.070084+00', '2025-08-03 12:23:56.070084+00', NULL, 'a5a4fc9f-d6e7-489c-8f0c-4df962c674bd'),
	('00000000-0000-0000-0000-000000000000', 11, '34so2khnyhdy', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-03 13:19:55.94683+00', '2025-08-04 04:44:29.356027+00', NULL, '3f5ce099-984b-4df7-998e-d8fcee15791f'),
	('00000000-0000-0000-0000-000000000000', 12, 'kdmjoebupa3c', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-04 04:44:29.357365+00', '2025-08-04 04:44:29.357365+00', '34so2khnyhdy', '3f5ce099-984b-4df7-998e-d8fcee15791f'),
	('00000000-0000-0000-0000-000000000000', 13, '6rfcctc4dfys', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-04 04:51:45.777141+00', '2025-08-04 04:51:45.777141+00', NULL, '73de5c65-6d9c-402b-b666-70b9249f7b1c'),
	('00000000-0000-0000-0000-000000000000', 14, 'fer46vwuxqhc', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-04 04:58:26.693031+00', '2025-08-04 04:58:26.693031+00', NULL, '1f94b519-047a-4054-b684-0e359625698e'),
	('00000000-0000-0000-0000-000000000000', 15, '3ktrys6vehz7', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-04 05:07:34.898828+00', '2025-08-04 05:07:34.898828+00', NULL, '80b03a15-ff4b-48ec-81fc-22a8225e12a4'),
	('00000000-0000-0000-0000-000000000000', 16, 'jqua26e4d4pk', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-04 05:09:42.96766+00', '2025-08-04 05:09:42.96766+00', NULL, '607233f4-f673-439d-a156-ae47723965ab'),
	('00000000-0000-0000-0000-000000000000', 17, 'mpwznycbqphs', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-04 05:13:07.626231+00', '2025-08-04 05:13:07.626231+00', NULL, '1024e8d0-fdef-438c-a7e0-44895202ad69'),
	('00000000-0000-0000-0000-000000000000', 18, 'btpx62jq27j3', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-04 05:13:23.289626+00', '2025-08-04 05:13:23.289626+00', NULL, 'adc0ba50-7ee7-4d4f-8ad9-d64e54087582'),
	('00000000-0000-0000-0000-000000000000', 19, 'ubqqhvgm7gyy', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-04 05:15:33.332614+00', '2025-08-04 05:15:33.332614+00', NULL, '4787526f-6213-43c7-a0f6-448c36cd8565'),
	('00000000-0000-0000-0000-000000000000', 20, 'ez5ltgncluhg', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-04 05:22:59.004424+00', '2025-08-04 05:22:59.004424+00', NULL, 'a88650b7-f46b-4bb1-8cab-cfcbed00fb28'),
	('00000000-0000-0000-0000-000000000000', 21, 'kn7l7dxlzcou', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-04 05:33:40.673621+00', '2025-08-04 05:33:40.673621+00', NULL, 'a919162f-df97-46c0-9e65-c04a7524f5e1'),
	('00000000-0000-0000-0000-000000000000', 22, 'moqugjfat77h', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-04 05:51:23.204539+00', '2025-08-04 05:51:23.204539+00', NULL, '5bbd6af5-bfca-4ce3-ac71-9c2903654875'),
	('00000000-0000-0000-0000-000000000000', 23, 'vndo54y5eobm', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-04 06:10:31.679743+00', '2025-08-04 06:10:31.679743+00', NULL, 'd6d8f279-fc0e-40b1-b817-b3084246e967'),
	('00000000-0000-0000-0000-000000000000', 24, 'srf45wmeqfjx', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-04 06:17:30.27701+00', '2025-08-04 06:17:30.27701+00', NULL, '72d906c3-9280-4f47-86ce-1f715364670e'),
	('00000000-0000-0000-0000-000000000000', 25, 'a3bskpwxe7yh', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-04 06:37:40.725279+00', '2025-08-04 09:03:21.13427+00', NULL, '9898c09f-b686-4971-a456-6317e0a70e25'),
	('00000000-0000-0000-0000-000000000000', 26, 'jmokyeolxfz2', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-04 09:03:21.134929+00', '2025-08-04 09:03:21.134929+00', 'a3bskpwxe7yh', '9898c09f-b686-4971-a456-6317e0a70e25'),
	('00000000-0000-0000-0000-000000000000', 27, 'uisi6vrpw625', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-04 09:57:49.921516+00', '2025-08-04 09:57:49.921516+00', NULL, 'bb8f1bd5-651a-4229-9a76-c67394629431'),
	('00000000-0000-0000-0000-000000000000', 28, 'vkumtzvuri4n', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-04 10:10:54.550109+00', '2025-08-04 10:10:54.550109+00', NULL, 'e27e304d-9566-482b-8568-29e4e0e9c78b'),
	('00000000-0000-0000-0000-000000000000', 29, 'x7cg2pk2bcck', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-04 11:09:13.896452+00', '2025-08-04 12:11:59.675939+00', NULL, '61a3d7ab-7ca1-408a-8d1d-4814c37115fc'),
	('00000000-0000-0000-0000-000000000000', 30, '2opnsoqj6k5y', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-04 12:11:59.676643+00', '2025-08-04 12:11:59.676643+00', 'x7cg2pk2bcck', '61a3d7ab-7ca1-408a-8d1d-4814c37115fc'),
	('00000000-0000-0000-0000-000000000000', 31, 'ut3c3giiewuj', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-04 12:59:33.983234+00', '2025-08-04 12:59:33.983234+00', NULL, '82fe0d44-a72f-48e6-9e76-e2f335a949de'),
	('00000000-0000-0000-0000-000000000000', 32, '3qce5z3qqvmr', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-04 13:08:17.152107+00', '2025-08-04 13:08:17.152107+00', NULL, '5a42639d-96a6-4535-9cbf-1f94e514a394'),
	('00000000-0000-0000-0000-000000000000', 33, 'zdhiu6vbe7ms', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-04 13:27:08.062012+00', '2025-08-04 13:27:08.062012+00', NULL, 'ddcf84b5-4670-4222-bc91-8a35b57ba2bd'),
	('00000000-0000-0000-0000-000000000000', 34, 'zi3paipreu42', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-04 13:54:07.398981+00', '2025-08-04 13:54:07.398981+00', NULL, 'd76b5fac-cf35-4940-a04b-350c3fc681eb'),
	('00000000-0000-0000-0000-000000000000', 35, 'ylrnvv7nzu3s', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-04 14:05:27.54503+00', '2025-08-04 14:05:27.54503+00', NULL, 'b691a14e-f1dc-46ba-904a-7e48f38db463'),
	('00000000-0000-0000-0000-000000000000', 1, '5israjzkimy4', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-03 08:41:12.502405+00', '2025-08-05 03:32:04.955256+00', NULL, '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 36, '3xx7dvt66nh7', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-05 03:32:04.961364+00', '2025-08-05 06:29:59.235769+00', '5israjzkimy4', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 37, '753yioictxxq', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-05 06:29:59.236501+00', '2025-08-05 07:49:28.043031+00', '3xx7dvt66nh7', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 38, 'jkhhk6wjta4k', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-05 07:49:28.043814+00', '2025-08-05 08:48:06.417009+00', '753yioictxxq', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 39, 'co4b7ydexnw6', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-05 08:48:06.417875+00', '2025-08-05 10:20:34.906696+00', 'jkhhk6wjta4k', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 40, 'wk5qjhtwsdts', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-05 10:20:34.908172+00', '2025-08-05 11:22:31.586064+00', 'co4b7ydexnw6', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 41, 'o36elfopz2yj', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-05 11:22:31.586851+00', '2025-08-05 13:51:23.596291+00', 'wk5qjhtwsdts', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 42, 'uz6kfpkougxp', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-05 13:51:23.597745+00', '2025-08-05 14:58:22.520299+00', 'o36elfopz2yj', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 43, 'fkaetdtqtcun', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-05 14:58:22.521682+00', '2025-08-05 15:57:22.338228+00', 'uz6kfpkougxp', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 44, 'w3w72tbuvdf7', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-05 15:57:22.3403+00', '2025-08-05 16:57:55.148365+00', 'fkaetdtqtcun', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 45, 'f4ekcc6jyygb', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-05 16:57:55.149061+00', '2025-08-06 06:23:45.437818+00', 'w3w72tbuvdf7', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 46, 'qrf7bozpitmr', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-06 06:23:45.441923+00', '2025-08-06 08:46:32.628197+00', 'f4ekcc6jyygb', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 47, 'bjadio3phxdh', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-06 08:46:32.629674+00', '2025-08-08 19:16:04.324315+00', 'qrf7bozpitmr', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 48, 'ug7xvpfkwq6y', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-08 19:16:04.32841+00', '2025-08-08 20:22:31.092503+00', 'bjadio3phxdh', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 49, '47nj436lssit', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-08 20:22:31.094575+00', '2025-08-09 04:59:46.054311+00', 'ug7xvpfkwq6y', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 50, 'rgtodkx47rol', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-09 04:59:46.055942+00', '2025-08-09 06:14:42.598155+00', '47nj436lssit', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 51, 'skzfaw4ndef3', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-09 06:14:42.600813+00', '2025-08-09 07:13:34.587511+00', 'rgtodkx47rol', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 52, 'jwfmib6h6zoe', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-09 07:13:34.590613+00', '2025-08-09 08:40:37.425407+00', 'skzfaw4ndef3', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 53, 'l3zfehuyqiq4', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-09 08:40:37.426909+00', '2025-08-09 10:08:51.965758+00', 'jwfmib6h6zoe', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 54, 'rzzeu7lko34f', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-09 10:08:51.969247+00', '2025-08-09 11:07:23.387268+00', 'l3zfehuyqiq4', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 55, '3ygcxidokzk3', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-09 11:07:23.390634+00', '2025-08-09 12:13:08.631923+00', 'rzzeu7lko34f', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 56, 'gqgm2ux3lqlz', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-09 12:13:08.635148+00', '2025-08-10 05:25:31.152341+00', '3ygcxidokzk3', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 57, 'ykgaoyjxdkli', '3c0e79b0-28b9-41ea-8586-b71566451233', true, '2025-08-10 05:25:31.159444+00', '2025-08-10 06:25:06.971446+00', 'gqgm2ux3lqlz', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26'),
	('00000000-0000-0000-0000-000000000000', 58, 'n4vgdkzygawb', '3c0e79b0-28b9-41ea-8586-b71566451233', false, '2025-08-10 06:25:06.972972+00', '2025-08-10 06:25:06.972972+00', 'ykgaoyjxdkli', '0e09638c-c4e7-4528-b1f4-7d16fe61ae26');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "email", "password_hash", "first_name", "last_name", "role", "phone", "avatar_url", "is_active", "last_login", "created_at", "updated_at") VALUES
	('423b2f89-ed35-4537-866e-d4fe702e577c', 'admin@iska-rms.com', 'password123', 'Admin', 'User', 'super_admin', '+1234567890', NULL, true, NULL, '2025-08-10 06:02:54.483599+00', '2025-08-10 07:06:03.070343+00');


--
-- Data for Name: audit_log; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."audit_logs" ("id", "user_id", "action", "resource_type", "resource_id", "details", "ip_address", "user_agent", "created_at") VALUES
	('d9bf3cea-35bf-4231-9c7e-1aeb9a4e59db', '423b2f89-ed35-4537-866e-d4fe702e577c', 'logout', 'auth', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-08-12 09:37:10.277245+00'),
	('005ea408-d035-4ab3-b5ff-81adca98bcb5', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-08-13 12:23:58.539339+00'),
	('e4f1fa0b-6506-4a6e-8af5-91f101f6b696', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-15 09:06:44.198388+00'),
	('cfd85e03-d17f-42ce-989a-d309994de0cb', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-16 07:19:43.194588+00'),
	('f224f282-ad38-41db-96e8-331d3fcb9d81', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-16 10:23:22.304625+00'),
	('e69c0e97-6ef0-4b23-8977-d759e951d709', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-04 12:02:04.798101+00'),
	('12cadebb-1c66-4246-93a1-8095d0deae2e', '423b2f89-ed35-4537-866e-d4fe702e577c', 'logout', 'auth', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-04 12:06:46.904877+00'),
	('f56e46eb-cfe2-4141-8056-879371f22aaf', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-04 12:06:58.653517+00'),
	('11f9a439-ce7b-4960-8024-ebcd139ab23d', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-04 13:40:36.470449+00'),
	('737eceb0-937c-4b9e-9806-096312acfe9a', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-08 06:39:06.454374+00'),
	('a3aca123-bcab-4f6d-9e1f-1e7b0871c9b4', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-08 06:40:48.268542+00'),
	('65158cff-6ed7-4788-82c7-089b4838ca86', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-12 10:54:54.493871+00'),
	('16c541aa-5f9b-4a0c-96e4-c53f07f0fc1d', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-12 11:21:29.570298+00'),
	('8bcb1a61-03b0-4783-80ed-1a1b6ac7e40d', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-12 11:51:02.560509+00'),
	('a07eade8-2a63-4fba-a3c0-bed2e43c2fe2', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-12 12:30:30.701897+00'),
	('35566fb0-8b2a-4212-913d-cbc8f50fd88f', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-12 12:35:01.145845+00'),
	('bf068624-096e-4577-a5b6-f408add9855e', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-12 12:39:55.347707+00'),
	('b07723b1-292f-427d-90d9-2b263b12329b', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-12 15:22:42.047732+00'),
	('bff29d1d-053d-461b-955b-918c7277305c', NULL, 'login_failed', 'auth', NULL, '{"email": "iankatana51@gmail.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-04 11:20:05.28229+00'),
	('8e5bb24f-0465-41af-85f9-23e546d38963', NULL, 'login_success', 'auth', NULL, '{"email": "iankatana51@gmail.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-04 11:20:10.617054+00'),
	('102558be-e766-422e-a883-069f1a2f7560', NULL, 'login_success', 'auth', NULL, '{"email": "iankatana51@gmail.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-04 11:32:26.412481+00'),
	('b474e88c-696e-4a82-978a-1b36c295d545', NULL, 'login_success', 'auth', NULL, '{"email": "iankatana51@gmail.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-04 11:48:28.162364+00'),
	('f28ac289-fd4f-4231-8937-c220a21f85ab', NULL, 'login_success', 'auth', NULL, '{"email": "iankatana51@gmail.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-04 11:52:50.550176+00'),
	('6e363178-77ec-4877-9757-74b254d1d7ba', NULL, 'login_success', 'auth', NULL, '{"email": "iankatana51@gmail.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-04 12:00:02.430019+00'),
	('02d7321a-653c-4dc0-bb12-4ae172db4070', NULL, 'login_success', 'auth', NULL, '{"email": "iankatana51@gmail.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-04 12:00:23.628123+00'),
	('1fb3de92-bdfb-432e-8e97-b4fac8d2c37a', NULL, 'login_success', 'auth', NULL, '{"email": "iankatana51@gmail.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-08 06:38:47.905982+00'),
	('61b9b46f-f26d-456f-8c0a-2e5364357de8', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-13 10:35:27.494484+00'),
	('45d7d3eb-9aad-409a-9a83-13ea6a4cca2f', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-13 15:30:07.41142+00'),
	('339b6298-df23-4b0b-9ff6-5829b065a6e8', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-14 12:18:38.109774+00'),
	('ebb8515a-020e-4805-8140-15058a3f72a5', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-14 15:18:42.259665+00'),
	('038c5e8f-cbb7-43dd-baaf-f1d4585ca4bc', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-15 06:40:07.966792+00'),
	('a4dc0d1a-f6aa-4722-b75f-033bb790b319', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-15 07:07:02.428166+00'),
	('fbfb9299-dbcf-43c4-8cf4-e903dab35c8d', '423b2f89-ed35-4537-866e-d4fe702e577c', 'logout', 'auth', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-15 10:07:34.044127+00'),
	('f3685285-3773-4a3b-8019-66611736919c', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-15 10:54:22.909758+00'),
	('f299af45-7f76-40ef-8d4b-020febf8047d', '423b2f89-ed35-4537-866e-d4fe702e577c', 'login_success', 'auth', NULL, '{"email": "admin@iska-rms.com"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-15 12:33:11.062036+00');


--
-- Data for Name: branding; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."branding" ("id", "company_name", "company_address", "company_phone", "company_email", "company_website", "logo_url", "favicon_url", "primary_color", "secondary_color", "accent_color", "font_family", "created_at", "updated_at", "dashboard_title", "dashboard_subtitle", "latitude", "longitude") VALUES
	('7ef20767-35b3-4885-bcb4-19f5990b46d1', 'ISKA RMS', '123 Business Street, London, UK, SW1A 1AA', '+44 20 1234 5678', 'info@iska-rms.com', 'https://iska-rms.com', NULL, NULL, '#3B82F6', '#1F2937', '#10B981', 'Inter', '2025-08-05 11:24:38.697972+00', '2025-08-09 07:19:46.824311+00', 'Student Accommodation', 'Worldclass Student Accommodation', NULL, NULL);


--
-- Data for Name: cleaners; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: room_grades; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."room_grades" ("id", "name", "weekly_rate", "studio_count", "description", "is_active", "created_at", "photos", "amenities", "features") VALUES
	('29735358-9e74-4a7c-b618-ac73714ca108', 'Silver', 160.00, 12, 'Standard studio with essential amenities', true, '2025-08-02 20:59:28.423587+00', '[]', '[]', '[]'),
	('eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 'Platinum', 195.00, 8, 'Premium studio with luxury amenities', true, '2025-08-02 20:59:28.423587+00', '[]', '[]', '[]'),
	('1a8ade21-ecf1-4dff-b94e-4b0d0a5ca1aa', 'Rhodium', 200.00, 6, 'High-end studio with premium features', true, '2025-08-02 20:59:28.423587+00', '[]', '[]', '[]'),
	('439d2d82-3bdf-4dd8-a7ae-9a0c035aa7aa', 'Rhodium Plus', 225.00, 4, 'Ultra-luxury studio with all amenities', true, '2025-08-02 20:59:28.423587+00', '[]', '[]', '[]'),
	('024aed2e-46e8-4764-a699-617e07ad0f8f', 'Gold', 175.00, 18, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', true, '2025-08-02 20:59:28.423587+00', '["https://vwgczfdedacpymnxzxcp.supabase.co/storage/v1/object/public/iska-rms-files/general/1754738892254_nfabwdg42.webp", "https://vwgczfdedacpymnxzxcp.supabase.co/storage/v1/object/public/iska-rms-files/general/1754738894208_l31shha4j.webp", "https://vwgczfdedacpymnxzxcp.supabase.co/storage/v1/object/public/iska-rms-files/general/1754738895584_plebzi35f.jpg", "https://vwgczfdedacpymnxzxcp.supabase.co/storage/v1/object/public/iska-rms-files/general/1754738896376_6c21kh0cw.png", "https://vwgczfdedacpymnxzxcp.supabase.co/storage/v1/object/public/iska-rms-files/general/1754738898634_a9s8vzv3t.webp", "https://vwgczfdedacpymnxzxcp.supabase.co/storage/v1/object/public/iska-rms-files/general/1754738899339_834rmnyyb.webp"]', '["wifi", "parking", "jhsdjhjhsdf", "asdfdfasdf", "sdf", "sfsf", "sdfsdfsfsdfsd", "sdfsddserwerwe"]', '["wifi", "parking", "jhsdjhjhsdf", "asdfdfasdf", "sdf", "sfsf", "sdfsdfsfsdfsd", "sdfsddserwerwe"]');


--
-- Data for Name: studios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."studios" ("id", "studio_number", "room_grade_id", "floor", "status", "is_active", "created_at") VALUES
	('99593cd9-09c3-47a4-b5ec-c61fe5e441a8', 'PUH-1015', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('98d08dec-a12f-4d2c-977c-bd8418f48313', 'PUH-1044', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('d83db2fd-e7a6-4f53-ab89-0edd207b32a7', 'PUH-1065', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('f3fac127-39e9-43a2-827c-7289c8f90d28', 'PUH-1070', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('024868ad-97b8-4bd9-b93b-d8b0daacb975', 'PUH-1072', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('68a4637b-0053-4479-b858-a9c72271d7e9', 'PUH-1073', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('45a984f2-e348-4a6b-8667-edcd6f607ce2', 'PUH-1074', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('1180ad43-e1e8-4ea8-b612-37f6694dd9c1', 'PUH-1076', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('5b6de81e-f289-4707-b35d-4073f6643b93', 'PUH-1077', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('26af0418-fd1b-4724-8ddd-63c8b5ba474f', 'PUH-1078', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('4e581205-e5b7-4fa2-909e-e2c371980e61', 'PUH-1079', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('eaec39d6-3e28-45c0-ba7f-133e36cb8d4d', 'PUH-1080', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('c8595ea1-ef52-492a-bbbf-6bc84c4cb673', 'PUH-1081', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('68b86c74-abc9-4907-a460-408b70248944', 'PUH-1082', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('f604448e-7f39-4950-9a4e-55059c8c4b47', 'PUH-2007', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('81e22b97-295d-4e2d-aaa3-aecb98a85020', 'PUH-2010', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('1a89bba9-eeac-4893-b13f-cd03c495769e', 'PUH-2037', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('50c4d06b-315e-4e4a-9da8-9351f7952e9f', 'PUH-2074', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('31c759aa-c10a-4ad8-a144-64ea3665656c', 'PUH-2080', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('ddaee71c-7e3d-48f6-a553-5a8a36a0514c', 'PUH-1001', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('8dc30824-2847-498b-9100-d362f26b0851', 'PUH-1002', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a15be883-dcb9-452e-991c-f0ece19186c7', 'PUH-1003', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('9a2d3903-a1bc-4742-8826-1f5070eaddc3', 'PUH-1004', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('ae84026d-22e2-43d7-b997-fc79b522f08a', 'PUH-1005', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('0c72f268-673d-46c6-ae4b-7e0c1795990c', 'PUH-1008', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('76394430-95be-404e-8764-d523d7ed49e4', 'PUH-1009', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('f4b778c2-74c6-4046-8cf4-b1845ff3d556', 'PUH-1010', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('bbf6904f-5ed1-4997-beaa-14b3caf273d9', 'PUH-1014', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('d2e62280-d6a7-4c91-9ad1-a3744c7959ad', 'PUH-1016', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('b2da243e-adbb-4553-82a4-bcd8b29690e1', 'PUH-1017', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('b6e6aba7-c507-45d7-920e-5c791c563a42', 'PUH-1018', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('b5760ca3-abc9-454f-a383-69a8ef1bda72', 'PUH-1019', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('fb99111d-8bef-41b4-854f-9d97bc4a9469', 'PUH-1020', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('567a0630-9f82-4771-9879-3bf8fb754236', 'PUH-1022', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('716362b1-0fe4-4443-bc89-61a6595838f9', 'PUH-1024', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('48b25e9d-dfc8-47f9-8645-871629971663', 'PUH-1025', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('529e9bee-c8b1-436e-adb9-cecc1e7a4a04', 'PUH-1026', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('218c2a2f-2987-48b3-bdd6-50f6d9449717', 'PUH-1028', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('8e110fb8-c78a-404a-90e9-5d49b92c8701', 'PUH-1029', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('f2b54bdb-e0e2-4ced-92db-b099de5eef98', 'PUH-1032', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('29a1af11-0afc-4910-93d0-61035b2ff755', 'PUH-1033', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('d3107a25-114d-4d8e-a43d-227caccee513', 'PUH-1034', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a4044e49-1bc9-488c-9409-1fc786e15530', 'PUH-1036', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('af32619a-9141-40ce-b8f6-0c5388756000', 'PUH-1037', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('c10407ba-d465-4a48-bc44-4c6efb48e320', 'PUH-1038', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('41597ffc-225d-4687-9633-9007539eeca7', 'PUH-1039', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('e4268052-e658-4cab-9a3e-08c32520a4c9', 'PUH-1040', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('3bd8c466-8b59-411c-998c-2a7ab0cc883e', 'PUH-1041', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('71ac8296-e565-48f7-a372-3e7241d6ff27', 'PUH-1042', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('05f7a4ea-9437-4bad-aac9-825fe201657f', 'PUH-1043', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('8685ac38-641a-44d9-a60a-a0552b391c58', 'PUH-1047', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('85237421-1a45-49de-a66b-8486147a0af6', 'PUH-1048', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('624e2c01-e24d-4c83-a900-eefa444241be', 'PUH-1049', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('f4550df8-88c7-4464-9814-7d17291898cf', 'PUH-1050', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('ea4356d5-77ce-48bd-934b-a8157d484e75', 'PUH-1051', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('09b8d84a-c727-4502-a17c-0776e77635a1', 'PUH-1052', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('eedce3ca-6e68-48a9-af80-64a91786c9f5', 'PUH-1053', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('033ce97d-6a4b-4437-831a-7a432f33b804', 'PUH-1054', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('92140cb0-6588-4da4-8b18-29f45575e8fd', 'PUH-1055', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('7dafe74b-6bdd-4999-99fe-f0ac873d6ae6', 'PUH-1057', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('28e32b7b-39bd-4a46-98d3-2a5c2e2965bf', 'PUH-1058', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('8cc7fc94-9b85-4950-a639-b17b2fb0c637', 'PUH-1059', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('66df33b9-77fd-4b87-8189-e78b52912591', 'PUH-1068', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a0499dc9-65e1-41e8-b8d8-d99642bb0173', 'PUH-1071', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('632bd211-dc63-490d-8b04-013bada3ceef', 'PUH-1006', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('26054d11-ed79-4700-ab27-7d4977a6cf0f', 'PUH-1023', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('28366f46-2220-4222-a919-03148653311d', 'PUH-2073', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('d698f089-db0d-4ed2-879a-86b50e675b5b', 'PUH-2081', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('fd8ef727-d3e3-443e-ac4f-807ec0dfb063', 'PUH-3047', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a3b99f6e-55e3-4521-ad75-86ec432283b2', 'PUH-3054', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('d76c34ec-f82a-4703-bdf0-03b250255710', 'PUH-010', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('c827cdda-1249-4dd8-82b8-61f71457434c', 'PUH-024', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('ae424adc-b324-4109-9f61-f6d28721b768', 'PUH-1045', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('d673e5e6-a489-4ae8-ba43-13e31a65c4d4', 'PHU-012', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('54af65d2-422f-462c-a280-bd1933d33d00', 'PUH-1007', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('e6531bf4-0b2b-4d78-a534-85443b062476', 'PUH-1013', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a75ace60-8b79-41cb-b0df-cb17e22dd0f8', 'PUH-1083', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('7c6ea1a1-7341-44ed-9243-9ef7ee4ef477', 'PUH-1084', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('86fc6c7d-0c9b-409a-b4de-ed81ba99d0be', 'PUH-1086', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('d61323b9-3e8d-4791-9d61-5a7aaac1cc4d', 'PUH-1087', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('d16faa75-2db2-4a09-945a-cf14ce87b256', 'PUH-1089', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('23d5da6d-bfb1-4cc8-9acb-a9ac4307bba9', 'PUH-1090', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('92493628-edce-44c1-a367-2efa4a5ee07f', 'PUH-1091', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('4c00c367-b3da-4e21-8c73-fc4a1c4e4822', 'PUH-1092', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('00f54b5f-2766-40a6-b2c3-c3d3918bfd7d', 'PUH-1093', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('855f0b50-8892-4649-825c-653232361b07', 'PUH-1094', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('3939c0b8-4b02-49f5-a087-72845f98a9b9', 'PUH-1095', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('e05aca95-f161-4790-b8e4-c4f353324003', 'PUH-1098', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('93af8167-9b7e-469d-8da4-b3ab20fd69c6', 'PUH-1099', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('73c8376c-5e55-4256-8d30-779a9e974787', 'PUH-1100', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('60c4586b-8b86-40d7-9161-d8ee183275ef', 'PUH-2001', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('0d26a715-ebfe-45f2-952a-5011b91da63b', 'PUH-2002', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('0fd15064-92ff-472c-ad73-b25d0b195849', 'PUH-2003', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('5d7b9139-59b4-4a81-ad9c-652251d2cdb5', 'PUH-2004', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('e0d21985-1bfd-499f-b224-f2c4476e5544', 'PUH-2005', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('13488599-4c76-41ae-82f0-efa221cab4eb', 'PUH-2006', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('9ba252fa-882c-4666-ab62-fff560950b89', 'PUH-2008', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('7cc94b76-11d0-4577-ba2f-675cb00a031a', 'PUH-2009', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('17b1b84b-ff46-40cf-9796-5737fd9ab9bf', 'PUH-2011', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('4cebbdec-e626-497a-a899-671d5fe3484a', 'PUH-2013', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('cad6e2f2-3342-4c6f-a2ba-82c21b38f061', 'PUH-2014', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('2f205bc3-bff8-4bf0-8bfc-cbb2d9034954', 'PUH-2015', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('9d2148ba-d586-4cbf-a1b2-39c97f403388', 'PUH-2016', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('dc6f722c-6538-49c7-ad87-2fab698dbf80', 'PUH-2017', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('dc8c6916-aaec-4148-a9c8-a700f069ebb5', 'PUH-2018', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('8550298b-3431-4a14-99e6-8591b719c5bc', 'PUH-2019', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('44d3dc88-f11f-48fd-b4a6-037fa6a245ed', 'PUH-2020', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('6fbf3df9-0be6-4d34-96ac-a383b545a636', 'PUH-2021', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('edfb8e01-bcc9-44d4-a251-e3b0766d773d', 'PUH-2022', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('22e379ed-911c-4cf0-bb92-23b20b976e1f', 'PUH-2023', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a741959c-3493-4cd1-bb43-3f641f8b4912', 'PUH-2024', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a0dd7f22-bf0c-40d7-8515-de447881a6b6', 'PUH-2025', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a0021ffa-bc67-4a39-a439-4a917e507ee0', 'PUH-2026', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('1a5aa9c6-661f-4c11-bd7c-d1e7dd3b8ae7', 'PUH-2028', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('9a13d050-4b9d-42f9-807e-c3ecb217b130', 'PUH-2029', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('649e7e2b-53ad-486b-a182-2ae4709e1bc9', 'PUH-2030', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('464acad6-fdc7-4cad-90c0-4a90f0cc2b8e', 'PUH-2032', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('6459e66f-0ab1-4769-8979-c2e7988dbda2', 'PUH-2033', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a63938e2-1592-48c6-bc34-e9b058064c27', 'PUH-2034', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('218d5588-6073-4390-a98e-217c5a13a494', 'PUH-2036', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('bb14fd23-6f34-47e0-be30-ee4b6c9fad66', 'PUH-2038', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('55d64da4-e203-44dd-852e-ed1cd6b35515', 'PUH-2039', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('65a9b547-a89f-472f-aa02-c90911e359d4', 'PUH-2040', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('2bd773ce-ff8b-4fc4-b3a5-1aa3b50607b0', 'PUH-2041', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('7dc07434-4816-4e48-9ac1-11f896146784', 'PUH-2042', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('215ba43b-33b9-4705-a335-18cc9100af85', 'PUH-2043', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('295abfe0-d611-4bea-a47a-ed4c3cb16c32', 'PUH-2044', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('558c1b6f-39a7-4206-b49f-4587166f4510', 'PUH-2045', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('cd5973c9-6f92-424f-8b05-6557ee3653b6', 'PUH-2047', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('ec29e645-b474-42d8-b77e-0bb67989545c', 'PUH-2048', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('44e339ee-f351-4247-9d8a-0e03cceabd0d', 'PUH-2049', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('4e2873dc-2e41-4401-992f-615b9dfb9c87', 'PUH-2050', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('121a11ea-e4cc-4064-99be-f2e760ecf2aa', 'PUH-2051', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('199e2ee2-1f41-45e1-afd4-be5b6df294f8', 'PUH-2052', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('59ae8bed-12c3-4e02-8676-a885e3826746', 'PUH-2053', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('4b9ee3d1-1ec0-4564-82b3-5baf1bf80cab', 'PUH-2054', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('51b29958-b60a-4823-928d-750f32f4376a', 'PUH-2055', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('714a27ac-a53e-416a-a541-3a21937f93ea', 'PUH-2057', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('21d75df8-edb6-4295-9813-676b26405be3', 'PUH-2058', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('25b05315-35bd-4d03-a2a2-4a0054cdd0e8', 'PUH-2059', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('9f8093b7-88bb-4341-a095-a50a105e7a91', 'PUH-2060', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('ed8d555c-fdd1-438b-afe8-1c13224a77a4', 'PUH-2061', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('2278251e-9b34-47b6-bb8e-56db914d9b2b', 'PUH-2062', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a7390811-329b-43f9-8c83-8256cad53d2c', 'PUH-2063', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('85f46d5d-0b7d-4883-a79c-b5949128fbf2', 'PUH-2069', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('b170781d-24f6-4011-8629-4622fbf517b7', 'PUH-2070', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('143ecb9a-8191-4ad0-9780-87da49f3160d', 'PUH-2071', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('9c9edf48-9f6b-456a-8ed6-2023ad43693a', 'PUH-2072', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('221dfa8c-ef59-456c-9fa8-a80688634478', 'PUH-2075', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('f25821b1-7c56-4219-a617-d24531f17a6a', 'PUH-2077', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('0d3b8493-fba0-4cb7-8cbb-afd3f710cc1a', 'PUH-2078', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('763ba9aa-e4be-425d-8d24-f12b6c0334b6', 'PUH-2079', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('1fe0003c-df0b-4f9f-aeca-9d7bbda0c572', 'PUH-2082', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('8a05e961-51ce-4d54-9100-7f17965072dc', 'PUH-2083', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('ba01ee92-b8ab-47e4-bbfc-b67848cc1a45', 'PUH-2084', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('3457626d-29dc-44ed-8972-6e4f10cc9d2c', 'PUH-2086', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('be111128-3567-4d3c-a897-b69ad6ea189b', 'PUH-2087', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('cf136c03-befa-4461-966c-62725b6f02a3', 'PUH-2089', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('50e5ab8f-e9a6-48c4-877a-6eac0c17a050', 'PUH-2090', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('410722d9-c774-46a1-9404-ab862a6b15c6', 'PUH-2091', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('d309c33c-c94e-4921-8c82-c0bd04f4f7c6', 'PUH-2092', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('d43d7c53-9ad8-4b1b-82ed-ed3ab17c3288', 'PUH-2093', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('187d733d-e8a6-4dc9-af83-28ef9c8e4c3c', 'PUH-2094', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('ceebe8ea-bcdd-4e82-990a-f7f3cf4d0d70', 'PUH-2095', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('71f4e217-21d7-4a91-9229-29f32c523c8a', 'PUH-2096', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('652f1a08-29cd-4828-b174-d6edfd8dfe65', 'PUH-2097', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a75c6036-d63c-4103-905e-8ef7b346c0a7', 'PUH-2098', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('4bf2cd66-9fa8-49ec-bda1-fcbbce333265', 'PUH-2099', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('644a9818-8729-47f1-b703-9964e10b4348', 'PUH-2100', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('9fca574f-aaef-4f69-b443-b462dbb09dab', 'PUH-3001', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('13f1d852-6159-4708-934c-9e5c83baedc2', 'PUH-3002', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('39332d90-cf38-440f-9837-35643f785378', 'PUH-3003', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('150cc64c-09e7-404d-a968-8f06c2c7608d', 'PUH-3004', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('6c9923ba-4094-480c-b9c5-ea45a46e023a', 'PUH-3005', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('70cdaad9-24ac-45f7-9295-c8378ee0a962', 'PUH-3006', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('70a8931f-7dc7-46ba-a521-3f9291a78e29', 'PUH-3007', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('47a85127-97fc-423a-a5e3-7984eff53a9f', 'PUH-3008', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('21e7bb70-63be-4a72-99ce-807c8c0a127d', 'PUH-3009', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('64e071c4-4b83-46b2-91d7-811e0438ffe0', 'PUH-3010', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('fda0fe05-6254-43ed-873f-8fc2125e51b5', 'PUH-3011', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('6d1086dd-9bc4-4fb5-ba59-89f873f3663b', 'PUH-3013', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('810f36d6-8ef0-436f-8c90-3b385b71f313', 'PUH-3014', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('cf802ea5-77e2-4856-9e5b-2aab4b2d1190', 'PUH-3015', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('f7b523af-693c-4418-a33b-84bd222c55ea', 'PUH-3016', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('ec7da6a8-eef0-4bb2-9152-ed2c4007fd06', 'PUH-3017', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a739157a-ae11-497f-9afc-d49d6a5eb279', 'PUH-3018', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('51b9d880-4da5-4361-9e2b-e8762cdf2cef', 'PUH-3019', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('834cb74a-de07-4813-80cc-9429aad9f182', 'PUH-3020', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('55b18dd6-072b-4f83-b854-62064ff5367c', 'PUH-3021', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('81630934-408b-4d3a-aedc-1e8b999328f4', 'PUH-3022', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('207a0f96-f7dd-4da0-80a5-239d3b3cb03f', 'PUH-3023', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('82ec3aa7-0d23-476f-b447-3c72bdd254fd', 'PUH-3024', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('7c74e3eb-979f-478c-bea3-f1764a8788f9', 'PUH-3025', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('2956bc7b-3099-4f57-a64c-6bea2fe96982', 'PUH-3026', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('aa5093bc-6990-4bd9-9212-202d206b24fc', 'PUH-3028', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('07d9c0c1-4e29-49e7-a4ef-3f9251d372b7', 'PUH-3029', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('72409022-c2e1-447f-86ff-d08490dcbcab', 'PUH-3030', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('774e0466-56a0-476e-a441-a3d57e022663', 'PUH-3032', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('7ef5b8bd-dd32-43f5-9ce9-1e183034fba4', 'PUH-3033', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a9a87c9b-f792-403d-a7f0-0f3ad46b5898', 'PUH-3034', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('0a32e106-4b8c-418b-b409-bbf7c62ee393', 'PUH-3036', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('9b5d5ee0-7577-406a-89dc-fa73c799a47a', 'PUH-3037', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('e52f2a61-67ba-4116-8676-f3211fb86eb0', 'PUH-3038', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('dff1c4dc-5cfe-43e0-b648-9afecdadb5c1', 'PUH-3039', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('1567ec96-b896-4c9b-81e0-f6917d43c43a', 'PUH-3040', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('4aa287f3-7d00-49c3-89ce-9c808d38066a', 'PUH-3041', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('b5fa26f5-8cdb-44c4-a720-5da69201df2b', 'PUH-3042', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('348f0040-e3b7-467b-b7c9-28e75f44b34c', 'PUH-3043', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('6d3099b7-7a00-482a-bbd4-8bf582f4ae1d', 'PUH-3044', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('873aadc6-48db-424d-9ddc-9423b45afdcd', 'PUH-3045', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('5e494a1a-485c-44aa-a03e-03bba41f7fa1', 'PUH-3048', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('2de878d8-849a-4952-89e3-e33d44fe4bda', 'PUH-3049', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('cdd12c42-7426-46bc-9577-607ef59f1b6e', 'PUH-3050', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('9c894a89-fb71-4165-90b9-c34657432e2c', 'PUH-3051', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('ab0e1034-c436-4178-b732-beb310579403', 'PUH-3052', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('198739c8-9d41-4dae-bb97-bb74272595cc', 'PUH-3053', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('9901a992-8f5b-4fff-b5e2-951b87bfc9a5', 'PUH-3055', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('2688be1a-4ba5-49cf-b957-86b4bb0dbc1d', 'PUH-3056', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('d104eb21-3d59-455f-b5fe-2b82ac797aba', 'PUH-3057', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('c13306b6-78ca-4df8-af23-e282f24ff8c0', 'PUH-3058', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('d7049245-2ae2-4f14-ba9e-4a305b51e4a8', 'PUH-3059', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('371bf854-485e-4a1d-a625-2cdf54300fdc', 'PUH-3060', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('0b037ca5-ca68-481f-822d-ccba3613a62f', 'PUH-3061', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('7919c525-050f-42c0-bbea-14d924b06d46', 'PUH-3062', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('4fe32c99-abf9-4e92-8d53-104253a4e2b9', 'PUH-3063', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('ae34c606-6c61-4e1b-bc48-7a246222f91f', 'PUH-3065', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('d10e0697-53a7-43df-9c8d-27397dc9bd51', 'PUH-3066', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('61e3c494-02ae-4e36-aa1f-33a2faf92b5d', 'PUH-3067', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('1ed4afe5-e3f7-428e-9efe-44da0398ebdb', 'PUH-3068', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('415f3c59-57fd-4343-85f0-914759bc6296', 'PUH-3069', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a525e88e-2772-42f1-bf07-4e58e22161fc', 'PUH-3070', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('5d2d1cd3-7cf9-4c75-a9fa-25c3edf04bab', 'PUH-3071', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('70bbf5bc-0858-465e-9fc2-28ca1d244311', 'PUH-3072', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('0d0c3efa-7464-41c7-8c51-8c2847d31e9a', 'PUH-3073', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('4648870e-bb1c-47c0-9224-d23b9c5223e2', 'PUH-3074', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('c1194c26-7862-43f9-b391-fa2b80aacabd', 'PUH-3075', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('664dad45-2f5d-4421-a30f-0876759d10f1', 'PUH-3076', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('5f139ab0-552f-4043-a94e-0d9468b18d22', 'PUH-3077', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('c339b9fe-4b5d-4bea-8827-c1fb6420686f', 'PUH-3078', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('1b4340a3-8caf-4bc3-a0f4-4e723f541ab5', 'PUH-3079', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('afe70846-bc6c-4ace-a323-a245abba819d', 'PUH-3080', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('9d8ced69-8d0a-4b7e-bb75-45af4cd7e8c1', 'PUH-3081', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('d78d4410-cec8-4476-80d9-e88e0fbb2ead', 'PUH-3083', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('6489c0f7-960b-4173-9504-5522cca78083', 'PUH-3084', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('4d7a5255-acdd-48e2-8f78-e09daf175bc9', 'PUH-3086', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('17c74be7-366b-44ed-95d4-61ca5b263012', 'PUH-3087', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('bf899bda-76e3-4769-a887-7e78785e350d', 'PUH-3088', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('c672e073-4871-4b2d-a7ea-7ad679f9f7b2', 'PUH-3089', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('831e2247-5feb-43f2-8cfd-7f661f55baba', 'PUH-3090', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('f8971348-fffb-4426-8e74-aebda0029cbe', 'PUH-3091', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('5d1a81a5-8ca3-415b-b863-d3c0b0fc9292', 'PUH-3092', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('4df5e310-641e-485f-b06f-e82a68444f83', 'PUH-3093', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('8b611014-b2da-471d-a86d-6e953a4e37b9', 'PUH-3095', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('5135ea0a-a821-4867-8d98-b2619e70227d', 'PUH-3096', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('c04585b2-a072-414f-8cd0-d2477e4a8b2d', 'PUH-3097', '29735358-9e74-4a7c-b618-ac73714ca108', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('78bfc2fb-1151-4685-98b0-62f5339acd2f', 'PUH-4001', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('38c089cc-45ba-4780-9b83-ed8e4031f82c', 'PUH-4002', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('d553b8b6-3636-45ad-bd58-95aeb7ee8425', 'PUH-4004', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('c23b94a9-c5f4-411d-993d-d6d07f0bfcfd', 'PUH-4005', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('3e18d397-de14-4929-8606-4972588b12fe', 'PUH-4007', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('9d1acb52-4a73-415b-9066-ff2a7c40882e', 'PUH-4008', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('e7b9eb70-6a1e-4da5-bef7-72713ab98b60', 'PUH-4012', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a06f30e1-ef0f-4714-a43a-0c20a5048d38', 'PUH-4013', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('3028e232-fa46-40ff-884d-af094c1f39c7', 'PUH-4014', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('d1aab10d-d124-432c-98c5-47ceb4e31898', 'PUH-4015', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('490b76a5-c58d-4a4f-a2dc-055a381f640f', 'PUH-4016', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('d88ae38e-03b8-4949-a65e-0aacee5e9c3d', 'PUH-4017', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('eccf2cfd-29e0-4eec-b6f6-ab627fb33e05', 'PUH-4019', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('77c1646c-9733-47d7-bc2a-cf6812f98e70', 'PUH-4020', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('e100df19-60ba-48df-8229-5b1f8d55ca99', 'PUH-4021', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('bdb1a8c6-a99c-40e8-a099-ad825f8e5c74', 'PUH-4023', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('4d243629-5cc0-4924-a6a0-28c31b947666', 'PUH-4024', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a8004ecd-1b72-48dd-83a0-8fee70bbfb16', 'PUH-4025', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('300de42d-ffa4-456a-9a1e-ec5a9a8e23e3', 'PUH-4026', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('02bc5518-1193-4f2f-996c-3973ec81f698', 'PUH-4027', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('5515e4ec-28b4-4e45-9661-b75c580bb962', 'PUH-4028', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a2802f2a-5d54-469d-adc8-29ff7e82fa63', 'PUH-4029', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('431d9630-5b91-4dc9-af32-2591336e7f26', 'PUH-4030', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('77dc2b70-4213-4d03-8091-169418621676', 'PUH-4031', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('241164e9-6811-4d68-bc22-e974061f516d', 'PUH-4032', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('0bb4a86e-61e8-4603-b5bf-b07d157c380e', 'PUH-4036', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('e7071a54-24ad-4638-87c2-980963b8f09f', 'PUH-4037', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('abafd6be-c828-4a3f-94c3-d80abcb2742c', 'PUH-4039', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a343a88d-b082-4630-b615-74cd7de2ac0f', 'PUH-4040', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('6b66f437-3555-44d2-8cb4-65dd1bde994b', 'PUH-4041', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('f7741aaf-1c4f-4fd9-807d-cc3729dbeaf6', 'PUH-4042', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('cddf3f60-9060-4a53-97ac-69e3b07fc500', 'PUH-4043', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('cdc3e59c-f111-449a-afdd-fc7a0c66430d', 'PUH-4044', '29735358-9e74-4a7c-b618-ac73714ca108', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('16dee335-24ad-4096-a269-7ae7558d329a', 'PUH-5002', '29735358-9e74-4a7c-b618-ac73714ca108', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('d7282377-2492-49e3-bbbe-92924cda82bf', 'PUH-5005', '29735358-9e74-4a7c-b618-ac73714ca108', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('02967572-4363-4f48-a773-3b914a6b4277', 'PUH-5006', '29735358-9e74-4a7c-b618-ac73714ca108', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('04c1ef6f-626c-44a9-a1df-c01acd6e2399', 'PUH-5008', '29735358-9e74-4a7c-b618-ac73714ca108', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('12c41c83-c010-4e09-83d5-d97cfe88cade', 'PUH-5009', '29735358-9e74-4a7c-b618-ac73714ca108', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('5c1a9182-c235-4654-9150-7ca898ce975b', 'PUH-5010', '29735358-9e74-4a7c-b618-ac73714ca108', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('f4325a76-40f9-49e2-a325-e290698fed75', 'PUH-5016', '29735358-9e74-4a7c-b618-ac73714ca108', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('5c357042-9c3f-4492-89de-dc60e4bf8d8a', 'PUH-5017', '29735358-9e74-4a7c-b618-ac73714ca108', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('6eae0f5c-aac4-423a-8004-bc74b84c6f97', 'PUH-5018', '29735358-9e74-4a7c-b618-ac73714ca108', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('6e4c07a7-8a6e-403a-922e-1b7d9dd40fb7', 'PUH-5019', '29735358-9e74-4a7c-b618-ac73714ca108', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('d27c090f-f571-4653-b567-19395bdcd692', 'PUH-5020', '29735358-9e74-4a7c-b618-ac73714ca108', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('68463c73-971a-4e36-aac1-929b73b604e6', 'PUH-5021', '29735358-9e74-4a7c-b618-ac73714ca108', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('809cbadb-cfeb-4732-a0e1-4e706c306473', 'PUH-5022', '29735358-9e74-4a7c-b618-ac73714ca108', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('47bfe8ef-1fc5-4066-a91d-9128ee601e83', 'PUH-5023', '29735358-9e74-4a7c-b618-ac73714ca108', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('99d3dcea-d8f6-4793-a4ba-f6789ac17dbe', 'PUH-5024', '29735358-9e74-4a7c-b618-ac73714ca108', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('81b8e85b-5741-426a-bb21-a16b8546f57e', 'PUH-5025', '29735358-9e74-4a7c-b618-ac73714ca108', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('104ed37b-854d-4e20-94e4-9a143e00692c', 'PUH-5027', '29735358-9e74-4a7c-b618-ac73714ca108', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('e7a0b14d-efc7-4332-85ad-33a546b228c2', 'PUH-005', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('8ed0a202-70e2-4db8-b1d7-4bbfee614eea', 'PUH-006', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a0a3fbb9-ad72-4bf8-83c0-09479800d714', 'PUH-015', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('9a685dc6-c005-46d1-9b34-4c7c785baaad', 'PUH-016', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('f73bb8b6-d467-4c6a-bce3-f87c86ba36ee', 'PUH-017', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('d3ed58d2-ab78-4242-b583-6d127254bda6', 'PUH-018', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('9e98b26b-0e61-4a9c-b652-b7cbb7e133e8', 'PUH-019', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('fb28e877-ac49-482f-96a0-183409596aa7', 'PUH-021', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('e0de1717-6874-4d09-b126-7780e1b2e4f8', 'PUH-023', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('9b5dd595-8f3d-4331-8a30-e7bb4934b26e', 'PUH-025', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('fa46cf26-1259-4a7b-976e-212e5b71b1b0', 'PUH-026', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('14cc7579-4e68-4a57-9575-fda19ebc3407', 'PUH-027', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('333c9263-6916-4675-9779-7c5efef41fe2', 'PUH-028', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a5ec11dd-1ed1-4ae4-b895-40e8efe6a7a0', 'PUH-030', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('6806959e-7ab4-49c3-8770-386d05b1198a', 'PUH-031', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('864f9440-9eff-4e43-a655-002b5e48509a', 'PUH-032', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('b11c4714-3464-4c83-afb7-a51c3e2b6ef0', 'PUH-033', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('6f296a86-bf6f-42f7-9ce4-37be1aad2a7d', 'PUH-034', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('c70a0b09-a39f-4683-bfbd-458073489edd', 'PUH-035', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('bb5080e4-d1cb-412e-a18b-49b492a2f8b5', 'PUH-036', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('76ad6aca-d5c6-4083-bc54-8d08a8346210', 'PUH-037', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('ba4359a6-2c59-444a-8141-cef2100b09ee', 'PUH-038', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('c64c7626-7460-4166-9030-1469aaec020f', 'PUH-044', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('6d68a222-cd48-436b-bc86-7e30ed82feaa', 'PUH-045', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('50181bdc-0716-4fd9-bb8e-539bdfc06aad', 'PUH-046', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('8928a9aa-06e4-4946-9828-a75a3e045952', 'PUH-5026', '29735358-9e74-4a7c-b618-ac73714ca108', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('e5bdcc43-c02c-491d-af3b-fe4d28847726', 'PUH-029', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('b9afe32d-435e-41e7-bd64-4d2ebd8a172f', 'PUH-009', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('4f7d4444-5e40-414c-94d3-ac1af3e648ce', 'PUH-014', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('0e34c5fb-5576-4f62-b375-c0149e1b87ff', 'PUH-008', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('87204508-de19-429a-b838-82461b9693ac', 'PUH-002', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('7b574003-1c93-4818-9100-aa2afd8f5290', 'PUH-004', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('1ccea227-4874-43f9-ae6c-e775f8f3b72c', 'PUH-047', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('24abc1b4-d2a2-41ee-87cc-bca8f90e45a2', 'PUH-048', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('55960a48-6cb4-4d74-901e-5c6dd8983f01', 'PUH-049', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('5e1dd6d0-7156-4dca-a089-5b0fb69e2c7f', 'PUH-050', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('7a59e796-6a92-4af2-93be-49de0554880a', 'PUH-051', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('e28e555d-d011-448b-b542-82ab859d5107', 'PUH-052', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('c1f62215-7a9c-4fad-98f7-09085fdeb73c', 'PUH-103', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('dfdcdba4-7c5c-4f68-94cd-0be4ebb9bb88', 'PUH-1011', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('7eab5cad-a661-42b9-8a76-ada3c055916f', 'PUH-1021', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('f4b0cb4c-487b-4d98-9942-4251d68593f2', 'PUH-1030', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('ab6bdaf2-ef85-4b1e-bfec-82bfbdaac9ed', 'PUH-1056', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('675dd1cf-d000-4b9f-bbe4-d50c20413e0b', 'PUH-1060', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('1d2de8a5-6503-4c09-aa7d-571841704b37', 'PUH-1061', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('7cbe4f6d-4dbf-435e-aa56-0a279f8be212', 'PUH-1062', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('64d762b2-5d97-4e11-8163-82a318733d50', 'PUH-1063', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('781aa19f-2dee-40ee-a7b2-0847ba86d6bf', 'PUH-1075', '29735358-9e74-4a7c-b618-ac73714ca108', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('b7651a70-1a68-4a41-b9aa-7136528b164f', 'PUH-2076', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('954c6f31-6765-47e3-bfac-0c25b0766b01', 'PUH-1097', '024aed2e-46e8-4764-a699-617e07ad0f8f', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('6ed49a7c-d00e-45ac-91f9-cb2f80c38b2f', 'PUH-022', '024aed2e-46e8-4764-a699-617e07ad0f8f', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('2f320b20-5ceb-437d-bff2-0fadbd4b7f28', 'PUH-042', '024aed2e-46e8-4764-a699-617e07ad0f8f', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('ef1484d9-5518-4c1a-88f6-1964a7897323', 'PUH-1027', '024aed2e-46e8-4764-a699-617e07ad0f8f', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('937c1887-61ca-4460-a54d-9e15cef536c1', 'PUH-1031', '024aed2e-46e8-4764-a699-617e07ad0f8f', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('c3fa566c-fa85-4d9c-a833-23d03b730e40', 'PUH-1046', '024aed2e-46e8-4764-a699-617e07ad0f8f', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('e121daad-4673-42c4-bb0f-020cfdcf6f61', 'PUH-1064', '024aed2e-46e8-4764-a699-617e07ad0f8f', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('c02e65e5-f199-4812-b108-21aee65a7611', 'PUH-1067', '024aed2e-46e8-4764-a699-617e07ad0f8f', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('7bd5143b-2fa6-4607-a9ed-363a84c25160', 'PUH-1096', '024aed2e-46e8-4764-a699-617e07ad0f8f', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('97038b1f-5e82-4ca8-98ff-5a0845abdc2d', 'PUH-2027', '024aed2e-46e8-4764-a699-617e07ad0f8f', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('bf178d8b-5a6c-4072-8c75-ad04654c4fce', 'PUH-2031', '024aed2e-46e8-4764-a699-617e07ad0f8f', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('015f3af3-e9d3-4d09-be2e-246990460cc7', 'PUH-2046', '024aed2e-46e8-4764-a699-617e07ad0f8f', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('fb5073ac-e2cb-4e62-ad41-c9ba3a98e231', 'PUH-2085', '024aed2e-46e8-4764-a699-617e07ad0f8f', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('c075dea1-ff6f-4efe-aa87-5560f8ad0c38', 'PUH-3012', '024aed2e-46e8-4764-a699-617e07ad0f8f', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('2b7e6e4e-3cb5-4451-abf7-fe8ea3ccf0b7', 'PUH-3027', '024aed2e-46e8-4764-a699-617e07ad0f8f', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('f230cbbe-ac8e-4bee-95db-8e834ab402d0', 'PUH-3031', '024aed2e-46e8-4764-a699-617e07ad0f8f', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('2ea1342d-4dbb-4fc7-9eaf-7faf67d14050', 'PUH-3046', '024aed2e-46e8-4764-a699-617e07ad0f8f', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('50a53fdc-bfa6-41ca-844b-0af6eb654d77', 'PUH-3082', '024aed2e-46e8-4764-a699-617e07ad0f8f', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('50b4248d-34a6-4809-970b-b76c46e32c3c', 'PUH-3094', '024aed2e-46e8-4764-a699-617e07ad0f8f', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('f3d8a0f2-c1c3-4d47-b659-8cbe73a03887', 'PUH-3098', '024aed2e-46e8-4764-a699-617e07ad0f8f', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('b7b9c320-7726-49cb-b947-717ee043ddfe', 'PUH-4006', '024aed2e-46e8-4764-a699-617e07ad0f8f', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('3a0dacb2-9386-46cc-9710-e1ccf10473cd', 'PUH-4010', '024aed2e-46e8-4764-a699-617e07ad0f8f', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a2d9f54c-95eb-49ea-b823-28c7b10f760b', 'PUH-4011', '024aed2e-46e8-4764-a699-617e07ad0f8f', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('05a48db5-2d08-40fa-8c8e-5aa4fa2b49b9', 'PUH-4022', '024aed2e-46e8-4764-a699-617e07ad0f8f', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('5c7e6816-e6ca-436b-8d46-18a4252691b5', 'PUH-4033', '024aed2e-46e8-4764-a699-617e07ad0f8f', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('872c4dc7-2dc4-4f03-a8f9-103201c361e3', 'PUH-4034', '024aed2e-46e8-4764-a699-617e07ad0f8f', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('18b24394-02ef-46c4-917b-75cb4925560a', 'PUH-4038', '024aed2e-46e8-4764-a699-617e07ad0f8f', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('71ce1f42-30c9-4303-841f-5533b38f2461', 'PUH-5001', '024aed2e-46e8-4764-a699-617e07ad0f8f', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('62bbd9a7-09cf-4e18-ade7-516bed5f8019', 'PUH-5004', '024aed2e-46e8-4764-a699-617e07ad0f8f', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('0ef1772d-dd8e-4e68-a262-8f72a73f2ab0', 'PUH-5011', '024aed2e-46e8-4764-a699-617e07ad0f8f', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('11c733a4-3b8b-4e36-9f7d-95af3dcf7a5a', 'PUH-5012', '024aed2e-46e8-4764-a699-617e07ad0f8f', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('ca654b11-b794-4459-8dcb-2f918442724e', 'PUH-5015', '024aed2e-46e8-4764-a699-617e07ad0f8f', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('ad5763bc-b2ee-447d-8e08-b698271e3f4f', 'PUH-040', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a6bd316a-5e7d-42a1-a3d0-ddf8667e4bf9', 'PUH-011', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('4b363940-d1aa-4d4e-92f8-9217d6aa81ad', 'PUH-041', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('b825c9b1-dc3d-49fe-9884-3fa408e43ba3', 'PUH-1012', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('85122b3a-22cd-4ac3-bbe6-a4cf90b1ed64', 'PUH-1035', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('d7295f81-0ec2-472b-9ba1-511d21de46a6', 'PUH-1066', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('83a0c633-8f74-4b67-98f8-ed25a78b5179', 'PUH-1085', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('3bbee855-dac3-4ff8-b51e-1d7f592fbd3a', 'PUH-1101', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('73d79209-1f18-4a39-86e2-958e6cc0f814', 'PUH-2012', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('64fd02e6-b030-4d98-9872-d210e092df87', 'PUH-2035', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('56b604fa-28ee-4128-8925-67eec210ff53', 'PUH-2064', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('5798fb90-c3dc-4d0f-9348-31157eb6c090', 'PUH-2065', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('4df5fbe2-7390-4059-9c28-d72dbf6240ef', 'PUH-2066', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('57ba79e9-4744-40ae-82c4-f2432abd7f5d', 'PUH-2067', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a0013de2-3fc7-446b-992e-bd285f4dcd9f', 'PUH-2088', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('4128ab95-157b-4693-8e0c-0faaa0eb5f8f', 'PUH-2101', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('dab9a730-5725-4710-bdb8-8c94ac4d0890', 'PUH-3035', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('40af060f-6b11-4ec5-bf68-38599f3b2ee9', 'PUH-3064', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('25df25b2-2360-46ef-8441-e6269efcb866', 'PUH-3085', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 3, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('c1312778-3beb-4bfb-977d-e5c948f0d1ae', 'PUH-4003', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('f4b5e940-4cfa-4a4f-9d0a-7d231addf478', 'PUH-4018', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('0428a747-e89f-4fe3-94a9-240c7ce50998', 'PUH-5003', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('15f5c39d-0fb6-42c5-8699-8c2a066a1f25', 'PUH-1088', '1a8ade21-ecf1-4dff-b94e-4b0d0a5ca1aa', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('2d16ed2e-7e2a-4a71-9b8e-066917e48d3d', 'PUH-4009', '1a8ade21-ecf1-4dff-b94e-4b0d0a5ca1aa', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('36f50a92-98bd-44fd-a2d4-05e39030ccd0', 'PUH-4035', '1a8ade21-ecf1-4dff-b94e-4b0d0a5ca1aa', 4, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('ccce525f-5325-48eb-91d2-f93a1294dbf1', 'PUH-5013', '1a8ade21-ecf1-4dff-b94e-4b0d0a5ca1aa', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('311d6658-7151-459a-9275-e462d5e9b342', 'PUH-5029', '1a8ade21-ecf1-4dff-b94e-4b0d0a5ca1aa', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('3e110c6e-5af4-4b47-8a07-0a3d4de7d9a0', 'PUH-043', '439d2d82-3bdf-4dd8-a7ae-9a0c035aa7aa', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('64a0e3fb-4ea8-4068-a528-3fbf85007297', 'PUH-1069', '439d2d82-3bdf-4dd8-a7ae-9a0c035aa7aa', 1, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('f17ed710-5b50-48a7-b03d-741f1596b453', 'PUH-2068', '439d2d82-3bdf-4dd8-a7ae-9a0c035aa7aa', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('1112f4fe-be51-43aa-b241-349911b577c2', 'PUH-5007', '439d2d82-3bdf-4dd8-a7ae-9a0c035aa7aa', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('131a8b4f-b008-41b7-ba45-c5aa9bc252ad', 'PUH-5014', '439d2d82-3bdf-4dd8-a7ae-9a0c035aa7aa', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('2027c88c-2bb8-491e-a366-b0f8101ef8aa', 'PUH-5028', '439d2d82-3bdf-4dd8-a7ae-9a0c035aa7aa', 5, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('c1d7bebd-945f-4afa-b8c3-cc3e822783b5', 'PUH-039', 'eb34e13c-8f44-4a93-abc4-6141caf4b5dc', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('3ba6a783-6dde-4639-98de-f57f640f0088', 'PUH-007', '024aed2e-46e8-4764-a699-617e07ad0f8f', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('ffdd2b3e-a868-42b4-a5c1-9ec867e0a68f', 'PUH-001', '1a8ade21-ecf1-4dff-b94e-4b0d0a5ca1aa', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('8cf8ecaa-c6fb-4c85-878f-22d67ab9d116', 'PUH-003', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('bff66f49-ef64-4747-a816-7b61fab5d672', 'PUH-2056', '29735358-9e74-4a7c-b618-ac73714ca108', 2, 'vacant', true, '2025-08-08 09:59:18.075738+00'),
	('a6b1b4d5-3bf5-41cf-a4a8-489420e90a64', 'PUH-020', '29735358-9e74-4a7c-b618-ac73714ca108', 0, 'vacant', true, '2025-08-08 09:59:18.075738+00');


--
-- Data for Name: cleaning_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."cleaning_tasks" ("id", "studio_id", "cleaner_id", "scheduled_date", "scheduled_time", "estimated_duration", "status", "notes", "completed_at", "verified_by", "created_by", "created_at") VALUES
	('66e62a18-ca7d-443a-b38f-b04b70ab7855', '54af65d2-422f-462c-a280-bd1933d33d00', NULL, '2025-09-13', '10:00:00', 120, 'scheduled', 'Cleaning for new student check-in: Benjamin Garcia', NULL, NULL, '423b2f89-ed35-4537-866e-d4fe702e577c', '2025-09-13 11:07:14.194926+00'),
	('a66259a2-0354-4c3c-8961-82a9f3d0d384', '7b574003-1c93-4818-9100-aa2afd8f5290', NULL, '2025-09-01', '09:00:00', 120, 'scheduled', 'Initial cleaning for student: maggy hhghhghghghghg (4492ddcf-8db6-4b4a-b859-5cdbc5228b24)', NULL, NULL, '423b2f89-ed35-4537-866e-d4fe702e577c', '2025-09-14 15:22:30.329589+00');


--
-- Data for Name: durations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."durations" ("id", "name", "duration_type", "check_in_date", "check_out_date", "weeks_count", "academic_year", "is_active", "created_at") VALUES
	('1293b566-8c17-4b14-b151-29024525c86f', '51 Weeks', 'student', '2025-09-01', '2026-08-15', 51, '2025/2026', true, '2025-08-06 09:44:19.07549+00'),
	('14a7f636-cb5c-485e-b028-e1a4a36838fc', '45 Weeks', 'student', '2025-09-01', '2026-07-15', 45, '2025/2026', true, '2025-08-06 09:46:23.006718+00');


--
-- Data for Name: maintenance_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."maintenance_categories" ("id", "name", "description", "priority", "is_active", "created_at") VALUES
	('59b90ea2-ba9e-4391-b562-94f635875e75', 'Plumbing', 'Water and drainage issues', 2, true, '2025-08-02 20:59:28.423587+00'),
	('4a1a2776-988e-4dfc-9d95-29a021907ab1', 'Electrical', 'Electrical system problems', 2, true, '2025-08-02 20:59:28.423587+00'),
	('d746a57f-1f2b-46c8-a5f3-2155067c35d9', 'HVAC', 'Heating, ventilation, and air conditioning', 2, true, '2025-08-02 20:59:28.423587+00'),
	('9ae0dc8a-c165-4ccb-b875-f68d45f8eb75', 'Furniture', 'Furniture repairs and replacements', 1, true, '2025-08-02 20:59:28.423587+00'),
	('a5ad3594-c1e3-4d73-b6c7-c6cbb2fca2cf', 'Cleaning', 'Deep cleaning and maintenance', 1, true, '2025-08-02 20:59:28.423587+00'),
	('152da638-85af-4e7b-9e03-f8c6b38e7253', 'Security', 'Security system issues', 3, true, '2025-08-02 20:59:28.423587+00'),
	('1f20bd79-cc5c-4461-b853-be187fc7ef3c', 'Appliances', 'Kitchen and laundry appliances', 2, true, '2025-08-03 07:08:45.664695+00'),
	('0c0e1080-1ea8-46fa-962a-7ab88332a45a', 'Pest Control', 'Pest prevention and treatment', 2, true, '2025-08-03 07:08:45.664695+00'),
	('4f2b5d45-c7ed-43ec-8317-c87d0462d409', 'Structural', 'Building structure and safety issues', 3, true, '2025-08-03 07:08:45.664695+00');


--
-- Data for Name: maintenance_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: file_storage; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."file_storage" ("id", "filename", "original_filename", "file_path", "file_size", "mime_type", "category", "description", "tags", "related_entity_type", "related_entity_id", "uploaded_by", "is_public", "is_deleted", "created_at", "updated_at") VALUES
	('ca6f960c-c80e-4332-937f-2816956db1a1', '1754284418825_ticqe2g2l.json', 'stripe-keys.json', 'system_backup/1754284418825_ticqe2g2l.json', 358, 'application/json', 'system_backup', 'Configuration file: stripe-keys.json', '{config,stripe,security}', NULL, NULL, NULL, false, false, '2025-08-04 05:13:39.223533+00', '2025-08-04 05:13:39.223533+00'),
	('dbe525a7-dc64-4fe8-a594-5222379f74f1', '1754285010308_3cbbjil8m.json', 'stripe-keys.json', 'system_backup/1754285010308_3cbbjil8m.json', 347, 'application/json', 'system_backup', 'Configuration file: stripe-keys.json', '{config,stripe,security}', NULL, NULL, NULL, false, false, '2025-08-04 05:23:31.195056+00', '2025-08-04 05:23:31.195056+00'),
	('13809c3c-5bbe-4f3f-8216-3acbafed4e4b', '1754318767533_byiap4v12.json', 'stripe-keys.json', 'system_backup/1754318767533_byiap4v12.json', 543, 'application/json', 'system_backup', 'Configuration backup for stripe-keys.json', '{config,backup,stripe-keys}', NULL, NULL, NULL, false, false, '2025-08-04 14:46:08.543118+00', '2025-08-04 14:46:08.543118+00'),
	('7bd55945-c6f3-4115-bbf8-aae1bea961ac', '1754737714660_jpeugonzk.jpg', '100dd05eb3efd52eeac0fc0a351dcf8d.jpg', 'general/1754737714660_jpeugonzk.jpg', 95628, 'image/jpeg', 'general', 'Room grade photo', '{}', NULL, NULL, NULL, true, false, '2025-08-09 11:08:35.168708+00', '2025-08-09 11:08:35.168708+00'),
	('de8e6b18-9b4e-4d70-ae82-bd06ad855d9c', '1754737716102_4jevulzpg.jpeg', 'WhatsApp Image 2025-08-08 at 11.02.15.jpeg', 'general/1754737716102_4jevulzpg.jpeg', 50987, 'image/jpeg', 'general', 'Room grade photo', '{}', NULL, NULL, NULL, true, false, '2025-08-09 11:08:36.213019+00', '2025-08-09 11:08:36.213019+00'),
	('614829cd-333a-444a-b4a0-6026705679a3', '1754737717128_8pe0u8lwl.jpeg', 'a-clean-minimalist-dashboard-interface-d__e_B0LwTReuCxjB-65xewQ_xqbHhOFISSyWtKCX7wtg-w.jpeg', 'general/1754737717128_8pe0u8lwl.jpeg', 63487, 'image/jpeg', 'general', 'Room grade photo', '{}', NULL, NULL, NULL, true, false, '2025-08-09 11:08:37.336026+00', '2025-08-09 11:08:37.336026+00'),
	('ce870226-a0c0-4f31-b43c-0e898761ab26', '1754737718272_ru72phram.png', 'ChatGPT Image Aug 6, 2025, 11_46_16 PM.png', 'general/1754737718272_ru72phram.png', 1416640, 'image/png', 'general', 'Room grade photo', '{}', NULL, NULL, NULL, true, false, '2025-08-09 11:08:39.183859+00', '2025-08-09 11:08:39.183859+00'),
	('2f5f243f-39dd-4199-a516-36541a7d5b37', '1754737720113_54qk0b03p.png', 'ChatGPT Image Aug 6, 2025, 11_41_33 PM.png', 'general/1754737720113_54qk0b03p.png', 2146617, 'image/png', 'general', 'Room grade photo', '{}', NULL, NULL, NULL, true, false, '2025-08-09 11:08:40.728826+00', '2025-08-09 11:08:40.728826+00'),
	('310519c6-9cf7-4fea-95a8-68ad96ae5ac7', '1754738892254_nfabwdg42.webp', 'Gold-Studio-Urban-Hub-Student-Accommodation-4-scaled.webp', 'general/1754738892254_nfabwdg42.webp', 296786, 'image/webp', 'general', 'Room grade photo', '{}', NULL, NULL, NULL, true, false, '2025-08-09 11:28:13.242943+00', '2025-08-09 11:28:13.242943+00'),
	('11b3d5bf-0fbf-4950-9f12-d34be7baa4d6', '1754738894208_l31shha4j.webp', 'Gold-Studio-Urban-Hub-Student-Accommodation-5-scaled.webp', 'general/1754738894208_l31shha4j.webp', 232624, 'image/webp', 'general', 'Room grade photo', '{}', NULL, NULL, NULL, true, false, '2025-08-09 11:28:14.671163+00', '2025-08-09 11:28:14.671163+00'),
	('731b4aca-70ce-459e-9148-b49a22ba81b1', '1754738895584_plebzi35f.jpg', 'Artboard-2.jpg', 'general/1754738895584_plebzi35f.jpg', 122955, 'image/jpeg', 'general', 'Room grade photo', '{}', NULL, NULL, NULL, true, false, '2025-08-09 11:28:15.421187+00', '2025-08-09 11:28:15.421187+00'),
	('814d7347-796d-4a93-a828-955542855215', '1754738896376_6c21kh0cw.png', 'blog-101.png', 'general/1754738896376_6c21kh0cw.png', 1921653, 'image/png', 'general', 'Room grade photo', '{}', NULL, NULL, NULL, true, false, '2025-08-09 11:28:17.710127+00', '2025-08-09 11:28:17.710127+00'),
	('7e597634-5cb7-4756-9494-a612500fffdc', '1754738898634_a9s8vzv3t.webp', 'UCLan-Housing-Guide-1.webp', 'general/1754738898634_a9s8vzv3t.webp', 158452, 'image/webp', 'general', 'Room grade photo', '{}', NULL, NULL, NULL, true, false, '2025-08-09 11:28:18.43247+00', '2025-08-09 11:28:18.43247+00'),
	('a088d32f-dc6a-4c42-970b-98a76363a510', '1754738899339_834rmnyyb.webp', 'Top-Features-to-Expect-in-Modern-Student-Flats-Near-UCLan-scaled.webp', 'general/1754738899339_834rmnyyb.webp', 349676, 'image/webp', 'general', 'Room grade photo', '{}', NULL, NULL, NULL, true, false, '2025-08-09 11:28:19.169188+00', '2025-08-09 11:28:19.169188+00');


--
-- Data for Name: file_shares; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: installment_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."installment_plans" ("id", "name", "description", "number_of_installments", "discount_percentage", "late_fee_percentage", "late_fee_flat", "is_active", "created_at", "late_fee_enabled", "late_fee_days", "due_dates", "deposit_amount") VALUES
	('30125fcb-5273-4f65-964f-4d6f189eac48', '10 Installments', 'Pay in 10 installments for student accommodation', 10, 0.00, 5.00, 25.00, true, '2025-08-06 12:38:21.222826+00', false, 7, '["2025-08-16", "2025-10-01", "2025-11-01", "2025-12-01", "2026-01-01", "2026-02-01", "2026-03-01", "2026-04-01", "2026-05-01", "2026-06-01"]', 99.00),
	('c15a1f7c-d62f-4d37-a257-14e468c26913', '3 Installments', 'Pay in 3 installments for student accommodation', 3, 0.00, 0.00, 0.00, true, '2025-08-06 12:38:20.612722+00', false, 7, '["2025-08-16", "2026-01-01", "2026-04-01"]', 98.61),
	('dbc315cc-54ea-477b-b0d4-f35063fe7a6a', '4 Installments', 'Pay in 4 installments for student accommodation', 4, 0.00, 0.00, 0.00, true, '2025-08-06 12:38:21.054856+00', false, 7, '["2025-08-16", "2025-11-01", "2026-02-01", "2026-05-01"]', 99.00);


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."students" ("id", "user_id", "birthday", "ethnicity", "gender", "ucas_id", "country", "address_line1", "post_code", "town", "academic_year", "year_of_study", "field_of_study", "guarantor_name", "guarantor_email", "guarantor_phone", "guarantor_relationship", "wants_installments", "installment_plan_id", "deposit_paid", "passport_file_url", "visa_file_url", "utility_bill_file_url", "guarantor_id_file_url", "bank_statement_file_url", "proof_of_income_file_url", "student_id", "university", "course", "emergency_contact_name", "emergency_contact_phone", "created_at", "updated_at", "studio_id", "first_name", "last_name", "email", "phone", "total_amount", "check_in_date", "duration_name", "duration_type") VALUES
	('4492ddcf-8db6-4b4a-b859-5cdbc5228b24', NULL, '2022-08-11', 'mixed', 'prefer_not_to_say', 'tytfytfytfytft', 'Argentina', 'hghhghghghghg', 'hjjhhjhjh', 'malindi', '2025/2026', '2nd', 'reggergerger', 'marvin adu', 'iankatana53@gmail.com', '0712345678', 'other', true, '30125fcb-5273-4f65-964f-4d6f189eac48', true, 'https://vwgczfdedacpymnxzxcp.supabase.co/storage/v1/object/public/student-documents/4492ddcf-8db6-4b4a-b859-5cdbc5228b24/passport/cleanseoul.png', 'https://vwgczfdedacpymnxzxcp.supabase.co/storage/v1/object/public/student-documents/4492ddcf-8db6-4b4a-b859-5cdbc5228b24/visa/cleanseoul.png', 'https://vwgczfdedacpymnxzxcp.supabase.co/storage/v1/object/public/student-documents/4492ddcf-8db6-4b4a-b859-5cdbc5228b24/utility_bill/cleanseoul.png', 'https://vwgczfdedacpymnxzxcp.supabase.co/storage/v1/object/public/student-documents/4492ddcf-8db6-4b4a-b859-5cdbc5228b24/guarantor_id/cleanseoul.png', 'https://vwgczfdedacpymnxzxcp.supabase.co/storage/v1/object/public/student-documents/4492ddcf-8db6-4b4a-b859-5cdbc5228b24/bank_statement/cleanseoul.png', 'https://vwgczfdedacpymnxzxcp.supabase.co/storage/v1/object/public/student-documents/4492ddcf-8db6-4b4a-b859-5cdbc5228b24/proof_of_income/cleanseoul.png', NULL, NULL, NULL, NULL, NULL, '2025-09-14 15:22:21.452794+00', '2025-09-15 07:57:45.58768+00', '7b574003-1c93-4818-9100-aa2afd8f5290', 'Marcel', 'Thoya', 'iankatna510@gmail.com', '4452656654', 8160.00, '2025-09-01', '51 Weeks', '1293b566-8c17-4b14-b151-29024525c86f');


--
-- Data for Name: tourist_booking_sources; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."tourist_booking_sources" ("id", "name", "description", "is_active", "created_at") VALUES
	('32bf8cd6-5909-4252-9cff-ee8c77c0554f', 'Direct Booking', 'Direct booking through website or phone', true, '2025-08-05 07:00:52.411877+00'),
	('1f4306ec-795a-4dbc-941a-563d7ed4b2f0', 'Booking.com', 'Booking through Booking.com platform', true, '2025-08-05 07:00:52.411877+00'),
	('c90f9e12-d639-4da1-9f25-033ce043884b', 'Airbnb', 'Booking through Airbnb platform', true, '2025-08-05 07:00:52.411877+00'),
	('505cc023-779c-49c1-89d2-d9d7c124ce95', 'Expedia', 'Booking through Expedia platform', true, '2025-08-05 07:00:52.411877+00'),
	('c8fc4e1e-75df-48f1-8694-80d34bfc233e', 'Travel Agent', 'Booking through travel agent', true, '2025-08-05 07:00:52.411877+00'),
	('f0240e0b-4a32-4e34-acba-d5bf0e437b24', 'Walk-in', 'Walk-in booking', true, '2025-08-05 07:00:52.411877+00'),
	('a3152cc4-8ed9-45fd-9933-1b1d3211c05e', 'Referral', 'Referral from existing guest', true, '2025-08-05 07:00:52.411877+00'),
	('e939c1d6-bf58-48a1-9975-8bf498c59f23', 'Corporate', 'Corporate booking', true, '2025-08-05 07:00:52.411877+00'),
	('86e7e9ca-1151-4452-bf79-0ead7077260d', 'Other', 'Other booking source', true, '2025-08-05 07:00:52.411877+00');


--
-- Data for Name: tourist_guest_statuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."tourist_guest_statuses" ("id", "name", "description", "color", "is_active", "created_at") VALUES
	('b483b532-6d58-48cb-983a-6f04b0f5ab9a', 'Checking In', 'Guest is currently checking in', 'blue', true, '2025-08-05 07:00:52.411877+00'),
	('4649b1db-e153-4ce8-850d-571be475a577', 'Checked In', 'Guest has successfully checked in', 'green', true, '2025-08-05 07:00:52.411877+00'),
	('46270d80-5cc5-4774-9156-80762475813f', 'Checking Out', 'Guest is currently checking out', 'orange', true, '2025-08-05 07:00:52.411877+00'),
	('916ae5b0-35be-4262-99cd-22bbf8c09ca9', 'Checked Out', 'Guest has successfully checked out', 'gray', true, '2025-08-05 07:00:52.411877+00'),
	('b86d73b8-8f2d-4003-878e-71116174869b', 'Upcoming', 'Guest has confirmed booking but not yet arrived', 'purple', true, '2025-08-05 07:00:52.411877+00'),
	('ba537178-a355-4929-8d03-19566dc7fdf3', 'Confirmed', 'Booking is confirmed but guest not yet arrived', 'green', true, '2025-08-05 07:00:52.411877+00'),
	('ca965e5a-9715-4210-9b35-d72e8be1d9b6', 'Pending', 'Booking is pending confirmation', 'yellow', true, '2025-08-05 07:00:52.411877+00'),
	('d2719d53-e095-4562-9584-5f9d2133f48f', 'Cancelled', 'Booking has been cancelled', 'red', true, '2025-08-05 07:00:52.411877+00');


--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: reservation_installments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."invoices" ("id", "invoice_number", "reservation_id", "reservation_installment_id", "amount", "tax_amount", "total_amount", "due_date", "status", "stripe_payment_intent_id", "created_by", "created_at", "updated_at", "xero_invoice_id", "xero_exported_at", "xero_export_status", "student_id") VALUES
	('5b1cf1a4-da0d-4707-840c-1fe30976d9d4', 'INV-2025-0001', NULL, NULL, 99.00, 0.00, 99.00, '2025-09-14', 'completed', NULL, '423b2f89-ed35-4537-866e-d4fe702e577c', '2025-09-14 15:22:28.207663+00', '2025-09-14 15:22:28.207663+00', NULL, NULL, 'pending', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24'),
	('c1194fc4-903c-4256-b94b-70a52fc1169f', 'INV-2025-0002', NULL, NULL, 807.00, 0.00, 807.00, '2025-08-16', 'pending', NULL, '423b2f89-ed35-4537-866e-d4fe702e577c', '2025-09-14 15:22:28.367241+00', '2025-09-14 15:22:28.367241+00', NULL, NULL, 'pending', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24'),
	('27367462-a33b-47db-9cd4-8573219763ef', 'INV-2025-0003', NULL, NULL, 807.00, 0.00, 807.00, '2025-10-01', 'pending', NULL, '423b2f89-ed35-4537-866e-d4fe702e577c', '2025-09-14 15:22:28.421991+00', '2025-09-14 15:22:28.421991+00', NULL, NULL, 'pending', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24'),
	('7644bbf0-8add-46b0-a309-85e26339eb89', 'INV-2025-0004', NULL, NULL, 807.00, 0.00, 807.00, '2025-11-01', 'pending', NULL, '423b2f89-ed35-4537-866e-d4fe702e577c', '2025-09-14 15:22:28.47126+00', '2025-09-14 15:22:28.47126+00', NULL, NULL, 'pending', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24'),
	('657c7d7a-84c9-4ca8-861b-6cd85a8c9073', 'INV-2025-0005', NULL, NULL, 807.00, 0.00, 807.00, '2025-12-01', 'pending', NULL, '423b2f89-ed35-4537-866e-d4fe702e577c', '2025-09-14 15:22:28.541208+00', '2025-09-14 15:22:28.541208+00', NULL, NULL, 'pending', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24'),
	('ecc87572-0205-4dac-8243-580e4af94d24', 'INV-2025-0011', NULL, NULL, 798.00, 0.00, 798.00, '2026-06-01', 'pending', NULL, '423b2f89-ed35-4537-866e-d4fe702e577c', '2025-09-14 15:22:28.829904+00', '2025-09-14 15:22:28.829904+00', NULL, NULL, 'pending', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24'),
	('5aee9491-3391-4906-bcbd-f78edc0ed389', 'INV-2025-0010', NULL, NULL, 807.00, 0.00, 807.00, '2026-05-01', 'completed', 'pi_3S7HlpIwhoZJMJiy1MTfUPpg', '423b2f89-ed35-4537-866e-d4fe702e577c', '2025-09-14 15:22:28.763143+00', '2025-09-14 15:23:20.745938+00', NULL, NULL, 'pending', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24'),
	('e20ab692-f861-4762-8652-5eac5493abff', 'INV-2025-0009', NULL, NULL, 807.00, 0.00, 807.00, '2026-04-01', 'completed', 'pi_3S7HzKIwhoZJMJiy0CBBKsh7', '423b2f89-ed35-4537-866e-d4fe702e577c', '2025-09-14 15:22:28.723679+00', '2025-09-14 15:37:17.026423+00', NULL, NULL, 'pending', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24'),
	('65c6ea02-011a-48b9-b9c5-6b150781a812', 'INV-2025-0008', NULL, NULL, 807.00, 0.00, 807.00, '2026-03-01', 'completed', 'pi_3S7HzrIwhoZJMJiy1cYHq3ch', '423b2f89-ed35-4537-866e-d4fe702e577c', '2025-09-14 15:22:28.672337+00', '2025-09-14 15:37:51.127834+00', NULL, NULL, 'pending', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24'),
	('15c0ca0a-4969-448d-880e-9e53a4afb845', 'INV-2025-0007', NULL, NULL, 807.00, 0.00, 807.00, '2026-02-01', 'completed', 'pi_3S7W7AIwhoZJMJiy1DuYsfdn', '423b2f89-ed35-4537-866e-d4fe702e577c', '2025-09-14 15:22:28.624878+00', '2025-09-15 06:42:18.283575+00', NULL, NULL, 'pending', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24'),
	('b69e7bae-5780-4a1a-b226-30aa9160773a', 'INV-2025-0006', NULL, NULL, 807.00, 0.00, 807.00, '2026-01-01', 'completed', 'pi_3S7XkvIwhoZJMJiy0s5UPwJh', '423b2f89-ed35-4537-866e-d4fe702e577c', '2025-09-14 15:22:28.577477+00', '2025-09-15 08:27:26.977026+00', NULL, NULL, 'pending', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24');


--
-- Data for Name: lead_sources; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."lead_sources" ("id", "name", "description", "is_active", "created_at") VALUES
	('261dd3da-9b45-485a-b1b7-0fe96379ddee', 'Website', 'Direct website inquiries', true, '2025-08-02 20:59:28.423587+00'),
	('85f84c72-0ccf-4ebf-a4eb-c2da79cd56bb', 'Social Media', 'Social media platforms', true, '2025-08-02 20:59:28.423587+00'),
	('81c4c1ee-b03e-47a3-bd9f-69ec4e1020e2', 'Referral', 'Word of mouth referrals', true, '2025-08-02 20:59:28.423587+00'),
	('7d279bd6-1607-4edb-8e6b-0dd65691f912', 'University Partnership', 'University partnerships', true, '2025-08-02 20:59:28.423587+00'),
	('9ce01ca7-e923-4fa9-bc5d-1e700341b161', 'Online Listing', 'Online property listings', true, '2025-08-02 20:59:28.423587+00'),
	('81ab62bb-6be6-48b5-b758-b185ab774c31', 'Print Media', 'Newspaper and magazine ads', true, '2025-08-03 07:08:45.664695+00'),
	('ea0b210b-917f-481c-9f6b-1e4f03ffea75', 'Online Advertising', 'Google Ads and other online ads', true, '2025-08-03 07:08:45.664695+00'),
	('624c3055-45fe-4d72-8350-a1179dc55a99', 'Events', 'University fairs and events', true, '2025-08-03 07:08:45.664695+00');


--
-- Data for Name: leads; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."leads" ("id", "first_name", "last_name", "email", "phone", "source_id", "status", "budget", "move_in_date", "duration_months", "notes", "assigned_to", "created_by", "created_at", "updated_at") VALUES
	('b1bbf72d-a229-4492-a1e8-9fdb8fffcd1d', 'Theo', '', 'iankatana514789@gmail.com', '65419592929852', '9ce01ca7-e923-4fa9-bc5d-1e700341b161', 'new', 100.00, NULL, NULL, 'dtytyttytfyfy', '423b2f89-ed35-4537-866e-d4fe702e577c', '423b2f89-ed35-4537-866e-d4fe702e577c', '2025-09-12 12:56:42.198054+00', '2025-09-12 12:56:42.198054+00');


--
-- Data for Name: lead_follow_ups; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: lead_option_fields; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."lead_option_fields" ("id", "field_name", "field_type", "field_label", "is_required", "options", "is_active", "created_at") VALUES
	('c20e0d49-fda7-449d-bf8f-bb4582143c33', 'first_name', 'text', 'First Name', true, NULL, true, '2025-08-03 07:08:45.664695+00'),
	('361c943d-2cb1-4880-acbd-744ed6a7736f', 'last_name', 'text', 'Last Name', true, NULL, true, '2025-08-03 07:08:45.664695+00'),
	('5f56c593-bcfc-43dd-8995-8ed155568f5c', 'email', 'email', 'Email Address', false, NULL, true, '2025-08-03 07:08:45.664695+00'),
	('f3bdbf3e-1f22-428e-be31-aeb7d2889910', 'phone', 'phone', 'Phone Number', false, NULL, true, '2025-08-03 07:08:45.664695+00'),
	('f5c641e7-2f77-411d-9ef9-2e9a6ade5c5f', 'source', 'select', 'Lead Source', true, NULL, true, '2025-08-03 07:08:45.664695+00'),
	('cb299c23-719d-47b6-bde1-0ec660658a96', 'budget', 'number', 'Budget Range', false, NULL, true, '2025-08-03 07:08:45.664695+00'),
	('03e454ef-ef00-4bc6-88fb-dbca1d006535', 'move_in_date', 'date', 'Preferred Move-in Date', false, NULL, true, '2025-08-03 07:08:45.664695+00'),
	('18ec1d62-e6ab-4366-88fc-e6b52ffc2ecd', 'duration_months', 'number', 'Duration (months)', false, NULL, true, '2025-08-03 07:08:45.664695+00'),
	('931331b3-378e-420a-a6ae-723806526bf4', 'notes', 'textarea', 'Additional Notes', false, NULL, true, '2025-08-03 07:08:45.664695+00'),
	('06363f2b-4329-4311-9911-17760ca4923a', 'assigned_to', 'select', 'Assigned To', false, NULL, true, '2025-08-03 07:08:45.664695+00'),
	('76740d5d-013e-4b5a-a774-3fd585e7037a', 'duration', 'select', 'Desired Duration', true, '{45-weeks,51-weeks,Daily,Weekly}', true, '2025-08-04 12:27:01.62882+00'),
	('46f7a531-1f80-4ad5-93d2-79904cbae7a9', 'response_category', 'select', 'Response Category', false, '{Hot,Warm,Cold}', true, '2025-08-04 12:27:01.62882+00'),
	('6560fb93-679e-4daf-862e-73f15b301235', 'follow_up_stage', 'select', 'Follow-up Stage', false, '{"Initial Contact","Information Sent","Proposal Sent","Follow-up Needed",Negotiating}', true, '2025-08-04 12:27:01.62882+00'),
	('586ddbaf-93c7-4d9a-8f75-6ef486e321e9', 'room_grade', 'select', 'Desired Room Grade', true, '{Silver,Gold,Platinum,Rhodium,"Rhodium Plus"}', true, '2025-08-04 12:27:01.62882+00'),
	('cc0859f2-f3be-4757-beb4-a28847fa04fd', 'room_grade', 'select', 'Desired Room Grade', true, '{Silver,Gold,Platinum,Rhodium,"Thodium Plus"}', true, '2025-08-04 20:23:54.307943+00'),
	('8f42ef64-f702-4b24-b1f0-5e1a14c528e4', 'duration', 'select', 'Desired Duration', true, '{45-weeks,51-weeks,Daily,Weekly}', true, '2025-08-04 20:23:54.307943+00'),
	('84b13d11-4a2f-45b4-af98-2e436d5375b3', 'response_category', 'select', 'Response Category', false, '{Hot,Warm,Cold}', true, '2025-08-04 20:23:54.307943+00'),
	('452b7d3f-ad4a-49b6-85b7-e5b6b3e03c8e', 'follow_up_stage', 'select', 'Follow-up Stage', false, '{"Initial Contact","Information Sent","Proposal Sent","Follow-up Needed",Negotiating}', true, '2025-08-04 20:23:54.307943+00');


--
-- Data for Name: module_access_config; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."module_access_config" ("id", "role_name", "module_name", "is_enabled", "created_at", "updated_at") VALUES
	('dd07dd08-db63-42b3-92a5-7dc1224e6457', 'super_admin', 'leads', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('44242e84-6622-4cff-9f59-4eceff83b769', 'super_admin', 'ota-bookings', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('610731a6-e0be-4b0e-b236-3de3fbe4e0e3', 'super_admin', 'students', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('384d9265-c582-421f-9526-c229e25bbe64', 'super_admin', 'studios', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('7059024e-6ad7-4132-ab83-6a4a617cd4d2', 'super_admin', 'cleaning', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('b9e2c02f-8c23-4b03-acdb-f75e1f4f0e2d', 'super_admin', 'finance', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('4a912a5b-c99b-4c29-8ead-1c9c874f44e5', 'super_admin', 'data', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('43cb1657-5dee-419c-8257-8810f976c039', 'super_admin', 'settings', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('bc7bb5af-8578-4891-a84d-164f00a7e5ec', 'super_admin', 'web-access', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('2ec1ef9c-dbbf-4980-a420-6c03c4d60701', 'super_admin', 'branding', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('29ed2e72-a7e6-44aa-9f5a-fef5a3523c0d', 'super_admin', 'student-portal', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('c60134fd-8638-48f0-8fb2-6a0711f24d43', 'admin', 'leads', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('f99cd0d3-03a2-4818-ade5-a9a486cfbb60', 'admin', 'ota-bookings', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('2f659723-9832-4e05-8daa-ba675e81b015', 'admin', 'students', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('52b4ff27-4841-407b-a6bd-c190b26a5d33', 'admin', 'studios', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('723cb039-9ccd-4b2f-bc05-a9affc7a2ebf', 'admin', 'cleaning', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('ebad3669-2943-4d0d-a6bc-79a868f56c50', 'admin', 'finance', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('1705340c-517f-4c66-ae86-10701714fb55', 'admin', 'data', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('7d0eaa9d-ba58-4c50-825a-3a686782e6e2', 'admin', 'settings', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('e70cb2dc-d545-4875-8745-bba5d9a85533', 'admin', 'web-access', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('36b44687-5c71-4acb-a4bb-c19c48331983', 'admin', 'branding', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('3250a0cc-b314-44f2-88a1-1a269d8b3eec', 'admin', 'student-portal', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('2504f9ba-50a3-44c7-95ca-f6c895070c99', 'salesperson', 'leads', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('3ee581d4-ed18-4250-b87e-a39cd977cdf2', 'salesperson', 'students', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('73550654-ff8a-4253-b8a6-4a4972563c90', 'salesperson', 'studios', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('0f4bdc26-6f0f-49af-8dc1-91633d220e28', 'reservationist', 'ota-bookings', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('2a0c119a-0c1e-4718-afc1-427025674b27', 'reservationist', 'students', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('577cf012-aa5a-47cd-b9d2-d7a4b063fb2a', 'reservationist', 'studios', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('fbad7481-79bf-40cd-a2b9-6580c094a1e4', 'accountant', 'finance', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('89450b26-0203-4035-ac6b-3a5f7a1aa9a4', 'accountant', 'students', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('59537f5b-b905-42c7-9532-4def72ea9468', 'operations_manager', 'leads', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('9da016ab-16c7-4dc1-b60c-c8475997d1b2', 'operations_manager', 'ota-bookings', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('dc52fe9e-e451-4d8e-a7b1-fbc1e8d878be', 'operations_manager', 'students', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('d7eb79b7-4356-4c83-8800-6a7c09b79065', 'operations_manager', 'studios', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('1237ba9a-8048-457b-83d9-7c0d9ccbf83b', 'operations_manager', 'cleaning', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('52e99777-48d9-4e99-b35f-343024f7c6c5', 'operations_manager', 'data', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('71630d55-9bb8-49be-be6f-058632fe328e', 'operations_manager', 'settings', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('484cbd7c-d879-49fb-bcdf-60d04a42066d', 'operations_manager', 'web-access', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('0ae717d1-a6b8-4ef3-97ff-46e092d4b96d', 'operations_manager', 'branding', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('060e0f5a-0e15-4834-ab27-9aed569cb2cd', 'operations_manager', 'student-portal', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('6699aaf6-a0be-4bd6-96fa-4554f730d6bd', 'cleaner', 'cleaning', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('2e2e572c-f9a0-4177-aad0-775d3ad0c898', 'cleaner', 'studios', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('790de17b-ba88-490f-9988-cab8f099638f', 'student', 'student-portal', true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('55f5b92d-c0db-4a82-9eaf-7cb4bd8c78b6', 'super_admin', 'comms-marketing', true, '2025-09-15 08:48:58.459518+00', '2025-09-15 08:48:58.459518+00'),
	('4a14557a-c65d-4598-934f-3b8f196dcb58', 'admin', 'comms-marketing', true, '2025-09-15 08:48:58.78192+00', '2025-09-15 08:48:58.78192+00'),
	('a4d5b266-ccf6-468c-ab50-e937faee1b39', 'operations_manager', 'comms-marketing', true, '2025-09-15 08:48:59.084761+00', '2025-09-15 08:48:59.084761+00'),
	('d7b0df88-19bd-45a5-88de-075801f2da36', 'salesperson', 'comms-marketing', true, '2025-09-15 08:48:59.389102+00', '2025-09-15 08:48:59.389102+00'),
	('9aaf650e-353b-48d6-8e4d-757e03353f22', 'reservationist', 'comms-marketing', true, '2025-09-15 08:48:59.675392+00', '2025-09-15 08:48:59.675392+00'),
	('0b84b5d2-cd93-4a0e-b7d6-8c4e7eeb1c8a', 'accountant', 'comms-marketing', true, '2025-09-15 08:48:59.955775+00', '2025-09-15 08:48:59.955775+00');


--
-- Data for Name: module_styles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."module_styles" ("id", "module_name", "gradient_start", "gradient_end", "is_active", "created_at", "section_name", "settings", "updated_at") VALUES
	('1b8acc11-0b67-4404-bc6d-724536a2de12', 'students', '#4facfe', '#00f2fe', true, '2025-08-02 20:59:28.423587+00', NULL, NULL, '2025-08-10 05:50:07.6032+00'),
	('5c485b4f-4fd5-4cc2-a5eb-1b017c4f9060', 'cleaning', '#43e97b', '#38f9d7', true, '2025-08-02 20:59:28.423587+00', NULL, NULL, '2025-08-10 05:50:07.6032+00'),
	('6ac89bd3-9e50-46fa-8df4-d9f1614a5b63', 'settings', '#ff9500', '#e6b400', true, '2025-08-02 20:59:28.423587+00', NULL, NULL, '2025-08-10 05:50:07.6032+00'),
	('634a4839-a25d-46fb-99dc-5ebc9a86957e', 'branding', '#ff29b0', '#7c3aed', true, '2025-08-08 19:23:51.679865+00', NULL, NULL, '2025-08-10 05:50:07.6032+00'),
	('19e48115-49ab-4726-bd3f-f8f87659b94c', 'finance', '#ff004c', '#fee140', true, '2025-08-02 20:59:28.423587+00', NULL, NULL, '2025-08-10 05:50:07.6032+00'),
	('8e7bb687-4ee1-4836-9a04-4e497d6bc8e4', 'leads', '#475ec2', '#764ba2', true, '2025-08-02 20:59:28.423587+00', NULL, NULL, '2025-08-10 05:50:07.6032+00'),
	('2e16214d-aa82-477c-9a63-634d9a0551cd', 'student-portal', '#6366f1', '#8b5cf6', true, '2025-08-10 13:22:27.032593+00', NULL, NULL, '2025-08-10 13:22:27.032593+00'),
	('f67b3657-e3b3-40fd-a31d-343f7af6e37e', 'comms-marketing', '#06b6d4', '#0891b2', true, '2025-09-15 09:21:14.153543+00', NULL, NULL, '2025-09-15 09:21:14.153543+00'),
	('fa88579b-0738-416e-9ff9-6b8dbf26cb9d', 'ota-bookings', '#f59e0b', '#d97706', true, '2025-09-15 09:31:42.67077+00', NULL, NULL, '2025-09-15 09:31:42.67077+00'),
	('8dc3cd26-3fa8-4f9c-9896-f47a3b62c339', 'data', '#8b5cf6', '#7c3aed', true, '2025-09-15 09:31:42.811075+00', NULL, NULL, '2025-09-15 09:31:42.811075+00'),
	('960cd6b7-369b-48a4-b90d-6dbc387f4941', 'studios', '#10b981', '#059669', true, '2025-09-15 09:31:42.941166+00', NULL, NULL, '2025-09-15 09:31:42.941166+00'),
	('cd41091a-1ecf-42bc-a29f-8a5106a559d3', 'web-access', '#06b6d4', '#0891b2', true, '2025-09-15 09:31:43.071937+00', NULL, NULL, '2025-09-15 09:31:43.071937+00');


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."payments" ("id", "invoice_id", "amount", "method", "status", "stripe_payment_intent_id", "transaction_id", "processed_at", "created_by", "created_at", "xero_payment_id", "xero_exported_at", "xero_export_status", "approval_status", "approved_by", "approved_at", "rejection_reason", "notes") VALUES
	('b1422543-5ae1-4e4e-8a42-60fb0853445e', '5aee9491-3391-4906-bcbd-f78edc0ed389', 807.00, 'stripe', 'completed', 'pi_3S7HlpIwhoZJMJiy1MTfUPpg', NULL, NULL, '423b2f89-ed35-4537-866e-d4fe702e577c', '2025-09-14 15:23:19.391+00', NULL, NULL, 'pending', 'approved', NULL, NULL, NULL, NULL),
	('ffd76502-8e40-4f4e-a35d-768642f3a651', 'e20ab692-f861-4762-8652-5eac5493abff', 807.00, 'stripe', 'completed', 'pi_3S7HzKIwhoZJMJiy0CBBKsh7', NULL, NULL, '423b2f89-ed35-4537-866e-d4fe702e577c', '2025-09-14 15:37:16.095+00', NULL, NULL, 'pending', 'approved', NULL, NULL, NULL, NULL),
	('179e0ce2-eb2d-4756-b7b1-a8551dfa6794', '65c6ea02-011a-48b9-b9c5-6b150781a812', 807.00, 'stripe', 'completed', 'pi_3S7HzrIwhoZJMJiy1cYHq3ch', NULL, NULL, '423b2f89-ed35-4537-866e-d4fe702e577c', '2025-09-14 15:37:49.206+00', NULL, NULL, 'pending', 'approved', NULL, NULL, NULL, NULL),
	('920f5b2a-022b-4502-a516-7629377987a9', '15c0ca0a-4969-448d-880e-9e53a4afb845', 807.00, 'stripe', 'completed', 'pi_3S7W7AIwhoZJMJiy1DuYsfdn', NULL, NULL, '423b2f89-ed35-4537-866e-d4fe702e577c', '2025-09-15 06:42:17.895+00', NULL, NULL, 'pending', 'approved', NULL, NULL, NULL, NULL),
	('a225bcee-2824-4ec7-8e81-47b8b9a7b1ab', 'b69e7bae-5780-4a1a-b226-30aa9160773a', 807.00, 'stripe', 'completed', 'pi_3S7XkvIwhoZJMJiy0s5UPwJh', NULL, NULL, '423b2f89-ed35-4537-866e-d4fe702e577c', '2025-09-15 08:27:26.411+00', NULL, NULL, 'pending', 'approved', NULL, NULL, NULL, NULL);


--
-- Data for Name: pricing_matrix; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: refund_reasons; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."refund_reasons" ("id", "name", "description", "is_active", "created_at") VALUES
	('7d163c86-25c4-437e-8264-25c2c36b5dd0', 'Guest Cancellation', 'Guest cancelled the reservation', true, '2025-08-05 10:23:54.52919+00'),
	('8323bdaa-f6cc-4cce-b11e-04fb3276c8d3', 'Property Issue', 'Property was not available or had issues', true, '2025-08-05 10:23:54.52919+00'),
	('7e1c3f4f-91c1-49f7-803d-3e8b746b5ebc', 'Booking Error', 'Error in the booking process', true, '2025-08-05 10:23:54.52919+00'),
	('3c92b6f4-cd94-4c2c-8490-dd795353fb41', 'Guest No-Show', 'Guest did not arrive', true, '2025-08-05 10:23:54.52919+00'),
	('add2fb12-8ccb-4818-a31c-81898978e73e', 'Early Checkout', 'Guest checked out early', true, '2025-08-05 10:23:54.52919+00'),
	('01cefeb7-c157-491f-9168-9867140b9cd7', 'Service Issue', 'Service quality issues', true, '2025-08-05 10:23:54.52919+00'),
	('54229c99-82c7-4bbb-af53-b25799e31de2', 'Other', 'Other reasons', true, '2025-08-05 10:23:54.52919+00');


--
-- Data for Name: refunds; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."role_permissions" ("id", "role_name", "module_name", "page_path", "can_access", "can_create", "can_read", "can_update", "can_delete", "created_at", "updated_at") VALUES
	('ad04266a-c9e8-45a6-ac87-0144b636df09', 'super_admin', 'leads', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('0678313c-59ff-4021-9a62-018ac4c14e35', 'super_admin', 'ota-bookings', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('91c911ab-7989-4c53-8680-5952c42b9eeb', 'super_admin', 'students', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('e259b0ef-afad-47cf-9023-0df7b93e00c6', 'super_admin', 'studios', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('d2d9932e-e083-48ff-9879-1273d8f81e68', 'super_admin', 'cleaning', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('fa65094d-23cc-440b-bcf1-155b2a7043dc', 'super_admin', 'finance', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('6e8cf197-6ff3-4c87-bfc3-c829275b695e', 'super_admin', 'data', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('96ddf353-2788-4d81-a0ae-e247f4705fa6', 'super_admin', 'settings', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('ab0b29c2-5a2c-4c73-ab87-b156f8889aee', 'super_admin', 'web-access', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('b53eefef-186a-453e-9bc8-1916f4015ad8', 'super_admin', 'branding', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('3aec8272-f800-442c-8dbd-2c39b146af04', 'super_admin', 'student-portal', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('93d68286-20ec-4764-bc4d-cab8bf1ef5d7', 'admin', 'leads', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('b1611b98-49d8-4810-a4f5-94a485283483', 'admin', 'ota-bookings', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('aef73376-d6f2-41e9-9646-01315cc90d25', 'admin', 'students', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('f6b44233-237c-49dc-a287-0744a2e1a1da', 'admin', 'studios', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('7a342b5c-bece-48ab-93f6-652c0695fc79', 'admin', 'cleaning', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('adbfffde-bb02-46ae-9ec8-3b1fee97b3b0', 'admin', 'finance', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('a5a27296-dad8-4930-8c54-be069556b017', 'admin', 'data', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('ee7d7de7-529f-495c-8641-b6ad43812474', 'admin', 'settings', '*', true, true, true, true, false, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('7541cf7a-c3e9-4115-a14b-af3956b4e613', 'admin', 'web-access', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('b8793dff-df4f-4773-875d-10deed37a10e', 'admin', 'branding', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('0a8eec75-d14b-4f03-ab95-edc46bd97886', 'admin', 'student-portal', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('b65cc24f-62af-4718-9fbe-9931be8b98a4', 'salesperson', 'leads', '*', true, true, true, true, false, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('687f7168-8605-455e-ba1f-3a8c39dda71b', 'salesperson', 'students', '*', true, true, true, true, false, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('af132f54-1d3a-47ab-a931-a32e6f640df9', 'salesperson', 'studios', '*', true, false, true, false, false, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('5590daae-1d7d-44dc-b5be-d4608621ce1e', 'reservationist', 'ota-bookings', '*', true, true, true, true, false, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('d4f5d347-ec4c-4e40-98d7-5cc590cad28b', 'reservationist', 'students', '*', true, true, true, true, false, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('88ad5704-6ea9-4642-9d72-01d2bab4052c', 'reservationist', 'studios', '*', true, false, true, false, false, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('6025651b-0fa4-4a90-9dbf-745638bb56aa', 'accountant', 'finance', '*', true, true, true, true, false, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('3c80e06c-b93c-41e1-97f8-3fe1040b0c94', 'accountant', 'students', '*', true, false, true, false, false, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('8a1fc72e-de25-499b-8374-3fc78bf70585', 'operations_manager', 'leads', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('05ec0a80-28de-4156-b72f-6f47d52aeb5a', 'operations_manager', 'ota-bookings', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('807e08fd-5db0-4115-862e-f5f11ed013c2', 'operations_manager', 'students', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('bb9c0443-a283-4776-94a9-42ef17e9b65c', 'operations_manager', 'studios', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('ca974e65-ff65-416d-bd4b-cf446a7f2df5', 'operations_manager', 'cleaning', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('918bd3da-4e4b-47a7-a63f-41dec8828d5a', 'operations_manager', 'data', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('e1a9c70c-7a0b-49ad-bdb9-50daf66d933f', 'operations_manager', 'settings', '*', true, true, true, true, false, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('61d9d5ef-b2dc-457b-b2d5-9201ba9e0095', 'operations_manager', 'web-access', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('749c918b-c2a7-4021-9701-133fcb745873', 'operations_manager', 'branding', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('199d7460-12e2-4241-b6e5-52cd85259011', 'operations_manager', 'student-portal', '*', true, true, true, true, true, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('a67c51e7-6aa8-43c4-bf76-806ceede8cb1', 'cleaner', 'cleaning', '*', true, true, true, true, false, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('8afd5f57-93fd-46d3-8965-cf76f1ff6f29', 'cleaner', 'studios', '*', true, false, true, false, false, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('4cda2c06-4880-49a8-8529-155076c3c7ae', 'student', 'student-portal', '*', true, false, true, false, false, '2025-08-10 06:58:53.680285+00', '2025-08-10 06:58:53.680285+00'),
	('6f90b75d-596a-44b6-89ce-f0a1d662bf52', 'super_admin', 'comms-marketing', '*', true, true, true, true, true, '2025-09-15 08:48:58.626153+00', '2025-09-15 08:48:58.626153+00'),
	('c1833ede-7247-4840-aa61-8ac6a2f93893', 'admin', 'comms-marketing', '*', true, true, true, true, true, '2025-09-15 08:48:58.934583+00', '2025-09-15 08:48:58.934583+00'),
	('0755ba86-5e9f-4c29-ba27-b3d45640b181', 'operations_manager', 'comms-marketing', '*', true, true, true, true, true, '2025-09-15 08:48:59.243825+00', '2025-09-15 08:48:59.243825+00'),
	('a6afe67f-54fe-4bbe-bca3-c5c2beec4438', 'salesperson', 'comms-marketing', '*', true, true, true, true, true, '2025-09-15 08:48:59.537461+00', '2025-09-15 08:48:59.537461+00'),
	('895f0c9f-9baa-48fe-82e5-5847f879965b', 'reservationist', 'comms-marketing', '*', true, true, true, true, true, '2025-09-15 08:48:59.812302+00', '2025-09-15 08:48:59.812302+00'),
	('0d440c8f-f3fb-4713-9140-260120525443', 'accountant', 'comms-marketing', '*', true, true, true, true, true, '2025-09-15 08:49:00.110549+00', '2025-09-15 08:49:00.110549+00');


--
-- Data for Name: staff_agreements; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."staff_agreements" ("id", "title", "description", "document_url", "agreement_type", "is_active", "due_date", "uploaded_by", "created_at", "updated_at") VALUES
	('c788378e-8a07-482f-873f-f89213c6ec68', 'Accommodation Agreement', 'Standard accommodation agreement for all students', 'https://example.com/agreements/accommodation.pdf', 'accommodation', true, '2025-09-12 13:15:59.017873+00', NULL, '2025-08-13 13:15:59.017873+00', '2025-08-13 13:15:59.017873+00'),
	('d7b57cee-7927-44a1-9d27-3dd812e8b722', 'House Rules Agreement', 'Rules and regulations for living in the accommodation', 'https://example.com/agreements/house-rules.pdf', 'house_rules', true, '2025-08-20 13:15:59.017873+00', NULL, '2025-08-13 13:15:59.017873+00', '2025-08-13 13:15:59.017873+00'),
	('64bc8351-8c43-454c-872a-7549d7db5816', 'Payment Plan Agreement', 'Agreement for installment payment plan', 'https://example.com/agreements/payment-plan.pdf', 'payment', true, '2025-08-27 13:15:59.017873+00', NULL, '2025-08-13 13:15:59.017873+00', '2025-08-13 13:15:59.017873+00');


--
-- Data for Name: student_agreements; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: student_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."student_documents" ("id", "student_id", "document_type", "file_url", "file_name", "file_size", "mime_type", "uploaded_at", "created_at") VALUES
	('664e30d1-2be7-405b-a8f6-43612016fad6', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24', 'passport', 'https://vwgczfdedacpymnxzxcp.supabase.co/storage/v1/object/public/student-documents/4492ddcf-8db6-4b4a-b859-5cdbc5228b24/passport/cleanseoul.png', 'cleanseoul.png', 22223, 'image/png', '2025-09-14 15:22:22.557+00', '2025-09-14 15:22:23.207014+00'),
	('e5003d73-5721-4b6e-9c48-2add1d51ce83', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24', 'visa', 'https://vwgczfdedacpymnxzxcp.supabase.co/storage/v1/object/public/student-documents/4492ddcf-8db6-4b4a-b859-5cdbc5228b24/visa/cleanseoul.png', 'cleanseoul.png', 22223, 'image/png', '2025-09-14 15:22:23.239+00', '2025-09-14 15:22:23.563123+00'),
	('ca5bc2a6-a50c-4135-97c1-867ea0e268ca', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24', 'utility_bill', 'https://vwgczfdedacpymnxzxcp.supabase.co/storage/v1/object/public/student-documents/4492ddcf-8db6-4b4a-b859-5cdbc5228b24/utility_bill/cleanseoul.png', 'cleanseoul.png', 22223, 'image/png', '2025-09-14 15:22:23.879+00', '2025-09-14 15:22:24.198848+00'),
	('98d13ad1-392e-440b-8e3c-c48500467a13', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24', 'guarantor_id', 'https://vwgczfdedacpymnxzxcp.supabase.co/storage/v1/object/public/student-documents/4492ddcf-8db6-4b4a-b859-5cdbc5228b24/guarantor_id/cleanseoul.png', 'cleanseoul.png', 22223, 'image/png', '2025-09-14 15:22:24.46+00', '2025-09-14 15:22:24.779732+00'),
	('d3c63e32-69c1-43ff-bb09-623639d43cb8', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24', 'bank_statement', 'https://vwgczfdedacpymnxzxcp.supabase.co/storage/v1/object/public/student-documents/4492ddcf-8db6-4b4a-b859-5cdbc5228b24/bank_statement/cleanseoul.png', 'cleanseoul.png', 22223, 'image/png', '2025-09-14 15:22:25.071+00', '2025-09-14 15:22:25.36907+00'),
	('93c95e40-a511-4a3c-b2e6-d808572c2549', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24', 'proof_of_income', 'https://vwgczfdedacpymnxzxcp.supabase.co/storage/v1/object/public/student-documents/4492ddcf-8db6-4b4a-b859-5cdbc5228b24/proof_of_income/cleanseoul.png', 'cleanseoul.png', 22223, 'image/png', '2025-09-14 15:22:25.671+00', '2025-09-14 15:22:25.954911+00');


--
-- Data for Name: student_installments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."student_installments" ("id", "student_id", "installment_plan_id", "installment_number", "due_date", "amount", "status", "paid_date", "late_fee_amount", "created_at", "updated_at", "amount_paid", "remaining_amount", "partial_payment_date") VALUES
	('16cf414c-e792-44e8-b016-5d51887f01c1', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24', '30125fcb-5273-4f65-964f-4d6f189eac48', 1, '2025-08-16', 807.00, 'pending', NULL, 0.00, '2025-09-14 15:22:28.118+00', '2025-09-14 15:22:28.286007+00', 0.00, NULL, NULL),
	('92dd3d55-2e78-4220-9afb-679de502deba', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24', '30125fcb-5273-4f65-964f-4d6f189eac48', 2, '2025-10-01', 807.00, 'pending', NULL, 0.00, '2025-09-14 15:22:28.118+00', '2025-09-14 15:22:28.286007+00', 0.00, NULL, NULL),
	('5ebebe49-630f-41e3-871e-c5a017035fe0', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24', '30125fcb-5273-4f65-964f-4d6f189eac48', 3, '2025-11-01', 807.00, 'pending', NULL, 0.00, '2025-09-14 15:22:28.118+00', '2025-09-14 15:22:28.286007+00', 0.00, NULL, NULL),
	('01f89364-8a18-4f2b-a078-09a506a63085', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24', '30125fcb-5273-4f65-964f-4d6f189eac48', 4, '2025-12-01', 807.00, 'pending', NULL, 0.00, '2025-09-14 15:22:28.118+00', '2025-09-14 15:22:28.286007+00', 0.00, NULL, NULL),
	('035a7e4e-afec-47d1-a454-3c9a6f0bd5a9', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24', '30125fcb-5273-4f65-964f-4d6f189eac48', 5, '2026-01-01', 807.00, 'pending', NULL, 0.00, '2025-09-14 15:22:28.118+00', '2025-09-14 15:22:28.286007+00', 0.00, NULL, NULL),
	('84307b09-2281-4ed9-8b1c-6753b32e342b', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24', '30125fcb-5273-4f65-964f-4d6f189eac48', 6, '2026-02-01', 807.00, 'pending', NULL, 0.00, '2025-09-14 15:22:28.118+00', '2025-09-14 15:22:28.286007+00', 0.00, NULL, NULL),
	('b0563a40-6cfb-48eb-b205-1606b20a5519', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24', '30125fcb-5273-4f65-964f-4d6f189eac48', 7, '2026-03-01', 807.00, 'pending', NULL, 0.00, '2025-09-14 15:22:28.118+00', '2025-09-14 15:22:28.286007+00', 0.00, NULL, NULL),
	('84ff4262-0431-47b6-8f2b-2cc0e6a42d09', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24', '30125fcb-5273-4f65-964f-4d6f189eac48', 8, '2026-04-01', 807.00, 'pending', NULL, 0.00, '2025-09-14 15:22:28.118+00', '2025-09-14 15:22:28.286007+00', 0.00, NULL, NULL),
	('62cda2bf-6f3f-4cbf-a535-30f3eea8e28e', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24', '30125fcb-5273-4f65-964f-4d6f189eac48', 9, '2026-05-01', 807.00, 'pending', NULL, 0.00, '2025-09-14 15:22:28.118+00', '2025-09-14 15:22:28.286007+00', 0.00, NULL, NULL),
	('8b41b1c9-0376-4d12-b3a7-4ec0739b1697', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24', '30125fcb-5273-4f65-964f-4d6f189eac48', 10, '2026-06-01', 798.00, 'pending', NULL, 0.00, '2025-09-14 15:22:28.118+00', '2025-09-14 15:22:28.286007+00', 0.00, NULL, NULL);


--
-- Data for Name: student_option_fields; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."student_option_fields" ("id", "field_name", "field_type", "field_label", "is_required", "options", "is_active", "created_at") VALUES
	('c6918de5-9c6d-4d9a-9a03-bb2d69973d2b', 'university', 'text', 'University', true, NULL, true, '2025-08-03 07:08:45.664695+00'),
	('4ab8ddd1-6d53-4b1b-93b8-ce0d5f449618', 'course', 'text', 'Course of Study', true, NULL, true, '2025-08-03 07:08:45.664695+00'),
	('d1641385-53fd-4b07-bb63-915c088e749d', 'emergency_contact_name', 'text', 'Emergency Contact Name', true, NULL, true, '2025-08-03 07:08:45.664695+00'),
	('c9d0315d-904c-4bb4-81c4-4d32818f193c', 'emergency_contact_phone', 'phone', 'Emergency Contact Phone', true, NULL, true, '2025-08-03 07:08:45.664695+00'),
	('05c45567-c4e5-4692-80e0-85583bc6e919', 'guarantor_name', 'text', 'Guarantor Name', false, NULL, true, '2025-08-03 07:08:45.664695+00'),
	('aa15cf5c-a50e-4f17-a480-1a7b916ad92b', 'guarantor_phone', 'phone', 'Guarantor Phone', false, NULL, true, '2025-08-03 07:08:45.664695+00'),
	('c0607797-1159-43cb-accd-8c88c0c5b6d3', 'guarantor_email', 'email', 'Guarantor Email', false, NULL, true, '2025-08-03 07:08:45.664695+00'),
	('8821d50d-22c4-4c69-ab8e-4a2b7a307380', 'guarantor_address', 'textarea', 'Guarantor Address', false, NULL, true, '2025-08-03 07:08:45.664695+00'),
	('e0e6f74d-c149-431b-a97a-d160bfe077bc', 'passport_number', 'text', 'Passport Number', false, NULL, true, '2025-08-03 07:08:45.664695+00'),
	('68d396ab-4370-47d7-9bea-144828b1a707', 'nationality', 'text', 'Nationality', false, NULL, true, '2025-08-03 07:08:45.664695+00'),
	('4beeb065-3c57-4581-be25-231ad3e65167', 'country', 'select', 'Country', false, '{Afghanistan,Albania,Algeria,Andorra,Angola,"Antigua and Barbuda",Argentina,Armenia,Australia,Austria,Azerbaijan,Bahamas,Bahrain,Bangladesh,Barbados,Belarus,Belgium,Belize,Benin,Bhutan,Bolivia,"Bosnia and Herzegovina",Botswana,Brazil,Brunei,Bulgaria,"Burkina Faso",Burundi,"Cabo Verde",Cambodia,Cameroon,Canada,"Central African Republic",Chad,Chile,China,Colombia,Comoros,Congo,"Costa Rica",Croatia,Cuba,Cyprus,"Czech Republic","Democratic Republic of the Congo",Denmark,Djibouti,Dominica,"Dominican Republic",Ecuador,Egypt,"El Salvador","Equatorial Guinea",Eritrea,Estonia,Eswatini,Ethiopia,Fiji,Finland,France,Gabon,Gambia,Georgia,Germany,Ghana,Greece,Grenada,Guatemala,Guinea,Guinea-Bissau,Guyana,Haiti,Honduras,Hungary,Iceland,India,Indonesia,Iran,Iraq,Ireland,Israel,Italy,"Ivory Coast",Jamaica,Japan,Jordan,Kazakhstan,Kenya,Kiribati,Kuwait,Kyrgyzstan,Laos,Latvia,Lebanon,Lesotho,Liberia,Libya,Liechtenstein,Lithuania,Luxembourg,Madagascar,Malawi,Malaysia,Maldives,Mali,Malta,"Marshall Islands",Mauritania,Mauritius,Mexico,Micronesia,Moldova,Monaco,Mongolia,Montenegro,Morocco,Mozambique,Myanmar,Namibia,Nauru,Nepal,Netherlands,"New Zealand",Nicaragua,Niger,Nigeria,"North Korea","North Macedonia",Norway,Oman,Pakistan,Palau,Palestine,Panama,"Papua New Guinea",Paraguay,Peru,Philippines,Poland,Portugal,Qatar,Romania,Russia,Rwanda,"Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines",Samoa,"San Marino","Sao Tome and Principe","Saudi Arabia",Senegal,Serbia,Seychelles,"Sierra Leone",Singapore,Slovakia,Slovenia,"Solomon Islands",Somalia,"South Africa","South Korea","South Sudan",Spain,"Sri Lanka",Sudan,Suriname,Sweden,Switzerland,Syria,Taiwan,Tajikistan,Tanzania,Thailand,Timor-Leste,Togo,Tonga,"Trinidad and Tobago",Tunisia,Turkey,Turkmenistan,Tuvalu,Uganda,Ukraine,"United Arab Emirates","United Kingdom","United States",Uruguay,Uzbekistan,Vanuatu,"Vatican City",Venezuela,Vietnam,Yemen,Zambia,Zimbabwe}', true, '2025-08-06 09:46:21.094875+00'),
	('5c1dd5ed-64c9-44ec-839a-6db3eca4f139', 'ethnicity', 'select', 'Ethnicity', false, '{White,"Black / African / Caribbean",Asian,"Hispanic / Latino","Middle Eastern","Native American / Alaska Native","Pacific Islander / Native Hawaiian","Mixed / Multiple Ethnicities",Other,"Prefer Not to Say"}', true, '2025-08-06 09:46:21.408528+00'),
	('f8a5c5d6-f8e1-4752-b261-ecef6713b26f', 'guarantor_relationship', 'select', 'Guarantor Relationship', false, '{Parent,Guardian,Relative,Friend,Employer,Other}', true, '2025-08-03 07:08:45.664695+00'),
	('42f3df9b-2600-4e24-8104-e986ba9b36f1', 'year_of_study', 'select', 'Year of Study', true, '{"First Year","Second Year","Third Year","Fourth Year",Masters,Postgraduate}', true, '2025-08-03 07:08:45.664695+00'),
	('1a439ab5-7f53-4936-86a9-6cd6d2347b58', 'deposit_paid', 'select', 'Deposit Paid', false, '{Paid,Unpaid}', true, '2025-08-06 09:46:22.066017+00'),
	('3a7795d9-ef4f-4bcd-a076-932609f5d7d3', 'gender', 'select', 'Gender', false, '{Male,Female,Non-binary,Other,"Prefer Not to Say"}', true, '2025-08-06 09:46:22.696088+00');


--
-- Data for Name: subscribers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: system_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."system_preferences" ("id", "key", "value", "description", "category", "data_type", "is_public", "created_at", "updated_at") VALUES
	('eba3464d-4d81-46e3-932a-40c26d953a74', 'company_name', 'Student Housing Manager', 'Company name displayed throughout the system', 'general', 'string', false, '2025-08-04 20:24:40.874621+00', '2025-08-04 20:24:40.874621+00'),
	('3af81598-5df6-462c-baf1-119f2f7331ed', 'timezone', 'Europe/London', 'Default timezone for the system', 'localization', 'string', false, '2025-08-04 20:24:40.874621+00', '2025-08-04 20:24:40.874621+00'),
	('ed8d4c9b-a88d-4f65-a91f-a8198e700bbb', 'date_format', 'DD/MM/YYYY', 'Default date format', 'localization', 'string', false, '2025-08-04 20:24:40.874621+00', '2025-08-04 20:24:40.874621+00'),
	('1d0c7df1-9b0d-471e-ac8b-6f7548a64d98', 'currency', 'GBP', 'Default currency for financial operations', 'localization', 'string', false, '2025-08-04 20:24:40.874621+00', '2025-08-04 20:24:40.874621+00'),
	('c63c0db0-829a-463b-a8b3-142a1d1283b6', 'language', 'en', 'Default language for the system', 'localization', 'string', false, '2025-08-04 20:24:40.874621+00', '2025-08-04 20:24:40.874621+00'),
	('4e194a76-0178-48cb-ae70-ebebaa42f215', 'fiscal_year_start', 'january', 'Fiscal year start month', 'business', 'string', false, '2025-08-04 20:24:40.874621+00', '2025-08-04 20:24:40.874621+00'),
	('8b0180f9-86ab-4cff-a6ca-2fd20a4021b0', 'default_rent_cycle', 'monthly', 'Default rent cycle for new contracts', 'business', 'string', false, '2025-08-04 20:24:40.874621+00', '2025-08-04 20:24:40.874621+00'),
	('bf06cf73-b608-41e6-8295-77a177348c02', 'auto_backup', 'true', 'Enable automatic backup', 'system', 'boolean', false, '2025-08-04 20:24:40.874621+00', '2025-08-04 20:24:40.874621+00'),
	('21314591-d4a5-43ec-8eb9-d8358ff57403', 'maintenance_mode', 'false', 'Enable maintenance mode', 'system', 'boolean', false, '2025-08-04 20:24:40.874621+00', '2025-08-04 20:24:40.874621+00'),
	('5c19a4b1-0c0f-4b86-9d1d-81c079483ea5', 'allow_registration', 'false', 'Allow new user registration', 'security', 'boolean', false, '2025-08-04 20:24:40.874621+00', '2025-08-04 20:24:40.874621+00'),
	('b1319bf4-cef2-44ec-b823-1675bee7932c', 'require_email_verification', 'true', 'Require email verification for new users', 'security', 'boolean', false, '2025-08-04 20:24:40.874621+00', '2025-08-04 20:24:40.874621+00'),
	('323a88b7-978d-4475-b8ce-1a221a95a837', 'max_file_upload_size', '10485760', 'Maximum file upload size in bytes (10MB)', 'system', 'number', false, '2025-08-04 20:24:40.874621+00', '2025-08-04 20:24:40.874621+00'),
	('82e87ae8-dbec-4022-907b-67cb3d4fb61b', 'session_timeout_minutes', '30', 'Session timeout in minutes', 'security', 'number', false, '2025-08-04 20:24:40.874621+00', '2025-08-04 20:24:40.874621+00'),
	('7b3ad8ef-cdc0-4f40-9c65-173a0f828ae5', 'email_notifications_enabled', 'true', 'Enable email notifications', 'notifications', 'boolean', false, '2025-08-04 20:24:40.874621+00', '2025-08-04 20:24:40.874621+00'),
	('ecc87e5c-c443-407c-94e5-cfc9fab397dc', 'sms_notifications_enabled', 'false', 'Enable SMS notifications', 'notifications', 'boolean', false, '2025-08-04 20:24:40.874621+00', '2025-08-04 20:24:40.874621+00');


--
-- Data for Name: tourist_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."tourist_profiles" ("id", "first_name", "last_name", "email", "phone", "created_at", "updated_at") VALUES
	('3e55f501-ed69-4c5e-b919-f7317811b39c', 'ian', 'uihuihgh', 'admin@iska-rms.com', '65419592929852', '2025-09-13 15:37:38.059608+00', '2025-09-13 15:37:38.059608+00');


--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_sessions" ("id", "user_id", "session_token", "expires_at", "ip_address", "user_agent", "is_active", "created_at", "updated_at") VALUES
	('16c6d436-f702-4454-a5ad-f302d18a5979', '423b2f89-ed35-4537-866e-d4fe702e577c', 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI0MjNiMmY4OS1lZDM1LTQ1MzctODY2ZS1kNGZlNzAyZTU3N2MiLCJlbWFpbCI6ImFkbWluQGlza2Etcm1zLmNvbSIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImV4cCI6MTc1Nzc3MDUyNn0.6VVEFZVhEZutrYgnCwoeckCbBAiWTGwXHH2vBu_1X3k', '2025-09-13 13:35:26.762+00', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', true, '2025-09-13 10:35:27.144023+00', '2025-09-13 10:35:27.144023+00'),
	('c12236f6-9626-4aad-bed4-e7ad684c3f68', '423b2f89-ed35-4537-866e-d4fe702e577c', 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI0MjNiMmY4OS1lZDM1LTQ1MzctODY2ZS1kNGZlNzAyZTU3N2MiLCJlbWFpbCI6ImFkbWluQGlza2Etcm1zLmNvbSIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImV4cCI6MTc1Nzc4ODIwNn0.WosqTEBNuljs6yjSOgNrER04Hp1qHsRQwkcYQlmvrQc', '2025-09-13 18:30:06.394+00', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', true, '2025-09-13 15:30:07.057448+00', '2025-09-13 15:30:07.057448+00'),
	('8efe651e-2301-4b28-94ba-64634aa64a45', '423b2f89-ed35-4537-866e-d4fe702e577c', 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI0MjNiMmY4OS1lZDM1LTQ1MzctODY2ZS1kNGZlNzAyZTU3N2MiLCJlbWFpbCI6ImFkbWluQGlza2Etcm1zLmNvbSIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImV4cCI6MTc1Nzg2MzExN30.B3-_q1U0ocEsuzuPPy_ovRcKk6sFaZ2MasZb7OG9sR8', '2025-09-14 15:18:37.545+00', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', true, '2025-09-14 12:18:37.818561+00', '2025-09-14 12:18:37.818561+00'),
	('d44696e2-2dfc-4853-8bdc-de3416a0ca3c', '423b2f89-ed35-4537-866e-d4fe702e577c', 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI0MjNiMmY4OS1lZDM1LTQ1MzctODY2ZS1kNGZlNzAyZTU3N2MiLCJlbWFpbCI6ImFkbWluQGlza2Etcm1zLmNvbSIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImV4cCI6MTc1Nzg3MzkyMX0.nrQh6MHGdcnb4ZYn11prqfVMelc7vKd3akXIp-lW6BI', '2025-09-14 18:18:41.23+00', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', true, '2025-09-14 15:18:41.776356+00', '2025-09-14 15:18:41.776356+00'),
	('a5f04e34-cdeb-4df4-aedf-3632e683851c', '423b2f89-ed35-4537-866e-d4fe702e577c', 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI0MjNiMmY4OS1lZDM1LTQ1MzctODY2ZS1kNGZlNzAyZTU3N2MiLCJlbWFpbCI6ImFkbWluQGlza2Etcm1zLmNvbSIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImV4cCI6MTc1NzkyOTIwN30.OYdznplt2cyWSlhKRGSrXJv25BwftDTS_8XNvFAz3xI', '2025-09-15 09:40:07.675+00', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', true, '2025-09-15 06:40:07.823314+00', '2025-09-15 06:40:07.823314+00'),
	('b62c9954-2c70-431a-b178-d404124e7a60', '423b2f89-ed35-4537-866e-d4fe702e577c', 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI0MjNiMmY4OS1lZDM1LTQ1MzctODY2ZS1kNGZlNzAyZTU3N2MiLCJlbWFpbCI6ImFkbWluQGlza2Etcm1zLmNvbSIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImV4cCI6MTc1Nzk0NDQ2Mn0.Q3VdCHr5wYSJ6EgLsIZVoRb5TBcFohbJgDUium0aacw', '2025-09-15 13:54:22.298+00', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', true, '2025-09-15 10:54:22.778452+00', '2025-09-15 10:54:22.778452+00'),
	('27a5135d-0d32-4e3b-9227-a99e41769020', '423b2f89-ed35-4537-866e-d4fe702e577c', 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI0MjNiMmY4OS1lZDM1LTQ1MzctODY2ZS1kNGZlNzAyZTU3N2MiLCJlbWFpbCI6ImFkbWluQGlza2Etcm1zLmNvbSIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImV4cCI6MTc1Nzk1MDM5MH0.OlwI5ExhOovZTRqmwWYgx_xOvw_rd2va7I1lmdrAu6A', '2025-09-15 15:33:10.227+00', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', true, '2025-09-15 12:33:10.814137+00', '2025-09-15 12:33:10.814137+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
--	('iska-rms-files', 'iska-rms-files', NULL, '2025-08-04 04:57:13.865101+00', '2025-08-04 04:57:13.865101+00', true, false, 52428800, NULL, NULL),
--	('student-documents', 'Student Documents', NULL, '2025-08-04 05:55:26.892512+00', '2025-08-04 05:55:26.892512+00', false, false, 52428800, '{image/jpeg,image/png,image/gif,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,text/csv,application/json,application/zip,application/x-zip-compressed}', NULL),
	('guarantor-documents', 'Guarantor Documents', NULL, '2025-08-04 05:55:27.436455+00', '2025-08-04 05:55:27.436455+00', false, false, 52428800, '{image/jpeg,image/png,image/gif,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,text/csv,application/json,application/zip,application/x-zip-compressed}', NULL),
	('student-passports', 'student-passports', NULL, '2025-08-04 08:49:48.003318+00', '2025-08-04 08:49:48.003318+00', false, false, NULL, NULL, NULL),
	('student-visas', 'student-visas', NULL, '2025-08-04 08:49:48.003318+00', '2025-08-04 08:49:48.003318+00', false, false, NULL, NULL, NULL);


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('2866407d-88a8-47e1-9e8e-64dbe59f2a44', 'student-documents', '040a4f5c-e23e-4f17-b00f-1de2ad01f865/passport/HOLLARA.png', NULL, '2025-09-12 10:56:45.219476+00', '2025-09-12 10:56:45.219476+00', '2025-09-12 10:56:45.219476+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T10:56:46.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'f2617d36-87f8-4a22-8e31-1db8152d7fea', NULL, '{}'),
	('6efe2ff7-015c-4697-b98c-45c8af650c79', 'student-documents', '040a4f5c-e23e-4f17-b00f-1de2ad01f865/utility_bill/HOLLARA.png', NULL, '2025-09-12 10:56:45.603467+00', '2025-09-12 10:56:45.603467+00', '2025-09-12 10:56:45.603467+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T10:56:46.000Z", "contentLength": 18187, "httpStatusCode": 200}', '081a96b5-eef1-494a-b591-5f6550300684', NULL, '{}'),
	('42a8411f-6ccc-4cd5-82b2-da2d624fce38', 'student-documents', '040a4f5c-e23e-4f17-b00f-1de2ad01f865/bank_statement/HOLLARA.png', NULL, '2025-09-12 10:56:45.955216+00', '2025-09-12 10:56:45.955216+00', '2025-09-12 10:56:45.955216+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T10:56:46.000Z", "contentLength": 18187, "httpStatusCode": 200}', '06570cf7-2ed8-491a-b045-121d5f0e5dcb', NULL, '{}'),
	('7fccf5b9-26d4-4998-b4f5-d6c02fb2cfd2', 'student-documents', '040a4f5c-e23e-4f17-b00f-1de2ad01f865/visa/HOLLARA.png', NULL, '2025-09-12 10:56:46.330527+00', '2025-09-12 10:56:46.330527+00', '2025-09-12 10:56:46.330527+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T10:56:47.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'daf7f034-c2d0-46fd-9692-778b294dffdd', NULL, '{}'),
	('061d2d9d-9a1d-42ba-886b-7a05560d9ada', 'student-documents', '040a4f5c-e23e-4f17-b00f-1de2ad01f865/guarantor_id/HOLLARA.png', NULL, '2025-09-12 10:56:46.719741+00', '2025-09-12 10:56:46.719741+00', '2025-09-12 10:56:46.719741+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T10:56:47.000Z", "contentLength": 18187, "httpStatusCode": 200}', '2b461c84-1b84-4d05-bba7-78b67196829c', NULL, '{}'),
	('ca2babdb-bfdf-4758-afbb-2a819c0fc3a0', 'student-documents', '040a4f5c-e23e-4f17-b00f-1de2ad01f865/proof_of_income/HOLLARA.png', NULL, '2025-09-12 10:56:47.131934+00', '2025-09-12 10:56:47.131934+00', '2025-09-12 10:56:47.131934+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T10:56:48.000Z", "contentLength": 18187, "httpStatusCode": 200}', '48c6e629-01ab-47ce-8895-c52fba8683b5', NULL, '{}'),
	('7db82819-db1d-4389-8081-3f7110ac6d50', 'student-documents', '9545fa2a-2249-4617-97de-ae2a4028f247/passport/HOLLARA.png', NULL, '2025-09-14 12:32:43.433119+00', '2025-09-14 12:32:43.433119+00', '2025-09-14 12:32:43.433119+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-14T12:32:44.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'ae1d0362-73d1-40e1-a056-6c7d2ad0ba48', NULL, '{}'),
	('0ec4565e-1dba-4809-b4b3-1ffbc8b4e5b1', 'student-documents', '9545fa2a-2249-4617-97de-ae2a4028f247/utility_bill/HOLLARA.png', NULL, '2025-09-14 12:32:44.018474+00', '2025-09-14 12:32:44.018474+00', '2025-09-14 12:32:44.018474+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-14T12:32:44.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'd1898cb0-04d0-48cf-90f6-4fed08cf8ec6', NULL, '{}'),
	('f986a971-cb5f-4410-ab0e-025ca74e2e11', 'student-documents', '9545fa2a-2249-4617-97de-ae2a4028f247/bank_statement/HOLLARA.png', NULL, '2025-09-14 12:32:44.503891+00', '2025-09-14 12:32:44.503891+00', '2025-09-14 12:32:44.503891+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-14T12:32:45.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'b893527b-95fd-4071-9959-41281eda1618', NULL, '{}'),
	('ca46dd6d-6754-42cd-b98c-f1233a70a13c', 'student-documents', '9545fa2a-2249-4617-97de-ae2a4028f247/visa/HOLLARA.png', NULL, '2025-09-14 12:32:45.044268+00', '2025-09-14 12:32:45.044268+00', '2025-09-14 12:32:45.044268+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-14T12:32:45.000Z", "contentLength": 18187, "httpStatusCode": 200}', '5b333a62-c393-4868-9776-909af7955e6c', NULL, '{}'),
	('38e22055-3ec5-464d-94b9-a567cb792c04', 'student-documents', '051b1e2b-b798-4a91-804c-cfb2d7aa1494/passport/HOLLARA.png', NULL, '2025-09-12 11:41:53.416827+00', '2025-09-12 11:41:53.416827+00', '2025-09-12 11:41:53.416827+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T11:41:54.000Z", "contentLength": 18187, "httpStatusCode": 200}', '2b97b7b0-d892-4651-9202-dbe287f2ded2', NULL, '{}'),
	('4d3d7395-736c-4574-a038-87339381ee2b', 'student-documents', '051b1e2b-b798-4a91-804c-cfb2d7aa1494/utility_bill/HOLLARA.png', NULL, '2025-09-12 11:41:53.843044+00', '2025-09-12 11:41:53.843044+00', '2025-09-12 11:41:53.843044+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T11:41:54.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'b09d8c75-2f59-4ee6-919a-be5513da0ed3', NULL, '{}'),
	('0e1f6e29-4c68-47ac-b6c4-9df92e4ce029', 'student-documents', '051b1e2b-b798-4a91-804c-cfb2d7aa1494/bank_statement/HOLLARA.png', NULL, '2025-09-12 11:41:54.387088+00', '2025-09-12 11:41:54.387088+00', '2025-09-12 11:41:54.387088+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T11:41:55.000Z", "contentLength": 18187, "httpStatusCode": 200}', '7604d1ba-e015-4d41-9892-36b1bbc0bb84', NULL, '{}'),
	('8d4b5246-dcdb-4438-ba6e-615af323c5af', 'student-documents', '051b1e2b-b798-4a91-804c-cfb2d7aa1494/visa/HOLLARA.png', NULL, '2025-09-12 11:41:54.800379+00', '2025-09-12 11:41:54.800379+00', '2025-09-12 11:41:54.800379+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T11:41:55.000Z", "contentLength": 18187, "httpStatusCode": 200}', '1dfeb4b0-b14d-4308-97a9-d1da90aeaf63', NULL, '{}'),
	('12250dd7-9d5a-434e-b861-fb28827d27d8', 'student-documents', '051b1e2b-b798-4a91-804c-cfb2d7aa1494/guarantor_id/HOLLARA.png', NULL, '2025-09-12 11:41:55.199208+00', '2025-09-12 11:41:55.199208+00', '2025-09-12 11:41:55.199208+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T11:41:56.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'd60f6e92-3f7f-410b-ae8f-251781afc131', NULL, '{}'),
	('25b09237-0f7d-48dc-beb5-df70d99c12f2', 'student-documents', '051b1e2b-b798-4a91-804c-cfb2d7aa1494/proof_of_income/HOLLARA.png', NULL, '2025-09-12 11:41:55.576079+00', '2025-09-12 11:41:55.576079+00', '2025-09-12 11:41:55.576079+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T11:41:56.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'f5f754f5-61d9-4080-98f6-e2bc21393a6f', NULL, '{}'),
	('a1273154-8f14-4203-93e2-623658720c63', 'student-documents', '9545fa2a-2249-4617-97de-ae2a4028f247/guarantor_id/HOLLARA.png', NULL, '2025-09-14 12:32:45.622728+00', '2025-09-14 12:32:45.622728+00', '2025-09-14 12:32:45.622728+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-14T12:32:46.000Z", "contentLength": 18187, "httpStatusCode": 200}', '9332c98a-cba8-41cb-9bd8-6d70131f2255', NULL, '{}'),
	('32930791-b4d3-47d0-8f21-025c17802b29', 'student-documents', '9545fa2a-2249-4617-97de-ae2a4028f247/proof_of_income/HOLLARA.png', NULL, '2025-09-14 12:32:46.145109+00', '2025-09-14 12:32:46.145109+00', '2025-09-14 12:32:46.145109+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-14T12:32:47.000Z", "contentLength": 18187, "httpStatusCode": 200}', '99e56b9a-0a22-414d-b4f9-8562f124cb6d', NULL, '{}'),
	('22462ccd-9d23-46a0-b607-db451c5d8446', 'student-documents', 'c198c36b-d3a0-458d-a785-a4ecf5f86463/passport/HOLLARA.png', NULL, '2025-09-12 12:17:00.418918+00', '2025-09-12 12:17:00.418918+00', '2025-09-12 12:17:00.418918+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T12:17:01.000Z", "contentLength": 18187, "httpStatusCode": 200}', '2042d0e9-30de-4e50-b307-e086e3ce3300', NULL, '{}'),
	('fc04a47b-dcbb-43c8-a43e-24f8e311c78f', 'student-documents', 'c198c36b-d3a0-458d-a785-a4ecf5f86463/utility_bill/HOLLARA.png', NULL, '2025-09-12 12:17:01.000119+00', '2025-09-12 12:17:01.000119+00', '2025-09-12 12:17:01.000119+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T12:17:01.000Z", "contentLength": 18187, "httpStatusCode": 200}', '1c6c2ca0-0c22-41e4-8375-48c5cdd85f89', NULL, '{}'),
	('ef7a1110-303a-4d60-8705-903bad1d08aa', 'student-documents', 'c198c36b-d3a0-458d-a785-a4ecf5f86463/bank_statement/HOLLARA.png', NULL, '2025-09-12 12:17:01.540647+00', '2025-09-12 12:17:01.540647+00', '2025-09-12 12:17:01.540647+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T12:17:02.000Z", "contentLength": 18187, "httpStatusCode": 200}', '6b630052-f95c-477a-a5de-66e3e682cc86', NULL, '{}'),
	('51655231-2178-4653-a573-fec0632c31ff', 'student-documents', 'c198c36b-d3a0-458d-a785-a4ecf5f86463/visa/HOLLARA.png', NULL, '2025-09-12 12:17:02.110606+00', '2025-09-12 12:17:02.110606+00', '2025-09-12 12:17:02.110606+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T12:17:03.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'bd044956-7d1f-48b3-8f99-731881170eb4', NULL, '{}'),
	('c37d94b9-d393-448e-b0a1-3fce4c9dc115', 'student-documents', 'c198c36b-d3a0-458d-a785-a4ecf5f86463/guarantor_id/HOLLARA.png', NULL, '2025-09-12 12:17:02.733835+00', '2025-09-12 12:17:02.733835+00', '2025-09-12 12:17:02.733835+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T12:17:03.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'bbf05cdc-411a-4060-b798-82df56c11745', NULL, '{}'),
	('fe70e4dc-d9c9-4aad-9f1f-37cefff3fe19', 'student-documents', 'c198c36b-d3a0-458d-a785-a4ecf5f86463/proof_of_income/HOLLARA.png', NULL, '2025-09-12 12:17:03.217215+00', '2025-09-12 12:17:03.217215+00', '2025-09-12 12:17:03.217215+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T12:17:04.000Z", "contentLength": 18187, "httpStatusCode": 200}', '12ccbd8b-f393-4cb2-a3ad-ea5d97b12476', NULL, '{}'),
	('825d4d2c-b364-4e10-ab31-8acf3d211e4c', 'student-documents', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24/passport/cleanseoul.png', NULL, '2025-09-14 15:22:22.589966+00', '2025-09-14 15:22:22.589966+00', '2025-09-14 15:22:22.589966+00', '{"eTag": "\"28d2f230189cfe9d70544d5a72b5d696\"", "size": 22223, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-14T15:22:23.000Z", "contentLength": 22223, "httpStatusCode": 200}', 'e20b4e4b-20ad-4646-b451-7597cc97f370', NULL, '{}'),
	('c6a24583-dcd0-4a0c-925a-e97e28f45e95', 'student-documents', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24/visa/cleanseoul.png', NULL, '2025-09-14 15:22:23.300136+00', '2025-09-14 15:22:23.300136+00', '2025-09-14 15:22:23.300136+00', '{"eTag": "\"28d2f230189cfe9d70544d5a72b5d696\"", "size": 22223, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-14T15:22:24.000Z", "contentLength": 22223, "httpStatusCode": 200}', '570efeb8-fb72-42dc-b676-b992f8f18714', NULL, '{}'),
	('eef7f433-beaa-4d7c-b71f-5f0253ccd1e7', 'student-documents', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24/utility_bill/cleanseoul.png', NULL, '2025-09-14 15:22:23.913827+00', '2025-09-14 15:22:23.913827+00', '2025-09-14 15:22:23.913827+00', '{"eTag": "\"28d2f230189cfe9d70544d5a72b5d696\"", "size": 22223, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-14T15:22:24.000Z", "contentLength": 22223, "httpStatusCode": 200}', '1482cf8a-5b66-4261-9147-fea1feab56e0', NULL, '{}'),
	('f402fa68-af07-41d8-9ddd-46df86b92180', 'student-documents', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24/guarantor_id/cleanseoul.png', NULL, '2025-09-14 15:22:24.50621+00', '2025-09-14 15:22:24.50621+00', '2025-09-14 15:22:24.50621+00', '{"eTag": "\"28d2f230189cfe9d70544d5a72b5d696\"", "size": 22223, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-14T15:22:25.000Z", "contentLength": 22223, "httpStatusCode": 200}', '4b776d6f-06d8-43e6-a336-c45424e66a65', NULL, '{}'),
	('7e190cc6-7160-4330-b23f-c2b62884a345', 'student-documents', '58f1f95d-ed6c-45b4-9c22-f9f455a5393c/passport/HOLLARA.png', NULL, '2025-09-12 13:31:36.533402+00', '2025-09-12 13:31:36.533402+00', '2025-09-12 13:31:36.533402+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T13:31:37.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'aac400d9-c558-432d-85d7-0331362b4c45', NULL, '{}'),
	('38089f51-df70-49a6-b27d-1ee5ce0c2680', 'student-documents', '58f1f95d-ed6c-45b4-9c22-f9f455a5393c/utility_bill/HOLLARA.png', NULL, '2025-09-12 13:31:37.060953+00', '2025-09-12 13:31:37.060953+00', '2025-09-12 13:31:37.060953+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T13:31:37.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'e76b70f0-88d8-4a74-ac8e-929467e98221', NULL, '{}'),
	('1a212494-3569-4987-b489-225e2b0f4f87', 'student-documents', '58f1f95d-ed6c-45b4-9c22-f9f455a5393c/bank_statement/HOLLARA.png', NULL, '2025-09-12 13:31:37.512722+00', '2025-09-12 13:31:37.512722+00', '2025-09-12 13:31:37.512722+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T13:31:38.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'a441dc70-6dbf-4924-8c66-be5a76ea1547', NULL, '{}'),
	('ac1217fc-0733-4148-93fd-8690112a44f8', 'student-documents', '58f1f95d-ed6c-45b4-9c22-f9f455a5393c/visa/HOLLARA.png', NULL, '2025-09-12 13:31:37.939319+00', '2025-09-12 13:31:37.939319+00', '2025-09-12 13:31:37.939319+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T13:31:38.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'ec75f2b7-3b59-4cd2-b8fb-edb55f8c7947', NULL, '{}'),
	('cce2fee6-0051-43b3-9d7c-18caa7b31600', 'student-documents', '58f1f95d-ed6c-45b4-9c22-f9f455a5393c/guarantor_id/HOLLARA.png', NULL, '2025-09-12 13:31:38.482611+00', '2025-09-12 13:31:38.482611+00', '2025-09-12 13:31:38.482611+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T13:31:39.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'fc5e2497-7cfd-4d08-8bf5-09175672ae6e', NULL, '{}'),
	('231114ed-09d8-4339-b082-286b446b32e3', 'student-documents', '58f1f95d-ed6c-45b4-9c22-f9f455a5393c/proof_of_income/HOLLARA.png', NULL, '2025-09-12 13:31:38.938083+00', '2025-09-12 13:31:38.938083+00', '2025-09-12 13:31:38.938083+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T13:31:39.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'c2090f4a-4694-4149-90b2-8bf7894619e9', NULL, '{}'),
	('b4ca26da-bf8a-4758-af39-d0f89a8d4ef6', 'student-documents', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24/bank_statement/cleanseoul.png', NULL, '2025-09-14 15:22:25.104264+00', '2025-09-14 15:22:25.104264+00', '2025-09-14 15:22:25.104264+00', '{"eTag": "\"28d2f230189cfe9d70544d5a72b5d696\"", "size": 22223, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-14T15:22:26.000Z", "contentLength": 22223, "httpStatusCode": 200}', '6c0fac35-b921-41cd-9b42-b78d78eaf433', NULL, '{}'),
	('3ea5aab0-e8c4-45d4-a6c5-8567b9db36ce', 'student-documents', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24/proof_of_income/cleanseoul.png', NULL, '2025-09-14 15:22:25.729011+00', '2025-09-14 15:22:25.729011+00', '2025-09-14 15:22:25.729011+00', '{"eTag": "\"28d2f230189cfe9d70544d5a72b5d696\"", "size": 22223, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-14T15:22:26.000Z", "contentLength": 22223, "httpStatusCode": 200}', 'de01ab14-ae21-4503-9f3e-a2c33c28d1ac', NULL, '{}'),
	('157f5867-0b6d-45bb-b115-baca9867846e', 'student-documents', '4e756dec-fa0c-4a38-a9d3-c08ccbb9c005/passport/HOLLARA.png', NULL, '2025-09-12 15:26:37.356635+00', '2025-09-12 15:26:37.356635+00', '2025-09-12 15:26:37.356635+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T15:26:38.000Z", "contentLength": 18187, "httpStatusCode": 200}', '5e819aa3-a7d8-4b15-82c8-9f73a3c67e66', NULL, '{}'),
	('c281136f-809e-424a-9424-6fd131bc1854', 'student-documents', '4e756dec-fa0c-4a38-a9d3-c08ccbb9c005/utility_bill/HOLLARA.png', NULL, '2025-09-12 15:26:37.817665+00', '2025-09-12 15:26:37.817665+00', '2025-09-12 15:26:37.817665+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T15:26:38.000Z", "contentLength": 18187, "httpStatusCode": 200}', '18e76d2e-6691-4293-9625-b98c7e1cfcd9', NULL, '{}'),
	('66b2e772-ab65-4392-b013-6b3bf31c9cc6', 'student-documents', '4e756dec-fa0c-4a38-a9d3-c08ccbb9c005/bank_statement/HOLLARA.png', NULL, '2025-09-12 15:26:38.285151+00', '2025-09-12 15:26:38.285151+00', '2025-09-12 15:26:38.285151+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T15:26:39.000Z", "contentLength": 18187, "httpStatusCode": 200}', '274d0379-3678-4d54-814b-5df51625d830', NULL, '{}'),
	('ccd80fda-f3e9-441b-9602-781068c4d0da', 'student-documents', '4e756dec-fa0c-4a38-a9d3-c08ccbb9c005/visa/HOLLARA.png', NULL, '2025-09-12 15:26:38.760128+00', '2025-09-12 15:26:38.760128+00', '2025-09-12 15:26:38.760128+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T15:26:39.000Z", "contentLength": 18187, "httpStatusCode": 200}', '78b497b1-2c7d-4907-96eb-8f028972af06', NULL, '{}'),
	('1423924f-745d-4080-b4da-70ff04e01760', 'student-documents', '4e756dec-fa0c-4a38-a9d3-c08ccbb9c005/guarantor_id/HOLLARA.png', NULL, '2025-09-12 15:26:39.22608+00', '2025-09-12 15:26:39.22608+00', '2025-09-12 15:26:39.22608+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T15:26:40.000Z", "contentLength": 18187, "httpStatusCode": 200}', '24311e5a-aa7a-481e-be25-a14235fc9f46', NULL, '{}'),
	('cb4e546a-5b05-40a1-9833-aa71ce26e8b9', 'student-documents', '4e756dec-fa0c-4a38-a9d3-c08ccbb9c005/proof_of_income/HOLLARA.png', NULL, '2025-09-12 15:26:39.675176+00', '2025-09-12 15:26:39.675176+00', '2025-09-12 15:26:39.675176+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T15:26:40.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'f1ced9f4-9af9-4ed4-b2b6-0876fd1ae1d8', NULL, '{}'),
	('65c173a2-bdb3-4652-bc6a-485636a58e25', 'student-documents', '808a111c-e83c-4052-96c9-a98e1b3c3819/passport/HOLLARA.png', NULL, '2025-09-12 15:37:10.077294+00', '2025-09-12 15:37:10.077294+00', '2025-09-12 15:37:10.077294+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T15:37:11.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'd89b6ac5-2d6c-4324-8437-34ae19aa4240', NULL, '{}'),
	('39bee21d-0db6-49b0-88f9-e04893167f14', 'student-documents', '808a111c-e83c-4052-96c9-a98e1b3c3819/utility_bill/HOLLARA.png', NULL, '2025-09-12 15:37:10.568666+00', '2025-09-12 15:37:10.568666+00', '2025-09-12 15:37:10.568666+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T15:37:11.000Z", "contentLength": 18187, "httpStatusCode": 200}', '3ec355dc-86ed-4487-8c9c-0a497f98ec0d', NULL, '{}'),
	('8fa276bb-0073-448d-903a-5c32253c19f3', 'student-documents', '808a111c-e83c-4052-96c9-a98e1b3c3819/bank_statement/HOLLARA.png', NULL, '2025-09-12 15:37:11.039362+00', '2025-09-12 15:37:11.039362+00', '2025-09-12 15:37:11.039362+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T15:37:11.000Z", "contentLength": 18187, "httpStatusCode": 200}', '8a4d3392-78f8-48d3-b359-5a4b9f88026a', NULL, '{}'),
	('544040d6-125f-43e2-b47f-15fda06cf067', 'student-documents', '808a111c-e83c-4052-96c9-a98e1b3c3819/proof_of_income/HOLLARA.png', NULL, '2025-09-12 15:37:11.506505+00', '2025-09-12 15:37:11.506505+00', '2025-09-12 15:37:11.506505+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T15:37:12.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'a199a96d-d2ab-4951-9d6a-7ebe99ae5750', NULL, '{}'),
	('34f2f7f0-84d4-42d8-97ac-029178879b9b', 'student-documents', '808a111c-e83c-4052-96c9-a98e1b3c3819/guarantor_id/HOLLARA.png', NULL, '2025-09-12 15:37:11.967131+00', '2025-09-12 15:37:11.967131+00', '2025-09-12 15:37:11.967131+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T15:37:12.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'f6ad4c2a-e0cf-4ff8-a14a-5bd577815a8d', NULL, '{}'),
	('3f0bdfca-f550-432d-b19f-5c236b026df5', 'student-documents', '808a111c-e83c-4052-96c9-a98e1b3c3819/visa/HOLLARA.png', NULL, '2025-09-12 15:37:12.425275+00', '2025-09-12 15:37:12.425275+00', '2025-09-12 15:37:12.425275+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-12T15:37:13.000Z", "contentLength": 18187, "httpStatusCode": 200}', '9816a543-c7cc-4c0d-8ae6-fe09747150a1', NULL, '{}'),
	('7595fb9f-e8ac-4b86-a323-c69488fbe50f', 'student-documents', '87576f42-32c9-41a7-93f1-65bc433f5a75/passport/HOLLARA.png', NULL, '2025-09-13 10:38:05.882647+00', '2025-09-13 10:38:05.882647+00', '2025-09-13 10:38:05.882647+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-13T10:38:06.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'b1a54b94-2129-4c19-9db0-4b7082c4fdf8', NULL, '{}'),
	('5dd37a43-46ec-4a6a-aceb-7d2cf3cf9879', 'student-documents', '87576f42-32c9-41a7-93f1-65bc433f5a75/utility_bill/HOLLARA.png', NULL, '2025-09-13 10:38:06.330606+00', '2025-09-13 10:38:06.330606+00', '2025-09-13 10:38:06.330606+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-13T10:38:07.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'a965bd91-8d4a-471e-a693-2fed817f63de', NULL, '{}'),
	('b727c0b7-91ab-49b6-9158-81d42c3e79af', 'student-documents', '87576f42-32c9-41a7-93f1-65bc433f5a75/bank_statement/HOLLARA.png', NULL, '2025-09-13 10:38:06.846703+00', '2025-09-13 10:38:06.846703+00', '2025-09-13 10:38:06.846703+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-13T10:38:07.000Z", "contentLength": 18187, "httpStatusCode": 200}', '0e67df5b-326f-42d8-bf16-0d31defc98b4', NULL, '{}'),
	('7fe105f8-2657-40a6-9142-33666efec693', 'student-documents', '87576f42-32c9-41a7-93f1-65bc433f5a75/visa/HOLLARA.png', NULL, '2025-09-13 10:38:07.325826+00', '2025-09-13 10:38:07.325826+00', '2025-09-13 10:38:07.325826+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-13T10:38:08.000Z", "contentLength": 18187, "httpStatusCode": 200}', '9af8e6e9-c72d-48ce-a82e-212ce2aec543', NULL, '{}'),
	('5f0a0275-e96f-4345-b131-6ccfc3f5e6f2', 'student-documents', 'ab8899ac-267b-41df-bedb-9bef781abe7e/bank_statement/studios_import_template (1).csv', NULL, '2025-08-11 12:49:16.311278+00', '2025-08-25 06:51:49.533459+00', '2025-08-11 12:49:16.311278+00', '{"eTag": "\"a34d61e8367a180a3526673743cbd303\"", "size": 84, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-08-11T12:49:17.000Z", "contentLength": 84, "httpStatusCode": 200}', 'af8253e7-bd2a-4242-91c3-b95d07c84983', NULL, '{}'),
	('7159fad0-2b2a-47cb-bcd8-18d686110e9a', 'student-documents', 'ab8899ac-267b-41df-bedb-9bef781abe7e/guarantor_id/ChatGPT Image Aug 6, 2025, 11_46_16 PM.png', NULL, '2025-08-11 12:49:18.117729+00', '2025-08-25 06:51:49.533459+00', '2025-08-11 12:49:18.117729+00', '{"eTag": "\"b496d17082156a9d366e9834dcc78b2d\"", "size": 1416640, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-08-11T12:49:19.000Z", "contentLength": 1416640, "httpStatusCode": 200}', '3bbc6cd4-8029-43e2-ab97-b3a8c9932ae2', NULL, '{}'),
	('4aa4bce1-6477-4268-bd98-15ef54cfad31', 'student-documents', 'ab8899ac-267b-41df-bedb-9bef781abe7e/passport/studios_import_template.csv', NULL, '2025-08-11 12:49:18.391509+00', '2025-08-25 06:51:49.533459+00', '2025-08-11 12:49:18.391509+00', '{"eTag": "\"a34d61e8367a180a3526673743cbd303\"", "size": 84, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-08-11T12:49:19.000Z", "contentLength": 84, "httpStatusCode": 200}', 'be6f4bdc-e695-4edd-9b54-e9d3e2da4fdf', NULL, '{}'),
	('55bc2449-6614-400d-b653-0a341ff4004c', 'student-documents', 'ab8899ac-267b-41df-bedb-9bef781abe7e/utility_bill/a-clean-minimalist-dashboard-interface-d__e_B0LwTReuCxjB-65xewQ_xqbHhOFISSyWtKCX7wtg-w.jpeg', NULL, '2025-08-11 12:49:17.014672+00', '2025-08-25 06:51:49.533459+00', '2025-08-11 12:49:17.014672+00', '{"eTag": "\"728c58da41f4c0fd83fda3735062ed32\"", "size": 63487, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-11T12:49:17.000Z", "contentLength": 63487, "httpStatusCode": 200}', '59c7f8d8-19aa-4f08-99eb-f49ad8995751', NULL, '{}'),
	('e48d336c-df4f-444d-bcab-246aabacaee1', 'student-documents', 'ab8899ac-267b-41df-bedb-9bef781abe7e/visa/WhatsApp Image 2025-08-08 at 11.02.15.jpeg', NULL, '2025-08-11 12:49:18.741497+00', '2025-08-25 06:51:49.533459+00', '2025-08-11 12:49:18.741497+00', '{"eTag": "\"455363360fbc508ddc36321c2fecf22e\"", "size": 50987, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-11T12:49:19.000Z", "contentLength": 50987, "httpStatusCode": 200}', '74f4534c-ab66-4d8e-8456-e95c7783f630', NULL, '{}'),
	('0bf7c021-13c6-4a4b-9c6d-433c1eb42b01', 'student-documents', '87576f42-32c9-41a7-93f1-65bc433f5a75/guarantor_id/HOLLARA.png', NULL, '2025-09-13 10:38:07.730861+00', '2025-09-13 10:38:07.730861+00', '2025-09-13 10:38:07.730861+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-13T10:38:08.000Z", "contentLength": 18187, "httpStatusCode": 200}', '3fd8728c-886e-4698-a49b-0184c410c190', NULL, '{}'),
	('67043704-7651-4350-8bc4-4dca92475291', 'student-documents', '87576f42-32c9-41a7-93f1-65bc433f5a75/proof_of_income/HOLLARA.png', NULL, '2025-09-13 10:38:08.248636+00', '2025-09-13 10:38:08.248636+00', '2025-09-13 10:38:08.248636+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-13T10:38:09.000Z", "contentLength": 18187, "httpStatusCode": 200}', '1a286e66-78bb-4b3f-aa14-59ca706ff2f8', NULL, '{}'),
	('c0fc333b-40bf-4e8e-be06-4d2adeb17847', 'student-documents', 'ca0e3293-d832-4770-84ca-5061330603eb/proof_of_income/HOLLARA.png', NULL, '2025-09-13 10:50:40.036257+00', '2025-09-13 10:50:40.036257+00', '2025-09-13 10:50:40.036257+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-13T10:50:40.000Z", "contentLength": 18187, "httpStatusCode": 200}', '2028e93c-c295-4a08-86bc-55153ffedce3', NULL, '{}'),
	('b73dc97f-9d7d-47e1-a568-868a7983facc', 'student-documents', 'ca0e3293-d832-4770-84ca-5061330603eb/bank_statement/HOLLARA.png', NULL, '2025-09-13 10:50:40.508124+00', '2025-09-13 10:50:40.508124+00', '2025-09-13 10:50:40.508124+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-13T10:50:41.000Z", "contentLength": 18187, "httpStatusCode": 200}', '06e03a53-2487-45f9-a9a8-9934bdf803e1', NULL, '{}'),
	('a3d42e05-6df3-4f3d-8c73-067fc42317ec', 'student-documents', 'ca0e3293-d832-4770-84ca-5061330603eb/guarantor_id/HOLLARA.png', NULL, '2025-09-13 10:50:40.930477+00', '2025-09-13 10:50:40.930477+00', '2025-09-13 10:50:40.930477+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-13T10:50:41.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'f5cbab65-221b-468b-9ab6-098b17ac567e', NULL, '{}'),
	('4fafff42-c14b-4688-8783-b7ba07a6e86f', 'student-documents', 'ca0e3293-d832-4770-84ca-5061330603eb/utility_bill/HOLLARA.png', NULL, '2025-09-13 10:50:41.368635+00', '2025-09-13 10:50:41.368635+00', '2025-09-13 10:50:41.368635+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-13T10:50:42.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'e5958f09-1103-4834-be88-7e0cfc641a05', NULL, '{}'),
	('1f18aacc-9a31-4958-840c-43fa36a50834', 'student-documents', 'ca0e3293-d832-4770-84ca-5061330603eb/visa/HOLLARA.png', NULL, '2025-09-13 10:50:41.816354+00', '2025-09-13 10:50:41.816354+00', '2025-09-13 10:50:41.816354+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-13T10:50:42.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'f9a7c55c-b339-46ad-8a0c-06cb9d4717f2', NULL, '{}'),
	('bf6bbbdd-0d24-4b00-b1fd-4e5d15cec34c', 'student-documents', 'ca0e3293-d832-4770-84ca-5061330603eb/passport/HOLLARA.png', NULL, '2025-09-13 10:50:42.240903+00', '2025-09-13 10:50:42.240903+00', '2025-09-13 10:50:42.240903+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-13T10:50:43.000Z", "contentLength": 18187, "httpStatusCode": 200}', '8c14fc0e-8e9d-48a4-ac19-b140d4dd0612', NULL, '{}'),
	('5f365a84-bb61-4fd5-8713-ebcd4a11bc0a', 'student-documents', '3f36c3ea-c8ea-4aa9-b202-272d311da404/passport/HOLLARA.png', NULL, '2025-09-13 10:56:49.797551+00', '2025-09-13 10:56:49.797551+00', '2025-09-13 10:56:49.797551+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-13T10:56:50.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'a6f6c8d0-82c3-4fa5-badf-7c7bf5bd1552', NULL, '{}'),
	('75a1af3c-5ab8-4a6b-b604-de1e8fae4d7e', 'student-documents', '3f36c3ea-c8ea-4aa9-b202-272d311da404/utility_bill/HOLLARA.png', NULL, '2025-09-13 10:56:50.402443+00', '2025-09-13 10:56:50.402443+00', '2025-09-13 10:56:50.402443+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-13T10:56:51.000Z", "contentLength": 18187, "httpStatusCode": 200}', '850deb97-eff1-46af-83b3-55e1ab4033e0', NULL, '{}'),
	('c29f1605-c1a6-4256-8cd6-6d989da15482', 'student-documents', '3f36c3ea-c8ea-4aa9-b202-272d311da404/visa/HOLLARA.png', NULL, '2025-09-13 10:56:50.992085+00', '2025-09-13 10:56:50.992085+00', '2025-09-13 10:56:50.992085+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-13T10:56:51.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'b80e3452-567b-46fa-8bcb-a3873609bcae', NULL, '{}'),
	('637eb249-4a7c-4876-9b78-1ff51d420e35', 'student-documents', '47656405-8c04-4a69-92e8-c6a3ebe0b19b/bank_statement/studios_import_template (1).csv', NULL, '2025-08-13 13:08:17.986928+00', '2025-08-25 06:51:49.533459+00', '2025-08-13 13:08:17.986928+00', '{"eTag": "\"a34d61e8367a180a3526673743cbd303\"", "size": 84, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-08-13T13:08:18.000Z", "contentLength": 84, "httpStatusCode": 200}', '54fcb489-d3c6-4a61-8a7e-0ab21149fad6', NULL, '{}'),
	('c4ee168d-e715-495d-829d-20696b006fdf', 'student-documents', '47656405-8c04-4a69-92e8-c6a3ebe0b19b/guarantor_id/Urban Hub studio data - urbanhubrms.xlsx', NULL, '2025-08-13 13:08:19.016861+00', '2025-08-25 06:51:49.533459+00', '2025-08-13 13:08:19.016861+00', '{"eTag": "\"7f41c22692f0ad418f2e35c82cba8011\"", "size": 37935, "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "cacheControl": "max-age=3600", "lastModified": "2025-08-13T13:08:19.000Z", "contentLength": 37935, "httpStatusCode": 200}', 'f80524db-1dc6-4c83-931e-793c9388253a', NULL, '{}'),
	('ee126df7-5b54-42dd-b48d-6e6557c51a82', 'student-documents', '47656405-8c04-4a69-92e8-c6a3ebe0b19b/passport/Urban Hub studio data - urbanhubrms (2).xlsx', NULL, '2025-08-13 13:08:16.790399+00', '2025-08-25 06:51:49.533459+00', '2025-08-13 13:08:16.790399+00', '{"eTag": "\"7f41c22692f0ad418f2e35c82cba8011\"", "size": 37935, "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "cacheControl": "max-age=3600", "lastModified": "2025-08-13T13:08:17.000Z", "contentLength": 37935, "httpStatusCode": 200}', '712d69be-f086-40c4-9dcf-72abadb88b8e', NULL, '{}'),
	('21685ac7-ea17-40e3-b349-564568dc2d22', 'student-documents', '47656405-8c04-4a69-92e8-c6a3ebe0b19b/proof_of_income/Urban Hub studio data - urbanhubrms.xlsx', NULL, '2025-08-13 13:08:19.867702+00', '2025-08-25 06:51:49.533459+00', '2025-08-13 13:08:19.867702+00', '{"eTag": "\"7f41c22692f0ad418f2e35c82cba8011\"", "size": 37935, "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "cacheControl": "max-age=3600", "lastModified": "2025-08-13T13:08:20.000Z", "contentLength": 37935, "httpStatusCode": 200}', '8460b969-c4e2-433f-be45-56a943537850', NULL, '{}'),
	('69b6d877-7272-4059-9cd8-f6aff1c33708', 'student-documents', '47656405-8c04-4a69-92e8-c6a3ebe0b19b/utility_bill/Urban Hub studio data - urbanhubrms (2).xlsx', NULL, '2025-08-13 13:08:17.625697+00', '2025-08-25 06:51:49.533459+00', '2025-08-13 13:08:17.625697+00', '{"eTag": "\"7f41c22692f0ad418f2e35c82cba8011\"", "size": 37935, "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "cacheControl": "max-age=3600", "lastModified": "2025-08-13T13:08:18.000Z", "contentLength": 37935, "httpStatusCode": 200}', '38ea9cd5-e8a2-4623-a965-93c1f473cb4a', NULL, '{}'),
	('df11e682-d2f8-4521-b305-8186ddf8f5d0', 'student-documents', '47656405-8c04-4a69-92e8-c6a3ebe0b19b/visa/Urban Hub studio data - urbanhubrms (2).xlsx', NULL, '2025-08-13 13:08:18.370184+00', '2025-08-25 06:51:49.533459+00', '2025-08-13 13:08:18.370184+00', '{"eTag": "\"7f41c22692f0ad418f2e35c82cba8011\"", "size": 37935, "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "cacheControl": "max-age=3600", "lastModified": "2025-08-13T13:08:19.000Z", "contentLength": 37935, "httpStatusCode": 200}', 'c0a358fa-8d26-4602-98ef-f0e12f67ec1a', NULL, '{}'),
	('cfe3a351-046a-4aae-bd9e-1f39506ec0dd', 'student-documents', '495d6446-9f33-4693-ba8e-1de893659e82/bank_statement/studios_import_template (1).csv', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 05:47:45.811951+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 05:47:45.811951+00', '{"eTag": "\"a34d61e8367a180a3526673743cbd303\"", "size": 84, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T05:47:46.000Z", "contentLength": 84, "httpStatusCode": 200}', '29e69ca8-fa7a-4a4e-a5aa-ce9d3bef300a', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('38a6a7e8-1d7a-4f49-ac0f-f2e28171877f', 'student-documents', '3f36c3ea-c8ea-4aa9-b202-272d311da404/guarantor_id/HOLLARA.png', NULL, '2025-09-13 10:56:51.670733+00', '2025-09-13 10:56:51.670733+00', '2025-09-13 10:56:51.670733+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-13T10:56:52.000Z", "contentLength": 18187, "httpStatusCode": 200}', 'f759da62-33b9-4a6c-b047-48a7e4a74411', NULL, '{}'),
	('bc014c18-098b-477f-8b03-a0fb2d1a2d16', 'student-documents', '495d6446-9f33-4693-ba8e-1de893659e82/guarantor_id/studios_import_template (1).csv', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 05:47:46.779051+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 05:47:46.779051+00', '{"eTag": "\"a34d61e8367a180a3526673743cbd303\"", "size": 84, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T05:47:47.000Z", "contentLength": 84, "httpStatusCode": 200}', '913e79f5-b074-4c3b-bdb6-a01e8b327b1c', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('9102d420-d76b-4349-9e7f-946196416886', 'student-documents', '495d6446-9f33-4693-ba8e-1de893659e82/passport/studios_import_template (1).csv', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 05:47:44.812362+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 05:47:44.812362+00', '{"eTag": "\"a34d61e8367a180a3526673743cbd303\"", "size": 84, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T05:47:45.000Z", "contentLength": 84, "httpStatusCode": 200}', 'aaaf819d-344b-4d29-a635-4178bc33893d', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('bb86ac47-94ed-400f-bf4d-73b99497b6b8', 'student-documents', '495d6446-9f33-4693-ba8e-1de893659e82/proof_of_income/studios_import_template (1).csv', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 05:47:47.079919+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 05:47:47.079919+00', '{"eTag": "\"a34d61e8367a180a3526673743cbd303\"", "size": 84, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T05:47:48.000Z", "contentLength": 84, "httpStatusCode": 200}', '8626acb0-a2b5-4e43-b902-8938a4dfd84c', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('3806283d-d8e3-4346-b7b6-24f0f0438996', 'student-documents', '495d6446-9f33-4693-ba8e-1de893659e82/utility_bill/studios_import_template (1).csv', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 05:47:45.551233+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 05:47:45.551233+00', '{"eTag": "\"a34d61e8367a180a3526673743cbd303\"", "size": 84, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T05:47:46.000Z", "contentLength": 84, "httpStatusCode": 200}', '4eebe493-da13-4ce5-a9b4-4c014a5d2f28', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('e7117ac4-eb34-4fec-bb88-d33eb4ee62a5', 'student-documents', '495d6446-9f33-4693-ba8e-1de893659e82/visa/studios_import_template (1).csv', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 05:47:46.510521+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 05:47:46.510521+00', '{"eTag": "\"a34d61e8367a180a3526673743cbd303\"", "size": 84, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T05:47:47.000Z", "contentLength": 84, "httpStatusCode": 200}', '8f5ed34f-927a-41bd-93e0-59218f60beae', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('145884f5-f14f-439c-b4e3-38b866fdf2e9', 'student-documents', '4e061cc3-f484-47ed-baac-074325591f5b/bank_statement/Gold-Studio-Urban-Hub-Student-Accommodation-4-scaled.webp', NULL, '2025-08-10 10:35:20.234189+00', '2025-08-25 06:51:49.533459+00', '2025-08-10 10:35:20.234189+00', '{"eTag": "\"bd7382923ca7ec7d1cd79e4d29c64d13\"", "size": 296786, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-08-10T10:35:21.000Z", "contentLength": 296786, "httpStatusCode": 200}', 'abe63273-a6f1-4362-9ba6-2ab3324e9d9b', NULL, '{}'),
	('896726a3-d674-4d71-b8e3-b5ba967267dd', 'student-documents', '4e061cc3-f484-47ed-baac-074325591f5b/guarantor_id/Gold-Studio-Urban-Hub-Student-Accommodation-4-scaled.webp', NULL, '2025-08-10 10:35:21.397647+00', '2025-08-25 06:51:49.533459+00', '2025-08-10 10:35:21.397647+00', '{"eTag": "\"bd7382923ca7ec7d1cd79e4d29c64d13\"", "size": 296786, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-08-10T10:35:22.000Z", "contentLength": 296786, "httpStatusCode": 200}', '0a6a4922-3062-43e2-b494-a523f91874ec', NULL, '{}'),
	('c54057e3-6fad-4b5d-ae1a-89b944e14d47', 'student-documents', '4e061cc3-f484-47ed-baac-074325591f5b/passport/Gold-Studio-Urban-Hub-Student-Accommodation-4-scaled.webp', NULL, '2025-08-10 10:35:18.459939+00', '2025-08-25 06:51:49.533459+00', '2025-08-10 10:35:18.459939+00', '{"eTag": "\"bd7382923ca7ec7d1cd79e4d29c64d13\"", "size": 296786, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-08-10T10:35:19.000Z", "contentLength": 296786, "httpStatusCode": 200}', 'ff09127c-0600-408a-a3a5-c55959689cb1', NULL, '{}'),
	('c5e288f7-540c-45c0-972a-708d31288213', 'student-documents', '4e061cc3-f484-47ed-baac-074325591f5b/proof_of_income/Gold-Studio-Urban-Hub-Student-Accommodation-4-scaled.webp', NULL, '2025-08-10 10:35:21.943426+00', '2025-08-25 06:51:49.533459+00', '2025-08-10 10:35:21.943426+00', '{"eTag": "\"bd7382923ca7ec7d1cd79e4d29c64d13\"", "size": 296786, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-08-10T10:35:22.000Z", "contentLength": 296786, "httpStatusCode": 200}', '226f7317-f887-4946-a51e-a6ab7be49f75', NULL, '{}'),
	('57e03cbc-13fe-453b-8bf7-eb2ac056de8c', 'student-documents', '4e061cc3-f484-47ed-baac-074325591f5b/utility_bill/Gold-Studio-Urban-Hub-Student-Accommodation-5-scaled.webp', NULL, '2025-08-10 10:35:19.002119+00', '2025-08-25 06:51:49.533459+00', '2025-08-10 10:35:19.002119+00', '{"eTag": "\"1f3278f4bff6238e9059c9910adfebd0\"", "size": 232624, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-08-10T10:35:19.000Z", "contentLength": 232624, "httpStatusCode": 200}', '2dd51f67-6c0d-48ef-ba9a-a09c2a5bb345', NULL, '{}'),
	('526c169c-a64b-455f-9090-0bfc0d53c8f0', 'student-documents', '4e061cc3-f484-47ed-baac-074325591f5b/visa/Gold-Studio-Urban-Hub-Student-Accommodation-4-scaled.webp', NULL, '2025-08-10 10:35:20.80664+00', '2025-08-25 06:51:49.533459+00', '2025-08-10 10:35:20.80664+00', '{"eTag": "\"bd7382923ca7ec7d1cd79e4d29c64d13\"", "size": 296786, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-08-10T10:35:21.000Z", "contentLength": 296786, "httpStatusCode": 200}', '44b5ae99-e4e0-4410-a9b5-051cf1cea2fd', NULL, '{}'),
	('cfd53d7e-037c-40dd-8038-eebed4dfc4f5', 'student-documents', '5f30cb34-1e54-4ed7-be48-7423024d98b8/bank_statement/blog-101.png', NULL, '2025-08-11 07:20:03.435489+00', '2025-08-25 06:51:49.533459+00', '2025-08-11 07:20:03.435489+00', '{"eTag": "\"bba9cc3f46c15bf064f16d0eecaf418b\"", "size": 1921653, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-08-11T07:20:04.000Z", "contentLength": 1921653, "httpStatusCode": 200}', '7f4055b6-6eab-440a-9ac2-10627d632e37', NULL, '{}'),
	('d481d4ad-b5c8-4c7e-9725-4a4ad42799eb', 'student-documents', '5f30cb34-1e54-4ed7-be48-7423024d98b8/guarantor_id/Gold-Studio-Urban-Hub-Student-Accommodation-5-scaled.webp', NULL, '2025-08-11 07:20:05.405798+00', '2025-08-25 06:51:49.533459+00', '2025-08-11 07:20:05.405798+00', '{"eTag": "\"1f3278f4bff6238e9059c9910adfebd0\"", "size": 232624, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-08-11T07:20:06.000Z", "contentLength": 232624, "httpStatusCode": 200}', 'fc23c703-b3e9-4bad-ab7d-2fe9a9ce8c3a', NULL, '{}'),
	('d4419be5-56e3-4474-99f5-d85c6630b834', 'student-documents', '5f30cb34-1e54-4ed7-be48-7423024d98b8/passport/blog-101.png', NULL, '2025-08-11 07:20:00.688037+00', '2025-08-25 06:51:49.533459+00', '2025-08-11 07:20:00.688037+00', '{"eTag": "\"bba9cc3f46c15bf064f16d0eecaf418b\"", "size": 1921653, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-08-11T07:20:01.000Z", "contentLength": 1921653, "httpStatusCode": 200}', '319177f6-57f4-4f48-82e0-f44b24d8c9ad', NULL, '{}'),
	('39f3f8c4-d407-41ff-a9c2-2b137f8e6112', 'student-documents', '5f30cb34-1e54-4ed7-be48-7423024d98b8/proof_of_income/Artboard-2.jpg', NULL, '2025-08-11 07:20:05.802611+00', '2025-08-25 06:51:49.533459+00', '2025-08-11 07:20:05.802611+00', '{"eTag": "\"005644442c8b80e131906e8e0414c896\"", "size": 122955, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-11T07:20:06.000Z", "contentLength": 122955, "httpStatusCode": 200}', 'e3586731-358b-4dc8-9afd-ecf7182a273d', NULL, '{}'),
	('57e4ea49-22a2-4b85-ae61-2075ea93cdad', 'student-documents', '5f30cb34-1e54-4ed7-be48-7423024d98b8/utility_bill/blog-101.png', NULL, '2025-08-11 07:20:01.477668+00', '2025-08-25 06:51:49.533459+00', '2025-08-11 07:20:01.477668+00', '{"eTag": "\"bba9cc3f46c15bf064f16d0eecaf418b\"", "size": 1921653, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-08-11T07:20:02.000Z", "contentLength": 1921653, "httpStatusCode": 200}', '26820987-f667-4e5f-972f-f6b4ef49a711', NULL, '{}'),
	('d62cac80-b296-40a3-90a4-78a32ab11997', 'student-documents', '5f30cb34-1e54-4ed7-be48-7423024d98b8/visa/Gold-Studio-Urban-Hub-Student-Accommodation-4-scaled.webp', NULL, '2025-08-11 07:20:04.950794+00', '2025-08-25 06:51:49.533459+00', '2025-08-11 07:20:04.950794+00', '{"eTag": "\"bd7382923ca7ec7d1cd79e4d29c64d13\"", "size": 296786, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-08-11T07:20:05.000Z", "contentLength": 296786, "httpStatusCode": 200}', '578c7606-a0ac-4279-a82e-739228ccb901', NULL, '{}'),
	('c06e1492-26d3-46e0-9ae4-e63c5a63a148', 'student-documents', '730f7357-9441-46c2-b50e-af42cc2c5ce6/bank_statement/Urban Hub studio data - urbanhubrms (1).xlsx', NULL, '2025-08-08 12:06:12.347348+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 12:06:12.347348+00', '{"eTag": "\"7f41c22692f0ad418f2e35c82cba8011\"", "size": 37935, "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T12:06:13.000Z", "contentLength": 37935, "httpStatusCode": 200}', '67760350-ae5c-4e51-b49b-a1eec3aa7515', NULL, '{}'),
	('7e13f5b7-f673-40db-a10f-e6ddc5b17800', 'student-documents', '730f7357-9441-46c2-b50e-af42cc2c5ce6/guarantor_id/studios_import_template (1).csv', NULL, '2025-08-08 12:06:11.476015+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 12:06:11.476015+00', '{"eTag": "\"a34d61e8367a180a3526673743cbd303\"", "size": 84, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T12:06:12.000Z", "contentLength": 84, "httpStatusCode": 200}', '4680f5de-d21b-4fbb-a172-133acf7a2dfc', NULL, '{}'),
	('bef3b8e2-acf2-44f8-84ac-7a26c8005522', 'student-documents', '730f7357-9441-46c2-b50e-af42cc2c5ce6/passport/Urban Hub studio data - urbanhubrms (2).xlsx', NULL, '2025-08-08 12:06:09.933592+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 12:06:09.933592+00', '{"eTag": "\"7f41c22692f0ad418f2e35c82cba8011\"", "size": 37935, "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T12:06:10.000Z", "contentLength": 37935, "httpStatusCode": 200}', 'a6cb00a1-4642-4b0c-a35e-2f96c96248f1', NULL, '{}'),
	('3ce1e38e-645b-4f3f-bdb3-f64d783e8ce6', 'student-documents', '730f7357-9441-46c2-b50e-af42cc2c5ce6/proof_of_income/Urban Hub studio data - urbanhubrms (1).xlsx', NULL, '2025-08-08 12:06:12.766627+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 12:06:12.766627+00', '{"eTag": "\"7f41c22692f0ad418f2e35c82cba8011\"", "size": 37935, "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T12:06:13.000Z", "contentLength": 37935, "httpStatusCode": 200}', 'f6f6b0ac-8a4d-4157-87f0-a84195718530', NULL, '{}'),
	('96c00e40-c5c8-4899-b707-981afaaf25e9', 'student-documents', '730f7357-9441-46c2-b50e-af42cc2c5ce6/utility_bill/studios_import_template (1).csv', NULL, '2025-08-08 12:06:11.154687+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 12:06:11.154687+00', '{"eTag": "\"a34d61e8367a180a3526673743cbd303\"", "size": 84, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T12:06:12.000Z", "contentLength": 84, "httpStatusCode": 200}', '1ff4cae4-bd66-437f-b536-1e5181e1d216', NULL, '{}'),
	('104e7a0a-aa44-4430-be4b-ed368af16290', 'student-documents', '730f7357-9441-46c2-b50e-af42cc2c5ce6/visa/Urban Hub studio data - urbanhubrms (1).xlsx', NULL, '2025-08-08 12:06:10.427489+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 12:06:10.427489+00', '{"eTag": "\"7f41c22692f0ad418f2e35c82cba8011\"", "size": 37935, "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T12:06:11.000Z", "contentLength": 37935, "httpStatusCode": 200}', '36e6a455-c0c7-4adc-bb95-40aad12e8840', NULL, '{}'),
	('4dbb6071-a218-4cfa-b40d-9908b300ccff', 'student-documents', '8bdc5bf1-2ebb-4753-8c0b-9565e3905e0c/bank_statement/WhatsApp Image 2025-08-08 at 11.02.15.jpeg', NULL, '2025-08-08 13:55:44.542728+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 13:55:44.542728+00', '{"eTag": "\"455363360fbc508ddc36321c2fecf22e\"", "size": 50987, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T13:55:45.000Z", "contentLength": 50987, "httpStatusCode": 200}', '04e7e26f-c494-44df-868f-a69c4b8861f0', NULL, '{}'),
	('93899dcd-c664-4de6-8362-2bd1cfc3a6cf', 'student-documents', '8bdc5bf1-2ebb-4753-8c0b-9565e3905e0c/guarantor_id/WhatsApp Image 2025-08-08 at 11.02.15.jpeg', NULL, '2025-08-08 13:55:45.710383+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 13:55:45.710383+00', '{"eTag": "\"455363360fbc508ddc36321c2fecf22e\"", "size": 50987, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T13:55:46.000Z", "contentLength": 50987, "httpStatusCode": 200}', '55763982-02e7-47a6-a3e0-96499e6bed52', NULL, '{}'),
	('2b90caeb-a5d6-4b57-8d26-a955e80e1c86', 'student-documents', '8bdc5bf1-2ebb-4753-8c0b-9565e3905e0c/passport/WhatsApp Image 2025-08-08 at 11.02.15.jpeg', NULL, '2025-08-08 13:55:43.417004+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 13:55:43.417004+00', '{"eTag": "\"455363360fbc508ddc36321c2fecf22e\"", "size": 50987, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T13:55:44.000Z", "contentLength": 50987, "httpStatusCode": 200}', 'd9875323-ccd8-4343-874c-4913ae92b184', NULL, '{}'),
	('74226df2-bf02-48fd-8e5c-c99f964d191c', 'student-documents', '8bdc5bf1-2ebb-4753-8c0b-9565e3905e0c/proof_of_income/WhatsApp Image 2025-08-08 at 11.02.15.jpeg', NULL, '2025-08-08 13:55:46.068714+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 13:55:46.068714+00', '{"eTag": "\"455363360fbc508ddc36321c2fecf22e\"", "size": 50987, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T13:55:47.000Z", "contentLength": 50987, "httpStatusCode": 200}', 'a5907486-6254-492e-8a3f-697f2e6cb4da', NULL, '{}'),
	('508a10bb-7cc5-4ef1-b641-a46428e83c1a', 'student-documents', '8bdc5bf1-2ebb-4753-8c0b-9565e3905e0c/utility_bill/WhatsApp Image 2025-08-08 at 11.02.15.jpeg', NULL, '2025-08-08 13:55:44.19309+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 13:55:44.19309+00', '{"eTag": "\"455363360fbc508ddc36321c2fecf22e\"", "size": 50987, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T13:55:45.000Z", "contentLength": 50987, "httpStatusCode": 200}', '03884ba9-6f3f-486d-9dbf-a0fdb6a4c7fb', NULL, '{}'),
	('3489ec5c-e81b-4d97-b20e-920f45d6decf', 'student-documents', '8bdc5bf1-2ebb-4753-8c0b-9565e3905e0c/visa/WhatsApp Image 2025-08-08 at 11.02.15.jpeg', NULL, '2025-08-08 13:55:44.858099+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 13:55:44.858099+00', '{"eTag": "\"455363360fbc508ddc36321c2fecf22e\"", "size": 50987, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T13:55:45.000Z", "contentLength": 50987, "httpStatusCode": 200}', '428bae18-6a70-4fdc-befb-9ed99e2e36ca', NULL, '{}'),
	('e6ac658b-5ec0-44bc-8dfa-a8a34fe9a9fd', 'student-documents', 'ab8899ac-267b-41df-bedb-9bef781abe7e/proof_of_income/subscribers.csv', NULL, '2025-08-11 12:49:15.593517+00', '2025-08-25 06:51:49.533459+00', '2025-08-11 12:49:15.593517+00', '{"eTag": "\"0f46a3e8f8fd023bf52f947b62cea5b8\"", "size": 124, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-08-11T12:49:16.000Z", "contentLength": 124, "httpStatusCode": 200}', '0435ac59-5a48-44d7-bb35-8f06156fa44e', NULL, '{}'),
	('0c8bf7a0-d851-44bd-8fed-f4378d161e4e', 'student-documents', 'b11c34d5-e627-469e-b46e-c8f01f3cf6ba/bank_statement/WhatsApp Image 2025-08-08 at 11.02.15.jpeg', NULL, '2025-08-08 13:40:50.858709+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 13:40:50.858709+00', '{"eTag": "\"455363360fbc508ddc36321c2fecf22e\"", "size": 50987, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T13:40:51.000Z", "contentLength": 50987, "httpStatusCode": 200}', '0a1338c6-5644-4f7b-8e18-f518af7537d8', NULL, '{}'),
	('e44807b5-3242-47f7-9c4b-7d6578c85d8d', 'student-documents', 'b11c34d5-e627-469e-b46e-c8f01f3cf6ba/guarantor_id/WhatsApp Image 2025-08-08 at 11.02.15.jpeg', NULL, '2025-08-08 13:40:52.047831+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 13:40:52.047831+00', '{"eTag": "\"455363360fbc508ddc36321c2fecf22e\"", "size": 50987, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T13:40:52.000Z", "contentLength": 50987, "httpStatusCode": 200}', '1a754fdf-5208-4828-b6d5-34b16a086e30', NULL, '{}'),
	('bbcf98bc-c89c-46eb-b2fa-a68cfd3fec1f', 'student-documents', 'b11c34d5-e627-469e-b46e-c8f01f3cf6ba/passport/WhatsApp Image 2025-08-08 at 11.02.15.jpeg', NULL, '2025-08-08 13:40:49.658649+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 13:40:49.658649+00', '{"eTag": "\"455363360fbc508ddc36321c2fecf22e\"", "size": 50987, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T13:40:50.000Z", "contentLength": 50987, "httpStatusCode": 200}', '67453fef-7367-4115-a298-ce4ce26b7679', NULL, '{}'),
	('2f106aba-3b15-4a28-8269-a82932c49ce1', 'student-documents', 'b11c34d5-e627-469e-b46e-c8f01f3cf6ba/proof_of_income/WhatsApp Image 2025-08-08 at 11.02.15.jpeg', NULL, '2025-08-08 13:40:51.163679+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 13:40:51.163679+00', '{"eTag": "\"455363360fbc508ddc36321c2fecf22e\"", "size": 50987, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T13:40:52.000Z", "contentLength": 50987, "httpStatusCode": 200}', '2aa59832-cf77-472c-9075-d7afa8f4cf65', NULL, '{}'),
	('eed1b42a-fd51-46c8-a872-2a235b19650c', 'student-documents', 'b11c34d5-e627-469e-b46e-c8f01f3cf6ba/utility_bill/WhatsApp Image 2025-08-08 at 11.02.15.jpeg', NULL, '2025-08-08 13:40:50.565704+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 13:40:50.565704+00', '{"eTag": "\"455363360fbc508ddc36321c2fecf22e\"", "size": 50987, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T13:40:51.000Z", "contentLength": 50987, "httpStatusCode": 200}', '50649e79-e03a-4946-9eca-fedda85ffce6', NULL, '{}'),
	('48aaff59-39e0-44fa-b026-ad49282b16c4', 'student-documents', 'b11c34d5-e627-469e-b46e-c8f01f3cf6ba/visa/WhatsApp Image 2025-08-08 at 11.02.15.jpeg', NULL, '2025-08-08 13:40:52.564903+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 13:40:52.564903+00', '{"eTag": "\"455363360fbc508ddc36321c2fecf22e\"", "size": 50987, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T13:40:53.000Z", "contentLength": 50987, "httpStatusCode": 200}', '3defe15a-13f6-4a19-b7c1-f7d1d19d84d7', NULL, '{}'),
	('2421820e-7658-4dba-a3cc-445e74cd13e0', 'student-documents', 'd24d4984-47cf-4e21-8a11-ba1c049706b1/bank_statement/studios_import_template (1).csv', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 07:22:22.684387+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 07:22:22.684387+00', '{"eTag": "\"a34d61e8367a180a3526673743cbd303\"", "size": 84, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T07:22:23.000Z", "contentLength": 84, "httpStatusCode": 200}', '50b32942-6c2c-45da-b383-1c0baf70eb6a', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('5ffc832c-5f5c-48f2-b26b-f49117ed2537', 'student-documents', 'd24d4984-47cf-4e21-8a11-ba1c049706b1/guarantor_id/studios_import_template (1).csv', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 07:22:23.246503+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 07:22:23.246503+00', '{"eTag": "\"a34d61e8367a180a3526673743cbd303\"", "size": 84, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T07:22:24.000Z", "contentLength": 84, "httpStatusCode": 200}', '295e6f4f-5db5-435b-aa2b-e8f9a783febc', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('a4656c34-502b-4640-b315-c89679d6867b', 'student-documents', 'd24d4984-47cf-4e21-8a11-ba1c049706b1/passport/Urban Hub studio data - urbanhubrms (2).xlsx', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 07:22:20.940833+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 07:22:20.940833+00', '{"eTag": "\"7f41c22692f0ad418f2e35c82cba8011\"", "size": 37935, "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T07:22:21.000Z", "contentLength": 37935, "httpStatusCode": 200}', '8b8dfa9a-23ec-4d90-b7b8-7f10260013bb', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('599a5269-0374-4b58-a440-4ecbb5bbda3e', 'student-documents', 'd24d4984-47cf-4e21-8a11-ba1c049706b1/proof_of_income/WhatsApp Image 2025-08-08 at 11.02.15.jpeg', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 07:22:23.586467+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 07:22:23.586467+00', '{"eTag": "\"455363360fbc508ddc36321c2fecf22e\"", "size": 50987, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T07:22:24.000Z", "contentLength": 50987, "httpStatusCode": 200}', 'b6e74840-9173-483d-a67e-39a0d47550b5', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('697aa28f-43fa-4bf6-a5dd-ac87d363f6f8', 'student-documents', 'd24d4984-47cf-4e21-8a11-ba1c049706b1/utility_bill/Urban Hub studio data - urbanhubrms (2).xlsx', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 07:22:21.957732+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 07:22:21.957732+00', '{"eTag": "\"7f41c22692f0ad418f2e35c82cba8011\"", "size": 37935, "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T07:22:22.000Z", "contentLength": 37935, "httpStatusCode": 200}', 'e26ceb2d-cc82-49f8-bff4-80c897956450', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('cb1a0e0e-2285-4866-943a-7af5f1875c49', 'student-documents', 'd24d4984-47cf-4e21-8a11-ba1c049706b1/visa/studios_import_template (1).csv', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 07:22:22.970667+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 07:22:22.970667+00', '{"eTag": "\"a34d61e8367a180a3526673743cbd303\"", "size": 84, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T07:22:23.000Z", "contentLength": 84, "httpStatusCode": 200}', '8d1c3a92-05c8-4f89-9635-bc4bcaaa3b6d', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('ebf49b8c-5e56-44e7-ab2f-a4c8e82cac54', 'student-documents', 'd42015d2-f793-49c8-b085-f576a3b82352/bank_statement/Urban Hub studio data - urbanhubrms (1).xlsx', NULL, '2025-08-08 10:22:15.907319+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 10:22:15.907319+00', '{"eTag": "\"7f41c22692f0ad418f2e35c82cba8011\"", "size": 37935, "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T10:22:16.000Z", "contentLength": 37935, "httpStatusCode": 200}', 'fa52a75c-47b8-4ca9-a536-3f8cf28e4f9a', NULL, '{}'),
	('f623eb6e-a147-4628-be27-0b8b9c265e9c', 'student-documents', 'd42015d2-f793-49c8-b085-f576a3b82352/guarantor_id/Urban Hub studio data - urbanhubrms (1).xlsx', NULL, '2025-08-08 10:22:15.285135+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 10:22:15.285135+00', '{"eTag": "\"7f41c22692f0ad418f2e35c82cba8011\"", "size": 37935, "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T10:22:16.000Z", "contentLength": 37935, "httpStatusCode": 200}', '1ecd5a73-8b5c-42f7-b7e3-cc70e564d013', NULL, '{}'),
	('a5acaefe-bfbc-493c-bf43-b3849fd91437', 'student-documents', 'd42015d2-f793-49c8-b085-f576a3b82352/passport/a-clean-minimalist-dashboard-interface-d__e_B0LwTReuCxjB-65xewQ_xqbHhOFISSyWtKCX7wtg-w.jpeg', NULL, '2025-08-08 10:22:12.743305+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 10:22:12.743305+00', '{"eTag": "\"728c58da41f4c0fd83fda3735062ed32\"", "size": 63487, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T10:22:13.000Z", "contentLength": 63487, "httpStatusCode": 200}', 'b6476f62-34d8-4544-8436-5d3f5e413083', NULL, '{}'),
	('ed4c0ef5-5d6d-45b9-b804-2ff77a908666', 'student-documents', 'd42015d2-f793-49c8-b085-f576a3b82352/proof_of_income/Urban Hub studio data - urbanhubrms (1).xlsx', NULL, '2025-08-08 10:22:15.594578+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 10:22:15.594578+00', '{"eTag": "\"7f41c22692f0ad418f2e35c82cba8011\"", "size": 37935, "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T10:22:16.000Z", "contentLength": 37935, "httpStatusCode": 200}', '690340d7-a556-47c7-973c-b7b37b412779', NULL, '{}'),
	('0aa08611-76e9-4d3e-a19d-51778449bc70', 'student-documents', 'd42015d2-f793-49c8-b085-f576a3b82352/utility_bill/Urban Hub studio data - urbanhubrms (1).xlsx', NULL, '2025-08-08 10:22:14.370119+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 10:22:14.370119+00', '{"eTag": "\"7f41c22692f0ad418f2e35c82cba8011\"", "size": 37935, "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T10:22:15.000Z", "contentLength": 37935, "httpStatusCode": 200}', 'fd3479e2-7d40-4c8a-bb82-1b566240461a', NULL, '{}'),
	('f910f4ad-6d71-4f99-a711-27cc1bee8414', 'student-documents', 'd42015d2-f793-49c8-b085-f576a3b82352/visa/Urban Hub studio data - urbanhubrms.xlsx', NULL, '2025-08-08 10:22:13.674469+00', '2025-08-25 06:51:49.533459+00', '2025-08-08 10:22:13.674469+00', '{"eTag": "\"7f41c22692f0ad418f2e35c82cba8011\"", "size": 37935, "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "cacheControl": "max-age=3600", "lastModified": "2025-08-08T10:22:14.000Z", "contentLength": 37935, "httpStatusCode": 200}', '403383bb-726c-40c7-a0fe-a00e984d6989', NULL, '{}'),
	('a439064c-c5f0-4cd5-bdc0-df655b8ce984', 'student-documents', 'e2cf48cb-a8ab-4d6e-920c-781d1d4b86e5/bank_statement/WhatsApp Image 2025-08-08 at 11.02.15.jpeg', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 06:56:36.594452+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 06:56:36.594452+00', '{"eTag": "\"455363360fbc508ddc36321c2fecf22e\"", "size": 50987, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T06:56:37.000Z", "contentLength": 50987, "httpStatusCode": 200}', 'f47083fc-94e5-4e38-a7cd-b191061483d1', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('2b764d30-8811-45b6-9e38-2a3912044bcb', 'student-documents', 'e2cf48cb-a8ab-4d6e-920c-781d1d4b86e5/guarantor_id/Urban Hub studio data - urbanhubrms (2).xlsx', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 06:56:37.50925+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 06:56:37.50925+00', '{"eTag": "\"7f41c22692f0ad418f2e35c82cba8011\"", "size": 37935, "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T06:56:38.000Z", "contentLength": 37935, "httpStatusCode": 200}', 'b8371363-9ea4-43f7-9bdd-dd9af5a14dc9', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('11f7dbea-f05e-49f7-ac13-197909c1a94c', 'student-documents', 'e2cf48cb-a8ab-4d6e-920c-781d1d4b86e5/passport/WhatsApp Image 2025-08-08 at 11.02.15.jpeg', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 06:56:34.90202+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 06:56:34.90202+00', '{"eTag": "\"455363360fbc508ddc36321c2fecf22e\"", "size": 50987, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T06:56:35.000Z", "contentLength": 50987, "httpStatusCode": 200}', '4551904e-a3b9-4455-8134-f31710448d12', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('bd0bb179-e443-47cd-9b2a-86a81ae174a3', 'student-documents', 'e2cf48cb-a8ab-4d6e-920c-781d1d4b86e5/proof_of_income/studios_import_template (1).csv', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 06:56:37.776663+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 06:56:37.776663+00', '{"eTag": "\"a34d61e8367a180a3526673743cbd303\"", "size": 84, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T06:56:38.000Z", "contentLength": 84, "httpStatusCode": 200}', 'e1bb4a87-ef85-46c9-b9b5-dd1b43eeec59', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('cb713247-d933-4a70-adde-f08a48362dac', 'student-documents', 'e2cf48cb-a8ab-4d6e-920c-781d1d4b86e5/utility_bill/WhatsApp Image 2025-08-08 at 11.02.15.jpeg', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 06:56:35.739607+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 06:56:35.739607+00', '{"eTag": "\"455363360fbc508ddc36321c2fecf22e\"", "size": 50987, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T06:56:36.000Z", "contentLength": 50987, "httpStatusCode": 200}', '05a65825-5eb2-43c9-b2e4-f6267268bae7', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('dbbb4fc4-fe77-4c58-a376-ad712b3c85e9', 'student-documents', 'e2cf48cb-a8ab-4d6e-920c-781d1d4b86e5/visa/Urban Hub studio data - urbanhubrms (2).xlsx', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 06:56:36.893401+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 06:56:36.893401+00', '{"eTag": "\"7f41c22692f0ad418f2e35c82cba8011\"", "size": 37935, "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T06:56:37.000Z", "contentLength": 37935, "httpStatusCode": 200}', 'c27f479e-d95f-43c7-854a-6899a050e6c5', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('8ecceae6-0c33-4376-8154-c4ecd7be7fec', 'student-documents', 'ffe6af36-6254-4434-b6e0-83c0382cb132/bank_statement/1754284418825_ticqe2g2l.json', NULL, '2025-08-12 06:59:35.658614+00', '2025-08-25 06:51:49.533459+00', '2025-08-12 06:59:35.658614+00', '{"eTag": "\"6b4a1f617bfbd1bd63c46c41105970ac\"", "size": 358, "mimetype": "application/json", "cacheControl": "max-age=3600", "lastModified": "2025-08-12T06:59:36.000Z", "contentLength": 358, "httpStatusCode": 200}', 'bc36c909-898b-441d-bd92-b4b9ba036b0b', NULL, '{}'),
	('be5e4c7e-5bff-4832-9543-74da9f78dd47', 'student-documents', 'ffe6af36-6254-4434-b6e0-83c0382cb132/guarantor_id/a-clean-minimalist-dashboard-interface-d__e_B0LwTReuCxjB-65xewQ_xqbHhOFISSyWtKCX7wtg-w.jpeg', NULL, '2025-08-12 06:59:36.611013+00', '2025-08-25 06:51:49.533459+00', '2025-08-12 06:59:36.611013+00', '{"eTag": "\"728c58da41f4c0fd83fda3735062ed32\"", "size": 63487, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-12T06:59:37.000Z", "contentLength": 63487, "httpStatusCode": 200}', '168eca19-6560-4eb9-91fa-71147e3160d3', NULL, '{}'),
	('0d425759-bab2-47c6-b88f-abbd41424abf', 'student-documents', 'ffe6af36-6254-4434-b6e0-83c0382cb132/passport/studios_import_template (1).csv', NULL, '2025-08-12 06:59:34.598883+00', '2025-08-25 06:51:49.533459+00', '2025-08-12 06:59:34.598883+00', '{"eTag": "\"a34d61e8367a180a3526673743cbd303\"", "size": 84, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-08-12T06:59:35.000Z", "contentLength": 84, "httpStatusCode": 200}', '9eab0377-8795-4dae-aaf4-363ec60b1264', NULL, '{}'),
	('a373c807-ec80-42b3-ae73-40c4d570da33', 'student-documents', 'ffe6af36-6254-4434-b6e0-83c0382cb132/proof_of_income/a-clean-minimalist-dashboard-interface-d__e_B0LwTReuCxjB-65xewQ_xqbHhOFISSyWtKCX7wtg-w.jpeg', NULL, '2025-08-12 06:59:38.600087+00', '2025-08-25 06:51:49.533459+00', '2025-08-12 06:59:38.600087+00', '{"eTag": "\"728c58da41f4c0fd83fda3735062ed32\"", "size": 63487, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-12T06:59:39.000Z", "contentLength": 63487, "httpStatusCode": 200}', '923775a1-a823-4907-910d-7a5979063ccf', NULL, '{}'),
	('c3d06db1-b6d1-48f3-96b1-a9770d9604f4', 'student-documents', 'ffe6af36-6254-4434-b6e0-83c0382cb132/utility_bill/studios_import_template.csv', NULL, '2025-08-12 06:59:35.333007+00', '2025-08-25 06:51:49.533459+00', '2025-08-12 06:59:35.333007+00', '{"eTag": "\"a34d61e8367a180a3526673743cbd303\"", "size": 84, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-08-12T06:59:36.000Z", "contentLength": 84, "httpStatusCode": 200}', '0e5bbc57-0a39-45bd-9f59-5752e65877bb', NULL, '{}'),
	('44f57c86-6c10-4e62-a9ae-72c586486960', 'student-documents', 'ffe6af36-6254-4434-b6e0-83c0382cb132/visa/ChatGPT Image Aug 6, 2025, 11_41_33 PM.png', NULL, '2025-08-12 06:59:38.210582+00', '2025-08-25 06:51:49.533459+00', '2025-08-12 06:59:38.210582+00', '{"eTag": "\"b5da7ca195b483c6d5a3a1a067d4d3f5\"", "size": 2146617, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-08-12T06:59:39.000Z", "contentLength": 2146617, "httpStatusCode": 200}', 'd562fd1d-16e1-41df-b924-5a8571fcf931', NULL, '{}'),
	('f89dad3d-8bf5-440d-9c16-98aefcd8bd92', 'iska-rms-files', 'general/1754737714660_jpeugonzk.jpg', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 11:08:34.832765+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 11:08:34.832765+00', '{"eTag": "\"e34d1c7d06fa61ed0f30417ca0677933\"", "size": 95628, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T11:08:35.000Z", "contentLength": 95628, "httpStatusCode": 200}', '447e3983-9f4a-408d-b4c8-1e73b5987b36', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('c880930a-6087-4dc3-858d-dab67d886e1a', 'iska-rms-files', 'general/1754737716102_4jevulzpg.jpeg', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 11:08:36.026909+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 11:08:36.026909+00', '{"eTag": "\"455363360fbc508ddc36321c2fecf22e\"", "size": 50987, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T11:08:36.000Z", "contentLength": 50987, "httpStatusCode": 200}', 'e7b581d9-9417-4f80-b7b8-1a506e2d3184', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('2df42eec-917e-4a92-a315-237c9871742e', 'iska-rms-files', 'general/1754737717128_8pe0u8lwl.jpeg', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 11:08:37.126615+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 11:08:37.126615+00', '{"eTag": "\"728c58da41f4c0fd83fda3735062ed32\"", "size": 63487, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T11:08:38.000Z", "contentLength": 63487, "httpStatusCode": 200}', '908154b7-57c7-4f51-b9a1-bbbe4b36437b', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('de0760f6-0d6d-47a4-8e4a-eaa22ffe70f6', 'iska-rms-files', 'general/1754737718272_ru72phram.png', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 11:08:38.899211+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 11:08:38.899211+00', '{"eTag": "\"b496d17082156a9d366e9834dcc78b2d\"", "size": 1416640, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T11:08:39.000Z", "contentLength": 1416640, "httpStatusCode": 200}', '317f47d2-9275-47fe-815b-c3f546d7622e', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('cd43d7a4-a876-49f6-874a-bb2a2d76f4fe', 'iska-rms-files', 'general/1754737720113_54qk0b03p.png', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 11:08:40.500634+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 11:08:40.500634+00', '{"eTag": "\"b5da7ca195b483c6d5a3a1a067d4d3f5\"", "size": 2146617, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T11:08:41.000Z", "contentLength": 2146617, "httpStatusCode": 200}', 'e87c8c23-fc84-4801-b2e1-a32367d94edb', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('3a9329a0-c11f-4373-81c4-70ae49aefc90', 'iska-rms-files', 'general/1754738892254_nfabwdg42.webp', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 11:28:13.043154+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 11:28:13.043154+00', '{"eTag": "\"bd7382923ca7ec7d1cd79e4d29c64d13\"", "size": 296786, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T11:28:13.000Z", "contentLength": 296786, "httpStatusCode": 200}', '9fc891e3-e8af-421d-aeb1-868180655108', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('945bdfba-38e6-4b9c-b505-73a58df597d4', 'iska-rms-files', 'general/1754738894208_l31shha4j.webp', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 11:28:14.454496+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 11:28:14.454496+00', '{"eTag": "\"1f3278f4bff6238e9059c9910adfebd0\"", "size": 232624, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T11:28:15.000Z", "contentLength": 232624, "httpStatusCode": 200}', 'f21a81d1-d89a-4328-b96c-6a580fc81352', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('65185341-7f4d-4111-bfac-d99c8dcc0c55', 'iska-rms-files', 'general/1754738895584_plebzi35f.jpg', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 11:28:15.145598+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 11:28:15.145598+00', '{"eTag": "\"005644442c8b80e131906e8e0414c896\"", "size": 122955, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T11:28:16.000Z", "contentLength": 122955, "httpStatusCode": 200}', '73dfccc6-5ccf-4e43-8a8d-9e6068a74579', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('53c3b0a1-a78a-4c7a-bdf0-6289e3a2e37e', 'iska-rms-files', 'general/1754738896376_6c21kh0cw.png', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 11:28:17.391888+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 11:28:17.391888+00', '{"eTag": "\"bba9cc3f46c15bf064f16d0eecaf418b\"", "size": 1921653, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T11:28:18.000Z", "contentLength": 1921653, "httpStatusCode": 200}', '411711c6-0541-428b-a36a-6ec03fafdd16', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('87f53623-30d4-4b3f-9685-fe243a9f8f47', 'iska-rms-files', 'general/1754738898634_a9s8vzv3t.webp', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 11:28:18.201821+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 11:28:18.201821+00', '{"eTag": "\"20c01efa614ca1adf8f2f99a94a3a7cc\"", "size": 158452, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T11:28:19.000Z", "contentLength": 158452, "httpStatusCode": 200}', '218c74b8-2ab2-402a-b3f5-6fe964a3facd', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('7326bb48-9d0d-4ef1-aa9d-0b9fce5372d5', 'iska-rms-files', 'general/1754738899339_834rmnyyb.webp', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-09 11:28:18.952608+00', '2025-08-25 06:51:49.533459+00', '2025-08-09 11:28:18.952608+00', '{"eTag": "\"2320bad293a8e726c9f03b2a58d4cae1\"", "size": 349676, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T11:28:19.000Z", "contentLength": 349676, "httpStatusCode": 200}', '0d22a252-321b-441b-b189-448d2d982cdd', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('b205a017-42a8-4eba-911a-102d0ea31a2c', 'iska-rms-files', 'system_backup/1754284418825_ticqe2g2l.json', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 05:13:39.032613+00', '2025-08-25 06:51:49.533459+00', '2025-08-04 05:13:39.032613+00', '{"eTag": "\"6b4a1f617bfbd1bd63c46c41105970ac\"", "size": 358, "mimetype": "application/json", "cacheControl": "max-age=3600", "lastModified": "2025-08-04T05:13:39.000Z", "contentLength": 358, "httpStatusCode": 200}', 'a9b07fd9-9763-4255-9b18-b2ea9a19fc4c', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('61882b43-7f4c-4f45-b08f-b5f2578bb302', 'iska-rms-files', 'system_backup/1754285010308_3cbbjil8m.json', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 05:23:31.022969+00', '2025-08-25 06:51:49.533459+00', '2025-08-04 05:23:31.022969+00', '{"eTag": "\"0f4ff6fc7680eefb5c457344b8c2d633\"", "size": 347, "mimetype": "application/json", "cacheControl": "max-age=3600", "lastModified": "2025-08-04T05:23:31.000Z", "contentLength": 347, "httpStatusCode": 200}', '5c6dc700-5006-4665-a9f5-260d6a308a21', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('25de0f0f-3520-454f-9822-ffaa0ce5e805', 'iska-rms-files', 'system_backup/1754318767533_byiap4v12.json', '3c0e79b0-28b9-41ea-8586-b71566451233', '2025-08-04 14:46:08.315136+00', '2025-08-25 06:51:49.533459+00', '2025-08-04 14:46:08.315136+00', '{"eTag": "\"4d9f57957f79af3dec19c04f2c7c01c4\"", "size": 543, "mimetype": "application/json", "cacheControl": "max-age=3600", "lastModified": "2025-08-04T14:46:09.000Z", "contentLength": 543, "httpStatusCode": 200}', '9b4de13e-ca3e-4c5f-a6e1-61c2c9f28773', '3c0e79b0-28b9-41ea-8586-b71566451233', '{}'),
	('605dfc58-4a73-4bfa-bd9e-293e0392f753', 'student-documents', '3f36c3ea-c8ea-4aa9-b202-272d311da404/proof_of_income/HOLLARA.png', NULL, '2025-09-13 10:56:52.294039+00', '2025-09-13 10:56:52.294039+00', '2025-09-13 10:56:52.294039+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-13T10:56:53.000Z", "contentLength": 18187, "httpStatusCode": 200}', '8884b1c0-e2a3-499e-abc6-24f225d5c5b4', NULL, '{}'),
	('67593a5d-8fac-4689-8519-61e77dcff904', 'student-documents', '3f36c3ea-c8ea-4aa9-b202-272d311da404/bank_statement/HOLLARA.png', NULL, '2025-09-13 10:56:52.837802+00', '2025-09-13 10:56:52.837802+00', '2025-09-13 10:56:52.837802+00', '{"eTag": "\"eb2626fb974714aa20a02482dd76a6b8\"", "size": 18187, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-13T10:56:53.000Z", "contentLength": 18187, "httpStatusCode": 200}', '970a5814-f25d-4732-8d5d-e07e48ac5bef', NULL, '{}');


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin (REMOVED - table does not exist)
--

-- INSERT INTO "storage"."prefixes" ("bucket_id", "name", "created_at", "updated_at") VALUES (REMOVED - table does not exist)
----	('student-documents', '47656405-8c04-4a69-92e8-c6a3ebe0b19b', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '47656405-8c04-4a69-92e8-c6a3ebe0b19b/bank_statement', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '47656405-8c04-4a69-92e8-c6a3ebe0b19b/guarantor_id', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '47656405-8c04-4a69-92e8-c6a3ebe0b19b/passport', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '47656405-8c04-4a69-92e8-c6a3ebe0b19b/proof_of_income', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '47656405-8c04-4a69-92e8-c6a3ebe0b19b/utility_bill', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '47656405-8c04-4a69-92e8-c6a3ebe0b19b/visa', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '495d6446-9f33-4693-ba8e-1de893659e82', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '495d6446-9f33-4693-ba8e-1de893659e82/bank_statement', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '495d6446-9f33-4693-ba8e-1de893659e82/guarantor_id', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '495d6446-9f33-4693-ba8e-1de893659e82/passport', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '495d6446-9f33-4693-ba8e-1de893659e82/proof_of_income', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '495d6446-9f33-4693-ba8e-1de893659e82/utility_bill', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '495d6446-9f33-4693-ba8e-1de893659e82/visa', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '4e061cc3-f484-47ed-baac-074325591f5b', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '4e061cc3-f484-47ed-baac-074325591f5b/bank_statement', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '4e061cc3-f484-47ed-baac-074325591f5b/guarantor_id', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '4e061cc3-f484-47ed-baac-074325591f5b/passport', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '4e061cc3-f484-47ed-baac-074325591f5b/proof_of_income', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '4e061cc3-f484-47ed-baac-074325591f5b/utility_bill', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '4e061cc3-f484-47ed-baac-074325591f5b/visa', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '5f30cb34-1e54-4ed7-be48-7423024d98b8', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '5f30cb34-1e54-4ed7-be48-7423024d98b8/bank_statement', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '5f30cb34-1e54-4ed7-be48-7423024d98b8/guarantor_id', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '5f30cb34-1e54-4ed7-be48-7423024d98b8/passport', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '5f30cb34-1e54-4ed7-be48-7423024d98b8/proof_of_income', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '5f30cb34-1e54-4ed7-be48-7423024d98b8/utility_bill', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '5f30cb34-1e54-4ed7-be48-7423024d98b8/visa', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '730f7357-9441-46c2-b50e-af42cc2c5ce6', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '730f7357-9441-46c2-b50e-af42cc2c5ce6/bank_statement', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '730f7357-9441-46c2-b50e-af42cc2c5ce6/guarantor_id', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '730f7357-9441-46c2-b50e-af42cc2c5ce6/passport', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '730f7357-9441-46c2-b50e-af42cc2c5ce6/proof_of_income', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '730f7357-9441-46c2-b50e-af42cc2c5ce6/utility_bill', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '730f7357-9441-46c2-b50e-af42cc2c5ce6/visa', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '8bdc5bf1-2ebb-4753-8c0b-9565e3905e0c', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '8bdc5bf1-2ebb-4753-8c0b-9565e3905e0c/bank_statement', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '8bdc5bf1-2ebb-4753-8c0b-9565e3905e0c/guarantor_id', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '8bdc5bf1-2ebb-4753-8c0b-9565e3905e0c/passport', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '8bdc5bf1-2ebb-4753-8c0b-9565e3905e0c/proof_of_income', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '8bdc5bf1-2ebb-4753-8c0b-9565e3905e0c/utility_bill', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '8bdc5bf1-2ebb-4753-8c0b-9565e3905e0c/visa', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'ab8899ac-267b-41df-bedb-9bef781abe7e', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'ab8899ac-267b-41df-bedb-9bef781abe7e/bank_statement', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'ab8899ac-267b-41df-bedb-9bef781abe7e/guarantor_id', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'ab8899ac-267b-41df-bedb-9bef781abe7e/passport', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'ab8899ac-267b-41df-bedb-9bef781abe7e/proof_of_income', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'ab8899ac-267b-41df-bedb-9bef781abe7e/utility_bill', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'ab8899ac-267b-41df-bedb-9bef781abe7e/visa', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'b11c34d5-e627-469e-b46e-c8f01f3cf6ba', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'b11c34d5-e627-469e-b46e-c8f01f3cf6ba/bank_statement', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'b11c34d5-e627-469e-b46e-c8f01f3cf6ba/guarantor_id', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'b11c34d5-e627-469e-b46e-c8f01f3cf6ba/passport', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'b11c34d5-e627-469e-b46e-c8f01f3cf6ba/proof_of_income', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'b11c34d5-e627-469e-b46e-c8f01f3cf6ba/utility_bill', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'b11c34d5-e627-469e-b46e-c8f01f3cf6ba/visa', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'd24d4984-47cf-4e21-8a11-ba1c049706b1', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'd24d4984-47cf-4e21-8a11-ba1c049706b1/bank_statement', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'd24d4984-47cf-4e21-8a11-ba1c049706b1/guarantor_id', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'd24d4984-47cf-4e21-8a11-ba1c049706b1/passport', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'd24d4984-47cf-4e21-8a11-ba1c049706b1/proof_of_income', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'd24d4984-47cf-4e21-8a11-ba1c049706b1/utility_bill', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'd24d4984-47cf-4e21-8a11-ba1c049706b1/visa', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'd42015d2-f793-49c8-b085-f576a3b82352', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'd42015d2-f793-49c8-b085-f576a3b82352/bank_statement', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'd42015d2-f793-49c8-b085-f576a3b82352/guarantor_id', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'd42015d2-f793-49c8-b085-f576a3b82352/passport', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'd42015d2-f793-49c8-b085-f576a3b82352/proof_of_income', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'd42015d2-f793-49c8-b085-f576a3b82352/utility_bill', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'd42015d2-f793-49c8-b085-f576a3b82352/visa', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'e2cf48cb-a8ab-4d6e-920c-781d1d4b86e5', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'e2cf48cb-a8ab-4d6e-920c-781d1d4b86e5/bank_statement', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'e2cf48cb-a8ab-4d6e-920c-781d1d4b86e5/guarantor_id', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'e2cf48cb-a8ab-4d6e-920c-781d1d4b86e5/passport', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'e2cf48cb-a8ab-4d6e-920c-781d1d4b86e5/proof_of_income', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'e2cf48cb-a8ab-4d6e-920c-781d1d4b86e5/utility_bill', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'e2cf48cb-a8ab-4d6e-920c-781d1d4b86e5/visa', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'ffe6af36-6254-4434-b6e0-83c0382cb132', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'ffe6af36-6254-4434-b6e0-83c0382cb132/bank_statement', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'ffe6af36-6254-4434-b6e0-83c0382cb132/guarantor_id', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'ffe6af36-6254-4434-b6e0-83c0382cb132/passport', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'ffe6af36-6254-4434-b6e0-83c0382cb132/proof_of_income', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'ffe6af36-6254-4434-b6e0-83c0382cb132/utility_bill', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', 'ffe6af36-6254-4434-b6e0-83c0382cb132/visa', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('iska-rms-files', 'general', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('iska-rms-files', 'system_backup', '2025-08-25 06:51:49.374862+00', '2025-08-25 06:51:49.374862+00'),
--	('student-documents', '040a4f5c-e23e-4f17-b00f-1de2ad01f865', '2025-09-12 10:56:45.219476+00', '2025-09-12 10:56:45.219476+00'),
--	('student-documents', '040a4f5c-e23e-4f17-b00f-1de2ad01f865/passport', '2025-09-12 10:56:45.219476+00', '2025-09-12 10:56:45.219476+00'),
--	('student-documents', '040a4f5c-e23e-4f17-b00f-1de2ad01f865/utility_bill', '2025-09-12 10:56:45.603467+00', '2025-09-12 10:56:45.603467+00'),
--	('student-documents', '040a4f5c-e23e-4f17-b00f-1de2ad01f865/bank_statement', '2025-09-12 10:56:45.955216+00', '2025-09-12 10:56:45.955216+00'),
--	('student-documents', '040a4f5c-e23e-4f17-b00f-1de2ad01f865/visa', '2025-09-12 10:56:46.330527+00', '2025-09-12 10:56:46.330527+00'),
--	('student-documents', '040a4f5c-e23e-4f17-b00f-1de2ad01f865/guarantor_id', '2025-09-12 10:56:46.719741+00', '2025-09-12 10:56:46.719741+00'),
--	('student-documents', '040a4f5c-e23e-4f17-b00f-1de2ad01f865/proof_of_income', '2025-09-12 10:56:47.131934+00', '2025-09-12 10:56:47.131934+00'),
--	('student-documents', '051b1e2b-b798-4a91-804c-cfb2d7aa1494', '2025-09-12 11:41:53.416827+00', '2025-09-12 11:41:53.416827+00'),
--	('student-documents', '051b1e2b-b798-4a91-804c-cfb2d7aa1494/passport', '2025-09-12 11:41:53.416827+00', '2025-09-12 11:41:53.416827+00'),
--	('student-documents', '051b1e2b-b798-4a91-804c-cfb2d7aa1494/utility_bill', '2025-09-12 11:41:53.843044+00', '2025-09-12 11:41:53.843044+00'),
--	('student-documents', '051b1e2b-b798-4a91-804c-cfb2d7aa1494/bank_statement', '2025-09-12 11:41:54.387088+00', '2025-09-12 11:41:54.387088+00'),
--	('student-documents', '051b1e2b-b798-4a91-804c-cfb2d7aa1494/visa', '2025-09-12 11:41:54.800379+00', '2025-09-12 11:41:54.800379+00'),
--	('student-documents', '051b1e2b-b798-4a91-804c-cfb2d7aa1494/guarantor_id', '2025-09-12 11:41:55.199208+00', '2025-09-12 11:41:55.199208+00'),
--	('student-documents', '051b1e2b-b798-4a91-804c-cfb2d7aa1494/proof_of_income', '2025-09-12 11:41:55.576079+00', '2025-09-12 11:41:55.576079+00'),
--	('student-documents', 'c198c36b-d3a0-458d-a785-a4ecf5f86463', '2025-09-12 12:17:00.418918+00', '2025-09-12 12:17:00.418918+00'),
--	('student-documents', 'c198c36b-d3a0-458d-a785-a4ecf5f86463/passport', '2025-09-12 12:17:00.418918+00', '2025-09-12 12:17:00.418918+00'),
--	('student-documents', 'c198c36b-d3a0-458d-a785-a4ecf5f86463/utility_bill', '2025-09-12 12:17:01.000119+00', '2025-09-12 12:17:01.000119+00'),
--	('student-documents', 'c198c36b-d3a0-458d-a785-a4ecf5f86463/bank_statement', '2025-09-12 12:17:01.540647+00', '2025-09-12 12:17:01.540647+00'),
--	('student-documents', 'c198c36b-d3a0-458d-a785-a4ecf5f86463/visa', '2025-09-12 12:17:02.110606+00', '2025-09-12 12:17:02.110606+00'),
--	('student-documents', 'c198c36b-d3a0-458d-a785-a4ecf5f86463/guarantor_id', '2025-09-12 12:17:02.733835+00', '2025-09-12 12:17:02.733835+00'),
--	('student-documents', 'c198c36b-d3a0-458d-a785-a4ecf5f86463/proof_of_income', '2025-09-12 12:17:03.217215+00', '2025-09-12 12:17:03.217215+00'),
--	('student-documents', '58f1f95d-ed6c-45b4-9c22-f9f455a5393c', '2025-09-12 13:31:36.533402+00', '2025-09-12 13:31:36.533402+00'),
--	('student-documents', '58f1f95d-ed6c-45b4-9c22-f9f455a5393c/passport', '2025-09-12 13:31:36.533402+00', '2025-09-12 13:31:36.533402+00'),
--	('student-documents', '58f1f95d-ed6c-45b4-9c22-f9f455a5393c/utility_bill', '2025-09-12 13:31:37.060953+00', '2025-09-12 13:31:37.060953+00'),
--	('student-documents', '58f1f95d-ed6c-45b4-9c22-f9f455a5393c/bank_statement', '2025-09-12 13:31:37.512722+00', '2025-09-12 13:31:37.512722+00'),
--	('student-documents', '58f1f95d-ed6c-45b4-9c22-f9f455a5393c/visa', '2025-09-12 13:31:37.939319+00', '2025-09-12 13:31:37.939319+00'),
--	('student-documents', '58f1f95d-ed6c-45b4-9c22-f9f455a5393c/guarantor_id', '2025-09-12 13:31:38.482611+00', '2025-09-12 13:31:38.482611+00'),
--	('student-documents', '58f1f95d-ed6c-45b4-9c22-f9f455a5393c/proof_of_income', '2025-09-12 13:31:38.938083+00', '2025-09-12 13:31:38.938083+00'),
--	('student-documents', '4e756dec-fa0c-4a38-a9d3-c08ccbb9c005', '2025-09-12 15:26:37.356635+00', '2025-09-12 15:26:37.356635+00'),
--	('student-documents', '4e756dec-fa0c-4a38-a9d3-c08ccbb9c005/passport', '2025-09-12 15:26:37.356635+00', '2025-09-12 15:26:37.356635+00'),
--	('student-documents', '4e756dec-fa0c-4a38-a9d3-c08ccbb9c005/utility_bill', '2025-09-12 15:26:37.817665+00', '2025-09-12 15:26:37.817665+00'),
--	('student-documents', '4e756dec-fa0c-4a38-a9d3-c08ccbb9c005/bank_statement', '2025-09-12 15:26:38.285151+00', '2025-09-12 15:26:38.285151+00'),
--	('student-documents', '4e756dec-fa0c-4a38-a9d3-c08ccbb9c005/visa', '2025-09-12 15:26:38.760128+00', '2025-09-12 15:26:38.760128+00'),
--	('student-documents', '4e756dec-fa0c-4a38-a9d3-c08ccbb9c005/guarantor_id', '2025-09-12 15:26:39.22608+00', '2025-09-12 15:26:39.22608+00'),
--	('student-documents', '4e756dec-fa0c-4a38-a9d3-c08ccbb9c005/proof_of_income', '2025-09-12 15:26:39.675176+00', '2025-09-12 15:26:39.675176+00'),
--	('student-documents', '808a111c-e83c-4052-96c9-a98e1b3c3819', '2025-09-12 15:37:10.077294+00', '2025-09-12 15:37:10.077294+00'),
--	('student-documents', '808a111c-e83c-4052-96c9-a98e1b3c3819/passport', '2025-09-12 15:37:10.077294+00', '2025-09-12 15:37:10.077294+00'),
--	('student-documents', '808a111c-e83c-4052-96c9-a98e1b3c3819/utility_bill', '2025-09-12 15:37:10.568666+00', '2025-09-12 15:37:10.568666+00'),
--	('student-documents', '808a111c-e83c-4052-96c9-a98e1b3c3819/bank_statement', '2025-09-12 15:37:11.039362+00', '2025-09-12 15:37:11.039362+00'),
--	('student-documents', '808a111c-e83c-4052-96c9-a98e1b3c3819/proof_of_income', '2025-09-12 15:37:11.506505+00', '2025-09-12 15:37:11.506505+00'),
--	('student-documents', '808a111c-e83c-4052-96c9-a98e1b3c3819/guarantor_id', '2025-09-12 15:37:11.967131+00', '2025-09-12 15:37:11.967131+00'),
--	('student-documents', '808a111c-e83c-4052-96c9-a98e1b3c3819/visa', '2025-09-12 15:37:12.425275+00', '2025-09-12 15:37:12.425275+00'),
--	('student-documents', '87576f42-32c9-41a7-93f1-65bc433f5a75', '2025-09-13 10:38:05.882647+00', '2025-09-13 10:38:05.882647+00'),
--	('student-documents', '87576f42-32c9-41a7-93f1-65bc433f5a75/passport', '2025-09-13 10:38:05.882647+00', '2025-09-13 10:38:05.882647+00'),
--	('student-documents', '87576f42-32c9-41a7-93f1-65bc433f5a75/utility_bill', '2025-09-13 10:38:06.330606+00', '2025-09-13 10:38:06.330606+00'),
--	('student-documents', '87576f42-32c9-41a7-93f1-65bc433f5a75/bank_statement', '2025-09-13 10:38:06.846703+00', '2025-09-13 10:38:06.846703+00'),
--	('student-documents', '87576f42-32c9-41a7-93f1-65bc433f5a75/visa', '2025-09-13 10:38:07.325826+00', '2025-09-13 10:38:07.325826+00'),
--	('student-documents', '87576f42-32c9-41a7-93f1-65bc433f5a75/guarantor_id', '2025-09-13 10:38:07.730861+00', '2025-09-13 10:38:07.730861+00'),
--	('student-documents', '87576f42-32c9-41a7-93f1-65bc433f5a75/proof_of_income', '2025-09-13 10:38:08.248636+00', '2025-09-13 10:38:08.248636+00'),
--	('student-documents', 'ca0e3293-d832-4770-84ca-5061330603eb', '2025-09-13 10:50:40.036257+00', '2025-09-13 10:50:40.036257+00'),
--	('student-documents', 'ca0e3293-d832-4770-84ca-5061330603eb/proof_of_income', '2025-09-13 10:50:40.036257+00', '2025-09-13 10:50:40.036257+00'),
--	('student-documents', 'ca0e3293-d832-4770-84ca-5061330603eb/bank_statement', '2025-09-13 10:50:40.508124+00', '2025-09-13 10:50:40.508124+00'),
--	('student-documents', 'ca0e3293-d832-4770-84ca-5061330603eb/guarantor_id', '2025-09-13 10:50:40.930477+00', '2025-09-13 10:50:40.930477+00'),
--	('student-documents', 'ca0e3293-d832-4770-84ca-5061330603eb/utility_bill', '2025-09-13 10:50:41.368635+00', '2025-09-13 10:50:41.368635+00'),
--	('student-documents', 'ca0e3293-d832-4770-84ca-5061330603eb/visa', '2025-09-13 10:50:41.816354+00', '2025-09-13 10:50:41.816354+00'),
--	('student-documents', 'ca0e3293-d832-4770-84ca-5061330603eb/passport', '2025-09-13 10:50:42.240903+00', '2025-09-13 10:50:42.240903+00'),
--	('student-documents', '3f36c3ea-c8ea-4aa9-b202-272d311da404', '2025-09-13 10:56:49.797551+00', '2025-09-13 10:56:49.797551+00'),
--	('student-documents', '3f36c3ea-c8ea-4aa9-b202-272d311da404/passport', '2025-09-13 10:56:49.797551+00', '2025-09-13 10:56:49.797551+00'),
--	('student-documents', '3f36c3ea-c8ea-4aa9-b202-272d311da404/utility_bill', '2025-09-13 10:56:50.402443+00', '2025-09-13 10:56:50.402443+00'),
--	('student-documents', '3f36c3ea-c8ea-4aa9-b202-272d311da404/visa', '2025-09-13 10:56:50.992085+00', '2025-09-13 10:56:50.992085+00'),
--	('student-documents', '3f36c3ea-c8ea-4aa9-b202-272d311da404/guarantor_id', '2025-09-13 10:56:51.670733+00', '2025-09-13 10:56:51.670733+00'),
--	('student-documents', '3f36c3ea-c8ea-4aa9-b202-272d311da404/proof_of_income', '2025-09-13 10:56:52.294039+00', '2025-09-13 10:56:52.294039+00'),
--	('student-documents', '3f36c3ea-c8ea-4aa9-b202-272d311da404/bank_statement', '2025-09-13 10:56:52.837802+00', '2025-09-13 10:56:52.837802+00'),
--	('student-documents', '9545fa2a-2249-4617-97de-ae2a4028f247', '2025-09-14 12:32:43.433119+00', '2025-09-14 12:32:43.433119+00'),
--	('student-documents', '9545fa2a-2249-4617-97de-ae2a4028f247/passport', '2025-09-14 12:32:43.433119+00', '2025-09-14 12:32:43.433119+00'),
--	('student-documents', '9545fa2a-2249-4617-97de-ae2a4028f247/utility_bill', '2025-09-14 12:32:44.018474+00', '2025-09-14 12:32:44.018474+00'),
--	('student-documents', '9545fa2a-2249-4617-97de-ae2a4028f247/bank_statement', '2025-09-14 12:32:44.503891+00', '2025-09-14 12:32:44.503891+00'),
--	('student-documents', '9545fa2a-2249-4617-97de-ae2a4028f247/visa', '2025-09-14 12:32:45.044268+00', '2025-09-14 12:32:45.044268+00'),
--	('student-documents', '9545fa2a-2249-4617-97de-ae2a4028f247/guarantor_id', '2025-09-14 12:32:45.622728+00', '2025-09-14 12:32:45.622728+00'),
--	('student-documents', '9545fa2a-2249-4617-97de-ae2a4028f247/proof_of_income', '2025-09-14 12:32:46.145109+00', '2025-09-14 12:32:46.145109+00'),
--	('student-documents', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24', '2025-09-14 15:22:22.589966+00', '2025-09-14 15:22:22.589966+00'),
--	('student-documents', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24/passport', '2025-09-14 15:22:22.589966+00', '2025-09-14 15:22:22.589966+00'),
--	('student-documents', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24/visa', '2025-09-14 15:22:23.300136+00', '2025-09-14 15:22:23.300136+00'),
--	('student-documents', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24/utility_bill', '2025-09-14 15:22:23.913827+00', '2025-09-14 15:22:23.913827+00'),
--	('student-documents', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24/guarantor_id', '2025-09-14 15:22:24.50621+00', '2025-09-14 15:22:24.50621+00'),
--	('student-documents', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24/bank_statement', '2025-09-14 15:22:25.104264+00', '2025-09-14 15:22:25.104264+00'),
--	('student-documents', '4492ddcf-8db6-4b4a-b859-5cdbc5228b24/proof_of_income', '2025-09-14 15:22:25.729011+00', '2025-09-14 15:22:25.729011+00');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 58, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Debian 16.8-1.pgdg120+1)
-- Dumped by pg_dump version 16.9 (Debian 16.9-1.pgdg120+1)

-- Started on 2025-08-09 05:36:12 UTC

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

DROP DATABASE IF EXISTS railway;
--
-- TOC entry 3625 (class 1262 OID 16384)
-- Name: railway; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE railway WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


\connect railway

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
-- TOC entry 5 (class 2615 OID 16751)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- TOC entry 3626 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 861 (class 1247 OID 16753)
-- Name: ApplicationStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ApplicationStatus" AS ENUM (
    'PENDING_APPROVAL',
    'UNDER_REVIEW',
    'APPROVED',
    'REJECTED',
    'REQUIRES_INFO',
    'CANCELLED'
);


--
-- TOC entry 867 (class 1247 OID 16782)
-- Name: BillStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."BillStatus" AS ENUM (
    'PENDING',
    'OVERDUE',
    'SUSPENDED',
    'PAID',
    'CANCELLED',
    'PARTIAL_PAYMENT'
);


--
-- TOC entry 870 (class 1247 OID 16796)
-- Name: BillType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."BillType" AS ENUM (
    'MONTHLY',
    'PRORATA',
    'SETUP',
    'CANCELLATION',
    'ADJUSTMENT'
);


--
-- TOC entry 879 (class 1247 OID 16836)
-- Name: EmailType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EmailType" AS ENUM (
    'WELCOME',
    'APPROVAL',
    'REJECTION',
    'ADMIN_NOTIFICATION',
    'INVOICE',
    'PAYMENT_CONFIRMATION',
    'PAYMENT_REMINDER',
    'SUSPENSION_WARNING',
    'SERVICE_ACTIVATION',
    'PASSWORD_RESET',
    'GENERAL'
);


--
-- TOC entry 873 (class 1247 OID 16808)
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'OZOW',
    'BANK_TRANSFER',
    'CREDIT_CARD',
    'DEBIT_ORDER',
    'CASH',
    'OTHER'
);


--
-- TOC entry 876 (class 1247 OID 16822)
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'CANCELLED',
    'REFUNDED'
);


--
-- TOC entry 864 (class 1247 OID 16766)
-- Name: ServiceStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ServiceStatus" AS ENUM (
    'NOT_ACTIVE',
    'PENDING_PAYMENT',
    'PENDING_INSTALLATION',
    'ACTIVE',
    'SUSPENDED',
    'CANCELLED',
    'TERMINATED'
);


--
-- TOC entry 930 (class 1247 OID 24578)
-- Name: WhatsAppMessageDirection; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."WhatsAppMessageDirection" AS ENUM (
    'INCOMING',
    'OUTGOING',
    'ESCALATION'
);


--
-- TOC entry 933 (class 1247 OID 24586)
-- Name: WhatsAppMessageStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."WhatsAppMessageStatus" AS ENUM (
    'PENDING',
    'SENT',
    'DELIVERED',
    'DEMO_SENT',
    'READ',
    'FAILED',
    'RECEIVED',
    'ESCALATED'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 229 (class 1259 OID 16993)
-- Name: accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts (
    id text NOT NULL,
    "userId" text NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp(3) without time zone,
    "refreshTokenExpiresAt" timestamp(3) without time zone,
    scope text,
    password text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 222 (class 1259 OID 16932)
-- Name: applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.applications (
    id text NOT NULL,
    "applicationNumber" text NOT NULL,
    "userId" text NOT NULL,
    "packageId" text NOT NULL,
    "serviceAddress" jsonb NOT NULL,
    "contactNumber" text NOT NULL,
    "preferredInstallDate" timestamp(3) without time zone,
    "specialRequirements" text,
    "idDocument" text,
    "proofOfResidence" text,
    status public."ApplicationStatus" DEFAULT 'PENDING_APPROVAL'::public."ApplicationStatus" NOT NULL,
    "submittedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "reviewedAt" timestamp(3) without time zone,
    "reviewedBy" text,
    "reviewNotes" text,
    "approvalReason" text,
    "rejectionReason" text,
    "adminComments" text,
    "serviceAvailable" boolean,
    "estimatedInstallDate" timestamp(3) without time zone
);


--
-- TOC entry 223 (class 1259 OID 16941)
-- Name: bills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bills (
    id text NOT NULL,
    "billNumber" text NOT NULL,
    "userId" text NOT NULL,
    "packageId" text,
    amount numeric(10,2) NOT NULL,
    "vatAmount" numeric(10,2) NOT NULL,
    "totalAmount" numeric(10,2) NOT NULL,
    "periodStart" timestamp(3) without time zone NOT NULL,
    "periodEnd" timestamp(3) without time zone NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    "billType" public."BillType" DEFAULT 'MONTHLY'::public."BillType" NOT NULL,
    description text,
    status public."BillStatus" DEFAULT 'PENDING'::public."BillStatus" NOT NULL,
    "paidAt" timestamp(3) without time zone,
    "suspensionDate" timestamp(3) without time zone,
    "paymentReference" text,
    "paymentMethod" text
);


--
-- TOC entry 232 (class 1259 OID 24619)
-- Name: data_consents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.data_consents (
    id text NOT NULL,
    "userId" text NOT NULL,
    "dataCategory" text NOT NULL,
    "processingPurpose" text NOT NULL,
    "legalBasis" text NOT NULL,
    "consentGiven" boolean NOT NULL,
    "consentDate" timestamp(3) without time zone NOT NULL,
    "withdrawnAt" timestamp(3) without time zone,
    "ipAddress" text NOT NULL,
    "userAgent" text NOT NULL,
    version text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 233 (class 1259 OID 24627)
-- Name: data_processing_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.data_processing_logs (
    id text NOT NULL,
    "userId" text NOT NULL,
    action text NOT NULL,
    "dataCategory" text NOT NULL,
    purpose text NOT NULL,
    "adminUser" text,
    "ipAddress" text NOT NULL,
    "userAgent" text NOT NULL,
    "dataFields" text NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 236 (class 1259 OID 24651)
-- Name: data_retention_policies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.data_retention_policies (
    id text NOT NULL,
    "dataCategory" text NOT NULL,
    "retentionPeriod" integer NOT NULL,
    "legalBasis" text NOT NULL,
    "autoDelete" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 227 (class 1259 OID 16977)
-- Name: documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.documents (
    id text NOT NULL,
    "orderId" text NOT NULL,
    type text NOT NULL,
    filename text NOT NULL,
    filepath text NOT NULL,
    filesize integer NOT NULL,
    mimetype text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 225 (class 1259 OID 16959)
-- Name: email_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_logs (
    id text NOT NULL,
    "userId" text,
    "adminEmail" text,
    "to" text NOT NULL,
    subject text NOT NULL,
    "emailType" public."EmailType" NOT NULL,
    status text NOT NULL,
    "brevoId" text,
    "brevoStatus" text,
    content text,
    error text,
    "sentAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deliveredAt" timestamp(3) without time zone
);


--
-- TOC entry 226 (class 1259 OID 16967)
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id text NOT NULL,
    "userId" text NOT NULL,
    "packageId" text NOT NULL,
    "promotionId" text,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "originalPrice" double precision NOT NULL,
    "discountAmount" double precision DEFAULT 0 NOT NULL,
    "finalPrice" double precision NOT NULL,
    "installationDate" timestamp(3) without time zone,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 220 (class 1259 OID 16908)
-- Name: package_urls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.package_urls (
    id text NOT NULL,
    "packageId" text NOT NULL,
    slug text NOT NULL,
    params text,
    "expiresAt" timestamp(3) without time zone,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 216 (class 1259 OID 16868)
-- Name: packages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.packages (
    id text NOT NULL,
    name text NOT NULL,
    "providerId" text NOT NULL,
    type text NOT NULL,
    speed text,
    data text,
    aup text,
    throttle text,
    "fupLimit" text,
    "throttleSpeed" text,
    "secondaryThrottleSpeed" text,
    "fupDescription" text,
    "specialTerms" text,
    technology text,
    coverage text,
    installation text,
    "basePrice" double precision NOT NULL,
    "currentPrice" double precision NOT NULL,
    active boolean DEFAULT true NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "promoBadge" text,
    "promoBadgeColor" text,
    "promoBadgeExpiryDate" timestamp(3) without time zone,
    "promoBadgeTimer" boolean DEFAULT false NOT NULL
);


--
-- TOC entry 224 (class 1259 OID 16950)
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id text NOT NULL,
    "billId" text,
    amount numeric(10,2) NOT NULL,
    reference text NOT NULL,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    "applicationId" text,
    "completedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    currency text DEFAULT 'ZAR'::text NOT NULL,
    description text,
    metadata jsonb,
    provider text DEFAULT 'ozow'::text NOT NULL,
    "providerStatus" text,
    "providerTransactionId" text,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text NOT NULL
);


--
-- TOC entry 217 (class 1259 OID 16878)
-- Name: price_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.price_history (
    id text NOT NULL,
    "packageId" text NOT NULL,
    "oldPrice" double precision NOT NULL,
    "newPrice" double precision NOT NULL,
    "changedBy" text NOT NULL,
    reason text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 218 (class 1259 OID 16886)
-- Name: promotions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.promotions (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    "packageId" text,
    "discountType" text NOT NULL,
    "discountValue" double precision NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "usageLimit" integer DEFAULT 1 NOT NULL,
    "timesUsed" integer DEFAULT 0 NOT NULL,
    "targetAudience" text,
    "userSpecific" text,
    "minimumOrders" integer,
    stackable boolean DEFAULT false NOT NULL,
    "autoApply" boolean DEFAULT false NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 215 (class 1259 OID 16859)
-- Name: providers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.providers (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    logo text,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 234 (class 1259 OID 24635)
-- Name: rica_communication_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rica_communication_logs (
    id text NOT NULL,
    "hashedFromNumber" text NOT NULL,
    "hashedToNumber" text NOT NULL,
    "messageHash" text NOT NULL,
    "communicationType" text NOT NULL,
    direction text NOT NULL,
    "messageLength" integer NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "retentionPeriod" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 235 (class 1259 OID 24643)
-- Name: security_audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.security_audit_logs (
    id text NOT NULL,
    "eventType" text NOT NULL,
    "userId" text,
    "ipAddress" text NOT NULL,
    "userAgent" text NOT NULL,
    success boolean NOT NULL,
    details jsonb,
    "riskLevel" text NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 228 (class 1259 OID 16985)
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id text NOT NULL,
    "userId" text NOT NULL,
    token text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 219 (class 1259 OID 16899)
-- Name: special_rates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.special_rates (
    id text NOT NULL,
    "packageId" text NOT NULL,
    "userId" text,
    email text,
    name text,
    "discountType" text NOT NULL,
    "discountValue" double precision NOT NULL,
    "expiresAt" timestamp(3) without time zone,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 221 (class 1259 OID 16917)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password text,
    "firstName" text,
    "lastName" text,
    name text,
    phone text,
    address text,
    city text,
    province text,
    "postalCode" text,
    "idNumber" text,
    "applicationStatus" public."ApplicationStatus" DEFAULT 'PENDING_APPROVAL'::public."ApplicationStatus" NOT NULL,
    "serviceStatus" public."ServiceStatus" DEFAULT 'NOT_ACTIVE'::public."ServiceStatus" NOT NULL,
    "applicationDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "approvedAt" timestamp(3) without time zone,
    "approvedBy" text,
    "rejectedAt" timestamp(3) without time zone,
    "rejectionReason" text,
    "activationDate" timestamp(3) without time zone,
    "serviceAddress" jsonb,
    "packageId" text,
    "installationNotes" text,
    "tempPassword" text,
    "mustChangePassword" boolean DEFAULT true NOT NULL,
    role text DEFAULT 'USER'::text NOT NULL,
    "emailVerified" boolean DEFAULT false NOT NULL,
    active boolean DEFAULT true NOT NULL,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 230 (class 1259 OID 17001)
-- Name: verifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verifications (
    id text NOT NULL,
    identifier text NOT NULL,
    token text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 231 (class 1259 OID 24607)
-- Name: whatsapp_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.whatsapp_messages (
    id text NOT NULL,
    "messageId" text NOT NULL,
    direction public."WhatsAppMessageDirection" NOT NULL,
    "fromNumber" text NOT NULL,
    "toNumber" text NOT NULL,
    "messageBody" text NOT NULL,
    "profileName" text,
    "whatsappId" text,
    status public."WhatsAppMessageStatus" DEFAULT 'PENDING'::public."WhatsAppMessageStatus" NOT NULL,
    "mediaCount" integer DEFAULT 0 NOT NULL,
    "mediaUrls" jsonb,
    "sentAt" timestamp(3) without time zone,
    "deliveredAt" timestamp(3) without time zone,
    "readAt" timestamp(3) without time zone,
    "receivedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text,
    "isAutoResponse" boolean DEFAULT false NOT NULL,
    escalated boolean DEFAULT false NOT NULL
);


--
-- TOC entry 3612 (class 0 OID 16993)
-- Dependencies: 229
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.accounts (id, "userId", "accountId", "providerId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") FROM stdin;
QVLakAI4OOU0foVAoncioBKMDMqopdxa	rSINEHGkXCRAsWpKbW554y0ZuhhBpOR0	rSINEHGkXCRAsWpKbW554y0ZuhhBpOR0	credential	\N	\N	\N	\N	\N	\N	c82be8b123417a62efd93a852097c663:b7755b226c8e91d05dffa554a9c691d02111f110154180ab9c3f21a04bdadb4b8d0cb9d8d2802c542381b9be2f91c472e378d2842143498de5c47057eb15c87b	2025-07-27 22:12:32.989	2025-07-27 22:12:32.989
RDUgOwmnQyI82hX6Asm4lluoyiYfioxY	aZ800ema4rtUqOoEureY8HISuL4Qavda	aZ800ema4rtUqOoEureY8HISuL4Qavda	credential	\N	\N	\N	\N	\N	\N	549e0e4845d2ca8c66e5ed18e356fd68:88a23b48b4680335a1be8debf8632450f76ee5e75e8b69a315c34f1f34299e5a8cd40502cebaff1344c1faaa5f3dddd8a1571ce85c75e251846f1afc0a9ec373	2025-07-30 19:22:13.214	2025-07-30 19:22:13.214
\.


--
-- TOC entry 3605 (class 0 OID 16932)
-- Dependencies: 222
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.applications (id, "applicationNumber", "userId", "packageId", "serviceAddress", "contactNumber", "preferredInstallDate", "specialRequirements", "idDocument", "proofOfResidence", status, "submittedAt", "reviewedAt", "reviewedBy", "reviewNotes", "approvalReason", "rejectionReason", "adminComments", "serviceAvailable", "estimatedInstallDate") FROM stdin;
cmdm9cqcp0007mt0f1j063veh	APP-1753655746920	cmdm9cqc10005mt0f7lxhc4g5	clearaccess_clearaccess_8_8mbps	{"city": "Groot Brak Rivier", "street": "325 DAHLIA, FRIEMERSHEIM", "province": "Western Cape", "postalCode": "6526", "fullAddress": "325 DAHLIA, FRIEMERSHEIM, Groot Brak Rivier, Western Cape 6526"}	0834409624	\N	\N	\N	\N	APPROVED	2025-07-27 22:35:46.922	2025-07-28 17:12:56.944	rSINEHGkXCRAsWpKbW554y0ZuhhBpOR0	\N	\N	\N	\N	\N	\N
cmdm95r5b0003mt0f5mv8gimp	APP-1753655421358	cmdm95r4z0001mt0f20dxwdr9	clearaccess_clearaccess_100_100mbps	{"city": "George Industria, George, WC", "street": "11 Brick road", "province": "Western Cape", "postalCode": "6530", "fullAddress": "11 Brick road, George Industria, George, WC, Western Cape 6530"}	0815082450	\N	\N	\N	\N	APPROVED	2025-07-27 22:30:21.359	2025-07-28 17:13:23.484	rSINEHGkXCRAsWpKbW554y0ZuhhBpOR0	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 3606 (class 0 OID 16941)
-- Dependencies: 223
-- Data for Name: bills; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.bills (id, "billNumber", "userId", "packageId", amount, "vatAmount", "totalAmount", "periodStart", "periodEnd", "dueDate", "billType", description, status, "paidAt", "suspensionDate", "paymentReference", "paymentMethod") FROM stdin;
\.


--
-- TOC entry 3615 (class 0 OID 24619)
-- Dependencies: 232
-- Data for Name: data_consents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.data_consents (id, "userId", "dataCategory", "processingPurpose", "legalBasis", "consentGiven", "consentDate", "withdrawnAt", "ipAddress", "userAgent", version, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 3616 (class 0 OID 24627)
-- Dependencies: 233
-- Data for Name: data_processing_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.data_processing_logs (id, "userId", action, "dataCategory", purpose, "adminUser", "ipAddress", "userAgent", "dataFields", "timestamp") FROM stdin;
\.


--
-- TOC entry 3619 (class 0 OID 24651)
-- Dependencies: 236
-- Data for Name: data_retention_policies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.data_retention_policies (id, "dataCategory", "retentionPeriod", "legalBasis", "autoDelete", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 3610 (class 0 OID 16977)
-- Dependencies: 227
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.documents (id, "orderId", type, filename, filepath, filesize, mimetype, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 3608 (class 0 OID 16959)
-- Dependencies: 225
-- Data for Name: email_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.email_logs (id, "userId", "adminEmail", "to", subject, "emailType", status, "brevoId", "brevoStatus", content, error, "sentAt", "deliveredAt") FROM stdin;
\.


--
-- TOC entry 3609 (class 0 OID 16967)
-- Dependencies: 226
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, "userId", "packageId", "promotionId", status, "originalPrice", "discountAmount", "finalPrice", "installationDate", notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 3603 (class 0 OID 16908)
-- Dependencies: 220
-- Data for Name: package_urls; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.package_urls (id, "packageId", slug, params, "expiresAt", active, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 3599 (class 0 OID 16868)
-- Dependencies: 216
-- Data for Name: packages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.packages (id, name, "providerId", type, speed, data, aup, throttle, "fupLimit", "throttleSpeed", "secondaryThrottleSpeed", "fupDescription", "specialTerms", technology, coverage, installation, "basePrice", "currentPrice", active, featured, "createdAt", "updatedAt", "promoBadge", "promoBadgeColor", "promoBadgeExpiryDate", "promoBadgeTimer") FROM stdin;
openserve_openserve_50_25mbps	Openserve 50/25Mbps	cmdlk6hc90000n82wks5nr708	FIBRE	50Mbps/25Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	525	525	t	f	2025-07-27 10:51:05.125	2025-07-27 10:51:05.125	\N	\N	\N	f
openserve_openserve_50_50mbps	Openserve 50/50Mbps	cmdlk6hc90000n82wks5nr708	FIBRE	50Mbps/50Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	765	765	t	f	2025-07-27 10:51:05.133	2025-07-27 10:51:05.133	\N	\N	\N	f
openserve_openserve_100_50mbps	Openserve 100/50Mbps	cmdlk6hc90000n82wks5nr708	FIBRE	100Mbps/50Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	865	865	t	f	2025-07-27 10:51:05.14	2025-07-27 10:51:05.14	\N	\N	\N	f
openserve_openserve_100_100mbps	Openserve 100/100Mbps	cmdlk6hc90000n82wks5nr708	FIBRE	100Mbps/100Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	965	965	t	f	2025-07-27 10:51:05.147	2025-07-27 10:51:05.147	\N	\N	\N	f
openserve_openserve_200_100mbps	Openserve 200/100Mbps	cmdlk6hc90000n82wks5nr708	FIBRE	200Mbps/100Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1105	1105	t	f	2025-07-27 10:51:05.154	2025-07-27 10:51:05.154	\N	\N	\N	f
openserve_openserve_200_200mbps	Openserve 200/200Mbps	cmdlk6hc90000n82wks5nr708	FIBRE	200Mbps/200Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1175	1175	t	f	2025-07-27 10:51:05.162	2025-07-27 10:51:05.162	\N	\N	\N	f
openserve_openserve_300_150mbps	Openserve 300/150Mbps	cmdlk6hc90000n82wks5nr708	FIBRE	300Mbps/150Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1335	1335	t	f	2025-07-27 10:51:05.169	2025-07-27 10:51:05.169	\N	\N	\N	f
openserve_openserve_500_250mbps	Openserve 500/250Mbps	cmdlk6hc90000n82wks5nr708	FIBRE	500Mbps/250Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1535	1535	t	f	2025-07-27 10:51:05.175	2025-07-27 10:51:05.175	\N	\N	\N	f
frogfoot_frogfoot_60_30mbps	Frogfoot 60/30Mbps	cmdlk6hco0001n82w6snjfe9g	FIBRE	60Mbps/30Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	619	619	t	f	2025-07-27 10:51:05.182	2025-07-27 10:51:05.182	\N	\N	\N	f
frogfoot_frogfoot_60_60mbps	Frogfoot 60/60Mbps	cmdlk6hco0001n82w6snjfe9g	FIBRE	60Mbps/60Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	755	755	t	f	2025-07-27 10:51:05.188	2025-07-27 10:51:05.188	\N	\N	\N	f
frogfoot_frogfoot_120_60mbps	Frogfoot 120/60Mbps	cmdlk6hco0001n82w6snjfe9g	FIBRE	120Mbps/60Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	780	780	t	f	2025-07-27 10:51:05.195	2025-07-27 10:51:05.195	\N	\N	\N	f
frogfoot_frogfoot_120_120mbps	Frogfoot 120/120Mbps	cmdlk6hco0001n82w6snjfe9g	FIBRE	120Mbps/120Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	880	880	t	f	2025-07-27 10:51:05.202	2025-07-27 10:51:05.202	\N	\N	\N	f
frogfoot_frogfoot_240_120mbps	Frogfoot 240/120Mbps	cmdlk6hco0001n82w6snjfe9g	FIBRE	240Mbps/120Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	980	980	t	f	2025-07-27 10:51:05.208	2025-07-27 10:51:05.208	\N	\N	\N	f
frogfoot_frogfoot_240_240mbps	Frogfoot 240/240Mbps	cmdlk6hco0001n82w6snjfe9g	FIBRE	240Mbps/240Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1140	1140	t	f	2025-07-27 10:51:05.215	2025-07-27 10:51:05.215	\N	\N	\N	f
frogfoot_frogfoot_400_200mbps	Frogfoot 400/200Mbps	cmdlk6hco0001n82w6snjfe9g	FIBRE	400Mbps/200Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1180	1180	t	f	2025-07-27 10:51:05.222	2025-07-27 10:51:05.222	\N	\N	\N	f
frogfoot_frogfoot_400_400mbps	Frogfoot 400/400Mbps	cmdlk6hco0001n82w6snjfe9g	FIBRE	400Mbps/400Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1335	1335	t	f	2025-07-27 10:51:05.23	2025-07-27 10:51:05.23	\N	\N	\N	f
frogfoot_frogfoot_1000_500mbps	Frogfoot 1000/500Mbps	cmdlk6hco0001n82w6snjfe9g	FIBRE	1000Mbps/500Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1540	1540	t	f	2025-07-27 10:51:05.237	2025-07-27 10:51:05.237	\N	\N	\N	f
frogfoot_frogfoot_1000_1000mbps	Frogfoot 1000/1000Mbps	cmdlk6hco0001n82w6snjfe9g	FIBRE	1000Mbps/1000Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1710	1710	t	f	2025-07-27 10:51:05.243	2025-07-27 10:51:05.243	\N	\N	\N	f
vuma_vuma_25_25mbps	Vuma 25/25Mbps	cmdlk6hcz0002n82w2pkzgv60	FIBRE	25Mbps/25Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	480	480	t	f	2025-07-27 10:51:05.254	2025-07-27 10:51:05.254	\N	\N	\N	f
vuma_vuma_50_25mbps	Vuma 50/25Mbps	cmdlk6hcz0002n82w2pkzgv60	FIBRE	50Mbps/25Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	594	594	t	f	2025-07-27 10:51:05.263	2025-07-27 10:51:05.263	\N	\N	\N	f
vuma_vuma_50_50mbps	Vuma 50/50Mbps	cmdlk6hcz0002n82w2pkzgv60	FIBRE	50Mbps/50Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	794	794	t	f	2025-07-27 10:51:05.27	2025-07-27 10:51:05.27	\N	\N	\N	f
vuma_vuma_100_50mbps	Vuma 100/50Mbps	cmdlk6hcz0002n82w2pkzgv60	FIBRE	100Mbps/50Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	794	794	t	f	2025-07-27 10:51:05.276	2025-07-27 10:51:05.276	\N	\N	\N	f
vuma_vuma_100_100mbps	Vuma 100/100Mbps	cmdlk6hcz0002n82w2pkzgv60	FIBRE	100Mbps/100Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	994	994	t	f	2025-07-27 10:51:05.284	2025-07-27 10:51:05.284	\N	\N	\N	f
vuma_vuma_200_200mbps	Vuma 200/200Mbps	cmdlk6hcz0002n82w2pkzgv60	FIBRE	200Mbps/200Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1144	1144	t	f	2025-07-27 10:51:05.29	2025-07-27 10:51:05.29	\N	\N	\N	f
vuma_vuma_500_200mbps	Vuma 500/200Mbps	cmdlk6hcz0002n82w2pkzgv60	FIBRE	500Mbps/200Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1294	1294	t	f	2025-07-27 10:51:05.296	2025-07-27 10:51:05.296	\N	\N	\N	f
vuma_vuma_1000_250mbps	Vuma 1000/250Mbps	cmdlk6hcz0002n82w2pkzgv60	FIBRE	1000Mbps/250Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1634	1634	t	f	2025-07-27 10:51:05.302	2025-07-27 10:51:05.302	\N	\N	\N	f
vuma_vuma_1000_500mbps	Vuma 1000/500Mbps	cmdlk6hcz0002n82w2pkzgv60	FIBRE	1000Mbps/500Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	2355	2355	t	f	2025-07-27 10:51:05.308	2025-07-27 10:51:05.308	\N	\N	\N	f
octotel_octotel_25_25mbps	Octotel 25/25Mbps	cmdlk6hd80003n82wqczg8f1d	FIBRE	25Mbps/25Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	375	375	t	f	2025-07-27 10:51:05.314	2025-07-27 10:51:05.314	\N	\N	\N	f
octotel_octotel_55_25mbps	Octotel 55/25Mbps	cmdlk6hd80003n82wqczg8f1d	FIBRE	55Mbps/25Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	640	640	t	f	2025-07-27 10:51:05.319	2025-07-27 10:51:05.319	\N	\N	\N	f
octotel_octotel_100_100mbps	Octotel 100/100Mbps	cmdlk6hd80003n82wqczg8f1d	FIBRE	100Mbps/100Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	860	860	t	f	2025-07-27 10:51:05.327	2025-07-27 10:51:05.327	\N	\N	\N	f
octotel_octotel_150_150mbps	Octotel 150/150Mbps	cmdlk6hd80003n82wqczg8f1d	FIBRE	150Mbps/150Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	960	960	t	f	2025-07-27 10:51:05.335	2025-07-27 10:51:05.335	\N	\N	\N	f
octotel_octotel_300_200mbps	Octotel 300/200Mbps	cmdlk6hd80003n82wqczg8f1d	FIBRE	300Mbps/200Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1115	1115	t	f	2025-07-27 10:51:05.341	2025-07-27 10:51:05.341	\N	\N	\N	f
octotel_octotel_500_200mbps	Octotel 500/200Mbps	cmdlk6hd80003n82wqczg8f1d	FIBRE	500Mbps/200Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1315	1315	t	f	2025-07-27 10:51:05.347	2025-07-27 10:51:05.347	\N	\N	\N	f
octotel_octotel_1000_200mbps	Octotel 1000/200Mbps	cmdlk6hd80003n82wqczg8f1d	FIBRE	1000Mbps/200Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1585	1585	t	f	2025-07-27 10:51:05.355	2025-07-27 10:51:05.355	\N	\N	\N	f
tt_connect_tt_connect_30_30mbps	TT Connect 30/30Mbps	cmdlk6hdh0004n82w2ifjj4gu	FIBRE	30Mbps/30Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	725	725	t	f	2025-07-27 10:51:05.363	2025-07-27 10:51:05.363	\N	\N	\N	f
tt_connect_tt_connect_50_50mbps	TT Connect 50/50Mbps	cmdlk6hdh0004n82w2ifjj4gu	FIBRE	50Mbps/50Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	935	935	t	f	2025-07-27 10:51:05.369	2025-07-27 10:51:05.369	\N	\N	\N	f
tt_connect_tt_connect_100_100mbps	TT Connect 100/100Mbps	cmdlk6hdh0004n82w2ifjj4gu	FIBRE	100Mbps/100Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1030	1030	t	f	2025-07-27 10:51:05.375	2025-07-27 10:51:05.375	\N	\N	\N	f
tt_connect_tt_connect_200_200mbps	TT Connect 200/200Mbps	cmdlk6hdh0004n82w2ifjj4gu	FIBRE	200Mbps/200Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1235	1235	t	f	2025-07-27 10:51:05.382	2025-07-27 10:51:05.382	\N	\N	\N	f
tt_connect_tt_connect_400_400mbps	TT Connect 400/400Mbps	cmdlk6hdh0004n82w2ifjj4gu	FIBRE	400Mbps/400Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1525	1525	t	f	2025-07-27 10:51:05.388	2025-07-27 10:51:05.388	\N	\N	\N	f
tt_connect_tt_connect_525_525mbps	TT Connect 525/525Mbps	cmdlk6hdh0004n82w2ifjj4gu	FIBRE	525Mbps/525Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1725	1725	t	f	2025-07-27 10:51:05.395	2025-07-27 10:51:05.395	\N	\N	\N	f
tt_connect_tt_connect_850_850mbps	TT Connect 850/850Mbps	cmdlk6hdh0004n82w2ifjj4gu	FIBRE	850Mbps/850Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1915	1915	t	f	2025-07-27 10:51:05.4	2025-07-27 10:51:05.4	\N	\N	\N	f
tt_connect_tt_connect_1000_1000mbps	TT Connect 1000/1000Mbps	cmdlk6hdh0004n82w2ifjj4gu	FIBRE	1000Mbps/1000Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	2369	2369	t	f	2025-07-27 10:51:05.406	2025-07-27 10:51:05.406	\N	\N	\N	f
mitsol_mitsol_20_20mbps	Mitsol 20/20Mbps	cmdlk6hdr0005n82w1gl6y9p3	FIBRE	20Mbps/20Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	535	535	t	f	2025-07-27 10:51:05.413	2025-07-27 10:51:05.413	\N	\N	\N	f
mitsol_mitsol_50_25mbps	Mitsol 50/25Mbps	cmdlk6hdr0005n82w1gl6y9p3	FIBRE	50Mbps/25Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	615	615	t	f	2025-07-27 10:51:05.418	2025-07-27 10:51:05.418	\N	\N	\N	f
mitsol_mitsol_120_60mbps	Mitsol 120/60Mbps	cmdlk6hdr0005n82w1gl6y9p3	FIBRE	120Mbps/60Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	815	815	t	f	2025-07-27 10:51:05.424	2025-07-27 10:51:05.424	\N	\N	\N	f
mitsol_mitsol_120_120mbps	Mitsol 120/120Mbps	cmdlk6hdr0005n82w1gl6y9p3	FIBRE	120Mbps/120Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	915	915	t	f	2025-07-27 10:51:05.431	2025-07-27 10:51:05.431	\N	\N	\N	f
mitsol_mitsol_240_240mbps	Mitsol 240/240Mbps	cmdlk6hdr0005n82w1gl6y9p3	FIBRE	240Mbps/240Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1105	1105	t	f	2025-07-27 10:51:05.438	2025-07-27 10:51:05.438	\N	\N	\N	f
mitsol_mitsol_500_500mbps	Mitsol 500/500Mbps	cmdlk6hdr0005n82w1gl6y9p3	FIBRE	500Mbps/500Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1325	1325	t	f	2025-07-27 10:51:05.444	2025-07-27 10:51:05.444	\N	\N	\N	f
mitsol_mitsol_1000_1000mbps	Mitsol 1000/1000Mbps	cmdlk6hdr0005n82w1gl6y9p3	FIBRE	1000Mbps/1000Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1525	1525	t	f	2025-07-27 10:51:05.451	2025-07-27 10:51:05.451	\N	\N	\N	f
evotel_evotel_20_10mbps	Evotel 20/10Mbps	cmdlk6he00006n82wja4xfo6a	FIBRE	20Mbps/10Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	634	634	t	f	2025-07-27 10:51:05.458	2025-07-27 10:51:05.458	\N	\N	\N	f
evotel_evotel_60_60mbps	Evotel 60/60Mbps	cmdlk6he00006n82wja4xfo6a	FIBRE	60Mbps/60Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	760	760	t	f	2025-07-27 10:51:05.464	2025-07-27 10:51:05.464	\N	\N	\N	f
evotel_evotel_125_125mbps	Evotel 125/125Mbps	cmdlk6he00006n82wja4xfo6a	FIBRE	125Mbps/125Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	920	920	t	f	2025-07-27 10:51:05.471	2025-07-27 10:51:05.471	\N	\N	\N	f
evotel_evotel_250_250mbps	Evotel 250/250Mbps	cmdlk6he00006n82wja4xfo6a	FIBRE	250Mbps/250Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1090	1090	t	f	2025-07-27 10:51:05.479	2025-07-27 10:51:05.479	\N	\N	\N	f
evotel_evotel_600_600mbps	Evotel 600/600Mbps	cmdlk6he00006n82wja4xfo6a	FIBRE	600Mbps/600Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1170	1170	t	f	2025-07-27 10:51:05.486	2025-07-27 10:51:05.486	\N	\N	\N	f
evotel_evotel_850_850mbps	Evotel 850/850Mbps	cmdlk6he00006n82wja4xfo6a	FIBRE	850Mbps/850Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1470	1470	t	f	2025-07-27 10:51:05.492	2025-07-27 10:51:05.492	\N	\N	\N	f
thinkspeed_thinkspeed_30_30mbps	Thinkspeed 30/30Mbps	cmdlk6heb0007n82wu3bhw0oz	FIBRE	30Mbps/30Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	675	675	t	f	2025-07-27 10:51:05.498	2025-07-27 10:51:05.498	\N	\N	\N	f
thinkspeed_thinkspeed_50_50mbps	Thinkspeed 50/50Mbps	cmdlk6heb0007n82wu3bhw0oz	FIBRE	50Mbps/50Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	875	875	t	f	2025-07-27 10:51:05.504	2025-07-27 10:51:05.504	\N	\N	\N	f
thinkspeed_thinkspeed_100_100mbps	Thinkspeed 100/100Mbps	cmdlk6heb0007n82wu3bhw0oz	FIBRE	100Mbps/100Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	975	975	t	f	2025-07-27 10:51:05.51	2025-07-27 10:51:05.51	\N	\N	\N	f
thinkspeed_thinkspeed_200_200mbps	Thinkspeed 200/200Mbps	cmdlk6heb0007n82wu3bhw0oz	FIBRE	200Mbps/200Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1175	1175	t	f	2025-07-27 10:51:05.516	2025-07-27 10:51:05.516	\N	\N	\N	f
thinkspeed_thinkspeed_500_500mbps	Thinkspeed 500/500Mbps	cmdlk6heb0007n82wu3bhw0oz	FIBRE	500Mbps/500Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1375	1375	t	f	2025-07-27 10:51:05.522	2025-07-27 10:51:05.522	\N	\N	\N	f
thinkspeed_thinkspeed_1000_500mbps	Thinkspeed 1000/500Mbps	cmdlk6heb0007n82wu3bhw0oz	FIBRE	1000Mbps/500Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1475	1475	t	f	2025-07-27 10:51:05.529	2025-07-27 10:51:05.529	\N	\N	\N	f
clearaccess_clearaccess_8_8mbps	Clearaccess 8/8Mbps	cmdlk6hek0008n82wo7mqrnkj	FIBRE	8Mbps/8Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	320	320	t	f	2025-07-27 10:51:05.537	2025-07-27 10:51:05.537	\N	\N	\N	f
clearaccess_clearaccess_25_25mbps	Clearaccess 25/25Mbps	cmdlk6hek0008n82wo7mqrnkj	FIBRE	25Mbps/25Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	775	775	t	f	2025-07-27 10:51:05.543	2025-07-27 10:51:05.543	\N	\N	\N	f
clearaccess_clearaccess_50_50mbps	Clearaccess 50/50Mbps	cmdlk6hek0008n82wo7mqrnkj	FIBRE	50Mbps/50Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	985	985	t	f	2025-07-27 10:51:05.55	2025-07-27 10:51:05.55	\N	\N	\N	f
clearaccess_clearaccess_100_100mbps	Clearaccess 100/100Mbps	cmdlk6hek0008n82wo7mqrnkj	FIBRE	100Mbps/100Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1135	1135	t	f	2025-07-27 10:51:05.556	2025-07-27 10:51:05.556	\N	\N	\N	f
clearaccess_clearaccess_200_200mbps	Clearaccess 200/200Mbps	cmdlk6hek0008n82wo7mqrnkj	FIBRE	200Mbps/200Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1365	1365	t	f	2025-07-27 10:51:05.562	2025-07-27 10:51:05.562	\N	\N	\N	f
dnatel_dnatel_10_10mbps	DNATel 10/10Mbps	cmdlk6hf00009n82wmz7jz3kb	FIBRE	10Mbps/10Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	620	620	t	f	2025-07-27 10:51:05.568	2025-07-27 10:51:05.568	\N	\N	\N	f
dnatel_dnatel_30_30mbps	DNATel 30/30Mbps	cmdlk6hf00009n82wmz7jz3kb	FIBRE	30Mbps/30Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	650	650	t	f	2025-07-27 10:51:05.575	2025-07-27 10:51:05.575	\N	\N	\N	f
dnatel_dnatel_50_50mbps	DNATel 50/50Mbps	cmdlk6hf00009n82wmz7jz3kb	FIBRE	50Mbps/50Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	785	785	t	f	2025-07-27 10:51:05.582	2025-07-27 10:51:05.582	\N	\N	\N	f
dnatel_dnatel_100_100mbps	DNATel 100/100Mbps	cmdlk6hf00009n82wmz7jz3kb	FIBRE	100Mbps/100Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	915	915	t	f	2025-07-27 10:51:05.588	2025-07-27 10:51:05.588	\N	\N	\N	f
dnatel_dnatel_200_200mbps	DNATel 200/200Mbps	cmdlk6hf00009n82wmz7jz3kb	FIBRE	200Mbps/200Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	985	985	t	f	2025-07-27 10:51:05.595	2025-07-27 10:51:05.595	\N	\N	\N	f
vodacom_vodacom_20_10mbps	Vodacom 20/10Mbps	cmdlk6hht000jn82wnijxrug5	FIBRE	20Mbps/10Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	594	594	t	f	2025-07-27 10:51:05.602	2025-07-27 10:51:05.602	\N	\N	\N	f
vodacom_vodacom_20_20mbps	Vodacom 20/20Mbps	cmdlk6hht000jn82wnijxrug5	FIBRE	20Mbps/20Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	694	694	t	f	2025-07-27 10:51:05.608	2025-07-27 10:51:05.608	\N	\N	\N	f
vodacom_vodacom_50_25mbps	Vodacom 50/25Mbps	cmdlk6hht000jn82wnijxrug5	FIBRE	50Mbps/25Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	794	794	t	f	2025-07-27 10:51:05.615	2025-07-27 10:51:05.615	\N	\N	\N	f
vodacom_vodacom_50_50mbps	Vodacom 50/50Mbps	cmdlk6hht000jn82wnijxrug5	FIBRE	50Mbps/50Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	894	894	t	f	2025-07-27 10:51:05.621	2025-07-27 10:51:05.621	\N	\N	\N	f
vodacom_vodacom_100_100mbps	Vodacom 100/100Mbps	cmdlk6hht000jn82wnijxrug5	FIBRE	100Mbps/100Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	994	994	t	f	2025-07-27 10:51:05.628	2025-07-27 10:51:05.628	\N	\N	\N	f
vodacom_vodacom_200_200mbps	Vodacom 200/200Mbps	cmdlk6hht000jn82wnijxrug5	FIBRE	200Mbps/200Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1094	1094	t	f	2025-07-27 10:51:05.636	2025-07-27 10:51:05.636	\N	\N	\N	f
link_layer_link_layer_30_30mbps	Link Layer 30/30Mbps	cmdlk6hfd000an82wewqqn6sp	FIBRE	30Mbps/30Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	520	520	t	f	2025-07-27 10:51:05.644	2025-07-27 10:51:05.644	\N	\N	\N	f
link_layer_link_layer_50_50mbps	Link Layer 50/50Mbps	cmdlk6hfd000an82wewqqn6sp	FIBRE	50Mbps/50Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	720	720	t	f	2025-07-27 10:51:05.651	2025-07-27 10:51:05.651	\N	\N	\N	f
link_layer_link_layer_100_100mbps	Link Layer 100/100Mbps	cmdlk6hfd000an82wewqqn6sp	FIBRE	100Mbps/100Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	870	870	t	f	2025-07-27 10:51:05.657	2025-07-27 10:51:05.657	\N	\N	\N	f
link_layer_link_layer_200_200mbps	Link Layer 200/200Mbps	cmdlk6hfd000an82wewqqn6sp	FIBRE	200Mbps/200Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1030	1030	t	f	2025-07-27 10:51:05.664	2025-07-27 10:51:05.664	\N	\N	\N	f
link_layer_link_layer_500_500mbps	Link Layer 500/500Mbps	cmdlk6hfd000an82wewqqn6sp	FIBRE	500Mbps/500Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1325	1325	t	f	2025-07-27 10:51:05.677	2025-07-27 10:51:05.677	\N	\N	\N	f
metrofibre_nexus_nexus_25_25mbps	Nexus 25/25Mbps	cmdlk6hfn000bn82w00oz95ka	FIBRE	25Mbps/25Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	395	395	t	f	2025-07-27 10:51:05.687	2025-07-27 10:51:05.687	\N	\N	\N	f
metrofibre_nexus_nexus_45_45mbps	Nexus 45/45Mbps	cmdlk6hfn000bn82w00oz95ka	FIBRE	45Mbps/45Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	685	685	t	f	2025-07-27 10:51:05.694	2025-07-27 10:51:05.694	\N	\N	\N	f
metrofibre_nexus_nexus_75_75mbps	Nexus 75/75Mbps	cmdlk6hfn000bn82w00oz95ka	FIBRE	75Mbps/75Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	785	785	t	f	2025-07-27 10:51:05.701	2025-07-27 10:51:05.701	\N	\N	\N	f
metrofibre_nexus_nexus_150_150mbps	Nexus 150/150Mbps	cmdlk6hfn000bn82w00oz95ka	FIBRE	150Mbps/150Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	885	885	t	f	2025-07-27 10:51:05.707	2025-07-27 10:51:05.707	\N	\N	\N	f
metrofibre_nexus_nexus_250_250mbps	Nexus 250/250Mbps	cmdlk6hfn000bn82w00oz95ka	FIBRE	250Mbps/250Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	955	955	t	f	2025-07-27 10:51:05.714	2025-07-27 10:51:05.714	\N	\N	\N	f
metrofibre_nexus_nexus_500_500mbps	Nexus 500/500Mbps	cmdlk6hfn000bn82w00oz95ka	FIBRE	500Mbps/500Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1375	1375	t	f	2025-07-27 10:51:05.721	2025-07-27 10:51:05.721	\N	\N	\N	f
metrofibre_nexus_nexus_1000_200mbps	Nexus 1000/200Mbps	cmdlk6hfn000bn82w00oz95ka	FIBRE	1000Mbps/200Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1435	1435	t	f	2025-07-27 10:51:05.729	2025-07-27 10:51:05.729	\N	\N	\N	f
metrofibre_nova_nova_20_20mbps	Nova 20/20Mbps	cmdlk6hfz000cn82wmprofpjp	FIBRE	20Mbps/20Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	485	485	t	f	2025-07-27 10:51:05.735	2025-07-27 10:51:05.735	\N	\N	\N	f
metrofibre_nova_nova_40_40mbps	Nova 40/40Mbps	cmdlk6hfz000cn82wmprofpjp	FIBRE	40Mbps/40Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	585	585	t	f	2025-07-27 10:51:05.743	2025-07-27 10:51:05.743	\N	\N	\N	f
metrofibre_nova_nova_60_60mbps	Nova 60/60Mbps	cmdlk6hfz000cn82wmprofpjp	FIBRE	60Mbps/60Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	685	685	t	f	2025-07-27 10:51:05.75	2025-07-27 10:51:05.75	\N	\N	\N	f
metrofibre_nova_nova_150_150mbps	Nova 150/150Mbps	cmdlk6hfz000cn82wmprofpjp	FIBRE	150Mbps/150Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	885	885	t	f	2025-07-27 10:51:05.756	2025-07-27 10:51:05.756	\N	\N	\N	f
metrofibre_nova_nova_250_250mbps	Nova 250/250Mbps	cmdlk6hfz000cn82wmprofpjp	FIBRE	250Mbps/250Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	955	955	t	f	2025-07-27 10:51:05.763	2025-07-27 10:51:05.763	\N	\N	\N	f
metrofibre_nova_nova_500_500mbps	Nova 500/500Mbps	cmdlk6hfz000cn82wmprofpjp	FIBRE	500Mbps/500Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1385	1385	t	f	2025-07-27 10:51:05.771	2025-07-27 10:51:05.771	\N	\N	\N	f
metrofibre_nova_nova_1000_250mbps	Nova 1000/250Mbps	cmdlk6hfz000cn82wmprofpjp	FIBRE	1000Mbps/250Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1445	1445	t	f	2025-07-27 10:51:05.779	2025-07-27 10:51:05.779	\N	\N	\N	f
steyn_city_steyn_city_10_10mbps	Steyn City 10/10Mbps	cmdlk6hg9000dn82wutl4960n	FIBRE	10Mbps/10Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	675	675	t	f	2025-07-27 10:51:05.786	2025-07-27 10:51:05.786	\N	\N	\N	f
steyn_city_steyn_city_25_25mbps	Steyn City 25/25Mbps	cmdlk6hg9000dn82wutl4960n	FIBRE	25Mbps/25Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	875	875	t	f	2025-07-27 10:51:05.793	2025-07-27 10:51:05.793	\N	\N	\N	f
steyn_city_steyn_city_50_50mbps	Steyn City 50/50Mbps	cmdlk6hg9000dn82wutl4960n	FIBRE	50Mbps/50Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1175	1175	t	f	2025-07-27 10:51:05.802	2025-07-27 10:51:05.802	\N	\N	\N	f
steyn_city_steyn_city_100_100mbps	Steyn City 100/100Mbps	cmdlk6hg9000dn82wutl4960n	FIBRE	100Mbps/100Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1555	1555	t	f	2025-07-27 10:51:05.809	2025-07-27 10:51:05.809	\N	\N	\N	f
steyn_city_steyn_city_200_200mbps	Steyn City 200/200Mbps	cmdlk6hg9000dn82wutl4960n	FIBRE	200Mbps/200Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1975	1975	t	f	2025-07-27 10:51:05.815	2025-07-27 10:51:05.815	\N	\N	\N	f
zoom_fibre_zoom_fibre_50_50mbps	Zoom Fibre 50/50Mbps	cmdlk6hgi000en82whqvar0a1	FIBRE	50Mbps/50Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	685	685	t	f	2025-07-27 10:51:05.822	2025-07-27 10:51:05.822	\N	\N	\N	f
zoom_fibre_zoom_fibre_100_100mbps	Zoom Fibre 100/100Mbps	cmdlk6hgi000en82whqvar0a1	FIBRE	100Mbps/100Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	885	885	t	f	2025-07-27 10:51:05.828	2025-07-27 10:51:05.828	\N	\N	\N	f
zoom_fibre_zoom_fibre_200_200mbps	Zoom Fibre 200/200Mbps	cmdlk6hgi000en82whqvar0a1	FIBRE	200Mbps/200Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	985	985	t	f	2025-07-27 10:51:05.835	2025-07-27 10:51:05.835	\N	\N	\N	f
zoom_fibre_zoom_fibre_500_250mbps	Zoom Fibre 500/250Mbps	cmdlk6hgi000en82whqvar0a1	FIBRE	500Mbps/250Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1150	1150	t	f	2025-07-27 10:51:05.842	2025-07-27 10:51:05.842	\N	\N	\N	f
zoom_fibre_zoom_fibre_1000_500mbps	Zoom Fibre 1000/500Mbps	cmdlk6hgi000en82whqvar0a1	FIBRE	1000Mbps/500Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1275	1275	t	f	2025-07-27 10:51:05.847	2025-07-27 10:51:05.847	\N	\N	\N	f
netstream_netstream_4_4mbps	Netstream 4/4Mbps	cmdlk6hgr000fn82wvfek1xqf	FIBRE	4Mbps/4Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	605	605	t	f	2025-07-27 10:51:05.856	2025-07-27 10:51:05.856	\N	\N	\N	f
netstream_netstream_10_10mbps	Netstream 10/10Mbps	cmdlk6hgr000fn82wvfek1xqf	FIBRE	10Mbps/10Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	735	735	t	f	2025-07-27 10:51:05.863	2025-07-27 10:51:05.863	\N	\N	\N	f
netstream_netstream_20_20mbps	Netstream 20/20Mbps	cmdlk6hgr000fn82wvfek1xqf	FIBRE	20Mbps/20Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	905	905	t	f	2025-07-27 10:51:05.869	2025-07-27 10:51:05.869	\N	\N	\N	f
netstream_netstream_50_50mbps	Netstream 50/50Mbps	cmdlk6hgr000fn82wvfek1xqf	FIBRE	50Mbps/50Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1105	1105	t	f	2025-07-27 10:51:05.878	2025-07-27 10:51:05.878	\N	\N	\N	f
netstream_netstream_100_100mbps	Netstream 100/100Mbps	cmdlk6hgr000fn82wvfek1xqf	FIBRE	100Mbps/100Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1305	1305	t	f	2025-07-27 10:51:05.885	2025-07-27 10:51:05.885	\N	\N	\N	f
lightstruck_lightstruck_50_50mbps	Lightstruck 50/50Mbps	cmdlk6hh3000gn82wn1l40wk1	FIBRE	50Mbps/50Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	790	790	t	f	2025-07-27 10:51:05.892	2025-07-27 10:51:05.892	\N	\N	\N	f
lightstruck_lightstruck_200_100mbps	Lightstruck 200/100Mbps	cmdlk6hh3000gn82wn1l40wk1	FIBRE	200Mbps/100Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1090	1090	t	f	2025-07-27 10:51:05.899	2025-07-27 10:51:05.899	\N	\N	\N	f
lightstruck_lightstruck_250_200mbps	Lightstruck 250/200Mbps	cmdlk6hh3000gn82wn1l40wk1	FIBRE	250Mbps/200Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1290	1290	t	f	2025-07-27 10:51:05.906	2025-07-27 10:51:05.906	\N	\N	\N	f
lightstruck_lightstruck_250_250mbps	Lightstruck 250/250Mbps	cmdlk6hh3000gn82wn1l40wk1	FIBRE	250Mbps/250Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1390	1390	t	f	2025-07-27 10:51:05.912	2025-07-27 10:51:05.912	\N	\N	\N	f
lightstruck_lightstruck_500_500mbps	Lightstruck 500/500Mbps	cmdlk6hh3000gn82wn1l40wk1	FIBRE	500Mbps/500Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1490	1490	t	f	2025-07-27 10:51:05.921	2025-07-27 10:51:05.921	\N	\N	\N	f
lightstruck_lightstruck_1000_1000mbps	Lightstruck 1000/1000Mbps	cmdlk6hh3000gn82wn1l40wk1	FIBRE	1000Mbps/1000Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	2190	2190	t	f	2025-07-27 10:51:05.929	2025-07-27 10:51:05.929	\N	\N	\N	f
pphg_pphg_50_25mbps	PPHG 50/25Mbps	cmdlk6hhc000hn82wroybn5u1	FIBRE	50Mbps/25Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	690	690	t	f	2025-07-27 10:51:05.938	2025-07-27 10:51:05.938	\N	\N	\N	f
pphg_pphg_50_50mbps	PPHG 50/50Mbps	cmdlk6hhc000hn82wroybn5u1	FIBRE	50Mbps/50Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	790	790	t	f	2025-07-27 10:51:05.943	2025-07-27 10:51:05.943	\N	\N	\N	f
pphg_pphg_100_50mbps	PPHG 100/50Mbps	cmdlk6hhc000hn82wroybn5u1	FIBRE	100Mbps/50Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	890	890	t	f	2025-07-27 10:51:05.95	2025-07-27 10:51:05.95	\N	\N	\N	f
pphg_pphg_100_100mbps	PPHG 100/100Mbps	cmdlk6hhc000hn82wroybn5u1	FIBRE	100Mbps/100Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	990	990	t	f	2025-07-27 10:51:05.957	2025-07-27 10:51:05.957	\N	\N	\N	f
pphg_pphg_200_100mbps	PPHG 200/100Mbps	cmdlk6hhc000hn82wroybn5u1	FIBRE	200Mbps/100Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1090	1090	t	f	2025-07-27 10:51:05.965	2025-07-27 10:51:05.965	\N	\N	\N	f
pphg_pphg_200_200mbps	PPHG 200/200Mbps	cmdlk6hhc000hn82wroybn5u1	FIBRE	200Mbps/200Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1190	1190	t	f	2025-07-27 10:51:05.972	2025-07-27 10:51:05.972	\N	\N	\N	f
pphg_pphg_250_200mbps	PPHG 250/200Mbps	cmdlk6hhc000hn82wroybn5u1	FIBRE	250Mbps/200Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1290	1290	t	f	2025-07-27 10:51:05.979	2025-07-27 10:51:05.979	\N	\N	\N	f
pphg_pphg_250_250mbps	PPHG 250/250Mbps	cmdlk6hhc000hn82wroybn5u1	FIBRE	250Mbps/250Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1390	1390	t	f	2025-07-27 10:51:05.985	2025-07-27 10:51:05.985	\N	\N	\N	f
pphg_pphg_500_500mbps	PPHG 500/500Mbps	cmdlk6hhc000hn82wroybn5u1	FIBRE	500Mbps/500Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	1490	1490	t	f	2025-07-27 10:51:05.993	2025-07-27 10:51:05.993	\N	\N	\N	f
pphg_pphg_1000_1000mbps	PPHG 1000/1000Mbps	cmdlk6hhc000hn82wroybn5u1	FIBRE	1000Mbps/1000Mbps	Uncapped	\N	\N	\N	\N	\N	Pro Rata applies to all Fibre Accounts	\N	Fibre	\N	\N	2190	2190	t	f	2025-07-27 10:51:05.999	2025-07-27 10:51:05.999	\N	\N	\N	f
vodacom_lte_up_to_20mbps	Up to 20Mbps	cmdlk6hht000jn82wnijxrug5	LTE_FIXED	20Mbps	Uncapped	\N	\N	50GB	2Mbps	\N	Once AUP limit is reached, speed will change to 2Mbps	Speed is dependant on LTE router and network coverage	LTE	\N	\N	269	269	t	f	2025-07-27 10:51:06.006	2025-07-27 10:51:06.006	\N	\N	\N	f
vodacom_lte_up_to_30mbps	Up to 30Mbps	cmdlk6hht000jn82wnijxrug5	LTE_FIXED	30Mbps	Uncapped	\N	\N	150GB	2Mbps	\N	Once AUP limit is reached, speed will change to 2Mbps	Speed is dependant on LTE router and network coverage	LTE	\N	\N	369	369	t	f	2025-07-27 10:51:06.012	2025-07-27 10:51:06.012	\N	\N	\N	f
vodacom_lte_up_to_50mbps	Up to 50Mbps	cmdlk6hht000jn82wnijxrug5	LTE_FIXED	50Mbps	Uncapped	\N	\N	300GB	2Mbps	\N	Once AUP limit is reached, speed will change to 2Mbps	Speed is dependant on LTE router and network coverage	LTE	\N	\N	469	469	t	f	2025-07-27 10:51:06.019	2025-07-27 10:51:06.019	\N	\N	\N	f
vodacom_lte_uncapped_pro	Uncapped LTE PRO	cmdlk6hht000jn82wnijxrug5	LTE_FIXED	100Mbps+ unlimited	Uncapped	\N	\N	600GB	1Mbps	\N	Once AUP limit is reached, speed will change to 1Mbps	\N	LTE	\N	\N	669	669	t	f	2025-07-27 10:51:06.029	2025-07-27 10:51:06.029	\N	\N	\N	f
mtn_lte_up_to_30mbps	Up to 30Mbps	cmdlk6hhj000in82wqwfucnb9	LTE_FIXED	30Mbps	Uncapped	\N	\N	50GB	2Mbps	\N	Speed is dependent on LTE router and available capacity on the LTE tower your device is connected to	\N	LTE	\N	\N	339	339	t	f	2025-07-27 10:51:06.036	2025-07-27 10:51:06.036	\N	\N	\N	f
mtn_lte_up_to_75mbps	Up to 75Mbps	cmdlk6hhj000in82wqwfucnb9	LTE_FIXED	75Mbps	Uncapped	\N	\N	150GB	2Mbps	\N	Speed is dependent on LTE router and available capacity on the LTE tower your device is connected to	\N	LTE	\N	\N	379	379	t	f	2025-07-27 10:51:06.044	2025-07-27 10:51:06.044	\N	\N	\N	f
mtn_lte_up_to_125mbps	Up to 125Mbps	cmdlk6hhj000in82wqwfucnb9	LTE_FIXED	125Mbps	Uncapped	\N	\N	300GB	2Mbps	\N	Speed is dependent on LTE router and available capacity on the LTE tower your device is connected to	\N	LTE	\N	\N	469	469	t	f	2025-07-27 10:51:06.05	2025-07-27 10:51:06.05	\N	\N	\N	f
mtn_lte_up_to_150mbps	Up to 150Mbps	cmdlk6hhj000in82wqwfucnb9	LTE_FIXED	150Mbps	Uncapped	\N	\N	500GB	2Mbps	\N	Speed is dependent on LTE router and available capacity on the LTE tower your device is connected to	\N	LTE	\N	\N	569	569	t	f	2025-07-27 10:51:06.058	2025-07-27 10:51:06.058	\N	\N	\N	f
mtn_lte_uncapped_pro	Uncapped LTE (Pro)	cmdlk6hhj000in82wqwfucnb9	LTE_FIXED	150Mbps+ unlimited	Uncapped	\N	\N	1000GB	1Mbps	\N	Once AUP limit is reached, speed will change to 1Mbps. Speed is dependent on LTE router and network coverage	Operating time - 24 Hours	LTE	\N	\N	799	799	t	f	2025-07-27 10:51:06.066	2025-07-27 10:51:06.066	\N	\N	\N	f
telkom_lte_10mbps	10 Mbps Package	cmdlk6hi2000kn82w7lunuwib	LTE_FIXED	10Mbps	Uncapped	\N	\N	100GB	4Mbps	2Mbps	100GB data @ 10Mbps. Thereafter 20GB data @ 4Mbps. Thereafter 2Mbps uncapped data rest of the month	P2P/NNTP type traffic will be further throttled. The promotional price is valid until 31 December 2025	LTE	\N	\N	298	298	t	f	2025-07-27 10:51:06.073	2025-07-27 10:51:06.073	\N	\N	\N	f
telkom_lte_20mbps	20 Mbps Package	cmdlk6hi2000kn82w7lunuwib	LTE_FIXED	20Mbps	Uncapped	\N	\N	500GB	4Mbps	2Mbps	500GB data @ 20Mbps. Thereafter 50GB data @ 4Mbps. Thereafter 2Mbps uncapped data rest of the month	P2P/NNTP type traffic will be further throttled	LTE	\N	\N	589	589	t	f	2025-07-27 10:51:06.079	2025-07-27 10:51:06.079	\N	\N	\N	f
telkom_lte_30mbps	30 Mbps Package	cmdlk6hi2000kn82w7lunuwib	LTE_FIXED	30Mbps	Uncapped	\N	\N	600GB	4Mbps	2Mbps	600GB data @ 30Mbps. Thereafter 50GB data @ 4Mbps. Thereafter 2Mbps uncapped data rest of the month	P2P/NNTP type traffic will be further throttled	LTE	\N	\N	679	679	t	f	2025-07-27 10:51:06.089	2025-07-27 10:51:06.089	\N	\N	\N	f
mtn_5g_standard	STANDARD	cmdlk6hhj000in82wqwfucnb9	5G_FIXED	up to 500Mbps	Uncapped	\N	\N	300GB	2Mbps	\N	Speed is up to 500Mbps (dependent on 5G router capability and available capacity on the 5G tower your device is connected to). Once AUP limit is reached, speed will change to 2Mbps	\N	5G	\N	\N	399	399	t	f	2025-07-27 10:51:06.097	2025-07-27 10:51:06.097	\N	\N	\N	f
mtn_5g_advanced	ADVANCED	cmdlk6hhj000in82wqwfucnb9	5G_FIXED	up to 500Mbps	Uncapped	\N	\N	450GB	2Mbps	\N	Speed is up to 500Mbps (dependent on 5G router capability and available capacity on the 5G tower your device is connected to). Once AUP limit is reached, speed will change to 2Mbps	\N	5G	\N	\N	549	549	t	f	2025-07-27 10:51:06.104	2025-07-27 10:51:06.104	\N	\N	\N	f
mtn_5g_pro	PRO	cmdlk6hhj000in82wqwfucnb9	5G_FIXED	up to 500Mbps	Uncapped	\N	\N	600GB	2Mbps	\N	Speed is up to 500Mbps (dependent on 5G router capability and available capacity on the 5G tower your device is connected to). Once AUP limit is reached, speed will change to 2Mbps	\N	5G	\N	\N	649	649	t	f	2025-07-27 10:51:06.11	2025-07-27 10:51:06.11	\N	\N	\N	f
mtn_5g_pro_plus	PRO+	cmdlk6hhj000in82wqwfucnb9	5G_FIXED	up to 500Mbps	Uncapped	\N	\N	1000GB	2Mbps	\N	Speed is up to 500Mbps (dependent on 5G router capability and available capacity on the 5G tower your device is connected to). Once AUP limit is reached, speed will change to 2Mbps	\N	5G	\N	\N	849	849	t	f	2025-07-27 10:51:06.117	2025-07-27 10:51:06.117	\N	\N	\N	f
vodacom_5g_standard	STANDARD	cmdlk6hht000jn82wnijxrug5	5G_FIXED	\N	Uncapped	\N	\N	250GB	\N	\N	Acceptable Use Policy (AUP) applies	\N	5G	\N	\N	445	445	t	f	2025-07-27 10:51:06.124	2025-07-27 10:51:06.124	\N	\N	\N	f
vodacom_5g_advanced	ADVANCED	cmdlk6hht000jn82wnijxrug5	5G_FIXED	\N	Uncapped	\N	\N	350GB	\N	\N	Acceptable Use Policy (AUP) applies	\N	5G	\N	\N	645	645	t	f	2025-07-27 10:51:06.129	2025-07-27 10:51:06.129	\N	\N	\N	f
vodacom_5g_pro	PRO	cmdlk6hht000jn82wnijxrug5	5G_FIXED	\N	Uncapped	\N	\N	550GB	\N	\N	Acceptable Use Policy (AUP) applies	\N	5G	\N	\N	845	845	t	f	2025-07-27 10:51:06.135	2025-07-27 10:51:06.135	\N	\N	\N	f
vodacom_5g_pro_plus	PRO+	cmdlk6hht000jn82wnijxrug5	5G_FIXED	\N	Uncapped	\N	\N	750GB	\N	\N	Acceptable Use Policy (AUP) applies	\N	5G	\N	\N	945	945	t	f	2025-07-27 10:51:06.141	2025-07-27 10:51:06.141	\N	\N	\N	f
\.


--
-- TOC entry 3607 (class 0 OID 16950)
-- Dependencies: 224
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payments (id, "billId", amount, reference, status, "applicationId", "completedAt", "createdAt", currency, description, metadata, provider, "providerStatus", "providerTransactionId", "updatedAt", "userId") FROM stdin;
\.


--
-- TOC entry 3600 (class 0 OID 16878)
-- Dependencies: 217
-- Data for Name: price_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.price_history (id, "packageId", "oldPrice", "newPrice", "changedBy", reason, "createdAt") FROM stdin;
\.


--
-- TOC entry 3601 (class 0 OID 16886)
-- Dependencies: 218
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.promotions (id, code, name, description, "packageId", "discountType", "discountValue", "startDate", "endDate", "usageLimit", "timesUsed", "targetAudience", "userSpecific", "minimumOrders", stackable, "autoApply", active, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 3598 (class 0 OID 16859)
-- Dependencies: 215
-- Data for Name: providers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.providers (id, name, slug, logo, active, "createdAt", "updatedAt") FROM stdin;
cmdlk6hc90000n82wks5nr708	Openserve	openserve	\N	t	2025-07-27 10:51:04.906	2025-07-27 10:51:04.906
cmdlk6hco0001n82w6snjfe9g	Frogfoot	frogfoot	\N	t	2025-07-27 10:51:04.921	2025-07-27 10:51:04.921
cmdlk6hcz0002n82w2pkzgv60	Vuma	vuma	\N	t	2025-07-27 10:51:04.931	2025-07-27 10:51:04.931
cmdlk6hd80003n82wqczg8f1d	Octotel	octotel	\N	t	2025-07-27 10:51:04.94	2025-07-27 10:51:04.94
cmdlk6hdh0004n82w2ifjj4gu	TT Connect	tt connect	\N	t	2025-07-27 10:51:04.949	2025-07-27 10:51:04.949
cmdlk6hdr0005n82w1gl6y9p3	Mitsol	mitsol	\N	t	2025-07-27 10:51:04.959	2025-07-27 10:51:04.959
cmdlk6he00006n82wja4xfo6a	Evotel	evotel	\N	t	2025-07-27 10:51:04.968	2025-07-27 10:51:04.968
cmdlk6heb0007n82wu3bhw0oz	Thinkspeed	thinkspeed	\N	t	2025-07-27 10:51:04.979	2025-07-27 10:51:04.979
cmdlk6hek0008n82wo7mqrnkj	Clearaccess	clearaccess	\N	t	2025-07-27 10:51:04.989	2025-07-27 10:51:04.989
cmdlk6hf00009n82wmz7jz3kb	DNATel	dnatel	\N	t	2025-07-27 10:51:05.005	2025-07-27 10:51:05.005
cmdlk6hfd000an82wewqqn6sp	Link Layer	link layer	\N	t	2025-07-27 10:51:05.018	2025-07-27 10:51:05.018
cmdlk6hfn000bn82w00oz95ka	MetroFibre Nexus	metrofibre nexus	\N	t	2025-07-27 10:51:05.027	2025-07-27 10:51:05.027
cmdlk6hfz000cn82wmprofpjp	MetroFibre Nova	metrofibre nova	\N	t	2025-07-27 10:51:05.039	2025-07-27 10:51:05.039
cmdlk6hg9000dn82wutl4960n	Steyn City	steyn city	\N	t	2025-07-27 10:51:05.05	2025-07-27 10:51:05.05
cmdlk6hgi000en82whqvar0a1	Zoom Fibre	zoom fibre	\N	t	2025-07-27 10:51:05.058	2025-07-27 10:51:05.058
cmdlk6hgr000fn82wvfek1xqf	Netstream	netstream	\N	t	2025-07-27 10:51:05.067	2025-07-27 10:51:05.067
cmdlk6hh3000gn82wn1l40wk1	Lightstruck	lightstruck	\N	t	2025-07-27 10:51:05.079	2025-07-27 10:51:05.079
cmdlk6hhc000hn82wroybn5u1	PPHG	pphg	\N	t	2025-07-27 10:51:05.088	2025-07-27 10:51:05.088
cmdlk6hhj000in82wqwfucnb9	MTN	mtn	\N	t	2025-07-27 10:51:05.096	2025-07-27 10:51:05.096
cmdlk6hht000jn82wnijxrug5	Vodacom	vodacom	\N	t	2025-07-27 10:51:05.105	2025-07-27 10:51:05.105
cmdlk6hi2000kn82w7lunuwib	Telkom	telkom	\N	t	2025-07-27 10:51:05.115	2025-07-27 10:51:05.115
\.


--
-- TOC entry 3617 (class 0 OID 24635)
-- Dependencies: 234
-- Data for Name: rica_communication_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rica_communication_logs (id, "hashedFromNumber", "hashedToNumber", "messageHash", "communicationType", direction, "messageLength", "timestamp", "retentionPeriod") FROM stdin;
\.


--
-- TOC entry 3618 (class 0 OID 24643)
-- Dependencies: 235
-- Data for Name: security_audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.security_audit_logs (id, "eventType", "userId", "ipAddress", "userAgent", success, details, "riskLevel", "timestamp") FROM stdin;
\.


--
-- TOC entry 3611 (class 0 OID 16985)
-- Dependencies: 228
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (id, "userId", token, "expiresAt", "ipAddress", "userAgent", "createdAt", "updatedAt") FROM stdin;
9i4HMi820I3lp2edZpU7bL3QIf2QfkzV	rSINEHGkXCRAsWpKbW554y0ZuhhBpOR0	9uBY6189VhxTeJER3tyPbUYxKRWCBAxF	2025-08-03 22:12:32.998			2025-07-27 22:12:32.998	2025-07-27 22:12:32.998
daWo7erNckXiE3ddaUSkK36Yf5sUSjit	rSINEHGkXCRAsWpKbW554y0ZuhhBpOR0	TZaasrKuJYxUIwC9lNKlBeQSSYv8nF3U	2025-08-03 22:35:12.79	102.132.221.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36	2025-07-27 22:35:12.79	2025-07-27 22:35:12.79
jNWvPUmiAYmlsq8GUvoKBrRWOH1zIDum	aZ800ema4rtUqOoEureY8HISuL4Qavda	0DFGeJ1h0wrGxAAjsbUEkP0t5duR1HD5	2025-08-06 19:22:13.221	102.132.243.111	node	2025-07-30 19:22:13.221	2025-07-30 19:22:13.221
WkMW6AT9Dr8mDYjyENsWl3gw2UWbqVuf	aZ800ema4rtUqOoEureY8HISuL4Qavda	XxOGCRdj131Yk04mCGq41vAymH3jS02I	2025-08-06 19:22:29.928	102.132.243.111	node	2025-07-30 19:22:29.928	2025-07-30 19:22:29.928
\.


--
-- TOC entry 3602 (class 0 OID 16899)
-- Dependencies: 219
-- Data for Name: special_rates; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.special_rates (id, "packageId", "userId", email, name, "discountType", "discountValue", "expiresAt", active, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 3604 (class 0 OID 16917)
-- Dependencies: 221
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password, "firstName", "lastName", name, phone, address, city, province, "postalCode", "idNumber", "applicationStatus", "serviceStatus", "applicationDate", "approvedAt", "approvedBy", "rejectedAt", "rejectionReason", "activationDate", "serviceAddress", "packageId", "installationNotes", "tempPassword", "mustChangePassword", role, "emailVerified", active, image, "createdAt", "updatedAt") FROM stdin;
rSINEHGkXCRAsWpKbW554y0ZuhhBpOR0	admin@starcast.co.za	\N	\N	\N	Leonard Roelofse	\N	\N	\N	\N	\N	\N	PENDING_APPROVAL	NOT_ACTIVE	2025-07-27 22:12:32.981	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	ADMIN	t	t	\N	2025-07-27 22:12:32.979	2025-07-27 22:12:33.012
cmdm9cqc10005mt0f7lxhc4g5	leonard508@outlook.com	\N	Leonard	Roelofse	\N	0834409624	325 DAHLIA, FRIEMERSHEIM	Groot Brak Rivier	Western Cape	6526	\N	APPROVED	PENDING_PAYMENT	2025-07-27 22:35:46.897	\N	\N	\N	\N	\N	\N	clearaccess_clearaccess_8_8mbps	\N	\N	t	USER	f	t	\N	2025-07-27 22:35:46.897	2025-07-28 17:12:56.982
cmdm95r4z0001mt0f20dxwdr9	apptv109@gmail.com	\N	Leonard	Roelofse	\N	0815082450	11 Brick road	George Industria, George, WC	Western Cape	6530	\N	APPROVED	PENDING_PAYMENT	2025-07-27 22:30:21.348	\N	\N	\N	\N	\N	\N	clearaccess_clearaccess_100_100mbps	\N	\N	t	USER	f	t	\N	2025-07-27 22:30:21.348	2025-07-28 17:13:23.493
aZ800ema4rtUqOoEureY8HISuL4Qavda	admin2@starcast.co.za	\N	\N	\N	Admin User Alt	\N	\N	\N	\N	\N	\N	PENDING_APPROVAL	NOT_ACTIVE	2025-07-30 19:22:13.207	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	USER	f	t	\N	2025-07-30 19:22:13.205	2025-07-30 19:22:13.205
\.


--
-- TOC entry 3613 (class 0 OID 17001)
-- Dependencies: 230
-- Data for Name: verifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.verifications (id, identifier, token, "expiresAt", "createdAt") FROM stdin;
\.


--
-- TOC entry 3614 (class 0 OID 24607)
-- Dependencies: 231
-- Data for Name: whatsapp_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.whatsapp_messages (id, "messageId", direction, "fromNumber", "toNumber", "messageBody", "profileName", "whatsappId", status, "mediaCount", "mediaUrls", "sentAt", "deliveredAt", "readAt", "receivedAt", "createdAt", "updatedAt", "userId", "isAutoResponse", escalated) FROM stdin;
\.


--
-- TOC entry 3404 (class 2606 OID 17000)
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- TOC entry 3386 (class 2606 OID 16940)
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- TOC entry 3389 (class 2606 OID 16949)
-- Name: bills bills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_pkey PRIMARY KEY (id);


--
-- TOC entry 3414 (class 2606 OID 24626)
-- Name: data_consents data_consents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_consents
    ADD CONSTRAINT data_consents_pkey PRIMARY KEY (id);


--
-- TOC entry 3418 (class 2606 OID 24634)
-- Name: data_processing_logs data_processing_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_processing_logs
    ADD CONSTRAINT data_processing_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 3432 (class 2606 OID 24659)
-- Name: data_retention_policies data_retention_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_retention_policies
    ADD CONSTRAINT data_retention_policies_pkey PRIMARY KEY (id);


--
-- TOC entry 3399 (class 2606 OID 16984)
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- TOC entry 3395 (class 2606 OID 16966)
-- Name: email_logs email_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 3397 (class 2606 OID 16976)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3379 (class 2606 OID 16916)
-- Name: package_urls package_urls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.package_urls
    ADD CONSTRAINT package_urls_pkey PRIMARY KEY (id);


--
-- TOC entry 3370 (class 2606 OID 16877)
-- Name: packages packages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT packages_pkey PRIMARY KEY (id);


--
-- TOC entry 3391 (class 2606 OID 16958)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 3372 (class 2606 OID 16885)
-- Name: price_history price_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price_history
    ADD CONSTRAINT price_history_pkey PRIMARY KEY (id);


--
-- TOC entry 3375 (class 2606 OID 16898)
-- Name: promotions promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_pkey PRIMARY KEY (id);


--
-- TOC entry 3367 (class 2606 OID 16867)
-- Name: providers providers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.providers
    ADD CONSTRAINT providers_pkey PRIMARY KEY (id);


--
-- TOC entry 3423 (class 2606 OID 24642)
-- Name: rica_communication_logs rica_communication_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rica_communication_logs
    ADD CONSTRAINT rica_communication_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 3427 (class 2606 OID 24650)
-- Name: security_audit_logs security_audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_audit_logs
    ADD CONSTRAINT security_audit_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 3401 (class 2606 OID 16992)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3377 (class 2606 OID 16907)
-- Name: special_rates special_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.special_rates
    ADD CONSTRAINT special_rates_pkey PRIMARY KEY (id);


--
-- TOC entry 3383 (class 2606 OID 16931)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3408 (class 2606 OID 17008)
-- Name: verifications verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verifications
    ADD CONSTRAINT verifications_pkey PRIMARY KEY (id);


--
-- TOC entry 3412 (class 2606 OID 24618)
-- Name: whatsapp_messages whatsapp_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.whatsapp_messages
    ADD CONSTRAINT whatsapp_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 3405 (class 1259 OID 17019)
-- Name: accounts_providerId_accountId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "accounts_providerId_accountId_key" ON public.accounts USING btree ("providerId", "accountId");


--
-- TOC entry 3384 (class 1259 OID 17014)
-- Name: applications_applicationNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "applications_applicationNumber_key" ON public.applications USING btree ("applicationNumber");


--
-- TOC entry 3387 (class 1259 OID 17015)
-- Name: bills_billNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "bills_billNumber_key" ON public.bills USING btree ("billNumber");


--
-- TOC entry 3415 (class 1259 OID 24661)
-- Name: data_consents_userId_dataCategory_processingPurpose_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "data_consents_userId_dataCategory_processingPurpose_idx" ON public.data_consents USING btree ("userId", "dataCategory", "processingPurpose");


--
-- TOC entry 3416 (class 1259 OID 24663)
-- Name: data_processing_logs_adminUser_timestamp_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "data_processing_logs_adminUser_timestamp_idx" ON public.data_processing_logs USING btree ("adminUser", "timestamp");


--
-- TOC entry 3419 (class 1259 OID 24662)
-- Name: data_processing_logs_userId_timestamp_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "data_processing_logs_userId_timestamp_idx" ON public.data_processing_logs USING btree ("userId", "timestamp");


--
-- TOC entry 3430 (class 1259 OID 24670)
-- Name: data_retention_policies_dataCategory_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "data_retention_policies_dataCategory_key" ON public.data_retention_policies USING btree ("dataCategory");


--
-- TOC entry 3380 (class 1259 OID 17012)
-- Name: package_urls_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX package_urls_slug_key ON public.package_urls USING btree (slug);


--
-- TOC entry 3392 (class 1259 OID 24671)
-- Name: payments_providerTransactionId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "payments_providerTransactionId_key" ON public.payments USING btree ("providerTransactionId");


--
-- TOC entry 3393 (class 1259 OID 17016)
-- Name: payments_reference_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX payments_reference_key ON public.payments USING btree (reference);


--
-- TOC entry 3373 (class 1259 OID 17011)
-- Name: promotions_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX promotions_code_key ON public.promotions USING btree (code);


--
-- TOC entry 3365 (class 1259 OID 17009)
-- Name: providers_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX providers_name_key ON public.providers USING btree (name);


--
-- TOC entry 3368 (class 1259 OID 17010)
-- Name: providers_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX providers_slug_key ON public.providers USING btree (slug);


--
-- TOC entry 3420 (class 1259 OID 24664)
-- Name: rica_communication_logs_hashedFromNumber_timestamp_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "rica_communication_logs_hashedFromNumber_timestamp_idx" ON public.rica_communication_logs USING btree ("hashedFromNumber", "timestamp");


--
-- TOC entry 3421 (class 1259 OID 24665)
-- Name: rica_communication_logs_hashedToNumber_timestamp_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "rica_communication_logs_hashedToNumber_timestamp_idx" ON public.rica_communication_logs USING btree ("hashedToNumber", "timestamp");


--
-- TOC entry 3424 (class 1259 OID 24666)
-- Name: rica_communication_logs_retentionPeriod_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "rica_communication_logs_retentionPeriod_idx" ON public.rica_communication_logs USING btree ("retentionPeriod");


--
-- TOC entry 3425 (class 1259 OID 24667)
-- Name: security_audit_logs_eventType_timestamp_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "security_audit_logs_eventType_timestamp_idx" ON public.security_audit_logs USING btree ("eventType", "timestamp");


--
-- TOC entry 3428 (class 1259 OID 24669)
-- Name: security_audit_logs_riskLevel_timestamp_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "security_audit_logs_riskLevel_timestamp_idx" ON public.security_audit_logs USING btree ("riskLevel", "timestamp");


--
-- TOC entry 3429 (class 1259 OID 24668)
-- Name: security_audit_logs_userId_timestamp_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "security_audit_logs_userId_timestamp_idx" ON public.security_audit_logs USING btree ("userId", "timestamp");


--
-- TOC entry 3402 (class 1259 OID 17018)
-- Name: sessions_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX sessions_token_key ON public.sessions USING btree (token);


--
-- TOC entry 3381 (class 1259 OID 17013)
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- TOC entry 3406 (class 1259 OID 17021)
-- Name: verifications_identifier_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX verifications_identifier_token_key ON public.verifications USING btree (identifier, token);


--
-- TOC entry 3409 (class 1259 OID 17020)
-- Name: verifications_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX verifications_token_key ON public.verifications USING btree (token);


--
-- TOC entry 3410 (class 1259 OID 24660)
-- Name: whatsapp_messages_messageId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "whatsapp_messages_messageId_key" ON public.whatsapp_messages USING btree ("messageId");


--
-- TOC entry 3452 (class 2606 OID 17107)
-- Name: accounts accounts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3440 (class 2606 OID 17062)
-- Name: applications applications_packageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES public.packages(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3441 (class 2606 OID 17057)
-- Name: applications applications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3442 (class 2606 OID 17072)
-- Name: bills bills_packageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT "bills_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES public.packages(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3443 (class 2606 OID 17067)
-- Name: bills bills_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT "bills_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3454 (class 2606 OID 24687)
-- Name: data_consents data_consents_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_consents
    ADD CONSTRAINT "data_consents_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3450 (class 2606 OID 17097)
-- Name: documents documents_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT "documents_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3447 (class 2606 OID 17087)
-- Name: orders orders_packageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "orders_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES public.packages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3448 (class 2606 OID 17092)
-- Name: orders orders_promotionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "orders_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES public.promotions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3449 (class 2606 OID 17082)
-- Name: orders orders_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3438 (class 2606 OID 17047)
-- Name: package_urls package_urls_packageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.package_urls
    ADD CONSTRAINT "package_urls_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES public.packages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3433 (class 2606 OID 17022)
-- Name: packages packages_providerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT "packages_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES public.providers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3444 (class 2606 OID 24672)
-- Name: payments payments_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3445 (class 2606 OID 17077)
-- Name: payments payments_billId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_billId_fkey" FOREIGN KEY ("billId") REFERENCES public.bills(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3446 (class 2606 OID 24677)
-- Name: payments payments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3434 (class 2606 OID 17027)
-- Name: price_history price_history_packageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price_history
    ADD CONSTRAINT "price_history_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES public.packages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3435 (class 2606 OID 17032)
-- Name: promotions promotions_packageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT "promotions_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES public.packages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3451 (class 2606 OID 17102)
-- Name: sessions sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3436 (class 2606 OID 17037)
-- Name: special_rates special_rates_packageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.special_rates
    ADD CONSTRAINT "special_rates_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES public.packages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3437 (class 2606 OID 17042)
-- Name: special_rates special_rates_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.special_rates
    ADD CONSTRAINT "special_rates_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3439 (class 2606 OID 17052)
-- Name: users users_packageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES public.packages(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3453 (class 2606 OID 24682)
-- Name: whatsapp_messages whatsapp_messages_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.whatsapp_messages
    ADD CONSTRAINT "whatsapp_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


-- Completed on 2025-08-09 05:36:34 UTC

--
-- PostgreSQL database dump complete
--


import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Complete fibre packages from official Starcast pricing CSV (127 packages from 19 providers)
const fibrePackagesData = [
  { "id": "openserve_openserve_50_25mbps", "name": "Openserve 50/25Mbps", "provider": "Openserve", "price": 525, "type": "FIBRE", "speed": "50Mbps/25Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "openserve_openserve_50_50mbps", "name": "Openserve 50/50Mbps", "provider": "Openserve", "price": 765, "type": "FIBRE", "speed": "50Mbps/50Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "openserve_openserve_100_50mbps", "name": "Openserve 100/50Mbps", "provider": "Openserve", "price": 865, "type": "FIBRE", "speed": "100Mbps/50Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "openserve_openserve_100_100mbps", "name": "Openserve 100/100Mbps", "provider": "Openserve", "price": 965, "type": "FIBRE", "speed": "100Mbps/100Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "openserve_openserve_200_100mbps", "name": "Openserve 200/100Mbps", "provider": "Openserve", "price": 1105, "type": "FIBRE", "speed": "200Mbps/100Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "openserve_openserve_200_200mbps", "name": "Openserve 200/200Mbps", "provider": "Openserve", "price": 1175, "type": "FIBRE", "speed": "200Mbps/200Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "openserve_openserve_300_150mbps", "name": "Openserve 300/150Mbps", "provider": "Openserve", "price": 1335, "type": "FIBRE", "speed": "300Mbps/150Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "openserve_openserve_500_250mbps", "name": "Openserve 500/250Mbps", "provider": "Openserve", "price": 1535, "type": "FIBRE", "speed": "500Mbps/250Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "frogfoot_frogfoot_60_30mbps", "name": "Frogfoot 60/30Mbps", "provider": "Frogfoot", "price": 619, "type": "FIBRE", "speed": "60Mbps/30Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "frogfoot_frogfoot_60_60mbps", "name": "Frogfoot 60/60Mbps", "provider": "Frogfoot", "price": 755, "type": "FIBRE", "speed": "60Mbps/60Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "frogfoot_frogfoot_120_60mbps", "name": "Frogfoot 120/60Mbps", "provider": "Frogfoot", "price": 780, "type": "FIBRE", "speed": "120Mbps/60Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "frogfoot_frogfoot_120_120mbps", "name": "Frogfoot 120/120Mbps", "provider": "Frogfoot", "price": 880, "type": "FIBRE", "speed": "120Mbps/120Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "frogfoot_frogfoot_240_120mbps", "name": "Frogfoot 240/120Mbps", "provider": "Frogfoot", "price": 980, "type": "FIBRE", "speed": "240Mbps/120Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "frogfoot_frogfoot_240_240mbps", "name": "Frogfoot 240/240Mbps", "provider": "Frogfoot", "price": 1140, "type": "FIBRE", "speed": "240Mbps/240Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "frogfoot_frogfoot_400_200mbps", "name": "Frogfoot 400/200Mbps", "provider": "Frogfoot", "price": 1180, "type": "FIBRE", "speed": "400Mbps/200Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "frogfoot_frogfoot_400_400mbps", "name": "Frogfoot 400/400Mbps", "provider": "Frogfoot", "price": 1335, "type": "FIBRE", "speed": "400Mbps/400Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "frogfoot_frogfoot_1000_500mbps", "name": "Frogfoot 1000/500Mbps", "provider": "Frogfoot", "price": 1540, "type": "FIBRE", "speed": "1000Mbps/500Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "frogfoot_frogfoot_1000_1000mbps", "name": "Frogfoot 1000/1000Mbps", "provider": "Frogfoot", "price": 1710, "type": "FIBRE", "speed": "1000Mbps/1000Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "vuma_vuma_25_25mbps", "name": "Vuma 25/25Mbps", "provider": "Vuma", "price": 480, "type": "FIBRE", "speed": "25Mbps/25Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "vuma_vuma_50_25mbps", "name": "Vuma 50/25Mbps", "provider": "Vuma", "price": 594, "type": "FIBRE", "speed": "50Mbps/25Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "vuma_vuma_50_50mbps", "name": "Vuma 50/50Mbps", "provider": "Vuma", "price": 794, "type": "FIBRE", "speed": "50Mbps/50Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "vuma_vuma_100_50mbps", "name": "Vuma 100/50Mbps", "provider": "Vuma", "price": 794, "type": "FIBRE", "speed": "100Mbps/50Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "vuma_vuma_100_100mbps", "name": "Vuma 100/100Mbps", "provider": "Vuma", "price": 994, "type": "FIBRE", "speed": "100Mbps/100Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "vuma_vuma_200_200mbps", "name": "Vuma 200/200Mbps", "provider": "Vuma", "price": 1144, "type": "FIBRE", "speed": "200Mbps/200Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "vuma_vuma_500_200mbps", "name": "Vuma 500/200Mbps", "provider": "Vuma", "price": 1294, "type": "FIBRE", "speed": "500Mbps/200Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "vuma_vuma_1000_250mbps", "name": "Vuma 1000/250Mbps", "provider": "Vuma", "price": 1634, "type": "FIBRE", "speed": "1000Mbps/250Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "vuma_vuma_1000_500mbps", "name": "Vuma 1000/500Mbps", "provider": "Vuma", "price": 2355, "type": "FIBRE", "speed": "1000Mbps/500Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "octotel_octotel_25_25mbps", "name": "Octotel 25/25Mbps", "provider": "Octotel", "price": 375, "type": "FIBRE", "speed": "25Mbps/25Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "octotel_octotel_55_25mbps", "name": "Octotel 55/25Mbps", "provider": "Octotel", "price": 640, "type": "FIBRE", "speed": "55Mbps/25Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "octotel_octotel_100_100mbps", "name": "Octotel 100/100Mbps", "provider": "Octotel", "price": 860, "type": "FIBRE", "speed": "100Mbps/100Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "octotel_octotel_150_150mbps", "name": "Octotel 150/150Mbps", "provider": "Octotel", "price": 960, "type": "FIBRE", "speed": "150Mbps/150Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "octotel_octotel_300_200mbps", "name": "Octotel 300/200Mbps", "provider": "Octotel", "price": 1115, "type": "FIBRE", "speed": "300Mbps/200Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "octotel_octotel_500_200mbps", "name": "Octotel 500/200Mbps", "provider": "Octotel", "price": 1315, "type": "FIBRE", "speed": "500Mbps/200Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "octotel_octotel_1000_200mbps", "name": "Octotel 1000/200Mbps", "provider": "Octotel", "price": 1585, "type": "FIBRE", "speed": "1000Mbps/200Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "tt_connect_tt_connect_30_30mbps", "name": "TT Connect 30/30Mbps", "provider": "TT Connect", "price": 725, "type": "FIBRE", "speed": "30Mbps/30Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "tt_connect_tt_connect_50_50mbps", "name": "TT Connect 50/50Mbps", "provider": "TT Connect", "price": 935, "type": "FIBRE", "speed": "50Mbps/50Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "tt_connect_tt_connect_100_100mbps", "name": "TT Connect 100/100Mbps", "provider": "TT Connect", "price": 1030, "type": "FIBRE", "speed": "100Mbps/100Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "tt_connect_tt_connect_200_200mbps", "name": "TT Connect 200/200Mbps", "provider": "TT Connect", "price": 1235, "type": "FIBRE", "speed": "200Mbps/200Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "tt_connect_tt_connect_400_400mbps", "name": "TT Connect 400/400Mbps", "provider": "TT Connect", "price": 1525, "type": "FIBRE", "speed": "400Mbps/400Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "tt_connect_tt_connect_525_525mbps", "name": "TT Connect 525/525Mbps", "provider": "TT Connect", "price": 1725, "type": "FIBRE", "speed": "525Mbps/525Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "tt_connect_tt_connect_850_850mbps", "name": "TT Connect 850/850Mbps", "provider": "TT Connect", "price": 1915, "type": "FIBRE", "speed": "850Mbps/850Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "tt_connect_tt_connect_1000_1000mbps", "name": "TT Connect 1000/1000Mbps", "provider": "TT Connect", "price": 2369, "type": "FIBRE", "speed": "1000Mbps/1000Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "mitsol_mitsol_20_20mbps", "name": "Mitsol 20/20Mbps", "provider": "Mitsol", "price": 535, "type": "FIBRE", "speed": "20Mbps/20Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "mitsol_mitsol_50_25mbps", "name": "Mitsol 50/25Mbps", "provider": "Mitsol", "price": 615, "type": "FIBRE", "speed": "50Mbps/25Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "mitsol_mitsol_120_60mbps", "name": "Mitsol 120/60Mbps", "provider": "Mitsol", "price": 815, "type": "FIBRE", "speed": "120Mbps/60Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "mitsol_mitsol_120_120mbps", "name": "Mitsol 120/120Mbps", "provider": "Mitsol", "price": 915, "type": "FIBRE", "speed": "120Mbps/120Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "mitsol_mitsol_240_240mbps", "name": "Mitsol 240/240Mbps", "provider": "Mitsol", "price": 1105, "type": "FIBRE", "speed": "240Mbps/240Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "mitsol_mitsol_500_500mbps", "name": "Mitsol 500/500Mbps", "provider": "Mitsol", "price": 1325, "type": "FIBRE", "speed": "500Mbps/500Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "mitsol_mitsol_1000_1000mbps", "name": "Mitsol 1000/1000Mbps", "provider": "Mitsol", "price": 1525, "type": "FIBRE", "speed": "1000Mbps/1000Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "evotel_evotel_20_10mbps", "name": "Evotel 20/10Mbps", "provider": "Evotel", "price": 634, "type": "FIBRE", "speed": "20Mbps/10Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "evotel_evotel_60_60mbps", "name": "Evotel 60/60Mbps", "provider": "Evotel", "price": 760, "type": "FIBRE", "speed": "60Mbps/60Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "evotel_evotel_125_125mbps", "name": "Evotel 125/125Mbps", "provider": "Evotel", "price": 920, "type": "FIBRE", "speed": "125Mbps/125Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "evotel_evotel_250_250mbps", "name": "Evotel 250/250Mbps", "provider": "Evotel", "price": 1090, "type": "FIBRE", "speed": "250Mbps/250Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "evotel_evotel_600_600mbps", "name": "Evotel 600/600Mbps", "provider": "Evotel", "price": 1170, "type": "FIBRE", "speed": "600Mbps/600Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "evotel_evotel_850_850mbps", "name": "Evotel 850/850Mbps", "provider": "Evotel", "price": 1470, "type": "FIBRE", "speed": "850Mbps/850Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "thinkspeed_thinkspeed_30_30mbps", "name": "Thinkspeed 30/30Mbps", "provider": "Thinkspeed", "price": 675, "type": "FIBRE", "speed": "30Mbps/30Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "thinkspeed_thinkspeed_50_50mbps", "name": "Thinkspeed 50/50Mbps", "provider": "Thinkspeed", "price": 875, "type": "FIBRE", "speed": "50Mbps/50Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "thinkspeed_thinkspeed_100_100mbps", "name": "Thinkspeed 100/100Mbps", "provider": "Thinkspeed", "price": 975, "type": "FIBRE", "speed": "100Mbps/100Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "thinkspeed_thinkspeed_200_200mbps", "name": "Thinkspeed 200/200Mbps", "provider": "Thinkspeed", "price": 1175, "type": "FIBRE", "speed": "200Mbps/200Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "thinkspeed_thinkspeed_500_500mbps", "name": "Thinkspeed 500/500Mbps", "provider": "Thinkspeed", "price": 1375, "type": "FIBRE", "speed": "500Mbps/500Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "thinkspeed_thinkspeed_1000_500mbps", "name": "Thinkspeed 1000/500Mbps", "provider": "Thinkspeed", "price": 1475, "type": "FIBRE", "speed": "1000Mbps/500Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "clearaccess_clearaccess_8_8mbps", "name": "Clearaccess 8/8Mbps", "provider": "Clearaccess", "price": 320, "type": "FIBRE", "speed": "8Mbps/8Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "clearaccess_clearaccess_25_25mbps", "name": "Clearaccess 25/25Mbps", "provider": "Clearaccess", "price": 775, "type": "FIBRE", "speed": "25Mbps/25Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "clearaccess_clearaccess_50_50mbps", "name": "Clearaccess 50/50Mbps", "provider": "Clearaccess", "price": 985, "type": "FIBRE", "speed": "50Mbps/50Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "clearaccess_clearaccess_100_100mbps", "name": "Clearaccess 100/100Mbps", "provider": "Clearaccess", "price": 1135, "type": "FIBRE", "speed": "100Mbps/100Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "clearaccess_clearaccess_200_200mbps", "name": "Clearaccess 200/200Mbps", "provider": "Clearaccess", "price": 1365, "type": "FIBRE", "speed": "200Mbps/200Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "dnatel_dnatel_10_10mbps", "name": "DNATel 10/10Mbps", "provider": "DNATel", "price": 620, "type": "FIBRE", "speed": "10Mbps/10Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "dnatel_dnatel_30_30mbps", "name": "DNATel 30/30Mbps", "provider": "DNATel", "price": 650, "type": "FIBRE", "speed": "30Mbps/30Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "dnatel_dnatel_50_50mbps", "name": "DNATel 50/50Mbps", "provider": "DNATel", "price": 785, "type": "FIBRE", "speed": "50Mbps/50Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "dnatel_dnatel_100_100mbps", "name": "DNATel 100/100Mbps", "provider": "DNATel", "price": 915, "type": "FIBRE", "speed": "100Mbps/100Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "dnatel_dnatel_200_200mbps", "name": "DNATel 200/200Mbps", "provider": "DNATel", "price": 985, "type": "FIBRE", "speed": "200Mbps/200Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "vodacom_vodacom_20_10mbps", "name": "Vodacom 20/10Mbps", "provider": "Vodacom", "price": 594, "type": "FIBRE", "speed": "20Mbps/10Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "vodacom_vodacom_20_20mbps", "name": "Vodacom 20/20Mbps", "provider": "Vodacom", "price": 694, "type": "FIBRE", "speed": "20Mbps/20Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "vodacom_vodacom_50_25mbps", "name": "Vodacom 50/25Mbps", "provider": "Vodacom", "price": 794, "type": "FIBRE", "speed": "50Mbps/25Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "vodacom_vodacom_50_50mbps", "name": "Vodacom 50/50Mbps", "provider": "Vodacom", "price": 894, "type": "FIBRE", "speed": "50Mbps/50Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "vodacom_vodacom_100_100mbps", "name": "Vodacom 100/100Mbps", "provider": "Vodacom", "price": 994, "type": "FIBRE", "speed": "100Mbps/100Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "vodacom_vodacom_200_200mbps", "name": "Vodacom 200/200Mbps", "provider": "Vodacom", "price": 1094, "type": "FIBRE", "speed": "200Mbps/200Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "link_layer_link_layer_30_30mbps", "name": "Link Layer 30/30Mbps", "provider": "Link Layer", "price": 520, "type": "FIBRE", "speed": "30Mbps/30Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "link_layer_link_layer_50_50mbps", "name": "Link Layer 50/50Mbps", "provider": "Link Layer", "price": 720, "type": "FIBRE", "speed": "50Mbps/50Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "link_layer_link_layer_100_100mbps", "name": "Link Layer 100/100Mbps", "provider": "Link Layer", "price": 870, "type": "FIBRE", "speed": "100Mbps/100Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "link_layer_link_layer_200_200mbps", "name": "Link Layer 200/200Mbps", "provider": "Link Layer", "price": 1030, "type": "FIBRE", "speed": "200Mbps/200Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "link_layer_link_layer_500_500mbps", "name": "Link Layer 500/500Mbps", "provider": "Link Layer", "price": 1325, "type": "FIBRE", "speed": "500Mbps/500Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "metrofibre_nexus_nexus_25_25mbps", "name": "Nexus 25/25Mbps", "provider": "MetroFibre Nexus", "price": 395, "type": "FIBRE", "speed": "25Mbps/25Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "metrofibre_nexus_nexus_45_45mbps", "name": "Nexus 45/45Mbps", "provider": "MetroFibre Nexus", "price": 685, "type": "FIBRE", "speed": "45Mbps/45Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "metrofibre_nexus_nexus_75_75mbps", "name": "Nexus 75/75Mbps", "provider": "MetroFibre Nexus", "price": 785, "type": "FIBRE", "speed": "75Mbps/75Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "metrofibre_nexus_nexus_150_150mbps", "name": "Nexus 150/150Mbps", "provider": "MetroFibre Nexus", "price": 885, "type": "FIBRE", "speed": "150Mbps/150Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "metrofibre_nexus_nexus_250_250mbps", "name": "Nexus 250/250Mbps", "provider": "MetroFibre Nexus", "price": 955, "type": "FIBRE", "speed": "250Mbps/250Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "metrofibre_nexus_nexus_500_500mbps", "name": "Nexus 500/500Mbps", "provider": "MetroFibre Nexus", "price": 1375, "type": "FIBRE", "speed": "500Mbps/500Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "metrofibre_nexus_nexus_1000_200mbps", "name": "Nexus 1000/200Mbps", "provider": "MetroFibre Nexus", "price": 1435, "type": "FIBRE", "speed": "1000Mbps/200Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "metrofibre_nova_nova_20_20mbps", "name": "Nova 20/20Mbps", "provider": "MetroFibre Nova", "price": 485, "type": "FIBRE", "speed": "20Mbps/20Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "metrofibre_nova_nova_40_40mbps", "name": "Nova 40/40Mbps", "provider": "MetroFibre Nova", "price": 585, "type": "FIBRE", "speed": "40Mbps/40Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "metrofibre_nova_nova_60_60mbps", "name": "Nova 60/60Mbps", "provider": "MetroFibre Nova", "price": 685, "type": "FIBRE", "speed": "60Mbps/60Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "metrofibre_nova_nova_150_150mbps", "name": "Nova 150/150Mbps", "provider": "MetroFibre Nova", "price": 885, "type": "FIBRE", "speed": "150Mbps/150Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "metrofibre_nova_nova_250_250mbps", "name": "Nova 250/250Mbps", "provider": "MetroFibre Nova", "price": 955, "type": "FIBRE", "speed": "250Mbps/250Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "metrofibre_nova_nova_500_500mbps", "name": "Nova 500/500Mbps", "provider": "MetroFibre Nova", "price": 1385, "type": "FIBRE", "speed": "500Mbps/500Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "metrofibre_nova_nova_1000_250mbps", "name": "Nova 1000/250Mbps", "provider": "MetroFibre Nova", "price": 1445, "type": "FIBRE", "speed": "1000Mbps/250Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "steyn_city_steyn_city_10_10mbps", "name": "Steyn City 10/10Mbps", "provider": "Steyn City", "price": 675, "type": "FIBRE", "speed": "10Mbps/10Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "steyn_city_steyn_city_25_25mbps", "name": "Steyn City 25/25Mbps", "provider": "Steyn City", "price": 875, "type": "FIBRE", "speed": "25Mbps/25Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "steyn_city_steyn_city_50_50mbps", "name": "Steyn City 50/50Mbps", "provider": "Steyn City", "price": 1175, "type": "FIBRE", "speed": "50Mbps/50Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "steyn_city_steyn_city_100_100mbps", "name": "Steyn City 100/100Mbps", "provider": "Steyn City", "price": 1555, "type": "FIBRE", "speed": "100Mbps/100Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "steyn_city_steyn_city_200_200mbps", "name": "Steyn City 200/200Mbps", "provider": "Steyn City", "price": 1975, "type": "FIBRE", "speed": "200Mbps/200Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "zoom_fibre_zoom_fibre_50_50mbps", "name": "Zoom Fibre 50/50Mbps", "provider": "Zoom Fibre", "price": 685, "type": "FIBRE", "speed": "50Mbps/50Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "zoom_fibre_zoom_fibre_100_100mbps", "name": "Zoom Fibre 100/100Mbps", "provider": "Zoom Fibre", "price": 885, "type": "FIBRE", "speed": "100Mbps/100Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "zoom_fibre_zoom_fibre_200_200mbps", "name": "Zoom Fibre 200/200Mbps", "provider": "Zoom Fibre", "price": 985, "type": "FIBRE", "speed": "200Mbps/200Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "zoom_fibre_zoom_fibre_500_250mbps", "name": "Zoom Fibre 500/250Mbps", "provider": "Zoom Fibre", "price": 1150, "type": "FIBRE", "speed": "500Mbps/250Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "zoom_fibre_zoom_fibre_1000_500mbps", "name": "Zoom Fibre 1000/500Mbps", "provider": "Zoom Fibre", "price": 1275, "type": "FIBRE", "speed": "1000Mbps/500Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "netstream_netstream_4_4mbps", "name": "Netstream 4/4Mbps", "provider": "Netstream", "price": 605, "type": "FIBRE", "speed": "4Mbps/4Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "netstream_netstream_10_10mbps", "name": "Netstream 10/10Mbps", "provider": "Netstream", "price": 735, "type": "FIBRE", "speed": "10Mbps/10Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "netstream_netstream_20_20mbps", "name": "Netstream 20/20Mbps", "provider": "Netstream", "price": 905, "type": "FIBRE", "speed": "20Mbps/20Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "netstream_netstream_50_50mbps", "name": "Netstream 50/50Mbps", "provider": "Netstream", "price": 1105, "type": "FIBRE", "speed": "50Mbps/50Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "netstream_netstream_100_100mbps", "name": "Netstream 100/100Mbps", "provider": "Netstream", "price": 1305, "type": "FIBRE", "speed": "100Mbps/100Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "lightstruck_lightstruck_50_50mbps", "name": "Lightstruck 50/50Mbps", "provider": "Lightstruck", "price": 790, "type": "FIBRE", "speed": "50Mbps/50Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "lightstruck_lightstruck_200_100mbps", "name": "Lightstruck 200/100Mbps", "provider": "Lightstruck", "price": 1090, "type": "FIBRE", "speed": "200Mbps/100Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "lightstruck_lightstruck_250_200mbps", "name": "Lightstruck 250/200Mbps", "provider": "Lightstruck", "price": 1290, "type": "FIBRE", "speed": "250Mbps/200Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "lightstruck_lightstruck_250_250mbps", "name": "Lightstruck 250/250Mbps", "provider": "Lightstruck", "price": 1390, "type": "FIBRE", "speed": "250Mbps/250Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "lightstruck_lightstruck_500_500mbps", "name": "Lightstruck 500/500Mbps", "provider": "Lightstruck", "price": 1490, "type": "FIBRE", "speed": "500Mbps/500Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "lightstruck_lightstruck_1000_1000mbps", "name": "Lightstruck 1000/1000Mbps", "provider": "Lightstruck", "price": 2190, "type": "FIBRE", "speed": "1000Mbps/1000Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "pphg_pphg_50_25mbps", "name": "PPHG 50/25Mbps", "provider": "PPHG", "price": 690, "type": "FIBRE", "speed": "50Mbps/25Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "pphg_pphg_50_50mbps", "name": "PPHG 50/50Mbps", "provider": "PPHG", "price": 790, "type": "FIBRE", "speed": "50Mbps/50Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "pphg_pphg_100_50mbps", "name": "PPHG 100/50Mbps", "provider": "PPHG", "price": 890, "type": "FIBRE", "speed": "100Mbps/50Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "pphg_pphg_100_100mbps", "name": "PPHG 100/100Mbps", "provider": "PPHG", "price": 990, "type": "FIBRE", "speed": "100Mbps/100Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "pphg_pphg_200_100mbps", "name": "PPHG 200/100Mbps", "provider": "PPHG", "price": 1090, "type": "FIBRE", "speed": "200Mbps/100Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "pphg_pphg_200_200mbps", "name": "PPHG 200/200Mbps", "provider": "PPHG", "price": 1190, "type": "FIBRE", "speed": "200Mbps/200Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "pphg_pphg_250_200mbps", "name": "PPHG 250/200Mbps", "provider": "PPHG", "price": 1290, "type": "FIBRE", "speed": "250Mbps/200Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "pphg_pphg_250_250mbps", "name": "PPHG 250/250Mbps", "provider": "PPHG", "price": 1390, "type": "FIBRE", "speed": "250Mbps/250Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "pphg_pphg_500_500mbps", "name": "PPHG 500/500Mbps", "provider": "PPHG", "price": 1490, "type": "FIBRE", "speed": "500Mbps/500Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null },
  { "id": "pphg_pphg_1000_1000mbps", "name": "PPHG 1000/1000Mbps", "provider": "PPHG", "price": 2190, "type": "FIBRE", "speed": "1000Mbps/1000Mbps", "data": "Uncapped", "fupDescription": "Pro Rata applies to all Fibre Accounts", "specialTerms": null }
]

const ltePackagesData = [
  // Vodacom Fixed LTE - Based on Axxess official pricing document
  {
    "id": "vodacom_lte_up_to_20mbps",
    "name": "Up to 20Mbps",
    "provider": "Vodacom",
    "price": 269,
    "type": "LTE_FIXED",
    "technology": "LTE",
    "speed": "20Mbps",
    "data": "Uncapped",
    "fupLimit": "50GB",
    "throttleSpeed": "2Mbps",
    "fupDescription": "Once AUP limit is reached, speed will change to 2Mbps",
    "specialTerms": "Speed is dependant on LTE router and network coverage"
  },
  {
    "id": "vodacom_lte_up_to_30mbps",
    "name": "Up to 30Mbps", 
    "provider": "Vodacom",
    "price": 369,
    "type": "LTE_FIXED",
    "technology": "LTE",
    "speed": "30Mbps",
    "data": "Uncapped",
    "fupLimit": "150GB",
    "throttleSpeed": "2Mbps",
    "fupDescription": "Once AUP limit is reached, speed will change to 2Mbps",
    "specialTerms": "Speed is dependant on LTE router and network coverage"
  },
  {
    "id": "vodacom_lte_up_to_50mbps",
    "name": "Up to 50Mbps",
    "provider": "Vodacom", 
    "price": 469,
    "type": "LTE_FIXED",
    "technology": "LTE",
    "speed": "50Mbps",
    "data": "Uncapped",
    "fupLimit": "300GB",
    "throttleSpeed": "2Mbps",
    "fupDescription": "Once AUP limit is reached, speed will change to 2Mbps",
    "specialTerms": "Speed is dependant on LTE router and network coverage"
  },
  {
    "id": "vodacom_lte_uncapped_pro",
    "name": "Uncapped LTE PRO",
    "provider": "Vodacom",
    "price": 669,
    "type": "LTE_FIXED", 
    "technology": "LTE",
    "speed": "100Mbps+ unlimited",
    "data": "Uncapped",
    "fupLimit": "600GB",
    "throttleSpeed": "1Mbps",
    "fupDescription": "Once AUP limit is reached, speed will change to 1Mbps",
    "specialTerms": null
  },

  // MTN Fixed LTE - Based on Axxess official pricing document
  {
    "id": "mtn_lte_up_to_30mbps",
    "name": "Up to 30Mbps",
    "provider": "MTN",
    "price": 339,
    "type": "LTE_FIXED",
    "technology": "LTE", 
    "speed": "30Mbps",
    "data": "Uncapped",
    "fupLimit": "50GB",
    "throttleSpeed": "2Mbps",
    "fupDescription": "Speed is dependent on LTE router and available capacity on the LTE tower your device is connected to",
    "specialTerms": null
  },
  {
    "id": "mtn_lte_up_to_75mbps",
    "name": "Up to 75Mbps",
    "provider": "MTN",
    "price": 379,
    "type": "LTE_FIXED",
    "technology": "LTE",
    "speed": "75Mbps", 
    "data": "Uncapped",
    "fupLimit": "150GB",
    "throttleSpeed": "2Mbps",
    "fupDescription": "Speed is dependent on LTE router and available capacity on the LTE tower your device is connected to",
    "specialTerms": null
  },
  {
    "id": "mtn_lte_up_to_125mbps",
    "name": "Up to 125Mbps",
    "provider": "MTN",
    "price": 469,
    "type": "LTE_FIXED",
    "technology": "LTE",
    "speed": "125Mbps",
    "data": "Uncapped", 
    "fupLimit": "300GB",
    "throttleSpeed": "2Mbps",
    "fupDescription": "Speed is dependent on LTE router and available capacity on the LTE tower your device is connected to",
    "specialTerms": null
  },
  {
    "id": "mtn_lte_up_to_150mbps",
    "name": "Up to 150Mbps",
    "provider": "MTN",
    "price": 569,
    "type": "LTE_FIXED",
    "technology": "LTE",
    "speed": "150Mbps",
    "data": "Uncapped",
    "fupLimit": "500GB",
    "throttleSpeed": "2Mbps", 
    "fupDescription": "Speed is dependent on LTE router and available capacity on the LTE tower your device is connected to",
    "specialTerms": null
  },
  {
    "id": "mtn_lte_uncapped_pro",
    "name": "Uncapped LTE (Pro)",
    "provider": "MTN",
    "price": 799,
    "type": "LTE_FIXED",
    "technology": "LTE",
    "speed": "150Mbps+ unlimited",
    "data": "Uncapped",
    "fupLimit": "1000GB",
    "throttleSpeed": "1Mbps",
    "fupDescription": "Once AUP limit is reached, speed will change to 1Mbps. Speed is dependent on LTE router and network coverage",
    "specialTerms": "Operating time - 24 Hours"
  },

  // Telkom LTE - Based on Axxess official pricing document
  {
    "id": "telkom_lte_10mbps",
    "name": "10 Mbps Package",
    "provider": "Telkom",
    "price": 298, // Promotional price until 31 December 2025
    "type": "LTE_FIXED",
    "technology": "LTE",
    "speed": "10Mbps", 
    "data": "Uncapped",
    "fupLimit": "100GB",
    "throttleSpeed": "4Mbps",
    "secondaryThrottleSpeed": "2Mbps",
    "fupDescription": "100GB data @ 10Mbps. Thereafter 20GB data @ 4Mbps. Thereafter 2Mbps uncapped data rest of the month",
    "specialTerms": "P2P/NNTP type traffic will be further throttled. The promotional price is valid until 31 December 2025"
  },
  {
    "id": "telkom_lte_20mbps", 
    "name": "20 Mbps Package",
    "provider": "Telkom",
    "price": 589,
    "type": "LTE_FIXED",
    "technology": "LTE",
    "speed": "20Mbps",
    "data": "Uncapped",
    "fupLimit": "500GB",
    "throttleSpeed": "4Mbps",
    "secondaryThrottleSpeed": "2Mbps",
    "fupDescription": "500GB data @ 20Mbps. Thereafter 50GB data @ 4Mbps. Thereafter 2Mbps uncapped data rest of the month",
    "specialTerms": "P2P/NNTP type traffic will be further throttled"
  },
  {
    "id": "telkom_lte_30mbps",
    "name": "30 Mbps Package", 
    "provider": "Telkom",
    "price": 679,
    "type": "LTE_FIXED",
    "technology": "LTE",
    "speed": "30Mbps",
    "data": "Uncapped",
    "fupLimit": "600GB",
    "throttleSpeed": "4Mbps",
    "secondaryThrottleSpeed": "2Mbps", 
    "fupDescription": "600GB data @ 30Mbps. Thereafter 50GB data @ 4Mbps. Thereafter 2Mbps uncapped data rest of the month",
    "specialTerms": "P2P/NNTP type traffic will be further throttled"
  },

  // MTN Fixed 5G - Based on Axxess official pricing document
  {
    "id": "mtn_5g_standard",
    "name": "STANDARD",
    "provider": "MTN",
    "price": 399,
    "type": "5G_FIXED",
    "technology": "5G",
    "speed": "up to 500Mbps", 
    "data": "Uncapped",
    "fupLimit": "300GB",
    "throttleSpeed": "2Mbps",
    "fupDescription": "Speed is up to 500Mbps (dependent on 5G router capability and available capacity on the 5G tower your device is connected to). Once AUP limit is reached, speed will change to 2Mbps",
    "specialTerms": null
  },
  {
    "id": "mtn_5g_advanced",
    "name": "ADVANCED",
    "provider": "MTN", 
    "price": 549,
    "type": "5G_FIXED",
    "technology": "5G",
    "speed": "up to 500Mbps",
    "data": "Uncapped",
    "fupLimit": "450GB",
    "throttleSpeed": "2Mbps",
    "fupDescription": "Speed is up to 500Mbps (dependent on 5G router capability and available capacity on the 5G tower your device is connected to). Once AUP limit is reached, speed will change to 2Mbps",
    "specialTerms": null
  },
  {
    "id": "mtn_5g_pro",
    "name": "PRO",
    "provider": "MTN",
    "price": 649,
    "type": "5G_FIXED",
    "technology": "5G",
    "speed": "up to 500Mbps",
    "data": "Uncapped",
    "fupLimit": "600GB", 
    "throttleSpeed": "2Mbps",
    "fupDescription": "Speed is up to 500Mbps (dependent on 5G router capability and available capacity on the 5G tower your device is connected to). Once AUP limit is reached, speed will change to 2Mbps",
    "specialTerms": null
  },
  {
    "id": "mtn_5g_pro_plus",
    "name": "PRO+",
    "provider": "MTN",
    "price": 849,
    "type": "5G_FIXED",
    "technology": "5G",
    "speed": "up to 500Mbps",
    "data": "Uncapped",
    "fupLimit": "1000GB",
    "throttleSpeed": "2Mbps",
    "fupDescription": "Speed is up to 500Mbps (dependent on 5G router capability and available capacity on the 5G tower your device is connected to). Once AUP limit is reached, speed will change to 2Mbps",
    "specialTerms": null
  },

  // Vodacom Fixed 5G - Based on Axxess official pricing document  
  {
    "id": "vodacom_5g_standard",
    "name": "STANDARD",
    "provider": "Vodacom",
    "price": 445,
    "type": "5G_FIXED",
    "technology": "5G",
    "speed": null, // No specific speed mentioned in document
    "data": "Uncapped",
    "fupLimit": "250GB",
    "throttleSpeed": null, // No specific throttle speed mentioned, only "Acceptable Use Policy (AUP) applies"
    "fupDescription": "Acceptable Use Policy (AUP) applies",
    "specialTerms": null
  },
  {
    "id": "vodacom_5g_advanced", 
    "name": "ADVANCED",
    "provider": "Vodacom",
    "price": 645,
    "type": "5G_FIXED",
    "technology": "5G",
    "speed": null,
    "data": "Uncapped",
    "fupLimit": "350GB",
    "throttleSpeed": null,
    "fupDescription": "Acceptable Use Policy (AUP) applies",
    "specialTerms": null
  },
  {
    "id": "vodacom_5g_pro",
    "name": "PRO",
    "provider": "Vodacom",
    "price": 845,
    "type": "5G_FIXED",
    "technology": "5G",
    "speed": null,
    "data": "Uncapped",
    "fupLimit": "550GB",
    "throttleSpeed": null,
    "fupDescription": "Acceptable Use Policy (AUP) applies", 
    "specialTerms": null
  },
  {
    "id": "vodacom_5g_pro_plus",
    "name": "PRO+",
    "provider": "Vodacom", 
    "price": 945,
    "type": "5G_FIXED",
    "technology": "5G",
    "speed": null,
    "data": "Uncapped",
    "fupLimit": "750GB",
    "throttleSpeed": null,
    "fupDescription": "Acceptable Use Policy (AUP) applies",
    "specialTerms": null
  }
]

async function main() {
  console.log('🌱 Starting complete database seed (Fibre + LTE/5G)...')

  // Create ALL providers (Fibre + LTE/5G)
  const allProviders = [
    // Fibre providers (19 total)
    'Openserve', 'Frogfoot', 'Vuma', 'Octotel', 'TT Connect', 'Mitsol', 'Evotel', 
    'Thinkspeed', 'Clearaccess', 'DNATel', 'Link Layer', 'MetroFibre Nexus', 
    'MetroFibre Nova', 'Steyn City', 'Zoom Fibre', 'Netstream', 'Lightstruck', 'PPHG',
    // LTE/5G providers (3 total) - Note: Vodacom appears in both fibre and LTE
    'MTN', 'Vodacom', 'Telkom'
  ]
  const createdProviders: Record<string, any> = {}

  for (const providerName of allProviders) {
    const provider = await prisma.provider.upsert({
      where: { slug: providerName.toLowerCase() },
      update: {},
      create: {
        name: providerName,
        slug: providerName.toLowerCase(),
        active: true
      }
    })
    createdProviders[providerName] = provider
    console.log(`✅ Created provider: ${providerName}`)
  }

  // Create fibre packages first
  for (const packageData of fibrePackagesData) {
    const provider = createdProviders[packageData.provider]
    
    const pkg = await prisma.package.upsert({
      where: { id: packageData.id },
      update: {
        currentPrice: packageData.price
      },
      create: {
        id: packageData.id,
        name: packageData.name,
        providerId: provider.id,
        type: packageData.type as any,
        technology: 'Fibre',
        speed: packageData.speed,
        data: packageData.data,
        // Fibre uses basic FUP description
        fupDescription: packageData.fupDescription,
        specialTerms: packageData.specialTerms,
        // Fibre-specific fields (null for basic packages)
        fupLimit: null,
        throttleSpeed: null,
        secondaryThrottleSpeed: null,
        coverage: null,
        installation: null,
        // Pricing
        basePrice: packageData.price,
        currentPrice: packageData.price,
        active: true
      }
    })

    console.log(`✅ Created fibre package: ${packageData.name}`)
  }

  // Create LTE/5G packages with FUP terms
  for (const packageData of ltePackagesData) {
    const provider = createdProviders[packageData.provider]
    
    const pkg = await prisma.package.upsert({
      where: { id: packageData.id },
      update: {
        currentPrice: packageData.price
      },
      create: {
        id: packageData.id,
        name: packageData.name,
        providerId: provider.id,
        type: packageData.type as any,
        technology: packageData.technology,
        speed: packageData.speed,
        data: packageData.data,
        // New FUP fields
        fupLimit: packageData.fupLimit,
        throttleSpeed: packageData.throttleSpeed,
        secondaryThrottleSpeed: packageData.secondaryThrottleSpeed,
        fupDescription: packageData.fupDescription,
        specialTerms: packageData.specialTerms,
        // LTE/5G specific fields (using null since not in packageData interface)
        coverage: null,
        installation: null,
        // Pricing
        basePrice: packageData.price,
        currentPrice: packageData.price,
        active: true
      }
    })

    console.log(`✅ Created LTE/5G package: ${packageData.name}`)
  }


  // Create sample admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@starcast.co.za' },
    update: {},
    create: {
      email: 'admin@starcast.co.za',
      password: 'admin123', // In production, this should be hashed
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      active: true,
      emailVerified: true
    }
  })

  console.log(`✅ Created admin user: ${adminUser.email}`)

  console.log('🎉 Complete database seeding completed! (Fibre + LTE/5G)')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
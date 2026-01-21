-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 21, 2026 at 09:35 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `RET_Database`
--

-- --------------------------------------------------------

--
-- Table structure for table `Client`
--

CREATE TABLE `Client` (
  `id` varchar(191) NOT NULL,
  `name` varchar(255) NOT NULL,
  `logoUrl` varchar(512) NOT NULL,
  `category` varchar(191) NOT NULL,
  `subsidiary` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Client`
--

INSERT INTO `Client` (`id`, `name`, `logoUrl`, `category`, `subsidiary`, `createdAt`, `updatedAt`) VALUES
('02267a19-b820-4a14-adfc-a8beb9eb8031', 'Ooredoo Myanmar', '/images/logos/ooredoo-myanmar.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.371', '2026-01-21 14:35:24.371'),
('0712ac53-7df1-4d9d-a9ff-454fe64a38ce', 'Food Panda', '/images/logos/food-panda.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.399', '2026-01-21 14:35:24.399'),
('149a098c-757c-4f76-8bda-a558e6d031cd', 'Unilever', '/images/logos/unilever.png', 'Other Client', 'RET Advertising', '2026-01-21 14:35:24.411', '2026-01-21 14:35:24.411'),
('1abe1600-b4ae-44d6-8350-e615c8e18f05', 'Wave Money', '/images/logos/wave-money.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.394', '2026-01-21 14:35:24.394'),
('227ea029-5c0b-4b8a-9013-c6dd8c448689', 'Calsome (Nutritious Drink)', '/images/logos/calsome.png', 'Campaign Client', 'RET Advertising', '2026-01-21 14:35:24.408', '2026-01-21 14:35:24.408'),
('27bec89d-c446-4e1a-95e6-2abcbc7a9011', 'Indomie', '/images/logos/indomie.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.393', '2026-01-21 14:35:24.393'),
('2b0f4985-c58f-4481-b3ec-becb0e4b65e6', 'Myanmar Beer (MBL)', '/images/logos/myanmar-beer.png', 'Campaign Client', 'RET Advertising', '2026-01-21 14:35:24.409', '2026-01-21 14:35:24.409'),
('32173d26-e1c6-4b20-b8e7-53383dedbe5a', 'Yukioh Myanmar', '/images/logos/yukioh-myanmar.png', 'Other Client', 'RET Advertising', '2026-01-21 14:35:24.415', '2026-01-21 14:35:24.415'),
('34e94b4f-fb98-4a40-b6b3-cd06a54092fb', 'Atom Myanmar', '/images/logos/atom-myanmar.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.344', '2026-01-21 14:35:24.344'),
('357321b2-afc6-4dbf-8db8-35557ecace90', 'Sun Pharma', '/images/logos/sun-pharma.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.404', '2026-01-21 14:35:24.404'),
('42acb053-9378-4f0c-ac29-90c9b0c7841d', '81 The Best Quality', '/images/logos/81-best-quality.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.405', '2026-01-21 14:35:24.405'),
('4ca46a1c-e60b-41e5-a139-5d289c5174f8', 'Jotun (Paint)', '/images/logos/jotun.png', 'Campaign Client', 'RET Advertising', '2026-01-21 14:35:24.407', '2026-01-21 14:35:24.407'),
('51397ce7-a0c6-4272-9e74-1a9af916aa3b', 'Myanma Awba', '/images/logos/myanma-awba.png', 'Other Client', 'RET Advertising', '2026-01-21 14:35:24.414', '2026-01-21 14:35:24.414'),
('56b1451c-3d34-4224-850a-3f6ada883665', 'True Money', '/images/logos/true-money.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.395', '2026-01-21 14:35:24.395'),
('5cecfe50-9411-4076-8807-a8ef405e765b', 'GWE', '/images/logos/gwe.png', 'Other Client', 'RET Advertising', '2026-01-21 14:35:24.416', '2026-01-21 14:35:24.416'),
('5fdd2a4b-7d55-4641-bfeb-85a212cb5248', 'Mahar Ya Da Nar', '/images/logos/mahar-ya-da-nar.png', 'Other Client', 'RET Advertising', '2026-01-21 14:35:24.416', '2026-01-21 14:35:24.416'),
('6355e720-0f00-4938-9a58-52bc8ec1c970', 'Moe Yan Lottery', '/images/logos/moe-yan-lottery.png', 'Campaign Client', 'RET Advertising', '2026-01-21 14:35:24.410', '2026-01-21 14:35:24.410'),
('6ec9a50b-dc97-4998-8ff8-130be50044b1', 'Nissan', '/images/logos/nissan.png', 'Campaign Client', 'RET Advertising', '2026-01-21 14:35:24.405', '2026-01-21 14:35:24.405'),
('70450e3e-34d3-490f-901e-842e59840fa9', 'Heineken Myanmar', '/images/logos/heineken-myanmar.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.384', '2026-01-21 14:35:24.384'),
('709e3139-fc45-493a-ab81-6dfedaa2456b', 'Prudential', '/images/logos/prudential.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.404', '2026-01-21 14:35:24.404'),
('72bfc401-a3b4-4afb-bce8-a60267d9e132', 'Karzo Logistics', '/images/logos/karzo-logistics.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.400', '2026-01-21 14:35:24.400'),
('748e4e7a-980d-46a7-97c0-297dd57b50df', 'ABC Logistics', '/images/logos/abc-logistics.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.400', '2026-01-21 14:35:24.400'),
('76902822-1135-44b8-9dc8-c21b59586d42', 'Mercedes-Benz', '/images/logos/mercedes-benz.png', 'Campaign Client', 'RET Advertising', '2026-01-21 14:35:24.406', '2026-01-21 14:35:24.406'),
('782f4b54-9dd9-468d-b2b5-31c48987c15b', 'Carlsberg Myanmar', '/images/logos/carlsberg-myanmar.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.390', '2026-01-21 14:35:24.390'),
('7a1fcb96-e931-470f-96ce-2620b866961b', 'CB Bank', '/images/logos/cb-bank.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.396', '2026-01-21 14:35:24.396'),
('7d128794-697d-44bb-9d15-2adbc4f08f26', 'Premier Coffee', '/images/logos/premier-coffee.png', 'Campaign Client', 'RET Advertising', '2026-01-21 14:35:24.408', '2026-01-21 14:35:24.408'),
('85a3239e-4ae5-43af-bd5c-a4eaa8fbc30c', 'FAME', '/images/logos/fame.png', 'Campaign Client', 'RET Advertising', '2026-01-21 14:35:24.410', '2026-01-21 14:35:24.410'),
('85cb3c62-fcc0-4d6f-b7c5-8c4d5ec79367', 'VeVe', '/images/logos/veve.png', 'Campaign Client', 'RET Advertising', '2026-01-21 14:35:24.409', '2026-01-21 14:35:24.409'),
('869bb885-54f8-41bc-a9c2-bae15b196746', 'Double Rhinos Cement', '/images/logos/double-rhinos.png', 'Campaign Client', 'RET Advertising', '2026-01-21 14:35:24.407', '2026-01-21 14:35:24.407'),
('98f97fb3-01f6-49a0-bc1f-9de219de8c03', 'Pacific Group', '/images/logos/pacific-group.png', 'Other Client', 'RET Advertising', '2026-01-21 14:35:24.415', '2026-01-21 14:35:24.415'),
('9b17cc00-a375-497d-9004-f84df98dc632', 'CP Myanmar', '/images/logos/cp-myanmar.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.392', '2026-01-21 14:35:24.392'),
('a33e56a8-3d6c-405b-b7ed-612c90363c6b', 'Coca-Cola', '/images/logos/coca-cola.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.387', '2026-01-21 14:35:24.387'),
('a38e23df-2ce2-416e-82d1-4df0a12b7dcb', 'DKSH', '/images/logos/dksh.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.401', '2026-01-21 14:35:24.401'),
('aa1ac6df-1f94-41dc-a6de-7db7e2bc322a', 'Suletech Solutions', '/images/logos/suletech.png', 'Other Client', 'RET Advertising', '2026-01-21 14:35:24.412', '2026-01-21 14:35:24.412'),
('b0fe1c7e-d639-44e8-90a6-6c0ec3630467', 'Nestle Myanmar', '/images/logos/nestle-myanmar.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.381', '2026-01-21 14:35:24.381'),
('b1f04e25-db3e-4e82-bc9c-4f00e87d7c05', 'Shwe Taung Group', '/images/logos/shwe-taung.png', 'Other Client', 'RET Advertising', '2026-01-21 14:35:24.412', '2026-01-21 14:35:24.412'),
('b51c58d3-596d-486b-ae64-413611819dc1', 'Osotspa Myanmar (M-150)', '/images/logos/osotspa-myanmar.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.389', '2026-01-21 14:35:24.389'),
('b80f65a5-32f1-4f2a-8fed-5b06cf29dafb', 'MDG', '/images/logos/mdg.png', 'Other Client', 'RET Advertising', '2026-01-21 14:35:24.413', '2026-01-21 14:35:24.413'),
('b9ca338a-392a-4488-ae46-f9b9a0cc2b37', 'KSH (Industrial/Tools)', '/images/logos/ksh.png', 'Campaign Client', 'RET Advertising', '2026-01-21 14:35:24.408', '2026-01-21 14:35:24.408'),
('bfeb5a32-7de3-4fc6-9597-0677f5472784', 'JTI (Japan Tobacco International)', '/images/logos/jti.png', 'Other Client', 'RET Advertising', '2026-01-21 14:35:24.411', '2026-01-21 14:35:24.411'),
('c64736f5-f24f-4dbd-942c-37a12a971e2f', 'FMI Decaux', '/images/logos/fmi-decaux.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.402', '2026-01-21 14:35:24.402'),
('c969e63b-36ca-4baf-bbe9-f8adc5caff3e', 'Dutch Mill', '/images/logos/dutch-mill.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.391', '2026-01-21 14:35:24.391'),
('cc039df6-5360-488d-8256-277b96e0a448', 'MPT', '/images/logos/mpt.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.363', '2026-01-21 14:35:24.363'),
('d0d4e15c-10fe-4408-9995-d2aada99d99d', 'Mitsubishi Motors', '/images/logos/mitsubishi.png', 'Campaign Client', 'RET Advertising', '2026-01-21 14:35:24.406', '2026-01-21 14:35:24.406'),
('d266dec4-a420-403f-9cea-5c0996482004', 'Hyundai', '/images/logos/hyundai.png', 'Campaign Client', 'RET Advertising', '2026-01-21 14:35:24.406', '2026-01-21 14:35:24.406'),
('d478e7b4-eec1-4f2d-840a-63e70de2ba8e', 'AIA', '/images/logos/aia.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.403', '2026-01-21 14:35:24.403'),
('d6588ddf-072a-4741-b4ba-d2462acd2c1f', 'Trusty Pay', '/images/logos/trusty-pay.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.398', '2026-01-21 14:35:24.398'),
('d8b6182e-f99f-4991-a71a-48dec411e317', 'Pro-1 Global Home Center', '/images/logos/pro-1.png', 'Other Client', 'RET Advertising', '2026-01-21 14:35:24.414', '2026-01-21 14:35:24.414'),
('dfc30121-5cf9-43a0-9884-516e466ca603', 'ABC Convenience Store', '/images/logos/abc-convenience.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.401', '2026-01-21 14:35:24.401'),
('f196d2d9-ff86-4a90-838a-5f662ac72d10', 'Pahtama Group', '/images/logos/pahtama-group.png', 'Other Client', 'RET Advertising', '2026-01-21 14:35:24.413', '2026-01-21 14:35:24.413'),
('f1cd7d28-c1bc-4747-95c2-5d6b1f219bc6', 'Yoma Bank', '/images/logos/yoma-bank.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.394', '2026-01-21 14:35:24.394'),
('f5d6a660-b80d-41fd-874d-cd2c4d040a67', 'MIB Group', '/images/logos/mib-group.png', 'Other Client', 'RET Advertising', '2026-01-21 14:35:24.413', '2026-01-21 14:35:24.413'),
('fd080442-b526-4a28-a58d-b36d20ad448d', 'Yangon Bus Media (YBM)', '/images/logos/ybm.png', 'Contract Client', 'RET Advertising', '2026-01-21 14:35:24.402', '2026-01-21 14:35:24.402');

-- --------------------------------------------------------

--
-- Table structure for table `ConstructionProject`
--

CREATE TABLE `ConstructionProject` (
  `id` varchar(191) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `imageUrl` varchar(512) NOT NULL,
  `status` varchar(191) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `LegalDocument`
--

CREATE TABLE `LegalDocument` (
  `id` varchar(191) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `documentUrl` varchar(512) NOT NULL,
  `type` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `LegalDocument`
--

INSERT INTO `LegalDocument` (`id`, `title`, `description`, `documentUrl`, `type`, `createdAt`, `updatedAt`) VALUES
('0346b9a33c34d1b5b66d0b2001488384', 'Certificate of Incorporation', 'Royal Ever Truth Business Group Co., Ltd registration (No. 102364597)', '/uploads/1768980600926-mx62t6mhe5.jpg', 'Certificate', '2026-01-21 13:59:29.000', '2026-01-21 14:00:00.000'),
('21357f0f6bde35d0faebc7abcb317832', 'Business Operating License (Advertising)', 'Royal Ever Truth Business Group Co., Ltd – Advertising license (Registration No. 102364597CT2025-2026-02568)', '/uploads/1768980613010-qaa8dlknvq.jpg', 'License', '2026-01-21 13:59:29.000', '2026-01-21 14:00:13.000'),
('346b735cd254b152f83792948f04b17f', 'Supplier / Contractor Registration', 'Royal Ever Truth Co., Ltd supplier / contractor registration (M180821004A)', '/uploads/1768980624610-ge4mhq1jmzv.jpg', 'Registration', '2026-01-21 13:59:29.000', '2026-01-21 14:00:24.000');

-- --------------------------------------------------------

--
-- Table structure for table `Project`
--

CREATE TABLE `Project` (
  `id` varchar(191) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(191) NOT NULL,
  `imageUrl` varchar(512) NOT NULL,
  `subsidiary` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Project`
--

INSERT INTO `Project` (`id`, `title`, `description`, `category`, `imageUrl`, `subsidiary`, `createdAt`, `updatedAt`) VALUES
('f50309bb-8ea2-4f6e-8853-4dc3161374d0', 'ggg', 'oidjfo;iaejfoiejf', 'Signboards', '/uploads/1768979576281-hg2brr1ez.png', 'RET Advertising', '2026-01-21 13:37:37.779', '2026-01-21 13:42:56.896');

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` varchar(191) NOT NULL,
  `key` varchar(191) NOT NULL,
  `value` mediumtext NOT NULL,
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`id`, `key`, `value`, `updatedAt`) VALUES
('001e1703-e6e1-4bd0-97aa-52e55886d493', 'mission', '', '2026-01-21 13:56:14.630'),
('42416007-a762-418f-9f98-ffaa1e44307e', 'officeAddress', 'No. 5, Tha Pyay Shwe Htee Road, 10th Quarter, South Okkalapa, Yangon', '2026-01-21 13:56:14.637'),
('4b61c9aa-02b5-4997-87e5-59b6400c155d', 'vision', '', '2026-01-21 13:56:14.636'),
('4e1305c9142638e8e509619252773358', 'organizationChartUrl', '/uploads/1768980369364-tl52d4ywrqc.png', '2026-01-21 13:56:09.000'),
('caae1630-675a-4718-a99e-fdb2a911aa01', 'history', '', '2026-01-21 13:56:14.637');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Client`
--
ALTER TABLE `Client`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ConstructionProject`
--
ALTER TABLE `ConstructionProject`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `LegalDocument`
--
ALTER TABLE `LegalDocument`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Project`
--
ALTER TABLE `Project`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key` (`key`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

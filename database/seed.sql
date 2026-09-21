-- ============================================================
-- Police Criminal Record System — Seed Data
-- Demo data for presentation purposes — covers all 10 regions
-- ============================================================

-- Password hash for demo accounts (bcrypt hash of the respective passwords)
-- These will be replaced by the server setup script with proper bcrypt hashes

-- ============================================================
-- USERS (Demo + regional officers)
-- ============================================================

INSERT INTO users (email, password_hash, first_name, last_name, role, badge_number, station, region, phone) VALUES
('admin', '$2b$10$placeholder', 'Claude', 'Abanda', 'admin', 'ADM-001', 'DITT Headquarters', 'Centre', '+237 670 000 001'),
('policeofficer', '$2b$10$placeholder', 'Roger', 'Libog', 'police_officer', 'POL-042', 'Yaoundé Central Station', 'Centre', '+237 670 000 002'),
('judicialauthority', '$2b$10$placeholder', 'Marie', 'Elong', 'judicial_authority', 'JUD-015', 'Yaoundé High Court', 'Centre', '+237 670 000 003'),
('inspectorate', '$2b$10$placeholder', 'Jean', 'Tchinda', 'general_inspectorate', 'INS-008', 'General Inspectorate HQ', 'Centre', '+237 670 000 004'),
('policeofficer2', '$2b$10$placeholder', 'Paul', 'Mbarga', 'police_officer', 'POL-078', 'Douala Port Station', 'Littoral', '+237 670 000 005'),
('policeofficer3', '$2b$10$placeholder', 'Amina', 'Bello', 'police_officer', 'POL-103', 'Garoua Central Station', 'North', '+237 670 000 006'),
('policeofficer4', '$2b$10$placeholder', 'Divine', 'Ashu', 'police_officer', 'POL-115', 'Buea Central Station', 'South-West', '+237 670 000 007'),
('policeofficer5', '$2b$10$placeholder', 'Grace', 'Nkeng', 'police_officer', 'POL-128', 'Bamenda Central Station', 'North-West', '+237 670 000 008'),
('policeofficer6', '$2b$10$placeholder', 'Serge', 'Kenfack', 'police_officer', 'POL-142', 'Bafoussam Central Station', 'West', '+237 670 000 009'),
('policeofficer7', '$2b$10$placeholder', 'Alice', 'Ndolo', 'police_officer', 'POL-156', 'Bertoua Central Station', 'East', '+237 670 000 010'),
('policeofficer8', '$2b$10$placeholder', 'Oumarou', 'Sali', 'police_officer', 'POL-167', 'Ngaoundéré Central Station', 'Adamawa', '+237 670 000 011'),
('policeofficer9', '$2b$10$placeholder', 'Zara', 'Alhadji', 'police_officer', 'POL-179', 'Maroua Central Station', 'Far North', '+237 670 000 012'),
('policeofficer10', '$2b$10$placeholder', 'Christian', 'Mvondo', 'police_officer', 'POL-188', 'Ebolowa Central Station', 'South', '+237 670 000 013'),
('judicialauthority2', '$2b$10$placeholder', 'Sylvie', 'Njoh', 'judicial_authority', 'JUD-027', 'Douala High Court', 'Littoral', '+237 670 000 014');

-- ============================================================
-- CRIMINAL CASES (40 — 4 per region)
-- ============================================================

INSERT INTO criminal_cases (reference_no, title, nature, description, location, region, incident_date, status, registered_by) VALUES
-- Centre
('CR-2025-0001', 'Armed Robbery at Mokolo Market', 'Armed Robbery', 'Two armed suspects robbed a jewelry shop at Mokolo Market, fleeing with approximately 5 million FCFA worth of merchandise. Witnesses reported the suspects used a motorcycle to escape.', 'Mokolo Market, Yaoundé', 'Centre', '2025-07-20', 'under_investigation', 2),
('CR-2025-0002', 'Cybercrime Fraud Case', 'Cybercrime', 'Multiple victims reported losing funds through fraudulent mobile money transfers. The suspect used cloned SIM cards to intercept OTP codes and drain mobile money accounts. Total estimated loss: 12 million FCFA.', 'Online / Yaoundé', 'Centre', '2025-08-01', 'open', 2),
('CR-2025-0003', 'Identity Document Forgery Ring', 'Forgery', 'An organized ring producing counterfeit national identity cards and passports was discovered operating in the Biyem-Assi neighborhood. Printing equipment and 200+ blank cards were seized.', 'Biyem-Assi, Yaoundé', 'Centre', '2025-08-15', 'closed', 1),
('CR-2025-0004', 'Extortion Racket at Nsam', 'Extortion', 'Shop owners in the Nsam neighborhood reported being forced to pay protection fees under threat of violence. Investigation ongoing to identify the full network.', 'Nsam, Yaoundé', 'Centre', '2025-09-02', 'open', 2),
-- Littoral
('CR-2025-0005', 'Vehicle Theft Ring at Douala Port', 'Vehicle Theft', 'A network of vehicle theft has been identified operating around the Douala autonomous port. Three vehicles reported stolen within the past month have been traced to suspects operating in the Bonabéri area.', 'Douala Autonomous Port', 'Littoral', '2025-07-25', 'under_investigation', 5),
('CR-2025-0006', 'Warehouse Burglary at Bonabéri', 'Burglary', 'A commercial warehouse storing imported electronics was broken into overnight. Estimated losses exceed 8 million FCFA. Security footage shows three suspects.', 'Bonabéri, Douala', 'Littoral', '2025-08-03', 'open', 5),
('CR-2025-0007', 'Counterfeit Goods Seizure', 'Smuggling', 'Customs and police jointly seized a container of counterfeit branded goods at Douala port, estimated value 20 million FCFA. One suspect apprehended, network still under investigation.', 'Douala Port', 'Littoral', '2025-06-18', 'closed', 5),
('CR-2025-0008', 'Maritime Fuel Smuggling Case', 'Smuggling', 'Coast guard intercepted a vessel transporting smuggled fuel along the Littoral coastline. Investigation ongoing into the distribution network.', 'Littoral Coastline', 'Littoral', '2025-08-28', 'under_investigation', 5),
-- North
('CR-2025-0009', 'Drug Trafficking — Garoua Checkpoint', 'Drug Trafficking', 'Border police intercepted a vehicle carrying 50kg of cannabis at the Garoua northern checkpoint. The driver was arrested and two additional suspects are being sought.', 'Garoua Northern Checkpoint', 'North', '2025-08-10', 'under_investigation', 6),
('CR-2025-0010', 'Cattle Rustling near Benoué', 'Theft', 'A herd of 30 cattle was stolen from a farm near the Benoué river. Local herders report this is part of a recurring pattern in the area.', 'Benoué River area', 'North', '2025-07-12', 'open', 6),
('CR-2025-0011', 'Arms Trafficking Ring', 'Arms Trafficking', 'Intelligence led to the discovery of a small arms trafficking operation supplying illegal firearms across the North region. Several suspects identified.', 'Garoua', 'North', '2025-08-22', 'under_investigation', 6),
('CR-2025-0012', 'Market Arson in Garoua', 'Arson', 'A section of the Garoua central market was deliberately set on fire, destroying over 40 shops. Investigation concluded the fire was linked to a commercial dispute.', 'Garoua Central Market', 'North', '2025-05-30', 'closed', 6),
-- South-West
('CR-2025-0013', 'Assault at Buea Commercial Avenue', 'Assault', 'A physical altercation between two individuals resulted in severe injuries to the victim. Several eyewitnesses have provided statements.', 'Commercial Avenue, Buea', 'South-West', '2025-08-05', 'open', 7),
('CR-2025-0014', 'Kidnapping for Ransom in Limbe', 'Kidnapping', 'A prominent business owner was kidnapped from his residence in Limbe. The kidnappers demanded a ransom of 50 million FCFA. Investigation is ongoing with coordination between regional units.', 'Limbe, South-West', 'South-West', '2025-08-20', 'under_investigation', 7),
('CR-2025-0015', 'Timber Smuggling Case', 'Smuggling', 'Forestry officials and police intercepted trucks transporting illegally logged timber out of protected forest reserves near Kumba.', 'Kumba, South-West', 'South-West', '2025-07-08', 'open', 7),
('CR-2025-0016', 'Bank Fraud at Buea Branch', 'Fraud', 'An employee of a local bank branch was implicated in a scheme diverting customer funds. Internal audit uncovered the fraud after routine reconciliation.', 'Buea', 'South-West', '2025-06-02', 'closed', 7),
-- North-West
('CR-2025-0017', 'Assault at Bamenda Commercial Avenue', 'Assault', 'A physical altercation between two individuals resulted in severe injuries to the victim. The suspect fled the scene and remains at large. Several eyewitnesses have provided statements.', 'Commercial Avenue, Bamenda', 'North-West', '2025-08-05', 'open', 8),
('CR-2025-0018', 'Kidnapping Ring in Bamenda', 'Kidnapping', 'A coordinated kidnapping ring targeting local business owners was uncovered following a string of abductions across the Bamenda area.', 'Bamenda', 'North-West', '2025-08-14', 'under_investigation', 8),
('CR-2025-0019', 'Cattle Theft near Ndop', 'Theft', 'Farmers in the Ndop plain reported the theft of livestock over successive nights, believed to be the work of an organized group.', 'Ndop, North-West', 'North-West', '2025-07-19', 'open', 8),
('CR-2025-0020', 'Vandalism of Public Property', 'Vandalism', 'Public infrastructure including a health center and school were vandalized during civil unrest. Damage estimated at 15 million FCFA.', 'Bamenda', 'North-West', '2025-05-10', 'closed', 8),
-- West
('CR-2025-0021', 'Land Fraud in Bafoussam', 'Fraud', 'A land agent sold the same plots of land to multiple buyers using forged title documents, defrauding at least twelve families.', 'Bafoussam', 'West', '2025-08-01', 'open', 9),
('CR-2025-0022', 'Armed Robbery in Dschang', 'Armed Robbery', 'A group of armed men robbed a fuel station and adjacent shops in Dschang, escaping with cash and goods before police arrived.', 'Dschang, West', 'West', '2025-08-17', 'under_investigation', 9),
('CR-2025-0023', 'Human Trafficking Ring', 'Human Trafficking', 'Investigators uncovered a network recruiting young women with false job offers and trafficking them out of the region. Multiple victims have been identified.', 'Bafoussam', 'West', '2025-07-27', 'under_investigation', 9),
('CR-2025-0024', 'Counterfeit Currency Case', 'Counterfeiting', 'Police seized printing equipment and counterfeit banknotes worth an estimated 6 million FCFA in a raid on a residential compound.', 'Bafoussam', 'West', '2025-06-11', 'closed', 9),
-- East
('CR-2025-0025', 'Illegal Logging near Bertoua', 'Environmental Crime', 'A logging operation without proper permits was discovered clearing protected forest land near Bertoua, causing significant environmental damage.', 'Bertoua', 'East', '2025-08-09', 'open', 10),
('CR-2025-0026', 'Poaching Ring in Boumba-Ngoko', 'Poaching', 'Wildlife rangers and police jointly investigated an organized poaching ring targeting protected species in the Boumba-Ngoko reserve.', 'Boumba-Ngoko', 'East', '2025-07-30', 'under_investigation', 10),
('CR-2025-0027', 'Gold Trafficking Case', 'Trafficking', 'Artisanal gold believed to be illegally mined was intercepted en route to a buyer outside the region. Investigation targets the supply chain.', 'Bertoua', 'East', '2025-08-24', 'under_investigation', 10),
('CR-2025-0028', 'Assault at Bertoua Market', 'Assault', 'A dispute between traders escalated into a violent assault, leaving one victim hospitalized. Suspect identified but not yet apprehended.', 'Bertoua Central Market', 'East', '2025-05-22', 'closed', 10),
-- Adamawa
('CR-2025-0029', 'Cattle Rustling near Ngaoundéré', 'Theft', 'A coordinated raid resulted in the theft of over 50 head of cattle from herders outside Ngaoundéré.', 'Ngaoundéré', 'Adamawa', '2025-08-06', 'open', 11),
('CR-2025-0030', 'Highway Robbery on the Adamawa Corridor', 'Armed Robbery', 'Armed men blocked and robbed several vehicles traveling along the Ngaoundéré-Garoua highway over a two-week period.', 'Adamawa Highway Corridor', 'Adamawa', '2025-08-19', 'under_investigation', 11),
('CR-2025-0031', 'Kidnapping for Ransom in Tibati', 'Kidnapping', 'A local trader was abducted near Tibati and held for ransom. Regional units are coordinating the response.', 'Tibati, Adamawa', 'Adamawa', '2025-07-15', 'under_investigation', 11),
('CR-2025-0032', 'Fuel Smuggling Case', 'Smuggling', 'Subsidized fuel was found being diverted and resold across the regional border. Several fuel station operators are under investigation.', 'Ngaoundéré', 'Adamawa', '2025-06-05', 'closed', 11),
-- Far North
('CR-2025-0033', 'Drug Trafficking in Maroua', 'Drug Trafficking', 'A significant quantity of narcotics was intercepted during a routine checkpoint search near Maroua, leading to an expanded investigation.', 'Maroua', 'Far North', '2025-08-11', 'under_investigation', 12),
('CR-2025-0034', 'Extortion Linked to Armed Groups', 'Extortion', 'Local businesses reported being forced to pay for protection by individuals linked to cross-border armed groups.', 'Mora, Far North', 'Far North', '2025-08-25', 'under_investigation', 12),
('CR-2025-0035', 'Livestock Theft near Kousseri', 'Theft', 'A series of livestock thefts near the border town of Kousseri have been linked to a single organized group.', 'Kousseri', 'Far North', '2025-07-21', 'open', 12),
('CR-2025-0036', 'Market Robbery in Maroua', 'Armed Robbery', 'Armed suspects robbed several stalls at the Maroua central market in a coordinated daylight raid.', 'Maroua Central Market', 'Far North', '2025-05-28', 'closed', 12),
-- South
('CR-2025-0037', 'Illegal Mining near Ebolowa', 'Environmental Crime', 'An unlicensed mining operation was discovered operating near Ebolowa, causing damage to nearby farmland and waterways.', 'Ebolowa', 'South', '2025-08-13', 'open', 13),
('CR-2025-0038', 'Armed Robbery in Sangmelima', 'Armed Robbery', 'A group of armed suspects robbed a currency exchange office in Sangmelima, escaping with a significant amount of cash.', 'Sangmelima, South', 'South', '2025-08-27', 'under_investigation', 13),
('CR-2025-0039', 'Wildlife Trafficking Ring', 'Trafficking', 'Investigators identified a network trafficking protected wildlife species and their parts through the South region toward export routes.', 'Ebolowa', 'South', '2025-07-17', 'under_investigation', 13),
('CR-2025-0040', 'Fraud at Ebolowa Cooperative', 'Fraud', 'Members of an agricultural cooperative reported missing funds after an internal review flagged irregular withdrawals by a cooperative officer.', 'Ebolowa', 'South', '2025-06-09', 'closed', 13);

-- ============================================================
-- PERSONS OF INTEREST (50 — 5 per region)
-- ============================================================

INSERT INTO persons_of_interest (first_name, last_name, alias, date_of_birth, gender, nationality, id_number, phone, address, physical_desc, is_wanted, registered_by) VALUES
-- Centre (1-5)
('Emmanuel', 'Njoya', 'Le Rapide', '1990-03-15', 'male', 'Cameroonian', 'CM-1990-03150-C', '+237 691 234 567', 'Mokolo Quarter, Yaoundé', 'Height: 180cm, Athletic build, Scar on left cheek, Dark complexion', TRUE, 2),
('Hervé', 'Fotso', NULL, '1985-11-22', 'male', 'Cameroonian', 'CM-1985-11220-C', '+237 677 345 678', 'Nsam, Yaoundé', 'Height: 175cm, Medium build, Bald head, Light skin', FALSE, 2),
('Aissatou', 'Djamal', 'La Hackeuse', '1995-06-10', 'female', 'Cameroonian', 'CM-1995-06100-C', NULL, 'Unknown', 'Height: 165cm, Slim build, Wears glasses, Often changes appearance', TRUE, 2),
('Pierre', 'Kamga', 'Le Faussaire', '1982-09-05', 'male', 'Cameroonian', 'CM-1982-09050-C', '+237 699 111 222', 'Biyem-Assi, Yaoundé', 'Height: 170cm, Slim build, Grey hair, Wears thick-framed glasses', FALSE, 1),
('Fatima', 'Biya', NULL, '1998-04-22', 'female', 'Cameroonian', 'CM-1998-04220-C', '+237 680 777 888', 'Bastos, Yaoundé', 'Height: 160cm, Slim build, Long braids', FALSE, 2),
-- Littoral (6-10)
('Jean-Paul', 'Ekwalla', NULL, '1987-02-14', 'male', 'Cameroonian', 'CM-1987-02140-L', '+237 674 222 111', 'Akwa, Douala', 'Height: 172cm, Medium build, Short beard', FALSE, 5),
('Brigitte', 'Manga', 'La Reine', '1991-10-03', 'female', 'Cameroonian', 'CM-1991-10030-L', '+237 655 333 444', 'Bonabéri, Douala', 'Height: 168cm, Slim build, Dyed red hair', TRUE, 5),
('Thomas', 'Njie', NULL, '1989-07-19', 'male', 'Cameroonian', 'CM-1989-07190-L', '+237 691 555 666', 'Deido, Douala', 'Height: 178cm, Athletic build, Tattoo on right forearm', FALSE, 5),
('Larissa', 'Doualla', NULL, '1996-01-25', 'female', 'Cameroonian', 'CM-1996-01250-L', '+237 677 888 999', 'Bali, Douala', 'Height: 163cm, Slim build, Distinctive mole on chin', FALSE, 5),
('Marcel', 'Ebogo', 'Le Fantôme', '1984-12-08', 'male', 'Cameroonian', 'CM-1984-12080-L', '+237 699 444 555', 'Douala Port area', 'Height: 182cm, Heavy build, Missing left index finger', TRUE, 5),
-- North (11-15)
('Moussa', 'Ousmanou', NULL, '1988-01-28', 'male', 'Nigerian', 'NG-PAS-A12345', '+237 650 987 654', 'Garoua, North Region', 'Height: 185cm, Heavy build, Tribal marks on face', FALSE, 6),
('Hadja', 'Oumarou', NULL, '1993-05-17', 'female', 'Cameroonian', 'CM-1993-05170-N', '+237 674 111 333', 'Garoua', 'Height: 158cm, Slim build, Wears headscarf', FALSE, 6),
('Aboubakar', 'Sali', 'Le Chacal', '1986-08-30', 'male', 'Cameroonian', 'CM-1986-08300-N', '+237 691 666 777', 'Benoué area, Garoua', 'Height: 176cm, Wiry build, Scar above right eyebrow', TRUE, 6),
('Ramatou', 'Bello', NULL, '1994-03-12', 'female', 'Cameroonian', 'CM-1994-03120-N', '+237 655 222 333', 'Garoua', 'Height: 162cm, Slim build, Gold tooth', FALSE, 6),
('Souleymane', 'Idi', NULL, '1983-11-02', 'male', 'Cameroonian', 'CM-1983-11020-N', '+237 699 777 888', 'Garoua outskirts', 'Height: 179cm, Muscular build, Long facial scar', TRUE, 6),
-- South-West (16-20)
('Divine', 'Ekema', NULL, '1992-06-24', 'male', 'Cameroonian', 'CM-1992-06240-SW', '+237 674 333 222', 'Molyko, Buea', 'Height: 174cm, Medium build, Short dreadlocks', FALSE, 7),
('Samuel', 'Ekane', 'The Bull', '1992-12-18', 'male', 'Cameroonian', 'CM-1992-12180-SW', '+237 674 555 666', 'Limbe, South-West', 'Height: 178cm, Medium build, Tattooed left arm', TRUE, 7),
('Comfort', 'Njie', NULL, '1997-09-09', 'female', 'Cameroonian', 'CM-1997-09090-SW', '+237 691 888 111', 'Buea', 'Height: 165cm, Slim build, Braided hair', FALSE, 7),
('Peter', 'Ebot', NULL, '1985-04-05', 'male', 'Cameroonian', 'CM-1985-04050-SW', '+237 655 444 555', 'Kumba, South-West', 'Height: 171cm, Medium build, Glasses', FALSE, 7),
('Godlove', 'Ashu', 'Shadow', '1990-10-21', 'male', 'Cameroonian', 'CM-1990-10210-SW', '+237 699 222 111', 'Limbe', 'Height: 180cm, Athletic build, Neck tattoo', TRUE, 7),
-- North-West (21-25)
('Grace', 'Nkeng', NULL, '1994-02-27', 'female', 'Cameroonian', 'CM-1994-02270-NW', '+237 674 666 555', 'Bamenda', 'Height: 160cm, Slim build, Short hair', FALSE, 8),
('Fon', 'Nkwenti', 'The General', '1981-07-13', 'male', 'Cameroonian', 'CM-1981-07130-NW', '+237 691 333 444', 'Bamenda outskirts', 'Height: 183cm, Heavy build, Deep voice, commanding presence', TRUE, 8),
('Miriam', 'Fru', NULL, '1996-11-16', 'female', 'Cameroonian', 'CM-1996-11160-NW', '+237 655 111 222', 'Bamenda', 'Height: 164cm, Slim build, Freckles', FALSE, 8),
('Divine', 'Atem', NULL, '1988-05-29', 'male', 'Cameroonian', 'CM-1988-05290-NW', '+237 699 555 444', 'Ndop, North-West', 'Height: 173cm, Medium build, Mustache', FALSE, 8),
('Bertrand', 'Che', 'Silent Killer', '1985-09-08', 'male', 'Cameroonian', 'CM-1985-09080-NW', '+237 674 444 333', 'Bamenda', 'Height: 177cm, Lean build, Quiet demeanor, always wears black', TRUE, 8),
-- West (26-30)
('Serge', 'Kenfack', NULL, '1991-03-04', 'male', 'Cameroonian', 'CM-1991-03040-W', '+237 691 222 333', 'Bafoussam', 'Height: 175cm, Medium build, Short beard', FALSE, 9),
('Nadège', 'Tchoumi', NULL, '1995-08-19', 'female', 'Cameroonian', 'CM-1995-08190-W', '+237 655 666 777', 'Bafoussam', 'Height: 161cm, Slim build, Long straight hair', FALSE, 9),
('Landry', 'Fotso', 'Le Sniper', '1987-01-11', 'male', 'Cameroonian', 'CM-1987-01110-W', '+237 699 888 999', 'Dschang, West', 'Height: 181cm, Athletic build, Steady gaze, calm under pressure', TRUE, 9),
('Carine', 'Nguemo', NULL, '1993-12-30', 'female', 'Cameroonian', 'CM-1993-12300-W', '+237 674 777 888', 'Bafoussam', 'Height: 159cm, Slim build, Round face', FALSE, 9),
('Willy', 'Dongmo', NULL, '1984-06-06', 'male', 'Cameroonian', 'CM-1984-06060-W', '+237 691 999 000', 'Bafoussam outskirts', 'Height: 176cm, Heavy build, Gold chain', TRUE, 9),
-- East (31-35)
('Alice', 'Ndolo', NULL, '1990-04-14', 'female', 'Cameroonian', 'CM-1990-04140-E', '+237 655 333 111', 'Bertoua', 'Height: 163cm, Slim build, Wears glasses', FALSE, 10),
('Bruno', 'Mboula', NULL, '1986-10-27', 'male', 'Cameroonian', 'CM-1986-10270-E', '+237 699 111 444', 'Bertoua', 'Height: 179cm, Medium build, Short afro', FALSE, 10),
('Judith', 'Ngo', 'La Louve', '1992-02-02', 'female', 'Cameroonian', 'CM-1992-02020-E', '+237 674 555 111', 'Boumba-Ngoko area', 'Height: 167cm, Athletic build, Sharp features', TRUE, 10),
('Patrick', 'Yaya', NULL, '1989-09-21', 'male', 'Cameroonian', 'CM-1989-09210-E', '+237 691 444 666', 'Bertoua', 'Height: 174cm, Medium build, Beard', FALSE, 10),
('Solange', 'Bakoa', NULL, '1994-07-07', 'female', 'Cameroonian', 'CM-1994-07070-E', '+237 655 888 222', 'Bertoua outskirts', 'Height: 162cm, Slim build, Shoulder-length hair', TRUE, 10),
-- Adamawa (36-40)
('Oumarou', 'Sali', NULL, '1988-11-11', 'male', 'Cameroonian', 'CM-1988-11110-A', '+237 699 333 555', 'Ngaoundéré', 'Height: 177cm, Medium build, Short beard', FALSE, 11),
('Aissatou', 'Hamadou', NULL, '1995-05-05', 'female', 'Cameroonian', 'CM-1995-05050-A', '+237 674 222 666', 'Ngaoundéré', 'Height: 160cm, Slim build, Wears headscarf', FALSE, 11),
('Ibrahim', 'Djoda', 'Le Taureau', '1983-08-08', 'male', 'Cameroonian', 'CM-1983-08080-A', '+237 691 777 333', 'Adamawa Highway Corridor', 'Height: 186cm, Heavy muscular build, Broad shoulders', TRUE, 11),
('Hawa', 'Yerima', NULL, '1997-01-19', 'female', 'Cameroonian', 'CM-1997-01190-A', '+237 655 444 888', 'Ngaoundéré', 'Height: 159cm, Slim build, Quiet manner', FALSE, 11),
('Adamou', 'Bouba', 'Le Nomade', '1985-12-24', 'male', 'Cameroonian', 'CM-1985-12240-A', '+237 699 666 111', 'Tibati, Adamawa', 'Height: 181cm, Lean build, Always traveling, rarely stays in one place', TRUE, 11),
-- Far North (41-45)
('Ibrahim', 'Tanko', 'Le Colosse', '1980-07-14', 'male', 'Cameroonian', 'CM-1980-07140-FN', '+237 655 444 333', 'Maroua, Far North', 'Height: 190cm, Heavy muscular build, Missing right ear lobe', TRUE, 12),
('Fatimatou', 'Alhadji', NULL, '1992-03-23', 'female', 'Cameroonian', 'CM-1992-03230-FN', '+237 674 111 999', 'Maroua', 'Height: 161cm, Slim build, Wears traditional attire', FALSE, 12),
('Zara', 'Malloum', NULL, '1996-06-16', 'female', 'Cameroonian', 'CM-1996-06160-FN', '+237 691 555 222', 'Mora, Far North', 'Height: 164cm, Slim build, Distinctive gap teeth', FALSE, 12),
('Boukar', 'Goni', 'L’Ombre', '1984-10-10', 'male', 'Cameroonian', 'CM-1984-10100-FN', '+237 699 222 777', 'Kousseri', 'Height: 178cm, Wiry build, Rarely seen in daylight', TRUE, 12),
('Aicha', 'Modu', NULL, '1998-02-08', 'female', 'Cameroonian', 'CM-1998-02080-FN', '+237 655 999 444', 'Maroua', 'Height: 158cm, Slim build, Soft-spoken', FALSE, 12),
-- South (46-50)
('Christian', 'Mvondo', NULL, '1991-09-17', 'male', 'Cameroonian', 'CM-1991-09170-S', '+237 674 888 555', 'Ebolowa', 'Height: 175cm, Medium build, Short hair', FALSE, 13),
('Bernadette', 'Assam', NULL, '1994-04-29', 'female', 'Cameroonian', 'CM-1994-04290-S', '+237 691 111 666', 'Ebolowa', 'Height: 163cm, Slim build, Warm smile', FALSE, 13),
('Rodrigue', 'Ondoa', 'Le Vautour', '1986-01-06', 'male', 'Cameroonian', 'CM-1986-01060-S', '+237 655 777 999', 'Sangmelima, South', 'Height: 180cm, Athletic build, Cold stare', TRUE, 13),
('Sylvie', 'Abomo', NULL, '1993-08-13', 'female', 'Cameroonian', 'CM-1993-08130-S', '+237 699 444 222', 'Ebolowa', 'Height: 162cm, Slim build, Long braids', FALSE, 13),
('Eric', 'Nnomo', 'Le Serpent', '1988-12-02', 'male', 'Cameroonian', 'CM-1988-12020-S', '+237 674 333 999', 'Ebolowa outskirts', 'Height: 174cm, Lean build, Calculated movements', TRUE, 13);

-- ============================================================
-- CASE-PERSONS LINKAGE
-- ============================================================

INSERT INTO case_persons (case_id, person_id, role_in_case) VALUES
(1, 1, 'primary_suspect'),
(2, 3, 'primary_suspect'), (2, 5, 'accomplice'),
(3, 4, 'primary_suspect'),
(4, 2, 'suspect'),
(5, 6, 'suspect'),
(6, 9, 'suspect'),
(7, 8, 'primary_suspect'),
(8, 10, 'primary_suspect'),
(9, 13, 'primary_suspect'), (9, 15, 'accomplice'),
(10, 11, 'suspect'),
(11, 15, 'primary_suspect'),
(12, 12, 'witness'),
(13, 16, 'suspect'),
(14, 17, 'primary_suspect'),
(15, 19, 'suspect'),
(16, 18, 'witness'),
(17, 22, 'primary_suspect'),
(18, 25, 'primary_suspect'),
(19, 21, 'suspect'),
(20, 24, 'witness'),
(21, 28, 'primary_suspect'),
(22, 30, 'primary_suspect'),
(23, 26, 'suspect'), (23, 29, 'accomplice'),
(24, 27, 'witness'),
(25, 33, 'primary_suspect'),
(26, 35, 'primary_suspect'),
(27, 31, 'suspect'),
(28, 34, 'witness'),
(29, 38, 'primary_suspect'),
(30, 40, 'primary_suspect'),
(31, 36, 'suspect'),
(32, 37, 'witness'),
(33, 41, 'primary_suspect'),
(34, 44, 'primary_suspect'),
(35, 42, 'suspect'),
(36, 45, 'witness'),
(37, 48, 'primary_suspect'),
(38, 50, 'primary_suspect'),
(39, 46, 'suspect'),
(40, 49, 'witness');

-- ============================================================
-- CRIMINAL RECORDS
-- ============================================================

INSERT INTO criminal_records (person_id, offence, offence_date, offence_location, sentence, court, verdict_date, verification_status, notes) VALUES
(1, 'Petty Theft', '2018-05-12', 'Yaoundé Central Market', '6 months imprisonment (suspended)', 'Yaoundé Court of First Instance', '2018-08-20', 'verified', 'First offence. Sentenced to suspended imprisonment with probation.'),
(1, 'Assault with a Weapon', '2020-02-15', 'Obili Quarter, Yaoundé', '18 months imprisonment', 'Yaoundé High Court', '2020-06-10', 'verified', 'Second offence. Served full sentence at Kondengui Central Prison.'),
(2, 'Minor Theft', '2016-03-02', 'Yaoundé', 'Fine', 'Yaoundé Court of First Instance', '2016-04-01', 'verified', 'Resolved with a fine; no further offences recorded since.'),
(3, 'Online Fraud', '2022-09-01', 'Online / Douala', '12 months imprisonment + 2M FCFA fine', 'Douala Court of First Instance', '2023-01-15', 'verified', 'Convicted for phishing attacks targeting bank customers.'),
(4, 'Document Forgery', '2019-11-10', 'Yaoundé', '24 months imprisonment', 'Yaoundé High Court', '2020-03-15', 'verified', 'Produced and distributed counterfeit driver licenses. Served sentence.'),
(4, 'Identity Fraud', '2023-06-01', 'Yaoundé', 'Under investigation', NULL, NULL, 'unverified', 'Suspected involvement in new identity card forgery ring. Case ongoing.'),
(6, 'Minor Assault', '2019-04-18', 'Akwa, Douala', 'Fine + community service', 'Douala Court of First Instance', '2019-05-30', 'verified', 'Resolved through mediation and community service.'),
(7, 'Smuggling', '2021-02-09', 'Douala Port', '15 months imprisonment', 'Douala High Court', '2021-07-22', 'verified', 'Involved in smuggling counterfeit electronics through the port.'),
(9, 'Fraud', '2020-10-04', 'Douala', 'Under investigation', NULL, NULL, 'unverified', 'Allegations of involvement in a small-scale investment scam.'),
(10, 'Burglary', '2020-01-20', 'Bonabéri, Douala', '12 months imprisonment', 'Douala Court of First Instance', '2020-06-05', 'verified', 'Broke into a commercial property at night. Served sentence.'),
(10, 'Receiving Stolen Goods', '2022-03-14', 'Douala', 'Under investigation', NULL, NULL, 'flagged', 'Found in possession of goods matching a separate theft report.'),
(12, 'Smuggling', '2018-09-09', 'Garoua', '6 months imprisonment (suspended)', 'Garoua Court of First Instance', '2018-12-01', 'verified', 'Minor smuggling offence across the regional border.'),
(13, 'Drug Possession', '2019-08-15', 'Garoua', '12 months imprisonment', 'Garoua Court of First Instance', '2019-12-01', 'verified', 'Found in possession of 5kg of cannabis. Served full sentence.'),
(15, 'Arms Possession', '2021-05-27', 'Garoua outskirts', 'Under investigation', NULL, NULL, 'unverified', 'Found with an unregistered firearm during a routine stop.'),
(17, 'Assault', '2019-03-11', 'Limbe', '18 months imprisonment', 'Buea High Court', '2019-09-18', 'verified', 'Convicted of assault causing bodily harm.'),
(17, 'Illegal Firearm Possession', '2021-11-02', 'Limbe', '24 months imprisonment', 'Buea High Court', '2022-04-14', 'verified', 'Second conviction; weapon linked to prior investigation.'),
(19, 'Petty Theft', '2020-07-06', 'Kumba', 'Fine', 'Kumba Court of First Instance', '2020-08-01', 'verified', 'Resolved with a fine.'),
(20, 'Timber Smuggling', '2020-12-13', 'Kumba, South-West', '9 months imprisonment', 'Buea High Court', '2021-04-02', 'verified', 'Part of an earlier illegal logging operation.'),
(22, 'Kidnapping', '2022-01-30', 'Bamenda outskirts', 'Under investigation', NULL, NULL, 'unverified', 'Suspected leader of a kidnapping ring targeting business owners.'),
(25, 'Extortion', '2021-06-19', 'Bamenda', 'Under investigation', NULL, NULL, 'unverified', 'Multiple witness reports link suspect to a protection racket.'),
(27, 'Fraud', '2021-09-25', 'Bafoussam', 'Under investigation', NULL, NULL, 'flagged', 'Complaint filed by a cooperative regarding missing funds.'),
(28, 'Armed Robbery', '2020-08-08', 'Dschang, West', '30 months imprisonment', 'Bafoussam High Court', '2021-02-19', 'verified', 'Convicted for a fuel station robbery.'),
(30, 'Counterfeiting', '2019-10-17', 'Bafoussam', '18 months imprisonment', 'Bafoussam High Court', '2020-03-05', 'verified', 'Involved in producing counterfeit banknotes.'),
(33, 'Poaching', '2021-04-08', 'Boumba-Ngoko', '12 months imprisonment', 'Bertoua Court of First Instance', '2021-09-11', 'verified', 'Convicted for poaching protected wildlife species.'),
(34, 'Poaching', '2020-02-26', 'Boumba-Ngoko', 'Fine', 'Bertoua Court of First Instance', '2020-04-10', 'verified', 'Minor poaching offence resolved with a fine.'),
(35, 'Gold Smuggling', '2022-05-15', 'Bertoua', 'Under investigation', NULL, NULL, 'unverified', 'Believed to be part of an illegal gold supply chain.'),
(38, 'Highway Robbery', '2020-03-21', 'Adamawa Highway Corridor', '36 months imprisonment', 'Ngaoundéré High Court', '2020-10-08', 'verified', 'Convicted for a series of highway robberies.'),
(40, 'Fuel Smuggling', '2021-07-04', 'Ngaoundéré', '12 months imprisonment', 'Ngaoundéré High Court', '2021-12-20', 'verified', 'Involved in diverting subsidized fuel for resale.'),
(41, 'Drug Possession', '2019-08-15', 'Maroua', '12 months imprisonment', 'Maroua Court', '2019-12-01', 'verified', 'Found in possession of 5kg of cannabis. Served full sentence.'),
(44, 'Extortion', '2022-02-17', 'Kousseri', 'Under investigation', NULL, NULL, 'unverified', 'Reports of extortion linked to cross-border armed groups.'),
(46, 'Illegal Mining', '2020-11-23', 'Ebolowa', 'Fine', 'Ebolowa Court of First Instance', '2021-01-15', 'verified', 'Minor unlicensed mining offence resolved with a fine.'),
(48, 'Illegal Mining', '2021-03-30', 'Ebolowa', '15 months imprisonment', 'Ebolowa High Court', '2021-09-02', 'verified', 'Operated an unlicensed mining site causing environmental damage.'),
(49, 'Fraud', '2022-08-12', 'Ebolowa', 'Under investigation', NULL, NULL, 'unverified', 'Allegations of diverting cooperative funds.'),
(50, 'Wildlife Trafficking', '2020-06-19', 'Ebolowa outskirts', '20 months imprisonment', 'Ebolowa High Court', '2021-01-08', 'verified', 'Convicted for trafficking protected species parts.'),
(50, 'Poaching', '2022-09-27', 'Ebolowa outskirts', 'Under investigation', NULL, NULL, 'flagged', 'Second suspected offence; investigation ongoing.');

-- ============================================================
-- WANTED ALERTS (20 — spanning all lifecycle states)
-- ============================================================

INSERT INTO wanted_alerts (person_id, case_id, alert_ref, reason, priority, status, description, last_known_loc, issued_by, authorized_by, authorized_at, rejected_reason, resolved_at, cancelled_at) VALUES
(1, 1, 'WA-2025-001', 'Wanted for armed robbery at Mokolo Market. Armed and dangerous.', 'high', 'issued', 'Suspect is the primary suspect in an armed robbery case. Has prior convictions including assault with a weapon. Believed to be in hiding within the Centre region.', 'Mokolo Quarter, Yaoundé', 2, 3, '2025-07-22 14:30:00', NULL, NULL, NULL),
(3, 2, 'WA-2025-002', 'Wanted for large-scale cybercrime fraud involving mobile money.', 'medium', 'authorized', 'Suspect has prior conviction for online fraud. Believed to be operating under multiple aliases. Known to frequently change location and appearance.', 'Unknown - Last seen in Yaoundé', 2, 3, '2025-08-03 09:15:00', NULL, NULL, NULL),
(7, NULL, 'WA-2025-003', 'Wanted in connection with a smuggling and receiving stolen goods operation.', 'critical', 'pending', 'Suspect believed to be coordinating a smuggling network out of Douala port. Considered a flight risk.', 'Bonabéri, Douala', 5, NULL, NULL, NULL, NULL, NULL),
(10, 8, 'WA-2025-004', 'Wanted for burglary and suspected involvement in fuel smuggling.', 'high', 'issued', 'Suspect has prior conviction for burglary and is a person of interest in an ongoing maritime smuggling case.', 'Douala Port area', 5, 14, '2025-08-30 10:00:00', NULL, NULL, NULL),
(13, 9, 'WA-2025-005', 'Wanted for drug trafficking at the Garoua checkpoint.', 'high', 'pending', 'Suspect is a primary suspect in an ongoing drug trafficking case. Believed to be hiding in the Benoué area.', 'Benoué area, Garoua', 6, NULL, NULL, NULL, NULL, NULL),
(15, 11, 'WA-2025-006', 'Wanted in connection with an arms trafficking ring.', 'critical', 'issued', 'Suspect is suspected of supplying illegal firearms across the North region. Considered armed and dangerous.', 'Garoua outskirts', 6, 3, '2025-08-24 11:20:00', NULL, NULL, NULL),
(17, 14, 'WA-2025-007', 'Wanted for kidnapping for ransom in Limbe.', 'critical', 'issued', 'Suspect believed to be part of the kidnapping gang. Last seen in the Limbe area. Approach with caution.', 'Limbe, South-West Region', 7, 3, '2025-08-22 16:45:00', NULL, NULL, NULL),
(20, NULL, 'WA-2025-008', 'Wanted for questioning in connection with timber smuggling.', 'medium', 'rejected', 'Alert request was rejected due to insufficient evidence directly linking the suspect to the smuggling operation.', 'Limbe', 7, 3, '2025-08-09 11:00:00', 'Insufficient evidence. The eyewitness statements are contradictory. Please gather additional evidence and resubmit.', NULL, NULL),
(22, 17, 'WA-2025-009', 'Wanted for organizing a kidnapping ring in Bamenda.', 'high', 'authorized', 'Suspect believed to be the organizer of a kidnapping ring targeting local business owners.', 'Bamenda outskirts', 8, 3, '2025-08-16 13:10:00', NULL, NULL, NULL),
(25, 18, 'WA-2025-010', 'Wanted for extortion linked to a protection racket in Bamenda.', 'critical', 'issued', 'Multiple witness reports link the suspect to an ongoing extortion operation targeting local shop owners.', 'Bamenda', 8, 14, '2025-08-20 09:30:00', NULL, NULL, NULL),
(28, 21, 'WA-2025-011', 'Wanted for armed robbery of a fuel station in Dschang.', 'high', 'resolved', 'Suspect was previously convicted of armed robbery and is the primary suspect in a new case.', 'Dschang, West', 9, 3, '2025-08-19 15:00:00', NULL, '2025-09-05 10:00:00', NULL),
(30, 22, 'WA-2025-012', 'Wanted for counterfeiting and suspected involvement in a land fraud scheme.', 'medium', 'pending', 'Suspect has a prior counterfeiting conviction and is now linked to a separate land fraud investigation.', 'Bafoussam outskirts', 9, NULL, NULL, NULL, NULL, NULL),
(33, 25, 'WA-2025-013', 'Wanted for poaching protected wildlife species near Boumba-Ngoko.', 'high', 'issued', 'Suspect has a prior poaching conviction and is believed to be leading a new organized poaching operation.', 'Boumba-Ngoko', 10, 3, '2025-08-12 08:45:00', NULL, NULL, NULL),
(35, 26, 'WA-2025-014', 'Wanted for questioning regarding gold smuggling.', 'medium', 'cancelled', 'Alert cancelled after the suspect voluntarily reported to the Bertoua police station for questioning.', 'Bertoua', 10, 14, '2025-08-31 09:00:00', NULL, NULL, '2025-09-06 14:20:00'),
(38, 29, 'WA-2025-015', 'Wanted for a series of highway robberies on the Adamawa corridor.', 'high', 'authorized', 'Suspect has a prior conviction for highway robbery and is the primary suspect in a new string of incidents.', 'Adamawa Highway Corridor', 11, 3, '2025-08-21 12:00:00', NULL, NULL, NULL),
(40, 30, 'WA-2025-016', 'Wanted for fuel smuggling and suspected involvement in highway robbery.', 'critical', 'issued', 'Suspect has a prior fuel smuggling conviction and travels frequently, making apprehension difficult.', 'Ngaoundéré region', 11, 14, '2025-08-23 10:30:00', NULL, NULL, NULL),
(41, 33, 'WA-2025-017', 'Wanted for drug trafficking. Suspect fled Maroua checkpoint.', 'high', 'resolved', 'Suspect is accomplice in a drug trafficking case. Has prior drug-related convictions.', 'Maroua, Far North Region', 12, 3, '2025-08-14 11:00:00', NULL, '2025-08-29 16:00:00', NULL),
(44, 34, 'WA-2025-018', 'Wanted for extortion linked to armed groups near Kousseri.', 'medium', 'pending', 'Suspect is under investigation for extortion activity believed linked to cross-border armed groups.', 'Kousseri', 12, NULL, NULL, NULL, NULL, NULL),
(48, 37, 'WA-2025-019', 'Wanted for operating an unlicensed and environmentally damaging mining site.', 'high', 'issued', 'Suspect has a prior conviction for illegal mining and is the primary suspect in a new, larger operation.', 'Ebolowa', 13, 3, '2025-08-16 14:15:00', NULL, NULL, NULL),
(50, 38, 'WA-2025-020', 'Wanted for wildlife trafficking and a related armed robbery investigation.', 'critical', 'authorized', 'Suspect has a prior wildlife trafficking conviction and is a person of interest in an armed robbery case.', 'Sangmelima, South', 13, 14, '2025-08-29 09:45:00', NULL, NULL, NULL);

-- ============================================================
-- AUDIT LOGS (Sample)
-- ============================================================

INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address, created_at) VALUES
(1, 'USER_CREATE', 'users', 2, 'Created police officer account for Roger Libog', '192.168.1.10', '2025-07-01 08:30:00'),
(1, 'USER_CREATE', 'users', 3, 'Created judicial authority account for Marie Elong', '192.168.1.10', '2025-07-01 08:35:00'),
(1, 'USER_CREATE', 'users', 5, 'Created police officer account for Paul Mbarga (Littoral)', '192.168.1.10', '2025-07-01 09:00:00'),
(1, 'USER_CREATE', 'users', 6, 'Created police officer account for Amina Bello (North)', '192.168.1.10', '2025-07-01 09:05:00'),
(1, 'LOGIN', 'users', 1, 'Successful login', '192.168.1.10', '2025-07-20 06:45:00'),
(2, 'LOGIN', 'users', 2, 'Successful login', '192.168.1.25', '2025-07-20 07:00:00'),
(2, 'CASE_CREATE', 'criminal_cases', 1, 'Registered new case: Armed Robbery at Mokolo Market', '192.168.1.25', '2025-07-20 07:15:00'),
(2, 'PERSON_CREATE', 'persons_of_interest', 1, 'Registered person of interest: Emmanuel Njoya', '192.168.1.25', '2025-07-20 07:30:00'),
(2, 'ALERT_CREATE', 'wanted_alerts', 1, 'Created wanted alert WA-2025-001 for Emmanuel Njoya', '192.168.1.25', '2025-07-20 08:00:00'),
(3, 'LOGIN', 'users', 3, 'Successful login', '192.168.1.30', '2025-07-22 14:00:00'),
(3, 'ALERT_AUTHORIZE', 'wanted_alerts', 1, 'Authorized wanted alert WA-2025-001', '192.168.1.30', '2025-07-22 14:30:00'),
(5, 'LOGIN', 'users', 5, 'Successful login', '192.168.2.10', '2025-07-25 09:00:00'),
(5, 'CASE_CREATE', 'criminal_cases', 5, 'Registered new case: Vehicle Theft Ring at Douala Port', '192.168.2.10', '2025-07-25 09:20:00'),
(6, 'LOGIN', 'users', 6, 'Successful login', '192.168.3.10', '2025-08-10 07:30:00'),
(6, 'CASE_CREATE', 'criminal_cases', 9, 'Registered new case: Drug Trafficking — Garoua Checkpoint', '192.168.3.10', '2025-08-10 08:00:00'),
(6, 'ALERT_CREATE', 'wanted_alerts', 5, 'Created wanted alert WA-2025-005 for Aboubakar Sali', '192.168.3.10', '2025-08-10 08:20:00'),
(7, 'LOGIN', 'users', 7, 'Successful login', '192.168.4.10', '2025-08-05 08:00:00'),
(7, 'CASE_CREATE', 'criminal_cases', 13, 'Registered new case: Assault at Buea Commercial Avenue', '192.168.4.10', '2025-08-05 08:20:00'),
(7, 'ALERT_CREATE', 'wanted_alerts', 7, 'Created wanted alert WA-2025-007 for Samuel Ekane', '192.168.4.10', '2025-08-20 10:00:00'),
(3, 'ALERT_AUTHORIZE', 'wanted_alerts', 7, 'Authorized wanted alert WA-2025-007', '192.168.1.30', '2025-08-22 16:45:00'),
(8, 'LOGIN', 'users', 8, 'Successful login', '192.168.5.10', '2025-08-05 08:10:00'),
(8, 'CASE_CREATE', 'criminal_cases', 17, 'Registered new case: Assault at Bamenda Commercial Avenue', '192.168.5.10', '2025-08-05 08:30:00'),
(8, 'ALERT_CREATE', 'wanted_alerts', 9, 'Created wanted alert WA-2025-009 for Fon Nkwenti', '192.168.5.10', '2025-08-14 09:00:00'),
(3, 'ALERT_AUTHORIZE', 'wanted_alerts', 9, 'Authorized wanted alert WA-2025-009', '192.168.1.30', '2025-08-16 13:10:00'),
(14, 'LOGIN', 'users', 14, 'Successful login', '192.168.2.20', '2025-08-20 09:00:00'),
(14, 'ALERT_AUTHORIZE', 'wanted_alerts', 10, 'Authorized wanted alert WA-2025-010', '192.168.2.20', '2025-08-20 09:30:00'),
(14, 'ALERT_ISSUE', 'wanted_alerts', 10, 'Issued wanted alert WA-2025-010', '192.168.2.20', '2025-08-20 09:45:00'),
(9, 'LOGIN', 'users', 9, 'Successful login', '192.168.6.10', '2025-08-01 08:00:00'),
(9, 'CASE_CREATE', 'criminal_cases', 21, 'Registered new case: Land Fraud in Bafoussam', '192.168.6.10', '2025-08-01 08:20:00'),
(3, 'ALERT_REJECT', 'wanted_alerts', 8, 'Rejected wanted alert WA-2025-008: insufficient evidence', '192.168.1.30', '2025-08-09 11:00:00'),
(9, 'ALERT_CREATE', 'wanted_alerts', 11, 'Created wanted alert WA-2025-011 for Landry Fotso', '192.168.6.10', '2025-08-17 12:00:00'),
(2, 'ALERT_RESOLVE', 'wanted_alerts', 11, 'Resolved wanted alert WA-2025-011 following apprehension', '192.168.1.25', '2025-09-05 10:00:00'),
(10, 'LOGIN', 'users', 10, 'Successful login', '192.168.7.10', '2025-08-09 08:00:00'),
(10, 'CASE_CREATE', 'criminal_cases', 25, 'Registered new case: Illegal Logging near Bertoua', '192.168.7.10', '2025-08-09 08:20:00'),
(10, 'ALERT_CREATE', 'wanted_alerts', 14, 'Created wanted alert WA-2025-014 for Solange Bakoa', '192.168.7.10', '2025-07-30 11:00:00'),
(14, 'ALERT_AUTHORIZE', 'wanted_alerts', 14, 'Authorized wanted alert WA-2025-014', '192.168.2.20', '2025-08-31 09:00:00'),
(10, 'ALERT_CANCEL', 'wanted_alerts', 14, 'Cancelled wanted alert WA-2025-014: suspect self-reported', '192.168.7.10', '2025-09-06 14:20:00'),
(11, 'LOGIN', 'users', 11, 'Successful login', '192.168.8.10', '2025-08-06 08:00:00'),
(11, 'CASE_CREATE', 'criminal_cases', 29, 'Registered new case: Cattle Rustling near Ngaoundéré', '192.168.8.10', '2025-08-06 08:20:00'),
(11, 'ALERT_CREATE', 'wanted_alerts', 15, 'Created wanted alert WA-2025-015 for Ibrahim Djoda', '192.168.8.10', '2025-08-19 09:00:00'),
(3, 'ALERT_AUTHORIZE', 'wanted_alerts', 15, 'Authorized wanted alert WA-2025-015', '192.168.1.30', '2025-08-21 12:00:00'),
(12, 'LOGIN', 'users', 12, 'Successful login', '192.168.9.10', '2025-08-11 08:00:00'),
(12, 'CASE_CREATE', 'criminal_cases', 33, 'Registered new case: Drug Trafficking in Maroua', '192.168.9.10', '2025-08-11 08:20:00'),
(12, 'ALERT_CREATE', 'wanted_alerts', 17, 'Created wanted alert WA-2025-017 for Ibrahim Tanko', '192.168.9.10', '2025-08-14 11:00:00'),
(2, 'ALERT_RESOLVE', 'wanted_alerts', 17, 'Resolved wanted alert WA-2025-017 following apprehension', '192.168.1.25', '2025-08-29 16:00:00'),
(13, 'LOGIN', 'users', 13, 'Successful login', '192.168.10.10', '2025-08-13 08:00:00'),
(13, 'CASE_CREATE', 'criminal_cases', 37, 'Registered new case: Illegal Mining near Ebolowa', '192.168.10.10', '2025-08-13 08:20:00'),
(13, 'ALERT_CREATE', 'wanted_alerts', 19, 'Created wanted alert WA-2025-019 for Rodrigue Ondoa', '192.168.10.10', '2025-08-16 14:15:00'),
(3, 'ALERT_AUTHORIZE', 'wanted_alerts', 19, 'Authorized wanted alert WA-2025-019', '192.168.1.30', '2025-08-16 14:15:00'),
(2, 'RECORD_VERIFY', 'criminal_records', 1, 'Verified criminal record against external database', '192.168.1.25', '2025-08-01 10:00:00'),
(7, 'RECORD_VERIFY', 'criminal_records', 16, 'Verified criminal record against external database', '192.168.4.10', '2025-08-06 10:00:00'),
(13, 'RECORD_VERIFY', 'criminal_records', 32, 'Verified criminal record against external database', '192.168.10.10', '2025-08-18 10:00:00'),
(4, 'LOGIN', 'users', 4, 'Successful login', '192.168.1.50', '2025-08-15 08:00:00'),
(4, 'REPORT_GENERATE', NULL, NULL, 'Generated monthly crime statistics report for July 2025', '192.168.1.50', '2025-08-15 08:30:00'),
(4, 'REPORT_GENERATE', NULL, NULL, 'Generated national alert lifecycle report for August 2025', '192.168.1.50', '2025-09-10 09:00:00');

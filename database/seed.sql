-- ============================================================
-- Police Criminal Record System — Seed Data
-- Demo data for presentation purposes
-- ============================================================

-- Password hash for demo accounts (bcrypt hash of the respective passwords)
-- These will be replaced by the server setup script with proper bcrypt hashes

-- ============================================================
-- USERS (Demo Accounts)
-- ============================================================

INSERT INTO users (email, password_hash, first_name, last_name, role, badge_number, station, region, phone) VALUES
('admin', '$2b$10$placeholder', 'Claude', 'Abanda', 'admin', 'ADM-001', 'DITT Headquarters', 'Centre', '+237 670 000 001'),
('policeofficer', '$2b$10$placeholder', 'Roger', 'Libog', 'police_officer', 'POL-042', 'Yaoundé Central Station', 'Centre', '+237 670 000 002'),
('judicialauthority', '$2b$10$placeholder', 'Marie', 'Elong', 'judicial_authority', 'JUD-015', 'Yaoundé High Court', 'Centre', '+237 670 000 003'),
('inspectorate', '$2b$10$placeholder', 'Jean', 'Tchinda', 'general_inspectorate', 'INS-008', 'General Inspectorate HQ', 'Centre', '+237 670 000 004'),
('policeofficer2', '$2b$10$placeholder', 'Paul', 'Mbarga', 'police_officer', 'POL-078', 'Douala Port Station', 'Littoral', '+237 670 000 005'),
('policeofficer3', '$2b$10$placeholder', 'Amina', 'Bello', 'police_officer', 'POL-103', 'Garoua Central Station', 'North', '+237 670 000 006');

-- ============================================================
-- CRIMINAL CASES (Sample)
-- ============================================================

INSERT INTO criminal_cases (reference_no, title, nature, description, location, region, incident_date, status, registered_by) VALUES
('CR-2025-0001', 'Armed Robbery at Mokolo Market', 'Armed Robbery', 'Two armed suspects robbed a jewelry shop at Mokolo Market, fleeing with approximately 5 million FCFA worth of merchandise. Witnesses reported the suspects used a motorcycle to escape.', 'Mokolo Market, Yaoundé', 'Centre', '2025-07-20', 'under_investigation', 2),
('CR-2025-0002', 'Vehicle Theft Ring at Douala Port', 'Vehicle Theft', 'A network of vehicle theft has been identified operating around the Douala autonomous port. Three vehicles reported stolen within the past month have been traced to suspects operating in the Bonabéri area.', 'Douala Autonomous Port', 'Littoral', '2025-07-25', 'under_investigation', 5),
('CR-2025-0003', 'Cybercrime Fraud Case', 'Cybercrime', 'Multiple victims reported losing funds through fraudulent mobile money transfers. The suspect used cloned SIM cards to intercept OTP codes and drain mobile money accounts. Total estimated loss: 12 million FCFA.', 'Online / Yaoundé', 'Centre', '2025-08-01', 'open', 2),
('CR-2025-0004', 'Assault at Bamenda Commercial Avenue', 'Assault', 'A physical altercation between two individuals resulted in severe injuries to the victim. The suspect fled the scene and remains at large. Several eyewitnesses have provided statements.', 'Commercial Avenue, Bamenda', 'North-West', '2025-08-05', 'open', 6),
('CR-2025-0005', 'Drug Trafficking — Garoua Checkpoint', 'Drug Trafficking', 'Border police intercepted a vehicle carrying 50kg of cannabis at the Garoua northern checkpoint. The driver was arrested and two additional suspects are being sought.', 'Garoua Northern Checkpoint', 'North', '2025-08-10', 'under_investigation', 6),
('CR-2025-0006', 'Identity Document Forgery Ring', 'Forgery', 'An organized ring producing counterfeit national identity cards and passports was discovered operating in the Biyem-Assi neighborhood. Printing equipment and 200+ blank cards were seized.', 'Biyem-Assi, Yaoundé', 'Centre', '2025-08-15', 'closed', 2),
('CR-2025-0007', 'Kidnapping for Ransom', 'Kidnapping', 'A prominent business owner was kidnapped from his residence in Limbe. The kidnappers demanded a ransom of 50 million FCFA. Investigation is ongoing with coordination between regional units.', 'Limbe, South-West', 'South-West', '2025-08-20', 'under_investigation', 5),
('CR-2025-0008', 'Corruption in Public Works Ministry', 'Corruption', 'An investigation into alleged embezzlement of public funds earmarked for road construction in the East region. Multiple officials are under investigation.', 'Ministry of Public Works, Yaoundé', 'Centre', '2025-09-01', 'open', 2);

-- ============================================================
-- PERSONS OF INTEREST (Sample)
-- ============================================================

INSERT INTO persons_of_interest (first_name, last_name, alias, date_of_birth, gender, nationality, id_number, phone, address, physical_desc, is_wanted, registered_by) VALUES
('Emmanuel', 'Njoya', 'Le Rapide', '1990-03-15', 'male', 'Cameroonian', 'CM-1990-03150-C', '+237 691 234 567', 'Mokolo Quarter, Yaoundé', 'Height: 180cm, Athletic build, Scar on left cheek, Dark complexion', TRUE, 2),
('Hervé', 'Fotso', NULL, '1985-11-22', 'male', 'Cameroonian', 'CM-1985-11220-L', '+237 677 345 678', 'Bonabéri, Douala', 'Height: 175cm, Medium build, Bald head, Light skin', FALSE, 5),
('Aissatou', 'Djamal', 'La Hackeuse', '1995-06-10', 'female', 'Cameroonian', 'CM-1995-06100-C', NULL, 'Unknown', 'Height: 165cm, Slim build, Wears glasses, Often changes appearance', TRUE, 2),
('Moussa', 'Ousmanou', NULL, '1988-01-28', 'male', 'Nigerian', 'NG-PAS-A12345', '+237 650 987 654', 'Garoua, North Region', 'Height: 185cm, Heavy build, Tribal marks on face', FALSE, 6),
('Pierre', 'Kamga', 'Le Faussaire', '1982-09-05', 'male', 'Cameroonian', 'CM-1982-09050-C', '+237 699 111 222', 'Biyem-Assi, Yaoundé', 'Height: 170cm, Slim build, Grey hair, Wears thick-framed glasses', FALSE, 2),
('Samuel', 'Ekane', NULL, '1992-12-18', 'male', 'Cameroonian', 'CM-1992-12180-SW', '+237 674 555 666', 'Limbe, South-West', 'Height: 178cm, Medium build, Tattooed left arm', TRUE, 5),
('Fatima', 'Biya', NULL, '1998-04-22', 'female', 'Cameroonian', 'CM-1998-04220-C', '+237 680 777 888', 'Bastos, Yaoundé', 'Height: 160cm, Slim build, Long braids', FALSE, 2),
('Ibrahim', 'Tanko', 'The Bull', '1980-07-14', 'male', 'Cameroonian', 'CM-1980-07140-N', '+237 655 444 333', 'Maroua, Far North', 'Height: 190cm, Heavy muscular build, Missing right ear lobe', TRUE, 6);

-- ============================================================
-- CASE-PERSONS LINKAGE
-- ============================================================

INSERT INTO case_persons (case_id, person_id, role_in_case) VALUES
(1, 1, 'primary_suspect'),
(2, 2, 'suspect'),
(3, 3, 'primary_suspect'),
(3, 7, 'accomplice'),
(4, 4, 'suspect'),
(5, 4, 'primary_suspect'),
(5, 8, 'accomplice'),
(6, 5, 'primary_suspect'),
(7, 6, 'suspect'),
(8, 7, 'witness');

-- ============================================================
-- CRIMINAL RECORDS
-- ============================================================

INSERT INTO criminal_records (person_id, offence, offence_date, offence_location, sentence, court, verdict_date, verification_status, notes) VALUES
(1, 'Petty Theft', '2018-05-12', 'Yaoundé Central Market', '6 months imprisonment (suspended)', 'Yaoundé Court of First Instance', '2018-08-20', 'verified', 'First offence. Sentenced to suspended imprisonment with probation.'),
(1, 'Assault with a Weapon', '2020-02-15', 'Obili Quarter, Yaoundé', '18 months imprisonment', 'Yaoundé High Court', '2020-06-10', 'verified', 'Second offence. Served full sentence at Kondengui Central Prison.'),
(3, 'Online Fraud', '2022-09-01', 'Online / Douala', '12 months imprisonment + 2M FCFA fine', 'Douala Court of First Instance', '2023-01-15', 'verified', 'Convicted for phishing attacks targeting bank customers.'),
(4, 'Illegal Border Crossing', '2021-03-20', 'Garoua Border Checkpoint', 'Deportation + 5-year entry ban', 'Immigration Tribunal', '2021-04-01', 'verified', 'Attempted to enter Cameroon with forged travel documents.'),
(5, 'Document Forgery', '2019-11-10', 'Yaoundé', '24 months imprisonment', 'Yaoundé High Court', '2020-03-15', 'verified', 'Produced and distributed counterfeit driver licenses. Served sentence.'),
(5, 'Identity Fraud', '2023-06-01', 'Yaoundé', 'Under investigation', NULL, NULL, 'unverified', 'Suspected involvement in new identity card forgery ring. Case ongoing.'),
(8, 'Drug Possession', '2019-08-15', 'Maroua', '12 months imprisonment', 'Maroua Court', '2019-12-01', 'verified', 'Found in possession of 5kg of cannabis. Served full sentence.');

-- ============================================================
-- WANTED ALERTS
-- ============================================================

INSERT INTO wanted_alerts (person_id, case_id, alert_ref, reason, priority, status, description, last_known_loc, issued_by, authorized_by, authorized_at) VALUES
(1, 1, 'WA-2025-001', 'Wanted for armed robbery at Mokolo Market. Armed and dangerous.', 'high', 'issued', 'Suspect is the primary suspect in an armed robbery case. Has prior convictions including assault with a weapon. Believed to be in hiding within the Centre region.', 'Mokolo Quarter, Yaoundé', 2, 3, '2025-07-22 14:30:00'),
(3, 3, 'WA-2025-002', 'Wanted for large-scale cybercrime fraud involving mobile money.', 'medium', 'authorized', 'Suspect has prior conviction for online fraud. Believed to be operating under multiple aliases. Known to frequently change location and appearance.', 'Unknown - Last seen in Yaoundé', 2, 3, '2025-08-03 09:15:00'),
(6, 7, 'WA-2025-003', 'Wanted in connection with kidnapping for ransom case in Limbe.', 'critical', 'issued', 'Suspect believed to be part of the kidnapping gang. Last seen in the Limbe area. Approach with caution.', 'Limbe, South-West Region', 5, 3, '2025-08-22 16:45:00'),
(8, 5, 'WA-2025-004', 'Wanted for drug trafficking. Suspect fled Garoua checkpoint.', 'high', 'pending', 'Suspect is accomplice in a drug trafficking case. Has prior drug-related convictions. Believed to have crossed into the Far North region.', 'Maroua, Far North Region', 6, NULL, NULL),
(4, 4, 'WA-2025-005', 'Wanted for assault in Bamenda. Foreign national — flight risk.', 'medium', 'rejected', 'Alert request was rejected due to insufficient evidence linking the suspect to the assault. Further investigation required before resubmission.', 'Garoua, North Region', 6, 3, '2025-08-08 11:00:00');

-- Update rejected alert
UPDATE wanted_alerts SET rejected_reason = 'Insufficient evidence. The eyewitness statements are contradictory. Please gather additional evidence and resubmit.' WHERE alert_ref = 'WA-2025-005';

-- ============================================================
-- AUDIT LOGS (Sample)
-- ============================================================

INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address, created_at) VALUES
(1, 'USER_CREATE', 'users', 2, 'Created police officer account for Roger Libog', '192.168.1.10', '2025-07-15 08:30:00'),
(1, 'USER_CREATE', 'users', 3, 'Created judicial authority account for Marie Elong', '192.168.1.10', '2025-07-15 08:35:00'),
(2, 'LOGIN', 'users', 2, 'Successful login', '192.168.1.25', '2025-07-20 07:00:00'),
(2, 'CASE_CREATE', 'criminal_cases', 1, 'Registered new case: Armed Robbery at Mokolo Market', '192.168.1.25', '2025-07-20 07:15:00'),
(2, 'PERSON_CREATE', 'persons_of_interest', 1, 'Registered person of interest: Emmanuel Njoya', '192.168.1.25', '2025-07-20 07:30:00'),
(2, 'ALERT_CREATE', 'wanted_alerts', 1, 'Created wanted alert WA-2025-001 for Emmanuel Njoya', '192.168.1.25', '2025-07-20 08:00:00'),
(3, 'LOGIN', 'users', 3, 'Successful login', '192.168.1.30', '2025-07-22 14:00:00'),
(3, 'ALERT_AUTHORIZE', 'wanted_alerts', 1, 'Authorized wanted alert WA-2025-001', '192.168.1.30', '2025-07-22 14:30:00'),
(5, 'LOGIN', 'users', 5, 'Successful login', '192.168.2.10', '2025-07-25 09:00:00'),
(5, 'CASE_CREATE', 'criminal_cases', 2, 'Registered new case: Vehicle Theft Ring at Douala Port', '192.168.2.10', '2025-07-25 09:20:00'),
(2, 'RECORD_VERIFY', 'criminal_records', 1, 'Verified criminal record against external database', '192.168.1.25', '2025-08-01 10:00:00'),
(4, 'LOGIN', 'users', 4, 'Successful login', '192.168.1.50', '2025-08-15 08:00:00'),
(4, 'REPORT_GENERATE', NULL, NULL, 'Generated monthly crime statistics report for July 2025', '192.168.1.50', '2025-08-15 08:30:00');

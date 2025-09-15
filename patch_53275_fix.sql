-- D1 patch (ancestors-only; Life stripped; no BEGIN/COMMIT)
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1, 'Animalia', 'kingdom', 'Animals', 48460, '{48460}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (47120, 'Arthropoda', 'phylum', 'Arthropods', 1, '{1}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (47158, 'Insecta', 'class', 'Insects', 372739, '{1,47120,372739}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (47822, 'Diptera', 'order', 'Flies', 184884, '{1,47120,372739,47158,184884}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (53275, 'Chironomidae', 'family', 'Non-biting Midges', 509764, '{1,47120,372739,47158,184884,47822,154259,153429,509764}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (120561, 'Cricotopus', 'genus', NULL, 1370499, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (126612, 'Glyptotendipes paripes', 'species', NULL, 1571501, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,126613,1571501}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (126613, 'Glyptotendipes', 'genus', NULL, 1559249, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (129408, 'Chironomini', 'tribe', NULL, 319399, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (129409, 'Chironomus', 'genus', NULL, 1559249, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (129410, 'Orthocladiinae', 'subfamily', 'Orthoclads', 53275, '{1,47120,372739,47158,184884,47822,154259,153429,53275}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (130030, 'Pentaneurini', 'tribe', NULL, 130031, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (130031, 'Tanypodinae', 'subfamily', 'Tanypods', 53275, '{1,47120,372739,47158,184884,47822,154259,153429,53275}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (130956, 'Psectrotanypus dyari', 'species', NULL, 130957, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345994,130957}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (130957, 'Psectrotanypus', 'genus', NULL, 345994, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345994}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (130958, 'Thienemannimyia', 'genus', NULL, 1568058, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,1568058}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (130966, 'Clinotanypus pinguis', 'species', NULL, 130980, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345993,130980}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (130980, 'Clinotanypus', 'genus', NULL, 345993, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345993}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (153429, 'Culicomorpha', 'infraorder', 'Mosquitoes and Midges', 154259, '{1,47120,372739,47158,184884,154259}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (154259, 'Nematocera', 'suborder', 'Nematoceran Flies', 47822, '{1,47120,372739,47158,184884,47822}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (173064, 'Apsectrotanypus', 'genus', NULL, 345994, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345994}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (174181, 'Corynoneura', 'genus', NULL, 1612973, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1612973}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (176185, 'Orthocladius', 'genus', NULL, 1370499, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (176380, 'Eukiefferiella', 'genus', NULL, 1571784, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1571784}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (177034, 'Metriocnemus', 'genus', NULL, 1572774, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1572774}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (177846, 'Heterotrissocladius', 'genus', NULL, 1572774, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1572774}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (178265, 'Paralauterborniella', 'genus', NULL, 1559248, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559248}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (178697, 'Tvetenia', 'genus', NULL, 1571784, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1571784}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (178766, 'Tribelos', 'genus', NULL, 1559206, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (184884, 'Pterygota', 'subclass', 'Winged and Once-winged Insects', 47158, '{1,47120,372739,47158}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (211762, 'Rheopelopia', 'genus', NULL, 1568058, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,1568058}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (212026, 'Potthastia', 'genus', NULL, 1370511, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,345991,1370511}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (214044, 'Apsectrotanypus johnsoni', 'species', NULL, 173064, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345994,173064}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (217625, 'Corynoneura scutellata', 'species', NULL, 174181, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1612973,174181}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (217759, 'Cricotopus bicinctus', 'species', NULL, 1557207, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,120561,567613,1557207}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (217760, 'Cricotopus nostocicola', 'species', NULL, 567616, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,120561,567616}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (217761, 'Cricotopus trifascia', 'species', NULL, 1557208, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,120561,567613,1557208}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (219725, 'Eukiefferiella claripennis', 'species', NULL, 176380, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1571784,176380}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (225007, 'Metriocnemus knabi', 'species', 'Pitcher Plant Midge', 177034, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1572774,177034}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (226633, 'Orthocladius lignicola', 'species', NULL, 176185, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,176185}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (226980, 'Paralauterborniella nigrohalteralis', 'species', NULL, 178265, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559248,178265}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247294, 'Dicrotendipes', 'genus', NULL, 1559249, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247587, 'Apedilum', 'genus', NULL, 1559248, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559248}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247591, 'Axarus', 'genus', NULL, 1559249, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247592, 'Beardius', 'genus', NULL, 129408, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247596, 'Cladopelma', 'genus', NULL, 1559243, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559243}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247597, 'Cladotanytarsus', 'genus', NULL, 1011300, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,345996,1011300}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247616, 'Endochironomus', 'genus', NULL, 1559206, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247618, 'Goeldichironomus', 'genus', NULL, 1559249, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247650, 'Parachironomus', 'genus', NULL, 1559243, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559243}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247658, 'Paratanytarsus', 'genus', NULL, 1011300, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,345996,1011300}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247660, 'Polypedilum', 'genus', NULL, 1559206, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247662, 'Stenochironomus', 'genus', NULL, 1559294, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559294}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247665, 'Tanytarsus', 'genus', NULL, 1011300, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,345996,1011300}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247666, 'Xestochironomus', 'genus', NULL, 1559294, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559294}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247668, 'Diamesa', 'genus', 'Winter Midges', 1370511, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,345991,1370511}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247694, 'Ablabesmyia', 'genus', 'Banded-leg Tanypods', 130030, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247696, 'Coelotanypus', 'genus', NULL, 345993, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345993}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247719, 'Djalmabatista', 'genus', NULL, 345995, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345995}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247733, 'Labrundinia', 'genus', NULL, 130030, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247737, 'Larsia', 'genus', NULL, 130030, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247740, 'Pentaneura', 'genus', NULL, 130030, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247741, 'Procladius', 'genus', NULL, 345995, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345995}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247742, 'Tanypus', 'genus', NULL, 1370486, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,1370486}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247743, 'Telmatogeton', 'genus', 'Seaweed Midges', 495788, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,495788}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (247744, 'Thalassomya', 'genus', NULL, 495788, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,495788}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (257276, 'Apedilum elachistus', 'species', NULL, 247587, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559248,247587}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (257289, 'Apedilum subcinctum', 'species', NULL, 247587, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559248,247587}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (257364, 'Cladotanytarsus viridiventris', 'species', NULL, 247597, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,345996,1011300,247597}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (257429, 'Dicrotendipes neomodestus', 'species', NULL, 247294, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,247294}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (257439, 'Endochironomus subtendens', 'species', NULL, 247616, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247616}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (257444, 'Goeldichironomus amazonicus', 'species', NULL, 247618, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,247618}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (257467, 'Goeldichironomus holoprasinus', 'species', NULL, 247618, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,247618}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (257567, 'Tanytarsus hastatus', 'species', NULL, 247665, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,345996,1011300,247665}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (257620, 'Cricotopus sylvestris', 'species', NULL, 1557209, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,120561,523878,1557209}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (257624, 'Cricotopus triannulatus', 'species', NULL, 1542219, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,120561,567613,1542219}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (257677, 'Ablabesmyia cinctipes', 'species', NULL, 549452, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,247694,549452}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (257680, 'Coelotanypus atus', 'species', NULL, 247696, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345993,247696}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (257685, 'Coelotanypus concinnus', 'species', NULL, 247696, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345993,247696}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (257776, 'Coelotanypus scapularis', 'species', NULL, 247696, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345993,247696}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (257825, 'Labrundinia pilosella', 'species', NULL, 247733, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,247733}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (257834, 'Tanypus neopunctipennis', 'species', NULL, 847609, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,1370486,247742,847609}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (257837, 'Thalassomya bureni', 'species', NULL, 247744, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,495788,247744}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (293909, 'Coelotanypus tricolor', 'species', NULL, 247696, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345993,247696}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (293923, 'Pentaneura inconspicua', 'species', NULL, 247740, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,247740}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (293925, 'Procladius bellus', 'species', NULL, 1542647, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345995,247741,1542647}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (319399, 'Chironominae', 'subfamily', NULL, 53275, '{1,47120,372739,47158,184884,47822,154259,153429,53275}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (319721, 'Stenochironomus hilaris', 'species', NULL, 1542379, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559294,247662,1542379}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (330037, 'Clunio', 'genus', NULL, 1572833, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1572833}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (338978, 'Telmatogeton alaskensis', 'species', 'Yakutat Seaweed Midge', 247743, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,495788,247743}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (342232, 'Psectrocladius', 'genus', NULL, 1370499, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (345116, 'Pseudosmittia', 'genus', NULL, 1572816, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1572816}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (345170, 'Parametriocnemus', 'genus', NULL, 1572774, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1572774}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (345325, 'Micropsectra', 'genus', NULL, 1011300, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,345996,1011300}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (345991, 'Diamesinae', 'subfamily', NULL, 53275, '{1,47120,372739,47158,184884,47822,154259,153429,53275}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (345993, 'Clinotanypodini', 'tribe', NULL, 130031, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (345994, 'Macropelopiini', 'tribe', NULL, 130031, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (345995, 'Procladiini', 'tribe', NULL, 130031, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (345996, 'Tanytarsini', 'tribe', NULL, 319399, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (357677, 'Axarus festivus', 'species', NULL, 1542167, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,247591,1542167}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (360067, 'Zavreliella', 'genus', NULL, 1559248, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559248}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (366243, 'Microtendipes', 'genus', NULL, 1559248, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559248}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (366244, 'Rheotanytarsus', 'genus', NULL, 1011300, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,345996,1011300}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (366245, 'Stempellinella', 'genus', NULL, 1370759, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,345996,1370759}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (366246, 'Brillia', 'genus', NULL, 1571771, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1571771}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (366248, 'Limnophyes', 'genus', NULL, 1571797, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1571797}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (366249, 'Nanocladius', 'genus', NULL, 1571784, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1571784}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (366252, 'Thienemanniella', 'genus', NULL, 1612973, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1612973}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (366253, 'Zavrelimyia', 'genus', NULL, 130030, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (366264, 'Phaenopsectra', 'genus', NULL, 1559206, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (366265, 'Parachaetocladius', 'genus', NULL, 1571797, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1571797}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (367225, 'Diplocladius', 'genus', NULL, 1571771, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1571771}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (372739, 'Hexapoda', 'subphylum', 'Hexapods', 47120, '{1,47120}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (374360, 'Camptocladius', 'genus', NULL, 1370498, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (376084, 'Cryptochironomus', 'genus', NULL, 1559243, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559243}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (376763, 'Kiefferulus', 'genus', NULL, 1559249, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (378158, 'Smittia', 'genus', NULL, 1572816, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1572816}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (450690, 'Zavreliella marmorata', 'species', NULL, 360067, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559248,360067}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (452658, 'Diplocladius cultriger', 'species', NULL, 367225, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1571771,367225}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (472251, 'Hydrobaenus', 'genus', NULL, 1571784, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1571784}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (472252, 'Paratendipes', 'genus', NULL, 1559248, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559248}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (475355, 'Stictochironomus', 'genus', NULL, 1559206, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (475361, 'Demeijerea', 'genus', NULL, 1559249, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (475362, 'Einfeldia', 'genus', NULL, 1559249, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (475363, 'Kribiodorum', 'genus', NULL, 1559248, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559248}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (475364, 'Omisus', 'genus', NULL, 1559248, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559248}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (475365, 'Hyporhygma', 'genus', NULL, 1559206, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (475366, 'Xylotopus', 'genus', NULL, 1571771, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1571771}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (475367, 'Chasmatonotus', 'genus', NULL, 1370499, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (475368, 'Symbiocladius', 'genus', NULL, 129410, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (475369, 'Cardiocladius', 'genus', NULL, 1571784, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1571784}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (475370, 'Prodiamesinae', 'subfamily', NULL, 53275, '{1,47120,372739,47158,184884,47822,154259,153429,53275}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (475371, 'Alotanypus', 'genus', NULL, 345994, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345994}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (475373, 'Guttipelopia', 'genus', NULL, 130030, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (478167, 'Chasmatonotus unimaculatus', 'species', NULL, 475367, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,475367}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (482072, 'Endochironomus albipennis', 'species', 'Blagdon Green Midge', 247616, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247616}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (482073, 'Microtendipes pedellus', 'species', NULL, 366243, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559248,366243}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (482818, 'Chironomus crassicaudatus', 'species', 'Thick-tailed Non-biting Midge', 1552140, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,129409,545869,1552140}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (485284, 'Monopelopia', 'genus', NULL, 130030, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (488649, 'Thalassosmittia', 'genus', NULL, 1572833, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1572833}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (490470, 'Alotanypus venustus', 'species', NULL, 475371, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345994,475371}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (491585, 'Telmatogeton trilobatus', 'species', NULL, 247743, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,495788,247743}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (492491, 'Micropsectra subletteorum', 'species', NULL, 345325, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,345996,1011300,345325}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (492985, 'Paraphaenocladius', 'genus', NULL, 1572774, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1572774}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (492986, 'Pseudochironomus', 'genus', NULL, 1051367, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,1051367}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (495788, 'Telmatogetoninae', 'subfamily', 'Intertidal Midges', 53275, '{1,47120,372739,47158,184884,47822,154259,153429,53275}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (505707, 'Goeldichironomus carus', 'species', NULL, 1578618, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,247618,1578618}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (509764, 'Chironomoidea', 'superfamily', NULL, 153429, '{1,47120,372739,47158,184884,47822,154259,153429}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (523878, 'Isocladius', 'subgenus', NULL, 120561, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,120561}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (525425, 'Djalmabatista pulcher', 'species', NULL, 247719, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345995,247719}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (537748, 'Tanypus nubifer', 'species', NULL, 847609, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,1370486,247742,847609}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (541520, 'Polypedilum braseniae', 'species', NULL, 1551380, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1551380}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (541868, 'Endochironomus nigricans', 'species', NULL, 247616, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247616}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (543068, 'Clunio californiensis', 'species', NULL, 330037, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1572833,330037}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (545867, 'Camptochironomus', 'subgenus', NULL, 129409, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,129409}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (545868, 'Chaetolabis', 'subgenus', NULL, 129409, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,129409}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (545869, 'Chironomus', 'subgenus', NULL, 129409, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,129409}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (545870, 'Lobochironomus', 'subgenus', NULL, 129409, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,129409}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (545871, 'Chironomus dilutus', 'species', NULL, 545867, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,129409,545867}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (546874, 'Holotanypus', 'subgenus', NULL, 247741, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345995,247741}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (548655, 'Chironomus atroviridis', 'species', NULL, 545868, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,129409,545868}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (548770, 'Paratendipes albimanus', 'species', NULL, 1571514, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559248,472252,1571514}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (549452, 'Karelia', 'subgenus', NULL, 247694, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,247694}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (549453, 'Ablabesmyia peleensis', 'species', NULL, 549452, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,247694,549452}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (549454, 'Ablabesmyia', 'subgenus', NULL, 247694, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,247694}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (552031, 'Ablabesmyia annulata', 'species', NULL, 1566705, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,247694,1566705}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (553145, 'Telmatogeton japonicus', 'species', NULL, 247743, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,495788,247743}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (553431, 'Polypedilum trigonus', 'species', NULL, 1551380, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1551380}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (557882, 'Chironomus ochreatus', 'species', NULL, 545868, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,129409,545868}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (567613, 'Cricotopus', 'subgenus', NULL, 120561, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,120561}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (567616, 'Nostococladius', 'subgenus', NULL, 120561, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,120561}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (568382, 'Micropsectra polita', 'species', NULL, 345325, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,345996,1011300,345325}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (568396, 'Bryophaenocladius', 'genus', NULL, 1571797, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1571797}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (627361, 'Dicrotendipes fumidus', 'species', NULL, 247294, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,247294}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (627379, 'Brillia parva', 'species', NULL, 366246, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1571771,366246}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (627380, 'Thienemanniella xena', 'species', NULL, 366252, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1612973,366252}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (627393, 'Polypedilum laetum', 'species', NULL, 1639496, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1551380,1639496}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (627399, 'Tanypus punctipennis', 'species', NULL, 847610, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,1370486,247742,847610}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (627412, 'Potthastia longimana', 'species', NULL, 212026, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,345991,1370511,212026}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (627421, 'Ablabesmyia mallochi', 'species', NULL, 549454, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,247694,549454}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (627444, 'Dicrotendipes modestus', 'species', NULL, 247294, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,247294}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (627451, 'Pseudochironomus richardsoni', 'species', NULL, 492986, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,1051367,492986}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (627461, 'Rheotanytarsus pellucidus', 'species', NULL, 366244, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,345996,1011300,366244}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (627476, 'Ablabesmyia illinoensis', 'species', NULL, 549452, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,247694,549452}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (627477, 'Guttipelopia guttipennis', 'species', NULL, 475373, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,475373}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (627481, 'Phaenopsectra flavipes', 'species', NULL, 366264, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,366264}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (627484, 'Xylotopus par', 'species', NULL, 475366, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1571771,475366}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (627584, 'Glyptotendipes meridionalis', 'species', NULL, 1571501, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,126613,1571501}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (627599, 'Orthocladius robacki', 'species', NULL, 176185, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,176185}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (627871, 'Polypedilum convictum', 'species', NULL, 1566679, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1566679}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (627878, 'Dicrotendipes lucifer', 'species', NULL, 247294, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,247294}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (627879, 'Procladius denticulatus', 'species', NULL, 546874, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345995,247741,546874}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (627880, 'Cryptochironomus fulvus', 'species', NULL, 376084, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559243,376084}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (627886, 'Chironomus entis', 'species', NULL, 1542790, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,129409,545869,1542790}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (630865, 'Podonominae', 'subfamily', NULL, 53275, '{1,47120,372739,47158,184884,47822,154259,153429,53275}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (631708, 'Cricotopus trifasciatus', 'species', NULL, 1557209, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,120561,523878,1557209}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (644416, 'Conchapelopia', 'genus', NULL, 1568058, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,1568058}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (713305, 'Chasmatonotus atripes', 'species', NULL, 475367, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,475367}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (715786, 'Polypedilum scalaenum', 'species', NULL, 1560542, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1551381,1560542}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (717262, 'Chasmatonotus maculipennis', 'species', NULL, 475367, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,475367}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (789485, 'Rheotanytarsus exiguus', 'species', NULL, 366244, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,345996,1011300,366244}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (826343, 'Thalassosmittia marina', 'species', NULL, 488649, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1572833,488649}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (847609, 'Apelopia', 'subgenus', NULL, 247742, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,1370486,247742}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (847610, 'Tanypus', 'subgenus', NULL, 247742, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,1370486,247742}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (853142, 'Diamesa nivoriunda', 'species', NULL, 247668, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,345991,1370511,247668}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (864937, 'Chironomus riparius', 'species', NULL, 1590867, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,129409,545869,1590867}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (890952, 'Stenochironomus poecilopterus', 'species', NULL, 1542379, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559294,247662,1542379}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (905471, 'Chironomus dorsalis', 'species', NULL, 545870, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,129409,545870}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (906537, 'Kiefferulus dux', 'species', NULL, 376763, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,376763}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (925053, 'Bryophaenocladius chrissichuckorum', 'species', 'Spooner''s Flightless Midge', 568396, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1571797,568396}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (967922, 'Glyptotendipes testaceus', 'species', NULL, 126613, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,126613}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (967923, 'Glyptotendipes barbipes', 'species', NULL, 1571501, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,126613,1571501}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (989567, 'Cryptotendipes', 'genus', NULL, 1559243, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559243}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1006340, 'Polypedilum sordens', 'species', NULL, 1551382, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1551382}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1011233, 'Natarsia', 'genus', NULL, 1370489, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,1370489}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1011234, 'Derotanypus', 'genus', NULL, 345994, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345994}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1011242, 'Paraboreochlus', 'genus', NULL, 1370490, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,630865,1370490}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1011297, 'Pagastia', 'genus', NULL, 1370511, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,345991,1370511}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1011300, 'Tanytarsina', 'subtribe', NULL, 345996, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,345996}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1011304, 'Constempellina', 'genus', NULL, 1370759, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,345996,1370759}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1011325, 'Benthalia', 'genus', NULL, 1559249, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1018555, 'Tanypus vilipennis', 'species', NULL, 847610, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,1370486,247742,847610}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1025838, 'Tanytarsus buckleyi', 'species', NULL, 247665, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,345996,1011300,247665}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1026317, 'Cricotopus politus', 'species', NULL, 567613, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,120561,567613}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1026318, 'Phaenopsectra obediens', 'species', NULL, 366264, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,366264}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1038355, 'Demeijerea atrimanus', 'species', NULL, 475361, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,475361}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1042879, 'Telmatogeton torrenticola', 'species', NULL, 247743, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,495788,247743}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1051367, 'Pseudochironomini', 'tribe', NULL, 319399, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1076236, 'Omisus pica', 'species', NULL, 475364, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559248,475364}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1087067, 'Phaenopsectra punctipes', 'species', NULL, 366264, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,366264}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1087084, 'Labrundinia longipalpis', 'species', NULL, 247733, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,247733}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1087098, 'Einfeldia pagana', 'species', NULL, 475362, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,475362}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1095429, 'Hyporhygma quadripunctatum', 'species', NULL, 475365, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,475365}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1102814, 'Polypedilum nubifer', 'species', NULL, 1606387, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1551380,1606387}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1102923, 'Pagastia orthogonia', 'species', NULL, 1011297, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,345991,1370511,1011297}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1131781, 'Cardiocladius obscurus', 'species', NULL, 475369, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1571784,475369}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1131805, 'Polypedilum ontario', 'species', NULL, 1273160, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1273160}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1142140, 'Dicrotendipes simpsoni', 'species', NULL, 247294, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,247294}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1150037, 'Metriocnemus edwardsi', 'species', NULL, 177034, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1572774,177034}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1150767, 'Monopelopia boliekae', 'species', NULL, 485284, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,485284}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1244347, 'Diamesa mendotae', 'species', NULL, 247668, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,345991,1370511,247668}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1265606, 'Demeijerea brachialis', 'species', NULL, 475361, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,475361}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1270108, 'Chironomus staegeri', 'species', NULL, 1552140, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,129409,545869,1552140}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1273160, 'Cerobregma', 'subgenus', NULL, 247660, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1370486, 'Tanypodini', 'tribe', NULL, 130031, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1370489, 'Natarsiini', 'tribe', NULL, 130031, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1370490, 'Boreochlini', 'tribe', NULL, 630865, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,630865}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1370498, 'Metriocnemini', 'tribe', NULL, 129410, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1370499, 'Orthocladiini', 'tribe', NULL, 129410, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1370511, 'Diamesini', 'tribe', NULL, 345991, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,345991}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1370759, 'Zavreliina', 'subtribe', NULL, 345996, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,345996}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1371267, 'Brundiniella', 'genus', NULL, 345994, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345994}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1376667, 'Diamesa chorea', 'species', NULL, 247668, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,345991,1370511,247668}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1394336, 'Kribiodorum perpulchrum', 'species', NULL, 475363, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559248,475363}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1403997, 'Diamesa chiobates', 'species', NULL, 247668, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,345991,1370511,247668}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1421240, 'Telmatogeton pacificus', 'species', NULL, 247743, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,495788,247743}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1421404, 'Clunio vagans', 'species', NULL, 330037, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1572833,330037}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1454363, 'Metriocnemus erythranthei', 'species', 'Monkeyflower Non-biting Midge', 177034, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1572774,177034}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1457049, 'Cardiocladius fulvus', 'species', NULL, 475369, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1571784,475369}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1462479, 'Chironomus atrella', 'species', NULL, 129409, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,129409}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1523948, 'Labrundinia becki', 'species', NULL, 247733, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,247733}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1540754, 'Polypedilum fallax', 'species', NULL, 1585802, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1551380,1585802}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1540884, 'Chasmatonotus bimaculatus', 'species', NULL, 475367, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,475367}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1540922, 'Stenochironomus albipalpus', 'species', NULL, 1542379, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559294,247662,1542379}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1541986, 'Paratendipes duplicatus', 'species', NULL, 1571514, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559248,472252,1571514}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1542167, 'Axarus festivus', 'complex', NULL, 247591, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,247591}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1542169, 'Axarus rogersi', 'complex', NULL, 247591, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,247591}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1542175, 'Polypedilum griseopunctatum', 'species', NULL, 1560647, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1551381,1560647}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1542219, 'Cricotopus tremulus', 'complex', NULL, 567613, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,120561,567613}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1542278, 'Stenochironomus woodi', 'species', NULL, 1542379, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559294,247662,1542379}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1542279, 'Stenochironomus fuscipatellus', 'species', NULL, 1542379, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559294,247662,1542379}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1542310, 'Stenochironomus pulchripennis', 'species', NULL, 1542379, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559294,247662,1542379}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1542314, 'Stenochironomus cinctus', 'species', NULL, 1542380, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559294,247662,1542380}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1542351, 'Stenochironomus macateei', 'species', NULL, 1542379, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559294,247662,1542379}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1542379, 'Stenochironomus', 'subgenus', NULL, 247662, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559294,247662}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1542380, 'Petalopholeus', 'subgenus', NULL, 247662, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559294,247662}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1542450, 'Clinotanypus planus', 'species', NULL, 130980, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345993,130980}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1542594, 'Zavrelimyia smithae', 'species', NULL, 1557442, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,366253,1557442}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1542601, 'Zavrelimyia fragilis', 'species', NULL, 1557442, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,366253,1557442}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1542645, 'Paratendipes fuscitibia', 'species', NULL, 1571514, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559248,472252,1571514}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1542646, 'Paratendipes nitidulus', 'species', NULL, 1571514, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559248,472252,1571514}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1542647, 'Psilotanypus', 'subgenus', NULL, 247741, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345995,247741}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1542682, 'Chironomus decorus', 'complex', NULL, 545869, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,129409,545869}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1542730, 'Thienemannimyia barberi', 'species', NULL, 130958, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,1568058,130958}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1542731, 'Thienemannimyia norena', 'species', NULL, 130958, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,1568058,130958}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1542782, 'Stenochironomus colei', 'species', NULL, 1542379, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559294,247662,1542379}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1542790, 'Chironomus plumosus', 'complex', NULL, 545869, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,129409,545869}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1543031, 'Stictochironomus albicrus', 'species', NULL, 475355, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,475355}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1543040, 'Stictochironomus devinctus', 'species', NULL, 475355, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,475355}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1543042, 'Stictochironomus varius', 'species', NULL, 475355, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,475355}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1543045, 'Stictochironomus annulicrus', 'species', NULL, 475355, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,475355}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1543239, 'Zavrelimyia sinuosa', 'species', NULL, 1557441, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,366253,1557441}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1543401, 'Bilyjomyia', 'genus', NULL, 345994, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345994}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1543402, 'Bilyjomyia algens', 'species', NULL, 1543401, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345994,1543401}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1543778, 'Rheopelopia paramaculipennis', 'species', NULL, 211762, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,1568058,211762}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1543945, 'Psectrotanypus discolor', 'species', NULL, 130957, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345994,130957}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1544239, 'Microtendipes caducus', 'species', NULL, 366243, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559248,366243}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1544389, 'Brundiniella eumorpha', 'species', NULL, 1371267, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345994,1371267}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1544394, 'Zavrelimyia bifasciata', 'species', NULL, 1557441, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,366253,1557441}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1544621, 'Thienemannimyia fusciceps', 'species', NULL, 130958, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,1568058,130958}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1544633, 'Rheopelopia perda', 'species', NULL, 1594887, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,1568058,211762,1594887}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1545200, 'Stictochironomus naevus', 'species', NULL, 475355, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,475355}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1549709, 'Tanypus clavatus', 'species', NULL, 847609, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,1370486,247742,847609}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1549819, 'Glyptotendipes lobiferus', 'complex', NULL, 1571501, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,126613,1571501}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1550078, 'Hayesomyia', 'subgenus', NULL, 130958, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,1568058,130958}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1550079, 'Thienemannimyia senata', 'species', NULL, 1550078, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,1568058,130958,1550078}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1550182, 'Helopelopia', 'genus', NULL, 1568058, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,1568058}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1550183, 'Helopelopia cornuticaudata', 'species', NULL, 1550182, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,1568058,1550182}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1550191, 'Phaenopsectra dyari', 'species', NULL, 366264, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,366264}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1550720, 'Stenochironomus browni', 'species', NULL, 1542380, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559294,247662,1542380}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1550965, 'Stenochironomus unictus', 'species', NULL, 1542379, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559294,247662,1542379}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1551380, 'Polypedilum', 'subgenus', NULL, 247660, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1551381, 'Tripodura', 'subgenus', NULL, 247660, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1551382, 'Pentapedilum', 'subgenus', NULL, 247660, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1551385, 'Polypedilum calopterus', 'species', NULL, 1585802, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1551380,1585802}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1552140, 'Chironomus staegeri', 'complex', NULL, 545869, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,129409,545869}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1553133, 'Phaenopsectra profusa', 'species', NULL, 366264, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,366264}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1557207, 'Cricotopus bicinctus', 'complex', NULL, 567613, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,120561,567613}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1557208, 'Cricotopus trifascia', 'complex', NULL, 567613, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,120561,567613}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1557209, 'Cricotopus sylvestris', 'complex', NULL, 523878, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,120561,523878}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1557441, 'Zavrelimyia', 'subgenus', NULL, 366253, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,366253}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1557442, 'Paramerina', 'subgenus', NULL, 366253, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,366253}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1558375, 'Asheum', 'subgenus', NULL, 247660, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1558376, 'Polypedilum beckae', 'species', NULL, 1558375, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1558375}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1558436, 'Labrundinia neopilosella', 'species', NULL, 247733, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,247733}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1558437, 'Labrundinia johnnseni', 'species', NULL, 247733, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,247733}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1558779, 'Stenochironomus totifuscus', 'species', NULL, 1542380, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559294,247662,1542380}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1558806, 'Xestochironomus subletti', 'species', NULL, 247666, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559294,247666}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1559092, 'Stenochironomus aestivalis', 'species', NULL, 1542380, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559294,247662,1542380}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1559206, 'Polypedilum group', 'subtribe', 'Polypedilum Group', 129408, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1559243, 'Harnischia group', 'subtribe', 'Harnischia Group', 129408, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1559248, 'Lauterborniella group', 'subtribe', 'Lauterborniella Group', 129408, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1559249, 'Chironomus group', 'subtribe', 'Chironomus Group', 129408, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1559294, 'Stenochironomus group', 'subtribe', 'Stenochironomus Group', 129408, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1560542, 'Pullum', 'complex', 'Pullum Group', 1551381, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1551381}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1560556, 'Labeculosum', 'complex', 'Labeculosum Group', 1551381, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1551381}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1560559, 'Polypedilum labeculosum', 'species', NULL, 1560556, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1551381,1560556}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1560647, 'Aegyptium', 'complex', 'Aegyptium Group', 1551381, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1551381}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1560972, 'Polypedilum apicatum', 'species', NULL, 1560647, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1551381,1560647}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1560989, 'Polypedilum epleri', 'species', NULL, 1551382, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1551382}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1566536, 'Chironomus vitellinus', 'species', NULL, 1606411, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,129409,545869,1606411}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1566679, 'Uresipedilum', 'subgenus', NULL, 247660, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1566705, 'Asayia', 'subgenus', NULL, 247694, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,247694}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1567222, 'Phaenopsectra vittata', 'species', NULL, 366264, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,366264}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1568051, 'Parachironomus longistilis', 'species', NULL, 247650, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559243,247650}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1568058, 'Thienemannimyia group', 'subtribe', 'Thienemannimyia Group', 130030, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1569953, 'Chironomus pallidivittatus', 'species', NULL, 545867, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,129409,545867}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1571501, 'Glyptotendipes', 'subgenus', NULL, 126613, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,126613}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1571514, 'Paratendipes albimanus', 'complex', 'Albimanus Group', 472252, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559248,472252}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1571771, 'Brillia group', 'subtribe', 'Primitive Orthoclads', 129410, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1571784, 'Cardiocladius group', 'subtribe', 'Cardiocladius Group', 1370498, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1571797, 'Limnophyes group', 'subtribe', 'Limnophyes Group', 1370498, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1572343, 'Axarus taenionotus', 'species', NULL, 1542167, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,247591,1542167}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1572774, 'Metriocnemus group', 'subtribe', 'Metriocnemus Group', 1370498, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1572816, 'Smittia group', 'subtribe', 'Smittia Group', 1370498, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1572833, 'Clunio group', 'subtribe', 'Clunio Group', 1370498, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1572926, 'Nanocladius alternantherae', 'species', NULL, 366249, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1571784,366249}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1578618, 'Goeldichironomus pictus', 'complex', 'Pictus Group', 247618, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,247618}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1585772, 'Parachironomus carinatus', 'species', NULL, 247650, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559243,247650}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1585801, 'Polypedilum artifer', 'species', NULL, 1585802, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1551380,1585802}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1585802, 'Polypedilum fallax', 'complex', NULL, 1551380, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1551380}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1585823, 'Polypedilum pardus', 'species', NULL, 1551381, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1551381}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1586797, 'Limnophyes viribus', 'species', NULL, 366248, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1571797,366248}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1588706, 'Wirthiella', 'subgenus', NULL, 376763, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,376763}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1588707, 'Kiefferulus pungens', 'species', NULL, 1588706, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,376763,1588706}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1588908, 'Thienemanniella lobapodema', 'species', NULL, 366252, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1612973,366252}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1590867, 'Chironomus riparius', 'complex', NULL, 545869, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,129409,545869}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1591839, 'Demeijerea obreptus', 'species', NULL, 475361, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,475361}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1594881, 'Polypedilum illinoense', 'complex', NULL, 1551380, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1551380}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1594882, 'Polypedilum illinoense', 'species', NULL, 1594881, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1551380,1594881}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1594887, 'Rheopelopia acra', 'complex', NULL, 211762, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,1568058,211762}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1595397, 'Clunio marshalli', 'species', NULL, 330037, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1572833,330037}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1606387, 'Polypedilum nubifer', 'complex', NULL, 1551380, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1551380}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1606411, 'Chironomus javanus', 'complex', NULL, 545869, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,129409,545869}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1610438, 'Parachaetocladius abnobaeus', 'species', NULL, 366265, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370498,1571797,366265}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1612973, 'Corynoneura group', 'subtribe', 'Corynoneura Group', 129410, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1613621, 'Polypedilum flavum', 'species', NULL, 1566679, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1566679}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1614298, 'Diamesa cheimatophila', 'species', NULL, 247668, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,345991,1370511,247668}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1614759, 'Larsia decolorata', 'species', NULL, 247737, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,130030,247737}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1616651, 'Brillia retifinis', 'species', NULL, 366246, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1571771,366246}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1620245, 'Goeldichironomus devineyae', 'species', NULL, 247618, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559249,247618}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1620293, 'Chasmatonotus bicolor', 'species', NULL, 475367, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,475367}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1620294, 'Chasmatonotus fascipennis', 'species', NULL, 475367, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,475367}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1620295, 'Chasmatonotus univittatus', 'species', NULL, 475367, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410,1370499,475367}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1624079, 'Stempellinella fimbriata', 'species', NULL, 366245, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,345996,1370759,366245}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1628219, 'Tanytarsus acifer', 'species', NULL, 247665, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,345996,1011300,247665}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1628396, 'Apometriocnemus', 'genus', NULL, 129410, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,129410}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1630714, 'Clinotanypus wirthi', 'species', NULL, 130980, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,345993,130980}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1631194, 'Stenochironomus maculatus', 'species', NULL, 1542379, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559294,247662,1542379}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1631204, 'Stenochironomus bisetosus', 'species', NULL, 1542379, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559294,247662,1542379}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1639468, 'Tanypus concavus', 'species', NULL, 847610, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,130031,1370486,247742,847610}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;
INSERT INTO taxa (taxon_id, name, rank, common_name, parent_id, ancestor_ids, created_at)
VALUES (1639496, 'Polypedilum laetum', 'complex', NULL, 1551380, '{1,47120,372739,47158,184884,47822,154259,153429,509764,53275,319399,129408,1559206,247660,1551380}', datetime('now'))
ON CONFLICT(taxon_id) DO UPDATE SET
  name=excluded.name,
  rank=excluded.rank,
  common_name=COALESCE(excluded.common_name, common_name),
  parent_id=excluded.parent_id,
  ancestor_ids=excluded.ancestor_ids;

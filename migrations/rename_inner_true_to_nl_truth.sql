-- Rename Inner True to NL Truth: update Subsidiary row and Project.subsidiary
UPDATE Subsidiary SET name = 'NL Truth', path = '/nl-truth' WHERE id = 'sub-003' AND (name = 'Inner True' OR path = '/inner-true');
UPDATE Project SET subsidiary = 'NL Truth' WHERE subsidiary = 'Inner True';

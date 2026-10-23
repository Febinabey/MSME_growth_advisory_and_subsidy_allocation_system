import { db } from '../server/db.js';

const handlooms = db.prepare("SELECT id FROM applications WHERE enterprise_name = 'Audit Verified Handlooms' ORDER BY created_at ASC").all();
if (handlooms.length > 1) {
  const toDelete = handlooms.slice(1).map(h => h.id);
  for (const id of toDelete) {
    db.prepare('DELETE FROM applications WHERE id = ?').run(id);
  }
  console.log('Deleted ' + toDelete.length + ' duplicate Handloom records');
}

db.prepare("UPDATE applications SET sector = 'Manufacturing - Textiles & Apparel' WHERE enterprise_name = 'Audit Verified Handlooms'").run();

const balajiDups = db.prepare("SELECT id FROM applications WHERE enterprise_name = 'Shri Salasar Balaji Contractor' AND id LIKE 'APP-%'").all();
for (const b of balajiDups) {
  db.prepare('DELETE FROM applications WHERE id = ?').run(b.id);
}
console.log('Deleted ' + balajiDups.length + ' duplicate Balaji records');

const remaining = db.prepare('SELECT COUNT(*) as count FROM applications').get().count;
console.log('Clean DB row count:', remaining);

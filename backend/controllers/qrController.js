const asyncHandler = require('express-async-handler');
const Animal = require('../models/Animal');

// GET /qr/scan/:token
const scanQr = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const animal = await Animal.findOne({ qrToken: token }).populate('addedBy', 'name email phone');
  if (!animal) { res.status(404); throw new Error('Pet not found'); }

  const acceptType = req.accepts(['json', 'html']);
  const owner = (animal.ownerContact && animal.ownerContact.name) ? animal.ownerContact : animal.addedBy;

  if (acceptType === 'html') {
    if (process.env.CLIENT_URL) {
      return res.redirect(`${process.env.CLIENT_URL.replace(/\/$/, '')}/qr/${token}`);
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${animal.name} - Pet Details</title>
  <style>body{margin:0;font-family:Inter,system-ui,sans-serif;background:#0f172a;color:#e2e8f0}main{max-width:720px;margin:40px auto;padding:24px;background:#111827;border-radius:20px;box-shadow:0 20px 60px rgba(15,23,42,.35)}h1{margin:0 0 12px;font-size:2rem;color:#f8fafc}p{margin:.5rem 0;color:#cbd5e1}img{max-width:100%;border-radius:16px;margin-bottom:16px}dl{display:grid;grid-template-columns:120px 1fr;gap:.75rem .5rem}dt{font-weight:700;color:#94a3b8}dd{margin:0;color:#e2e8f0}footer{margin-top:24px;color:#94a3b8;font-size:.9rem}</style>
</head>
<body>
  <main>
    <h1>${animal.name}</h1>
    <p>${animal.type} — ${animal.breed}</p>
    ${animal.images?.length ? `<img src="${animal.images[0]}" alt="${animal.name}" />` : ''}
    <dl>
      <dt>Age</dt><dd>${animal.age} months</dd>
      <dt>Gender</dt><dd>${animal.gender}</dd>
      <dt>Status</dt><dd>${animal.status || 'Unknown'}</dd>
      <dt>Lost</dt><dd>${animal.lost ? 'Yes' : 'No'}</dd>
      <dt>Owner</dt><dd>${owner?.name || owner?.email || 'Not available'}</dd>
      <dt>Email</dt><dd>${owner?.email || 'Not available'}</dd>
      <dt>Phone</dt><dd>${owner?.phone || 'Not available'}</dd>
      <dt>Vaccination</dt><dd>${animal.vaccinationDetails || 'No records'}</dd>
      <dt>Medical</dt><dd>${animal.medicalHistory || 'No records'}</dd>
      <dt>Description</dt><dd>${animal.description || 'No description provided.'}</dd>
    </dl>
    <footer>Scan complete. Visit the app for full adoption details.</footer>
  </main>
</body>
</html>`;
    return res.send(html);
  }

  res.json({
    name: animal.name,
    type: animal.type,
    breed: animal.breed,
    age: animal.age,
    gender: animal.gender,
    images: animal.images,
    owner,
    vaccinationDetails: animal.vaccinationDetails,
    medicalHistory: animal.medicalHistory,
    lost: animal.lost,
    status: animal.status,
    location: animal.location,
    description: animal.description,
  });
});

module.exports = { scanQr };

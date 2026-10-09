import assert from 'node:assert';

const BASE_URL = 'http://localhost:5000';

async function runApiAudit() {
  console.log('=== RUNNING COMPLETE ENDPOINT & FEATURE AUDIT ===\n');

  // 1. Health check
  console.log('1. Testing GET /api/health...');
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  assert.strictEqual(healthRes.status, 200, 'Health endpoint must return 200');
  const healthData = await healthRes.json();
  assert.strictEqual(healthData.status, 'ONLINE');
  assert.ok(healthData.datasets.asuse, 'Must include ASUSE dataset metadata');
  assert.ok(healthData.stats.totalApplications > 0, 'Database has active applications');
  console.log('  ✓ PASS: /api/health is ONLINE with', healthData.stats.totalApplications, 'applications in queue');

  // 2. Applications List
  console.log('\n2. Testing GET /api/applications...');
  const appsRes = await fetch(`${BASE_URL}/api/applications`);
  assert.strictEqual(appsRes.status, 200);
  const appsData = await appsRes.json();
  assert.strictEqual(appsData.success, true);
  assert.ok(Array.isArray(appsData.data));
  console.log('  ✓ PASS: /api/applications returned', appsData.data.length, 'records');

  // 3. Valid MSME Application Submission
  console.log('\n3. Testing POST /api/applications (Valid Micro Unit)...');
  const validPayload = {
    enterpriseName: 'Audit Verified Handlooms',
    state: 'Assam',
    district: 'Kamrup',
    sector: 'Manufacturing',
    annualRevenue: 15000000, // ₹1.5 Cr (Micro)
    revenueGrowthRate: 16,
    employees: 12,
    debtRatio: 0.20,
    profitMargin: 15,
    techLevel: 3,
    gstScore: 82,
    exportShare: 5,
    requestedScheme: 'PMEGP Subsidy',
    requestedSubsidy: 500000
  };
  const submitRes = await fetch(`${BASE_URL}/api/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validPayload)
  });
  assert.strictEqual(submitRes.status, 201, 'Valid application must return 201 Created');
  const submitData = await submitRes.json();
  assert.strictEqual(submitData.success, true);
  assert.ok(submitData.data.id.startsWith('APP-'));
  console.log('  ✓ PASS: Successfully registered application with ID:', submitData.data.id);

  // 4. Ineligible Large Enterprise Submission (> ₹250 Cr)
  console.log('\n4. Testing POST /api/applications (Ineligible Large Corporate > ₹250 Cr)...');
  const largePayload = {
    enterpriseName: 'Mega Corp Industries Ltd',
    state: 'Maharashtra',
    district: 'Mumbai',
    sector: 'Manufacturing',
    annualRevenue: 5000000000, // ₹500 Cr (> ₹250 Cr limit)
    requestedScheme: 'PMEGP Subsidy',
    requestedSubsidy: 2500000
  };
  const largeRes = await fetch(`${BASE_URL}/api/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(largePayload)
  });
  assert.strictEqual(largeRes.status, 403, 'Must reject > ₹250 Cr with 403 Forbidden');
  const largeData = await largeRes.json();
  assert.strictEqual(largeData.success, false);
  assert.ok(largeData.error.includes('250 Crore'));
  console.log('  ✓ PASS: Correctly rejected large non-MSME with 403:', largeData.error);

  // 5. Knapsack Optimization Endpoint (Testing budgetINR and policyWeights)
  console.log('\n5. Testing POST /api/optimize (standard format)...');
  const optRes1 = await fetch(`${BASE_URL}/api/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      budgetINR: 20000000,
      policyWeights: { revenueWeight: 0.5, jobWeight: 0.5, greenBonus: 0.2 }
    })
  });
  assert.strictEqual(optRes1.status, 200);
  const optData1 = await optRes1.json();
  assert.strictEqual(optData1.success, true);
  assert.strictEqual(optData1.data.availableBudgetINR, 20000000);
  assert.ok(optData1.data.aiAllocation.totalBudgetSpentINR <= 20000000, 'Spent <= Budget');
  console.log('  ✓ PASS: Knapsack allocated ₹' + optData1.data.aiAllocation.totalBudgetSpentINR + ' under ₹20,000,000 budget');

  // 6. Knapsack Optimization Endpoint (Testing alternative budget & alpha/beta/gamma format)
  console.log('\n6. Testing POST /api/optimize (alternative budget & alpha/beta format)...');
  const optRes2 = await fetch(`${BASE_URL}/api/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      budget: 35000000,
      alpha: 0.6,
      beta: 0.4,
      gamma: 0.3
    })
  });
  assert.strictEqual(optRes2.status, 200);
  const optData2 = await optRes2.json();
  assert.strictEqual(optData2.success, true);
  assert.strictEqual(optData2.data.availableBudgetINR, 35000000, 'Correctly parsed alternative budget parameter');
  assert.ok(optData2.data.aiAllocation.totalBudgetSpentINR <= 35000000);
  console.log('  ✓ PASS: Alternative format correctly recognized budget ₹' + optData2.data.availableBudgetINR);

  // 7. Schemes Catalog
  console.log('\n7. Testing GET /api/schemes...');
  const schemesRes = await fetch(`${BASE_URL}/api/schemes`);
  assert.strictEqual(schemesRes.status, 200);
  const schemesData = await schemesRes.json();
  assert.strictEqual(schemesData.success, true);
  assert.strictEqual(schemesData.total, 24, 'All 24 schemes present');
  console.log('  ✓ PASS: All 24 statutory schemes returned');

  // 8. Scheme Matching Engine
  console.log('\n8. Testing POST /api/schemes/match...');
  const matchRes = await fetch(`${BASE_URL}/api/schemes/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      metrics: {
        annualRevenue: 25000000,
        employees: 18,
        sector: 'Green Tech',
        techLevel: 4,
        gstScore: 90
      },
      requirementText: 'Solar panel installation rooftop green energy'
    })
  });
  assert.strictEqual(matchRes.status, 200);
  const matchData = await matchRes.json();
  assert.strictEqual(matchData.success, true);
  assert.ok(matchData.data.length === 24);
  assert.ok(matchData.data[0].isEligible === true, 'Top ranked scheme is eligible');
  console.log('  ✓ PASS: Top matched scheme:', matchData.data[0].name, '(Semantic match:', matchData.data[0].semanticScore + '%)');

  // 9. Predict All (XGBoost + SHAP Additivity Check)
  console.log('\n9. Testing POST /api/predict/all (Ensuring exact SHAP Additivity)...');
  const testMetrics = {
    annualRevenue: 35000000,
    revenueGrowthRate: 18,
    employees: 28,
    debtRatio: 0.25,
    profitMargin: 13.5,
    techLevel: 3,
    gstScore: 85,
    exportShare: 12,
    sector: 'Manufacturing'
  };
  const predRes = await fetch(`${BASE_URL}/api/predict/all`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testMetrics)
  });
  assert.strictEqual(predRes.status, 200);
  const predData = await predRes.json();
  assert.strictEqual(predData.success, true);
  const { predictions, shapData } = predData.data;
  
  assert.strictEqual(predictions.growthScore, shapData.finalCalculatedScore, 'Growth score MUST equal SHAP calculated score');
  const attributionsSum = parseFloat(shapData.shapContributions.reduce((s, c) => s + c.shapValue, 0).toFixed(1));
  const expectedTotal = Math.round(shapData.baseScore + attributionsSum);
  assert.strictEqual(expectedTotal, predictions.growthScore, 'Base + SHAP sum MUST equal Growth Score');
  console.log('  ✓ PASS: Growth Score (' + predictions.growthScore + ') strictly equals SHAP Final Score (' + shapData.finalCalculatedScore + ')');
  console.log('  ✓ PASS: Base (' + shapData.baseScore + ') + sum(phi_i) (' + attributionsSum + ') === ' + predictions.growthScore);

  // 10. Benchmarks Sectors
  console.log('\n10. Testing GET /api/benchmarks/sectors...');
  const benchRes = await fetch(`${BASE_URL}/api/benchmarks/sectors`);
  assert.strictEqual(benchRes.status, 200);
  const benchData = await benchRes.json();
  assert.strictEqual(benchData.success, true);
  assert.ok(benchData.data['Manufacturing - Metals & Engineering']);
  console.log('  ✓ PASS: MoSPI ASUSE sector benchmarks loaded successfully');

  console.log('\n======================================================');
  console.log('ALL 10 API & FEATURE AUDIT CHECKS PASSED WITH ZERO ERRORS');
  console.log('======================================================');
}

runApiAudit().catch(err => {
  console.error('AUDIT FAILED:', err);
  process.exit(1);
});

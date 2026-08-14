/* -------------------------------------------------------------
   FI PATEL ELECTRICALS - SOLAR SAVINGS & BANK EMI CALCULATOR
   ------------------------------------------------------------- */

function initSolarCalculator() {
  const billInput = document.getElementById('monthlyBillInput');
  const billDisplay = document.getElementById('billValueDisplay');

  const kwOutput = document.getElementById('kwOutput');
  const totalCostOutput = document.getElementById('totalCostOutput');
  const subsidyOutput = document.getElementById('subsidyOutput');
  const netCostOutput = document.getElementById('netCostOutput');
  const savingsOutput = document.getElementById('savingsOutput');
  const emiOutput = document.getElementById('emiOutput');
  const brandPills = document.querySelectorAll('.brand-select-pill');

  let currentBrand = 'adani'; // 'adani' | 'citizen' | 'custom'

  function updateBrandSelection(brand) {
    currentBrand = brand;
    brandPills.forEach(pill => {
      if (pill.getAttribute('data-brand') === brand) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    if (brand === 'adani') {
      if (billInput) billInput.value = 3500;
      applyPresetValues({
        kw: '3.24 kW',
        totalCost: 155000,
        subsidy: 78000,
        netCost: 77000,
        savings: '₹3,500 / mo',
        emi: '₹1,800 - ₹3,500 / mo*'
      });
    } else if (brand === 'citizen') {
      if (billInput) billInput.value = 3500;
      applyPresetValues({
        kw: '3.30 kW',
        totalCost: 143000,
        subsidy: 78000,
        netCost: 65000,
        savings: '₹3,500 / mo',
        emi: '₹1,500 - ₹3,000 / mo*'
      });
    } else {
      calculateSolar();
    }
  }

  function applyPresetValues(data) {
    if (billDisplay && billInput) billDisplay.textContent = '₹' + (parseFloat(billInput.value) || 3500).toLocaleString('en-IN');
    if (kwOutput) kwOutput.textContent = data.kw;
    if (totalCostOutput) totalCostOutput.textContent = '₹' + data.totalCost.toLocaleString('en-IN');
    if (subsidyOutput) subsidyOutput.textContent = '- ₹' + data.subsidy.toLocaleString('en-IN') + '*';
    if (netCostOutput) netCostOutput.textContent = '₹' + data.netCost.toLocaleString('en-IN') + '*';
    if (savingsOutput) savingsOutput.textContent = data.savings;
    if (emiOutput) emiOutput.textContent = data.emi;
  }

  function calculateSolar() {
    const monthlyBill = parseFloat(billInput.value) || 3500;

    // Display formatted bill amount
    if (billDisplay) billDisplay.textContent = '₹' + monthlyBill.toLocaleString('en-IN');

    // If standard 3500 bill and brand is selected, keep brand package accurate
    if (monthlyBill === 3500 && currentBrand === 'adani') {
      applyPresetValues({
        kw: '3.24 kW',
        totalCost: 155000,
        subsidy: 78000,
        netCost: 77000,
        savings: '₹3,500 / mo',
        emi: '₹1,800 - ₹3,500 / mo*'
      });
      return;
    } else if (monthlyBill === 3500 && currentBrand === 'citizen') {
      applyPresetValues({
        kw: '3.30 kW',
        totalCost: 143000,
        subsidy: 78000,
        netCost: 65000,
        savings: '₹3,500 / mo',
        emi: '₹1,500 - ₹3,000 / mo*'
      });
      return;
    }

    // Recommended System kW (1 kW generates ~120 units, saving ~₹1,200/mo)
    let recommendedKw = Math.ceil(monthlyBill / 1200);
    if (recommendedKw < 1) recommendedKw = 1;
    if (recommendedKw > 25) recommendedKw = 25;

    // Base System Cost per kW
    const baseCostPerKw = currentBrand === 'citizen' ? 44000 : 48000;
    const totalCost = recommendedKw * baseCostPerKw;

    // PM Surya Ghar Muft Bijli Yojana Central Govt Subsidy:
    // 1 kW = ₹30,000 | 2 kW = ₹60,000 | 3 kW+ = ₹78,000 max cap
    let subsidy = 0;
    if (recommendedKw === 1) subsidy = 30000;
    else if (recommendedKw === 2) subsidy = 60000;
    else subsidy = 78000;

    const netCost = totalCost - subsidy;

    // Monthly Savings (~88% to 92% of power bill)
    const monthlySavings = Math.round(monthlyBill * 0.90);

    // Bank Loan EMI on Net Cost (approx 7% p.a. over 60 months)
    const monthlyInterestRate = 0.07 / 12;
    const tenureMonths = 60;
    let emi = 0;
    if (netCost > 0) {
      emi = Math.round((netCost * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths)) / (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1));
    }

    // Update UI elements
    if (kwOutput) kwOutput.textContent = recommendedKw + ' kW';
    if (totalCostOutput) totalCostOutput.textContent = '₹' + totalCost.toLocaleString('en-IN');
    if (subsidyOutput) subsidyOutput.textContent = '- ₹' + subsidy.toLocaleString('en-IN') + '*';
    if (netCostOutput) netCostOutput.textContent = '₹' + netCost.toLocaleString('en-IN') + '*';
    if (savingsOutput) savingsOutput.textContent = '₹' + monthlySavings.toLocaleString('en-IN') + ' / mo';
    if (emiOutput) emiOutput.textContent = '₹' + emi.toLocaleString('en-IN') + ' / mo*';
  }

  // Attach brand pill events
  brandPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const brand = pill.getAttribute('data-brand');
      updateBrandSelection(brand);
    });
  });

  if (billInput) {
    billInput.addEventListener('input', () => {
      calculateSolar();
    });
  }

  // Initial load
  updateBrandSelection('adani');
}

document.addEventListener('DOMContentLoaded', initSolarCalculator);


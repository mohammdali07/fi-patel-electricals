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

  if (!billInput) return;

  function calculateSolar() {
    const monthlyBill = parseFloat(billInput.value) || 3500;

    // Display formatted bill amount
    billDisplay.textContent = '₹' + monthlyBill.toLocaleString('en-IN');

    // Recommended System kW (1 kW generates ~120 units, saving ~₹1,200/mo)
    let recommendedKw = Math.ceil(monthlyBill / 1200);
    if (recommendedKw < 1) recommendedKw = 1;
    if (recommendedKw > 25) recommendedKw = 25;

    // Base System Cost per kW (~ ₹45,000/kW)
    const baseCostPerKw = 45000;
    const totalCost = recommendedKw * baseCostPerKw;

    // Approx Govt Subsidy Calculation (Max Approx. ₹74,000 cap)
    let subsidy = 0;
    if (recommendedKw === 1) subsidy = 30000;
    else if (recommendedKw === 2) subsidy = 60000;
    else subsidy = 74000; // Approx 74,000 max cap

    const netCost = totalCost - subsidy;

    // Monthly Savings (~88% of power bill)
    const monthlySavings = Math.round(monthlyBill * 0.88);

    // 0 Down Payment Bank Loan EMI on Net Cost (7% p.a. over 60 months)
    const monthlyInterestRate = 0.07 / 12;
    const tenureMonths = 60;
    let emi = 0;
    if (netCost > 0) {
      emi = Math.round((netCost * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths)) / (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1));
    }

    // Update UI elements
    if (kwOutput) kwOutput.textContent = recommendedKw + ' kW';
    if (totalCostOutput) totalCostOutput.textContent = '₹' + totalCost.toLocaleString('en-IN');
    if (subsidyOutput) subsidyOutput.textContent = 'Approx. - ₹' + subsidy.toLocaleString('en-IN') + '*';
    if (netCostOutput) netCostOutput.textContent = '₹' + netCost.toLocaleString('en-IN') + '*';
    if (savingsOutput) savingsOutput.textContent = '₹' + monthlySavings.toLocaleString('en-IN') + ' / mo';
    if (emiOutput) emiOutput.textContent = '₹' + emi.toLocaleString('en-IN') + ' / mo';
  }

  billInput.addEventListener('input', calculateSolar);
  calculateSolar();
}

document.addEventListener('DOMContentLoaded', initSolarCalculator);

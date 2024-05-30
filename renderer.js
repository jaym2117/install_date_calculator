let leadTimes = {};

window.electron.getLeadTimes().then(data => {
  leadTimes = data;
  updateLeadTime();
});

function updateLeadTime() {
  const projectType = document.getElementById('projectType').value;
  const projectValue = parseFloat(document.getElementById('projectValue').value);
  const specialConditions = Array.from(document.querySelectorAll('input[name="specialConditions"]:checked')).map(el => el.value);

  let minLeadTimeDays = 0;
  let maxLeadTimeDays = 0;

  if (leadTimes[projectType]) {
    const minWeeks = leadTimes[projectType].minWeeks;
    const maxWeeks = leadTimes[projectType].maxWeeks;
    minLeadTimeDays = minWeeks * 7;
    maxLeadTimeDays = maxWeeks * 7;
  }

  let maxSpecialConditionDays = 0;

  specialConditions.forEach(condition => {
    if (leadTimes[condition]) {
      const maxWeeks = leadTimes[condition].maxWeeks;
      const conditionDays = maxWeeks * 7;
      if (conditionDays > maxSpecialConditionDays) {
        maxSpecialConditionDays = conditionDays;
      }
    }
  });

  minLeadTimeDays += maxSpecialConditionDays;
  maxLeadTimeDays += maxSpecialConditionDays;

  const minLeadTimeWeeks = (minLeadTimeDays / 7).toFixed(1);
  const maxLeadTimeWeeks = (maxLeadTimeDays / 7).toFixed(1);
  document.getElementById('leadTimeEstimate').innerText = `Estimated Lead Time: ${minLeadTimeDays} - ${maxLeadTimeDays} days (${minLeadTimeWeeks} - ${maxLeadTimeWeeks} weeks)`;

  if (projectValue > 80000) {
    document.getElementById('managerApprovalNote').innerText = 'Project value over $80,000. Manager approval needed.';
    document.getElementById('calculateBtn').disabled = true; 
  } else {
    document.getElementById('managerApprovalNote').innerText = '';
    document.getElementById('calculateBtn').disabled = false; 
  }
}

function calculateInstallDate() {
  const awardedDate = new Date(document.getElementById('awardedDate').value);
  const measureDate = new Date(document.getElementById('measureDate').value);
  const projectType = document.getElementById('projectType').value;
  const projectValue = parseFloat(document.getElementById('projectValue').value);
  const specialConditions = Array.from(document.querySelectorAll('input[name="specialConditions"]:checked')).map(el => el.value);

  if (isNaN(awardedDate) || isNaN(measureDate) || isNaN(projectValue)) {
    document.getElementById('result').innerText = 'Please enter valid dates, project value, and select project type.';
    return;
  }

  let minLeadTimeDays = 0;
  let maxLeadTimeDays = 0;

  if (leadTimes[projectType]) {
    const minWeeks = leadTimes[projectType].minWeeks;
    const maxWeeks = leadTimes[projectType].maxWeeks;
    minLeadTimeDays = minWeeks * 7;
    maxLeadTimeDays = maxWeeks * 7;
  }

  let maxSpecialConditionDays = 0;

  specialConditions.forEach(condition => {
    if (leadTimes[condition]) {
      const maxWeeks = leadTimes[condition].maxWeeks;
      const conditionDays = maxWeeks * 7;
      if (conditionDays > maxSpecialConditionDays) {
        maxSpecialConditionDays = conditionDays;
      }
    }
  });

  minLeadTimeDays += maxSpecialConditionDays;
  maxLeadTimeDays += maxSpecialConditionDays;

  const startDate = new Date(Math.max(awardedDate, measureDate));
  const installDate = new Date(startDate);
  installDate.setDate(installDate.getDate() + minLeadTimeDays);

  document.getElementById('result').innerText = `Earliest Install Date: ${installDate.toDateString()}`;
}

// Add event listeners to update lead time as inputs change
document.getElementById('projectType').addEventListener('change', updateLeadTime);
document.querySelectorAll('input[name="specialConditions"]').forEach(input => input.addEventListener('change', updateLeadTime));
document.getElementById('awardedDate').addEventListener('input', updateLeadTime);
document.getElementById('measureDate').addEventListener('input', updateLeadTime);

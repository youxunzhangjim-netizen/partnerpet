(() => {
  'use strict';
  const link = document.querySelector('[data-issue-report]');
  if (!link) return;
  // A desktop file URL would reveal the user's filesystem path.
  if (location.protocol === 'http:' || location.protocol === 'https:') {
    const body = "Project / 專案: PartnerPets\n\nWhat happened? / 遇到什麼問題？\n\nSteps to reproduce / 重現步驟:\n1. \n2. \n\nExpected result / 預期結果:\n\nBrowser or device / 瀏覽器或裝置:\n"
      + '\nPage / 頁面: ' + location.origin + location.pathname;
    link.href = 'mailto:youxunzhangjim@gmail.com?subject='
      + encodeURIComponent('[PartnerPets] Problem report / 問題回報')
      + '&body=' + encodeURIComponent(body);
  }
  link.addEventListener('pointerdown', (event) => event.stopPropagation());
  link.addEventListener('click', async (event) => {
    if (!window.petRoomAPI?.reportIssue) return;
    event.preventDefault();
    try {
      await window.petRoomAPI.reportIssue();
    } catch (error) {
      console.error('Could not open the issue report draft:', error);
      window.alert('Please email / 請寄信至 youxunzhangjim@gmail.com');
    }
  });
})();

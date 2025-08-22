// markmap-integration.js
document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = `
    .user1-node {
      color: #ff6b6b !important;
      font-weight: bold !important;
    }
    .user2-node {
      color: #4dabf7 !important;
      font-weight: bold !important;
    }
    .shared-node {
      color: #cc5de8 !important;
      font-weight: bold !important;
    }
    .battle-summary {
      margin-top: 20px;
      border-radius: 8px;
      overflow: hidden;
    }
    .vs-badge {
      background-color: #f8f9fa;
      color: #495057;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);
});

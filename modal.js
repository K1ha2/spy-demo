// Inject modal HTML into body
document.addEventListener("DOMContentLoaded", () => {
  const modalHTML = `
    <div id="modal-overlay" style="display:none;">
      <div id="modal-box">
        <span id="modal-close" title="Close">&times;</span>
        <div id="modal-content"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-overlay").addEventListener("click", (e) => {
    if (e.target.id === "modal-overlay") closeModal();
  });
});

// Open modal with content
function openModal(contentHTML) {
  document.getElementById("modal-content").innerHTML = contentHTML;
  document.getElementById("modal-overlay").style.display = "flex";
}

// Close modal
function closeModal() {
  document.getElementById("modal-overlay").style.display = "none";
}

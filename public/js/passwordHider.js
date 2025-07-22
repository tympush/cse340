const pswdBtn = document.querySelector("#pswdBtn");
if (pswdBtn) {
  pswdBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const pswdInput = document.getElementById("pword");
    const type = pswdInput.getAttribute("type");
    if (type === "password") {
      pswdInput.setAttribute("type", "text");
      pswdBtn.textContent = "Hide";
    } else {
      pswdInput.setAttribute("type", "password");
      pswdBtn.textContent = "Show";
    }
  });
}
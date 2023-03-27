var limit = 5;
var q = undefined;
var goalsRange = undefined
var page = 1;
var positions = undefined
var clubs = undefined;
var isCaptain = undefined;
var nations = undefined
var isAdmin = undefined;
var ageRange = undefined
function setupModal() {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add("is-active");
  }

  function closeModal($el) {
    $el.classList.remove("is-active");
  }

  function closeAllModals() {
    (document.querySelectorAll(".modal") || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll(".js-modal-trigger") || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener("click", () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (
    document.querySelectorAll(
      ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button"
    ) || []
  ).forEach(($close) => {
    const $target = $close.closest(".modal");

    $close.addEventListener("click", () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener("keydown", (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) {
      // Escape key
      closeAllModals();
    }
  });
}
document.addEventListener("DOMContentLoaded", setupModal);

function validate(form) {
  // validation code here ...

  return confirm("Do you really want to delete ?");
}


$(function () {
  $(document).scroll(function () {
    var $nav = $(".navbar-scroll");
    $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
  });
});

$(function () {
  $(document).scroll(function () {
    var $nav = $(".navbar-scroll .signup");
    $nav.toggleClass('is-primary', $(this).scrollTop() > $nav.height());
  });
});

$(function () {
  $(document).scroll(function () {
    var $nav = $(".navbar-scroll .login");
    $nav.toggleClass('is-dark', $(this).scrollTop() > $nav.height());
  });
});





$(document).ready(function () {
  $('#searchInput').on('keyup', function () {
    q = $(this).val(); // Get the search query
    var url = $('#url').val();
    page = 1

    $.ajax({
      url,
      method: 'GET',
      data: { q, page, limit },
      success: function (data) {
        console.log(data);
        $('#myTable #tableBody').html(data)
        setupModal();

      }
    });
  });
})



$(document).ready(function () {
  // Select the new password and confirm password fields
  var newPassword = $('#new-password');
  var confirmPassword = $('#confirm-password');

  $('#send').css('display', 'none');

  $('form').on('submit', function (e) {
    // validation code here
    if (!valid) {
      e.preventDefault();
    }
  });
  // Define a function to check if the passwords match
  function checkPasswords() {
    console.log(newPassword.val());
    if (newPassword.val() !== confirmPassword.val()) {

      confirmPassword.cust
      $('#error').html('Passwords do not match').addClass('notification is-danger');
      $('#send').css('display', 'none');

    } else {
      $('#error').html('').removeClass('notification is-danger');
      $('#send').css('display', 'block');
    }
  }

  // Trigger the checkPasswords function on keyup
  // newPassword.on('keyup', checkPasswords);
  confirmPassword.on('keyup', checkPasswords);
});
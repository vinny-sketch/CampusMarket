document.addEventListener("DOMContentLoaded", () => {
    setupCatalog();
    setupRegistrationForm();
});

function setupCatalog() {
    const productList = document.getElementById("productList");

    if (!productList) {
        return;
    }

    const products = Array.from(document.querySelectorAll(".product-card"));
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const filterMessage = document.getElementById("filterMessage");
    const noResults = document.getElementById("noResults");

    function filterProducts() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const selectedCategory = categoryFilter.value;
        let visibleProducts = 0;

        // Loop through every product and decide whether it should be visible.
        products.forEach((product) => {
            const name = product.dataset.name.toLowerCase();
            const category = product.dataset.category;

            const matchesSearch = name.includes(searchTerm);
            const matchesCategory =
                selectedCategory === "all" || category === selectedCategory;

            // if / else decision required by the assignment
            if (matchesSearch && matchesCategory) {
                product.hidden = false;
                visibleProducts++;
            } else {
                product.hidden = true;
            }
        });

        if (visibleProducts === 0) {
            noResults.hidden = false;
            filterMessage.textContent = "0 products found.";
        } else {
            noResults.hidden = true;
            filterMessage.textContent =
                `${visibleProducts} product${visibleProducts === 1 ? "" : "s"} shown.`;
        }
    }

    // Filtering updates immediately without reloading the page.
    searchInput.addEventListener("input", filterProducts);
    categoryFilter.addEventListener("change", filterProducts);

    // Live quantity calculations.
    const quantityInputs = document.querySelectorAll(".quantity-input");

    quantityInputs.forEach((input) => {
        input.addEventListener("input", () => {
            let quantity = Number(input.value);

            if (!Number.isFinite(quantity) || quantity < 0) {
                quantity = 0;
                input.value = 0;
            }

            const totalElement =
                input.closest(".product-body").querySelector(".product-total");
            const price = Number(totalElement.dataset.price);
            const total = quantity * price;

            totalElement.textContent = `KSh ${total.toLocaleString("en-KE")}`;
        });
    });

    filterProducts();
}

function setupRegistrationForm() {
    const form = document.getElementById("registrationForm");

    if (!form) {
        return;
    }

    const nameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const termsInput = document.getElementById("terms");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const termsError = document.getElementById("termsError");
    const formMessage = document.getElementById("formMessage");
    const togglePassword = document.getElementById("togglePassword");

    // Interactive show/hide password toggle.
    togglePassword.addEventListener("click", () => {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.textContent = "Hide";
        } else {
            passwordInput.type = "password";
            togglePassword.textContent = "Show";
        }
    });

    // Live message based on user input.
    passwordInput.addEventListener("input", () => {
        if (passwordInput.value.length === 0) {
            passwordError.textContent = "";
        } else if (passwordInput.value.length < 8) {
            passwordError.textContent = "Password must contain at least 8 characters.";
        } else {
            passwordError.textContent = "";
        }
    });

    form.addEventListener("submit", (event) => {
        // Prevent the browser from submitting/reloading before validation.
        event.preventDefault();

        clearErrors();

        let isValid = true;

        // 1. Required-field validation.
        if (nameInput.value.trim() === "") {
            nameError.textContent = "Full name is required.";
            isValid = false;
        }

        // 2. Format validation.
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailInput.value.trim() === "") {
            emailError.textContent = "Email address is required.";
            isValid = false;
        } else if (!emailPattern.test(emailInput.value.trim())) {
            emailError.textContent = "Enter a valid-looking email address.";
            isValid = false;
        }

        // Password is also required and has a minimum-length rule.
        if (passwordInput.value === "") {
            passwordError.textContent = "Password is required.";
            isValid = false;
        } else if (passwordInput.value.length < 8) {
            passwordError.textContent = "Password must contain at least 8 characters.";
            isValid = false;
        }

        // 3. Custom validation rule: passwords must match.
        if (confirmPasswordInput.value === "") {
            confirmPasswordError.textContent = "Please confirm your password.";
            isValid = false;
        } else if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordError.textContent = "Passwords do not match.";
            isValid = false;
        }

        if (!termsInput.checked) {
            termsError.textContent = "You must agree to the terms.";
            isValid = false;
        }

        if (!isValid) {
            formMessage.textContent =
                "Please correct the highlighted fields before continuing.";
            formMessage.className = "form-message error";
            return;
        }

        formMessage.textContent =
            "Registration details are valid. Your account is ready for the next stage.";
        formMessage.className = "form-message success";

        // No backend exists yet; Week 1-3 is client-side work only.
        form.reset();
        passwordError.textContent = "";
    });

    function clearErrors() {
        nameError.textContent = "";
        emailError.textContent = "";
        passwordError.textContent = "";
        confirmPasswordError.textContent = "";
        termsError.textContent = "";
        formMessage.textContent = "";
        formMessage.className = "form-message";
    }
}

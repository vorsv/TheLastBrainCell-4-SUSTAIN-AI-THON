


document.addEventListener("DOMContentLoaded", () => {
    // References to DOM Elements
    const prevBtn = document.querySelector("#prev");
    const nextBtn = document.querySelector("#nex");
    const book = document.querySelector("#book");
    const papers = [document.querySelector("#p1"), document.querySelector("#p2"), document.querySelector("#p3")];
    const textareas = document.querySelectorAll("textarea");

    const pan1 = document.querySelector(".pan1"); // pan1 div to show previous entry

    let currentLocation = 1;
    const numOfPapers = papers.length;
    const maxLocation = numOfPapers + 1;
    let entries = []; // Store entries to show in pan1

    // Event Listeners
    prevBtn.addEventListener("click", goPrevPage);
    nextBtn.addEventListener("click", goNextPage);

    // Submit Button
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Submit";
    submitBtn.id = "submitBtn";
    submitBtn.style.position = "absolute";
    submitBtn.style.left = "95%";
    submitBtn.style.top = "90%";
    submitBtn.style.transform = "translate(-50%, -50%)";
    submitBtn.style.padding = "10px 20px";
    submitBtn.style.fontSize = "16px";
    submitBtn.style.backgroundColor = "maroon";
    submitBtn.style.color = "white";
    submitBtn.style.border = "none";
    submitBtn.style.borderRadius = "5px";
    submitBtn.style.cursor = "pointer";
    document.body.appendChild(submitBtn);

    // Event Listener for the submit button
    submitBtn.addEventListener("click", saveData);

    // Open the book
    function openBook() {
        book.style.transform = "translateX(50%)";
        prevBtn.style.transform = "translateX(-180px)";
        nextBtn.style.transform = "translateX(180px)";
    }

    // Close the book
    function closeBook(isAtBeginning) {
        if (isAtBeginning) {
            book.style.transform = "translateX(0%)";
        } else {
            book.style.transform = "translateX(100%)";
        }

        prevBtn.style.transform = "translateX(0px)";
        nextBtn.style.transform = "translateX(0px)";
    }

    // Go to the next page
    function goNextPage() {
        if (currentLocation < maxLocation) {
            switch (currentLocation) {
                case 1:
                    openBook();
                    papers[0].classList.add("flipped");
                    papers[0].style.zIndex = 1;
                    break;
                case 2:
                    papers[1].classList.add("flipped");
                    papers[1].style.zIndex = 2;
                    break;
                case 3:
                    papers[2].classList.add("flipped");
                    papers[2].style.zIndex = 3;
                    closeBook(false);
                    break;
                default:
                    throw new Error("Unknown state");
            }
            currentLocation++;
        }
    }

    // Go to the previous page
    function goPrevPage() {
        if (currentLocation > 1) {
            switch (currentLocation) {
                case 2:
                    closeBook(true);
                    papers[0].classList.remove("flipped");
                    papers[0].style.zIndex = 3;
                    break;
                case 3:
                    papers[1].classList.remove("flipped");
                    papers[1].style.zIndex = 2;
                    break;
                case 4:
                    openBook();
                    papers[2].classList.remove("flipped");
                    papers[2].style.zIndex = 1;
                    break;
                default:
                    throw new Error("Unknown state");
            }
            currentLocation--;
        }
    }

    // Save Data
    function saveData() {
        let allContent = "";
        textareas.forEach((textarea) => {
            allContent += textarea.value + " ";
        });
    
        const entry = {
            id: `entry-${Date.now()}`,
            date: new Date().toLocaleString(),
            content: allContent.trim()
        };
    
        entries.push(entry);
        localStorage.setItem("entries", JSON.stringify(entries));
    
        createEntryDiv(entries.length, entry);
    
        textareas.forEach(textarea => textarea.value = "");
    }

    // Create a new div for each entry
    function createEntryDiv(index, entry) {
        const entryDiv = document.createElement("div");
        entryDiv.className = "pan1";
        entryDiv.innerHTML = `
            <strong>${entry.date}</strong><br>
            ${entry.content}
        `;
    
        const container = document.querySelector(".entries-container");
        container.appendChild(entryDiv);
    }

    // Auto-switch when a textarea reaches its limit
    textareas.forEach((textarea, index) => {
        textarea.addEventListener("input", () => {
            const maxLength = textarea.getAttribute("maxlength");
            if (textarea.value.length >= maxLength) {
                if (index % 2 === 0) {
                    if (currentLocation <= numOfPapers) {
                        goNextPage();
                        textareas[index + 1].focus();
                    }
                } else {
                    if (index + 1 < textareas.length) {
                        textareas[index + 1].focus();
                    }
                }
            }
        });
    });

    // Form to add entries manually
    const form = document.createElement("form");
    const input = document.createElement("input");
    const submitButton = document.createElement("button");
    let entryCount = 0;

    input.type = "text";
    input.placeholder = "Enter new entry";
    input.required = true;
    input.style.marginRight = "10px";

    submitButton.type = "submit";
    submitButton.textContent = "Submit";

    form.appendChild(input);
    form.appendChild(submitButton);
    document.body.insertBefore(form, pan1);

    // Retrieve existing entries from localStorage
    const savedEntries = JSON.parse(localStorage.getItem("entries")) || [];

    // Add existing entries to the UI
    savedEntries.forEach((entry, index) => createEntryDiv(index, entry));

    // Add new entry when the form is submitted
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const content = input.value.trim();
        if (content) {
            const entry = {
                id: `entry-${Date.now()}`,
                content: content,
            };

            savedEntries.push(entry);
            localStorage.setItem("entries", JSON.stringify(savedEntries));

            createEntryDiv(entryCount, entry);

            entryCount++;

            input.value = "";
        }
    });
});

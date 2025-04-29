document.addEventListener("DOMContentLoaded", () => {
    // References to DOM Elements
    const prevBtn = document.querySelector("#prev");
    const nextBtn = document.querySelector("#nex");
    const book = document.querySelector("#book");
    const papers = [document.querySelector("#p1"), document.querySelector("#p2"), document.querySelector("#p3")];
    const textareas = document.querySelectorAll("textarea");
    const entriesContainer = document.createElement("div");
    entriesContainer.className = "entries-container";
    document.body.appendChild(entriesContainer); // Ensure the container is present in the DOM

    let currentLocation = 1;
    const numOfPapers = papers.length;
    const maxLocation = numOfPapers + 1;
    let entries = []; // Store entries to show in entriesContainer

    // Event Listeners for Navigation
    prevBtn.addEventListener("click", goPrevPage);
    nextBtn.addEventListener("click", goNextPage);

    // Submit Button
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Submit";
    submitBtn.id = "submitBtn";
    Object.assign(submitBtn.style, {
        position: "absolute",
        left: "7%",
        top: "90%",
        transform: "translate(-50%, -50%)",
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "maroon",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    });
    document.body.appendChild(submitBtn);

    // Event Listener for Submit Button
    submitBtn.addEventListener("click", saveData);

    // Open the book
    function openBook() {
        book.style.transform = "translateX(50%)";
        prevBtn.style.transform = "translateX(-180px)";
        nextBtn.style.transform = "translateX(180px)";
    }

    // Close the book
    function closeBook(isAtBeginning) {
        book.style.transform = isAtBeginning ? "translateX(0%)" : "translateX(100%)";
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
            }
            currentLocation--;
        }
    }

    function APIcall() {
        let allContent = "";
        textareas.forEach((textarea) => {
            allContent += textarea.value + " ";
        });
        fetch(`/CallTheGem?prompt=${encodeURIComponent(allContent)}`)
            .then(response => response.text())
            .then(data => {
                document.getElementById('t2').innerText = data;
            });
    }

    // Save Data
    function saveData() {
        let allContent = "";
        textareas.forEach((textarea) => {
            allContent += textarea.value + " ";
        });

        let scoreLocal = 0;

        fetch(`/classify?Feed=${encodeURIComponent(allContent)}`)
          .then(response => response.text())
          .then(data => {
            scoreLocal = data; // Update scoreLocal with the fetched value
            
            // Create the entry object after scoreLocal is updated
            const entry = {
              id: `entry-${Date.now()}`,
              date: new Date().toLocaleString(),
              content: allContent.trim(),
              Score: scoreLocal
            };

        entries.push(entry);
        localStorage.setItem("entries", JSON.stringify(entries));

        createEntryDiv(entries.length - 1, entry);
        textareas.forEach(textarea => (textarea.value = ""));
    });
    }

    // Create a new div for each entry
    function createEntryDiv(index, entry) {
        const entryDiv = document.createElement("div");
        entryDiv.className = "pan1";
        entryDiv.innerHTML = `
            <strong>${entry.date}</strong><br>
            ${entry.content}<br>
            Score:${entry.Score}
        `;

        const container = document.querySelector(".entries-container");
        container.appendChild(entryDiv);
    }

    // Auto-switch when a textarea reaches its limit
    textareas.forEach((textarea, index) => {
        textarea.addEventListener("input", () => {
            const maxLength = textarea.getAttribute("maxlength");
            if (textarea.value.length >= maxLength) {
                if (index % 2 === 0 && currentLocation <= numOfPapers) {
                    goNextPage();
                    textareas[index + 1]?.focus();
                } else {
                    textareas[index + 1]?.focus();
                }
            }
        });
    });

    // Form to add entries manually
    const form = document.createElement("form");
    const input = document.createElement("input");
    const submitButton = document.createElement("button");

    input.type = "text";
    input.placeholder = "Enter new entry";
    input.required = true;
    input.style.marginRight = "10px";

    submitButton.type = "submit";
    

    form.append(input, submitButton);
    document.body.insertBefore(form, entriesContainer); // Correctly inserting the form

    // Retrieve existing entries from localStorage
    const savedEntries = JSON.parse(localStorage.getItem("entries")) || [];
    savedEntries.forEach((entry, index) => createEntryDiv(index, entry));

    // Add new entry when the form is submitted
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = input.value.trim();
        if (content) {
            const entry = {
                id: `entry-${Date.now()}`,
                content: content
            };

            savedEntries.push(entry);
            localStorage.setItem("entries", JSON.stringify(savedEntries));

            createEntryDiv(savedEntries.length - 1, entry);
            input.value = "";
        }
    });
});


// ================================
// Bill Reminder Pro
// ================================

// ---------- Form ----------

const billForm = document.getElementById("billForm");

const title = document.getElementById("title");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");
const status = document.getElementById("status");

// ---------- Dashboard ----------

const totalBills = document.getElementById("totalBills");
const pendingBills = document.getElementById("pendingBills");
const paidBills = document.getElementById("paidBills");

// ---------- Search ----------

const search = document.getElementById("search");
const filter = document.getElementById("filter");

// ---------- List ----------

const billList = document.getElementById("billList");

// ---------- Theme ----------

const themeBtn = document.getElementById("themeBtn");

// ---------- Edit ----------

const editModal = document.getElementById("editModal");

const editId = document.getElementById("editId");
const editTitle = document.getElementById("editTitle");
const editAmount = document.getElementById("editAmount");
const editCategory = document.getElementById("editCategory");
const editDate = document.getElementById("editDate");
const editStatus = document.getElementById("editStatus");

const updateBtn = document.getElementById("updateBtn");
const cancelBtn = document.getElementById("cancelBtn");

// ================================
// Local Storage
// ================================

let bills =
JSON.parse(localStorage.getItem("bills")) || [];

// ================================
// Save Bills
// ================================

function saveBills(){

localStorage.setItem(

"bills",

JSON.stringify(bills)

);

renderBills();

}

// ================================
// Add Reminder
// ================================

billForm.addEventListener("submit",function(e){

e.preventDefault();

const bill={

id:Date.now(),

title:title.value,

amount:amount.value,

category:category.value,

date:date.value,

status:status.value

};

bills.push(bill);

saveBills();

billForm.reset();

});

// ================================
// Start
// ================================

renderBills();
// ================================
// Display Bills
// ================================

function renderBills(){

    billList.innerHTML = "";

    let total = 0;
    let pending = 0;
    let paid = 0;

    let searchText = search.value.toLowerCase();
    let filterValue = filter.value;

    if(bills.length === 0){

        billList.innerHTML =
        "<p class='empty'>No reminders added.</p>";

    }

    bills.forEach(function(bill){

        // Search

        if(!bill.title.toLowerCase().includes(searchText))
            return;

        // Filter

        if(filterValue !== "all" &&
           bill.status !== filterValue)
            return;

        total++;

        if(bill.status === "Pending")
            pending++;
        else
            paid++;

        // ---------- Overdue ----------

        let today = new Date();
        today.setHours(0,0,0,0);

        let due = new Date(bill.date);
        due.setHours(0,0,0,0);

        let cardClass = "upcoming";

        if(bill.status === "Pending"){

            if(due < today){

                cardClass = "overdue";

            }
            else if(due.getTime() === today.getTime()){

                cardClass = "today";

            }

        }

        // ---------- Card ----------

        billList.innerHTML += `

        <div class="bill ${cardClass}">

            <div>

                <h3>${bill.title}</h3>

                <small>

                    ${bill.category}
                    |
                    ₹${bill.amount}
                    |
                    ${bill.date}

                </small>

            </div>

            <div class="actions">

                <button
                class="${bill.status==="Paid"
                ?"paidStatus":"statusBtn"}"

                onclick="toggleStatus(${bill.id})">

                ${bill.status}

                </button>

                <button
                class="editBtn"
                onclick="editBill(${bill.id})">

                Edit

                </button>

                <button
                class="deleteBtn"
                onclick="deleteBill(${bill.id})">

                Delete

                </button>

            </div>

        </div>

        `;

    });

    totalBills.textContent = total;
    pendingBills.textContent = pending;
    paidBills.textContent = paid;

}
// ================================
// Delete Reminder
// ================================

function deleteBill(id){

    if(confirm("Are you sure you want to delete this reminder?")){

        bills = bills.filter(function(bill){

            return bill.id !== id;

        });

        saveBills();

    }

}

// ================================
// Change Status
// ================================

function toggleStatus(id){

    bills.forEach(function(bill){

        if(bill.id === id){

            if(bill.status === "Pending"){

                bill.status = "Paid";

            }else{

                bill.status = "Pending";

            }

        }

    });

    saveBills();

}

// ================================
// Open Edit Modal
// ================================

function editBill(id){

    const bill = bills.find(function(item){

        return item.id === id;

    });

    if(!bill) return;

    editId.value = bill.id;

    editTitle.value = bill.title;

    editAmount.value = bill.amount;

    editCategory.value = bill.category;

    editDate.value = bill.date;

    editStatus.value = bill.status;

    editModal.style.display = "block";

}

// ================================
// Update Reminder
// ================================

updateBtn.addEventListener("click",function(){

    const id = Number(editId.value);

    bills.forEach(function(bill){

        if(bill.id === id){

            bill.title = editTitle.value;

            bill.amount = editAmount.value;

            bill.category = editCategory.value;

            bill.date = editDate.value;

            bill.status = editStatus.value;

        }

    });

    editModal.style.display = "none";

    saveBills();

});

// ================================
// Cancel Edit
// ================================

cancelBtn.addEventListener("click",function(){

    editModal.style.display = "none";

});

// Close popup when clicking outside

window.addEventListener("click",function(e){

    if(e.target === editModal){

        editModal.style.display = "none";

    }

});
// ================================
// Search
// ================================

search.addEventListener("input", function () {

    renderBills();

});

// ================================
// Filter
// ================================

filter.addEventListener("change", function () {

    renderBills();

});

// ================================
// Dark Mode
// ================================

// Load saved theme

let savedTheme = localStorage.getItem("theme");

if(savedTheme === "dark"){

    document.body.classList.add("dark");

    themeBtn.textContent = "☀ Light Mode";

}

// Toggle theme

themeBtn.addEventListener("click", function(){

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        themeBtn.textContent = "☀ Light Mode";

    }
    else{

        localStorage.setItem("theme","light");

        themeBtn.textContent = "🌙 Dark Mode";

    }

});

// ================================
// Initial Load
// ================================

renderBills();
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

var table = document.getElementById("calendar-table");
var monthSelection = document.getElementById("month");
var yearInput = document.getElementById("year");
var dateInput = document.getElementById("date");
var csvInput = document.getElementById("csv");


// calculate how many days has specific month
function monthDays(m, y) {
    if ([0,2,4,6,7,9,11].includes(m)) {
        return 31;
    }
    else if ([3,5,8,10].includes(m)) {
        return 30;
    }
    else if (m == 1) {
        if (y % 4 == 0) {
            return 29;
        } else {
            return 28;
        }
    }
    return 0;
}

// calculate with which weekday starts the month
function monthOffset(m, y) {
    let first = new Date(y, m, 1);
    return (first.getDay() + 6) % 7;
}

// add table cells for each day in a month
function makeCalendar(d, m, y) {
    console.log("view:", d, m+1, y);
    
    // remove previous view
    while (table.firstChild) {
        table.removeChild(table.lastChild);
    }

    let thisMonthDays = monthDays(m, y);
    let lastMonthDays = monthDays(m-1, y);
    if (m == 0) lastMonthDays = monthDays(11, y-1);

    let offset = monthOffset(m, y);
    let numRows = Math.ceil((thisMonthDays + offset) / 7);

    for (let week = 1; week <= numRows; week++) {
        let row = document.createElement("tr");
        
        for (let weekday = 1; weekday <= 7; weekday++) {
            let cell = document.createElement("td");
            let index = (week-1)*7 + weekday;

            if (index > offset && index - offset <= thisMonthDays) {
                cell.innerHTML = index - offset;
                cell.classList.add("current-month");
            } else if (index <= offset){
                cell.innerHTML = index - offset + lastMonthDays;
            } else {
                cell.innerHTML = index - offset - thisMonthDays;
            }
            if (weekday == 7) {
                cell.classList.add("sunday");
            }

            cell.classList.add("calendar-cell");
            row.append(cell);
        }
        
        table.appendChild(row);
    }

    readHolidays();
}

// store current date in local storage
function setDateToday() {
    var today = new Date();
    localStorage.setItem("d", today.getDate());
    localStorage.setItem("m", today.getMonth());
    localStorage.setItem("y", today.getFullYear());

    makeCalendar(today.getDate(), today.getMonth(), today.getFullYear());
    
    monthSelection.value = monthNames[today.getMonth()];
    yearInput.placeholder = today.getFullYear();
    dateInput.value = today.toISOString().slice(0,10);
}

// set view for selected month
function setMonth(name) {
    let d = Number(localStorage.getItem("d"));
    let y = Number(localStorage.getItem("y"));

    console.log(name);
    monthSelection.value = name;
    let m = monthNames.indexOf(name);
    if (m < 10) m = "0" + m;
    dateInput.value = dateInput.value.slice(0, 5) + m + dateInput.value.slice(7);

    let monthId = monthNames.indexOf(name);
    localStorage.setItem("m", monthId);
    makeCalendar(d, monthId, y);
}

// set view for selected year
function setYear(year) {
    let d = Number(localStorage.getItem("d"));
    let m = Number(localStorage.getItem("m"));

    console.log(year);
    year = Number(year);
    if (year > 1969 && year < 3000) {
        yearInput.placeholder = year;
        dateInput.value = year + dateInput.value.slice(4);

        localStorage.setItem("y", year);
        makeCalendar(d, m, year);
    }
}

// set view for selected date
function setDate(date) {
    console.log(date);
    let d = Number(date.slice(8,10));
    let m = Number(date.slice(5,7)) - 1;
    let y = Number(date.slice(0,4));

    localStorage.setItem("d", d);
    localStorage.setItem("m", m);
    localStorage.setItem("y", y);

    monthSelection.value = monthNames[m];
    yearInput.placeholder = y;

    makeCalendar(d, m, y);
}

// add month, year, date choice
function setChoice() {
    let d = localStorage.getItem("d");
    let m = localStorage.getItem("m");
    let y = localStorage.getItem("y");

    monthSelection.addEventListener("change", function(event){setMonth(monthSelection.value)});  
    for (const name of monthNames) {
        let monthObject = document.createElement("option");
        monthObject.value = name;
        monthObject.innerHTML = name;
        monthObject.addEventListener("click", function(event){setMonth(name)});
        monthSelection.appendChild(monthObject);
    }

    // set event listener for year input
    yearInput.addEventListener("change", function(event){setYear(yearInput.value)});

    // set event listener for date input
    dateInput.addEventListener("change", function(event){setDate(dateInput.value)});

    // set event listener for csv input
    csvInput.addEventListener("change", function (event) {readHolidays()});
}


// read input file with holidays
function readHolidays() {
    var reader = new FileReader();
    if (csvInput.files.length > 0) {
        reader.addEventListener('load', function() {
            csvInput.innerText = reader.result;
            markHolidays(reader.result);
        });
        reader.readAsText(csvInput.files[0]);
    } else {
    }
}

// give cells of holidays special class label 
function markHolidays(input) {
    let m = Number(localStorage.getItem("m"));
    let y = Number(localStorage.getItem("y"));
    let rows = document.getElementById("calendar-table").childNodes;

    console.log("mark holidays");
    let lines = input.split("\r\n");

    for(const line of lines) {
        let holiday = line.split(",");
        holiday[0] = holiday[0].split("/");

        if(Number(holiday[0][1]) - 1 == m) {
            if (Number(holiday[0][2]) == y || holiday[2] == 'y') {
                console.log("mark", holiday[1], holiday[0]);
                let index = Number(holiday[0][0]) + monthOffset(m, y) - 1;
                let row = rows[Math.floor(index / 7)];
                let cell = row.childNodes[index % 7];
                cell.classList.add("holiday");
                cell.innerHTML += " " + holiday[1];
            }
        }
    }
}


setChoice();
setDateToday();
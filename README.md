# Simple calendar

This calendar shows days of current month, one week in a row. Sundays are colored in darker shade and holidays have different color. In the row above one can choose specific month, year or day that is shown. There is option to upload a csv file with holidays.

## How to use calendar?

1. Open `index.html` file.
2. Click *file icon* to upload csv file `holidays.csv`.

## Modify date selection

**Default:** Current date.

**Choose month:**
Click name of the month and choose a different month from the dropdown menu to show (year stays the same). 

**Choose year:**
Click the year and type different year to show (month stays the same).

**Choose date:**
Click the *date icon* and choose a date from the menu or type a date to show.

## Input file format

```
dd/mm/yyyy,holiday name,y
```
- *dd/mm/yyyy* is format of holiday's date,
- *holiday name* is replaced with name of the holiday,
- *y* is added if holiday repeats every year.

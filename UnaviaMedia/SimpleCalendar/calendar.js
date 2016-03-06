/*
 * Project: calendar.html
 * Purpose: Create a calendar application that can store events
 *
 * Revision History:
 * 		Kendall Roth	Sep-14-2015:	Created
 * 						Sep-15-2015:	CSS functionality extended, classes renamed
 * 										Month implementation added
 * 						Sep-17-2015:	Day numbering added
 * 						Sep-30-2015:	Switched over to using as a inplace calendar
 * 						Oct-01-2015:	Switched over to inserting the HTML through JavaScript
 * 										Removed all unneeded functionality
 * 
 */

/*
Where variables/parameters "month" and "day" are mentioned, they are mentioned in context of an array.
Therefore, the numbering system is like an array, from "0" to "11" for months, and "0" to "30" for days.
 */


/**
 * Inserts the calendar to the page at the specified script location
 */
function Calendar()
{
	var calendarHTML = '<div class="calendar-container"><div class="calendar-header"><span class="calendar-previous-month"><img src="previous-button.png" width=25"></span><span class="calendar-current-month-container" title="Today"><span class="calendar-current-month">Month</span>&ensp;<span class="calendar-current-year">Year</span></span><span class="calendar-next-month"><img src="next-button.png" width=25"></span></div><div class="calendar-days"><table><thead><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr></thead><tbody><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table></div></div>';

	//Output the calendar to the page
	document.write(calendarHTML);
}

$(document).ready(function(){
	//Set the height of the days and the month selection buttons
	setDayHeight();
	setMonthButtonSize();

	//Create an array of the months of the year (Zero-based to correspond with DateTime returns)
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	//Create an array of the table cells (days of month)
	var calendarDaysArray = $('.calendar-days td').toArray();

	//Store the current date, and each part
	var	currentDate = new Date();
	var currentYear = currentDate.getFullYear();
	var currentMonth = currentDate.getMonth();
	var currentDay = currentDate.getDate();
	var currentDayOfWeek = currentDate.getDay();

	//DEBUG Functionality (Zero-based, remember)
	//currentYear = 2015;
	//currentMonth = 6;
	//currentDay = 2;

	//Store the user selected date, and each part
	var selectedYear = currentYear;
	var selectedMonth = currentMonth;

	calendarToday();

	/**********************************************************************************************/
	/**********************************************************************************************/
	/* Date functions */

	/**
	 * Updates the calendar to reflect the current date
	 */
	function calendarToday()
	{
		selectedMonth = currentMonth;
		selectedYear = currentYear;

		calendarUpdate();
	}

	/**
	 * Updates the calendar to reflect the selected date
	 */
	function calendarUpdate()
	{
		//Update the Calendar Month and Year
		calendarUpdateHeader(selectedMonth, selectedYear);

		//Get the first day of the current month
		//	(0-6, representing the day of first week that the current month starts on)
		var firstDayOfMonth = calendarGetFirstDayOfMonth(selectedMonth, selectedYear);

		//Get the number of days in the current month
		//	(28-31)
		var daysInMonth = calendarGetDaysInMonth(selectedMonth, selectedYear);

		//Get the last day of the current month
		//	(0-30, represnting the last index in the days array that belongs to the current month)
		var lastDayOfMonth = firstDayOfMonth + daysInMonth - 1;

		//Get the number of days in the last month, which will be used for the last month day-numbering
		//	(28-31)
		var daysInLastMonth = calendarGetDaysInMonth(selectedMonth - 1, selectedYear);

		//Get the last day of the week of last month
		//	(0-6, representing the day of the week that the last month ended on)
		var lastDayOfLastMonth = firstDayOfMonth - 1;
		
		//Counters for the various months/partials displayed
		var lastMonthDayCounter = daysInLastMonth - (lastDayOfLastMonth + 1);
		var currentMonthDayCounter = 0;
		var nextMonthDayCounter = 0;

		//Counters for the days in the next/previous months that are displayed on the calendar
		var daysInNextMonthDisplayed = 0;
		var daysInLastMonthDisplayed = 0;

		//Loop over each day, and determine whether or not it belongs to the current month
		for (var i = 0; i < 42; i++)
		{
			//Style the background of the day according to whether or not it belongs to the selected month
			if (i >= firstDayOfMonth && i <= lastDayOfMonth)
			{
				$(calendarDaysArray[i]).removeClass().addClass('current-month');
				$(calendarDaysArray[i]).text(++currentMonthDayCounter);
			}
			else
			{
				$(calendarDaysArray[i]).removeClass().addClass('not-current-month');

				if(i < firstDayOfMonth)
				{
					$(calendarDaysArray[i]).text(++lastMonthDayCounter);
					daysInLastMonthDisplayed ++;
				}
				else if(i > lastDayOfMonth)
				{
					$(calendarDaysArray[i]).text(++nextMonthDayCounter);
					daysInNextMonthDisplayed ++;
				}
			}
		}

		//If the next/previous month is displayed, select the current date if it is still showing
		if (selectedMonth == currentMonth - 1 && selectedYear == currentYear)
		{
			if (currentDay <= daysInNextMonthDisplayed)
			{
				$(calendarDaysArray[lastDayOfMonth + currentDay]).addClass('today-other-month');
			}
		}
		else if (selectedMonth == currentMonth + 1)
		{
			if (daysInLastMonth - currentDay - 1 >= 0)
			{
				$(calendarDaysArray[daysInLastMonthDisplayed - 1 - (daysInLastMonth - currentDay - 1)]).addClass('today-other-month');
			}
		}
		else if (selectedMonth == currentMonth && selectedYear == currentYear)
		{
			//Highlight the current day in the calendar
			$(calendarDaysArray[firstDayOfMonth + currentDay - 1]).addClass('today');
		}

		/*$('.debug1').text('currentDayOfWeek - ' + currentDayOfWeek);
		$('.debug2').text('firstDayOfMonth - ' + firstDayOfMonth);
		$('.debug3').text('daysInMonth - ' + daysInMonth);
		$('.debug4').text('lastDayOfMonth - ' + lastDayOfMonth);
		$('.debug5').text('daysInLastMonth - ' + daysInLastMonth);
		$('.debug6').text('lastDayOfLastMonth - ' + lastDayOfLastMonth);
		$('.debug7').text('lastMonthDayCounter - ' + lastMonthDayCounter);
		$('.debug8').text('currentMonthDayCounter - ' + currentMonthDayCounter);
		$('.debug9').text('nextMonthDayCounter - ' + nextMonthDayCounter);*/
	}

	/**
	 * Update the calendar header to reflect the selected month and year
	 * @param  {int} month Integer that represents the month to be displayed
	 * @param  {int} year  Integer that represents the year to be displayed
	 */
	function calendarUpdateHeader(month, year)
	{
		$('.calendar-current-month').text(months[month]);
		$('.calendar-current-year').text(year);
	}

	/**
	 * Moves the calendar to display the next month
	 */
	function calendarNextMonth()
	{
		//If the next month is in the next year, reset the month to January and increment the year
		if(!(selectedMonth == 11 && selectedYear >= currentYear + 1))
		{
			if (selectedMonth == 11)
			{
				selectedMonth = 0;
				selectedYear++;
			}
			else
			{
				selectedMonth++;
			}

			//Update the calendar to reflect the new month
			calendarUpdate();
		}
	}


	/**
	 * Moves the calendar to display the previous month
	 */
	function calendarPreviousMonth()
	{
		//If the previous month is in the previous year, reset the month to December and decrement the year
		if (!(selectedMonth === 0 && selectedYear <= currentYear - 1))
		{
			if (selectedMonth === 0)
			{
				selectedMonth = 11;
				selectedYear--;
			}
			else
			{
				selectedMonth--;
			}

			//Update the calendar to reflect the new month
			calendarUpdate();
		}		
	}

	/**
	 * Returns the zero-based day of the week of the first day of the specified month and year
	 * @param  {int} year  Integer that represents the month portion of the input date
	 * @param  {int} month Integer that represents the year portion of the input date
	 * @return {int}       Integer that represents the zero-based day of the week of the first day of the input month/year
	 */
	function calendarGetFirstDayOfMonth(month, year)
	{
		var date = new Date(year, month, 1);
		return date.getDay();
	}

	/**
	 * Returns the number of days in the specified month and year
	 * @param  {int} month Integer that represents the month portion of the input date
	 * @param  {int} year  Integer that represents the year portion of the input date
	 * @return {int}       Integer that represents the number of days in the specified month and year
	 */
	function calendarGetDaysInMonth(month, year)
	{
		return new Date(year, month + 1, 0).getDate();
	}


	/**********************************************************************************************/
	/* Click EVENTS */
	$('.calendar-previous-month').click(calendarPreviousMonth);
	$('.calendar-next-month').click(calendarNextMonth);
	$('.calendar-current-month-container').click(calendarToday);
});

//When the window resizes, reset the height of the days and month selector buttons
$(window).resize(function()
{
	setDayHeight();
	setMonthButtonSize();
});

/**
 * Updates the height of the table cells to match their width
 */
function setDayHeight()
{
	var calendarDayWidth = $('.calendar-days td').width();
	$('.calendar-days td').css('height', calendarDayWidth);
}

/**
 * Updates the height and width of the month selector buttons to match the calendar header
 */
function setMonthButtonSize()
{
	var calendarHeaderHeight = $('.calendar-header').height();
	$('.calendar-previous-month').width(calendarHeaderHeight);	
	$('.calendar-previous-month').height(calendarHeaderHeight);
	$('.calendar-next-month').width(calendarHeaderHeight);
	$('.calendar-next-month').height(calendarHeaderHeight);
}

(function(){
	var parse = Date.parse;
	/**
	 * @class MVC.Native.Date
	 * @alias MVC.Date
	 * Adds Date helpers for dates.
	 * <h3>Install</h3>
	 * @code_start
	 * include.plugins('lang/date')
	 * @code_end
	 */
    MVC.Native.extend('Date', {
        /**
         * @plugin lang/date
         * @param {Object} date
         * @param {Object} number_of_days
         */
		add_days: function(date, number_of_days) {
			date.setDate(date.getDate() + number_of_days);
			return date;
		},
        /**
         * @plugin lang/date
         * @param {Object} date
         * @param {Object} number_of_weeks
         */
		add_weeks: function(date, number_of_weeks) {
			return MVC.Date.add_days(date, number_of_weeks * 7);
		},
        /**
         * @plugin lang/date
         * @param {Object} date
         */
		day_name: function(date) {
			return MVC.Date.day_names[date.getDay()];
		},
        /**
         * @plugin lang/date
         * @param {Object} date
         */
		first_day_of_week: function(date) {
			var first_day = new Date(date);
			first_day.setDate(date.getDate() - date.getDay());
			return first_day;
		},
        /**
         * @plugin lang/date
         * @param {Object} date
         */
		month_name: function(date) {
			return MVC.Date.month_names[date.getMonth()];
		},
        /**
         * @plugin lang/date
         * @param {Object} date
         */
		number_of_days_in_month : function(date) {
		    var year = date.getFullYear(),month = date.getMonth(),m = [31,28,31,30,31,30,31,31,30,31,30,31];
		    if (month != 1) return m[month];
		    if (year%4 != 0 || (year%100 == 0 && year%400 != 0)) return m[1];
		    return m[1] + 1;
		},
        /**
         * @plugin lang/date
         */
		day_names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        /**
         */
		month_names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		/**
		 * @param {Object} data
		 */
        parse: function(data) {
			if(typeof data != "string") return null;
			var f1 = /\d{4}-\d{1,2}-\d{1,2}/, f2 = /\d{4}\/\d{1,2}\/\d{1,2}/, f3 = /(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})\s(\d{1,2}):(\d{1,2}):(\d{1,2})/;
			var match_data;
			if((match_data =  data.match(f3) ) ) {
				return new Date( Date.UTC(parseInt(match_data[1], 10), (parseInt(match_data[2], 10)-1), parseInt(match_data[3], 10),
					parseInt(match_data[4], 10), parseInt(match_data[5], 10), parseInt(match_data[6], 10)) );
			}
			if(data.match(f1)) {
				var dateArr = data.match(f1)[0].split('-');
				return new Date( Date.UTC(parseInt(dateArr[0], 10), (parseInt(dateArr[1], 10)-1), parseInt(dateArr[2], 10)) );
			}
			if(data.match(f2)) {
				var dateArr = data.match(f2)[0].split('/');
				return new Date( Date.UTC(parseInt(dateArr[0], 10), (parseInt(dateArr[1], 10)-1), parseInt(dateArr[2], 10)) );
			}
			return parse(data);
		}
	});
})();
MVC.Native.Date = MVC.Date
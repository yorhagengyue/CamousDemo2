import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2030, 4, 1)); // May 2030
  const [viewMode, setViewMode] = useState<'Month' | 'Week' | 'Day'>('Month');

  const events = [
    { title: 'Big Day and Celebration Day', date: 1, color: 'bg-purple-300/60', time: 'All Day' },
    { title: 'Students Day', date: 2, color: 'bg-blue-300/60', time: '9:00 AM' },
    { title: 'Subject Presentation & Exam', date: 2, color: 'bg-pink-300/60', time: '2:00 PM' },
    { title: 'AP Calculus', date: 2, color: 'bg-yellow-300/60', time: '10:00 AM' },
    { title: 'Fair, Exhibition & Performance', date: 2, color: 'bg-green-300/60', time: '3:00 PM' },
    { title: 'Spring Concert', date: 3, color: 'bg-emerald-300/60', time: '7:00 PM' },
    { title: 'Official Meeting', date: 2, color: 'bg-orange-300/60', time: '11:00 AM' },
    { title: 'Teacher Professional Development', date: 1, color: 'bg-blue-300/60', time: '1:00 PM' },
    { title: 'Science Fair', date: 7, color: 'bg-cyan-300/60', time: '9:00 AM' },
    { title: 'Teacher Meeting', date: 8, color: 'bg-orange-300/60', time: '3:00 PM' },
    { title: 'Science Fair', date: 9, color: 'bg-cyan-300/60', time: '10:00 AM' },
    { title: 'PTA Meeting', date: 10, color: 'bg-yellow-300/60', time: '7:00 PM' },
    { title: 'English Literature Workshop', date: 13, color: 'bg-purple-300/60', time: '2:00 PM' },
    { title: 'Varsity Track Meet', date: 15, color: 'bg-yellow-300/60', time: '4:00 PM' },
    { title: 'Junior Prom', date: 16, color: 'bg-blue-300/60', time: '7:00 PM' },
    { title: 'Drama Club Performance', date: 17, color: 'bg-cyan-300/60', time: '6:00 PM' },
    { title: 'Art Exhibition Opening', date: 22, color: 'bg-purple-300/60', time: '5:00 PM' },
    { title: 'Board of Education Meeting', date: 21, color: 'bg-orange-300/60', time: '9:00 AM' },
    { title: 'PTA Meeting', date: 24, color: 'bg-yellow-300/60', time: '7:00 PM' },
    { title: 'Memorial Day Ceremony', date: 26, color: 'bg-purple-300/60', time: '10:00 AM' },
    { title: 'Sophomore Class Trip', date: 28, color: 'bg-blue-300/60', time: 'All Day' },
    { title: 'Art Fair & Exhibition', date: 29, color: 'bg-cyan-300/60', time: '1:00 PM' },
    { title: 'Last Day of School', date: 30, color: 'bg-green-300/60', time: '3:00 PM' }
  ];

  type DayInfo = {
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
  };

  const getDaysInMonth = (date: Date): DayInfo[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days: DayInfo[] = [];
    
    // Previous month days
    for (let i = firstDayWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i).getDate();
      days.push({ day, isCurrentMonth: false, isToday: false });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === 15; // Highlight 15th as today
      days.push({ day, isCurrentMonth: true, isToday });
    }
    
    // Next month days to fill grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ day, isCurrentMonth: false, isToday: false });
    }
    
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const getEventsForDay = (day: number) => {
    return events.filter(event => event.date === day);
  };

  const todayEvents = [
    { title: 'Science Fair Setup', time: '08:00 am', group: 'Science Club', color: 'bg-blue-300/60' },
    { title: 'Teacher Meeting', time: '10:00 am', group: 'All Teacher', color: 'bg-orange-300/60' },
    { title: 'Varsity Track Meet', time: '01:00 pm', group: 'Track Team', color: 'bg-pink-300/60' },
    { title: 'Parents Meeting', time: '03:00 pm', group: 'All Teacher and Parents', color: 'bg-yellow-300/60' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Calendar</h1>
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            {['Month', 'Week', 'Day'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as 'Month' | 'Week' | 'Day')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                  viewMode === mode
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="sm" variant="outline">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold text-slate-900 dark:text-white min-w-[120px] text-center">
            {monthName}
          </span>
          <Button size="sm" variant="outline">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button size="sm" className="bg-blue-400/80 hover:bg-blue-500/80 text-white border-0">
            Today
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Calendar Grid */}
        <Card className="lg:col-span-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30 shadow-lg">
          <CardContent className="p-6">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 py-3">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((dayObj, index) => {
                const dayEvents = getEventsForDay(dayObj.day);
                return (
                  <div 
                    key={index} 
                    className={`min-h-[120px] p-2 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      dayObj.isCurrentMonth 
                        ? 'bg-white dark:bg-slate-800 border-slate-200/50 dark:border-slate-700/50' 
                        : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <div className={`text-sm font-medium mb-2 ${
                      dayObj.isToday 
                        ? 'w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center' 
                        : dayObj.isCurrentMonth 
                          ? 'text-slate-900 dark:text-white' 
                          : 'text-slate-400'
                    }`}>
                      {dayObj.day}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event, eventIndex) => (
                        <div 
                          key={eventIndex}
                          className={`${event.color} text-white text-xs p-1 rounded text-center font-medium cursor-pointer hover:opacity-80 transition-opacity`}
                        >
                          {event.title.length > 12 ? event.title.substring(0, 12) + '...' : event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-slate-500 text-center">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Agenda Sidebar */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Agenda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Today's Events */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">May, 8 2030</h3>
              <div className="space-y-3">
                {todayEvents.map((event, index) => (
                  <div key={index} className={`p-3 ${event.color} rounded-lg`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-800 text-sm">{event.title}</h4>
                      <span className="text-xs text-slate-700">{event.time}</span>
                    </div>
                    <p className="text-xs text-slate-600">{event.group}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button size="sm" variant="outline" className="w-full justify-start h-10">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-10">
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-10">
                  <Users className="h-4 w-4 mr-2" />
                  View Team Calendar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { CalendarPage as Component };

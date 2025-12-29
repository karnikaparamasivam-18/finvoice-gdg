import { useMemo } from 'react';
import { useAppStore } from '@/store/appStore';
import { t } from '@/utils/translations';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { BottomNavigation } from './BottomNavigation';
import { addWeeks, addMonths, format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isBefore, isAfter, startOfDay } from 'date-fns';

export const MeetingsPage = () => {
  const language = useAppStore((state) => state.language);
  const groupInfo = useAppStore((state) => state.groupInfo);

  const upcomingMeetings = useMemo(() => {
    if (!groupInfo?.firstMeetingDate) return [];

    const firstDate = new Date(groupInfo.firstMeetingDate);
    const meetings: Date[] = [];
    const today = startOfDay(new Date());

    // Generate next 12 meetings
    for (let i = 0; i < 52; i++) {
      let meetingDate: Date;
      if (groupInfo.meetingFrequency === 'weekly') {
        meetingDate = addWeeks(firstDate, i);
      } else {
        meetingDate = addMonths(firstDate, i);
      }

      if (!isBefore(meetingDate, today)) {
        meetings.push(meetingDate);
        if (meetings.length >= 12) break;
      }
    }

    return meetings;
  }, [groupInfo]);

  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);

  const isMeetingDay = (date: Date) => {
    return upcomingMeetings.some(meeting => isSameDay(meeting, date));
  };

  const nextMeeting = upcomingMeetings[0];

  return (
    <><div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t(language, 'meetings')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t(language, 'meetingSchedule')}
            </p>
          </div>
        </div>

        {/* Next Meeting Card */}
        {nextMeeting && (
          <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {t(language, 'nextMeeting')}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {format(nextMeeting, 'EEEE, MMMM d, yyyy')}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {groupInfo?.name}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {groupInfo?.meetingFrequency === 'weekly' ? 'Weekly' : 'Monthly'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Compact Calendar + Legend */}
      <div className="p-2">
        <div className="bg-card rounded-xl border border-border shadow-soft p-2 w-fit mx-auto">
          <h3 className="text-xs font-semibold text-center mb-1">
            {format(currentMonth, 'MMM yyyy')}
          </h3>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-[2px] mb-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
              <div
                key={day}
                className="text-[9px] text-center text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-[2px]">
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={i} className="w-6 h-6" />
            ))}

            {daysInMonth.map((date) => {
              const isToday = isSameDay(date, new Date());
              const isMeeting = isMeetingDay(date);
              const isPast = isBefore(date, startOfDay(new Date()));

              return (
                <div
  key={date.toISOString()}
  className={`
    relative
    w-6 h-6 flex items-center justify-center rounded-md
    text-[10px] font-medium
    ${
      isMeeting
        ? 'bg-primary text-primary-foreground ring-2 ring-primary/60'
        : isToday
        ? 'border-2 border-primary text-primary'
        : isPast
        ? 'text-muted-foreground/40'
        : 'text-foreground'
    }
  `}
>
  {format(date, 'd')}

  {/* Meeting dot */}
  {isMeeting && !isToday && (
    <span className="absolute bottom-[2px] w-1 h-1 bg-primary-foreground rounded-full" />
  )}
</div>

              );
            })}
          </div>
        </div>

        {/* Compact Legend */}
        <div className="flex justify-center gap-4 mt-2 text-[9px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-primary rounded-full" />
            Meeting
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 border border-primary rounded-full" />
            Today
          </div>
        </div>
      </div>

      {/* Upcoming Meetings List */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
          {t(language, 'upcomingMeetings')}
        </h3>

        <div className="space-y-3">
          {upcomingMeetings.slice(0, 6).map((meeting, index) => (
            <div
              key={meeting.toISOString()}
              className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="w-14 h-14 gradient-secondary rounded-xl flex flex-col items-center justify-center">
                <span className="text-xs text-secondary-foreground/80 uppercase">
                  {format(meeting, 'MMM')}
                </span>
                <span className="text-xl font-bold text-secondary-foreground">
                  {format(meeting, 'd')}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">
                  {format(meeting, 'EEEE')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(meeting, 'MMMM d, yyyy')}
                </p>
              </div>
              {index === 0 && (
                <span className="bg-success/10 text-success text-xs font-medium px-2 py-1 rounded-full">
                  Next
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div><BottomNavigation /></>
  );
};

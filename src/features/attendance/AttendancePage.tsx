import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const AttendancePage = () => {
  const [selectedMonth, setSelectedMonth] = useState('April 2024');
  const [selectedWeek, setSelectedWeek] = useState('Week 2-3');
  const [selectedClass, setSelectedClass] = useState('Class 11A');

  const students = [
    { name: 'Lucas Johnson', id: 'LJ-001', attendance: [true, false, true, true, true, null, null, true, true, true, true, true, null, null] },
    { name: 'Emily Peterson', id: 'EP-002', attendance: [true, true, true, true, true, null, null, true, true, false, true, true, null, null] },
    { name: 'Michael Brown', id: 'MB-003', attendance: [true, true, true, false, true, null, null, true, false, true, true, true, null, null] },
    { name: 'Hannah White', id: 'HW-004', attendance: [true, false, true, true, true, null, null, true, true, true, false, true, null, null] },
    { name: 'Oliver Martinez', id: 'OM-005', attendance: [true, true, true, true, true, null, null, true, true, true, true, true, null, null] },
    { name: 'Isabella Garcia', id: 'IG-006', attendance: [true, true, true, true, false, null, null, true, true, true, true, true, null, null] },
    { name: 'Ethan Lee', id: 'EL-007', attendance: [true, true, true, true, true, null, null, false, true, false, true, true, null, null] },
    { name: 'Sophia Wilson', id: 'SW-008', attendance: [false, true, true, true, true, null, null, true, true, true, true, true, null, null] },
    { name: 'Aiden Taylor', id: 'AT-009', attendance: [true, true, true, true, true, null, null, true, true, true, true, false, null, null] },
    { name: 'Ava Smith', id: 'AS-010', attendance: [true, true, false, true, true, null, null, true, false, true, true, true, null, null] }
  ];

  const days = Array.from({length: 14}, (_, i) => i + 8);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Student Attendance</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            View and track daily attendance records for all students
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
            <option>{selectedMonth}</option>
          </select>
          <select className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
            <option>{selectedWeek}</option>
          </select>
          <select className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
            <option>{selectedClass}</option>
          </select>
        </div>
      </div>

      {/* Attendance Grid */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30 shadow-lg">
        <CardContent className="p-6">
          {/* Student Attendance Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-sm font-medium text-slate-600 dark:text-slate-400 py-3 px-4 sticky left-0 bg-white dark:bg-slate-800">
                    Student Name
                  </th>
                  {days.map(day => (
                    <th key={day} className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 py-3 px-2 min-w-[40px]">
                      {day.toString().padStart(2, '0')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student, studentIndex) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    {/* Student Name */}
                    <td className="py-2 px-4 sticky left-0 bg-white dark:bg-slate-800">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-300/60 to-blue-400/60 rounded-full flex items-center justify-center text-slate-800 font-semibold text-xs">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{student.name}</span>
                      </div>
                    </td>

                    {/* Attendance Status */}
                    {student.attendance.map((status, dayIndex) => (
                      <td key={dayIndex} className="py-2 px-2 text-center">
                        {status === null ? (
                          <div className="w-6 h-6 bg-slate-200/60 dark:bg-slate-600/60 rounded-lg flex items-center justify-center mx-auto">
                            <span className="text-xs text-slate-400">-</span>
                          </div>
                        ) : status ? (
                          <div className="w-6 h-6 bg-blue-400/60 hover:bg-blue-500/60 rounded-lg flex items-center justify-center transition-colors cursor-pointer mx-auto">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-red-400/60 hover:bg-red-500/60 rounded-lg flex items-center justify-center transition-colors cursor-pointer mx-auto">
                            <XCircle className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <Button size="sm" variant="outline">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, '...', 17].map((page, index) => (
                <Button key={index} size="sm" variant={page === 1 ? "default" : "ghost"} className="w-8 h-8 p-0">
                  {page}
                </Button>
              ))}
            </div>
            <Button size="sm" variant="outline">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { AttendancePage as Component };
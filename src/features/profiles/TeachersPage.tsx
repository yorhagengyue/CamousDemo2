import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, Filter, Plus, Edit, Copy, Trash2, Phone, Mail } from 'lucide-react';

const TeachersPage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const teachers = [
    {
      id: 'SJ-ENG-123',
      name: 'Ms. Elizabeth Johnson',
      email: 'johnson@eduportal.edu',
      subject: 'English Literature',
      classes: '9A, 10B',
      phone: '(555) 101-0101',
      address: '123 Elm St, Springfield, IL',
      avatar: 'EJ'
    },
    {
      id: 'GRC-HIS-456',
      name: 'Mr. Carlos Garcia',
      email: 'garcia@eduportal.edu',
      subject: 'History',
      classes: '8C, 11A',
      phone: '(555) 101-0102',
      address: '456 Oak Ave, Springfield, IL',
      avatar: 'CG'
    },
    {
      id: 'JCK-MATH-789',
      name: 'Ms. Angela Jackson',
      email: 'jackson@eduportal.edu',
      subject: 'Math Calculus',
      classes: '7A, 12 AP',
      phone: '(555) 101-0103',
      address: '789 Pine Rd, Springfield, IL',
      avatar: 'AJ'
    },
    {
      id: 'ROD-DRA-012',
      name: 'Mr. Luis Rodrigo',
      email: 'rodrigo@eduportal.edu',
      subject: 'Drama',
      classes: 'Drama Club',
      phone: '(555) 101-0104',
      address: '012 Maple Dr, Springfield, IL',
      avatar: 'LR'
    },
    {
      id: 'CHN-SCI-345',
      name: 'Ms. Susan Chen',
      email: 'chen@eduportal.edu',
      subject: 'Science',
      classes: '8B, 9B Biology',
      phone: '(555) 101-0105',
      address: '345 Birch Ln, Springfield, IL',
      avatar: 'SC'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">All Teachers List</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage faculty profiles and information
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="sm" variant="outline" className="bg-white/80 dark:bg-slate-800/80">
            <Search className="h-4 w-4 mr-2" />
            Search by ID, Name, or Subject
          </Button>
          <Button size="sm" className="bg-yellow-400/80 hover:bg-yellow-500/80 text-slate-800 border-0">
            <Filter className="h-4 w-4" />
          </Button>
          <Button size="sm" className="bg-yellow-400/80 hover:bg-yellow-500/80 text-slate-800 border-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Teachers Table */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30 shadow-lg">
        <CardContent className="p-0">
          {/* Table Header */}
          <div className="grid grid-cols-7 gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Teacher Name</div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">School ID</div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Subject</div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Class(es)</div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Phone Number</div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Address</div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Action</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
            {teachers.map((teacher, index) => (
              <div key={teacher.id} className="grid grid-cols-7 gap-4 p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                {/* Teacher Name with Avatar */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400/60 to-blue-500/60 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {teacher.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{teacher.name}</p>
                    <p className="text-xs text-slate-500">{teacher.email}</p>
                  </div>
                </div>

                {/* School ID */}
                <div className="flex items-center">
                  <span className="text-sm text-slate-700 dark:text-slate-300">{teacher.id}</span>
                </div>

                {/* Subject */}
                <div className="flex items-center">
                  <span className="text-sm text-slate-700 dark:text-slate-300">{teacher.subject}</span>
                </div>

                {/* Classes */}
                <div className="flex items-center">
                  <span className="text-sm text-slate-700 dark:text-slate-300">{teacher.classes}</span>
                </div>

                {/* Phone */}
                <div className="flex items-center">
                  <span className="text-sm text-slate-700 dark:text-slate-300">{teacher.phone}</span>
                </div>

                {/* Address */}
                <div className="flex items-center">
                  <span className="text-sm text-slate-700 dark:text-slate-300">{teacher.address}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1">
                  <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                    <Edit className="h-4 w-4 text-slate-600" />
                  </Button>
                  <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                    <Copy className="h-4 w-4 text-slate-600" />
                  </Button>
                  <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                    <Trash2 className="h-4 w-4 text-slate-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center space-x-4">
              <Button size="sm" variant="outline">Previous</Button>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, '...', 17].map((page, index) => (
                  <Button key={index} size="sm" variant={page === 1 ? "default" : "ghost"} className="w-8 h-8 p-0">
                    {page}
                  </Button>
                ))}
              </div>
              <Button size="sm" variant="outline">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { TeachersPage as Component };

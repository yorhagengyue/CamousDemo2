import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle,
  Calendar,
  User,
  MessageSquare,
  Download,
  Search,
  Filter,
  Eye,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { LeaveRequest } from '@/types';
import { formatDate, formatDateTime } from '@/utils/date';
import { useAuthStore } from '@/stores/authStore';

const LeavePage = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'my-leaves' | 'apply' | 'approvals'>('my-leaves');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Leave application form
  const [leaveForm, setLeaveForm] = useState({
    type: 'sick' as 'sick' | 'personal' | 'other',
    startDate: '',
    endDate: '',
    reason: '',
    attachments: [] as File[]
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await fetch('/api/leaves');
      const data = await response.json();
      setLeaves(data);
    } catch (error) {
      console.error('Failed to fetch leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitLeaveRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: leaveForm.type,
          start: new Date(leaveForm.startDate).toISOString(),
          end: new Date(leaveForm.endDate).toISOString(),
          reason: leaveForm.reason,
          attachments: [] // File upload would be implemented here
        })
      });

      if (response.ok) {
        alert('Leave request submitted successfully!');
        setLeaveForm({
          type: 'sick',
          startDate: '',
          endDate: '',
          reason: '',
          attachments: []
        });
        setActiveTab('my-leaves');
        fetchLeaves();
      }
    } catch (error) {
      console.error('Failed to submit leave request:', error);
      alert('Failed to submit leave request. Please try again.');
    }
  };

  const handleApproval = async (leaveId: string, action: 'approve' | 'reject', comment: string = '') => {
    try {
      const response = await fetch(`/api/leaves/${leaveId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment })
      });

      if (response.ok) {
        alert(`Leave request ${action}d successfully!`);
        fetchLeaves();
      }
    } catch (error) {
      console.error(`Failed to ${action} leave request:`, error);
      alert(`Failed to ${action} leave request. Please try again.`);
    }
  };

  const myLeaves = leaves.filter(l => l.applicantId === user?.id);
  const pendingApprovals = leaves.filter(l => 
    l.status === 'pending' && 
    user?.roles.some(role => ['Teacher', 'HOD', 'Principal'].includes(role))
  );

  const filteredLeaves = (activeTab === 'approvals' ? pendingApprovals : myLeaves)
    .filter(leave => {
      const matchesSearch = leave.reason.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sick': return '🏥';
      case 'personal': return '👤';
      case 'other': return '📝';
      default: return '📄';
    }
  };

  const renderLeaveForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          {t('leave.apply')}
        </CardTitle>
        <CardDescription>Submit a new leave request</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submitLeaveRequest} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Leave Type</label>
              <select
                value={leaveForm.type}
                onChange={(e) => setLeaveForm(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="sick">Sick Leave</option>
                <option value="personal">Personal Leave</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Duration</label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="date"
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                />
                <Input
                  type="date"
                  value={leaveForm.endDate}
                  onChange={(e) => setLeaveForm(prev => ({ ...prev, endDate: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Reason</label>
            <textarea
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Please provide a detailed reason for your leave request..."
              className="w-full mt-1 p-3 border border-gray-300 rounded-md h-24 resize-none"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Attachments (Optional)</label>
            <div className="mt-1 border border-dashed border-gray-300 rounded-md p-4 text-center">
              <p className="text-sm text-gray-500">Drag and drop files here or click to browse</p>
              <p className="text-xs text-gray-400 mt-1">Supports PDF, JPG, PNG (max 5MB)</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setActiveTab('my-leaves')}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Request
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderLeaveList = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            {activeTab === 'approvals' ? 'Leave Approvals' : t('leave.myLeaves')}
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredLeaves.map((leave) => (
            <div key={leave.id} className="border rounded-lg p-4 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getTypeIcon(leave.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{leave.type.charAt(0).toUpperCase() + leave.type.slice(1)} Leave</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                        {leave.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{leave.reason}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{formatDate(leave.start)} - {formatDate(leave.end)}</span>
                      {activeTab === 'approvals' && (
                        <span>Applicant: System User</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {activeTab === 'approvals' && leave.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproval(leave.id, 'approve')}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproval(leave.id, 'reject')}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
              
              {leave.approverId && leave.decidedAt && (
                <div className="border-t pt-3 mt-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      {leave.status === 'approved' ? 'Approved' : 'Rejected'} by System Admin on {formatDate(leave.decidedAt)}
                    </span>
                  </div>
                  {leave.approverComment && (
                    <div className="flex items-start gap-2 mt-2 text-sm">
                      <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                      <p className="text-gray-600 italic">"{leave.approverComment}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {filteredLeaves.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {activeTab === 'approvals' ? 'No leave requests to approve' : 'No leave requests found'}
              </p>
              {activeTab === 'my-leaves' && (
                <Button className="mt-4" onClick={() => setActiveTab('apply')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Apply for Leave
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const isTeacher = user?.roles.some(role => ['Teacher', 'HOD', 'Principal'].includes(role));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('leave.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {isTeacher ? 'Review and approve leave requests' : 'Apply for leave and track your requests'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Requests</p>
                <p className="text-2xl font-bold mt-1">{myLeaves.length}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">total submitted</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold mt-1 text-yellow-600">
                  {myLeaves.filter(l => l.status === 'pending').length}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {myLeaves.filter(l => l.status === 'approved').length}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <CheckCircle className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">this year</p>
          </CardContent>
        </Card>

        {isTeacher && (
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">To Review</p>
                  <p className="text-2xl font-bold mt-1 text-orange-600">{pendingApprovals.length}</p>
                </div>
                <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                  <Eye className="h-4 w-4" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">pending approval</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'my-leaves' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('my-leaves')}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          My Leaves
        </Button>
        <Button
          variant={activeTab === 'apply' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('apply')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Apply
        </Button>
        {isTeacher && (
          <Button
            variant={activeTab === 'approvals' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('approvals')}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Approvals ({pendingApprovals.length})
          </Button>
        )}
      </div>

      {/* Content */}
      {activeTab === 'apply' ? renderLeaveForm() : renderLeaveList()}
    </div>
  );
};

export { LeavePage as Component };
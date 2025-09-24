import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Settings, 
  Shield, 
  Activity, 
  Users,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  Link as LinkIcon,
  Unlink,
  RefreshCw,
  Database,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { User, AuditLog } from '@/types';
import { formatDateTime } from '@/utils/date';
import { downloadCSV } from '@/utils/export';

const AdminPage = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'roles' | 'identity' | 'audits'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [usersRes, auditsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/audits?limit=50'),
      ]);

      const [usersData, auditsData] = await Promise.all([
        usersRes.json(),
        auditsRes.json(),
      ]);

      setUsers(usersData);
      setAuditLogs(auditsData);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportAuditLogs = () => {
    const exportData = auditLogs.map(log => ({
      'Timestamp': formatDateTime(log.timestamp),
      'Actor': log.actorName,
      'Action': log.action,
      'Resource': log.resource,
      'IP Address': log.ip,
      'Details': JSON.stringify(log.details || {})
    }));
    
    downloadCSV(exportData, `audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const roleStats = users.reduce((acc, user) => {
    user.roles.forEach(role => {
      acc[role] = (acc[role] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const recentActions = auditLogs.slice(0, 5);
  const criticalActions = auditLogs.filter(log => 
    log.action.includes('delete') || log.action.includes('modify') || log.action.includes('role')
  ).slice(0, 3);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* System Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold mt-1">{users.length}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">registered accounts</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Roles</p>
                <p className="text-2xl font-bold mt-1">{Object.keys(roleStats).length}</p>
              </div>
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <Shield className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">role types configured</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Audit Events</p>
                <p className="text-2xl font-bold mt-1">{auditLogs.length}</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">logged activities</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="text-2xl font-bold mt-1 text-green-600">Good</p>
              </div>
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <Database className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">all systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Role Distribution</CardTitle>
            <CardDescription>User distribution across different roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(roleStats).map(([role, count]) => {
                const percentage = (count / users.length) * 100;
                return (
                  <div key={role} className="flex items-center gap-4">
                    <div className="w-16 text-sm font-medium">{role}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{count} users</span>
                        <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Critical Actions</CardTitle>
            <CardDescription>Important system changes and modifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalActions.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{log.actorName}</p>
                    <p className="text-xs text-gray-600">{log.action} on {log.resource}</p>
                    <p className="text-xs text-gray-500">{formatDateTime(log.timestamp)}</p>
                  </div>
                </div>
              ))}
              
              {criticalActions.length === 0 && (
                <div className="text-center py-4">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No critical actions recently</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            User Management
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {users.filter(user => 
              user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.email?.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex gap-1 mt-1">
                      {user.roles.map((role) => (
                        <span key={role} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderAuditLogs = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            {t('admin.auditLogs')}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchAdminData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportAuditLogs}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search audit logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {auditLogs.filter(log =>
              log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
              log.resource.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((log) => {
              const actionColors = {
                login: 'bg-green-100 text-green-800',
                logout: 'bg-gray-100 text-gray-800',
                approve: 'bg-blue-100 text-blue-800',
                reject: 'bg-red-100 text-red-800',
                create: 'bg-purple-100 text-purple-800',
                update: 'bg-yellow-100 text-yellow-800',
                delete: 'bg-red-100 text-red-800'
              };

              const getActionColor = (action: string) => {
                for (const [key, color] of Object.entries(actionColors)) {
                  if (action.includes(key)) return color;
                }
                return 'bg-gray-100 text-gray-800';
              };

              return (
                <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg hover:shadow-sm transition-all">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Activity className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{log.actorName}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{log.resource}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span>{formatDateTime(log.timestamp)}</span>
                      <span>IP: {log.ip}</span>
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                        <details>
                          <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                            View Details
                          </summary>
                          <pre className="mt-1 text-xs overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderIdentityBinding = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <LinkIcon className="h-5 w-5 mr-2" />
          {t('admin.identityBinding')}
        </CardTitle>
        <CardDescription>Manage identity provider bindings for users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <div className="flex gap-2 mt-1">
                    {user.identities?.map((identity) => (
                      <span key={identity.provider} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {identity.provider}
                      </span>
                    )) || (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No bindings
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <LinkIcon className="h-4 w-4 mr-1" />
                  Bind
                </Button>
                <Button variant="outline" size="sm">
                  <Unlink className="h-4 w-4 mr-1" />
                  Unbind
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Database },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'roles', label: 'Roles', icon: Shield },
    { id: 'identity', label: 'Identity', icon: LinkIcon },
    { id: 'audits', label: 'Audit Logs', icon: Activity }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('admin.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          System administration, user management, and security monitoring
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUserManagement()}
          {activeTab === 'roles' && renderUserManagement()}
          {activeTab === 'identity' && renderIdentityBinding()}
          {activeTab === 'audits' && renderAuditLogs()}
        </>
      )}
    </div>
  );
};

export { AdminPage as Component };
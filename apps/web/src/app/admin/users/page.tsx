'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiUserPlus,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiShield,
  FiMail,
  FiPhone,
  FiX,
  FiSave,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db, initializeDB, type User } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';

const ROLE_LABELS: Record<string, string> = {
  admin: 'مدیر',
  teacher: 'مدرس',
  student: 'دانشجو',
};

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  teacher: 'bg-blue-100 text-blue-700',
  student: 'bg-muted text-muted-foreground',
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [newUser, setNewUser] = useState({ fullName: '', email: '', mobile: '', password: '', role: 'student' as User['role'] });

  const users = useMemo(() => {
    initializeDB();
    return db.getUsers();
  }, [refreshKey]);

  const hydrated = useHydrated();
  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.includes(searchQuery) ||
      user.email.includes(searchQuery) ||
      user.mobile.includes(searchQuery);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleChange = (userId: string, newRole: User['role']) => {
    db.changeUserRole(userId, newRole);
    toast.success(`نقش کاربر به ${ROLE_LABELS[newRole]} تغییر کرد`);
    setEditingUser(null);
    setRefreshKey((k) => k + 1);
  };

  const handleStatusChange = (userId: string, newStatus: User['status']) => {
    db.updateUser(userId, { status: newStatus });
    toast.success('وضعیت کاربر تغییر کرد');
    setRefreshKey((k) => k + 1);
  };

  const handleDeleteUser = (userId: string, name: string) => {
    if (confirm(`آیا از حذف ${name} مطمئن هستید؟`)) {
      db.deleteUser(userId);
      toast.success('کاربر حذف شد');
      setRefreshKey((k) => k + 1);
    }
  };

  const handleAddUser = () => {
    if (!newUser.fullName || !newUser.email || !newUser.password) {
      toast.error('لطفاً فیلدهای ضروری را پر کنید');
      return;
    }
    db.addUser({
      ...newUser,
      status: 'active',
      joinDate: new Date().toLocaleDateString('fa-IR'),
    });
    toast.success('کاربر جدید اضافه شد');
    setShowAddModal(false);
    setNewUser({ fullName: '', email: '', mobile: '', password: '', role: 'student' });
    setRefreshKey((k) => k + 1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <FiCheckCircle className="h-3 w-3" />
            فعال
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <FiXCircle className="h-3 w-3" />
            غیرفعال
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <FiClock className="h-3 w-3" />
            در انتظار
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">مدیریت کاربران</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
        >
          <FiUserPlus className="h-4 w-4" />
          افزودن کاربر جدید
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="جستجو بر اساس نام، ایمیل یا موبایل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">همه نقش‌ها</option>
          <option value="student">دانشجو</option>
          <option value="teacher">مدرس</option>
          <option value="admin">مدیر</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="active">فعال</option>
          <option value="inactive">غیرفعال</option>
          <option value="pending">در انتظار</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl border p-4">
          <p className="text-2xl font-bold">{users.length}</p>
          <p className="text-sm text-muted-foreground">کل کاربران</p>
        </div>
        <div className="bg-background rounded-xl border p-4">
          <p className="text-2xl font-bold text-green-600">{users.filter((u) => u.status === 'active').length}</p>
          <p className="text-sm text-muted-foreground">فعال</p>
        </div>
        <div className="bg-background rounded-xl border p-4">
          <p className="text-2xl font-bold text-blue-600">{users.filter((u) => u.role === 'teacher').length}</p>
          <p className="text-sm text-muted-foreground">مدرس</p>
        </div>
        <div className="bg-background rounded-xl border p-4">
          <p className="text-2xl font-bold text-yellow-600">{users.filter((u) => u.role === 'student').length}</p>
          <p className="text-sm text-muted-foreground">دانشجو</p>
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background rounded-xl border overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-right px-4 py-3 font-medium">نام</th>
                <th className="text-right px-4 py-3 font-medium">ایمیل</th>
                <th className="text-right px-4 py-3 font-medium">موبایل</th>
                <th className="text-right px-4 py-3 font-medium">نقش</th>
                <th className="text-right px-4 py-3 font-medium">تاریخ عضویت</th>
                <th className="text-right px-4 py-3 font-medium">وضعیت</th>
                <th className="text-right px-4 py-3 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">{user.fullName.charAt(0)}</span>
                      </div>
                      <span className="font-medium">{user.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground flex items-center gap-1">
                    <FiMail className="h-3 w-3" />
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground flex items-center gap-1" dir="ltr">
                    <FiPhone className="h-3 w-3" />
                    {user.mobile}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[user.role]}`}>
                      {ROLE_LABELS[user.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.joinDate}</td>
                  <td className="px-4 py-3">{getStatusBadge(user.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        title="تغییر نقش"
                      >
                        <FiShield className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'inactive' : 'active')}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        title={user.status === 'active' ? 'غیرفعال کردن' : 'فعال کردن'}
                      >
                        {user.status === 'active' ? <FiXCircle className="h-4 w-4 text-red-500" /> : <FiCheckCircle className="h-4 w-4 text-green-500" />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.fullName)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="حذف"
                      >
                        <FiTrash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <FiUsers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">کاربری یافت نشد</p>
            <p className="text-muted-foreground">فیلترهای خود را تغییر دهید</p>
          </div>
        )}
      </motion.div>

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl border p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">تغییر نقش کاربر</h2>
              <button onClick={() => setEditingUser(null)} className="p-1 hover:bg-muted rounded-lg">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium">{editingUser.fullName}</p>
                <p className="text-sm text-muted-foreground">{editingUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">نقش جدید</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['admin', 'teacher', 'student'] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleChange(editingUser.id, role)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        editingUser.role === role
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'hover:bg-muted border-border'
                      }`}
                    >
                      {ROLE_LABELS[role]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl border p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">افزودن کاربر جدید</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-muted rounded-lg">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">نام کامل *</label>
                <input
                  type="text"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="نام کامل"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ایمیل *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">موبایل</label>
                <input
                  type="tel"
                  value={newUser.mobile}
                  onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="09123456789"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">رمز عبور *</label>
                <input
                  type="text"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="رمز عبور"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">نقش</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="student">دانشجو</option>
                  <option value="teacher">مدرس</option>
                  <option value="admin">مدیر</option>
                </select>
              </div>
              <button
                onClick={handleAddUser}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 flex items-center justify-center gap-2"
              >
                <FiSave className="h-4 w-4" />
                ذخیره کاربر
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

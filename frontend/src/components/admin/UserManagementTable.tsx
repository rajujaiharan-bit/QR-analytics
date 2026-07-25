import React from 'react';
import { User } from '../../types/index.js';
import { ShieldCheck, User as UserIcon, Building, Mail, Calendar } from 'lucide-react';
import { api } from '../../api/axios.js';

interface UserManagementTableProps {
  users: User[];
  onRefresh: () => void;
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({ users, onRefresh }) => {
  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await api.put(`/api/admin/user/${userId}/role`, { role: newRole });
      onRefresh();
    } catch (err) {
      alert('Failed to update user role');
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Registered SaaS Users</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">System user permissions & subscription plans</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold">
          {users.length} Total Users
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-100 dark:bg-gray-800/60 text-gray-500 uppercase font-semibold">
            <tr>
              <th className="p-3.5 rounded-l-xl">User</th>
              <th className="p-3.5">Company</th>
              <th className="p-3.5">Role</th>
              <th className="p-3.5">Plan</th>
              <th className="p-3.5 rounded-r-xl text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                <td className="p-3.5">
                  <div className="flex items-center space-x-3">
                    <img
                      src={u.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white block">{u.name}</span>
                      <span className="text-gray-400 text-[11px]">{u.email}</span>
                    </div>
                  </div>
                </td>
                <td className="p-3.5 text-gray-600 dark:text-gray-300 font-medium">
                  {u.company || 'Independent Advertiser'}
                </td>
                <td className="p-3.5">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                      u.role === 'admin'
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                        : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-3.5 font-bold uppercase text-brand-600 dark:text-brand-400">
                  {u.subscription?.plan || 'pro'}
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => handleRoleToggle(u.id, u.role)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-brand-500/10 hover:text-brand-500 text-gray-600 dark:text-gray-300 font-semibold rounded-lg transition-colors"
                  >
                    Toggle {u.role === 'admin' ? 'to User' : 'to Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import { Shield, Users, Activity, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdminPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 30px rgba(245, 158, 11, 0.5)' }}>
              <Shield size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}>
                Admin Dashboard
              </h1>
              <p className="text-slate-400">System management and monitoring</p>
            </div>
          </div>
        </div>

        {/* Admin Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl border border-blue-500/20 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users size={24} className="text-white" />
              </div>
              <span className="text-green-400 text-sm font-semibold">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">1,847</h3>
            <p className="text-slate-400 text-sm">Total Users</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Activity size={24} className="text-white" />
              </div>
              <span className="text-green-400 text-sm font-semibold">+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">423</h3>
            <p className="text-slate-400 text-sm">Active Sessions</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <DollarSign size={24} className="text-white" />
              </div>
              <span className="text-green-400 text-sm font-semibold">+24%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">$2.4M</h3>
            <p className="text-slate-400 text-sm">Revenue (MTD)</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-xl border border-orange-500/20 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <TrendingUp size={24} className="text-white" />
              </div>
              <span className="text-green-400 text-sm font-semibold">+15%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">98.5%</h3>
            <p className="text-slate-400 text-sm">System Uptime</p>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">User Management</h2>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
              Add New User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold text-sm">User</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold text-sm">Email</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold text-sm">Role</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold text-sm">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold text-sm">Last Seen</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        VL
                      </div>
                      <span className="text-white font-medium">Vivek Lakum</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-300">viveklakum645@gmail.com</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-semibold border border-amber-500/30">
                      Admin
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold border border-green-500/30">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-400">Just now</td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                        JS
                      </div>
                      <span className="text-white font-medium">John Smith</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-300">john.smith@example.com</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold border border-blue-500/30">
                      User
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold border border-green-500/30">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-400">2 hours ago</td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-semibold">
                        SE
                      </div>
                      <span className="text-white font-medium">Sarah Evans</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-300">sarah.evans@example.com</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold border border-blue-500/30">
                      User
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold border border-yellow-500/30">
                      Idle
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-400">1 day ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">System Alerts</h2>
          
          <div className="space-y-3">
            <div className="flex items-start gap-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <AlertCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-white font-semibold mb-1">High API Usage Detected</h3>
                <p className="text-slate-400 text-sm">API calls have increased by 45% in the last hour. Monitor for unusual activity.</p>
                <span className="text-xs text-slate-500 mt-2 block">5 minutes ago</span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-white font-semibold mb-1">Scheduled Maintenance</h3>
                <p className="text-slate-400 text-sm">Database backup scheduled for tonight at 2:00 AM EST. Expected downtime: 10 minutes.</p>
                <span className="text-xs text-slate-500 mt-2 block">1 hour ago</span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <AlertCircle className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-white font-semibold mb-1">Security Update Completed</h3>
                <p className="text-slate-400 text-sm">All systems have been updated to the latest security patches.</p>
                <span className="text-xs text-slate-500 mt-2 block">3 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

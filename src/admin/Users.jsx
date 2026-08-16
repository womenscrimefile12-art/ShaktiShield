import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    adminAPI.getUsers().then(({ data }) => {
      setUsers(data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleStatus = async (id) => {
    await adminAPI.toggleUser(id);
    fetchUsers();
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div>
      <h1 className="page-title">User Management</h1>
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem' }}>Name</th>
              <th style={{ padding: '0.75rem' }}>Email</th>
              <th style={{ padding: '0.75rem' }}>Phone</th>
              <th style={{ padding: '0.75rem' }}>Role</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
              <th style={{ padding: '0.75rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem' }}>{u.name}</td>
                <td style={{ padding: '0.75rem' }}>{u.email}</td>
                <td style={{ padding: '0.75rem' }}>{u.phone}</td>
                <td style={{ padding: '0.75rem' }}>{u.role}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span className={`badge ${u.isActive ? 'badge-resolved' : 'badge-active'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  {u.role !== 'admin' && (
                    <button onClick={() => toggleStatus(u._id)} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;

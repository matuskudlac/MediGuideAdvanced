import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import './Profile.css';

function Profile() {
    const [user, setUser] = useState(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setError('New password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:8000/api/auth/change-password/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({
                    current_password: passwordData.currentPassword,
                    new_password: passwordData.newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setToast({
                    message: 'Password changed successfully!',
                    type: 'success'
                });
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                setShowPasswordForm(false);
                setError('');
            } else {
                setError(data.error || 'Failed to change password');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="profile-container">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <h1>My Profile</h1>

            <div className="profile-content">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user.first_name ? user.first_name[0].toUpperCase() : user.email[0].toUpperCase()}
                        </div>
                        <div className="profile-info">
                            <h2>{user.full_name || user.email}</h2>
                            <p className="profile-email">{user.email}</p>
                        </div>
                    </div>

                    <div className="profile-details">
                        <div className="detail-row">
                            <span className="detail-label">First Name:</span>
                            <span className="detail-value">{user.first_name || 'Not set'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Last Name:</span>
                            <span className="detail-value">{user.last_name || 'Not set'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Email:</span>
                            <span className="detail-value">{user.email}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Username:</span>
                            <span className="detail-value">{user.username}</span>
                        </div>
                    </div>
                </div>

                <div className="profile-card">
                    <div className="card-header">
                        <h3>Security</h3>
                    </div>

                    {!showPasswordForm ? (
                        <button
                            className="btn-change-password"
                            onClick={() => setShowPasswordForm(true)}
                        >
                            Change Password
                        </button>
                    ) : (
                        <div className="password-form">
                            <h4>Change Password</h4>

                            {error && <div className="error-message">{error}</div>}

                            <form onSubmit={handlePasswordSubmit}>
                                <div className="form-group">
                                    <label htmlFor="currentPassword">Current Password</label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        placeholder="Enter current password"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="newPassword">New Password</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        placeholder="Enter new password (min 8 characters)"
                                        minLength="8"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm New Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        placeholder="Confirm new password"
                                        minLength="8"
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn-submit" disabled={loading}>
                                        {loading ? 'Changing...' : 'Change Password'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-cancel"
                                        onClick={() => {
                                            setShowPasswordForm(false);
                                            setError('');
                                            setPasswordData({
                                                currentPassword: '',
                                                newPassword: '',
                                                confirmPassword: '',
                                            });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;

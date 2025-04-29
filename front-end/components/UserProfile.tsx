import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '@/AppContext';

export default function ProfilePage() {
  const [user, setUser] = useState<userProps | null>(null);
  const [points, setPoints] = useState(0);
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');
  const {backendDomain} = useAppContext();
  console.log(backendDomain);

  interface userProps {
    firstname:string;
    lastname:string;
    email:string;
    tier:string;
  } 
  useEffect(() => {
    const fetchUserProfile = async () => {
        try {
            const res = await fetch(
                `${backendDomain}/api/v1/user/getCurrentUser`,
                {
                  method: "GET",
                  credentials: "include",
                  headers: {
                      "Content-Type": "application/json"
                  }
                }
            );
            const user = await res.json();
            setUser(user.userInfo);
            console.log('hellooo');
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
        }
    }

    const fetchPoints = async () => {
      try {
        const res = await fetch(
          `${backendDomain}/api/v1/membershipPoints/get-user-points`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        const data = await res.json();
        setPoints(data.totalPoints);
      } catch (err) {
        console.error('Failed to fetch points:', err);
      }
    };

    fetchUserProfile();
    fetchPoints();
  }, []);

  const handleUpdateEmail = async (e:any) => {
    e.preventDefault();
    try {
      // await axios.put(`${backendDomain}/api/v1/user/profile`, { email });
      const res = await fetch(
        `${backendDomain}/api/v1/user/updateUserInfo`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        }
      )
      setStatus('Info updated successfully!');
    } catch (err) {
      setStatus('Failed to update info');
    }
  };

  const handleChangePassword = async (e:any) => {
    e.preventDefault();
    try {
      await fetch(`${backendDomain}/api/v1/user/change-password`, 
        {
          method : "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"

          }, 
          body: JSON.stringify({ currentPassword, newPassword})
        }
      );
      setStatus('Password changed successfully!');
    } catch (err) {
      setStatus('Failed to change password');
    }
  };

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile Info</h2>
        <p><strong>First Name:</strong> {user.firstname}</p>
        <p><strong>Last Name:</strong> {user.lastname}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Tier:</strong> {user.tier}</p>
        <p><strong>Membership Points:</strong> {points}</p>
      </div>

      <form onSubmit={handleUpdateEmail} className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Update Email</h2>
        <input
          type="email"
          className="w-full border p-2 mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Email
        </button>
      </form>

      <form onSubmit={handleChangePassword} className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <input
          type="password"
          placeholder="Current Password"
          className="w-full border p-2 mb-4 rounded"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2 mb-4 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Change Password
        </button>
      </form>

      {status && <p className="text-center text-sm mt-4 text-gray-700">{status}</p>}
    </div>
  );
}

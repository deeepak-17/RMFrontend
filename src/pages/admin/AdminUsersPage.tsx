/**
 * Admin Users Page (Stub)
 * Owner: Member 5 (Admin)
 * Branch: feature/admin
 *
 * TODO:
 * - Fetch all users from adminApi.getUsers()
 * - Display in table with role and verification status
 * - Add Verify/Block buttons
 * - Filter by role and verification status
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, X } from 'lucide-react';
import type { User } from '@/types';

export default function AdminUsersPage() {
    const [users, _setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch users from adminApi.getUsers()
        setIsLoading(false);
    }, []);

    const handleVerify = async (userId: string) => {
        // TODO: Call adminApi.verifyUser(userId)
        console.log('Verifying user:', userId);
    };

    const handleBlock = async (userId: string) => {
        // TODO: Call adminApi.blockUser(userId)
        console.log('Blocking user:', userId);
    };

    return (
        <div className="min-h-screen bg-neutral-50 p-4">
            <div className="max-w-6xl mx-auto">
                <Link to="/admin/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <h1 className="text-2xl font-bold mb-6">User Management</h1>

                {isLoading ? (
                    <p className="text-center text-gray-500 py-8">Loading users...</p>
                ) : users.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <p className="text-gray-500">No users found.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="p-0">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {users.map((user) => (
                                        <tr key={user._id}>
                                            <td className="px-4 py-3">{user.name}</td>
                                            <td className="px-4 py-3 text-gray-600">{user.email}</td>
                                            <td className="px-4 py-3">
                                                <span className="capitalize">{user.role}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs rounded-full ${user.verificationStatus === 'verified' ? 'bg-green-100 text-green-700' :
                                                    user.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {user.verificationStatus}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    {user.verificationStatus === 'pending' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleVerify(user._id)}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleBlock(user._id)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

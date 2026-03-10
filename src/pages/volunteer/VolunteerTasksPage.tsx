/**
 * Volunteer Tasks Page (Stub)
 * Owner: Member 4 (Volunteer)
 * Branch: feature/volunteer
 *
 * TODO:
 * - Fetch assigned tasks from tasksApi.getMyTasks()
 * - Show accept/decline buttons for new tasks
 * - Show status update buttons (Mark as Picked / Delivered)
 * - Display pickup and delivery addresses
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Package, Check, Loader2 } from 'lucide-react';
import type { PickupTask } from '@/types';
import { tasksApi } from '@/lib/api';

export default function VolunteerTasksPage() {
    const [tasks, setTasks] = useState<PickupTask[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            const response = await tasksApi.getMyTasks();
            console.log('Volunteer tasks response:', response.data);
            // The backend returns a simple array for tasks
            const taskList = Array.isArray(response.data) ? response.data : (response.data.data || []);
            console.log('Processed task list:', taskList);
            setTasks(taskList);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const [taskFilter, setTaskFilter] = useState<'all' | 'assigned' | 'accepted' | 'delivered'>('all');

    // Keep a ref to tasks for voice handler
    const tasksRef = useRef(tasks);
    useEffect(() => { tasksRef.current = tasks; }, [tasks]);

    // Voice command listener
    useEffect(() => {
        const handle = (e: Event) => {
            const { key } = (e as CustomEvent).detail;
            const current = tasksRef.current;

            if (key === 'accept-task') {
                const first = current.find((t: any) => t.status === 'assigned');
                if (first) handleAccept(first._id);
            } else if (key === 'decline-task') {
                const first = current.find((t: any) => t.status === 'assigned');
                if (first) handleDecline(first._id);
            } else if (key === 'mark-picked') {
                const first = current.find((t: any) => t.status === 'accepted');
                if (first) handleUpdateStatus(first._id, 'picked');
            } else if (key === 'mark-delivered' || key === 'complete-task') {
                const first = current.find((t: any) => t.status === 'picked');
                if (first) handleUpdateStatus(first._id, 'delivered');
            } else if (key === 'filter-active') {
                setTaskFilter('accepted');
            } else if (key === 'filter-completed') {
                setTaskFilter('delivered');
            } else if (key === 'filter-all') {
                setTaskFilter('all');
            } else if (key === 'refresh-list') {
                fetchTasks();
            }
        };
        window.addEventListener('va-action', handle);
        return () => window.removeEventListener('va-action', handle);
    }, []);

    const handleAccept = async (taskId: string) => {
        try {
            setActionLoading(taskId);
            await tasksApi.accept(taskId);
            await fetchTasks(); // Refresh list
        } catch (error) {
            console.error('Error accepting task:', error);
            alert("Failed to accept task.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDecline = async (taskId: string) => {
        try {
            setActionLoading(taskId);
            // Remove as 'declined' optimistically — backend may not have a separate decline endpoint
            setTasks(prev => prev.filter((t: any) => t._id !== taskId));
        } catch (error) {
            console.error('Error declining task:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleUpdateStatus = async (taskId: string, status: 'picked' | 'delivered') => {
        try {
            setActionLoading(taskId);
            await tasksApi.updateStatus(taskId, status);
            await fetchTasks(); // Refresh list
        } catch (error) {
            console.error('Error updating task status:', error);
            alert("Failed to update status.");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 p-4">
            <div className="max-w-4xl mx-auto">
                <Link to="/volunteer/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <h1 className="text-2xl font-bold mb-6">My Tasks</h1>

                {isLoading ? (
                    <p className="text-center text-gray-500 py-8">Loading tasks...</p>
                ) : tasks.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <p className="text-gray-500">No tasks assigned yet.</p>
                            <p className="text-sm text-gray-400 mt-2">You'll be notified when a new pickup is assigned.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {(taskFilter === 'all' ? tasks : tasks.filter((t: any) => t.status === taskFilter)).map((task: any) => {
                            const donation = task.donationId;
                            const ngo = task.ngoId;
                            return (
                                <Card key={task._id}>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-semibold">{donation?.title || 'Pickup Task'}</h3>
                                                <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${task.status === 'assigned' ? 'bg-yellow-100 text-yellow-700' :
                                                    task.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                                                        task.status === 'picked' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-green-100 text-green-700'
                                                    }`}>
                                                    {task.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 text-sm text-gray-600 mb-6">
                                            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                                                <div className="flex items-center gap-2 mb-1 font-semibold text-emerald-800">
                                                    <Package className="w-4 h-4 text-emerald-600" />
                                                    <span>Pickup from Donor</span>
                                                </div>
                                                <p className="ml-6 text-gray-700">{donation?.location?.address || 'Location provided on map'}</p>
                                                <p className="ml-6 text-xs text-gray-500 mt-1">Quantity: {donation?.quantity}</p>
                                            </div>

                                            <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                                                <div className="flex items-center gap-2 mb-1 font-semibold text-orange-800">
                                                    <MapPin className="w-4 h-4 text-orange-600" />
                                                    <span>Deliver to {ngo?.name || 'NGO'}</span>
                                                </div>
                                                <p className="ml-6 text-gray-700">{ngo?.address || 'NGO Headquarters'}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {task.status === 'assigned' && (
                                                <>
                                                    <Button
                                                        onClick={() => handleAccept(task._id)}
                                                        className="bg-emerald-600 hover:bg-emerald-700"
                                                        disabled={actionLoading === task._id}
                                                    >
                                                        {actionLoading === task._id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDecline(task._id)}
                                                        className="bg-red-600 hover:bg-red-700 ml-2"
                                                        disabled={actionLoading === task._id}
                                                    >
                                                        {actionLoading === task._id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                                        Decline
                                                    </Button>
                                                </>
                                            )}
                                            {task.status === 'accepted' && (
                                                <Button
                                                    onClick={() => handleUpdateStatus(task._id, 'picked')}
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                    disabled={actionLoading === task._id}
                                                >
                                                    {actionLoading === task._id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                                                    Mark as Picked
                                                </Button>
                                            )}
                                            {task.status === 'picked' && (
                                                <Button
                                                    onClick={() => handleUpdateStatus(task._id, 'delivered')}
                                                    className="bg-green-600 hover:bg-green-700"
                                                    disabled={actionLoading === task._id}
                                                >
                                                    {actionLoading === task._id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                                                    Mark as Delivered
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

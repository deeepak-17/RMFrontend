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

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Package, Check } from 'lucide-react';
import type { PickupTask } from '@/types';

export default function VolunteerTasksPage() {
    const [tasks, _setTasks] = useState<PickupTask[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch tasks from tasksApi.getMyTasks()
        setIsLoading(false);
    }, []);

    const handleAccept = async (taskId: string) => {
        // TODO: Call tasksApi.accept(taskId)
        console.log('Accepting task:', taskId);
    };

    const handleUpdateStatus = async (taskId: string, status: 'picked' | 'delivered') => {
        // TODO: Call tasksApi.updateStatus(taskId, status)
        console.log('Updating task:', taskId, status);
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
                        {tasks.map((task) => (
                            <Card key={task._id}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-semibold">Pickup Task</h3>
                                            <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${task.status === 'assigned' ? 'bg-yellow-100 text-yellow-700' :
                                                task.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                                                    task.status === 'picked' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-green-100 text-green-700'
                                                }`}>
                                                {task.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Package className="w-4 h-4 text-emerald-600" />
                                            <span>Pickup: {task.pickupLocation.address || 'See map'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-orange-600" />
                                            <span>Deliver: {task.deliveryLocation.address || 'See map'}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {task.status === 'assigned' && (
                                            <Button onClick={() => handleAccept(task._id)} className="bg-emerald-600 hover:bg-emerald-700">
                                                Accept Task
                                            </Button>
                                        )}
                                        {task.status === 'accepted' && (
                                            <Button onClick={() => handleUpdateStatus(task._id, 'picked')} className="bg-blue-600 hover:bg-blue-700">
                                                <Check className="w-4 h-4 mr-2" />
                                                Mark as Picked
                                            </Button>
                                        )}
                                        {task.status === 'picked' && (
                                            <Button onClick={() => handleUpdateStatus(task._id, 'delivered')} className="bg-green-600 hover:bg-green-700">
                                                <Check className="w-4 h-4 mr-2" />
                                                Mark as Delivered
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

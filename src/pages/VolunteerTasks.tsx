import { useEffect, useState } from 'react';
import api from '../lib/api';
import { PickupTask, TaskStatus } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Navbar } from '../components/Navbar';
import { useToast, ToastContainer } from '../components/ui/toast';
import { Skeleton } from '../components/ui/skeleton';
import { MapPin, Package, TrendingUp, CheckCircle } from 'lucide-react';

const VolunteerTasks = () => {
    const [tasks, setTasks] = useState<PickupTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { toasts, addToast, removeToast } = useToast();

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks/my');
            setTasks(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load tasks');
            console.error(err);
            addToast('Failed to load tasks', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleStatusUpdate = async (id: string, action: 'accept' | 'decline' | 'picked' | 'delivered') => {
        try {
            if (action === 'accept') {
                await api.put(`/tasks/${id}/accept`);
                addToast('Task accepted successfully!', 'success');
            } else if (action === 'decline') {
                await api.put(`/tasks/${id}/decline`);
                addToast('Task declined', 'info');
            } else {
                await api.put(`/tasks/${id}/status`, {
                    status: action === 'picked' ? TaskStatus.PICKED : TaskStatus.DELIVERED
                });
                addToast(`Task marked as ${action === 'picked' ? 'picked up' : 'delivered'}!`, 'success');
            }
            // Refresh tasks
            fetchTasks();
        } catch (err) {
            console.error('Failed to update status', err);
            addToast('Failed to update task status', 'error');
        }
    };

    const getStatusBadge = (status: TaskStatus) => {
        switch (status) {
            case TaskStatus.ASSIGNED: return <Badge variant="secondary">Assigned</Badge>;
            case TaskStatus.ACCEPTED: return <Badge variant="warning">Accepted</Badge>;
            case TaskStatus.PICKED: return <Badge variant="default">Picked Up</Badge>;
            case TaskStatus.DELIVERED: return <Badge variant="success" icon={<CheckCircle className="h-3 w-3" />}>Delivered</Badge>;
            case TaskStatus.DECLINED: return <Badge variant="destructive">Declined</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    const TaskSkeleton = () => (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <Skeleton width="60%" height="24px" />
                    <Skeleton width="80px" height="20px" variant="rectangular" />
                </div>
                <Skeleton width="40%" height="16px" className="mt-2" />
            </CardHeader>
            <CardContent className="space-y-3">
                <Skeleton width="100%" height="16px" />
                <Skeleton width="80%" height="16px" />
            </CardContent>
            <CardFooter>
                <Skeleton width="100%" height="40px" variant="rectangular" />
            </CardFooter>
        </Card>
    );

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <ToastContainer toasts={toasts} onClose={removeToast} />

            <div className="container mx-auto p-4 space-y-6">
                {/* Header with Stats */}
                <div className="animate-fade-in-up">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        My Priority <span className="text-gradient-green">Pickups</span>
                    </h1>
                    <p className="text-muted-foreground">Manage your volunteer delivery tasks</p>
                </div>

                {/* Stats Cards */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card hover className="animate-fade-in-up stagger-1">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <span className="text-sm font-medium">Total Tasks</span>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-primary">{tasks.length}</div>
                            </CardContent>
                        </Card>

                        <Card hover className="animate-fade-in-up stagger-2">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <span className="text-sm font-medium">Completed</span>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-primary">
                                    {tasks.filter(t => t.status === TaskStatus.DELIVERED).length}
                                </div>
                            </CardContent>
                        </Card>

                        <Card hover className="animate-fade-in-up stagger-3">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <span className="text-sm font-medium">In Progress</span>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-primary">
                                    {tasks.filter(t => [TaskStatus.ACCEPTED, TaskStatus.PICKED].includes(t.status)).length}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => <TaskSkeleton key={i} />)}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <Card className="border-destructive/50 bg-destructive/10">
                        <CardContent className="pt-6 text-center">
                            <p className="text-destructive">{error}</p>
                            <Button variant="outline" onClick={fetchTasks} className="mt-4">
                                Retry
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Tasks Grid */}
                {!loading && !error && tasks.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.map((task, index) => (
                            <Card key={task._id} hover greenBorder className="flex flex-col animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">{task.donationId?.foodType || 'Food Pickup'}</CardTitle>
                                        {getStatusBadge(task.status)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Quantity: {task.donationId?.quantity || 'N/A'}
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1 space-y-4">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-sm">Pickup Location</p>
                                            <p className="text-sm text-muted-foreground">
                                                {typeof task.donationId?.location === 'string'
                                                    ? task.donationId.location
                                                    : task.donationId?.location?.address || 'Unknown Address'}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex gap-2 border-t pt-4">
                                    {task.status === TaskStatus.ASSIGNED && (
                                        <>
                                            <Button className="flex-1" onClick={() => handleStatusUpdate(task._id, 'accept')}>
                                                Accept Task
                                            </Button>
                                            <Button className="flex-1" variant="destructive" onClick={() => handleStatusUpdate(task._id, 'decline')}>
                                                Decline
                                            </Button>
                                        </>
                                    )}

                                    {task.status === TaskStatus.ACCEPTED && (
                                        <Button className="w-full" onClick={() => handleStatusUpdate(task._id, 'picked')}>
                                            Mark as Picked
                                        </Button>
                                    )}

                                    {task.status === TaskStatus.PICKED && (
                                        <Button className="w-full" variant="secondary" onClick={() => handleStatusUpdate(task._id, 'delivered')}>
                                            Confirm Delivery
                                        </Button>
                                    )}

                                    {task.status === TaskStatus.DELIVERED && (
                                        <div className="w-full text-center py-2">
                                            <Badge variant="success" icon={<CheckCircle className="h-3 w-3" />}>
                                                Wait for Confirmation
                                            </Badge>
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && tasks.length === 0 && (
                    <Card className="text-center py-12 animate-fade-in-up">
                        <CardContent>
                            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold mb-2">No Tasks Assigned Yet</h3>
                            <p className="text-muted-foreground">
                                Great job! Check back later for new pickup tasks.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default VolunteerTasks;

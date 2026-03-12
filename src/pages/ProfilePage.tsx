import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ArrowLeft, Camera, Phone, Lock, User, Mail, CheckCircle2,
    Shield, Loader2, Eye, EyeOff
} from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();

    // Profile fields
    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState((user as any)?.phone || "");
    const [profilePreview, setProfilePreview] = useState<string | null>(
        (user as any)?.profilePicture || null
    );
    const [profileFile, setProfileFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Password change
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);

    // UI state
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setPhone((user as any).phone || "");
            if ((user as any).profilePicture) {
                setProfilePreview((user as any).profilePicture);
            }
        }
    }, [user]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileFile(file);
            const reader = new FileReader();
            reader.onload = () => setProfilePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        setIsSavingProfile(true);
        try {
            // Upload avatar if changed
            if (profileFile) {
                const formData = new FormData();
                formData.append("avatar", profileFile);
                await authApi.uploadAvatar(formData);
            }

            // Update profile info
            await authApi.updateProfile({ name, phone });

            await refreshUser();
            toast.success("Profile updated successfully!");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsChangingPassword(true);
        try {
            await authApi.changePassword({
                currentPassword,
                newPassword,
            });
            toast.success("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            toast.error(
                err.response?.data?.message || "Failed to change password"
            );
        } finally {
            setIsChangingPassword(false);
        }
    };

    // Calculate profile completion
    const completionSteps = [
        { label: "Name added", done: !!user?.name },
        { label: "Email verified", done: !!user?.email },
        { label: "Phone number", done: !!(user as any)?.phone },
        { label: "Profile picture", done: !!(user as any)?.profilePicture },
        { label: "Account verified", done: !!user?.verified },
    ];
    const completedCount = completionSteps.filter((s) => s.done).length;
    const completionPercent = Math.round((completedCount / completionSteps.length) * 100);

    const initials = user?.name
        ? user.name
            .split(" ")
            .map((w: string) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "U";

    const dashboardPath =
        user?.role === "admin"
            ? "/admin/dashboard"
            : user?.role === "donor"
                ? "/donor/dashboard"
                : user?.role === "ngo"
                    ? "/ngo/dashboard"
                    : "/volunteer/dashboard";

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        to={dashboardPath}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                            Edit Profile
                        </h1>
                        <p className="text-gray-400 text-sm mt-0.5">
                            Manage your account settings
                        </p>
                    </div>
                </div>

                {/* Profile Completion Tracker */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-600" />
                            Profile Completion
                        </h2>
                        <span className="text-sm font-bold text-emerald-600">
                            {completionPercent}%
                        </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                            style={{ width: `${completionPercent}%` }}
                        />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {completionSteps.map((step) => (
                            <div
                                key={step.label}
                                className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${step.done
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-gray-50 text-gray-400"
                                    }`}
                            >
                                <CheckCircle2
                                    className={`w-3.5 h-3.5 ${step.done ? "text-emerald-500" : "text-gray-300"
                                        }`}
                                />
                                <span className="font-medium">{step.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Profile Picture + Basic Info */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="font-bold text-gray-900 text-sm mb-5 flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-600" />
                        Personal Information
                    </h2>

                    {/* Avatar */}
                    <div className="flex items-center gap-5 mb-6">
                        <div className="relative">
                            {profilePreview ? (
                                <img
                                    src={
                                        profilePreview.startsWith("data:")
                                            ? profilePreview
                                            : profilePreview.startsWith("http")
                                                ? profilePreview
                                                : `http://localhost:5001${profilePreview}`
                                    }
                                    alt="Profile"
                                    className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-100"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl font-bold">
                                    {initials}
                                </div>
                            )}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center shadow-md transition-colors"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{user?.name}</p>
                            <p className="text-sm text-gray-400">{user?.email}</p>
                            <p className="text-xs text-emerald-600 font-semibold mt-1 capitalize">
                                {user?.role}
                            </p>
                        </div>
                    </div>

                    {/* Form fields */}
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-gray-700">
                                Full Name
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-10 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-gray-700">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    value={user?.email || ""}
                                    disabled
                                    className="pl-10 h-11 rounded-xl border-gray-200 bg-gray-50 text-gray-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-gray-700">
                                Phone Number
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+91 9876543210"
                                    className="pl-10 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleSaveProfile}
                            disabled={isSavingProfile}
                            className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all duration-200"
                        >
                            {isSavingProfile ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="font-bold text-gray-900 text-sm mb-5 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-orange-500" />
                        Change Password
                    </h2>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-gray-700">
                                Current Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type={showCurrentPw ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showCurrentPw ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-gray-700">
                                New Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type={showNewPw ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPw(!showNewPw)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showNewPw ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-gray-700">
                                Confirm New Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="pl-10 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleChangePassword}
                            disabled={
                                isChangingPassword ||
                                !currentPassword ||
                                !newPassword ||
                                !confirmPassword
                            }
                            variant="outline"
                            className="w-full h-11 rounded-xl border-orange-200 text-orange-700 hover:bg-orange-50 font-bold transition-all duration-200"
                        >
                            {isChangingPassword ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                                    Changing...
                                </>
                            ) : (
                                "Change Password"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

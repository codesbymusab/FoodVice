import { useState } from "react"
import type { UserProfile } from "./UserProfilePage"
import { editUserProfile } from "../../../apis/profile"
import { validateProfileForm, validateImageFile, hasErrors } from "../../../utils/validators"
import { ConfirmationDialog, OperationLoadingDialog } from "../../Shared/Feedback"

export function EditProfilePage({ profile, setShowEditForm, fetchProfile }: { profile: UserProfile, setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>, fetchProfile: () => Promise<void> }) {


    const [form, setForm] = useState({
        name: profile.name || "",
        username: profile.username || "",
        email: profile.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        country: "",
        city: "",
        bio: profile.bio || "",
        provider: profile.provider || ""
    })

    const [imageFile, setImageFile] = useState<File | null>(null)
    const [preview, setPreview] = useState(profile.profilePhoto || "")
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
        // Clear error for this field
        if (errors[e.target.name]) {
            setErrors({...errors, [e.target.name]: ""})
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate image
            const imageError = validateImageFile(file)
            if (imageError) {
                setErrors({...errors, image: imageError})
                return
            }
            setImageFile(file)
            setPreview(URL.createObjectURL(file))
            if (errors.image) {
                setErrors({...errors, image: ""})
            }
        }
    }

    const handleSubmit = async () => {
        // Validate form
        const validationErrors = validateProfileForm(
            form.name,
            form.username,
            form.email,
            form.bio
        )
        if (hasErrors(validationErrors)) {
            setErrors(validationErrors)
            return
        }

        // Show confirmation dialog
        setShowConfirmation(true)
    }

    const confirmSubmit = async () => {
        setIsSubmitting(true)
        setShowConfirmation(false)

        try {
            const data = new FormData()

            const finalData = {
                name: form.name || profile.name,
                username: form.username ? `@${form.username}` : profile.username,
                email: form.email || profile.email,
                bio: form.bio || profile.bio || "",
                address:
                    [form.city, form.country]
                        .filter(Boolean)
                        .join(", ") || profile.address || "",
                country: form.country || "",
                city: form.city || "",
                provider: profile.provider,
                password: form.currentPassword
            }

            Object.entries(finalData).forEach(([key, value]) => {
                data.append(key, value)
            })

            if (form.newPassword) {
                data.append("newPassword", form.newPassword)
                data.append("confirmPassword", form.confirmPassword)
            }

            if (imageFile) {
                data.append("profilePhoto", imageFile)
            }


            await editUserProfile(data)
            setShowEditForm(false)
            await fetchProfile()
        } catch (err) {
            console.error(err)
            setErrors({
                submit: err instanceof Error ? err.message : "Failed to update profile. Please try again."
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            {showConfirmation && (
                <ConfirmationDialog
                    title="Update Profile?"
                    message="You're about to save changes to your profile. This action cannot be undone."
                    confirmText="Save Changes"
                    cancelText="Cancel"
                    onConfirm={confirmSubmit}
                    onCancel={() => setShowConfirmation(false)}
                    isLoading={isSubmitting}
                />
            )}

            {isSubmitting && <OperationLoadingDialog message="Updating your profile..." />}

            <div className="mx-20 my-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
                <aside className="w-5/6 space-y-8 mx-auto lg:col-span-4">
                    <div className="bg-white p-6 rounded-2xl shadow-xl shadow-stone-200/50 sticky top-32">
                        <h3 className="text-lg font-black mb-6">Profile Photo</h3>

                        <div className="relative group mx-auto w-48 h-48 mb-2">
                            <div className="mx-auto relative size-40 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden">

                                {preview
                                    ? <img alt="Profile" className="w-full h-full object-cover" src={preview} />
                                    : profile.name?.charAt(0)}

                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                id="fileUpload"
                                className="hidden"
                                onChange={handleImageChange}
                                disabled={isSubmitting}
                            />

                            <button
                                onClick={() => document.getElementById("fileUpload")?.click()}
                                className="bg-slate-50/60 absolute bottom-10 right-5 w-12 h-12 bg-secondary text-white rounded-xl flex items-center justify-center shadow-lg shadow-secondary/40 hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                <span className="material-symbols-outlined">edit</span>
                            </button>
                        </div>

                        {errors.image && <p className="text-xs text-red-600 text-center mb-2">{errors.image}</p>}

                        <div className="space-y-4">
                            <p className="text-xs text-on-surface-variant text-center px-4 leading-relaxed">
                                Upload a high-resolution JPG or PNG. Minimum 400x400px.
                            </p>

                            {errors.submit && (
                                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                    <p className="text-xs text-red-700 dark:text-red-300">{errors.submit}</p>
                                </div>
                            )}

                            <div className="pt-4 flex flex-col gap-3">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full py-4 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? "Saving..." : "Save All Changes"}
                                </button>

                                <button
                                    className="w-full py-4 rounded-xl border-2 border-stone-100 text-stone-500 font-black uppercase tracking-widest text-xs hover:bg-red-200/70 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setShowEditForm(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                <section className="lg:col-span-8 space-y-12">
                    <div className="grid grid-cols-1 gap-8">
                        <div className="space-y-8">

                            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-stone-200/50">
                                <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-lg">01</span>
                                    Personal Details
                                </h2>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Full Name
                                                {errors.name && <span className="text-red-600 ml-2">{errors.name}</span>}
                                            </label>
                                            <input 
                                                name="name" 
                                                value={form.name} 
                                                onChange={handleChange}
                                                className={`w-full bg-surface-container-low border-none rounded-xl px-4 py-3 bg-gray-100 focus:ring-2 border-2 transition-all font-medium ${
                                                    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-primary focus:ring-primary'
                                                }`} 
                                                type="text"
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Username
                                                {errors.username && <span className="text-red-600 ml-2">{errors.username}</span>}
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold">@</span>
                                                <input 
                                                    name="username" 
                                                    value={form.username} 
                                                    onChange={handleChange}
                                                    className={`w-full bg-surface-container-low border-none rounded-xl pl-8 pr-4 py-3 bg-gray-100 focus:ring-2 focus:ring-secondary border-2 transition-all font-medium ${
                                                        errors.username ? 'border-red-500 focus:ring-red-500' : 'border-secondary'
                                                    }`} 
                                                    type="text"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Email Address
                                            {errors.email && <span className="text-red-600 ml-2">{errors.email}</span>}
                                        </label>
                                        <input 
                                            name="email" 
                                            value={form.email} 
                                            onChange={handleChange}
                                            className={`w-full bg-surface-container-low border-none rounded-xl px-4 py-3 bg-gray-100 focus:ring-2 border-2 transition-all font-medium ${
                                                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-primary focus:ring-primary'
                                            }`} 
                                            type="email"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                            </div>


                            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-stone-200/50">
                                <h2 className="text-2xl font-black mb-6 flex items-center gap-2">02 Security Settings</h2>

                                <input 
                                    name="currentPassword" 
                                    value={form.currentPassword} 
                                    onChange={handleChange} 
                                    type="password"
                                    className="w-full mb-4 px-4 py-3 bg-gray-100 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary transition-all" 
                                    placeholder="Current Password"
                                    disabled={isSubmitting}
                                />

                                <input 
                                    name="newPassword" 
                                    value={form.newPassword} 
                                    onChange={handleChange} 
                                    type="password"
                                    className="w-full mb-4 px-4 py-3 bg-gray-100 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary transition-all" 
                                    placeholder="New Password"
                                    disabled={isSubmitting}
                                />

                                <input 
                                    name="confirmPassword" 
                                    value={form.confirmPassword} 
                                    onChange={handleChange} 
                                    type="password"
                                    className="w-full px-4 py-3 bg-gray-100 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary transition-all" 
                                    placeholder="Confirm Password"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-stone-200/50">
                                <h2 className="text-2xl font-black mb-6 flex items-center gap-2">03 About You</h2>

                                <select
                                    name="country"
                                    value={form.country}
                                    onChange={handleChange}
                                    className="w-full mb-4 px-4 py-3 bg-gray-100 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary transition-all"
                                    disabled={isSubmitting}
                                >
                                    <option value="" disabled hidden>
                                        Select Country
                                    </option>
                                    <option value="Pakistan">Pakistan</option>
                                </select>

                                <select
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    className="w-full mb-4 px-4 py-3 bg-gray-100 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary transition-all"
                                    disabled={isSubmitting}
                                >
                                    <option value="" disabled hidden>
                                        Select City
                                    </option>
                                    <option value="Lahore">Lahore</option>
                                    <option value="Islamabad">Islamabad</option>
                                    <option value="Karachi">Karachi</option>
                                </select>

                                <textarea 
                                    name="bio" 
                                    value={form.bio} 
                                    placeholder="Your Culinary Bio...."
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 bg-gray-100 rounded-xl border-2 resize-none transition-all focus:ring-2 ${
                                        errors.bio ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary'
                                    }`}
                                    disabled={isSubmitting}
                                />
                                {errors.bio && <p className="text-xs text-red-600 mt-1">{errors.bio}</p>}
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
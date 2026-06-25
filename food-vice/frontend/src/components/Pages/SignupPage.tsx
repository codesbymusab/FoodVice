import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { signUpUser } from "../../apis/user";
import { validateSignupForm, hasErrors } from "../../utils/validators";
import { OperationLoadingDialog } from "../Shared/Feedback";

export function SignupPage() {

    const [emailInput, setEmailInput] = useState<string>("")
    const [passwordInput, setPasswordInput] = useState<string>("")
    const [confPasswordInput, setConfPasswordInput] = useState<string>("")
    const [nameInput, setNameInput] = useState<string>("")
    const [usernameInput, setUsernameInput] = useState<string>("")
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [isSigningUp, setIsSigningUp] = useState(false)

    
    const navigate = useNavigate()

    function onEmailInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEmailInput(event.target.value)
        if (errors.email) {
            setErrors({ ...errors, email: "" })
        }
    }

    function onPasswordInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPasswordInput(event.target.value)
        if (errors.password) {
            setErrors({ ...errors, password: "" })
        }
    }

    function onConfPasswordInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setConfPasswordInput(event.target.value)
        if (errors.confirmPassword) {
            setErrors({ ...errors, confirmPassword: "" })
        }
    }

     function onNameInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setNameInput(event.target.value)
        if (errors.name) {
            setErrors({ ...errors, name: "" })
        }
    }

     function onUsernameInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setUsernameInput(event.target.value)
        if (errors.username) {
            setErrors({ ...errors, username: "" })
        }
    }

    async function onSignUpClick() {
        // Validate form
        const validationErrors = validateSignupForm(
            nameInput,
            usernameInput,
            emailInput,
            passwordInput,
            confPasswordInput
        )
        if (hasErrors(validationErrors)) {
            setErrors(validationErrors)
            return
        }

        setIsSigningUp(true)
        try {
            const user = await signUpUser({
                name: nameInput,
                username: usernameInput,
                email: emailInput,
                password: passwordInput,
                confirmPassword: confPasswordInput,
            });

            if (user) {
                navigate('/home');
            }
        }
        catch (error) {
            console.error(error);
            setErrors({
                submit: error instanceof Error ? error.message : "Sign up failed. Please try again."
            })
        } finally {
            setIsSigningUp(false)
        }
    }


    return (

        <div className="relative h-screen w-screen flex overflow-hidden">

            {isSigningUp && <OperationLoadingDialog message="Creating your account..." />}

              <div className="hidden lg:block lg:w-3/5 relative left-diagonal-split bg-primary">
                <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-90" data-alt="Close-up of a vibrant gourmet burger and fries" style={ {backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuBpcmdJuSAsc7NrppCq1bhEVzA_F3-aZs-mvI-14BaiiQxAPRPLZa01mSKPz05xj06gk5YWh2ZWFHExUubG9qOLioscaMBlLPC16KyhQaIAzaD8dIoe8aN0-bpgNMpA8e1kofv43qSzFaRrcviuwsUT34HedTbZeLu2FXxqZwKGb8K_LXb_c0aSZv5M_XwPOyAeDzq_NgmsgfeA5LiKwH3vG5K2oopdbetCLy8KHATuv-IhC0pFFAyAMR69iOxzzFjj439eL0PNcmY;)"} }>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent"></div>

                <div className="text-white">
                    <div className="absolute top-6 left-10 z-10 flex items-center gap-3 mb-6">
                        <span className="material-symbols-outlined text-5xl" >restaurant</span>
                        <h1 className="text-6xl font-black tracking-tighter" >FoodVice</h1>
                    </div>

                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center items-start p-8 lg:p-16 bg-background-light dark:bg-background-dark overflow-y-auto">



                <div className="w-full max-w-md">

                    <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
                        <span className="material-symbols-outlined text-primary text-4xl" >restaurant</span>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100" >FoodVice</h2>
                    </div>


                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-3" >Get Started</h2>
                        <p className="text-slate-500 dark:text-slate-400" >Discover. Review. Share food you love.</p>
                    </div>

                    {/* Error alert */}
                    {errors.submit && (
                        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
                                <p className="text-sm text-red-700 dark:text-red-300">{errors.submit}</p>
                            </div>
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={async (e: React.SubmitEvent<HTMLFormElement>) => {
                        e.preventDefault(); 
                        await onSignUpClick();}}>

                        <div className="flex flex-row gap-4 ">
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" >Full Name</label>
                                <input 
                                    className={`w-full h-12 px-4 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                                        errors.name 
                                            ? "border-red-500 dark:border-red-400" 
                                            : "border-slate-200 dark:border-slate-700"
                                    }`}  
                                    value={nameInput} 
                                    onChange={onNameInputChange}
                                    disabled={isSigningUp}
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" >Username</label>
                                <input 
                                    className={`w-full h-12 px-4 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                                        errors.username 
                                            ? "border-red-500 dark:border-red-400" 
                                            : "border-slate-200 dark:border-slate-700"
                                    }`}  
                                    value={usernameInput} 
                                    onChange={onUsernameInputChange}
                                    disabled={isSigningUp}
                                />
                                {errors.username && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.username}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" >Email Address</label>
                            <input 
                                className={`w-full h-12 px-4 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                                    errors.email 
                                        ? "border-red-500 dark:border-red-400" 
                                        : "border-slate-200 dark:border-slate-700"
                                }`} 
                                placeholder="name@example.com" 
                                type="email" 
                                value={emailInput} 
                                onChange={onEmailInputChange}
                                disabled={isSigningUp}
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
                        </div>
                        <div>

                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" >Password</label>


                            <input 
                                className={`w-full h-12 px-4 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                                    errors.password 
                                        ? "border-red-500 dark:border-red-400" 
                                        : "border-slate-200 dark:border-slate-700"
                                }`} 
                                placeholder="••••••••" 
                                type="password" 
                                value={passwordInput} 
                                onChange={onPasswordInputChange}
                                disabled={isSigningUp}
                            />
                            {errors.password && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password}</p>}
                        </div>    
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" >Re-enter Password</label>

                            <input 
                                className={`w-full h-12 px-4 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                                    errors.confirmPassword 
                                        ? "border-red-500 dark:border-red-400" 
                                        : "border-slate-200 dark:border-slate-700"
                                }`} 
                                placeholder="••••••••" 
                                type="password" 
                                value={confPasswordInput} 
                                onChange={onConfPasswordInputChange}
                                disabled={isSigningUp}
                            />
                            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.confirmPassword}</p>}
                        </div>

                        
                        <div className="flex items-center">
                            <input className="rounded border-slate-300 text-primary focus:ring-primary" id="remember" type="checkbox" disabled={isSigningUp} />
                                <label className="ml-2 text-sm text-slate-600 dark:text-slate-400 font-medium" >I agree to <Link to="/" className="hover:cursor-pointer hover:text-cyan-600  text-accent-cyan underline">Terms & Conditions</Link></label>
                        </div>

                        <button 
                            className="w-full bg-primary hover:bg-orange-600 disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-4" 
                            type="submit"
                            disabled={isSigningUp}
                        >
                            {isSigningUp ? "Creating account..." : "Sign Up"}
                            {!isSigningUp && <span className="material-symbols-outlined text-xl" >arrow_forward</span>}
                        </button>
                    </form>
                   
                    
                    <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400" >
                        Already have an account?
                        <Link className="text-accent-cyan font-bold hover:underline" to="/login" >Sign in</Link>
                    </p>
                </div>
            </div>

          

        </div>


    );
}


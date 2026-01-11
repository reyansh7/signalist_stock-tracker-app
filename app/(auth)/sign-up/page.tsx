'use client';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import SelectField from '@/components/forms/SelectField';
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from '@/lib/constants';
import { CountrySelectField } from '@/components/forms/CountrySelect';
import FooterLink from '@/components/forms/FooterLink';
import { sign } from 'crypto';
import { useRouter } from 'next/navigation';
import { signUpWithEmail } from '@/lib/actions/auth.actions';
import { toast } from 'sonner';
import { error } from 'better-auth/api';
interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  country: string;
  investmentGoals: string;
  riskTolerance: string;
  preferredIndustry: string;
}

const SignUp = () => {
    const router=useRouter();
    const {
    register,
    handleSubmit,
    control,
    formState: { errors,isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
        fullName: '',
        email: '',
        password: '',
        country: 'US',
        investmentGoals: 'Growth',
        riskTolerance: 'Medium',
        preferredIndustry: 'Technology',        
  },
  mode: 'onBlur'},
  );
  const onSubmit: (data: SignUpFormData) => Promise<void> = async(data:SignUpFormData) => {
    try{
        const result = await signUpWithEmail(data);
        
        if(result?.success) {
            toast.success('Account created successfully!', {
                description: 'Welcome to Signalist. Redirecting to dashboard...'
            });
            // Small delay to show toast before redirect
            setTimeout(() => {
                router.push('/');
            }, 500);
        } else {
            toast.error('Sign-up failed', {
                description: result?.error || 'Failed to create an account.'
            });
        }
    } catch(e){
        console.error('Sign-up error:', e);
        toast.error('Sign-up failed',{
            description: e instanceof Error ? e.message : 'An unexpected error occurred.'
        });
    }
  }
  return (
    <>
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">Sign Up & Personalize</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <InputField
                name="fullName"
                label="Full Name"
                placeholder="John Doe"
                register={register}
                error={errors.fullName}
                validation={{ required: 'Full name is required',minLength: 2 }}
            />
            <InputField
                name="email"
                label="Email"
                placeholder="john.doe@example.com"
                register={register}
                error={errors.email}
                validation={{ required: 'Email is required',pattern: {value: /^\S+@\S+$/i,message: 'Invalid email address'} }}
            />
            <InputField
                name="password"
                label="Password"
                placeholder="Enter a strong password"
                type="password"
                register={register}
                error={errors.password}
                validation={{ required: 'Password is required',minLength: 8 }}
            />
            <CountrySelectField
                name="country"
                label="Country"
                control={control}
                error={errors.country}
                required
            />
            <SelectField 
                name="investmentGoals"
                label="Investment Goals"
                placeholder="Select your investment goals"
                options={INVESTMENT_GOALS}
                control={control}
                error={errors.investmentGoals}
                required
            />
            <SelectField 
                name="riskTolerance"
                label="Risk Tolerance"
                placeholder="Select your risk tolerance"
                options={RISK_TOLERANCE_OPTIONS}
                control={control}
                error={errors.riskTolerance}
                required
            />
            <SelectField 
                name="preferredIndustry"
                label="Preferred Industry"
                placeholder="Select your preferred industry"
                options={PREFERRED_INDUSTRIES}
                control={control}
                error={errors.preferredIndustry}
                required
            />
            
            <Button type="submit" disabled={isSubmitting} className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold w-full mt-5">
                {isSubmitting ? 'Creating Account' : 'Start Your Investing Journey'}
            </Button>
            <FooterLink text="Already have an account?" linkText="Sign In" href="/sign-in" />
        </form>
    </>
  )
}

export default SignUp
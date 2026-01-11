'use client';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import SelectField from '@/components/forms/SelectField';
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from '@/lib/constants';
import { CountrySelectField } from '@/components/forms/CountrySelect';
import FooterLink from '@/components/forms/FooterLink';
import { signInWithEmail } from '@/lib/actions/auth.actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
interface SignInFormData {
  fullName: string;
  email: string;
  password: string;
  country: string;
  investmentGoals: string;
  riskTolerance: string;
  preferredIndustry: string;
}

const SignIn = () => {
    const router=useRouter();
    const {
    register,
    handleSubmit,
    control,
    formState: { errors,isSubmitting },
  } = useForm<SignInFormData>({
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
  const onSubmit: (data: SignInFormData) => Promise<void> = async(data:SignInFormData) => {
    try{
        const result = await signInWithEmail(data);
        
        if(result?.success) {
            toast.success('Signed in successfully!', {
                description: 'Welcome to Signalist. Redirecting to dashboard...'
            });
            // Small delay to show toast before redirect
            setTimeout(() => {
                router.push('/');
            }, 500);
        } else {
            toast.error('Sign-in failed', {
                description: result?.error || 'Failed to sign in.'
            });
        }
    } catch(e){
        console.error('Sign-in error:', e);
        toast.error('Sign-in failed',{
            description: e instanceof Error ? e.message : 'An unexpected error occurred.'
        });
    }
  }
  return (
    <>
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">Welcome Back</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            
            <Button type="submit" disabled={isSubmitting} className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold w-full mt-5">
                {isSubmitting ? 'Creating Account' : 'Start Your Investing Journey'}
            </Button>
            <FooterLink text="Don't have an Account?" linkText="Create an Account" href="/sign-up" />
        </form>
    </>
  )
}

export default SignIn
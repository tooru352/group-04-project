import type { LoginRequest } from './types';

type LoginFormProps = {
    onSubmit?: (payload: LoginRequest) => void;
};

export default function LoginForm({ onSubmit }: LoginFormProps) {
    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                const form = event.currentTarget;
                const payload: LoginRequest = {
                    email: (form.elements.namedItem('email') as HTMLInputElement)?.value ?? '',
                    password: (form.elements.namedItem('password') as HTMLInputElement)?.value ?? '',
                };
                onSubmit?.(payload);
            }}
        >
            <label>
                Email
                <input name="email" type="email" placeholder="student@example.com" />
            </label>
            <label>
                Password
                <input name="password" type="password" placeholder="••••••••" />
            </label>
            <button type="submit">Continue</button>
        </form>
    );
}
